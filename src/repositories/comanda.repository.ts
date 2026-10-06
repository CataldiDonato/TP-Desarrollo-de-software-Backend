import type { estado_comanda } from "../generated/enums";
import prisma from "../config/db"; //Llama a la base de datos a traves de prisma

// Qué datos relacionados traemos junto con cada comanda (se usa en findAll y findById).
const incluirDatosComanda = {
    mozo: { select: { id: true, nombre: true } },
    medio_pago: true,
    detalles_comandas: {
        include: {
            producto: {
                select: {
                    id: true,
                    nombre: true,
                    precios: { orderBy: { fecha_desde: 'desc' } }
                }
            }
        }
    }
} as const;

export class comandaRepository {
    // Si viene un estado, filtra por ese estado; si no, trae todas.
    async findAll(estado?: estado_comanda) {
        return await prisma.comanda.findMany({
            where: estado ? { estado } : {},
            include: incluirDatosComanda,
            orderBy: { fecha: 'desc' }
        });
    }

    async findById(id: number) {
        return await prisma.comanda.findUnique({
            where: { id },
            include: incluirDatosComanda
        });
    }

    async countAbiertasDeMesa(id_mesa: number) {
        return await prisma.comanda.count({
            where: { id_mesa, estado: 'Abierta' }
        });
    }

    // Crea la comanda con sus productos y marca la mesa como Ocupada.
    // Va en una transacción: si algo falla, no se guarda nada.
    async create(id_mesa: number, id_mozo: number, detalles: { id_producto: number; cantidad: number }[]) {
        const [comanda] = await prisma.$transaction([
            prisma.comanda.create({
                data: {
                    fecha: new Date(),
                    id_mesa,
                    id_mozo,
                    detalles_comandas: {
                        create: detalles.map((detalle) => ({
                            id_producto: detalle.id_producto,
                            cantidad: detalle.cantidad,
                            estado: 'Pendiente' as const
                        }))
                    }
                }
            }),
            prisma.mesa.update({
                where: { id: id_mesa },
                data: { estado: 'Ocupada' }
            })
        ]);
        return comanda;
    }

    // Cierra la comanda (Pagada o Cancelada) y libera la mesa, todo en una transacción.
    async cerrar(id: number, id_mesa: number, estado: estado_comanda, id_medio_pago: number | null) {
        const [comanda] = await prisma.$transaction([
            prisma.comanda.update({
                where: { id },
                data: { estado, id_medio_pago }
            }),
            prisma.mesa.update({
                where: { id: id_mesa },
                data: { estado: 'Libre' }
            })
        ]);
        return comanda;
    }
}
