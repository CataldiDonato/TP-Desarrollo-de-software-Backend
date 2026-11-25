import type { Request, Response } from "express";
import { precio_productoService } from "../services/precio_producto.service";
import { getErrorResponse } from "../utils/app-error";
import { parsePositiveId } from "../utils/validation";

const service = new precio_productoService();

export class precio_productoController {

    // GET /:id/precios/ultimo → el precio vigente
    async getUltPrecio(req: Request, res: Response) {
        try {
            const id = parsePositiveId(req.params.id, 'id');
            return res.status(200).json(await service.getUltimoPrecio(id));
        } catch (error) {
            return this.sendError(res, error);
        }
    }

    // GET /:id/precios → todo el historial, del más nuevo al más viejo
    async getPrecios(req: Request, res: Response) {
        try {
            const id = parsePositiveId(req.params.id, 'id');
            return res.status(200).json(await service.getAll(id));
        } catch (error) {
            return this.sendError(res, error);
        }
    }

    private sendError(res: Response, error: unknown) {
        const { statusCode, message } = getErrorResponse(error);
        return res.status(statusCode).json({ message });
    }
}
