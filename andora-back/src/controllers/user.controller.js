import { UserService } from '../services/user.service.js';

function profileResponse(usuario) {
  return {
    ...usuario,
    usr_codigo: usuario.id, usr_nome: usuario.nome, usr_email: usuario.email,
    usr_telefone: usuario.telefone, usr_cargo: usuario.cargo,
    usr_cargo_ingles: usuario.cargo_ingles, usr_foto: usuario.foto,
    usr_bio: usuario.bio, usr_bio_ingles: usuario.bio_ingles,
  };
}

export const UserController = {
  validarProprioPerfil(req, res, next) {
    if (Number(req.params.id) !== Number(req.utilizador.id)) {
      return res.status(403).json({ mensagem: 'Só pode atualizar o seu próprio perfil.' });
    }
    next();
  },

  async atualizarPerfil(req, res, next) {
    try {
      const dados = { ...req.body };
      if (req.file) dados.foto = req.file.filename;
      const usuario = await UserService.atualizar(req.utilizador.id, dados);
      if (!usuario) return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
      res.set('Cache-Control', 'no-store');
      return res.json(profileResponse(usuario));
    } catch (erro) {
      if (erro.code === 'ER_DUP_ENTRY') return res.status(400).json({ mensagem: 'Este email já está cadastrado.' });
      if (erro.status === 400) return res.status(400).json({ mensagem: erro.message });
      next(erro);
    }
  },

  async perfil(req, res, next) {
    try {
      const usuario = await UserService.buscarPorId(req.utilizador.id);
      if (!usuario) return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
      res.set('Cache-Control', 'no-store');
      // Keep the usr_* names used by the existing Sidebar.vue, alongside the
      // normalized fields used by login and user management.
      return res.json(profileResponse(usuario));
    } catch (erro) {
      next(erro);
    }
  },

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
