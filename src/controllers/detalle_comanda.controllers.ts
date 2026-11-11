import type { Request, Response } from "express";
import { detalle_comandaService } from "../services/detalle_comanda.services"; //Llama a la clase detalle_comandaService para poder usar sus metodos
import { getErrorResponse } from "../utils/app-error";
import { parsePositiveId } from "../utils/validation";

const service = new detalle_comandaService();

export class detalle_comandaController {

    async create(req: Request, res: Response) {
        try {
            return res.status(201).json(await service.create(req.body));
        } catch (error) {
            return this.sendError(res, error);
        }
    }

    async update(req: Request, res: Response) {
        try {
            const id_comanda = parsePositiveId(req.params.id_comanda, 'id_comanda');
            const id_producto = parsePositiveId(req.params.id_producto, 'id_producto');
            return res.status(200).json(await service.updateCantidad(id_comanda, id_producto, req.body));
        } catch (error) {
            return this.sendError(res, error);
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const id_comanda = parsePositiveId(req.params.id_comanda, 'id_comanda');
            const id_producto = parsePositiveId(req.params.id_producto, 'id_producto');
            await service.delete(id_comanda, id_producto);
            return res.status(200).json({ message: 'Producto quitado de la comanda.' });
        } catch (error) {
            return this.sendError(res, error);
        }
    }

    private sendError(res: Response, error: unknown) {
        const { statusCode, message } = getErrorResponse(error);
        return res.status(statusCode).json({ message });
    }
}
