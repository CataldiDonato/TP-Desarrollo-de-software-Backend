import { Router } from 'express';
import { ProductoController } from '../controllers/productos.controller';

const router = Router();
const controller = new ProductoController();

router.get('/', (req, res) => controller.getProductos(req, res));
router.post('/', (req, res) => controller.createProducto(req, res));
router.delete('/:id', (req, res) => controller.deleteProducto(req, res));
router.put('/:id', (req, res) => controller.updateProducto(req, res));

export default router;