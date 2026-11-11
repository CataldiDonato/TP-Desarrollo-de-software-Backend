import { Router } from 'express';
import { CategoriaController } from '../controllers/categorias.controller';
import { verificarRol } from '../middlewares/auth.middleware';

const router = Router();
const controller = new CategoriaController();

// El Mozo puede ver las categorías (para filtrar productos), pero solo el Administrador las modifica.
router.get('/', verificarRol('Administrador', 'Mozo'), (req, res) => controller.getCategorias(req, res));
router.post('/', verificarRol('Administrador'), (req, res) => controller.createCategoria(req, res));
router.put('/:id', verificarRol('Administrador'), (req, res) => controller.updateCategoria(req, res));
router.delete('/:id', verificarRol('Administrador'), (req, res) => controller.deleteCategoria(req, res));

export default router;
