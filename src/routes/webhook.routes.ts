import { Router } from 'express';
import { webhookController } from '../controllers/webhook.controller';

const controller = new webhookController();
const router = Router();

router.post('/mercadopago', (req, res) => controller.mercadoPago(req, res));

export default router;
