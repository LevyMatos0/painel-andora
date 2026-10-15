import { Router } from 'express';
import { SiteController } from '../controllers/site.controller.js';
import { verificarToken } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/upload.js';
const router = Router();

// Rota pública para carregar o site
router.get('/', SiteController.buscar);

// Rota protegida para guardar os dados (com suporte a upload de imagem)
router.post('/', verificarToken, upload.single('imagem'), SiteController.salvar);

export default router;