import { medio_pagoRepository } from "../repositories/medio_de_pago.repository";
import { AppError } from "../utils/app-error";
import { TIPOS_PAGO, isPlainObject, parseOpcion } from "../utils/validation";

const repository = new medio_pagoRepository();

export class medio_pagoService {
    async findAll() {
        return await repository.findAll();
    }

    async get(id: number) {
        const medio = await repository.get(id);
        if (!medio) {
            throw new AppError(`No existe un medio de pago con el id ${id}.`, 404);
        }
        return medio;
    }

    async create(input: unknown) {
        const tipo = this.validarTipo(input);

        const existe = await repository.findByTipo(tipo);
        if (existe) {
            throw new AppError(`El medio de pago "${tipo}" ya está cargado.`, 409);
        }
        return await repository.create(tipo);
    }

    async update(id: number, input: unknown) {
        const tipo = this.validarTipo(input);
        await this.get(id);

        const existe = await repository.findByTipo(tipo);
        if (existe && existe.id !== id) {
            throw new AppError(`El medio de pago "${tipo}" ya está cargado.`, 409);
        }
        return await repository.update(id, tipo);
    }

    async delete(id: number) {
        await this.get(id);

        const comandas = await repository.countComandas(id);
        if (comandas > 0) {
            throw new AppError('No se puede eliminar el medio de pago porque ya se usó para cobrar comandas.', 409);
        }
        return await repository.delete(id);
    }

    private validarTipo(input: unknown) {
        if (!isPlainObject(input)) {
            throw new AppError('El cuerpo de la solicitud debe ser un objeto JSON.');
        }
        return parseOpcion(input.tipo, TIPOS_PAGO, 'tipo');
    }
}
