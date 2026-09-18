import { Request, Response } from "express";
import { medio_pagoService } from "../services/medio_pago.services";

const service = new medio_pagoService();

export class medio_pagoController {
    async findAll(req: Request, res: Response) {
        try {
            const medios = await service.findAll();
            res.status(200).json(medios);
        } catch (error: any) {
            res.status(500).json({ message: "Error al obtener los medios de pago", error: error.message });
        }
    }
}

