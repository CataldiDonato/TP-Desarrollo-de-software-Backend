import { Router } from 'express';
import { CategoriaController } from '../controllers/categorias.controller';

const router = Router();
const controller = new CategoriaController();

router.get('/', (req, res) => controller.getCategorias(req, res));
router.post('/', (req, res) => controller.createCategoria(req, res));
router.delete('/:id', (req, res) => controller.deleteCategoria(req, res));
router.put('/:id', (req, res) => controller.updateCategoria(req, res));

export default router;