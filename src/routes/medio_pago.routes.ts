import { Router } from "express";
import { medio_pagoController } from "../controllers/medio_pago.controllers";

const controller = new medio_pagoController();
const router = Router();

router.get("/", (req, res) => controller.findAll(req, res));

export default router;

