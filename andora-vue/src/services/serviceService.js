import { apiFetch } from './api'
export const buscarServicos = () => apiFetch('/servicos')
export const cadastrarServico = dados => apiFetch('/servicos', { method: 'POST', body: JSON.stringify(dados) })
export const atualizarServico = (codigo, dados) => apiFetch(`/servicos/${codigo}`, { method: 'PUT', body: JSON.stringify(dados) })
export const excluirServico = codigo => apiFetch(`/servicos/${codigo}`, { method: 'DELETE' })
