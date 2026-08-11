import type { Request, Response } from 'express';
import { DashboardService } from '../services/dashboard.service';
import { getErrorResponse } from '../utils/app-error';

const service = new DashboardService();

export class DashboardController {
    async getStats(_req: Request, res: Response) {
        try {
            return res.status(200).json(await service.getStats());
        } catch (error) {
            const { statusCode, message } = getErrorResponse(error);
            return res.status(statusCode).json({ message });
        }
    }
}
