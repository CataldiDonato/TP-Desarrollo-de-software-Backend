import {medio_de_pagoRepository} from "../repositories/medio_de_pago.repository"; 

const repository = new medio_de_pagoRepository();

export class medio_de_pagoService {
    async get(id : number) {
        return await repository.get(id);
    }   
}
