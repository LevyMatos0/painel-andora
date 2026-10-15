import { SiteService } from '../services/site.service.js';

export const SiteController = {
  async buscar(req, res, next) {
    try {
      const dados = await SiteService.buscarTodos();
      return res.status(200).json(dados);
    } catch (erro) {
      next(erro);
    }
  },

  async salvar(req, res, next) {
    try {
      const { secao, ...campos } = req.body;
      
      if (!secao) {
        return res.status(400).json({ mensagem: 'A secção é obrigatória.' });
      }

      if (req.file) {
        campos.imagem = req.file.filename;
      }

      // A chamada da função que estava a dar erro
      await SiteService.salvarSecao(secao, campos);
      
      return res.status(200).json({ mensagem: 'Conteúdo atualizado com sucesso.' });
    } catch (erro) {
      next(erro);
    }
  }
};