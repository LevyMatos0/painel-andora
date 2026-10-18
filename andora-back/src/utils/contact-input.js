import { badRequest } from './persistence.js';

export function contactInput(body) {
  const fields = { nome: 100, email: 255, assunto: 150, conteudo: 10000 };
  const data = {};
  for (const [key, max] of Object.entries(fields)) {
    if (typeof body?.[key] !== 'string' || !body[key].trim() || body[key].trim().length > max) {
      throw badRequest(`Preencha ${key} com até ${max} caracteres.`);
    }
    data[key] = body[key].trim();
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) || /[\r\n]/.test(data.nome + data.assunto)) {
    throw badRequest('Informe um e-mail válido e nome e assunto sem quebras de linha.');
  }
  if (body.telefone != null && body.telefone !== '') {
    if (typeof body.telefone !== 'string' || body.telefone.trim().length > 25) throw badRequest('Informe um telefone com até 25 caracteres.');
    data.telefone = body.telefone.trim();
  }
  return data;
}
