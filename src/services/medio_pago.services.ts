import { medio_pagoRepository } from "../repositories/medio_de_pago.repository";

const repository = new medio_pagoRepository();

export class medio_pagoService {
    async findAll() {
        return await repository.findAll();
    }

    async get(id: number) {
        return await repository.get(id);
    }
}

