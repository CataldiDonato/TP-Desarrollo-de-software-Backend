import { Router } from 'express';
import { ReservaController } from '../controllers/reserva.controller';
import { verificarRol } from '../middlewares/auth.middleware';

const router = Router();
const controller = new ReservaController();

router.use(verificarRol('Administrador', 'Mozo'));

router.get('/', (req, res) => controller.getReservas(req, res));
router.post('/', (req, res) => controller.createReserva(req, res));
router.put('/:id', (req, res) => controller.updateReserva(req, res));
router.patch('/:id/estado', (req, res) => controller.updateEstado(req, res));
// Cambiar la mesa es una edición parcial: reutiliza updateReserva mandando solo { id_mesa }.
router.patch('/:id/asignar-mesa', (req, res) => controller.updateReserva(req, res));
router.delete('/:id', (req, res) => controller.deleteReserva(req, res));

export default router;
