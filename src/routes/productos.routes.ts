import { Router } from 'express';
import { ProductoController } from '../controllers/productos.controller';
import { verificarRol } from '../middlewares/auth.middleware';

const router = Router();
const controller = new ProductoController();

router.get('/', verificarRol('Administrador', 'Mozo'), (req, res) => controller.getProductos(req, res));
router.post('/', verificarRol('Administrador'), (req, res) => controller.createProducto(req, res));
router.delete('/:id', verificarRol('Administrador'), (req, res) => controller.deleteProducto(req, res));
router.put('/:id', verificarRol('Administrador'), (req, res) => controller.updateProducto(req, res));

export default router;
