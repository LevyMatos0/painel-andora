import { DashboardService } from '../services/dashboard.service.js';

export const DashboardController = {
  async resumo(req, res, next) {
    try {
      const dados = await DashboardService.obterEstatisticas();
      return res.status(200).json(dados);
    } catch (erro) {
      next(erro);
    }
  }
};