import { Router } from 'express';
import { TeamController } from '../controllers/team.controller.js';
import { upload } from '../middlewares/upload.js'; 

const router = Router();

router.get('/', TeamController.listar);
// O campo chama-se 'foto' no FormData do frontend
router.post('/', upload.single('foto'), TeamController.criar);
router.put('/:id', upload.single('foto'), TeamController.atualizar);
router.delete('/:id', TeamController.remover);

export default router;