<script setup>
import { reactive, ref, onMounted } from "vue";
import BaseModal from "../components/BaseModal.vue";
import { apiRequest, uploadUrl } from "../services/api";

const membros = ref([]);
const modal = ref(false);
const erroCarga = ref("");
const carregando = ref(false);
const arquivoFoto = ref(null);
const fotoFileInput = ref(null);

// Controla a aba de idioma ativa dentro do modal
const idiomaModal = ref("pt");

const formulario = reactive({
  codigo: null,
  nome: "",
  cargo: "",
  cargo_ingles: "",
  texto: "",
  texto_ingles: "",
  linkedin: "",
  github: "",
  foto: "",
  ordem: 1,
  status: true,
});

async function carregarEquipe() {
  carregando.value = true;
  erroCarga.value = "";
  try {
    const dados = await apiRequest("/team");
    membros.value = dados.map((m) => {
      const nomeMembro = m.nome || m.tms_nome || "Sem Nome";
      const valorStatus = m.status !== undefined ? m.status : m.tms_status;

      return {
        codigo: m.id || m.tms_codigo,
        nome: nomeMembro,
        cargo: m.cargo || m.tms_cargo,
        cargo_ingles: m.cargo_ingles || m.tms_cargo_ingles || "",
        texto: m.texto || m.tms_apresentacao,
        texto_ingles: m.texto_ingles || m.tms_apresentacao_ingles || "",
        linkedin: m.linkedin || m.tms_linkedin,
        github: m.github || m.tms_github,
        foto: m.foto || m.tms_imagem,
        ordem: m.ordem !== undefined ? m.ordem : m.tms_ordem,
        status: String(valorStatus) === "1" || valorStatus === true,
        iniciais: nomeMembro
          .split(" ")
          .map((n) => n[0])
          .slice(0, 2)
          .join("")
          .toUpperCase(),
      };
    });

    membros.value.sort((a, b) => a.ordem - b.ordem);
  } catch (erro) {
    erroCarga.value = erro.message;
  } finally {
    carregando.value = false;
  }
}

function abrir(item) {
  arquivoFoto.value = null;
  idiomaModal.value = "pt"; // Abre sempre na aba em português por defeito

  let proximaOrdem = 1;
  if (!item && membros.value.length > 0) {
    proximaOrdem =
      Math.max(...membros.value.map((m) => Number(m.ordem) || 0)) + 1;
  }

  Object.assign(
    formulario,
    item
      ? { ...item }
      : {
          codigo: null,
          nome: "",
          cargo: "",
          cargo_ingles: "",
          texto: "",
          texto_ingles: "",
          linkedin: "",
          github: "",
          foto: "",
          ordem: proximaOrdem,
          status: true,
        },
  );
  modal.value = true;
}

function onFileChange(e) {
  arquivoFoto.value = e.target.files[0];
}

async function salvar() {
  try {
    const formData = new FormData();
    formData.append("nome", formulario.nome);
    formData.append("cargo", formulario.cargo);
    formData.append("cargo_ingles", formulario.cargo_ingles || "");
    formData.append("texto", formulario.texto || "");
    formData.append("texto_ingles", formulario.texto_ingles || "");
    formData.append("linkedin", formulario.linkedin || "");
    formData.append("github", formulario.github || "");

    formData.append("ordem", Number(formulario.ordem));
    formData.append("status", formulario.status ? "1" : "0");

    if (arquivoFoto.value) {
      formData.append("foto", arquivoFoto.value);
    }

    if (formulario.codigo) {
      await apiRequest(`/team/${formulario.codigo}`, {
        method: "PUT",
        body: formData,
      });
    } else {
      await apiRequest("/team", { method: "POST", body: formData });
    }

    modal.value = false;
    await carregarEquipe();
  } catch (erro) {
    alert(erro.message || "Erro ao salvar membro.");
  }
}

async function excluir(codigo) {
  if (!confirm("Deseja excluir este membro?")) return;
  try {
    await apiRequest(`/team/${codigo}`, { method: "DELETE" });
    membros.value = membros.value.filter((m) => m.codigo !== codigo);
  } catch (erro) {
    alert("Erro ao excluir.");
  }
}

onMounted(carregarEquipe);
</script>

<template>
  <div class="page-content">
    <p v-if="erroCarga" class="status-alert" role="alert">
      {{ erroCarga }}
      <button class="btn btn-secondary" @click="carregarEquipe">
        Tentar novamente
      </button>
    </p>
    <p v-if="carregando" class="state-empty">Carregando dados…</p>
    <section class="page-head">
      <div>
        <h2>Time Andora</h2>
        <p>Gerencie fotos, textos e links profissionais.</p>
      </div>
      <button class="btn btn-primary" @click="abrir()">
        ＋ Adicionar membro
      </button>
    </section>

    <section class="grid grid-2">
      <article
        v-for="membro in membros"
        :key="membro.codigo"
        class="card team-card"
        style="position: relative; display: flex; flex-direction: column"
      >
        <div
          style="
            position: absolute;
            top: 16px;
            right: 16px;
            display: flex;
            gap: 8px;
            align-items: center;
          "
        >
          <span style="font-size: 13px; font-weight: 600; color: #64748b"
            >Ordem: {{ membro.ordem }}</span
          >
          <span
            class="badge"
            :class="membro.status ? 'badge-success' : 'badge-inativo'"
          >
            {{ membro.status ? "Ativo" : "Inativo" }}
          </span>
        </div>

        <div class="team-head" style="margin-top: 16px">
          <div
            class="team-photo avatar"
            :style="
              membro.foto
                ? {
                    backgroundImage: `url('${uploadUrl(membro.foto)}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }
                : {}
            "
          >
            {{ membro.foto ? "" : membro.iniciais }}
          </div>
          <div>
            <h3>{{ membro.nome }}</h3>
            <p>{{ membro.cargo }}</p>
          </div>
        </div>

        <div class="team-actions" style="margin-top: auto; padding-top: 16px">
          <button class="btn btn-secondary" @click="abrir(membro)">
            Editar perfil
          </button>
          <button class="btn btn-danger" @click="excluir(membro.codigo)">
            Excluir
          </button>
        </div>
      </article>

      <div
        v-if="membros.length === 0"
        style="
          grid-column: 1 / -1;
          text-align: center;
          padding: 40px;
          color: #64748b;
        "
      >
        Nenhum membro cadastrado na equipa.
      </div>
    </section>

    <!-- MODAL DE EDIÇÃO -->
    <BaseModal
      :aberto="modal"
      :titulo="formulario.codigo ? 'Editar membro' : 'Adicionar membro'"
      descricao="Informações públicas do perfil."
      @fechar="modal = false"
    >
      <form @submit.prevent="salvar">
        <div class="modal-body">
          <div class="form-grid">
            <div class="field full">
              <label>Nome</label>
              <input v-model="formulario.nome" class="input" required />
            </div>

            <!-- NAVEGAÇÃO DE IDIOMAS DENTRO DO MODAL -->
            <div
              class="field full"
              style="
                margin-bottom: 8px;
                display: flex;
                gap: 16px;
                border-bottom: 2px solid #f1f5f9;
                padding-bottom: 4px;
              "
            >
              <button
                type="button"
                @click="idiomaModal = 'pt'"
                :style="
                  idiomaModal === 'pt'
                    ? 'font-weight: 700; color: #061930; border-bottom: 2px solid #061930; margin-bottom: -6px; background: none; border-top: none; border-left: none; border-right: none; cursor: pointer; font-size: 14px; padding-bottom: 4px;'
                    : 'color: #64748b; background: none; border: none; cursor: pointer; font-size: 14px; padding-bottom: 4px;'
                "
              >
                Português (PT)
              </button>
              <button
                type="button"
                @click="idiomaModal = 'en'"
                :style="
                  idiomaModal === 'en'
                    ? 'font-weight: 700; color: #061930; border-bottom: 2px solid #061930; margin-bottom: -6px; background: none; border-top: none; border-left: none; border-right: none; cursor: pointer; font-size: 14px; padding-bottom: 4px;'
                    : 'color: #64748b; background: none; border: none; cursor: pointer; font-size: 14px; padding-bottom: 4px;'
                "
              >
                Inglês (EN)
              </button>
            </div>

            <!-- CAMPOS EM PORTUGUÊS -->
            <template v-if="idiomaModal === 'pt'">
              <div class="field full">
                <label>Cargo (PT)</label>
                <input v-model="formulario.cargo" class="input" required />
              </div>
              <div class="field full">
                <label>Apresentação (PT)</label>
                <textarea
                  v-model="formulario.texto"
                  class="textarea"
                ></textarea>
              </div>
            </template>

            <!-- CAMPOS EM INGLÊS -->
            <template v-if="idiomaModal === 'en'">
              <div class="field full">
                <label>Cargo (EN)</label>
                <input
                  v-model="formulario.cargo_ingles"
                  class="input"
                  placeholder="Tradução do cargo"
                />
              </div>
              <div class="field full">
                <label>Apresentação (EN)</label>
                <textarea
                  v-model="formulario.texto_ingles"
                  class="textarea"
                  placeholder="Tradução da apresentação"
                ></textarea>
              </div>
            </template>

            <div class="field">
              <label>LinkedIn</label>
              <input v-model="formulario.linkedin" class="input" />
            </div>
            <div class="field">
              <label>GitHub</label>
              <input v-model="formulario.github" class="input" />
            </div>

            <!-- CAMPO DE FOTO ALINHADO -->
            <div class="field full">
              <label>Foto</label>
              <div
                class="input"
                style="
                  padding: 0;
                  display: flex;
                  align-items: stretch;
                  cursor: pointer;
                  overflow: hidden;
                  min-height: 42px;
                "
                @click="fotoFileInput.click()"
              >
                <input
                  ref="fotoFileInput"
                  type="file"
                  accept="image/*"
                  @change="onFileChange"
                  style="display: none"
                />
                <span
                  style="
                    background-color: #f1f5f9;
                    padding: 0 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-right: 1px solid #e2e8f0;
                    font-weight: 600;
                    color: #475569;
                    font-size: 14px;
                    transition: background-color 0.2s;
                  "
                  onmouseover="this.style.backgroundColor='#e2e8f0'"
                  onmouseout="this.style.backgroundColor='#f1f5f9'"
                >
                  Procurar...
                </span>
                <span
                  style="
                    padding: 0 16px;
                    display: flex;
                    align-items: center;
                    color: #64748b;
                    font-size: 14px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    flex-grow: 1;
                  "
                >
                  {{
                    arquivoFoto
                      ? arquivoFoto.name
                      : "Nenhum ficheiro selecionado"
                  }}
                </span>
              </div>
              <small
                v-if="formulario.foto && !arquivoFoto"
                style="
                  display: block;
                  margin-top: 6px;
                  color: var(--navy-600, #64748b);
                "
              >
                Foto atual: {{ formulario.foto }}
              </small>
            </div>

            <div class="field">
              <label>Ordem</label>
              <input
                v-model.number="formulario.ordem"
                class="input"
                type="number"
                min="0"
              />
            </div>
            <div class="field" style="display: flex; align-items: center">
              <label
                style="
                  display: flex;
                  align-items: center;
                  gap: 8px;
                  cursor: pointer;
                  margin: 0;
                  transform: translateY(12px);
                "
              >
                <input v-model="formulario.status" type="checkbox" /> Membro
                ativo
              </label>
            </div>
          </div>
        </div>
        <div class="form-actions">
          <button
            type="button"
            class="btn btn-secondary"
            @click="modal = false"
          >
            Cancelar
          </button>
          <button class="btn btn-primary">Salvar membro</button>
        </div>
      </form>
    </BaseModal>
  </div>
</template>

<style scoped>
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
