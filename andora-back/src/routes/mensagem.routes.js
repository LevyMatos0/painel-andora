import { Router } from 'express';
import { MensagemController } from '../controllers/mensagem.controller.js';

const router = Router();

router.get('/', MensagemController.listar);
router.post('/', MensagemController.criar);
router.patch('/:id/status', MensagemController.alterarStatus);
router.delete('/:id', MensagemController.remover);

export default router;