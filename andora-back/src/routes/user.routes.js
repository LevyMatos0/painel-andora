import { Router } from 'express';
import { UserController } from '../controllers/user.controller.js';
import { verificarToken } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/upload.js';

const router = Router();

// Todas as rotas de usuário exigem login
router.use(verificarToken);

router.get('/', UserController.listar);
router.post('/', upload.single('foto'), UserController.criar);
router.delete('/:id', UserController.remover);

export default router;