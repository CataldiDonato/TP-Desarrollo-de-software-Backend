import { Router } from 'express';
import { comandaController } from '../controllers/comanda.controller';
import { verificarRol } from '../middlewares/auth.middleware';
import { mercadopagoService } from '../services/mercadopago.service';
import { parsePositiveId } from '../utils/validation';
import { getErrorResponse } from '../utils/app-error';

const mp = new mercadopagoService();
const controller = new comandaController();
const router = Router();

router.use(verificarRol('Administrador', 'Mozo'));

router.get('/', (req, res) => controller.findAll(req, res));
router.get('/:id', (req, res) => controller.findById(req, res));
router.post('/', (req, res) => controller.create(req, res));
router.patch('/:id/estado', (req, res) => controller.update(req, res));
router.post('/:id/mercadopago', async (req, res) => {
  try {
    const id = parsePositiveId(req.params.id, 'id');
    res.status(201).json(await mp.crearPreferencia(id));
  } catch (error) {
    const { statusCode, message } = getErrorResponse(error);
    res.status(statusCode).json({ message });
  }
});

export default router; // Exporta el router para que pueda ser utilizado en otros archivos
