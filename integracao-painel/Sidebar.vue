<template>
  <aside class="sidebar">
    <div class="sidebar-brand">
      <div class="logo-box">A</div>
      <div>
        <h1>ANDORA</h1>
        <span>Painel administrativo</span>
      </div>
    </div>
    <div class="menu-title">MENU PRINCIPAL</div>
    <nav class="sidebar-nav" aria-label="Menu principal">
      <router-link to="/" class="nav-item" exact-active-class="active"><i class="icon">⌂</i> Visão geral</router-link>
      <router-link to="/site" class="nav-item" active-class="active"><i class="icon">◫</i> Conteúdo do site</router-link>
      <router-link to="/servicos" class="nav-item" active-class="active"><i class="icon">⬖</i> Serviços</router-link>
      <router-link to="/equipe" class="nav-item" active-class="active"><i class="icon">♙</i> Equipe</router-link>
      <router-link to="/mensagens" class="nav-item" active-class="active"><i class="icon">✉</i> Mensagens</router-link>
      <router-link to="/usuario" class="nav-item" active-class="active"><i class="icon">⚙</i> Usuário</router-link>
    </nav>
    <div class="user-profile" :aria-busy="carregando">
      <div class="avatar">
        <img v-if="fotoUrl && !fotoFalhou" :src="fotoUrl" :alt="nomeExibido" @error="fotoFalhou = true">
        <span v-else aria-hidden="true">{{ iniciais }}</span>
      </div>
      <div class="user-info">
        <span class="user-name" :title="nomeExibido">{{ nomeExibido }}</span>
        <span v-if="cargoExibido" class="user-role" :title="cargoExibido">{{ cargoExibido }}</span>
        <button v-if="falha" type="button" class="retry-profile" @click="carregarPerfil">Tentar novamente</button>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { computed, getCurrentInstance, onMounted, onUnmounted, ref, unref } from 'vue';
import { apiRequest } from '../services/api';

// Optional props allow a panel without vue-i18n to supply its selected language
// and API root. No additional dependency is required by this component.
const props = defineProps({
  locale: { type: String, default: '' },
  apiBaseUrl: { type: String, default: '' },
});
const globals = getCurrentInstance().appContext.config.globalProperties;
const usuario = ref(null);
const carregando = ref(true);
const falha = ref(false);
const fotoFalhou = ref(false);
const versaoFoto = ref(0);
let ultimaRequisicao = 0;

const nomeExibido = computed(() => usuario.value?.nome || (carregando.value ? 'A carregar...' : 'Perfil indisponível'));
const iniciais = computed(() => usuario.value?.nome
  ? usuario.value.nome.trim().split(/\s+/).slice(0, 2).map(nome => Array.from(nome)[0]).join('').toLocaleUpperCase()
  : '?');
const cargoExibido = computed(() => {
  const locale = String(props.locale || unref(globals.$i18n?.locale) || 'pt').toLowerCase();
  const ingles = usuario.value?.cargo_ingles;
  return locale.split(/[-_]/)[0] === 'en' && typeof ingles === 'string' && ingles.trim()
    ? ingles : usuario.value?.cargo || '';
});
const fotoUrl = computed(() => {
  if (!usuario.value?.foto) return '';
  try {
    const base = props.apiBaseUrl || import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const foto = String(usuario.value.foto);
    let url;
    if (/^https?:\/\//i.test(foto)) url = new URL(foto);
    else {
      const arquivo = foto.replace(/^\/?uploads\//, '');
      if (arquivo.includes(':') || arquivo.split('/').some(parte => parte === '..')) return '';
      const root = new URL(base, window.location.origin);
      if (!['http:', 'https:'].includes(root.protocol)) return '';
      root.pathname = root.pathname.replace(/\/api\/?$/, '').replace(/\/+$/, '') + '/uploads/';
      root.search = '';
      root.hash = '';
      url = new URL(arquivo.split('/').map(encodeURIComponent).join('/'), root);
    }
    url.searchParams.set('v', String(versaoFoto.value));
    return url.href;
  } catch { return ''; }
});

async function carregarPerfil() {
  const requisicao = ++ultimaRequisicao;
  carregando.value = true;
  falha.value = false;
  try {
    const dados = await apiRequest('/perfil');
    if (requisicao !== ultimaRequisicao) return;
    const perfil = dados?.utilizador || dados;
    const nome = perfil?.nome ?? perfil?.usr_nome;
    if (typeof nome !== 'string' || !nome.trim()) throw new Error('Perfil inválido');
    usuario.value = {
      nome: nome.trim(),
      cargo: perfil.cargo ?? perfil.usr_cargo ?? '',
      cargo_ingles: perfil.cargo_ingles ?? perfil.usr_cargo_ingles ?? '',
      foto: perfil.foto ?? perfil.usr_foto ?? null,
    };
    versaoFoto.value = Date.now();
    fotoFalhou.value = false;
  } catch {
    if (requisicao === ultimaRequisicao) falha.value = true;
  } finally {
    if (requisicao === ultimaRequisicao) carregando.value = false;
  }
}
function atualizarPerfil() { carregarPerfil(); }
onMounted(() => {
  carregarPerfil();
  window.addEventListener('perfilAtualizado', atualizarPerfil);
});
onUnmounted(() => {
  ultimaRequisicao++;
  window.removeEventListener('perfilAtualizado', atualizarPerfil);
});
</script>

<style scoped>
.sidebar { width: 260px; background-color: #061930; display: flex; flex-direction: column; flex-shrink: 0; height: 100vh; height: 100dvh; }
.sidebar-brand { display: flex; align-items: center; gap: 12px; padding: 24px 20px; }
.sidebar-brand h1 { margin: 0; font-size: 16px; color: white; }
.sidebar-brand span { font-size: 11px; color: #94a3b8; }
.logo-box { background-color: #fbbf24; color: #061930; font-weight: 900; border-radius: 8px; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; font-size: 18px; }
.menu-title { color: #64748b; font-size: 11px; font-weight: 700; padding: 10px 20px; margin-top: 10px; }
.sidebar-nav { display: flex; flex-direction: column; gap: 4px; padding: 0 12px; overflow-y: auto; min-height: 0; }
.nav-item { color: #94a3b8; text-decoration: none; font-size: 14px; font-weight: 600; padding: 12px 16px; border-radius: 8px; display: flex; align-items: center; gap: 12px; transition: all 0.2s; }
.nav-item:hover { background-color: rgba(255, 255, 255, 0.05); color: white; }
.nav-item.active { background-color: rgba(255, 255, 255, 0.1); color: white; border-left: 3px solid #fbbf24; }
.icon { font-style: normal; font-size: 16px; }
.user-profile { margin-top: auto; padding: 20px; border-top: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
.avatar { width: 40px; height: 40px; border-radius: 50%; overflow: hidden; background-color: #3b82f6; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px; flex-shrink: 0; }
.avatar img { width: 100%; height: 100%; object-fit: cover; }
.user-info { display: flex; flex-direction: column; overflow: hidden; min-width: 0; }
.user-name { color: white; font-weight: 600; font-size: 14px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden; }
.user-role { color: #94a3b8; font-size: 12px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden; }
.retry-profile { color: #fbbf24; background: none; border: 0; padding: 4px 0; text-align: left; cursor: pointer; font-size: 12px; }
</style>
