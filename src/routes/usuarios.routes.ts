import { Router } from 'express';
import { UsuarioController } from '../controllers/usuario.controller';
import { verificarRol } from '../middlewares/auth.middleware';

const router = Router();
const controller = new UsuarioController();

router.use(verificarRol('Administrador'));

router.get('/', (req, res) => controller.getUsuarios(req, res));
router.get('/:id', (req, res) => controller.getUsuarioById(req, res));
router.post('/', (req, res) => controller.createUsuario(req, res));
router.put('/:id', (req, res) => controller.updateUsuario(req, res));
router.delete('/:id', (req, res) => controller.deleteUsuario(req, res));

export default router;
