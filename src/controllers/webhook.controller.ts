import type { Request, Response } from 'express';
import { mercadopagoService } from '../services/mercadopago.service';

const mp = new mercadopagoService();

export class webhookController {

    // POST /webhooks/mercadopago → Mercado Pago avisa acá cuando cambia el estado de un pago.
    async mercadoPago(req: Request, res: Response) {
        const tipo = req.query.type ?? req.body?.type;
        const dataId = String(req.query['data.id'] ?? req.body?.data?.id ?? '');

        if (!mp.firmaValida(req.headers, dataId)) return res.sendStatus(401);
        if (tipo !== 'payment') return res.sendStatus(200); // otros eventos: se ignoran

        try {
            await mp.procesarPago(dataId);
            return res.sendStatus(200);
        } catch (error) {
            console.error('Webhook MP:', error);
            return res.sendStatus(500); // MP reintenta solo
        }
    }
}
