import test from "node:test";
import assert from "node:assert/strict";
import { once } from "node:events";
import jwt from "jsonwebtoken";

process.env.JWT_SECRET ||= "test-only-key-with-more-than-thirty-two-characters";
const { createApp } = await import("../src/app.js");
const { config, loadConfig, validateConfig } = await import(
  "../src/config/environment.js"
);
const { databaseOptions, pool, validateDatabaseEnvironment } = await import(
  "../src/config/database.js"
);
const { checkSchema } = await import("../src/config/schema.js");

async function withServer(run) {
  const app = createApp({
    settings: {
      ...config,
      origins: ["https://panel.example", "https://site.example"],
      trustProxy: 1,
    },
  });
  const server = app.listen(0, "127.0.0.1");
  await once(server, "listening");
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    await run(base);
  } finally {
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
  }
}

test("produção exige chave privada configurada, origens HTTPS e volume absoluto", () => {
  const valid = {
    NODE_ENV: "production",
    JWT_SECRET: "a".repeat(64),
    FRONTEND_URLS: "https://panel.example/, https://site.example",
    UPLOAD_DIR: "/data/uploads",
  };
  assert.doesNotThrow(() => validateConfig(loadConfig(valid)));
  for (const patch of [
    { JWT_SECRET: "" },
    { JWT_SECRET: "chave_super_secreta_andora" },
    { JWT_SECRET: "SUBSTITUA_".repeat(8) },
    { FRONTEND_URLS: "" },
    { UPLOAD_DIR: "" },
    { UPLOAD_DIR: "uploads" },
  ]) {
    assert.throws(() => validateConfig(loadConfig({ ...valid, ...patch })));
  }
  for (const origin of [
    "*",
    "http://panel.example",
    "https://panel.example/path",
    "https://user:password@panel.example",
  ])
    assert.throws(() => loadConfig({ ...valid, FRONTEND_URLS: origin }));
  assert.throws(() => loadConfig({ ...valid, TRUST_PROXY_HOPS: "true" }));
});

test("banco aceita nomes do Railway e mantém verificação TLS habilitada", () => {
  const data = databaseOptions({
    MYSQLHOST: "mysql.internal",
    MYSQLPORT: "3306",
    MYSQLUSER: "api",
    MYSQLPASSWORD: "test-only",
    MYSQLDATABASE: "railway",
    DB_SSL: "true",
  });
  assert.equal(data.host, "mysql.internal");
  assert.equal(data.database, "railway");
  assert.equal(data.ssl.rejectUnauthorized, true);
  assert.equal(data.multipleStatements, false);
  assert.throws(() => validateDatabaseEnvironment({ NODE_ENV: "production" }));
});

test("rotas administrativas recusam chamadas sem token antes de ler ou alterar dados", async () => {
  await withServer(async (base) => {
    const routes = [
      ["GET", "mensagens"],
      ["PATCH", "mensagens/1/status"],
      ["DELETE", "mensagens/1"],
      ["POST", "servicos"],
      ["PUT", "servicos/1"],
      ["DELETE", "servicos/1"],
      ["POST", "team"],
      ["PUT", "team/1"],
      ["DELETE", "team/1"],
      ["POST", "site"],
      ["POST", "faqs"],
      ["PUT", "faqs/1"],
      ["DELETE", "faqs/1"],
      ["GET", "users"],
      ["POST", "users"],
      ["DELETE", "users/1"],
      ["GET", "perfil"],
      ["PUT", "perfil"],
      ["PUT", "perfil/senha"],
      ["GET", "dashboard"],
    ];
    for (const [method, path] of routes) {
      const response = await fetch(`${base}/api/${path}`, { method });
      assert.equal(response.status, 401, `${method} ${path}`);
      assert.equal(response.headers.get("x-powered-by"), null);
    }
    const forged = jwt.sign({ id: 1 }, "chave_super_secreta_andora");
    for (const token of [
      forged,
      "not-a-token",
      jwt.sign({ id: 1 }, config.jwtSecret, { expiresIn: -1 }),
      jwt.sign({ id: "bad" }, config.jwtSecret),
    ]) {
      const response = await fetch(`${base}/api/mensagens`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      assert.equal(response.status, 401);
    }
  });
});

test("CORS libera apenas domínios configurados, inclusive preflight com Authorization", async () => {
  await withServer(async (base) => {
    const response = await fetch(`${base}/api/perfil`, {
      method: "OPTIONS",
      headers: {
        Origin: "https://panel.example",
        "Access-Control-Request-Method": "PUT",
        "Access-Control-Request-Headers": "authorization,content-type",
      },
    });
    assert.equal(response.status, 204);
    assert.equal(
      response.headers.get("access-control-allow-origin"),
      "https://panel.example",
    );
    assert.match(
      response.headers.get("access-control-allow-headers"),
      /Authorization/,
    );
    const blocked = await fetch(`${base}/api/mensagens`, {
      headers: { Origin: "https://untrusted.example" },
    });
    assert.equal(blocked.status, 403);
    assert.equal(blocked.headers.get("access-control-allow-origin"), null);
    const unauthenticated = await fetch(`${base}/api/mensagens`, {
      headers: { Origin: "https://panel.example" },
    });
    assert.equal(unauthenticated.status, 401);
  });
});

test("mensagem pública continua acessível e limita abuso por IP; não exige login", async () => {
  await withServer(async (base) => {
    for (let i = 0; i < 5; i++) {
      const response = await fetch(`${base}/api/mensagens`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{}",
      });
      assert.equal(response.status, 400);
    }
    const limited = await fetch(`${base}/api/mensagens`, { method: "POST" });
    assert.equal(limited.status, 429);
    const another = await fetch(`${base}/api/mensagens`, {
      method: "POST",
      headers: {
        "X-Forwarded-For": "192.0.2.10",
        "Content-Type": "application/json",
      },
      body: "{}",
    });
    assert.equal(another.status, 400);
  });
});

test("login limita tentativas sem bloquear conteúdo público", async () => {
  await withServer(async (base) => {
    for (let i = 0; i < 10; i++)
      assert.equal(
        (
          await fetch(`${base}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: "{}",
          })
        ).status,
        400,
      );
    assert.equal(
      (await fetch(`${base}/api/auth/login`, { method: "POST" })).status,
      429,
    );
    assert.equal(
      (
        await fetch(`${base}/api/site`, {
          method: "OPTIONS",
          headers: {
            Origin: "https://site.example",
            "Access-Control-Request-Method": "GET",
          },
        })
      ).status,
      204,
    );
  });
});

test("token válido abre mensagens e upload rejeita formato ativo e arquivos grandes", async (t) => {
  t.mock.method(pool, "query", async () => [[]]);
  const headers = {
    Authorization: `Bearer ${jwt.sign({ id: 1 }, config.jwtSecret)}`,
  };
  await withServer(async (base) => {
    assert.equal(
      (await fetch(`${base}/api/mensagens`, { headers })).status,
      200,
    );
    const invalid = new FormData();
    invalid.set(
      "foto",
      new Blob(['<svg onload="alert(1)"/>'], { type: "image/svg+xml" }),
      "image.svg",
    );
    assert.equal(
      (
        await fetch(`${base}/api/perfil`, {
          method: "PUT",
          headers,
          body: invalid,
        })
      ).status,
      400,
    );
    const large = new FormData();
    large.set(
      "foto",
      new Blob([new Uint8Array(5 * 1024 * 1024 + 1)], { type: "image/png" }),
      "large.png",
    );
    assert.equal(
      (
        await fetch(`${base}/api/perfil`, {
          method: "PUT",
          headers,
          body: large,
        })
      ).status,
      413,
    );
  });
});

test("health não considera um banco sem tabelas pronto", async () => {
  await assert.rejects(checkSchema({ query: async () => [[]] }), /Banco incompleto/);
  const app = createApp({ database: { query: async () => { throw Error("private connection details"); } } });
  const server = app.listen(0, "127.0.0.1");
  await once(server, "listening");
  try {
    const response = await fetch(`http://127.0.0.1:${server.address().port}/health`);
    assert.equal(response.status, 503);
    assert.deepEqual(await response.json(), { status: "unavailable" });
  } finally {
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
  }
});
