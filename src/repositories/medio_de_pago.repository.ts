import prisma from "../config/db"; //Llama a la base de datos a traves de prisma

export class medio_pagoRepository {
    async get(id : number) {
        return await prisma.medio_de_pago.findUnique({ where: { id } });
    }

}   