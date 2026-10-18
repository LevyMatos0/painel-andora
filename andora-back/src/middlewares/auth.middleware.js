import jwt from "jsonwebtoken";
import { config } from "../config/environment.js";

export function verificarToken(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer "))
    return res
      .status(401)
      .json({ mensagem: "Acesso negado. Token não fornecido." });
  try {
    const payload = jwt.verify(header.slice(7), config.jwtSecret, {
      algorithms: ["HS256"],
    });
    if (!payload || !Number.isInteger(payload.id) || payload.id <= 0)
      throw Error("Invalid subject");
    req.utilizador = payload;
    res.set("Cache-Control", "no-store");
    next();
  } catch {
    return res.status(401).json({ mensagem: "Token inválido ou expirado." });
  }
}

// Public content can be read anonymously; a logged-in panel may also see drafts.
export function identificarToken(req, res, next) {
  if (!req.headers.authorization) return next();
  return verificarToken(req, res, next);
}
