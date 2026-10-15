import jwt from 'jsonwebtoken';

export function verificarToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ mensagem: 'Acesso negado. Token não fornecido.' });
  }

  const token = authHeader.split(' ')[1];
  const secret = process.env.JWT_SECRET || 'chave_super_secreta_andora';

  try {
    const payload = jwt.verify(token, secret);
    req.utilizador = payload; // Guarda os dados do utilizador na requisição
    next();
  } catch (erro) {
    return res.status(401).json({ mensagem: 'Token inválido ou expirado.' });
  }
}