import { Router } from 'express';
import { CocinaController } from '../controllers/cocina.controller';
import { verificarRol } from '../middlewares/auth.middleware';

const router = Router();
const controller = new CocinaController();

// El Administrador puede mirar la cocina, pero solo un Cocinero cambia el estado de los platos.
router.get('/pedidos', verificarRol('Administrador', 'Cocinero'), (req, res) => controller.getPedidosActivos(req, res));
router.get('/comandas/:id', verificarRol('Administrador', 'Cocinero'), (req, res) => controller.getComanda(req, res));
router.patch('/detalles/estado', verificarRol('Cocinero'), (req, res) => controller.actualizarEstado(req, res));
// middleware verificarRol: si el rol del usuario no está en la lista de roles permitidos, devuelve un 403 y no deja continuar. Si el rol es correcto, pasa al siguiente middleware o ruta.
export default router;
