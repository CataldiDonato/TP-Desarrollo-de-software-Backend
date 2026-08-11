import { ProductoRepository } from "../repositories/productos.repository";
import { CategoriaRepository } from "../repositories/categoria.repository";
import { tipo_producto } from "../generated/enums";
import { Precio_productoRepository } from "../repositories/precio_producto.repository";

export interface UpdateProducto {
    nombre?: string;
    descripcion?: string;
    tipo?: tipo_producto;
    id_categoria?: number;
    precio?: number;
}
const repositoryPrecio_producto = new Precio_productoRepository();
const repository = new ProductoRepository();
const repositoryCategoria = new CategoriaRepository();
export class ProductoService {

    async getAll() {
        return  await repository.findAll();
    }

    async create(datos: UpdateProducto) {
        const existe = await repository.findByNombre(datos.nombre)
        const existeCategoria = await repositoryCategoria.findById(datos.id_categoria);

        if(!existeCategoria){
            throw new Error(`No existe categoria con id: "${datos.id_categoria}".`);
        }

        if(existe){
            throw new Error(`Ya existe un producto con el nombre "${datos.nombre}".`);
        }

        if(datos.precio < 0){
            throw new Error(`El precio del producto debe ser mayor a 0`);
        }

        
        return await repository.create(datos);
    }

    async delete(id: number) {
        const existe = await repository.findById(id)
        
        if(!existe){
            throw new Error(`No existe un producto con el id: "${id}".`);
        }

        return await repository.delete(id);
    }

    async update(id: number, datos: UpdateProducto) {
        const existe = await repository.findById(id);
        
        if (!existe) {
            throw new Error(`No existe un producto con el id: "${id}".`);
        }

        if (datos.nombre) {
            const existeNombre = await repository.findByNombre(datos.nombre);
            if (existeNombre) {
                throw new Error(`Ya existe otro producto con el nombre "${datos.nombre}".`);
            }
        }

        if (datos.precio) {
            await  repositoryPrecio_producto.create(id, datos.precio);
        }

        return await repository.update(id, datos);
    }
}