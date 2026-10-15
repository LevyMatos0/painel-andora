import { Router } from 'express';
import { FaqController } from '../controllers/faq.controller.js';
import { verificarToken } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', FaqController.listar); // Pode ser público se o site consumir daqui
router.post('/', verificarToken, FaqController.criar);
router.put('/:id', verificarToken, FaqController.atualizar);
router.delete('/:id', verificarToken, FaqController.remover);

export default router;