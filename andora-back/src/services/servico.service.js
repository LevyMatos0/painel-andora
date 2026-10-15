import { pool } from '../config/database.js';

export const ServicoService = {
  async listarTodos() {
    const [linhas] = await pool.query('SELECT * FROM tb_servico ORDER BY srv_ordem ASC');
    return linhas;
  },

  async criar(dados) {
    // Verifica a string 'true' enviada pelo Frontend
    const isAtivo = dados.ativo === 'true' ? 1 : 0;
    
    const sql = `
      INSERT INTO tb_servico 
      (srv_titulo, srv_descricao, srv_informacoes, srv_icone, srv_ordem, srv_ativo) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const params = [
      dados.titulo, 
      dados.descricao, 
      dados.informacoes || '', 
      dados.icone || null, 
      dados.ordem || 1, 
      isAtivo
    ];
    
    const [resultado] = await pool.query(sql, params);
    return { id: resultado.insertId, ...dados };
  },

  async atualizar(id, dados) {
    // Verifica a string 'true' enviada pelo Frontend
    const isAtivo = dados.ativo === 'true' ? 1 : 0;

    // Repare que aqui indicamos claramente ao MySQL para atualizar o srv_ativo
    let sql = `
      UPDATE tb_servico 
      SET srv_titulo = ?, srv_descricao = ?, srv_informacoes = ?, srv_ordem = ?, srv_ativo = ?
    `;
    const params = [
      dados.titulo, 
      dados.descricao, 
      dados.informacoes || '', 
      dados.ordem || 1, 
      isAtivo // Passa o 1 ou 0 para o MySQL
    ];

    if (dados.icone) {
      sql += `, srv_icone = ?`;
      params.push(dados.icone);
    }

    sql += ` WHERE srv_codigo = ?`;
    params.push(id);

    await pool.query(sql, params);
    return { id, ...dados };
  },

  async excluir(id) {
    await pool.query('DELETE FROM tb_servico WHERE srv_codigo = ?', [id]);
    return true;
  }
};