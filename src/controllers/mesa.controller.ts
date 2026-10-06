import type { Request, Response } from 'express';
import { MesaService } from '../services/mesa.service';
import { getErrorResponse } from '../utils/app-error';
import { parsePositiveId } from '../utils/validation';

const service = new MesaService();

export class MesaController {

    // GET /mesas?estado=Libre → el filtro es opcional
    async getMesas(req: Request, res: Response) {
        try {
            return res.status(200).json(await service.getAll(req.query.estado));
        } catch (error) {
            return this.sendError(res, error);
        }
    }

    // GET /mesas/disponibles?fecha=...&personas=... → los dos parámetros son opcionales
    async getMesasDisponibles(req: Request, res: Response) {
        try {
            const { fecha, personas } = req.query;
            return res.status(200).json(await service.getDisponibles(fecha, personas));
        } catch (error) {
            return this.sendError(res, error);
        }
    }

    async getMesaDetalle(req: Request, res: Response) {
        try {
            const id = parsePositiveId(req.params.id, 'id');
            return res.status(200).json(await service.getDetalle(id));
        } catch (error) {
            return this.sendError(res, error);
        }
    }

    async createMesa(req: Request, res: Response) {
        try {
            return res.status(201).json(await service.create(req.body));
        } catch (error) {
            return this.sendError(res, error);
        }
    }

    async updateMesa(req: Request, res: Response) {
        try {
            const id = parsePositiveId(req.params.id, 'id');
            return res.status(200).json(await service.update(id, req.body));
        } catch (error) {
            return this.sendError(res, error);
        }
    }

    async deleteMesa(req: Request, res: Response) {
        try {
            const id = parsePositiveId(req.params.id, 'id');
            await service.delete(id);
            return res.status(200).json({ message: 'Mesa eliminada correctamente.' });
        } catch (error) {
            return this.sendError(res, error);
        }
    }

    private sendError(res: Response, error: unknown) {
        const { statusCode, message } = getErrorResponse(error);
        return res.status(statusCode).json({ message });
    }
}
