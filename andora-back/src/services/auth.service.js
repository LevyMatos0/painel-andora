import { pool } from '../config/database.js';
import bcrypt from 'bcryptjs'; // <-- Deve ser bcryptjs
import jwt from 'jsonwebtoken';

export const AuthService = {
  async login(email, senha) {
    const sql = `
      SELECT usr_codigo AS id, usr_nome AS nome, usr_email AS email, usr_senha, usr_cargo AS cargo, usr_foto AS foto
      FROM tb_user 
      WHERE usr_email = ?
    `;
    const [linhas] = await pool.query(sql, [email.trim()]);
    const utilizador = linhas[0];

    if (!utilizador) {
      throw new Error('Credenciais inválidas.');
    }

    const senhaValida = await bcrypt.compare(senha, utilizador.usr_senha);
    if (!senhaValida) {
      throw new Error('Credenciais inválidas.');
    }

    const secret = process.env.JWT_SECRET || 'chave_super_secreta_andora';
    const token = jwt.sign(
      { id: utilizador.id, cargo: utilizador.cargo },
      secret,
      { expiresIn: '24h' }
    );

    delete utilizador.usr_senha;

    return { token, utilizador };
  }
};