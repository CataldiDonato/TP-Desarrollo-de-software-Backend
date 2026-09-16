import {Request, Response} from 'express';
import { MesaService } from '../services/mesa.service';
import { estado_mesa } from '../generated/enums';



const service = new MesaService();

export class MesaController {

    async getMesas(req: Request, res: Response) {
        try {
            const mesas = await service.getAll();
            res.status(200).json(mesas);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async getMesasDisponibles(req: Request, res: Response) {
        try {
            
            const mesas = await service.getByEstado('Libre' as estado_mesa);
            res.status(200).json(mesas);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }
    
    
    async createMesa(req: Request, res: Response) {

        try {
            const { capacidad } = req.body;
            const nuevaMesa = await service.create(Number(capacidad));
            res.status(201).json(nuevaMesa);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }    
    

    async updateMesa(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { capacidad, estado } = req.body;
            
            const mesa = await service.update(Number(id), Number(capacidad), estado as estado_mesa);
            res.status(200).json(mesa);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    

    async deleteMesa(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await service.delete(Number(id));
            res.status(200).json({ message: 'Mesa eliminada correctamente' });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }
    
    


}




