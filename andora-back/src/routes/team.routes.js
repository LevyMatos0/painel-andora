import { verificarToken, identificarToken } from '../middlewares/auth.middleware.js';
import { Router } from 'express';
import { TeamController } from '../controllers/team.controller.js';
import { upload } from '../middlewares/upload.js'; 

const router = Router();

router.get('/', identificarToken, TeamController.listar);
// O campo chama-se 'foto' no FormData do frontend
router.post('/', verificarToken, upload.single('foto'), TeamController.criar);
router.put('/:id', verificarToken, upload.single('foto'), TeamController.atualizar);
router.delete('/:id', verificarToken, TeamController.remover);

export default router;