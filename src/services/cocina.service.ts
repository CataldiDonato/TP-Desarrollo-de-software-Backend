import { CocinaRepository } from '../repositories/cocina.repository';
import { AppError } from '../utils/app-error';
import {
    isPlainObject,
    parseEstadoDetalle,
    parsePositiveId,
    type EstadoDetalle
} from '../utils/validation';

const repository = new CocinaRepository();

export class CocinaService {
    async getPedidosActivos() {
        const pedidos = await repository.findPedidosActivos();
        const priority: Record<EstadoDetalle, number> = {
            Pendiente: 0,
            En_Preparacion: 1,
            Finalizada: 2
        };

        return pedidos
            .sort((a, b) => priority[a.estado as EstadoDetalle] - priority[b.estado as EstadoDetalle])
            .map((pedido) => ({
                idComanda: pedido.id_comanda,
                idProducto: pedido.id_producto,
                cantidad: pedido.cantidad,
                estado: pedido.estado,
                producto: pedido.producto,
                comanda: pedido.comanda,
                cocinero: pedido.cocinero
            }));
    }

    async actualizarEstado(input: unknown) {
        if (!isPlainObject(input)) {
            throw new AppError('El cuerpo de la solicitud debe ser un objeto JSON.');
        }

        const idComanda = parsePositiveId(input.id_comanda, 'id_comanda');
        const idProducto = parsePositiveId(input.id_producto, 'id_producto');
        const nuevoEstado = parseEstadoDetalle(input.estado);
        const idCocinero = input.id_cocinero === undefined
            ? undefined
            : parsePositiveId(input.id_cocinero, 'id_cocinero');

        const detalle = await repository.findDetalle(idComanda, idProducto);
        if (!detalle) {
            throw new AppError('No existe ese ítem dentro de la comanda indicada.', 404);
        }

        if (detalle.comanda.estado !== 'Abierta') {
            throw new AppError('No se puede modificar Cocina porque la comanda está pagada o cancelada.', 409);
        }

        const estadoActual = detalle.estado as EstadoDetalle;
        if (estadoActual === 'Pendiente') {
            return this.iniciarPreparacion(idComanda, idProducto, nuevoEstado, idCocinero);
        }

        if (estadoActual === 'En_Preparacion') {
            return this.finalizarPreparacion(idComanda, idProducto, nuevoEstado, idCocinero, detalle.id_cocinero);
        }

        throw new AppError('El plato ya fue finalizado y no admite más cambios de estado.', 409);
    }

    private async iniciarPreparacion(
        idComanda: number,
        idProducto: number,
        nuevoEstado: EstadoDetalle,
        idCocinero: number | undefined
    ) {
        if (nuevoEstado !== 'En_Preparacion') {
            throw new AppError('Un pedido pendiente solo puede pasar a En_Preparacion.', 409);
        }

        if (!idCocinero) {
            throw new AppError('Para iniciar la preparación debés indicar id_cocinero.');
        }

        const cocinero = await repository.findCocinero(idCocinero);
        if (!cocinero || cocinero.rol !== 'Cocinero') {
            throw new AppError('El usuario indicado no existe o no tiene rol Cocinero.', 400);
        }

        const result = await repository.updateEstadoIfCurrent(
            idComanda,
            idProducto,
            'Pendiente',
            'En_Preparacion',
            idCocinero
        );

        if (result.count === 0) {
            throw new AppError('El pedido ya fue actualizado por otro cocinero. Actualizá la pantalla e intentá otra vez.', 409);
        }

        return this.getDetalleActualizado(idComanda, idProducto);
    }

    private async finalizarPreparacion(
        idComanda: number,
        idProducto: number,
        nuevoEstado: EstadoDetalle,
        idCocinero: number | undefined,
        idCocineroAsignado: number | null
    ) {
        if (nuevoEstado !== 'Finalizada') {
            throw new AppError('Un pedido en preparación solo puede pasar a Finalizada.', 409);
        }

        if (!idCocinero || idCocinero !== idCocineroAsignado) {
            throw new AppError('Solo el cocinero que tomó el pedido puede finalizarlo.', 403);
        }

        const result = await repository.updateEstadoIfCurrent(
            idComanda,
            idProducto,
            'En_Preparacion',
            'Finalizada'
        );

        if (result.count === 0) {
            throw new AppError('El pedido ya fue actualizado por otro usuario. Actualizá la pantalla e intentá otra vez.', 409);
        }

        return this.getDetalleActualizado(idComanda, idProducto);
    }

    private async getDetalleActualizado(idComanda: number, idProducto: number) {
        const detalle = await repository.findDetalle(idComanda, idProducto);

        if (!detalle) {
            throw new AppError('No se pudo recuperar el pedido actualizado.', 500);
        }

        return {
            idComanda: detalle.id_comanda,
            idProducto: detalle.id_producto,
            cantidad: detalle.cantidad,
            estado: detalle.estado,
            producto: detalle.producto,
            comanda: detalle.comanda,
            cocinero: detalle.cocinero
        };
    }
}
