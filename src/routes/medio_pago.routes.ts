import { Router } from "express";
import { medio_pagoController } from "../controllers/medio_pago.controllers";
import { verificarRol } from "../middlewares/auth.middleware";

const controller = new medio_pagoController();
const router = Router();

// El Mozo los necesita para cobrar; solo el Administrador los modifica.
router.get("/", verificarRol('Administrador', 'Mozo'), (req, res) => controller.findAll(req, res));
router.post("/", verificarRol('Administrador'), (req, res) => controller.create(req, res));
router.put("/:id", verificarRol('Administrador'), (req, res) => controller.update(req, res));
router.delete("/:id", verificarRol('Administrador'), (req, res) => controller.delete(req, res));

export default router;
