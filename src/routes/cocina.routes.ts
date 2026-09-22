import { Router } from 'express';
import { CocinaController } from '../controllers/cocina.controller';
import { verificarRol } from '../middlewares/auth.middleware';

const router = Router();
const controller = new CocinaController();

router.use(verificarRol('Administrador', 'Cocinero'));

router.get('/pedidos', (req, res) => controller.getPedidosActivos(req, res));
router.patch('/detalles/estado', (req, res) => controller.actualizarEstado(req, res));

export default router;
