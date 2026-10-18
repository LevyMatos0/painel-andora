import { pool } from '../config/database.js';
import { badRequest, normalizeActive, normalizeOrder, pickFields, validateText } from '../utils/persistence.js';

function teamFields(dados, create = false) {
  const fields = pickFields(dados, {
    tms_nome: ['nome', 'tms_nome'],
    tms_cargo: ['cargo', 'tms_cargo'],
    tms_cargo_ingles: ['cargo_ingles', 'tms_cargo_ingles'],
    tms_apresentacao: ['texto', 'apresentacao', 'tms_apresentacao'],
    tms_apresentacao_ingles: ['texto_ingles', 'apresentacao_ingles', 'tms_apresentacao_ingles'],
    tms_linkedin: ['linkedin', 'tms_linkedin'],
    tms_github: ['github', 'tms_github'],
    tms_imagem: ['foto', 'imagem', 'tms_imagem'],
  });
  if (create) {
    if (!Object.hasOwn(fields, 'tms_nome') || !Object.hasOwn(fields, 'tms_cargo')) {
      throw badRequest('Nome e cargo são obrigatórios.');
    }
    fields.tms_apresentacao ??= '';
    fields.tms_linkedin ??= '';
    fields.tms_github ??= '';
    fields.tms_imagem ??= '';
  } else if (fields.tms_imagem == null || fields.tms_imagem === '') delete fields.tms_imagem;
  if (Object.hasOwn(fields, 'tms_apresentacao') && fields.tms_apresentacao === null) fields.tms_apresentacao = '';
  validateText(fields, ['tms_nome', 'tms_cargo']);
  const flags = pickFields(dados, { ordem: ['ordem', 'tms_ordem'], status: ['status', 'tms_status'] });
  if (Object.hasOwn(flags, 'ordem') || create) fields.tms_ordem = normalizeOrder(flags.ordem);
  if (Object.hasOwn(flags, 'status') || create) fields.tms_status = normalizeActive(Object.hasOwn(flags, 'status') ? flags.status : true);
  return fields;
}

export const TeamService = {
  async listarTodos() {
    const [linhas] = await pool.query('SELECT * FROM tb_team ORDER BY tms_ordem ASC');
    return linhas;
  },

  async criar(dados) {
    const fields = teamFields(dados, true);
    const columns = Object.keys(fields);
    const [resultado] = await pool.query(
      `INSERT INTO tb_team (${columns.join(', ')}) VALUES (${columns.map(() => '?').join(', ')})`,
      Object.values(fields)
    );
    return { id: resultado.insertId, ...dados, foto: fields.tms_imagem };
  },

  async atualizar(id, dados) {
    const fields = teamFields(dados);
    if (!Object.keys(fields).length) throw badRequest('Nenhum campo de equipe foi enviado para atualização.');
    const [existing] = await pool.query('SELECT tms_codigo FROM tb_team WHERE tms_codigo = ?', [id]);
    if (!existing.length) return null;
    await pool.query(
      `UPDATE tb_team SET ${Object.keys(fields).map(column => `${column} = ?`).join(', ')} WHERE tms_codigo = ?`,
      [...Object.values(fields), id]
    );
    return { id, ...dados, ...(fields.tms_imagem !== undefined ? { foto: fields.tms_imagem } : {}) };
  },

  async excluir(id) {
    await pool.query('DELETE FROM tb_team WHERE tms_codigo = ?', [id]);
    return true;
  }
};
