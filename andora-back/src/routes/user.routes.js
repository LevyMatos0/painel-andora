import { Router } from 'express';
import { UserController } from '../controllers/user.controller.js';
import { verificarToken } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/upload.js';

const router = Router();

// Todas as rotas de usuário exigem login
router.use(verificarToken);

router.get('/', UserController.listar);
router.get('/:id', UserController.validarProprioPerfil, UserController.perfil);
router.put('/:id/senha', UserController.validarProprioPerfil, UserController.alterarSenha);
router.post('/', upload.single('foto'), UserController.criar);
router.put('/:id', UserController.validarProprioPerfil, upload.single('foto'), UserController.atualizarPerfil);
router.patch('/:id', UserController.validarProprioPerfil, upload.single('foto'), UserController.atualizarPerfil);
router.delete('/:id', UserController.remover);

export default router;
