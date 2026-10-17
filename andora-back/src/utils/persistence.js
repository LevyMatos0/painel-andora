export function badRequest(message) {
  return Object.assign(new Error(message), { status: 400 });
}

// Only identifiers from this server-side mapping may reach SQL statements.
export function pickFields(data, mapping) {
  data = data && typeof data === 'object' ? data : {};
  const fields = {};
  for (const [column, aliases] of Object.entries(mapping)) {
    const key = aliases.find(alias => Object.hasOwn(data, alias) && data[alias] !== undefined);
    if (key !== undefined) fields[column] = data[key];
  }
  return fields;
}

export function normalizeOrder(value) {
  if (value === '' || value == null) return 0;
  const order = Number(value);
  if (!Number.isInteger(order) || order < 0 || order > 4294967295) {
    throw badRequest('A ordem deve ser um número inteiro não negativo.');
  }
  return order;
}

export function normalizeActive(value) {
  if ([true, 1, 'true', '1'].includes(value)) return 1;
  if ([false, 0, 'false', '0'].includes(value)) return 0;
  throw badRequest('O estado deve ser true, false, 1 ou 0.');
}

export function validateText(fields, required = []) {
  for (const [column, value] of Object.entries(fields)) {
    if (typeof value !== 'string' && value !== null) throw badRequest(`O campo ${column} deve ser texto.`);
    if (required.includes(column) && (typeof value !== 'string' || !value.trim())) {
      throw badRequest(`O campo ${column} é obrigatório.`);
    }
  }
}
