import { Router } from 'express';
import { comandaController } from '../controllers/comanda.controller';

const controller = new comandaController();
const router = Router();

router.get('/', (req, res) => controller.findAll(req, res)); // Aunque los links son iguales funcionan distintos porque si es solo el link es get, pero para que sea post debe ser con un formuladio de HTML
router.post('/', (req, res) => controller.create(req, res));
router.patch('/:id/estado', (req, res) => controller.update(req, res));

export default router; // Exporta el router para que pueda ser utilizado en otros archivos
