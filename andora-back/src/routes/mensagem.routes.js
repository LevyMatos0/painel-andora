import { verificarToken } from '../middlewares/auth.middleware.js';
import { Router } from 'express';
import { MensagemController } from '../controllers/mensagem.controller.js';

const router = Router();

router.get('/', verificarToken, MensagemController.listar);
router.post('/', MensagemController.criar);
router.patch('/:id/status', verificarToken, MensagemController.alterarStatus);
router.delete('/:id', verificarToken, MensagemController.remover);

export default router;