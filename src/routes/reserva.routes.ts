import { Router } from 'express';
import { ReservaController } from '../controllers/reserva.controller';

const router = Router();
const controller = new ReservaController();


router.get('/', (req, res) => controller.getReservas(req, res));

router.post('/', (req, res) => controller.createReserva(req, res));

router.patch('/:id/estado', (req, res) => controller.updateEstado(req, res));

router.patch('/:id/asignar-mesa', (req, res) => controller.updateReserva(req, res));


router.put('/:id', (req, res) => controller.updateReserva(req, res));

router.delete('/:id', (req, res) => controller.deleteReserva(req, res));

export default router;