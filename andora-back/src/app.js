import express from "express";
import cors from "cors";
import { config } from "./config/environment.js";
import { pool } from "./config/database.js";
import { checkSchema } from "./config/schema.js";
import { createLimits } from "./middlewares/rate-limit.js";
import authRoutes from "./routes/auth.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import siteRoutes from "./routes/site.routes.js";
import servicoRoutes from "./routes/servico.routes.js";
import teamRoutes from "./routes/team.routes.js";
import faqRoutes from "./routes/faq.routes.js";
import mensagemRoutes from "./routes/mensagem.routes.js";
import userRoutes from "./routes/user.routes.js";
import perfilRoutes from "./routes/perfil.routes.js";

export function createApp({ settings = config, database = pool } = {}) {
  const app = express();
  const limits = createLimits();
  app.disable("x-powered-by");
  app.set("trust proxy", settings.trustProxy);
  app.use((req, res, next) => {
    res.set({
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "X-Frame-Options": "DENY",
    });
    next();
  });
  app.use(
    cors({
      origin(origin, cb) {
        if (!origin || settings.origins.includes(origin)) return cb(null, true);
        const error = new Error("Origem não autorizada.");
        error.status = 403;
        cb(error);
      },
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      maxAge: 600,
    }),
  );
  app.use(express.json({ limit: "128kb" }));
  app.use(express.urlencoded({ extended: false, limit: "128kb" }));
  app.get("/health", async (req, res) => {
    res.set("Cache-Control", "no-store");
    try {
      await checkSchema(database);
      res.json({ status: "ok" });
    } catch {
      res.status(503).json({ status: "unavailable" });
    }
  });
  app.use(
    "/uploads",
    express.static(settings.uploadsDir, {
      dotfiles: "deny",
      index: false,
      maxAge: "1d",
    }),
  );
  app.use("/api", (req, res, next) => {
    res.set("Cache-Control", "no-store");
    next();
  });
  app.use("/api/auth/login", limits.login);
  app.use("/api/mensagens", (req, res, next) =>
    req.method === "POST" ? limits.contact(req, res, next) : next(),
  );
  app.use("/api/auth", authRoutes);
  app.use("/api/dashboard", dashboardRoutes);
  app.use("/api/site", siteRoutes);
  app.use("/api/servicos", servicoRoutes);
  app.use("/api/team", teamRoutes);
  app.use("/api/faqs", faqRoutes);
  app.use("/api/mensagens", mensagemRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/perfil", perfilRoutes);
  app.use((req, res) =>
    res.status(404).json({ mensagem: "Rota não encontrada." }),
  );
  app.use((error, req, res, next) => {
    const tooLarge =
      error.code === "LIMIT_FILE_SIZE" || error.type === "entity.too.large";
    const status = tooLarge
      ? 413
      : error.name === "MulterError"
        ? 400
        : Number.isInteger(error.status) &&
            error.status >= 400 &&
            error.status < 500
          ? error.status
          : 500;
    if (status === 500)
      console.error(
        "Falha interna da API:",
        /^[A-Z0-9_]+$/.test(error.code || "") ? error.code : "INTERNAL_ERROR",
      );
    const mensagem = tooLarge
      ? "O arquivo ou os dados excedem o tamanho permitido. Imagens: até 5 MB."
      : status === 500
        ? "Ocorreu um erro interno no servidor."
        : error.type === "entity.parse.failed"
          ? "Envie um JSON válido."
          : error.name === "MulterError"
            ? "Upload inválido. Envie uma imagem por vez, com até 5 MB."
            : error.message;
    res.status(status).json({ mensagem });
  });
  return app;
}
export default createApp();
