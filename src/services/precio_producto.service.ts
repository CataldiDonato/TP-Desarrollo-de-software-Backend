import { Precio_productoRepository } from "../repositories/precio_producto.repository";
import { ProductoRepository } from "../repositories/productos.repository";
import { AppError } from "../utils/app-error";

const repository = new Precio_productoRepository();
const repositoryProducto = new ProductoRepository();

export class precio_productoService {

    async getUltimoPrecio(id_producto: number) {
        await this.validarProducto(id_producto);

        const precio = await repository.getUltimoPrecio(id_producto);
        if (!precio) {
            throw new AppError('No se encontró ningún precio para este producto.', 404);
        }
        return precio;
    }

    async getAll(id_producto: number) {
        await this.validarProducto(id_producto);
        return await repository.findAll(id_producto);
    }

    private async validarProducto(id_producto: number) {
        const producto = await repositoryProducto.findById(id_producto);
        if (!producto) {
            throw new AppError(`No existe un producto con el id ${id_producto}.`, 404);
        }
    }
}
