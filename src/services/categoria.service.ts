import { CategoriaRepository } from '../repositories/categoria.repository';

const repository = new CategoriaRepository();

export class CategoriaService {

    async getAll() {
        return  await repository.findAll();
    }

    async create(nombre: string) {
        const existe = await repository.findByNombre(nombre)
        if(existe){
            throw new Error(`Ya existe una categoría con el nombre "${nombre}".`);
        }
        return await repository.create(nombre);
    }

    async delete(id: number) {
        const existe = await repository.findById(id)
        if(!existe){
            throw new Error(`No existe una categoría con ese id "${id}".`);
        }
        if (existe.productos && existe.productos.length > 0) {
            throw new Error("No se puede eliminar la categoría porque tiene productos asociados.");
        }
        return await repository.delete(id);
    }

    async update(id: number, nombre: string) {

        const existe = await repository.findById(id)

        if(!existe){
            throw new Error(`No existe una categoría con ese id "${id}".`);
        }

        const existeNombre = await repository.findByNombre(nombre)

        if(existeNombre){
            throw new Error(`Ya existe una categoría con ese nombre "${nombre}".`);
        }
        
        return await repository.update(id, nombre);
    }
}