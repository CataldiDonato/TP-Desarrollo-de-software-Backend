import { Router } from 'express';
import { CocinaController } from '../controllers/cocina.controller';
import { verificarRol } from '../middlewares/auth.middleware';

const router = Router();
const controller = new CocinaController();

// El Administrador puede mirar la cocina, pero solo un Cocinero cambia el estado de los platos.
router.get('/pedidos', verificarRol('Administrador', 'Cocinero'), (req, res) => controller.getPedidosActivos(req, res));
router.patch('/detalles/estado', verificarRol('Cocinero'), (req, res) => controller.actualizarEstado(req, res));

export default router;
