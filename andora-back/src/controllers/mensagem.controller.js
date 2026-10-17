import { MensagemService } from '../services/mensagem.service.js';
import { notifyContact } from '../services/contact-mail.service.js';
import { contactInput } from '../utils/contact-input.js';

export const MensagemController = {
  async listar(req, res, next) {
    try {
      const mensagens = await MensagemService.listarTodas();
      return res.status(200).json(mensagens);
    } catch (erro) {
      next(erro);
    }
  },

  async criar(req, res, next) {
    try {
      const dados = contactInput(req.body);
      // Persist first: a Gmail outage must not lose or duplicate the contact.
      const novaMensagem = await MensagemService.criar(dados);
      const notificacaoEmail = await notifyContact(novaMensagem);
      return res.status(201).json({ ...novaMensagem, notificacaoEmail });
    } catch (erro) {
      if (erro.status === 400) return res.status(400).json({ mensagem: erro.message });
      next(erro);
    }
  },

  async alterarStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const statusPermitidos = ['nova', 'lida', 'respondida'];
      if (!statusPermitidos.includes(status)) {
        return res.status(400).json({ mensagem: 'Status inválido.' });
      }

      const atualizado = await MensagemService.atualizarStatus(id, status);
      if (!atualizado) {
        return res.status(404).json({ mensagem: 'Mensagem não encontrada.' });
      }

      return res.status(200).json({ mensagem: 'Status atualizado.' });
    } catch (erro) {
      next(erro);
    }
  },

  async remover(req, res, next) {
    try {
      const { id } = req.params;
      const removido = await MensagemService.excluir(id);

      if (!removido) {
        return res.status(404).json({ mensagem: 'Mensagem não encontrada.' });
      }

      return res.status(204).send();
    } catch (erro) {
      next(erro);
    }
  }
};