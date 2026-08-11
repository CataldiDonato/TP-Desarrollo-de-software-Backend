import { estado_comanda } from "../generated/client";
import prisma from "../config/db"; //Llama a la base de datos a traves de prisma

export class comandaRepository {
    async findAll() {
        return await prisma.comanda.findMany();
    }

    async create(id_mesa: number, id_mozo: number) {
        return await prisma.comanda.create({data: {fecha: new Date(), id_mesa, id_mozo}});
    }

    async update(id: number, estado: estado_comanda, id_medio_pago: number) {
        return await prisma.comanda.update({
            where: { id },
            data: { estado, id_medio_pago }
        });
    }
}
