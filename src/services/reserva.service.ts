import { ReservaRepository } from '../repositories/reserva.repository';
import { MesaRepository } from '../repositories/mesa.repository';
import { rangoDeReserva } from './mesa.service';
import { AppError } from '../utils/app-error';
import {
    ESTADOS_RESERVA,
    isPlainObject,
    parseFecha,
    parseOpcion,
    parsePositiveId,
    parsePositiveInt,
    requireText
} from '../utils/validation';

// dto para crear
export interface CreateReserva {
    fecha: Date;
    cantidad_personas: number;
    id_mesa: number;
    nombre_cliente: string;
    telefono_cliente: string;
}

// dto para actualizar (todos los campos son opcionales)
export interface UpdateReserva {
    fecha?: Date;
    cantidad_personas?: number;
    id_mesa?: number;
    nombre_cliente?: string;
    telefono_cliente?: string;
}

const repository_reserva = new ReservaRepository();
const repository_mesa = new MesaRepository();

export class ReservaService {

    // Filtros opcionales: ?cliente=juan y/o ?fecha=2026-10-10 (trae todo ese día).
    // Si no hay resultados devuelve una lista vacía, no un error.
    async getAll(cliente?: unknown, fecha?: unknown) {
        const textoCliente = typeof cliente === 'string' && cliente.trim() !== '' ? cliente.trim() : undefined;

        let desde: Date | undefined;
        let hasta: Date | undefined;
        if (typeof fecha === 'string' && fecha !== '') {
            // "2026-10-10T00:00" se interpreta en la hora local del servidor
            desde = parseFecha(`${fecha}T00:00`, 'fecha');
            hasta = new Date(desde);
            hasta.setDate(hasta.getDate() + 1);
        }

        return await repository_reserva.findAll(textoCliente, desde, hasta);
    }

    async create(input: unknown) {
        if (!isPlainObject(input)) {
            throw new AppError('El cuerpo de la solicitud debe ser un objeto JSON.');
        }

        const datos: CreateReserva = {
            fecha: parseFecha(input.fecha, 'fecha'),
            cantidad_personas: parsePositiveInt(input.cantidad_personas, 'cantidad_personas'),
            id_mesa: parsePositiveId(input.id_mesa, 'id_mesa'),
            nombre_cliente: requireText(input.nombre_cliente, 'nombre_cliente'),
            telefono_cliente: requireText(input.telefono_cliente, 'telefono_cliente')
        };

        if (datos.fecha < new Date()) {
            throw new AppError('No se puede reservar para una fecha que ya pasó.');
        }

        await this.validarMesa(datos.id_mesa, datos.cantidad_personas);
        await this.validarHorarioLibre(datos.id_mesa, datos.fecha);

        return await repository_reserva.create(datos);
    }

    async update(id: number, input: unknown) {
        if (!isPlainObject(input)) {
            throw new AppError('El cuerpo de la solicitud debe ser un objeto JSON.');
        }

        const reserva = await repository_reserva.findById(id);
        if (!reserva) {
            throw new AppError(`No existe una reserva con el id ${id}.`, 404);
        }

        // Solo se validan y actualizan los campos que vienen en el body.
        const datos: UpdateReserva = {};
        if (input.fecha !== undefined) datos.fecha = parseFecha(input.fecha, 'fecha');
        if (input.cantidad_personas !== undefined) datos.cantidad_personas = parsePositiveInt(input.cantidad_personas, 'cantidad_personas');
        if (input.id_mesa !== undefined) datos.id_mesa = parsePositiveId(input.id_mesa, 'id_mesa');
        if (input.nombre_cliente !== undefined) datos.nombre_cliente = requireText(input.nombre_cliente, 'nombre_cliente');
        if (input.telefono_cliente !== undefined) datos.telefono_cliente = requireText(input.telefono_cliente, 'telefono_cliente');

        if (datos.fecha && datos.fecha < new Date()) {
            throw new AppError('No se puede reservar para una fecha que ya pasó.');
        }

        // Para validar usamos el dato nuevo si vino, o el que ya tenía la reserva.
        const fecha = datos.fecha ?? reserva.fecha;
        const cantidad = datos.cantidad_personas ?? reserva.cantidad_personas;
        const id_mesa = datos.id_mesa ?? reserva.id_mesa;

        await this.validarMesa(id_mesa, cantidad);
        if (reserva.estado === 'Confirmada') {
            await this.validarHorarioLibre(id_mesa, fecha, id);
        }

        return await repository_reserva.update(id, datos);
    }

    async updateEstado(id: number, input: unknown) {
        if (!isPlainObject(input)) {
            throw new AppError('El cuerpo de la solicitud debe ser un objeto JSON.');
        }

        const reserva = await repository_reserva.findById(id);
        if (!reserva) {
            throw new AppError(`No existe una reserva con el id ${id}.`, 404);
        }

        const estado = parseOpcion(input.estado, ESTADOS_RESERVA, 'estado');

        if (estado === 'Cancelada') {
            // Para cancelar es obligatorio el motivo.
            const motivo = requireText(input.motivo_cancelacion, 'motivo_cancelacion');
            return await repository_reserva.updateEstado(id, estado, motivo);
        }

        // Si se vuelve a confirmar, hay que chequear que el horario siga libre y se borra el motivo viejo.
        await this.validarHorarioLibre(reserva.id_mesa, reserva.fecha, id);
        return await repository_reserva.updateEstado(id, estado, null);
    }

    async delete(id: number) {
        const reserva = await repository_reserva.findById(id);
        if (!reserva) {
            throw new AppError(`No existe una reserva con el id ${id}.`, 404);
        }

        return await repository_reserva.delete(id);
    }

    private async validarMesa(id_mesa: number, cantidad_personas: number) {
        const mesa = await repository_mesa.findById(id_mesa);
        if (!mesa) {
            throw new AppError(`No existe una mesa con el id ${id_mesa}.`, 404);
        }
        if (cantidad_personas > mesa.capacidad) {
            throw new AppError(`La mesa ${id_mesa} tiene lugar para ${mesa.capacidad} personas.`);
        }
    }

    // Una mesa no puede tener dos reservas confirmadas en horarios que se pisen.
    private async validarHorarioLibre(id_mesa: number, fecha: Date, excluirId?: number) {
        const { desde, hasta } = rangoDeReserva(fecha);
        const superpuestas = await repository_reserva.findSuperpuestas(id_mesa, desde, hasta, excluirId);

        if (superpuestas.length > 0) {
            throw new AppError(`La mesa ${id_mesa} ya tiene una reserva cerca de ese horario.`, 409);
        }
    }
}
