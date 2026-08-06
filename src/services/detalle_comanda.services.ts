import {estado_detalle_comanda} from "../generated/client";
import {detalle_comandaRepository} from "../repositories/detalle_comanda.repository"; //Llama a la clase detalle_comandaRepository para poder usar sus metodos

const repository = new detalle_comandaRepository(); //Creo una instancia de la clase detalle_comandaRepository para poder usar sus metodos 

export class detalle_comandaService {

    async create(cantidad: number, estado: estado_detalle_comanda, id_comanda: number, id_producto: number, id_cocinero: number) {
        return await repository.create(cantidad, estado, id_comanda, id_producto, id_cocinero);
    }

    async update(id_comanda: number, id_producto: number, cantidad: number, estado: estado_detalle_comanda) {
        return await repository.update(id_comanda, id_producto, cantidad, estado);
    }

    async delete(id_comanda: number, id_producto: number) {
        return await repository.delete(id_comanda, id_producto);
    }
}