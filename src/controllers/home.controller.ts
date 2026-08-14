import { Request, Response } from "express"; 
import {homeService} from "../services/home.service";

const service = new homeService();

export class homeControler {

    async getStats(req: Request, res: Response) {
        try {
            const stats = await service.getStats();
            res.status(200).json(stats);
        } catch (error: any) {
            res.status(500).json({ message: "Error al obtener los stats", error: error.message });
        }
    }
}