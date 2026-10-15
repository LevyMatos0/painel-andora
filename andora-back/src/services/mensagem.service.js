import { pool } from '../config/database.js';

export const MensagemService = {
  async listarTodas() {
    const sql = `
      SELECT 
        msg_codigo AS id,
        msg_nome AS nome,
        msg_email AS email,
        msg_telefone AS telefone,
        msg_assunto AS assunto,
        msg_conteudo AS conteudo,
        msg_status AS status,
        msg_criado AS criado_em
      FROM tb_mensagem
      ORDER BY msg_criado DESC
    `;
    const [linhas] = await pool.query(sql);
    return linhas;
  },

  async criar(dados) {
    const sql = `
      INSERT INTO tb_mensagem (msg_nome, msg_email, msg_telefone, msg_assunto, msg_conteudo, msg_status)
      VALUES (?, ?, ?, ?, ?, 'nova')
    `;
    const [res] = await pool.query(sql, [
      dados.nome,
      dados.email,
      dados.telefone || null,
      dados.assunto,
      dados.conteudo
    ]);

    return {
      id: res.insertId,
      nome: dados.nome,
      email: dados.email,
      assunto: dados.assunto,
      conteudo: dados.conteudo,
      status: 'nova'
    };
  },

  async atualizarStatus(id, status) {
    const sql = 'UPDATE tb_mensagem SET msg_status = ? WHERE msg_codigo = ?';
    const [res] = await pool.query(sql, [status, id]);
    return res.affectedRows > 0;
  },

  async excluir(id) {
    const [res] = await pool.query('DELETE FROM tb_mensagem WHERE msg_codigo = ?', [id]);
    return res.affectedRows > 0;
  }
};