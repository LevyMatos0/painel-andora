import { pool } from '../config/database.js';
import { badRequest, normalizeActive, normalizeOrder, pickFields, validateText } from '../utils/persistence.js';

function serviceFields(dados, create = false) {
  const fields = pickFields(dados, {
    srv_titulo: ['titulo', 'srv_titulo'],
    srv_titulo_ingles: ['titulo_ingles', 'srv_titulo_ingles'],
    srv_descricao: ['descricao', 'srv_descricao'],
    srv_descricao_ingles: ['descricao_ingles', 'srv_descricao_ingles'],
    srv_informacoes: ['informacoes', 'srv_informacoes'],
    srv_informacoes_ingles: ['informacoes_ingles', 'srv_informacoes_ingles'],
    srv_icone: ['icone', 'srv_icone'],
  });
  if (create) {
    if (!Object.hasOwn(fields, 'srv_titulo') || !Object.hasOwn(fields, 'srv_descricao')) {
      throw badRequest('Título e descrição são obrigatórios.');
    }
    fields.srv_informacoes ??= '';
    fields.srv_icone ??= '';
  } else if (fields.srv_icone == null || fields.srv_icone === '') delete fields.srv_icone;
  if (Object.hasOwn(fields, 'srv_informacoes') && fields.srv_informacoes === null) fields.srv_informacoes = '';
  validateText(fields, ['srv_titulo', 'srv_descricao']);
  const flags = pickFields(dados, { ordem: ['ordem', 'srv_ordem'], ativo: ['ativo', 'srv_ativo'] });
  if (Object.hasOwn(flags, 'ordem') || create) fields.srv_ordem = normalizeOrder(flags.ordem);
  if (Object.hasOwn(flags, 'ativo') || create) fields.srv_ativo = normalizeActive(Object.hasOwn(flags, 'ativo') ? flags.ativo : true);
  return fields;
}

export const ServicoService = {
  async listarTodos() {
    const [linhas] = await pool.query('SELECT * FROM tb_servico ORDER BY srv_ordem ASC');
    return linhas;
  },

  async criar(dados) {
    const fields = serviceFields(dados, true);
    const columns = Object.keys(fields);
    const [resultado] = await pool.query(
      `INSERT INTO tb_servico (${columns.join(', ')}) VALUES (${columns.map(() => '?').join(', ')})`,
      Object.values(fields)
    );
    return { id: resultado.insertId, ...dados };
  },

  async atualizar(id, dados) {
    const fields = serviceFields(dados);
    if (!Object.keys(fields).length) throw badRequest('Nenhum campo de serviço foi enviado para atualização.');
    const [existing] = await pool.query('SELECT srv_codigo FROM tb_servico WHERE srv_codigo = ?', [id]);
    if (!existing.length) return null;
    await pool.query(
      `UPDATE tb_servico SET ${Object.keys(fields).map(column => `${column} = ?`).join(', ')} WHERE srv_codigo = ?`,
      [...Object.values(fields), id]
    );
    return { id, ...dados };
  },

  async excluir(id) {
    await pool.query('DELETE FROM tb_servico WHERE srv_codigo = ?', [id]);
    return true;
  }
};
