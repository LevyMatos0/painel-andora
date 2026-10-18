import { rateLimit } from "express-rate-limit";

export function createLimits() {
  return {
    login: rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 10,
      skipSuccessfulRequests: true,
      standardHeaders: "draft-8",
      legacyHeaders: false,
      message: {
        mensagem:
          "Muitas tentativas de login. Aguarde 15 minutos e tente novamente.",
      },
    }),
    contact: rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 5,
      standardHeaders: "draft-8",
      legacyHeaders: false,
      message: {
        mensagem:
          "Muitas mensagens enviadas. Aguarde 15 minutos e tente novamente.",
      },
    }),
  };
}
