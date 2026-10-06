import { CategoriaRepository } from '../repositories/categoria.repository';
import { AppError } from '../utils/app-error';
import { isPlainObject, requireText } from '../utils/validation';

const repository = new CategoriaRepository();

export class CategoriaService {

    async getAll() {
        return await repository.findAll();
    }

    async create(input: unknown) {
        if (!isPlainObject(input)) {
            throw new AppError('El cuerpo de la solicitud debe ser un objeto JSON.');
        }
        const nombre = requireText(input.nombre, 'nombre');

        const existe = await repository.findByNombre(nombre);
        if (existe) {
            throw new AppError(`Ya existe una categoría con el nombre "${nombre}".`, 409);
        }
        return await repository.create(nombre);
    }

    async delete(id: number) {
        const existe = await repository.findById(id);
        if (!existe) {
            throw new AppError(`No existe una categoría con el id ${id}.`, 404);
        }
        if (existe.productos.length > 0) {
            throw new AppError('No se puede eliminar la categoría porque tiene productos asociados.', 409);
        }
        return await repository.delete(id);
    }

    async update(id: number, input: unknown) {
        if (!isPlainObject(input)) {
            throw new AppError('El cuerpo de la solicitud debe ser un objeto JSON.');
        }
        const nombre = requireText(input.nombre, 'nombre');

        const existe = await repository.findById(id);
        if (!existe) {
            throw new AppError(`No existe una categoría con el id ${id}.`, 404);
        }

        // Si otra categoría (distinta a esta) ya usa el nombre, no se permite.
        const existeNombre = await repository.findByNombre(nombre);
        if (existeNombre && existeNombre.id !== id) {
            throw new AppError(`Ya existe una categoría con el nombre "${nombre}".`, 409);
        }

        return await repository.update(id, nombre);
    }
}
