import { AppError } from './app-error';

export const ROLES_USUARIO = ['Administrador', 'Mozo', 'Cocinero'] as const;
export type RolUsuario = typeof ROLES_USUARIO[number];

export const ESTADOS_DETALLE = ['Pendiente', 'En_Preparacion', 'Finalizada'] as const;
export type EstadoDetalle = typeof ESTADOS_DETALLE[number];

export const TIPOS_PRODUCTO = ['Plato', 'Bebida'] as const;
export const TIPOS_PAGO = ['Efectivo', 'Transferencia', 'Tarjeta'] as const;
export const ESTADOS_MESA = ['Libre', 'Ocupada', 'Reservada'] as const;
export const ESTADOS_RESERVA = ['Confirmada', 'Cancelada'] as const;
export const ESTADOS_COMANDA = ['Abierta', 'Pagada', 'Cancelada'] as const;

export function parsePositiveId(value: unknown, field: string): number {
    const id = Number(value);

    if (!Number.isInteger(id) || id <= 0) {
        throw new AppError(`El campo '${field}' debe ser un número entero positivo.`);
    }

    return id;
}

// Igual que parsePositiveId, pero con un nombre más claro para cantidades y capacidades.
export function parsePositiveInt(value: unknown, field: string): number {
    return parsePositiveId(value, field);
}

export function parsePositiveNumber(value: unknown, field: string): number {
    const numero = Number(value);

    if (!Number.isFinite(numero) || numero <= 0) {
        throw new AppError(`El campo '${field}' debe ser un número mayor a 0.`);
    }

    return numero;
}

export function parseFecha(value: unknown, field: string): Date {
    if (typeof value !== 'string' || value.trim() === '') {
        throw new AppError(`El campo '${field}' es obligatorio.`);
    }

    const fecha = new Date(value);
    if (isNaN(fecha.getTime())) {
        throw new AppError(`El campo '${field}' no tiene una fecha válida.`);
    }

    return fecha;
}

// Valida que el valor sea una de las opciones permitidas (sirve para los enums de Prisma).
export function parseOpcion<T extends string>(value: unknown, opciones: readonly T[], field: string): T {
    if (typeof value !== 'string' || !opciones.includes(value as T)) {
        throw new AppError(`El campo '${field}' debe ser uno de: ${opciones.join(', ')}.`);
    }

    return value as T;
}

export function requireText(value: unknown, field: string, minLength = 1): string {
    if (typeof value !== 'string') {
        throw new AppError(`El campo '${field}' es obligatorio y debe ser texto.`);
    }

    const text = value.trim();
    if (text.length < minLength) {
        throw new AppError(`El campo '${field}' debe tener al menos ${minLength} caracteres.`);
    }

    return text;
}

export function parseEmail(value: unknown): string {
    const email = requireText(value, 'email').toLowerCase();
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!validEmail.test(email)) {
        throw new AppError('El campo \'email\' no tiene un formato válido.');
    }

    return email;
}

export function parseRol(value: unknown): RolUsuario {
    if (typeof value !== 'string' || !ROLES_USUARIO.includes(value as RolUsuario)) {
        throw new AppError(`El campo 'rol' debe ser uno de: ${ROLES_USUARIO.join(', ')}.`);
    }

    return value as RolUsuario;
}

export function parseEstadoDetalle(value: unknown): EstadoDetalle {
    if (typeof value !== 'string' || !ESTADOS_DETALLE.includes(value as EstadoDetalle)) {
        throw new AppError(`El campo 'estado' debe ser uno de: ${ESTADOS_DETALLE.join(', ')}.`);
    }

    return value as EstadoDetalle;
}

export function isPlainObject(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}
