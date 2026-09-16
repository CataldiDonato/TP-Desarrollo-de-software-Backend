import { Router } from 'express';
import { MesaController } from '../controllers/mesa.controller';

const router = Router();
const controller = new MesaController();

router.get('/disponibles', (req, res) => controller.getMesasDisponibles(req, res));

router.get('/', (req, res) => controller.getMesas(req, res));

router.post('/', (req, res) => controller.createMesa(req, res));

router.put('/:id', (req, res) => controller.updateMesa(req, res));

router.delete('/:id', (req, res) => controller.deleteMesa(req, res));

export default router;