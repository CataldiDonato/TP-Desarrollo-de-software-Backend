import { CategoriaRepository } from '../repositories/categoria.repository';

const repository = new CategoriaRepository();

export class CategoriaService {

    async getAll() {
        return  await repository.findAll();
    }

    async create(nombre: string) {
        
        if (!nombre || nombre.trim() === '') {
            throw new Error('El nombre obligatorio');
        }
        return await repository.create(nombre);
    }

    async delete(id: number) {
        if (!id || isNaN(id)) {
            throw new Error('El ID de la categoría debe ser un número válido');
        }
        return await repository.delete(id);
    }

    async update(id: number, nombre: string) {
        if (!nombre || nombre.trim() === '' || !id || isNaN(id)) {
            throw new Error('El id y el nombre son obligatorios');
        }
        return await repository.update(id, nombre);
    }
}