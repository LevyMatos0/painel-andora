export const translations = {
  tb_user: {
    usr_cargo_ingles: "VARCHAR(30) NULL",
    usr_bio_ingles: "TEXT NULL",
  },
  tb_hero: {
    her_titulo_ingles: "VARCHAR(150) NULL",
    her_descricao_ingles: "TEXT NULL",
  },
  tb_about: {
    abt_titulo_ingles: "VARCHAR(125) NULL",
    abt_texto_ingles: "TEXT NULL",
  },
  tb_servico: {
    srv_titulo_ingles: "VARCHAR(100) NULL",
    srv_descricao_ingles: "TEXT NULL",
    srv_informacoes_ingles: "TEXT NULL",
  },
  tb_team: {
    tms_cargo_ingles: "VARCHAR(45) NULL",
    tms_apresentacao_ingles: "TEXT NULL",
  },
  tb_faq: {
    faq_pergunta_ingles: "VARCHAR(255) NULL",
    faq_resposta_ingles: "TEXT NULL",
  },
};
const baseColumns = {
  tb_user: [
    "usr_codigo",
    "usr_email",
    "usr_senha",
    "usr_nome",
    "usr_cargo",
    "usr_telefone",
    "usr_foto",
    "usr_bio",
  ],
  tb_hero: ["her_codigo", "her_titulo", "her_descricao", "her_imagem"],
  tb_about: ["abt_codigo", "abt_titulo", "abt_texto", "abt_imagem"],
  tb_contato: [
    "cto_codigo",
    "cto_endereco",
    "cto_email",
    "cto_telefone",
    "cto_mapa",
  ],
  tb_servico: [
    "srv_codigo",
    "srv_titulo",
    "srv_descricao",
    "srv_informacoes",
    "srv_icone",
    "srv_ativo",
    "srv_ordem",
  ],
  tb_team: [
    "tms_codigo",
    "tms_nome",
    "tms_cargo",
    "tms_apresentacao",
    "tms_imagem",
    "tms_status",
    "tms_ordem",
    "tms_linkedin",
    "tms_github",
  ],
  tb_faq: [
    "faq_codigo",
    "faq_pergunta",
    "faq_resposta",
    "faq_status",
    "faq_ordem",
  ],
  tb_mensagem: [
    "msg_codigo",
    "msg_nome",
    "msg_email",
    "msg_telefone",
    "msg_assunto",
    "msg_conteudo",
    "msg_status",
    "msg_criado",
  ],
};
export async function schemaColumns(database) {
  const [rows] = await database.query(
    "SELECT TABLE_NAME AS tableName, COLUMN_NAME AS columnName FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE()",
  );
  return new Set(rows.map((row) => `${row.tableName}.${row.columnName}`));
}
export async function checkSchema(database) {
  const columns = await schemaColumns(database);
  for (const [table, fields] of Object.entries(baseColumns)) {
    for (const field of [
      ...fields,
      ...Object.keys(translations[table] || {}),
    ]) {
      if (!columns.has(`${table}.${field}`))
        throw Error(
          "Banco incompleto. Execute npm run db:init no serviço da API.",
        );
    }
  }
}
