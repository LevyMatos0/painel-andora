import { verificarToken, identificarToken } from '../middlewares/auth.middleware.js';
import { Router } from 'express';
import { ServicoController } from '../controllers/servico.controller.js';
// Correção: adição de chaves { upload } para importar um 'named export'
import { upload } from '../middlewares/upload.js'; 

const router = Router();

router.get('/', identificarToken, ServicoController.listar);
router.post('/', verificarToken, upload.single('icone'), ServicoController.criar);
router.put('/:id', verificarToken, upload.single('icone'), ServicoController.atualizar);
router.delete('/:id', verificarToken, ServicoController.remover);

export default router;