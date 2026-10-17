import { pool } from '../config/database.js';
import bcrypt from 'bcryptjs';

// Shared by listing, registration and login. Never return the password hash.
export function publicUser(row) {
  return {
    id: row.usr_codigo,
    nome: row.usr_nome,
    email: row.usr_email,
    telefone: row.usr_telefone,
    cargo: row.usr_cargo,
    cargo_ingles: row.usr_cargo_ingles,
    foto: row.usr_foto,
    bio: row.usr_bio,
    bio_ingles: row.usr_bio_ingles,
  };
}

export const UserService = {
  async listarTodos() {
    const sql = 'SELECT * FROM tb_user';
    const [linhas] = await pool.query(sql);
    return linhas.map(publicUser);
  },

  async criar(dados) {
    // Gera o hash da senha (custo 10 é o padrão seguro)
    const hashSenha = await bcrypt.hash(dados.senha, 10);

    const fields = {
      usr_nome: dados.nome,
      usr_email: dados.email,
      usr_senha: hashSenha,
      usr_telefone: dados.telefone || null,
      usr_cargo: dados.cargo,
      usr_bio: dados.bio || null,
      usr_foto: dados.foto || null,
    };
    for (const [field, column] of Object.entries({
      cargo_ingles: 'usr_cargo_ingles',
      bio_ingles: 'usr_bio_ingles',
    })) {
      const key = Object.hasOwn(dados, field) ? field : column;
      if (Object.hasOwn(dados, key) && dados[key] !== undefined) fields[column] = dados[key];
    }
    const columns = Object.keys(fields);
    const [res] = await pool.query(
      `INSERT INTO tb_user (${columns.join(', ')}) VALUES (${columns.map(() => '?').join(', ')})`,
      Object.values(fields)
    );

    const [rows] = await pool.query('SELECT * FROM tb_user WHERE usr_codigo = ?', [res.insertId]);
    return publicUser(rows[0]);
  },

  async excluir(id) {
    const [res] = await pool.query('DELETE FROM tb_user WHERE usr_codigo = ?', [id]);
    return res.affectedRows > 0;
  }
};
