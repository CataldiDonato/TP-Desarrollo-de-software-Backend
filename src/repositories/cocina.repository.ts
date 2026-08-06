import prisma from '../config/db';
import type { EstadoDetalle } from '../utils/validation';

export class CocinaRepository {
    async findPedidosActivos() {
        return prisma.detalle_comanda.findMany({
            where: {
                estado: { in: ['Pendiente', 'En_Preparacion'] },
                comanda: { estado: 'Abierta' }
            },
            include: {
                producto: {
                    select: { id: true, nombre: true, tipo: true }
                },
                comanda: {
                    select: {
                        id: true,
                        fecha: true,
                        id_mesa: true,
                        mesa: { select: { capacidad: true } }
                    }
                },
                cocinero: {
                    select: { id: true, nombre: true }
                }
            },
            orderBy: { id_comanda: 'asc' }
        });
    }

    async findDetalle(idComanda: number, idProducto: number) {
        return prisma.detalle_comanda.findFirst({
            where: {
                id_comanda: idComanda,
                id_producto: idProducto
            },
            include: {
                comanda: {
                    select: { id: true, estado: true, id_mesa: true, fecha: true }
                },
                producto: {
                    select: { id: true, nombre: true, tipo: true }
                },
                cocinero: {
                    select: { id: true, nombre: true, rol: true }
                }
            }
        });
    }

    async findCocinero(id: number) {
        return prisma.usuario.findUnique({
            where: { id },
            select: { id: true, nombre: true, rol: true }
        });
    }

    async updateEstadoIfCurrent(
        idComanda: number,
        idProducto: number,
        estadoActual: EstadoDetalle,
        nuevoEstado: EstadoDetalle,
        idCocinero?: number
    ) {
        return prisma.detalle_comanda.updateMany({
            where: {
                id_comanda: idComanda,
                id_producto: idProducto,
                estado: estadoActual
            },
            data: {
                estado: nuevoEstado,
                ...(idCocinero !== undefined ? { id_cocinero: idCocinero } : {})
            }
        });
    }
}
