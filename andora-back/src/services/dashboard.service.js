import { pool } from '../config/database.js';

export const DashboardService = {
  async obterEstatisticas() {
    // Conta mensagens com status 'nova'
    const [[{ mensagensNovas }]] = await pool.query(
      "SELECT COUNT(*) AS mensagensNovas FROM tb_mensagem WHERE msg_status = 'nova'"
    );
    
    // Conta serviços totais e ativos
    const [[{ totalServicos }]] = await pool.query(
      "SELECT COUNT(*) AS totalServicos FROM tb_servico"
    );

    // Conta membros da equipa ativos
    const [[{ equipeAtiva }]] = await pool.query(
      "SELECT COUNT(*) AS equipeAtiva FROM tb_team WHERE tms_status = 1"
    );

    return {
      mensagensNovas,
      totalServicos,
      equipeAtiva
    };
  }
};