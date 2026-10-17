import { pool } from '../config/database.js';

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
    const sql = `
      INSERT INTO tb_faq (faq_pergunta, faq_resposta, faq_ordem, faq_status)
      VALUES (?, ?, ?, ?)
    `;
    const [res] = await pool.query(sql, [
      dados.pergunta,
      dados.resposta,
      Number(dados.ordem || 0),
      dados.status ? 1 : 0
    ]);

    return { id: res.insertId, ...dados };
  },

  async atualizar(id, dados) {
    const sql = `
      UPDATE tb_faq SET
        faq_pergunta = ?,
        faq_resposta = ?,
        faq_ordem = ?,
        faq_status = ?
      WHERE faq_codigo = ?
    `;
    const [res] = await pool.query(sql, [
      dados.pergunta,
      dados.resposta,
      Number(dados.ordem),
      dados.status ? 1 : 0,
      id
    ]);

    return res.affectedRows > 0;
  },

  async excluir(id) {
    const [res] = await pool.query('DELETE FROM tb_faq WHERE faq_codigo = ?', [id]);
    return res.affectedRows > 0;
  }
};
