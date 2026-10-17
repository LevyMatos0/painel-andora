import { pool } from "../config/database.js";

export const DashboardService = {
  async obterEstatisticas() {
    const [services, team, faqs, messages, hero, about, contact, recent] =
      await Promise.all([
        pool.query(
          "SELECT COUNT(*) AS total, COALESCE(SUM(srv_ativo = 1),0) AS ativos FROM tb_servico",
        ),
        pool.query(
          "SELECT COUNT(*) AS total, COALESCE(SUM(tms_status = 1),0) AS ativos FROM tb_team",
        ),
        pool.query(
          "SELECT COUNT(*) AS total, COALESCE(SUM(faq_status = 1),0) AS ativos FROM tb_faq",
        ),
        pool.query(
          "SELECT COUNT(*) AS total, COALESCE(SUM(msg_status = 'nova'),0) AS novas FROM tb_mensagem",
        ),
        pool.query(
          "SELECT COUNT(*) AS total FROM tb_hero WHERE TRIM(her_titulo) <> '' AND TRIM(her_descricao) <> '' AND TRIM(her_imagem) <> ''",
        ),
        pool.query(
          "SELECT COUNT(*) AS total FROM tb_about WHERE TRIM(abt_titulo) <> '' AND TRIM(abt_texto) <> '' AND TRIM(abt_imagem) <> ''",
        ),
        pool.query(
          "SELECT COUNT(*) AS total FROM tb_contato WHERE TRIM(cto_endereco) <> '' AND TRIM(cto_email) <> '' AND TRIM(cto_telefone) <> ''",
        ),
        pool.query(
          "SELECT msg_codigo AS id, msg_nome AS nome, msg_assunto AS assunto, msg_status AS status, msg_criado AS criado_em FROM tb_mensagem ORDER BY msg_criado DESC, msg_codigo DESC LIMIT 5",
        ),
      ]);
    const number = (result, key) => Number(result[0][0][key]);
    const secoes = [
      {
        id: "hero",
        nome: "Destaque principal",
        descricao: "Título, descrição e imagem",
        rota: "/site?aba=hero",
        preenchida: number(hero, "total") > 0,
      },
      {
        id: "sobre",
        nome: "Sobre a Andora",
        descricao: "Apresentação e imagem institucional",
        rota: "/site?aba=sobre",
        preenchida: number(about, "total") > 0,
      },
      {
        id: "contato",
        nome: "Informações de contato",
        descricao: "Endereço, telefone e email",
        rota: "/site?aba=contato",
        preenchida: number(contact, "total") > 0,
      },
      {
        id: "servicos",
        nome: "Serviços",
        descricao: "Ao menos um serviço ativo",
        rota: "/servicos",
        preenchida: number(services, "ativos") > 0,
      },
      {
        id: "equipe",
        nome: "Equipe",
        descricao: "Ao menos um membro ativo",
        rota: "/equipe",
        preenchida: number(team, "ativos") > 0,
      },
      {
        id: "faq",
        nome: "Perguntas frequentes",
        descricao: "Ao menos uma pergunta visível",
        rota: "/site?aba=faq",
        preenchida: number(faqs, "ativos") > 0,
      },
    ];
    const secoesPublicadas = secoes.filter(
      (section) => section.preenchida,
    ).length;
    return {
      mensagensNovas: number(messages, "novas"),
      totalMensagens: number(messages, "total"),
      totalServicos: number(services, "total"),
      servicosTotal: number(services, "total"),
      servicosAtivos: number(services, "ativos"),
      equipeAtiva: number(team, "ativos"),
      membrosEquipe: number(team, "total"),
      totalFaqs: number(faqs, "total"),
      faqsAtivas: number(faqs, "ativos"),
      secoesPublicadas,
      totalSecoes: secoes.length,
      completude: Math.round((secoesPublicadas / secoes.length) * 100),
      secoes,
      mensagensRecentes: recent[0],
      atualizadoEm: new Date().toISOString(),
    };
  },
};
