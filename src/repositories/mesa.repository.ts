import prisma from '../config/db';
import type { estado_mesa } from '../generated/enums';

export class MesaRepository {
    // Si viene un estado, filtra por ese estado; si no, trae todas.
    async findAll(estado?: estado_mesa) {
        return await prisma.mesa.findMany({
            where: estado ? { estado } : {},
            orderBy: { id: 'asc' }
        });
    }

    async findById(id: number) {
        return await prisma.mesa.findUnique({
            where: { id }
        });
    }

    // Detalle de una mesa: su comanda abierta (si tiene) y sus próximas reservas confirmadas.
    async findDetalle(id: number) {
        return await prisma.mesa.findUnique({
            where: { id },
            include: {
                comandas: {
                    where: { estado: 'Abierta' },
                    include: {
                        mozo: { select: { id: true, nombre: true } },
                        detalles_comandas: {
                            include: { producto: { select: { id: true, nombre: true } } }
                        }
                    }
                },
                reservas: {
                    where: { estado: 'Confirmada', fecha: { gte: new Date() } },
                    orderBy: { fecha: 'asc' }
                }
            }
        });
    }

    // Mesas con lugar suficiente y sin reservas confirmadas entre "desde" y "hasta".
    async findDisponibles(personas: number, desde: Date, hasta: Date) {
        return await prisma.mesa.findMany({
            where: {
                capacidad: { gte: personas },
                reservas: {
                    none: {
                        estado: 'Confirmada',
                        fecha: { gt: desde, lt: hasta }
                    }
                }
            },
            orderBy: { capacidad: 'asc' }
        });
    }

    async create(capacidad: number) {
        return await prisma.mesa.create({
            data: {
                capacidad,
                estado: 'Libre'
            }
        });
    }

    async update(id: number, capacidad: number, estado: estado_mesa) {
        return await prisma.mesa.update({
            where: { id },
            data: {
                capacidad,
                estado
            }
        });
    }

    async updateEstado(id: number, estado: estado_mesa) {
        return await prisma.mesa.update({
            where: { id },
            data: { estado }
        });
    }

    async countComandas(id: number) {
        return await prisma.comanda.count({ where: { id_mesa: id } });
    }

    async countComandasAbiertas(id: number) {
        return await prisma.comanda.count({ where: { id_mesa: id, estado: 'Abierta' } });
    }

    async countReservas(id: number) {
        return await prisma.reserva.count({ where: { id_mesa: id } });
    }

    async delete(id: number) {
        return await prisma.mesa.delete({
            where: { id }
        });
    }
}
