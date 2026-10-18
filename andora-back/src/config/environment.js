import "dotenv/config";
import path from "node:path";
import { fileURLToPath } from "node:url";

const backendRoot = fileURLToPath(new URL("../../", import.meta.url));
export function loadConfig(env = process.env) {
  const production = env.NODE_ENV === "production";
  const origins = [
    env.FRONTEND_URLS || env.FRONTEND_URL || "",
    ...(production
      ? []
      : [
          "http://localhost:5173,http://localhost:5174,http://127.0.0.1:5173,http://127.0.0.1:5174",
        ]),
  ]
    .join(",")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)
    .map((value) => {
      try {
        const url = new URL(value);
        if (
          !["http:", "https:"].includes(url.protocol) ||
          url.username ||
          url.password ||
          url.pathname !== "/" ||
          url.search ||
          url.hash ||
          (production && url.protocol !== "https:")
        )
          throw Error();
        return url.origin;
      } catch {
        throw Error(
          "FRONTEND_URLS deve conter origens HTTP(S) válidas, sem caminhos, separadas por vírgulas; em produção, use HTTPS.",
        );
      }
    });
  const trustProxy = Number(env.TRUST_PROXY_HOPS || 0);
  if (!Number.isInteger(trustProxy) || trustProxy < 0 || trustProxy > 5)
    throw Error("TRUST_PROXY_HOPS deve ser um número inteiro de 0 a 5.");
  return {
    production,
    port: Number(env.PORT || 3000),
    origins: [...new Set(origins)],
    trustProxy,
    uploadsDir: path.resolve(backendRoot, env.UPLOAD_DIR || "uploads"),
    explicitUploads: Boolean(env.UPLOAD_DIR && path.isAbsolute(env.UPLOAD_DIR)),
    jwtSecret: env.JWT_SECRET,
  };
}
export function validateConfig(config) {
  if (
    !config.jwtSecret ||
    config.jwtSecret.length < 32 ||
    /^(?:chave_super_secreta_andora|gere_uma_chave_segura|SUBSTITUA)/i.test(
      config.jwtSecret,
    )
  )
    throw Error(
      "Defina JWT_SECRET com uma chave aleatória de pelo menos 32 caracteres.",
    );
  if (!Number.isInteger(config.port) || config.port < 1 || config.port > 65535)
    throw Error("PORT deve ser uma porta válida.");
  if (config.production && !config.origins.length)
    throw Error(
      "Configure FRONTEND_URLS com os domínios HTTPS do painel e do site.",
    );
  if (config.production && !config.explicitUploads)
    throw Error(
      "Em produção, defina UPLOAD_DIR com o caminho absoluto do volume persistente.",
    );
}
export const config = loadConfig();
