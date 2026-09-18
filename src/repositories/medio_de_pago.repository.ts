import prisma from "../config/db";

export class medio_pagoRepository {
    async get(id: number) {
        return await prisma.medio_de_pago.findUnique({ where: { id } });
    }

    async findAll() {
        return await prisma.medio_de_pago.findMany();
    }
}
