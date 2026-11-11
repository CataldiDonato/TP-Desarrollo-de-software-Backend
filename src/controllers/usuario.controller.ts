import type { Request, Response } from 'express';
import { UsuarioService } from '../services/usuario.service';
import { getErrorResponse } from '../utils/app-error';
import { parsePositiveId } from '../utils/validation';

const service = new UsuarioService();

export class UsuarioController {
    async getUsuarios(_req: Request, res: Response) {
        try {
            return res.status(200).json(await service.getAll());
        } catch (error) {
            return this.sendError(res, error);
        }
    }

    async getUsuarioById(req: Request, res: Response) {
        try {
            const id = parsePositiveId(req.params.id, 'id');
            return res.status(200).json(await service.getById(id));
        } catch (error) {
            return this.sendError(res, error);
        }
    }

    async createUsuario(req: Request, res: Response) {
        try {
            return res.status(201).json(await service.create(req.body));
        } catch (error) {
            return this.sendError(res, error);
        }
    }

    async updateUsuario(req: Request, res: Response) {
        try {
            const id = parsePositiveId(req.params.id, 'id');
            return res.status(200).json(await service.update(id, req.body));
        } catch (error) {
            return this.sendError(res, error);
        }
    }

    async deleteUsuario(req: Request, res: Response) {
        try {
            const id = parsePositiveId(req.params.id, 'id');
            const usuario = await service.delete(id);
            return res.status(200).json({
                message: 'Usuario eliminado correctamente.',
                usuario
            });
        } catch (error) {
            return this.sendError(res, error);
        }
    }

    private sendError(res: Response, error: unknown) {
        const { statusCode, message } = getErrorResponse(error);
        return res.status(statusCode).json({ message });
    }
}
