import { Router } from 'express';
import { MesaController } from '../controllers/mesa.controller';
import { verificarRol } from '../middlewares/auth.middleware';

const router = Router();
const controller = new MesaController();

// Consultas: Administrador y Mozo
router.get('/disponibles', verificarRol('Administrador', 'Mozo'), (req, res) => controller.getMesasDisponibles(req, res));
router.get('/', verificarRol('Administrador', 'Mozo'), (req, res) => controller.getMesas(req, res));
router.get('/:id', verificarRol('Administrador', 'Mozo'), (req, res) => controller.getMesaDetalle(req, res));

// Altas, bajas y modificaciones: solo Administrador
router.post('/', verificarRol('Administrador'), (req, res) => controller.createMesa(req, res));
router.put('/:id', verificarRol('Administrador'), (req, res) => controller.updateMesa(req, res));
router.delete('/:id', verificarRol('Administrador'), (req, res) => controller.deleteMesa(req, res));

export default router;
