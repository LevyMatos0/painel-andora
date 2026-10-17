<script setup>
import { ref, computed, onMounted } from "vue";
import { apiRequest } from "../services/api";
import { profile } from "../services/profile";
const dados = ref(null),
  carregando = ref(false),
  erro = ref("");
const estatisticas = computed(() =>
  dados.value
    ? [
        {
          titulo: "Seções preenchidas",
          valor: `${dados.value.secoesPublicadas}/${dados.value.totalSecoes}`,
          nota: "Conteúdo e registros ativos",
          rota: "/site",
        },
        {
          titulo: "Serviços ativos",
          valor: dados.value.servicosAtivos,
          nota: `${dados.value.totalServicos} cadastrados`,
          rota: "/servicos",
        },
        {
          titulo: "Membros da equipe",
          valor: dados.value.membrosEquipe,
          nota: `${dados.value.equipeAtiva} ativos`,
          rota: "/equipe",
        },
        {
          titulo: "Perguntas no FAQ",
          valor: dados.value.totalFaqs,
          nota: `${dados.value.faqsAtivas} visíveis`,
          rota: "/site?aba=faq",
        },
      ]
    : [],
);
const dataAtualizacao = computed(() =>
  dados.value ? new Date(dados.value.atualizadoEm).toLocaleString("pt-BR") : "",
);
async function carregarDashboard() {
  carregando.value = true;
  erro.value = "";
  try {
    dados.value = await apiRequest("/dashboard");
  } catch (error) {
    erro.value = error.message;
  } finally {
    carregando.value = false;
  }
}
onMounted(carregarDashboard);
</script>
<template>
  <div class="page-content">
    <section class="page-head">
      <div>
        <h2>Visão geral</h2>
        <p v-if="profile">
          Olá, {{ profile.nome.split(" ")[0] }}. Acompanhe o conteúdo da Andora.
        </p>
        <p v-else>Acompanhe e atualize o conteúdo da Andora.</p>
      </div>
      <button
        class="btn btn-secondary"
        :disabled="carregando"
        @click="carregarDashboard"
      >
        {{ carregando ? "Atualizando…" : "Atualizar dados" }}
      </button>
    </section>
    <p v-if="erro" class="status-alert" role="alert">
      {{ erro }}
      <button
        class="btn btn-secondary"
        :disabled="carregando"
        @click="carregarDashboard"
      >
        Tentar novamente
      </button>
    </p>
    <p v-if="carregando && !dados" class="state-empty" role="status">
      Consultando o banco de dados…
    </p>
    <template v-if="dados">
      <p class="dashboard-date">Última consulta: {{ dataAtualizacao }}</p>
      <section class="grid grid-4">
        <RouterLink
          v-for="item in estatisticas"
          :key="item.titulo"
          :to="item.rota"
          class="card stat stat-link"
          ><span class="stat-label">{{ item.titulo }}</span>
          <div class="stat-value">{{ item.valor }}</div>
          <span class="stat-meta">{{ item.nota }}</span></RouterLink
        >
      </section>
      <section class="content-grid" style="margin-top: 20px">
        <article class="card card-pad">
          <div class="section-title">
            <div>
              <h3>Conteúdo do site</h3>
              <span>Dados preenchidos e registros ativos</span>
            </div>
            <RouterLink class="btn btn-ghost" to="/site"
              >Gerenciar →</RouterLink
            >
          </div>
          <div class="list">
            <RouterLink
              v-for="secao in dados.secoes"
              :key="secao.id"
              :to="secao.rota"
              class="list-item section-link"
              ><div>
                <strong>{{ secao.nome }}</strong
                ><span>{{ secao.descricao }}</span>
              </div>
              <span
                class="badge"
                :class="{ 'badge-muted': !secao.preenchida }"
                >{{ secao.preenchida ? "Preenchido" : "Pendente" }}</span
              ></RouterLink
            >
          </div>
        </article>
        <aside class="card card-pad">
          <div class="section-title">
            <div>
              <h3>Completude</h3>
              <span
                >{{ dados.secoesPublicadas }} de {{ dados.totalSecoes }} seções
                preenchidas</span
              >
            </div>
            <strong>{{ dados.completude }}%</strong>
          </div>
          <div
            class="progress"
            role="progressbar"
            aria-label="Completude do conteúdo"
            :aria-valuenow="dados.completude"
            aria-valuemin="0"
            aria-valuemax="100"
          >
            <i :style="{ width: `${dados.completude}%` }"></i>
          </div>
          <p class="form-help">
            Hero e Sobre precisam de texto e imagem; Contato, de endereço,
            telefone e e-mail. Serviços, Equipe e FAQ precisam de ao menos um
            registro ativo.
          </p>
          <RouterLink
            class="btn btn-primary"
            to="/site"
            style="margin-top: 20px"
            >Editar conteúdo</RouterLink
          >
        </aside>
      </section>
      <section class="card card-pad dashboard-recent" style="margin-top: 20px">
        <div class="section-title">
          <div>
            <h3>Mensagens recentes</h3>
            <span
              >{{ dados.mensagensNovas }} novas · {{ dados.totalMensagens }} no
              total</span
            >
          </div>
          <RouterLink class="btn btn-ghost" to="/mensagens"
            >Ver todas →</RouterLink
          >
        </div>
        <p v-if="!dados.mensagensRecentes.length" class="state-empty">
          Nenhuma mensagem recebida pelo site.
        </p>
        <div v-else class="list">
          <RouterLink
            v-for="mensagem in dados.mensagensRecentes"
            :key="mensagem.id"
            :to="{ path: '/mensagens', query: { abrir: mensagem.id } }"
            class="list-item section-link"
            ><div>
              <strong>{{ mensagem.assunto || "Sem assunto" }}</strong
              ><span
                >{{ mensagem.nome }} ·
                {{ new Date(mensagem.criado_em).toLocaleString("pt-BR") }}</span
              >
            </div>
            <span
              class="badge"
              :class="{ 'badge-muted': mensagem.status !== 'nova' }"
              >{{
                mensagem.status === "nova"
                  ? "Nova"
                  : mensagem.status === "respondida"
                    ? "Respondida"
                    : "Lida"
              }}</span
            ></RouterLink
          >
        </div>
      </section>
    </template>
  </div>
</template>
