import prisma from '../config/db';
import type { estado_reserva } from '../generated/enums';
import type { CreateReserva, UpdateReserva } from '../services/reserva.service';

export class ReservaRepository {
    // Los dos filtros son opcionales y se pueden combinar.
    async findAll(cliente?: string, desde?: Date, hasta?: Date) {
        return await prisma.reserva.findMany({
            where: {
                // contains + insensitive: busca coincidencias parciales sin importar mayúsculas
                nombre_cliente: cliente ? { contains: cliente, mode: 'insensitive' } : undefined,
                fecha: desde && hasta ? { gte: desde, lt: hasta } : undefined
            },
            orderBy: { fecha: 'asc' }
        });
    }

    async findById(id: number) {
        return await prisma.reserva.findUnique({
            where: { id }
        });
    }

    // Busca reservas confirmadas de la mesa que caigan entre "desde" y "hasta".
    // "excluirId" sirve al editar, para que la reserva no choque consigo misma.
    async findSuperpuestas(id_mesa: number, desde: Date, hasta: Date, excluirId?: number) {
        return await prisma.reserva.findMany({
            where: {
                id_mesa,
                estado: 'Confirmada',
                fecha: { gt: desde, lt: hasta },
                id: excluirId ? { not: excluirId } : undefined
            }
        });
    }

    async create(datos: CreateReserva) {
        return await prisma.reserva.create({
            data: {
                ...datos,
                estado: 'Confirmada'
            }
        });
    }

    async update(id: number, datos: UpdateReserva) {
        return await prisma.reserva.update({
            where: { id },
            data: datos
        });
    }

    // Método exclusivo para cambiar el estado (lo usa el endpoint PATCH /:id/estado).
    async updateEstado(id: number, estado: estado_reserva, motivo_cancelacion: string | null) {
        return await prisma.reserva.update({
            where: { id },
            data: {
                estado,
                motivo_cancelacion
            }
        });
    }

    async delete(id: number) {
        return await prisma.reserva.delete({
            where: { id }
        });
    }
}
