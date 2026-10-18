import { pool } from '../config/database.js';
import bcrypt from 'bcryptjs';
import { badRequest, pickFields, validateText } from '../utils/persistence.js';

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
  async buscarPorId(id) {
    const [rows] = await pool.query('SELECT * FROM tb_user WHERE usr_codigo = ?', [id]);
    return rows[0] ? publicUser(rows[0]) : null;
  },

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
  },

  async alterarSenha(id, senhaAtual, novaSenha) {
    if (typeof senhaAtual !== 'string' || !senhaAtual || typeof novaSenha !== 'string' || !novaSenha) {
      throw badRequest('Informe a senha atual e a nova senha.');
    }
    const [rows] = await pool.query('SELECT usr_senha FROM tb_user WHERE usr_codigo = ?', [id]);
    if (!rows[0]) return false;
    if (!await bcrypt.compare(senhaAtual, rows[0].usr_senha)) throw badRequest('A senha atual está incorreta.');
    const hash = await bcrypt.hash(novaSenha, 10);
    await pool.query('UPDATE tb_user SET usr_senha = ? WHERE usr_codigo = ?', [hash, id]);
    return true;
  },

  async atualizar(id, dados) {
    const fields = pickFields(dados, {
      usr_nome: ['nome', 'usr_nome'],
      usr_email: ['email', 'usr_email'],
      usr_telefone: ['telefone', 'usr_telefone'],
      usr_cargo: ['cargo', 'usr_cargo'],
      usr_cargo_ingles: ['cargo_ingles', 'usr_cargo_ingles'],
      usr_bio: ['bio', 'usr_bio'],
      usr_bio_ingles: ['bio_ingles', 'usr_bio_ingles'],
      usr_foto: ['foto', 'usr_foto'],
    });
    validateText(fields, ['usr_nome', 'usr_email', 'usr_cargo']);
    if (fields.usr_email) fields.usr_email = fields.usr_email.trim();
    if (fields.usr_foto === '') delete fields.usr_foto;
    const password = Object.hasOwn(dados, 'senha') ? dados.senha : dados.usr_senha;
    if (password != null && password !== '') throw badRequest('Para trocar a senha, use /api/perfil/senha e informe a senha atual.');
    if (!Object.keys(fields).length) throw badRequest('Nenhum campo de perfil foi enviado para atualização.');
    if (!await this.buscarPorId(id)) return null;
    await pool.query(
      `UPDATE tb_user SET ${Object.keys(fields).map(column => `${column} = ?`).join(', ')} WHERE usr_codigo = ?`,
      [...Object.values(fields), id]
    );
    return this.buscarPorId(id);
  }
};
