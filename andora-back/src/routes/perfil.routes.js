import { Router } from 'express';
import { UserController } from '../controllers/user.controller.js';
import { verificarToken } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/upload.js';

const router = Router();
router.get('/', verificarToken, UserController.perfil);
router.put('/senha', verificarToken, UserController.alterarSenha);
router.put('/', verificarToken, upload.single('foto'), UserController.atualizarPerfil);
router.patch('/', verificarToken, upload.single('foto'), UserController.atualizarPerfil);

export default router;
