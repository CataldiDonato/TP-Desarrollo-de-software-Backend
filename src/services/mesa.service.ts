import {estado_mesa} from '../generated/enums';
import {MesaRepository} from '../repositories/mesa.repository'; 

const repository_mesa = new MesaRepository();


export class MesaService {


    async getAll() {
        return await repository_mesa.findAll();
    }



    async getByEstado(estado: estado_mesa) {
        return await repository_mesa.findByEstado(estado);
    }

    async create(capacidad: number) {
        if (capacidad <= 0) {
            throw new Error(`La capacidad de la mesa debe ser mayor a 0.`);
        }
        return await repository_mesa.create(capacidad);
    }
    




    async update(id: number, capacidad: number, estado: estado_mesa) {
        const mesa = await repository_mesa.findById(id);
        if (!mesa) {
            throw new Error(`Mesa con ID ${id} no encontrada.`);
        }
        return await repository_mesa.update(id, capacidad, estado);
    }


    async delete(id: number) {
        const mesa = await repository_mesa.findById(id);
        if (!mesa) {
            throw new Error(`Mesa con ID ${id} no encontrada.`);
        }
        return await repository_mesa.delete(id);
    }

}    