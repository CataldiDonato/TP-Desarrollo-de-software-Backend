import { mesaRepository } from "../repositories/mesa.repository";

const mesaR = new mesaRepository();

export class homeService {

    async getStats() {
        
        const mesa = mesaR.findAll();
        

        return 0;
    }
}