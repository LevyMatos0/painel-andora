<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import MessageModal from "../components/MessageModal.vue";
import { apiRequest } from "../services/api";
const route = useRoute();
const mensagens = ref([]),
  selecionada = ref(null),
  erro = ref(""),
  carregando = ref(false);
async function abrir(item) {
  selecionada.value = item;
  try {
    if (item.status === "nova") {
      await apiRequest(`/mensagens/${item.codigo}/status`, {
        method: "PATCH",
        body: { status: "lida" },
      });
      item.status = "lida";
    }
  } catch (error) {
    erro.value = error.message;
  }
}
function abrirPorLink() {
  const item = mensagens.value.find(
    (m) => String(m.codigo) === String(route.query.abrir),
  );
  if (item) abrir(item);
}
async function carregarMensagens() {
  carregando.value = true;
  erro.value = "";
  try {
    const data = await apiRequest("/mensagens");
    mensagens.value = data.map((m) => ({
      codigo: m.id,
      nome: m.nome,
      email: m.email,
      assunto: m.assunto,
      conteudo: (m.conteudo || "").split("\n"),
      data: new Date(m.criado_em).toLocaleString("pt-BR"),
      status: m.status,
      iniciais: (m.nome || "?")
        .split(/\s+/)
        .slice(0, 2)
        .map((p) => p[0])
        .join("")
        .toUpperCase(),
    }));
    abrirPorLink();
  } catch (error) {
    erro.value = error.message;
  } finally {
    carregando.value = false;
  }
}
async function excluir(codigo) {
  if (!confirm("Deseja excluir permanentemente esta mensagem?")) return;
  try {
    await apiRequest(`/mensagens/${codigo}`, { method: "DELETE" });
    mensagens.value = mensagens.value.filter((m) => m.codigo !== codigo);
    selecionada.value = null;
  } catch (error) {
    erro.value = error.message;
  }
}
watch(() => route.query.abrir, abrirPorLink);
onMounted(carregarMensagens);
</script>
<template>
  <div class="page-content">
    <section class="page-head">
      <div>
        <h2>Caixa de entrada</h2>
        <p>Consulte as solicitações enviadas pelo site.</p>
      </div>
      <button
        class="btn btn-secondary"
        :disabled="carregando"
        @click="carregarMensagens"
      >
        Atualizar
      </button>
    </section>
    <p v-if="erro" class="status-alert" role="alert">{{ erro }}</p>
    <section class="card card-pad">
      <p v-if="carregando" class="state-empty">Carregando mensagens…</p>
      <p v-else-if="!mensagens.length" class="state-empty">
        Nenhuma mensagem recebida.
      </p>
      <div v-else class="table-wrap">
        <table class="table">
          <thead>
            <tr>
              <th>Remetente</th>
              <th>Assunto</th>
              <th>Data</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="mensagem in mensagens" :key="mensagem.codigo">
              <td>
                <strong>{{ mensagem.nome }}</strong
                ><br /><small>{{ mensagem.email }}</small>
              </td>
              <td>{{ mensagem.assunto }}</td>
              <td>{{ mensagem.data }}</td>
              <td>
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
                >
              </td>
              <td>
                <button class="btn btn-secondary" @click="abrir(mensagem)">
                  Consultar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
    <MessageModal
      :aberto="Boolean(selecionada)"
      :mensagem="selecionada"
      @fechar="selecionada = null"
      @excluir="excluir"
    />
  </div>
</template>
