import { Router } from 'express';
import { precio_productoController } from '../controllers/precio_producto.controller';

const router = Router();
const controller = new precio_productoController();

router.get('/:id/precios', (req, res) => controller.getUltPrecio(req, res));
router.get('/:id/precios/ultimo', (req, res) => controller.getPrecios(req, res));

export default router;