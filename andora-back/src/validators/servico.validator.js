export function validarServico(dados, obrigatorio = true) {
  const erros = [];

  if (obrigatorio || dados.titulo !== undefined) {
    if (!dados.titulo || typeof dados.titulo !== 'string' || dados.titulo.trim().length === 0) {
      erros.push('O campo "titulo" é obrigatório.');
    } else if (dados.titulo.length > 100) {
      erros.push('O campo "titulo" deve ter no máximo 100 caracteres.');
    }
  }

  if (obrigatorio || dados.descricao !== undefined) {
    if (!dados.descricao || dados.descricao.trim().length === 0) {
      erros.push('O campo "descricao" é obrigatório.');
    }
  }

  if (obrigatorio || dados.informacoes !== undefined) {
    if (!dados.informacoes || dados.informacoes.trim().length === 0) {
      erros.push('O campo "informacoes" é obrigatório.');
    }
  }

  if (obrigatorio || dados.icone !== undefined) {
    if (!dados.icone || dados.icone.trim().length === 0) {
      erros.push('O campo "icone" é obrigatório.');
    }
  }

  return {
    valido: erros.length === 0,
    erros
  };
}