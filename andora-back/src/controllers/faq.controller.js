import { FaqService } from '../services/faq.service.js';

export const FaqController = {
  async listar(req, res, next) {
    try {
      const somenteAtivos = req.query.ativos === 'true';
      const faqs = await FaqService.listarTodos(somenteAtivos);
      return res.status(200).json(faqs);
    } catch (erro) {
      next(erro);
    }
  },

  async criar(req, res, next) {
    try {
      if (!req.body.pergunta || !req.body.resposta) {
        return res.status(400).json({ mensagem: 'Pergunta e resposta são obrigatórias.' });
      }

      const novaFaq = await FaqService.criar(req.body);
      return res.status(201).json(novaFaq);
    } catch (erro) {
      next(erro);
    }
  },

  async atualizar(req, res, next) {
    try {
      if (!req.body.pergunta || !req.body.resposta) {
        return res.status(400).json({ mensagem: 'Pergunta e resposta são obrigatórias.' });
      }

      const atualizado = await FaqService.atualizar(req.params.id, req.body);
      
      if (!atualizado) {
        return res.status(404).json({ mensagem: 'FAQ não encontrada.' });
      }

      return res.status(200).json({ mensagem: 'FAQ atualizada com sucesso.' });
    } catch (erro) {
      next(erro);
    }
  },

  async remover(req, res, next) {
    try {
      const removido = await FaqService.excluir(req.params.id);
      
      if (!removido) {
        return res.status(404).json({ mensagem: 'FAQ não encontrada.' });
      }

      return res.status(204).send();
    } catch (erro) {
      next(erro);
    }
  }
};