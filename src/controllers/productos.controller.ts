import type { Request, Response } from 'express';
import { ProductoService } from '../services/producto.service';
import { getErrorResponse } from '../utils/app-error';
import { parsePositiveId } from '../utils/validation';

const service = new ProductoService();

export class ProductoController {

    async getProductos(_req: Request, res: Response) {
        try {
            return res.status(200).json(await service.getAll());
        } catch (error) {
            return this.sendError(res, error);
        }
    }

    async createProducto(req: Request, res: Response) {
        try {
            return res.status(201).json(await service.create(req.body));
        } catch (error) {
            return this.sendError(res, error);
        }
    }

    async updateProducto(req: Request, res: Response) {
        try {
            const id = parsePositiveId(req.params.id, 'id');
            return res.status(200).json(await service.update(id, req.body));
        } catch (error) {
            return this.sendError(res, error);
        }
    }

    async deleteProducto(req: Request, res: Response) {
        try {
            const id = parsePositiveId(req.params.id, 'id');
            await service.delete(id);
            return res.status(200).json({ message: 'Producto eliminado correctamente.' });
        } catch (error) {
            return this.sendError(res, error);
        }
    }

    private sendError(res: Response, error: unknown) {
        const { statusCode, message } = getErrorResponse(error);
        return res.status(statusCode).json({ message });
    }
}
