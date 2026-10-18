import { TeamService } from '../services/team.service.js';

export const TeamController = {
  async listar(req, res, next) {
    try {
      const membros = await TeamService.listarTodos(!req.utilizador);
      return res.status(200).json(membros);
    } catch (erro) {
      if (erro.status === 400) return res.status(400).json({ mensagem: erro.message });
      next(erro);
    }
  },

  async criar(req, res, next) {
    try {
      const dados = req.body;
      
      // Se a imagem chegou, guarda o nome
      if (req.file) {
        dados.foto = req.file.filename; 
      }

      const novo = await TeamService.criar(dados);
      return res.status(201).json(novo);
    } catch (erro) {
      if (erro.status === 400) return res.status(400).json({ mensagem: erro.message });
      next(erro);
    }
  },

  async atualizar(req, res, next) {
    try {
      const dados = req.body;
      
      // Se a imagem chegou, guarda o nome
      if (req.file) {
        dados.foto = req.file.filename;
      }

      const atualizado = await TeamService.atualizar(req.params.id, dados);
      if (!atualizado) return res.status(404).json({ mensagem: 'Membro não encontrado.' });
      return res.status(200).json(atualizado);
    } catch (erro) {
      if (erro.status === 400) return res.status(400).json({ mensagem: erro.message });
      next(erro);
    }
  },

  async remover(req, res, next) {
    try {
      await TeamService.excluir(req.params.id);
      return res.status(200).json({ mensagem: 'Membro removido' });
    } catch (erro) {
      if (erro.status === 400) return res.status(400).json({ mensagem: erro.message });
      next(erro);
    }
  }
};