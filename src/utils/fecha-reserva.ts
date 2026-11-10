import { DateTime } from 'luxon';
import { AppError } from './app-error';

const ZONA_RESTAURANTE = 'America/Argentina/Buenos_Aires';

// El contrato de reservas recibe instantes explícitos, nunca fechas locales ambiguas.
export function parseInstanteReserva(value: unknown): Date {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,9})?)?(?:Z|[+-]\d{2}:\d{2})$/i.test(value)) {
        throw new AppError("El campo 'fecha' debe ser una fecha y hora ISO con zona horaria.");
    }
    const fecha = DateTime.fromISO(value, { setZone: true });
    if (!fecha.isValid) throw new AppError("El campo 'fecha' no tiene una fecha válida.");
    return fecha.toJSDate();
}

export function rangoDiaReserva(value: unknown): { desde: Date; hasta: Date } {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        throw new AppError("El campo 'fecha' debe tener el formato AAAA-MM-DD.");
    }
    const inicio = DateTime.fromISO(value, { zone: ZONA_RESTAURANTE }).startOf('day');
    if (!inicio.isValid) throw new AppError("El campo 'fecha' no tiene una fecha válida.");
    return { desde: inicio.toJSDate(), hasta: inicio.plus({ days: 1 }).startOf('day').toJSDate() };
}
