import type { Request, Response } from "express"; // Importa los tipos Request y Response de Express para tipar los parámetros de las funciones del controlador
import { comandaService } from "../services/comanda.service"; //Llama a la clase comandaService para poder usar sus metodos
import { getErrorResponse } from "../utils/app-error";
import { parsePositiveId } from "../utils/validation";

const service = new comandaService();

export class comandaController {

    // GET /comandas?estado=Abierta → el filtro es opcional
    async findAll(req: Request, res: Response) {
        try {
            return res.status(200).json(await service.findAll(req.query.estado));
        } catch (error) {
            return this.sendError(res, error);
        }
    }

    async findById(req: Request, res: Response) {
        try {
            const id = parsePositiveId(req.params.id, 'id');
            return res.status(200).json(await service.findById(id));
        } catch (error) {
            return this.sendError(res, error);
        }
    }

    async create(req: Request, res: Response) {
        try {
            // req.usuario lo completa el middleware verificarToken con los datos del token
            return res.status(201).json(await service.create(req.body, req.usuario!.id));
        } catch (error) {
            return this.sendError(res, error);
        }
    }

    async update(req: Request, res: Response) {
        try {
            const id = parsePositiveId(req.params.id, 'id');
            return res.status(200).json(await service.cambiarEstado(id, req.body));
        } catch (error) {
            return this.sendError(res, error);
        }
    }

    private sendError(res: Response, error: unknown) {
        const { statusCode, message } = getErrorResponse(error);
        return res.status(statusCode).json({ message });
    }
}
