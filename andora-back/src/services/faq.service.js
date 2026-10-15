import { pool } from '../config/database.js';

export const FaqService = {
  async listarTodos(somenteAtivos = false) {
    let sql = `
      SELECT 
        faq_codigo AS id,
        faq_pergunta AS pergunta,
        faq_resposta AS resposta,
        faq_ordem AS ordem,
        faq_status AS status
      FROM tb_faq
    `;
    
    if (somenteAtivos) {
      sql += ' WHERE faq_status = 1';
    }

    sql += ' ORDER BY faq_ordem ASC, faq_codigo DESC';

    const [linhas] = await pool.query(sql);
    return linhas;
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