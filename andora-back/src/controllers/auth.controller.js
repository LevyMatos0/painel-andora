import { AuthService } from '../services/auth.service.js';

export const AuthController = {
  async login(req, res, next) {
    try {
      const { email, senha } = req.body || {};
      if (typeof email !== 'string' || typeof senha !== 'string' || !email.trim() || !senha || email.length > 255 || senha.length > 1024) {
        return res.status(400).json({ mensagem: 'Email e palavra-passe são obrigatórios.' });
      }

      const resposta = await AuthService.login(email, senha);
      return res.status(200).json(resposta);
    } catch (erro) {
      return res.status(401).json({ mensagem: 'Credenciais inválidas ou serviço de autenticação indisponível.' });
    }
  }
};