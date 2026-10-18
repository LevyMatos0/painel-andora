import { mkdir, access } from "node:fs/promises";
import { constants } from "node:fs";
import app from "./app.js";
import { config, validateConfig } from "./config/environment.js";
import { pool, validateDatabaseEnvironment } from "./config/database.js";

try {
  validateConfig(config);
  validateDatabaseEnvironment();
  await mkdir(config.uploadsDir, { recursive: true });
  await access(config.uploadsDir, constants.W_OK);
  const server = app.listen(config.port, "0.0.0.0", () =>
    console.log(`API Andora na porta ${config.port}.`),
  );
  server.on("error", () => {
    console.error(
      "Não foi possível iniciar a API. Verifique a porta configurada.",
    );
    process.exit(1);
  });
  let stopping = false;
  function shutdown() {
    if (stopping) return;
    stopping = true;
    const timeout = setTimeout(() => process.exit(1), 10000);
    timeout.unref();
    server.close(async () => {
      await pool.end();
      clearTimeout(timeout);
      process.exit(0);
    });
  }
  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
} catch (error) {
  console.error(
    error.code
      ? "Não foi possível preparar UPLOAD_DIR. Verifique o volume e suas permissões."
      : error.message,
  );
  await pool.end();
  process.exit(1);
}
