import multer from 'multer';
import path from 'path';
import { mkdir } from 'node:fs';

// Configura o destino e o nome do arquivo
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    mkdir('uploads', { recursive: true }, erro => cb(erro, 'uploads/'));
  },
  filename: function (req, file, cb) {
    // Cria um nome único para evitar sobreposição de arquivos com o mesmo nome
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Filtro opcional para aceitar apenas imagens
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Formato de arquivo inválido. Envie apenas imagens.'));
  }
};

export const upload = multer({ storage, fileFilter });
