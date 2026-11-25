import type { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { getErrorResponse } from '../utils/app-error';

const service = new AuthService();

export class AuthController {
    async login(req: Request, res: Response) {
        try {
            const resultado = await service.login(req.body);
            return res.status(200).json(resultado);
        } catch (error) {
            const { statusCode, message } = getErrorResponse(error);
            return res.status(statusCode).json({ message });
        }
    }
}