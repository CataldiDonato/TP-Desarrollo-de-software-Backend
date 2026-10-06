import prisma from "../config/db"; //Llama a la base de datos a traves de prisma

export class detalle_comandaRepository {
    async findById(id_comanda: number, id_producto: number) {
        return await prisma.detalle_comanda.findUnique({
            where: { id_comanda_id_producto: { id_comanda, id_producto } } // se pasa la id y despues de como esta compuesta, ya que es una id doble (id_comanda y id_producto)
        });
    }

    // Todo producto nuevo entra a la cocina como "Pendiente".
    async create(id_comanda: number, id_producto: number, cantidad: number) {
        return await prisma.detalle_comanda.create({
            data: { id_comanda, id_producto, cantidad, estado: 'Pendiente' }
        });
    }

    async updateCantidad(id_comanda: number, id_producto: number, cantidad: number) {
        return await prisma.detalle_comanda.update({
            where: { id_comanda_id_producto: { id_comanda, id_producto } },
            data: { cantidad }
        });
    }

    async delete(id_comanda: number, id_producto: number) {
        return await prisma.detalle_comanda.delete({
            where: { id_comanda_id_producto: { id_comanda, id_producto } }
        });
    }
}
