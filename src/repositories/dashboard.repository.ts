import prisma from '../config/db';

export class DashboardRepository {
    async getMetricas(inicioDelDia: Date, finDelDia: Date, desde: Date) {
        return Promise.all([
            prisma.mesa.count({
                where: {
                    comandas: {
                        some: { estado: 'Abierta' }
                    }
                }
            }),
            prisma.detalle_comanda.count({
                where: {
                    estado: { in: ['Pendiente', 'En_Preparacion'] },
                    comanda: { estado: 'Abierta' }
                }
            }),
            prisma.comanda.findMany({
                where: {
                    estado: 'Pagada',
                    fecha: {
                        gte: inicioDelDia,
                        lt: finDelDia
                    }
                },
                select: {
                    id: true,
                    fecha: true,
                    detalles_comandas: {
                        select: {
                            cantidad: true,
                            producto: {
                                select: {
                                    precios: {
                                        select: { precio: true, fecha_desde: true },
                                        orderBy: { fecha_desde: 'desc' }
                                    }
                                }
                            }
                        }
                    }
                }
            }),
            prisma.reserva.findMany({
                where: {
                    estado: 'Confirmada',
                    fecha: { gte: desde }
                },
                orderBy: { fecha: 'asc' },
                take: 5,
                select: {
                    id: true,
                    fecha: true,
                    nombre_cliente: true,
                    telefono_cliente: true,
                    mesas: {
                        select: { id: true, capacidad: true }
                    }
                }
            })
        ]);
    }
}
