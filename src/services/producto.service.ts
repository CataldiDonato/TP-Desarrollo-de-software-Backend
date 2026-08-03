import { ProductoRepository } from "../repositories/productos.repository";

const repository = new ProductoRepository();

export class ProductoService {

    async getAll() {
        return  await repository.findAll();
    }

    async create(nombre: string, descripcion: string) {
        
        if (!nombre || nombre.trim() === '' || !descripcion || descripcion.trim() === '') {
            throw new Error('El nombre y la descripcion son obligatorios');
        }
        return await repository.create(nombre, descripcion);
    }

    async delete(id: number) {
        if (!id || isNaN(id)) {
            throw new Error('El ID del producto debe ser un número válido');
        }
        return await repository.delete(id);
    }

    async update(id: number, nombre: string, descripcion: string) {
        if (!nombre || nombre.trim() === '' || !descripcion || descripcion.trim() === '' || !id || isNaN(id)) {
            throw new Error('El id, nombre y la descripcion son obligatorios');
        }
        return await repository.update(id, nombre, descripcion);
    }
}