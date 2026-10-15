import { ServicoService } from '../services/servico.service.js';

export const ServicoController = {
  async listar(req, res, next) {
    try {
      const servicos = await ServicoService.listarTodos();
      return res.status(200).json(servicos);
    } catch (erro) {
      next(erro);
    }
  },

  async criar(req, res, next) {
    try {
      const dados = req.body;
      
      if (req.file) {
        dados.icone = req.file.filename; 
      }

      const novoServico = await ServicoService.criar(dados);
      return res.status(201).json(novoServico);
    } catch (erro) {
      next(erro);
    }
  },

  async atualizar(req, res, next) {
    try {
      const dados = req.body;
      
      if (req.file) {
        dados.icone = req.file.filename;
      }

      const servicoAtualizado = await ServicoService.atualizar(req.params.id, dados);
      return res.status(200).json(servicoAtualizado);
    } catch (erro) {
      next(erro);
    }
  },

  async remover(req, res, next) {
    try {
      await ServicoService.excluir(req.params.id);
      return res.status(200).json({ mensagem: 'Serviço removido com sucesso.' });
    } catch (erro) {
      next(erro);
    }
  }
};