<script setup>
import { useRoute } from "vue-router";
import { profile, profileError, loadProfile } from "../services/profile";
import UserAvatar from "./UserAvatar.vue";
defineProps({ aberto: Boolean });
defineEmits(["fechar"]);
const route = useRoute();
const links = [
  { nome: "Visão geral", rota: "/dashboard", icone: "⌂" },
  { nome: "Conteúdo do site", rota: "/site", icone: "◫" },
  { nome: "Serviços", rota: "/servicos", icone: "◇" },
  { nome: "Equipe", rota: "/equipe", icone: "♙" },
  { nome: "Mensagens", rota: "/mensagens", icone: "✉" },
  { nome: "Usuário", rota: "/usuario", icone: "⚙" },
];
function retry() {
  loadProfile().catch(() => {});
}
</script>
<template>
  <aside id="admin-sidebar" class="sidebar" :class="{ open: aberto }">
    <div class="brand">
      <span class="brand-mark">A</span
      ><span class="brand-copy"
        ><strong>ANDORA</strong><span>Painel administrativo</span></span
      ><button
        class="icon-btn sidebar-close"
        aria-label="Fechar menu"
        @click="$emit('fechar')"
      >
        ×
      </button>
    </div>
    <p class="nav-label">Menu principal</p>
    <nav class="nav-list" aria-label="Menu principal">
      <RouterLink
        v-for="link in links"
        :key="link.rota"
        :to="link.rota"
        class="nav-item"
        :class="{ active: route.path === link.rota }"
        :aria-current="route.path === link.rota ? 'page' : undefined"
        @click="$emit('fechar')"
        ><span class="nav-icon" aria-hidden="true">{{ link.icone }}</span
        >{{ link.nome }}</RouterLink
      >
    </nav>
    <div class="sidebar-footer">
      <RouterLink to="/usuario" class="profile-mini" @click="$emit('fechar')"
        ><UserAvatar :user="profile" :version="profile?.foto || ''" />
        <div class="profile-copy">
          <strong :title="profile?.nome">{{
            profile?.nome ||
            (profileError ? "Perfil indisponível" : "Carregando perfil…")
          }}</strong
          ><span :title="profile?.cargo">{{ profile?.cargo || "" }}</span>
        </div></RouterLink
      ><button v-if="profileError" class="profile-retry" @click="retry">
        Tentar novamente
      </button>
    </div>
  </aside>
</template>
