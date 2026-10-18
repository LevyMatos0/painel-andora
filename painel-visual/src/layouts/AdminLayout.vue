<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import AppSidebar from "../components/AppSidebar.vue";
import { loadProfile, profile } from "../services/profile";
import { clearSession } from "../services/api";
const route = useRoute(),
  router = useRouter(),
  menu = ref(false);
const titles = {
  "/dashboard": "Visão geral",
  "/site": "Conteúdo do site",
  "/servicos": "Serviços",
  "/equipe": "Equipe",
  "/mensagens": "Mensagens",
  "/usuario": "Meu perfil",
};
const title = computed(() => titles[route.path] || "Painel administrativo");
function close() {
  menu.value = false;
}
function key(event) {
  if (event.key === "Escape") close();
}
function resize() {
  if (window.innerWidth > 760) close();
}
function refresh() {
  loadProfile().catch(() => {});
}
function logout() {
  clearSession();
  profile.value = null;
  router.replace("/");
}
watch(() => route.fullPath, close);
watch(menu, (open) => document.body.classList.toggle("admin-menu-open", open));
onMounted(() => {
  refresh();
  window.addEventListener("perfilAtualizado", refresh);
  window.addEventListener("keydown", key);
  window.addEventListener("resize", resize);
});
onUnmounted(() => {
  document.body.classList.remove("admin-menu-open");
  window.removeEventListener("perfilAtualizado", refresh);
  window.removeEventListener("keydown", key);
  window.removeEventListener("resize", resize);
});
</script>
<template>
  <div class="app-shell">
    <AppSidebar :aberto="menu" @fechar="close" />
    <button
      v-if="menu"
      class="backdrop show"
      aria-label="Fechar menu"
      @click="close"
    />
    <main class="main">
      <header class="topbar">
        <div class="topbar-heading">
          <button
            class="icon-btn mobile-menu"
            :aria-expanded="menu"
            aria-controls="admin-sidebar"
            aria-label="Abrir menu"
            @click="menu = !menu"
          >
            ☰
          </button>
          <div>
            <p class="eyebrow">Painel administrativo</p>
            <h1>{{ title }}</h1>
          </div>
        </div>
        <div class="top-actions">
          <button class="btn btn-secondary" @click="logout">Sair</button>
        </div>
      </header>
      <div class="page"><router-view /></div>
    </main>
  </div>
</template>
