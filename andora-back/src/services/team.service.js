import { pool } from '../config/database.js';

export const TeamService = {
  async listarTodos() {
    // Força a listar sempre respeitando a ordem
    const [linhas] = await pool.query('SELECT * FROM tb_team ORDER BY tms_ordem ASC');
    return linhas;
  },

  async criar(dados) {
    const nomeImagem = dados.foto || dados.imagem || '';
    
    // CONVERSÃO BLINDADA: Garante que vira o número 1 ou 0 para o MySQL
    const isAtivo = (String(dados.status) === '1' || String(dados.status) === 'true' || dados.status === true) ? 1 : 0;
    const ordemVal = (dados.ordem !== undefined && dados.ordem !== '') ? Number(dados.ordem) : 1;

    const sql = `
      INSERT INTO tb_team 
      (tms_nome, tms_cargo, tms_apresentacao, tms_linkedin, tms_github, tms_imagem, tms_ordem, tms_status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
      dados.nome, 
      dados.cargo, 
      dados.texto || '', 
      dados.linkedin || '', 
      dados.github || '', 
      nomeImagem,       
      ordemVal, 
      isAtivo
    ];
    
    const [resultado] = await pool.query(sql, params);
    return { id: resultado.insertId, ...dados, foto: nomeImagem };
  },

  async atualizar(id, dados) {
    const nomeImagem = dados.foto || dados.imagem;
    
    // CONVERSÃO BLINDADA NO UPDATE TAMBÉM
    const isAtivo = (String(dados.status) === '1' || String(dados.status) === 'true' || dados.status === true) ? 1 : 0;
    const ordemVal = (dados.ordem !== undefined && dados.ordem !== '') ? Number(dados.ordem) : 1;

    let sql = `
      UPDATE tb_team 
      SET tms_nome = ?, tms_cargo = ?, tms_apresentacao = ?, tms_linkedin = ?, tms_github = ?, tms_ordem = ?, tms_status = ?
    `;
    
    const params = [
      dados.nome, 
      dados.cargo, 
      dados.texto || '', 
      dados.linkedin || '', 
      dados.github || '',
      ordemVal,
      isAtivo // O MySQL vai receber exatamente 1 ou 0
    ];
    
    if (nomeImagem) {
      sql += `, tms_imagem = ?`;
      params.push(nomeImagem);
    }
    
    sql += ` WHERE tms_codigo = ?`;
    params.push(id);

    await pool.query(sql, params);
    return { id, ...dados, foto: nomeImagem || undefined };
  },

  async excluir(id) {
    await pool.query('DELETE FROM tb_team WHERE tms_codigo = ?', [id]);
    return true;
  }
};