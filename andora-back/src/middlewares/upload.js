import multer from "multer";
import { mkdir } from "node:fs";
import { randomUUID } from "node:crypto";
import { config } from "../config/environment.js";

const formats = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
  ["image/gif", ".gif"],
]);
const storage = multer.diskStorage({
  destination(req, file, cb) {
    mkdir(config.uploadsDir, { recursive: true }, (error) =>
      cb(error, config.uploadsDir),
    );
  },
  filename(req, file, cb) {
    cb(null, randomUUID() + formats.get(file.mimetype));
  },
});
export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
    fields: 40,
    fieldSize: 128 * 1024,
  },
  fileFilter(req, file, cb) {
    if (formats.has(file.mimetype)) return cb(null, true);
    const error = new Error(
      "Envie uma imagem PNG, JPEG, WebP ou GIF de até 5 MB.",
    );
    error.status = 400;
    cb(error);
  },
});
