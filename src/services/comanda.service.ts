import { estado_comanda } from "../generated/browser";
import {comandaRepository} from "../repositories/comanda.repository"; //Llama a la clase comandaRepository para poder usar sus metodos

const repository = new comandaRepository(); //Creo una instancia de la clase comandaRepository para poder usar sus metodos

export class comandaService {

    async findAll() {
        return await repository.findAll();
    }

    async create(id_mesa: number, id_mozo: number) {
        return await repository.create(id_mesa, id_mozo);
    }

    async update(id: number, estado: estado_comanda, id_medio_pago: number) {
        return await repository.update(id, estado, id_medio_pago);
    }
}