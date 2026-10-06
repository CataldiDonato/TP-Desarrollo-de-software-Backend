import prisma from "../config/db";
import type { tipo_pago } from "../generated/enums";

export class medio_pagoRepository {
    async get(id: number) {
        return await prisma.medio_de_pago.findUnique({ where: { id } });
    }

    async findAll() {
        return await prisma.medio_de_pago.findMany({ orderBy: { id: 'asc' } });
    }

    async findByTipo(tipo: tipo_pago) {
        return await prisma.medio_de_pago.findFirst({ where: { tipo } });
    }

    async create(tipo: tipo_pago) {
        return await prisma.medio_de_pago.create({ data: { tipo } });
    }

    async update(id: number, tipo: tipo_pago) {
        return await prisma.medio_de_pago.update({ where: { id }, data: { tipo } });
    }

    async delete(id: number) {
        return await prisma.medio_de_pago.delete({ where: { id } });
    }

    async countComandas(id: number) {
        return await prisma.comanda.count({ where: { id_medio_pago: id } });
    }
}
