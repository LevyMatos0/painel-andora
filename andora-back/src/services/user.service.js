import { pool } from '../config/database.js';
import bcrypt from 'bcryptjs';

export const UserService = {
  async listarTodos() {
    const sql = `
      SELECT usr_codigo AS id, usr_nome AS nome, usr_email AS email, 
             usr_telefone AS telefone, usr_cargo AS cargo, 
             usr_foto AS foto, usr_bio AS bio
      FROM tb_user
    `;
    const [linhas] = await pool.query(sql);
    return linhas;
  },

  async criar(dados) {
    // Gera o hash da senha (custo 10 é o padrão seguro)
    const hashSenha = await bcrypt.hash(dados.senha, 10);

    const sql = `
      INSERT INTO tb_user (usr_nome, usr_email, usr_senha, usr_telefone, usr_cargo, usr_bio, usr_foto)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const [res] = await pool.query(sql, [
      dados.nome, 
      dados.email, 
      hashSenha, 
      dados.telefone || null, 
      dados.cargo, 
      dados.bio || null, 
      dados.foto || null
    ]);

    return { id: res.insertId, nome: dados.nome, email: dados.email, cargo: dados.cargo };
  },

  async excluir(id) {
    const [res] = await pool.query('DELETE FROM tb_user WHERE usr_codigo = ?', [id]);
    return res.affectedRows > 0;
  }
};