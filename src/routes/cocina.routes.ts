import { Router } from 'express';
import { CocinaController } from '../controllers/cocina.controller';

const router = Router();
const controller = new CocinaController();

router.get('/pedidos', (req, res) => controller.getPedidosActivos(req, res));
router.patch('/detalles/estado', (req, res) => controller.actualizarEstado(req, res));

export default router;
