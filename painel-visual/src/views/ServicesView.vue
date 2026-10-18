<script setup>
import { ref, onMounted } from "vue";
import ServiceModal from "../components/ServiceModal.vue";
import AppNotice from "../components/AppNotice.vue";
import { apiRequest, uploadUrl } from "../services/api";

const servicos = ref([]);
const erroCarga = ref("");
const carregando = ref(true);
const modalAberto = ref(false);
const selecionado = ref(null);
const aviso = ref(false);
const textoAviso = ref("");

function exibirAviso(mensagem) {
  textoAviso.value = mensagem;
  aviso.value = true;
  setTimeout(() => {
    aviso.value = false;
  }, 2500);
}

async function carregarServicos() {
  carregando.value = true;
  erroCarga.value = "";
  try {
    const dados = await apiRequest("/servicos");
    servicos.value = dados.map((s) => {
      const valorAtivo = s.ativo !== undefined ? s.ativo : s.srv_ativo;
      return {
        codigo: s.id || s.srv_codigo,
        titulo: s.titulo || s.srv_titulo,
        titulo_ingles: s.titulo_ingles || s.srv_titulo_ingles || "",
        descricao: s.descricao || s.srv_descricao,
        descricao_ingles: s.descricao_ingles || s.srv_descricao_ingles || "",
        informacoes: s.informacoes || s.srv_informacoes,
        informacoes_ingles:
          s.informacoes_ingles || s.srv_informacoes_ingles || "",
        icone: s.icone || s.srv_icone,
        ordem: s.ordem !== undefined ? s.ordem : s.srv_ordem,
        ativo: String(valorAtivo) === "1" || valorAtivo === true,
      };
    });

    servicos.value.sort((a, b) => a.ordem - b.ordem);
  } catch (erro) {
    erroCarga.value = erro.message;
  } finally {
    carregando.value = false;
  }
}

function adicionar() {
  let proximaOrdem = 1;
  if (servicos.value.length > 0) {
    proximaOrdem =
      Math.max(...servicos.value.map((s) => Number(s.ordem) || 0)) + 1;
  }

  selecionado.value = {
    codigo: null,
    titulo: "",
    titulo_ingles: "",
    descricao: "",
    descricao_ingles: "",
    informacoes: "",
    informacoes_ingles: "",
    icone: "",
    ordem: proximaOrdem,
    ativo: true,
  };
  modalAberto.value = true;
}

function editar(item) {
  selecionado.value = { ...item };
  modalAberto.value = true;
}

async function salvar(item) {
  try {
    const formData = new FormData();
    formData.append("titulo", item.titulo);
    formData.append("titulo_ingles", item.titulo_ingles || "");
    formData.append("descricao", item.descricao);
    formData.append("descricao_ingles", item.descricao_ingles || "");
    formData.append("informacoes", item.informacoes || "");
    formData.append("informacoes_ingles", item.informacoes_ingles || "");
    formData.append("ordem", Number(item.ordem));
    formData.append("ativo", item.ativo ? "1" : "0");

    if (item.arquivo) {
      formData.append("icone", item.arquivo);
    }

    if (item.codigo) {
      await apiRequest(`/servicos/${item.codigo}`, {
        method: "PUT",
        body: formData,
      });
      exibirAviso("Serviço atualizado com sucesso.");
    } else {
      await apiRequest("/servicos", { method: "POST", body: formData });
      exibirAviso("Serviço adicionado com sucesso.");
    }

    modalAberto.value = false;
    await carregarServicos();
  } catch (erro) {
    alert(erro.message || "Falha ao gravar o serviço.");
  }
}

async function excluir(codigo) {
  if (!confirm("Tem a certeza de que deseja remover este serviço?")) return;

  try {
    await apiRequest(`/servicos/${codigo}`, { method: "DELETE" });
    servicos.value = servicos.value.filter((s) => s.codigo !== codigo);
    exibirAviso("Serviço excluído com sucesso.");
  } catch (erro) {
    alert(erro.message || "Falha ao excluir o serviço.");
  }
}

onMounted(carregarServicos);
</script>

<template>
  <div class="page-content">
    <p v-if="erroCarga" class="status-alert" role="alert">
      {{ erroCarga }}
      <button class="btn btn-secondary" @click="carregarServicos">
        Tentar novamente
      </button>
    </p>
    <section class="page-head">
      <div>
        <h2>Serviços Andora</h2>
        <p>Gerencie os serviços oferecidos e exibidos no site.</p>
      </div>
      <button class="btn btn-primary" @click="adicionar()">
        ＋ Adicionar serviço
      </button>
    </section>

    <section class="card" style="padding: 0; overflow-x: auto">
      <table class="table">
        <thead>
          <tr>
            <th>Ordem</th>
            <th>Serviço</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="carregando">
            <td colspan="4" style="text-align: center; padding: 24px">
              A carregar serviços...
            </td>
          </tr>
          <tr v-else-if="servicos.length === 0">
            <td colspan="4" style="text-align: center; padding: 24px">
              Nenhum serviço cadastrado.
            </td>
          </tr>
          <tr v-for="servico in servicos" :key="servico.codigo">
            <td style="width: 80px; text-align: center">{{ servico.ordem }}</td>
            <td>
              <div style="display: flex; align-items: center; gap: 12px">
                <div
                  v-if="servico.icone"
                  style="
                    width: 32px;
                    height: 32px;
                    border-radius: 4px;
                    background-size: cover;
                    background-position: center;
                    border: 1px solid #e2e8f0;
                  "
                  :style="{
                    backgroundImage: `url('${uploadUrl(servico.icone)}')`,
                  }"
                ></div>
                <div
                  v-else
                  style="
                    width: 32px;
                    height: 32px;
                    border-radius: 4px;
                    background-color: #f1f5f9;
                    border: 1px solid #e2e8f0;
                  "
                ></div>
                <div style="display: flex; flex-direction: column">
                  <span style="font-weight: 600; color: #0f172a">{{
                    servico.titulo
                  }}</span>
                  <span
                    style="
                      font-size: 12px;
                      color: #64748b;
                      max-width: 300px;
                      white-space: nowrap;
                      overflow: hidden;
                      text-overflow: ellipsis;
                    "
                    >{{ servico.descricao }}</span
                  >
                </div>
              </div>
            </td>
            <td>
              <span
                class="badge"
                :class="servico.ativo ? 'badge-success' : 'badge-inativo'"
              >
                {{ servico.ativo ? "Ativo" : "Inativo" }}
              </span>
            </td>
            <td style="width: 180px">
              <div style="display: flex; gap: 8px">
                <button
                  class="btn btn-secondary"
                  style="padding: 6px 12px; min-width: unset"
                  @click="editar(servico)"
                >
                  Editar
                </button>
                <button
                  class="btn btn-danger"
                  style="padding: 6px 12px; min-width: unset"
                  @click="excluir(servico.codigo)"
                >
                  Excluir
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- Janela de Edição (Modal) que preparámos no ficheiro separado -->
    <ServiceModal
      :aberto="modalAberto"
      :servico="selecionado"
      @fechar="modalAberto = false"
      @salvar="salvar"
    />

    <AppNotice :visivel="aviso" :texto="textoAviso" />
  </div>
</template>

<style scoped>
.table {
  width: 100%;
  border-collapse: collapse;
}
.table th {
  background-color: #f8fafc;
  padding: 12px 16px;
  text-align: left;
  font-size: 13px;
  font-weight: 600;
  color: #475569;
  border-bottom: 1px solid #e2e8f0;
}
.table td {
  padding: 16px;
  border-bottom: 1px solid #e2e8f0;
  vertical-align: middle;
}
.table tr:last-child td {
  border-bottom: none;
}
.badge-inativo {
  background-color: #fef2f2;
  color: #dc2626;
  border: 1px solid #dc2626;
}
.badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
}
.badge-success {
  background-color: #f0fdf4;
  color: #16a34a;
  border: 1px solid #16a34a;
}
</style>
