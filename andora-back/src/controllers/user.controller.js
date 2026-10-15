import { UserService } from '../services/user.service.js';

export const UserController = {
  async listar(req, res, next) {
    try {
      const usuarios = await UserService.listarTodos();
      return res.status(200).json(usuarios);
    } catch (erro) {
      next(erro);
    }
  },

  async criar(req, res, next) {
    try {
      const dados = req.body;
      
      if (!dados.nome || !dados.email || !dados.senha || !dados.cargo) {
        return res.status(400).json({ mensagem: 'Nome, email, senha e cargo são obrigatórios.' });
      }

      // Se houver upload de foto
      if (req.file) {
        dados.foto = req.file.filename;
      }

      const novoUsuario = await UserService.criar(dados);
      return res.status(201).json(novoUsuario);
    } catch (erro) {
      // Verifica se é erro de email duplicado (UNIQUE constraint)
      if (erro.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ mensagem: 'Este email já está cadastrado.' });
      }
      next(erro);
    }
  },

  async remover(req, res, next) {
    try {
      // Impede o usuário de excluir a si mesmo
      if (req.utilizador.id === Number(req.params.id)) {
        return res.status(403).json({ mensagem: 'Não pode excluir a sua própria conta.' });
      }

      const removido = await UserService.excluir(req.params.id);
      if (!removido) return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
      
      return res.status(204).send();
    } catch (erro) {
      next(erro);
    }
  }
};