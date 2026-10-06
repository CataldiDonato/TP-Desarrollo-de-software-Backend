import type { Request, Response } from "express";
import { medio_pagoService } from "../services/medio_pago.services";
import { getErrorResponse } from "../utils/app-error";
import { parsePositiveId } from "../utils/validation";

const service = new medio_pagoService();

export class medio_pagoController {
    async findAll(_req: Request, res: Response) {
        try {
            return res.status(200).json(await service.findAll());
        } catch (error) {
            return this.sendError(res, error);
        }
    }

    async create(req: Request, res: Response) {
        try {
            return res.status(201).json(await service.create(req.body));
        } catch (error) {
            return this.sendError(res, error);
        }
    }

    async update(req: Request, res: Response) {
        try {
            const id = parsePositiveId(req.params.id, 'id');
            return res.status(200).json(await service.update(id, req.body));
        } catch (error) {
            return this.sendError(res, error);
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const id = parsePositiveId(req.params.id, 'id');
            await service.delete(id);
            return res.status(200).json({ message: 'Medio de pago eliminado correctamente.' });
        } catch (error) {
            return this.sendError(res, error);
        }
    }

    private sendError(res: Response, error: unknown) {
        const { statusCode, message } = getErrorResponse(error);
        return res.status(statusCode).json({ message });
    }
}
