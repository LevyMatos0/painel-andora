<script setup>
import { reactive, watch, ref } from "vue";
import BaseModal from "./BaseModal.vue";

const props = defineProps({ aberto: Boolean, servico: Object });
const emit = defineEmits(["fechar", "salvar"]);

const servicoFileInput = ref(null);
const arquivoServico = ref(null);

// Variável para gerir a aba de idioma no Modal
const idiomaModal = ref("pt");
const erroFormulario = ref("");

const formulario = reactive({
  codigo: null,
  titulo: "",
  titulo_ingles: "",
  descricao: "",
  descricao_ingles: "",
  informacoes: "",
  informacoes_ingles: "",
  icone: "",
  ordem: 1,
  ativo: true,
});

watch(
  () => [props.aberto, props.servico],
  () => {
    erroFormulario.value = "";
    arquivoServico.value = null;
    idiomaModal.value = "pt"; // Reinicia sempre na aba PT ao abrir
    Object.assign(
      formulario,
      props.servico
        ? { ...props.servico }
        : {
            codigo: null,
            titulo: "",
            titulo_ingles: "",
            descricao: "",
            descricao_ingles: "",
            informacoes: "",
            informacoes_ingles: "",
            icone: "",
            ordem: 1,
            ativo: true,
          },
    );
  },
  { immediate: true },
);

function onFileChange(e) {
  arquivoServico.value = e.target.files[0];
}

function enviar() {
  if (!formulario.titulo.trim() || !formulario.descricao.trim()) {
    idiomaModal.value = "pt";
    erroFormulario.value = "Preencha o título e a descrição em português.";
    return;
  }
  erroFormulario.value = "";
  emit("salvar", { ...formulario, arquivo: arquivoServico.value });
}
</script>

<template>
  <BaseModal
    :aberto="aberto"
    :titulo="formulario.codigo ? 'Editar serviço' : 'Adicionar serviço'"
    descricao="Preencha as informações exibidas no site."
    @fechar="$emit('fechar')"
  >
    <form @submit.prevent="enviar">
      <div class="modal-body">
        <p v-if="erroFormulario" class="status-alert" role="alert">
          {{ erroFormulario }}
        </p>
        <div class="form-grid">
          <!-- ABAS DE IDIOMA -->
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
            <div class="field">
              <label for="srv-titulo">Título (PT)</label>
              <input
                id="srv-titulo"
                v-model.trim="formulario.titulo"
                class="input"
                required
              />
            </div>
            <div class="field full">
              <label for="srv-descricao">Descrição (PT)</label>
              <textarea
                id="srv-descricao"
                v-model="formulario.descricao"
                class="textarea"
                required
              ></textarea>
            </div>
            <div class="field full">
              <label for="srv-info">Informações adicionais (PT)</label>
              <input
                id="srv-info"
                v-model="formulario.informacoes"
                class="input"
              />
            </div>
          </template>

          <!-- CAMPOS EM INGLÊS -->
          <template v-if="idiomaModal === 'en'">
            <div class="field">
              <label for="srv-titulo-en">Título (EN)</label>
              <input
                id="srv-titulo-en"
                v-model.trim="formulario.titulo_ingles"
                class="input"
                placeholder="Tradução do título"
              />
            </div>
            <div class="field full">
              <label for="srv-descricao-en">Descrição (EN)</label>
              <textarea
                id="srv-descricao-en"
                v-model="formulario.descricao_ingles"
                class="textarea"
                placeholder="Tradução da descrição"
              ></textarea>
            </div>
            <div class="field full">
              <label for="srv-info-en">Informações adicionais (EN)</label>
              <input
                id="srv-info-en"
                v-model="formulario.informacoes_ingles"
                class="input"
                placeholder="Tradução extra"
              />
            </div>
          </template>

          <!-- CAMPO DE IMAGEM -->
          <div class="field full">
            <label>Ícone / Imagem</label>
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
              @click="servicoFileInput.click()"
            >
              <input
                ref="servicoFileInput"
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
                  arquivoServico
                    ? arquivoServico.name
                    : "Nenhum ficheiro selecionado"
                }}
              </span>
            </div>
            <small
              v-if="formulario.icone && !arquivoServico"
              style="
                display: block;
                margin-top: 6px;
                color: var(--navy-600, #64748b);
              "
            >
              Ficheiro atual: {{ formulario.icone }}
            </small>
          </div>

          <!-- OPÇÕES: ORDEM E STATUS -->
          <div class="field">
            <label for="srv-ordem">Ordem</label>
            <input
              id="srv-ordem"
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
              <input v-model="formulario.ativo" type="checkbox" /> Serviço ativo
            </label>
          </div>
        </div>
      </div>
      <div class="form-actions">
        <button
          type="button"
          class="btn btn-secondary"
          @click="$emit('fechar')"
        >
          Cancelar
        </button>
        <button class="btn btn-primary">Salvar serviço</button>
      </div>
    </form>
  </BaseModal>
</template>
