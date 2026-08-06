import { Router } from 'express';
import {detalle_comandaController } from '../controllers/detalle_comanda.controllers';    

const controller = new detalle_comandaController();
const router = Router();

router.get('/', (req, res) => controller.create(req, res));
router.post('/:id_comanda/:id_producto', (req, res) => controller.update(req, res));
router.patch('/:id_comanda/:id_producto', (req, res) => controller.delete(req, res));

export default router; // Exporta el router para que pueda ser utilizado en otros archivos 
