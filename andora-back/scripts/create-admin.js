import { createInterface } from "node:readline/promises";
import { Writable } from "node:stream";
import { pool, validateDatabaseEnvironment } from "../src/config/database.js";
import { UserService } from "../src/services/user.service.js";

let muted = false;
const output = new Writable({
  write(chunk, encoding, cb) {
    if (!muted) process.stdout.write(chunk);
    cb();
  },
});
const terminal = createInterface({
  input: process.stdin,
  output,
  terminal: Boolean(process.stdin.isTTY),
});
try {
  validateDatabaseEnvironment();
  const nome = process.env.ADMIN_NAME || (await terminal.question("Nome: "));
  const email =
    process.env.ADMIN_EMAIL || (await terminal.question("E-mail: "));
  let senha = process.env.ADMIN_PASSWORD;
  if (!senha) {
    process.stdout.write("Senha (mínimo 12 caracteres; não será exibida): ");
    muted = true;
    senha = await terminal.question("");
    muted = false;
    process.stdout.write("\n");
  }
  if (
    !nome.trim() ||
    nome.length > 225 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    email.length > 225 ||
    senha.length < 12 ||
    senha.length > 1024
  )
    throw Error();
  await UserService.criar({
    nome: nome.trim(),
    email: email.trim(),
    senha,
    cargo: "Administrador",
  });
  console.log("Administrador criado. Entre no painel com os dados informados.");
} catch {
  console.error(
    "Não foi possível criar o administrador. Confira os campos, a conexão e se o e-mail já está cadastrado. Nenhuma senha existente foi alterada.",
  );
  process.exitCode = 1;
} finally {
  muted = false;
  terminal.close();
  await pool.end();
}
