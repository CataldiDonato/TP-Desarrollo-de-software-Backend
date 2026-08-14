import {medio_de_pagoService} from "../services/medio_de_pago.services";

const service = new medio_de_pagoService(); 

export class medio_de_pagoController {
    async get(req, res) {
        const { id } = req.params;
        const medio_de_pago = await service.get(Number(id)); 
        if (medio_de_pago) {
            res.status(200).json(medio_de_pago); // cuando devuelve los datos, se devuelve un 200 y los datos en formato json
        } else {
            res.status(404).json({ message: "Medio de pago no encontrado" });
        }
    }
}