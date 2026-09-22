import { Router } from 'express';
import { comandaController } from '../controllers/comanda.controller';
import { verificarRol } from '../middlewares/auth.middleware';

const controller = new comandaController();
const router = Router();

router.use(verificarRol('Administrador', 'Mozo'));

router.get('/', (req, res) => controller.findAll(req, res)); // Aunque los links son iguales funcionan distintos porque si es solo el link es get, pero para que sea post debe ser con un formuladio de HTML
router.post('/', (req, res) => controller.create(req, res));
router.patch('/:id/estado', (req, res) => controller.update(req, res));

export default router; // Exporta el router para que pueda ser utilizado en otros archivos
