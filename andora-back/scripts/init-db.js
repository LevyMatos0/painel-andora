import { readFile } from "node:fs/promises";
import { pool, validateDatabaseEnvironment } from "../src/config/database.js";
import {
  translations,
  schemaColumns,
  checkSchema,
} from "../src/config/schema.js";

try {
  validateDatabaseEnvironment();
  const sql = await readFile(
    new URL("../sql/schema.sql", import.meta.url),
    "utf8",
  );
  const statements = sql.match(
    /CREATE TABLE IF NOT EXISTS `[a-z_]+`[\s\S]+?;/g,
  );
  if (statements?.length !== 8) throw Error("Arquivo de estrutura inválido.");
  await pool.query("SET NAMES utf8mb4");
  for (const statement of statements) await pool.query(statement);
  const columns = await schemaColumns(pool);
  for (const [table, fields] of Object.entries(translations)) {
    for (const [column, definition] of Object.entries(fields)) {
      if (!columns.has(`${table}.${column}`))
        await pool.query(
          `ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`,
        );
    }
  }
  await checkSchema(pool);
  console.log(
    "Banco preparado: oito tabelas e campos em inglês disponíveis; dados existentes preservados.",
  );
} catch (error) {
  console.error(
    "Falha ao preparar o banco. Confira conexão, permissões e compatibilidade do esquema.",
  );
  process.exitCode = 1;
} finally {
  await pool.end();
}
