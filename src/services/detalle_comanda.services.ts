import { detalle_comandaRepository } from "../repositories/detalle_comanda.repository"; //Llama a la clase detalle_comandaRepository para poder usar sus metodos
import { comandaRepository } from "../repositories/comanda.repository";
import { ProductoRepository } from "../repositories/productos.repository";
import { AppError } from "../utils/app-error";
import { isPlainObject, parsePositiveId, parsePositiveInt } from "../utils/validation";

const repository = new detalle_comandaRepository(); //Creo una instancia de la clase detalle_comandaRepository para poder usar sus metodos
const repositoryComanda = new comandaRepository();
const repositoryProducto = new ProductoRepository();

export class detalle_comandaService {

    // Agrega un producto a una comanda que ya está abierta.
    async create(input: unknown) {
        if (!isPlainObject(input)) {
            throw new AppError('El cuerpo de la solicitud debe ser un objeto JSON.');
        }
        const id_comanda = parsePositiveId(input.id_comanda, 'id_comanda');
        const id_producto = parsePositiveId(input.id_producto, 'id_producto');
        const cantidad = parsePositiveInt(input.cantidad, 'cantidad');

        await this.validarComandaAbierta(id_comanda);

        const producto = await repositoryProducto.findById(id_producto);
        if (!producto) {
            throw new AppError(`No existe un producto con el id ${id_producto}.`, 404);
        }

        // La clave de detalle_comanda es (id_comanda, id_producto): un producto aparece una sola vez por comanda.
        const existe = await repository.findById(id_comanda, id_producto);
        if (existe) {
            throw new AppError('Ese producto ya está en la comanda. Modificá su cantidad.', 409);
        }

        return await repository.create(id_comanda, id_producto, cantidad);
    }

    async updateCantidad(id_comanda: number, id_producto: number, input: unknown) {
        if (!isPlainObject(input)) {
            throw new AppError('El cuerpo de la solicitud debe ser un objeto JSON.');
        }
        const cantidad = parsePositiveInt(input.cantidad, 'cantidad');

        await this.validarDetalleModificable(id_comanda, id_producto);
        return await repository.updateCantidad(id_comanda, id_producto, cantidad);
    }

    async delete(id_comanda: number, id_producto: number) {
        await this.validarDetalleModificable(id_comanda, id_producto);
        return await repository.delete(id_comanda, id_producto);
    }

    private async validarComandaAbierta(id_comanda: number) {
        const comanda = await repositoryComanda.findById(id_comanda);
        if (!comanda) {
            throw new AppError(`No existe una comanda con el id ${id_comanda}.`, 404);
        }
        if (comanda.estado !== 'Abierta') {
            throw new AppError('La comanda ya está cerrada y no se puede modificar.', 409);
        }
    }

    // Solo se puede cambiar o quitar un producto que la cocina todavía no empezó.
    private async validarDetalleModificable(id_comanda: number, id_producto: number) {
        await this.validarComandaAbierta(id_comanda);

        const detalle = await repository.findById(id_comanda, id_producto);
        if (!detalle) {
            throw new AppError('Ese producto no está en la comanda.', 404);
        }
        if (detalle.estado !== 'Pendiente') {
            throw new AppError('La cocina ya empezó a preparar este producto, no se puede modificar.', 409);
        }
    }
}
