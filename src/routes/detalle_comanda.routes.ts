import { Router } from 'express';
import { detalle_comandaController } from '../controllers/detalle_comanda.controllers';
import { verificarRol } from '../middlewares/auth.middleware';

const controller = new detalle_comandaController();
const router = Router();

router.use(verificarRol('Administrador', 'Mozo'));

router.post('/', (req, res) => controller.create(req, res));
router.put('/:id_comanda/:id_producto', (req, res) => controller.update(req, res));
router.delete('/:id_comanda/:id_producto', (req, res) => controller.delete(req, res));

export default router; // Exporta el router para que pueda ser utilizado en otros archivos
