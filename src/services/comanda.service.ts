import { comandaRepository } from "../repositories/comanda.repository"; //Llama a la clase comandaRepository para poder usar sus metodos
import { MesaRepository } from "../repositories/mesa.repository";
import { ProductoRepository } from "../repositories/productos.repository";
import { medio_pagoRepository } from "../repositories/medio_de_pago.repository";
import { AppError } from "../utils/app-error";
import { precioVigente } from "../utils/precios";
import {
    ESTADOS_COMANDA,
    isPlainObject,
    parseOpcion,
    parsePositiveId,
    parsePositiveInt
} from "../utils/validation";

const repository = new comandaRepository(); //Creo una instancia de la clase comandaRepository para poder usar sus metodos
const repositoryMesa = new MesaRepository();
const repositoryProducto = new ProductoRepository();
const repositoryMedioPago = new medio_pagoRepository();

// Forma de la comanda tal como la devuelve el repository (con mozo, medio de pago y detalles).
interface ComandaCompleta {
    id: number;
    fecha: Date;
    estado: string;
    id_mesa: number;
    mozo: { id: number; nombre: string };
    medio_pago: { id: number; tipo: string } | null;
    detalles_comandas: {
        id_producto: number;
        cantidad: number;
        estado: string;
        producto: { nombre: string; precios: { precio: unknown; fecha_desde: Date }[] };
    }[];
}

export class comandaService {

    async findAll(estado?: unknown) {
        const filtro = estado === undefined || estado === ''
            ? undefined
            : parseOpcion(estado, ESTADOS_COMANDA, 'estado');

        const comandas = await repository.findAll(filtro);
        return comandas.map((comanda) => this.armarRespuesta(comanda));
    }

    async findById(id: number) {
        const comanda = await repository.findById(id);
        if (!comanda) {
            throw new AppError(`No existe una comanda con el id ${id}.`, 404);
        }
        return this.armarRespuesta(comanda);
    }

    // El mozo es el usuario logueado (sale del token, no del body).
    async create(input: unknown, id_mozo: number) {
        if (!isPlainObject(input)) {
            throw new AppError('El cuerpo de la solicitud debe ser un objeto JSON.');
        }

        const id_mesa = parsePositiveId(input.id_mesa, 'id_mesa');
        const detalles = await this.validarDetalles(input.detalles);

        const mesa = await repositoryMesa.findById(id_mesa);
        if (!mesa) {
            throw new AppError(`No existe una mesa con el id ${id_mesa}.`, 404);
        }

        const abiertas = await repository.countAbiertasDeMesa(id_mesa);
        if (abiertas > 0) {
            throw new AppError(`La mesa ${id_mesa} ya tiene una comanda abierta.`, 409);
        }

        return await repository.create(id_mesa, id_mozo, detalles);
    }

    // Cierra una comanda: "Pagada" (con medio de pago) o "Cancelada". En los dos casos se libera la mesa.
    async cambiarEstado(id: number, input: unknown) {
        if (!isPlainObject(input)) {
            throw new AppError('El cuerpo de la solicitud debe ser un objeto JSON.');
        }

        const comanda = await repository.findById(id);
        if (!comanda) {
            throw new AppError(`No existe una comanda con el id ${id}.`, 404);
        }
        if (comanda.estado !== 'Abierta') {
            throw new AppError('La comanda ya está cerrada.', 409);
        }

        const estado = parseOpcion(input.estado, ESTADOS_COMANDA, 'estado');
        if (estado === 'Abierta') {
            throw new AppError('La comanda ya está abierta. Los estados posibles son Pagada o Cancelada.');
        }

        let id_medio_pago: number | null = null;
        if (estado === 'Pagada') {
            if (comanda.detalles_comandas.length === 0) {
                throw new AppError('No se puede cobrar una comanda sin productos. Cancelala.');
            }
            id_medio_pago = parsePositiveId(input.id_medio_pago, 'id_medio_pago');
            const medio = await repositoryMedioPago.get(id_medio_pago);
            if (!medio) {
                throw new AppError(`No existe un medio de pago con el id ${id_medio_pago}.`, 404);
            }
        }

        return await repository.cerrar(id, comanda.id_mesa, estado, id_medio_pago);
    }

    // "detalles" es opcional. Si viene, debe ser una lista de { id_producto, cantidad }.
    private async validarDetalles(detalles: unknown) {
        if (detalles === undefined) {
            return [];
        }
        if (!Array.isArray(detalles)) {
            throw new AppError("El campo 'detalles' debe ser una lista.");
        }

        const resultado: { id_producto: number; cantidad: number }[] = [];
        for (const detalle of detalles) {
            if (!isPlainObject(detalle)) {
                throw new AppError("Cada detalle debe tener 'id_producto' y 'cantidad'.");
            }
            const id_producto = parsePositiveId(detalle.id_producto, 'id_producto');
            const cantidad = parsePositiveInt(detalle.cantidad, 'cantidad');

            if (resultado.some((item) => item.id_producto === id_producto)) {
                throw new AppError('Hay productos repetidos en la comanda. Sumá las cantidades en un solo ítem.');
            }
            const producto = await repositoryProducto.findById(id_producto);
            if (!producto) {
                throw new AppError(`No existe un producto con el id ${id_producto}.`, 404);
            }

            resultado.push({ id_producto, cantidad });
        }
        return resultado;
    }

    // Arma la respuesta para el frontend: agrega el precio de cada ítem y el total de la comanda.
    private armarRespuesta(comanda: ComandaCompleta) {
        const detalles = comanda.detalles_comandas.map((detalle) => {
            const precio = precioVigente(detalle.producto.precios, comanda.fecha) ?? 0;
            return {
                id_producto: detalle.id_producto,
                nombre_producto: detalle.producto.nombre,
                cantidad: detalle.cantidad,
                estado: detalle.estado,
                precio,
                subtotal: precio * detalle.cantidad
            };
        });

        const total = detalles.reduce((suma, detalle) => suma + detalle.subtotal, 0);

        return {
            id: comanda.id,
            fecha: comanda.fecha,
            estado: comanda.estado,
            id_mesa: comanda.id_mesa,
            mozo: comanda.mozo,
            medio_pago: comanda.medio_pago,
            detalles,
            total
        };
    }
}
