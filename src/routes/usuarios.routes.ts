import { Router } from 'express';
import { UsuarioController } from '../controllers/usuario.controller';

const router = Router();
const controller = new UsuarioController();

router.get('/', (req, res) => controller.getUsuarios(req, res));
router.get('/:id', (req, res) => controller.getUsuarioById(req, res));
router.post('/', (req, res) => controller.createUsuario(req, res));
router.put('/:id', (req, res) => controller.updateUsuario(req, res));
router.delete('/:id', (req, res) => controller.deleteUsuario(req, res));

export default router;
