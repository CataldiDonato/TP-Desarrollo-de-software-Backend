import { Router } from 'express';
import { precio_productoController } from '../controllers/precio_producto.controller';
import { verificarRol } from '../middlewares/auth.middleware';

const router = Router();
const controller = new precio_productoController();

router.use(verificarRol('Administrador', 'Mozo'));

router.get('/:id/precios', (req, res) => controller.getPrecios(req, res));
router.get('/:id/precios/ultimo', (req, res) => controller.getUltPrecio(req, res));

export default router;
