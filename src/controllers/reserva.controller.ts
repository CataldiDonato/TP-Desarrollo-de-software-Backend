import type { Request, Response } from 'express';
import { ReservaService } from '../services/reserva.service';
import { getErrorResponse } from '../utils/app-error';
import { parsePositiveId } from '../utils/validation';

const service = new ReservaService();

export class ReservaController {

    // GET /reservas?cliente=...&fecha=AAAA-MM-DD → los filtros son opcionales
    async getReservas(req: Request, res: Response) {
        try {
            const { cliente, fecha } = req.query;
            return res.status(200).json(await service.getAll(cliente, fecha));
        } catch (error) {
            return this.sendError(res, error);
        }
    }

    async createReserva(req: Request, res: Response) {
        try {
            return res.status(201).json(await service.create(req.body));
        } catch (error) {
            return this.sendError(res, error);
        }
    }

    async updateReserva(req: Request, res: Response) {
        try {
            const id = parsePositiveId(req.params.id, 'id');
            return res.status(200).json(await service.update(id, req.body));
        } catch (error) {
            return this.sendError(res, error);
        }
    }

    async updateEstado(req: Request, res: Response) {
        try {
            const id = parsePositiveId(req.params.id, 'id');
            return res.status(200).json(await service.updateEstado(id, req.body));
        } catch (error) {
            return this.sendError(res, error);
        }
    }

    async deleteReserva(req: Request, res: Response) {
        try {
            const id = parsePositiveId(req.params.id, 'id');
            await service.delete(id);
            return res.status(200).json({ message: 'Reserva eliminada correctamente.' });
        } catch (error) {
            return this.sendError(res, error);
        }
    }

    private sendError(res: Response, error: unknown) {
        const { statusCode, message } = getErrorResponse(error);
        return res.status(statusCode).json({ message });
    }
}
