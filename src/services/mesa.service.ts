import { MesaRepository } from '../repositories/mesa.repository';
import { AppError } from '../utils/app-error';
import {
    ESTADOS_MESA,
    isPlainObject,
    parseFecha,
    parseOpcion,
    parsePositiveInt
} from '../utils/validation';

// Cuánto dura una reserva. Se usa para saber si dos reservas de la misma mesa se pisan.
export const DURACION_RESERVA_HORAS = 2;

const repository_mesa = new MesaRepository();

export class MesaService {

    async getAll(estado?: unknown) {
        if (estado === undefined || estado === '') {
            return await repository_mesa.findAll();
        }
        return await repository_mesa.findAll(parseOpcion(estado, ESTADOS_MESA, 'estado'));
    }

    async getDetalle(id: number) {
        const mesa = await repository_mesa.findDetalle(id);
        if (!mesa) {
            throw new AppError(`No existe una mesa con el id ${id}.`, 404);
        }

        return {
            id: mesa.id,
            capacidad: mesa.capacidad,
            estado: mesa.estado,
            // Una mesa tiene como máximo una comanda abierta.
            comandaActiva: mesa.comandas.length > 0 ? mesa.comandas[0] : null,
            proximasReservas: mesa.reservas
        };
    }

    // Sin parámetros: mesas libres en este momento (para abrir una comanda).
    // Con fecha y personas: mesas sin reservas en ese horario y con lugar suficiente (para reservar).
    async getDisponibles(fecha?: unknown, personas?: unknown) {
        if (fecha === undefined && personas === undefined) {
            return await repository_mesa.findAll('Libre');
        }

        const fechaReserva = parseFecha(fecha, 'fecha');
        const cantidad = parsePositiveInt(personas, 'personas');
        const { desde, hasta } = rangoDeReserva(fechaReserva);

        return await repository_mesa.findDisponibles(cantidad, desde, hasta);
    }

    async create(input: unknown) {
        if (!isPlainObject(input)) {
            throw new AppError('El cuerpo de la solicitud debe ser un objeto JSON.');
        }
        const capacidad = parsePositiveInt(input.capacidad, 'capacidad');
        return await repository_mesa.create(capacidad);
    }

    async update(id: number, input: unknown) {
        if (!isPlainObject(input)) {
            throw new AppError('El cuerpo de la solicitud debe ser un objeto JSON.');
        }

        const mesa = await repository_mesa.findById(id);
        if (!mesa) {
            throw new AppError(`No existe una mesa con el id ${id}.`, 404);
        }

        const capacidad = parsePositiveInt(input.capacidad, 'capacidad');
        // Si no mandan estado, se conserva el actual.
        const estado = input.estado === undefined ? mesa.estado : parseOpcion(input.estado, ESTADOS_MESA, 'estado');

        if (estado !== mesa.estado) {
            // "Ocupada" lo manejan las comandas: se pone al abrir una y se saca al cerrarla.
            if (estado === 'Ocupada') {
                throw new AppError('Una mesa pasa a Ocupada sola cuando se abre una comanda.', 409);
            }
            const comandasAbiertas = await repository_mesa.countComandasAbiertas(id);
            if (comandasAbiertas > 0) {
                throw new AppError('La mesa tiene una comanda abierta. Cerrala antes de cambiar el estado.', 409);
            }
        }

        return await repository_mesa.update(id, capacidad, estado);
    }

    async delete(id: number) {
        const mesa = await repository_mesa.findById(id);
        if (!mesa) {
            throw new AppError(`No existe una mesa con el id ${id}.`, 404);
        }

        const comandas = await repository_mesa.countComandas(id);
        const reservas = await repository_mesa.countReservas(id);
        if (comandas > 0 || reservas > 0) {
            throw new AppError('No se puede eliminar la mesa porque tiene comandas o reservas asociadas.', 409);
        }

        return await repository_mesa.delete(id);
    }
}

// Dos reservas se pisan si están a menos de DURACION_RESERVA_HORAS una de otra.
export function rangoDeReserva(fecha: Date) {
    const duracion = DURACION_RESERVA_HORAS * 60 * 60 * 1000;
    return {
        desde: new Date(fecha.getTime() - duracion),
        hasta: new Date(fecha.getTime() + duracion)
    };
}
