import { Router } from 'express';
import { mercadopagoService } from '../services/mercadopago.service';

const mp = new mercadopagoService();
const router = Router();

router.post('/mercadopago', async (req, res) => {
    const tipo = req.query.type ?? req.body?.type;
    const dataId = String(req.query['data.id'] ?? req.body?.data?.id ?? '');

    if (!mp.firmaValida(req.headers, dataId)) return res.sendStatus(401);
    if (tipo !== 'payment') return res.sendStatus(200); // otros eventos: se ignoran

    try {
        await mp.procesarPago(dataId);
        res.sendStatus(200);
    } catch (e) {
        console.error('Webhook MP:', e);
        res.sendStatus(500); // MP reintenta solo
    }
});

export default router;