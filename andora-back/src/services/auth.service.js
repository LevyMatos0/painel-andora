import { pool } from '../config/database.js';
import bcrypt from 'bcryptjs'; // <-- Deve ser bcryptjs
import jwt from 'jsonwebtoken';
import { publicUser } from './user.service.js';

export const AuthService = {
  async login(email, senha) {
    const sql = `
      SELECT *
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
      { id: utilizador.usr_codigo, cargo: utilizador.usr_cargo },
      secret,
      { expiresIn: '24h' }
    );

    return { token, utilizador: publicUser(utilizador) };
  }
};
