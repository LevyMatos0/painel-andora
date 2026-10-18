import mysql from "mysql2/promise";
import "dotenv/config";

export function databaseOptions(env = process.env) {
  const options = {
    host: env.DB_HOST || env.MYSQLHOST || "localhost",
    user: env.DB_USER || env.MYSQLUSER || "root",
    password: env.DB_PASSWORD || env.MYSQLPASSWORD || "",
    database: env.DB_NAME || env.MYSQLDATABASE || "andora_db",
    port: Number(env.DB_PORT || env.MYSQLPORT || 3306),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 20,
    connectTimeout: 10000,
    multipleStatements: false,
  };
  if (env.DB_SSL === "true")
    options.ssl = {
      rejectUnauthorized: true,
      ...(env.DB_SSL_CA ? { ca: env.DB_SSL_CA.replace(/\\n/g, "\n") } : {}),
    };
  return options;
}
export function validateDatabaseEnvironment(env = process.env) {
  if (env.NODE_ENV !== "production") return;
  for (const [field, alias] of Object.entries({
    DB_HOST: "MYSQLHOST",
    DB_USER: "MYSQLUSER",
    DB_PASSWORD: "MYSQLPASSWORD",
    DB_NAME: "MYSQLDATABASE",
  })) {
    if (!env[field] && !env[alias])
      throw Error(`Configure ${field} ou ${alias} no serviço da API.`);
  }
}
export const pool = mysql.createPool(databaseOptions());
