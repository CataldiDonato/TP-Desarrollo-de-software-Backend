import { ProductoRepository } from '../repositories/productos.repository';
import { CategoriaRepository } from '../repositories/categoria.repository';
import { Precio_productoRepository } from '../repositories/precio_producto.repository';
import type { tipo_producto } from '../generated/enums';
import { AppError } from '../utils/app-error';
import {
    TIPOS_PRODUCTO,
    isPlainObject,
    parseOpcion,
    parsePositiveId,
    parsePositiveNumber,
    requireText
} from '../utils/validation';

export interface DatosProducto {
    nombre: string;
    descripcion: string;
    tipo: tipo_producto;
    id_categoria: number;
    precio: number;
}

const repository = new ProductoRepository();
const repositoryCategoria = new CategoriaRepository();
const repositoryPrecio_producto = new Precio_productoRepository();

export class ProductoService {

    // Devolvemos cada producto con el nombre de su categoría y el precio actual,
    // así el frontend no tiene que hacer cuentas.
    async getAll() {
        const productos = await repository.findAll();

        return productos.map((producto) => ({
            id: producto.id,
            nombre: producto.nombre,
            descripcion: producto.descripcion,
            tipo: producto.tipo,
            id_categoria: producto.id_categoria,
            categoria: producto.categoria.nombre,
            precio: producto.precios.length > 0 ? Number(producto.precios[0].precio) : null
        }));
    }

    async create(input: unknown) {
        const datos = this.validarDatos(input);

        await this.validarCategoria(datos.id_categoria);

        const existe = await repository.findByNombre(datos.nombre);
        if (existe) {
            throw new AppError(`Ya existe un producto con el nombre "${datos.nombre}".`, 409);
        }

        return await repository.create(datos);
    }

    async update(id: number, input: unknown) {
        const datos = this.validarDatos(input);

        const producto = await repository.findById(id);
        if (!producto) {
            throw new AppError(`No existe un producto con el id ${id}.`, 404);
        }

        await this.validarCategoria(datos.id_categoria);

        // Si otro producto (distinto a este) ya usa el nombre, no se permite.
        const existeNombre = await repository.findByNombre(datos.nombre);
        if (existeNombre && existeNombre.id !== id) {
            throw new AppError(`Ya existe otro producto con el nombre "${datos.nombre}".`, 409);
        }

        // Si el precio cambió, se agrega un registro nuevo al historial de precios.
        const ultimoPrecio = await repositoryPrecio_producto.getUltimoPrecio(id);
        if (!ultimoPrecio || Number(ultimoPrecio.precio) !== datos.precio) {
            await repositoryPrecio_producto.create(id, datos.precio);
        }

        return await repository.update(id, datos);
    }

    async delete(id: number) {
        const producto = await repository.findById(id);
        if (!producto) {
            throw new AppError(`No existe un producto con el id ${id}.`, 404);
        }

        const usosEnComandas = await repository.countDetallesComanda(id);
        if (usosEnComandas > 0) {
            throw new AppError('No se puede eliminar el producto porque ya fue pedido en alguna comanda.', 409);
        }

        return await repository.delete(id);
    }

    private async validarCategoria(id_categoria: number) {
        const categoria = await repositoryCategoria.findById(id_categoria);
        if (!categoria) {
            throw new AppError(`No existe una categoría con el id ${id_categoria}.`, 404);
        }
    }

    // Se usa tanto para crear como para editar: en los dos casos se mandan todos los campos.
    private validarDatos(input: unknown): DatosProducto {
        if (!isPlainObject(input)) {
            throw new AppError('El cuerpo de la solicitud debe ser un objeto JSON.');
        }

        return {
            nombre: requireText(input.nombre, 'nombre'),
            // La descripción es opcional: si no viene, se guarda vacía.
            descripcion: typeof input.descripcion === 'string' ? input.descripcion.trim() : '',
            tipo: parseOpcion(input.tipo, TIPOS_PRODUCTO, 'tipo'),
            id_categoria: parsePositiveId(input.id_categoria, 'id_categoria'),
            precio: parsePositiveNumber(input.precio, 'precio')
        };
    }
}
