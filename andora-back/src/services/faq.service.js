import { pool } from '../config/database.js';

function englishFields(dados) {
  const fields = {};
  for (const [field, column] of Object.entries({
    pergunta_ingles: 'faq_pergunta_ingles',
    resposta_ingles: 'faq_resposta_ingles',
  })) {
    const key = Object.hasOwn(dados, field) ? field : column;
    if (Object.hasOwn(dados, key) && dados[key] !== undefined) fields[column] = dados[key];
  }
  return fields;
}

export const FaqService = {
  async listarTodos(somenteAtivos = false) {
    let sql = `
      SELECT * FROM tb_faq
    `;
    
    if (somenteAtivos) {
      sql += ' WHERE faq_status = 1';
    }

    sql += ' ORDER BY faq_ordem ASC, faq_codigo DESC';

    const [linhas] = await pool.query(sql);
    // Keep the public aliases and expose optional translations without requiring
    // the new columns in older development databases.
    return linhas.map(faq => ({
      id: faq.faq_codigo,
      pergunta: faq.faq_pergunta,
      pergunta_ingles: faq.faq_pergunta_ingles,
      resposta: faq.faq_resposta,
      resposta_ingles: faq.faq_resposta_ingles,
      ordem: faq.faq_ordem,
      status: faq.faq_status,
    }));
  },

  async criar(dados) {
    const fields = {
      faq_pergunta: dados.pergunta,
      faq_resposta: dados.resposta,
      faq_ordem: Number(dados.ordem || 0),
      faq_status: dados.status ? 1 : 0,
      ...englishFields(dados),
    };
    const columns = Object.keys(fields);
    const [res] = await pool.query(
      `INSERT INTO tb_faq (${columns.join(', ')}) VALUES (${columns.map(() => '?').join(', ')})`,
      Object.values(fields)
    );

    return { id: res.insertId, ...dados };
  },

  async atualizar(id, dados) {
    const fields = {
      faq_pergunta: dados.pergunta,
      faq_resposta: dados.resposta,
      faq_ordem: Number(dados.ordem),
      faq_status: dados.status ? 1 : 0,
      ...englishFields(dados),
    };
    const [res] = await pool.query(
      `UPDATE tb_faq SET ${Object.keys(fields).map(column => `${column} = ?`).join(', ')} WHERE faq_codigo = ?`,
      [...Object.values(fields), id]
    );

    return res.affectedRows > 0;
  },

  async excluir(id) {
    const [res] = await pool.query('DELETE FROM tb_faq WHERE faq_codigo = ?', [id]);
    return res.affectedRows > 0;
  }
};
