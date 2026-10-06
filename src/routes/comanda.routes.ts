import { Router } from 'express';
import { comandaController } from '../controllers/comanda.controller';
import { verificarRol } from '../middlewares/auth.middleware';

const controller = new comandaController();
const router = Router();

router.use(verificarRol('Administrador', 'Mozo'));

router.get('/', (req, res) => controller.findAll(req, res));
router.get('/:id', (req, res) => controller.findById(req, res));
router.post('/', (req, res) => controller.create(req, res));
router.patch('/:id/estado', (req, res) => controller.update(req, res));

export default router; // Exporta el router para que pueda ser utilizado en otros archivos
