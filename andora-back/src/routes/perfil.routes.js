import { Router } from 'express';
import { UserController } from '../controllers/user.controller.js';
import { verificarToken } from '../middlewares/auth.middleware.js';

const router = Router();
router.get('/', verificarToken, UserController.perfil);

export default router;
