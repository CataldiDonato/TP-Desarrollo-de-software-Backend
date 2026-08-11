import {estado_detalle_comanda} from "../generated/client";
import prisma from "../config/db"; //Llama a la base de datos a traves de prisma

export class detalle_comandaRepository {
    async create(cantidad: number, estado: estado_detalle_comanda, id_comanda: number, id_producto: number, id_cocinero: number) {
        return await prisma.detalle_comanda.create({data: {cantidad, estado, id_comanda, id_producto, id_cocinero}});
    }

    async update(id_comanda: number, id_producto: number, cantidad: number, estado: estado_detalle_comanda) {
        return await prisma.detalle_comanda.update({
            where: { id_comanda_id_producto: { id_comanda, id_producto }}, // se pasa la id y despues de como esta compuesta, ya que es una id doble (id_comanda y id_producto)
            data: { cantidad, estado }
        });
    }

    async delete(id_comanda: number, id_producto: number) {
        return await prisma.detalle_comanda.delete({
            where: { id_comanda_id_producto: { id_comanda, id_producto }} // se pasa la id y despues de como esta compuesta, ya que es una id doble (id_comanda y id_producto)
        });
    }
}
