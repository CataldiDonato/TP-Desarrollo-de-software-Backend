/// <reference path="../types/express.d.ts" />
import type { Request, Response } from 'express';
import { CocinaService } from '../services/cocina.service';
import { getErrorResponse } from '../utils/app-error';
import { parsePositiveId } from '../utils/validation';

const service = new CocinaService(); 

export class CocinaController {
    async getPedidosActivos(req: Request, res: Response) {
        try {
            return res.status(200).json(await service.getPedidosActivos(req.query.estado));
        } catch (error) {
            return this.sendError(res, error);
        } // obtiene los pedidos activos según el estado, si no manda error
    }

    async getComanda(req: Request, res: Response) {
        try {
            const id = parsePositiveId(req.params.id, 'id');
            return res.status(200).json(await service.getComanda(id));
        } catch (error) {
            return this.sendError(res, error);
        }
    } // el parsePositiveId valida que el id sea un número positivo, si no manda error. Luego llama al servicio para obtener la comanda con ese id, si no manda error.

    async actualizarEstado(req: Request, res: Response) {
        try {
            return res.status(200).json(await service.actualizarEstado(req.body, req.usuario!.id));
        } catch (error) {
            return this.sendError(res, error);
        }
    } // req.body lo completa express.json() con los datos que envía el cliente. req.usuario lo completa el middleware verificarToken con los datos del token. Luego llama al servicio para actualizar el estado de un detalle de comanda, si no manda error.

    private sendError(res: Response, error: unknown) {
        const { statusCode, message } = getErrorResponse(error);
        return res.status(statusCode).json({ message });
    } // getErrorResponse toma un error y devuelve un objeto con statusCode y message, para que el cliente sepa qué pasó. Luego responde con ese statusCode y message.
}
