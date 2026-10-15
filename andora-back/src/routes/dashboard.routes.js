import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller.js';
import { verificarToken } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', verificarToken, DashboardController.resumo);

export default router;