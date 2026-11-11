import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';
import { verificarRol } from '../middlewares/auth.middleware';

const router = Router();
const controller = new DashboardController();

router.use(verificarRol('Administrador'));

router.get('/stats', (req, res) => controller.getStats(req, res));

export default router;
