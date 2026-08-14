import { Router } from 'express';
import { homeControler } from '../controllers/home.controller';

const controller = new homeControler();
const router = Router();

router.get('/stats', (req, res) => controller.getStats(req, res));

export default router; 

