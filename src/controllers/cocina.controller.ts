import type { Request, Response } from 'express';
import { CocinaService } from '../services/cocina.service';
import { getErrorResponse } from '../utils/app-error';

const service = new CocinaService();

export class CocinaController {
    async getPedidosActivos(_req: Request, res: Response) {
        try {
            return res.status(200).json(await service.getPedidosActivos());
        } catch (error) {
            return this.sendError(res, error);
        }
    }

    async actualizarEstado(req: Request, res: Response) {
        try {
            return res.status(200).json(await service.actualizarEstado(req.body));
        } catch (error) {
            return this.sendError(res, error);
        }
    }

    private sendError(res: Response, error: unknown) {
        const { statusCode, message } = getErrorResponse(error);
        return res.status(statusCode).json({ message });
    }
}
