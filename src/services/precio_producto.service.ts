import { Precio_productoRepository } from "../repositories/precio_producto.repository";

const repository = new Precio_productoRepository();

export class precio_productoService{

    async getUltimoPrecio(id_producto: number){
        if (!id_producto || isNaN(id_producto)) {
            throw new Error('El ID del producto debe ser un número válido');
        }
        return await repository.getUltimoPrecio(id_producto);
    }

    async getAll(id_producto: number){
        if (!id_producto || isNaN(id_producto)) {
            throw new Error('El ID del producto debe ser un número válido');
        }
        return await repository.findAll(id_producto);
    }
}
