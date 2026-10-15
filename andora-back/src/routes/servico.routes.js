import { Router } from 'express';
import { ServicoController } from '../controllers/servico.controller.js';
// Correção: adição de chaves { upload } para importar um 'named export'
import { upload } from '../middlewares/upload.js'; 

const router = Router();

router.get('/', ServicoController.listar);
router.post('/', upload.single('icone'), ServicoController.criar);
router.put('/:id', upload.single('icone'), ServicoController.atualizar);
router.delete('/:id', ServicoController.remover);

export default router;