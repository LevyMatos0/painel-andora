<template>
  <div>
    <div class="tabs">
      <button
        v-for="item in ['hero', 'sobre', 'faq', 'contato']"
        :key="item"
        class="tab"
        :class="{ active: aba === item }"
        @click="aba = item"
      >
        {{ item.toUpperCase() }}
      </button>
    </div>

    <p v-if="erroCarga" class="status-alert" role="alert">
      {{ erroCarga }}
      <button class="btn btn-secondary" @click="carregarDados">
        Tentar novamente
      </button>
    </p>
    <div
      v-if="carregando"
      style="
        margin-top: 20px;
        padding: 24px;
        text-align: center;
        color: var(--navy-600, #64748b);
      "
    >
      A carregar dados do site...
    </div>

    <div v-else-if="!erroCarga" class="section-stack" style="margin-top: 20px">
      <!-- CONTROLO DE IDIOMA GLOBAL (Só aparece se não for a aba Contato) -->
      <div
        v-if="aba !== 'contato'"
        style="
          margin-bottom: 16px;
          display: flex;
          gap: 16px;
          border-bottom: 2px solid #f1f5f9;
          padding-bottom: 4px;
        "
      >
        <button
          type="button"
          @click="idiomaEdicao = 'pt'"
          :style="
            idiomaEdicao === 'pt'
              ? 'font-weight: 700; color: #061930; border-bottom: 2px solid #061930; margin-bottom: -6px; background: none; border-top: none; border-left: none; border-right: none; cursor: pointer; font-size: 14px; padding-bottom: 4px;'
              : 'color: #64748b; background: none; border: none; cursor: pointer; font-size: 14px; padding-bottom: 4px;'
          "
        >
          Português (PT)
        </button>
        <button
          type="button"
          @click="idiomaEdicao = 'en'"
          :style="
            idiomaEdicao === 'en'
              ? 'font-weight: 700; color: #061930; border-bottom: 2px solid #061930; margin-bottom: -6px; background: none; border-top: none; border-left: none; border-right: none; cursor: pointer; font-size: 14px; padding-bottom: 4px;'
              : 'color: #64748b; background: none; border: none; cursor: pointer; font-size: 14px; padding-bottom: 4px;'
          "
        >
          Inglês (EN)
        </button>
      </div>

      <!-- Seção HERO -->
      <section v-if="aba === 'hero'" class="card card-pad">
        <div class="section-title">
          <div>
            <h3>Hero</h3>
            <span>Primeira área da página inicial</span>
          </div>
        </div>
        <div class="form-grid">
          <template v-if="idiomaEdicao === 'pt'">
            <div class="field full">
              <label>Título (PT)</label>
              <input v-model="conteudo.hero.titulo" class="input" />
            </div>
            <div class="field full">
              <label>Descrição (PT)</label>
              <textarea
                v-model="conteudo.hero.descricao"
                class="textarea"
              ></textarea>
            </div>
          </template>

          <template v-if="idiomaEdicao === 'en'">
            <div class="field full">
              <label>Título (EN)</label>
              <input
                v-model="conteudo.hero.titulo_ingles"
                class="input"
                placeholder="Tradução do título"
              />
            </div>
            <div class="field full">
              <label>Descrição (EN)</label>
              <textarea
                v-model="conteudo.hero.descricao_ingles"
                class="textarea"
                placeholder="Tradução da descrição"
              ></textarea>
            </div>
          </template>

          <div class="field full">
            <label>Imagem</label>
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
              @click="$refs.heroFileInput.click()"
            >
              <input
                ref="heroFileInput"
                type="file"
                accept="image/*"
                @change="(e) => onFileChange(e, 'hero')"
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
                >Procurar...</span
              >
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
                {{ heroFile ? heroFile.name : "Nenhum ficheiro selecionado" }}
              </span>
            </div>
            <small
              v-if="conteudo.hero.imagem"
              style="
                display: block;
                margin-top: 6px;
                color: var(--navy-600, #64748b);
              "
            >
              Imagem atual: {{ conteudo.hero.imagem }}
            </small>
          </div>
        </div>
        <div class="form-actions">
          <button class="btn btn-primary" :disabled="salvando" @click="salvar">
            {{ salvando ? "A guardar..." : "Salvar alterações" }}
          </button>
        </div>
      </section>

      <!-- Seção SOBRE -->
      <section v-else-if="aba === 'sobre'" class="card card-pad">
        <div class="section-title">
          <h3>Sobre</h3>
        </div>
        <div class="form-grid">
          <template v-if="idiomaEdicao === 'pt'">
            <div class="field full">
              <label>Título (PT)</label>
              <input v-model="conteudo.sobre.titulo" class="input" />
            </div>
            <div class="field full">
              <label>Texto (PT)</label>
              <textarea
                v-model="conteudo.sobre.texto"
                class="textarea"
              ></textarea>
            </div>
          </template>

          <template v-if="idiomaEdicao === 'en'">
            <div class="field full">
              <label>Título (EN)</label>
              <input
                v-model="conteudo.sobre.titulo_ingles"
                class="input"
                placeholder="Tradução do título"
              />
            </div>
            <div class="field full">
              <label>Texto (EN)</label>
              <textarea
                v-model="conteudo.sobre.texto_ingles"
                class="textarea"
                placeholder="Tradução do texto"
              ></textarea>
            </div>
          </template>

          <div class="field full">
            <label>Imagem</label>
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
              @click="$refs.sobreFileInput.click()"
            >
              <input
                ref="sobreFileInput"
                type="file"
                accept="image/*"
                @change="(e) => onFileChange(e, 'sobre')"
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
                >Procurar...</span
              >
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
                {{ sobreFile ? sobreFile.name : "Nenhum ficheiro selecionado" }}
              </span>
            </div>
            <small
              v-if="conteudo.sobre.imagem"
              style="
                display: block;
                margin-top: 6px;
                color: var(--navy-600, #64748b);
              "
            >
              Imagem atual: {{ conteudo.sobre.imagem }}
            </small>
          </div>
        </div>
        <div class="form-actions">
          <button class="btn btn-primary" :disabled="salvando" @click="salvar">
            {{ salvando ? "A guardar..." : "Salvar alterações" }}
          </button>
        </div>
      </section>

      <!-- Seção FAQ -->
      <section v-else-if="aba === 'faq'" class="card card-pad">
        <div class="section-title">
          <div>
            <h3>Perguntas frequentes</h3>
            <span>{{ faqs.length }} perguntas cadastradas</span>
          </div>
          <button class="btn btn-primary" @click="adicionarFaq">
            ＋ Nova pergunta
          </button>
        </div>

        <div
          v-for="(faq, index) in faqs"
          :key="faq.codigo"
          class="faq-row"
          style="
            border: 1px solid #e2e8f0;
            padding: 16px;
            margin-bottom: 16px;
            border-radius: 8px;
          "
        >
          <div
            style="
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 12px;
              padding-bottom: 12px;
              border-bottom: 1px solid #f1f5f9;
            "
          >
            <div style="display: flex; gap: 8px; align-items: center">
              <span style="font-size: 14px; font-weight: 600; color: #64748b"
                >Ordem: {{ faq.ordem }}</span
              >
              <button
                class="btn btn-secondary"
                style="padding: 2px 8px; min-width: unset"
                @click="moverFaq(index, -1)"
                :disabled="index === 0"
              >
                ▲
              </button>
              <button
                class="btn btn-secondary"
                style="padding: 2px 8px; min-width: unset"
                @click="moverFaq(index, 1)"
                :disabled="index === faqs.length - 1"
              >
                ▼
              </button>
            </div>
            <button
              @click="alternarStatus(faq)"
              :style="{
                backgroundColor: faq.status === 1 ? '#86895D' : '#3D240C',
                color: 'white',
                padding: '4px 12px',
                border: 'none',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 'bold',
                cursor: 'pointer',
              }"
            >
              {{ faq.status === 1 ? "Ativo" : "Oculto" }}
            </button>
          </div>

          <template v-if="idiomaEdicao === 'pt'">
            <label
              style="
                font-size: 12px;
                font-weight: bold;
                margin-bottom: 4px;
                display: block;
              "
              >Pergunta (PT)</label
            >
            <input v-model="faq.pergunta" class="input" />
            <label
              style="
                font-size: 12px;
                font-weight: bold;
                margin-top: 12px;
                margin-bottom: 4px;
                display: block;
              "
              >Resposta (PT)</label
            >
            <textarea v-model="faq.resposta" class="textarea"></textarea>
          </template>

          <template v-if="idiomaEdicao === 'en'">
            <label
              style="
                font-size: 12px;
                font-weight: bold;
                margin-bottom: 4px;
                display: block;
              "
              >Pergunta (EN)</label
            >
            <input
              v-model="faq.pergunta_ingles"
              class="input"
              placeholder="Tradução da pergunta"
            />
            <label
              style="
                font-size: 12px;
                font-weight: bold;
                margin-top: 12px;
                margin-bottom: 4px;
                display: block;
              "
              >Resposta (EN)</label
            >
            <textarea
              v-model="faq.resposta_ingles"
              class="textarea"
              placeholder="Tradução da resposta"
            ></textarea>
          </template>

          <div
            class="row-actions"
            style="margin-top: 16px; display: flex; gap: 10px"
          >
            <button class="btn btn-secondary" @click="salvarFaq(faq)">
              Salvar esta pergunta
            </button>
            <button class="btn btn-danger" @click="excluirFaq(faq.codigo)">
              Excluir
            </button>
          </div>
        </div>
      </section>

      <!-- Seção CONTATO (Não precisa de inglês) -->
      <section v-else class="card card-pad">
        <div class="section-title">
          <h3>Contato</h3>
        </div>
        <div class="form-grid">
          <div
            v-for="(_, campo) in conteudo.contato"
            :key="campo"
            class="field"
          >
            <label style="text-transform: capitalize">{{ campo }}</label>
            <input v-model="conteudo.contato[campo]" class="input" />
          </div>
        </div>
        <div class="form-actions">
          <button class="btn btn-primary" :disabled="salvando" @click="salvar">
            {{ salvando ? "A guardar..." : "Salvar alterações" }}
          </button>
        </div>
      </section>
    </div>

    <AppNotice :visivel="aviso" :texto="textoAviso" />
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import AppNotice from "../components/AppNotice.vue";
import { apiRequest } from "../services/api";

const route = useRoute();
const aba = ref("hero");
watch(
  () => route.query.aba,
  (value) => {
    if (["hero", "sobre", "faq", "contato"].includes(value)) aba.value = value;
  },
  { immediate: true },
);
const idiomaEdicao = ref("pt"); // Variável que controla a aba PT/EN
const aviso = ref(false);
const textoAviso = ref("");
const carregando = ref(true);
const salvando = ref(false);
const erroCarga = ref("");

const conteudo = reactive({
  hero: {
    titulo: "",
    titulo_ingles: "",
    descricao: "",
    descricao_ingles: "",
    imagem: null,
  },
  sobre: {
    titulo: "",
    titulo_ingles: "",
    texto: "",
    texto_ingles: "",
    imagem: null,
  },
  contato: { endereco: "", telefone: "", email: "", mapa: "" },
});

const faqs = ref([]);
const heroFile = ref(null);
const sobreFile = ref(null);

function exibirAviso(texto) {
  textoAviso.value = texto;
  aviso.value = true;
  setTimeout(() => (aviso.value = false), 2200);
}

async function carregarDados() {
  erroCarga.value = "";
  carregando.value = true;
  try {
    const [siteRes, faqsRes] = await Promise.all([
      apiRequest("/site").catch(() => null),
      apiRequest("/faqs").catch(() => []),
    ]);

    if (siteRes) {
      if (siteRes.hero) {
        conteudo.hero.titulo =
          siteRes.hero.titulo || siteRes.hero.her_titulo || "";
        conteudo.hero.titulo_ingles =
          siteRes.hero.titulo_ingles || siteRes.hero.her_titulo_ingles || "";
        conteudo.hero.descricao =
          siteRes.hero.descricao || siteRes.hero.her_descricao || "";
        conteudo.hero.descricao_ingles =
          siteRes.hero.descricao_ingles ||
          siteRes.hero.her_descricao_ingles ||
          "";
        conteudo.hero.imagem =
          siteRes.hero.imagem || siteRes.hero.her_imagem || null;
      }
      if (siteRes.sobre) {
        conteudo.sobre.titulo =
          siteRes.sobre.titulo || siteRes.sobre.abt_titulo || "";
        conteudo.sobre.titulo_ingles =
          siteRes.sobre.titulo_ingles || siteRes.sobre.abt_titulo_ingles || "";
        conteudo.sobre.texto =
          siteRes.sobre.texto || siteRes.sobre.abt_texto || "";
        conteudo.sobre.texto_ingles =
          siteRes.sobre.texto_ingles || siteRes.sobre.abt_texto_ingles || "";
        conteudo.sobre.imagem =
          siteRes.sobre.imagem || siteRes.sobre.abt_imagem || null;
      }
      if (siteRes.contato) {
        conteudo.contato.endereco =
          siteRes.contato.endereco || siteRes.contato.cto_endereco || "";
        conteudo.contato.telefone =
          siteRes.contato.telefone || siteRes.contato.cto_telefone || "";
        conteudo.contato.email =
          siteRes.contato.email || siteRes.contato.cto_email || "";
        conteudo.contato.mapa =
          siteRes.contato.mapa || siteRes.contato.cto_mapa || "";
      }
    }

    if (Array.isArray(faqsRes)) {
      faqs.value = faqsRes.map((f) => ({
        codigo: f.id || f.faq_codigo,
        pergunta: f.pergunta || f.faq_pergunta,
        pergunta_ingles: f.pergunta_ingles || f.faq_pergunta_ingles || "",
        resposta: f.resposta || f.faq_resposta,
        resposta_ingles: f.resposta_ingles || f.faq_resposta_ingles || "",
        ordem: f.ordem !== undefined ? f.ordem : f.faq_ordem,
        status: f.status !== undefined ? f.status : f.faq_status,
      }));
      faqs.value.sort((a, b) => a.ordem - b.ordem);
    }
  } catch (err) {
    erroCarga.value = err.message;
  } finally {
    carregando.value = false;
  }
}

function onFileChange(e, tipo) {
  const file = e.target.files[0];
  if (tipo === "hero") heroFile.value = file;
  if (tipo === "sobre") sobreFile.value = file;
}

async function salvar() {
  salvando.value = true;
  try {
    const formData = new FormData();
    formData.append("secao", aba.value);

    if (aba.value === "hero") {
      formData.append("titulo", conteudo.hero.titulo);
      formData.append("titulo_ingles", conteudo.hero.titulo_ingles || "");
      formData.append("descricao", conteudo.hero.descricao);
      formData.append("descricao_ingles", conteudo.hero.descricao_ingles || "");
      if (heroFile.value) formData.append("imagem", heroFile.value);
    } else if (aba.value === "sobre") {
      formData.append("titulo", conteudo.sobre.titulo);
      formData.append("titulo_ingles", conteudo.sobre.titulo_ingles || "");
      formData.append("texto", conteudo.sobre.texto);
      formData.append("texto_ingles", conteudo.sobre.texto_ingles || "");
      if (sobreFile.value) formData.append("imagem", sobreFile.value);
    } else if (aba.value === "contato") {
      formData.append("endereco", conteudo.contato.endereco);
      formData.append("telefone", conteudo.contato.telefone);
      formData.append("email", conteudo.contato.email);
      formData.append("mapa", conteudo.contato.mapa);
    }

    await apiRequest("/site", { method: "POST", body: formData });
    exibirAviso("Alterações salvas com sucesso.");
    await carregarDados();
  } catch (err) {
    alert(err.message || "Falha ao salvar as alterações do site.");
  } finally {
    salvando.value = false;
  }
}

async function adicionarFaq() {
  try {
    const nova = await apiRequest("/faqs", {
      method: "POST",
      body: {
        pergunta: "Nova pergunta",
        pergunta_ingles: "",
        resposta: "Nova resposta",
        resposta_ingles: "",
        ordem: faqs.value.length + 1,
        status: 1,
      },
    });
    faqs.value.push({
      codigo: nova.id || nova.faq_codigo || Date.now(),
      pergunta: nova.pergunta || "Nova pergunta",
      pergunta_ingles: nova.pergunta_ingles || "",
      resposta: nova.resposta || "Nova resposta",
      resposta_ingles: nova.resposta_ingles || "",
      ordem: nova.ordem || faqs.value.length + 1,
      status: 1,
    });
    exibirAviso("Pergunta criada.");
  } catch (err) {
    alert(err.message || "Erro ao criar pergunta.");
  }
}

async function salvarFaq(faq) {
  try {
    await apiRequest(`/faqs/${faq.codigo}`, {
      method: "PUT",
      body: {
        pergunta: faq.pergunta,
        pergunta_ingles: faq.pergunta_ingles || "",
        resposta: faq.resposta,
        resposta_ingles: faq.resposta_ingles || "",
        ordem: faq.ordem || 0,
        status: faq.status,
      },
    });
    exibirAviso("FAQ atualizada.");
  } catch (err) {
    alert(err.message || "Erro ao atualizar FAQ.");
  }
}

async function excluirFaq(codigo) {
  if (!confirm("Deseja excluir esta pergunta?")) return;
  try {
    await apiRequest(`/faqs/${codigo}`, { method: "DELETE" });
    faqs.value = faqs.value.filter((f) => f.codigo !== codigo);
    exibirAviso("Pergunta excluída.");
  } catch (err) {
    alert(err.message || "Erro ao excluir pergunta.");
  }
}

async function alternarStatus(faq) {
  faq.status = faq.status === 1 ? 0 : 1;
  try {
    await apiRequest(`/faqs/${faq.codigo}`, { method: "PUT", body: faq });
    exibirAviso("Status atualizado.");
  } catch (err) {
    alert("Erro ao alterar o status.");
    faq.status = faq.status === 1 ? 0 : 1;
  }
}

async function moverFaq(index, direcao) {
  const faqAtual = faqs.value[index];
  const faqDestino = faqs.value[index + direcao];
  if (!faqDestino) return;

  const ordemTemp = faqAtual.ordem;
  faqAtual.ordem = faqDestino.ordem;
  faqDestino.ordem = ordemTemp;
  faqs.value.sort((a, b) => a.ordem - b.ordem);

  try {
    await apiRequest(`/faqs/${faqAtual.codigo}`, {
      method: "PUT",
      body: faqAtual,
    });
    await apiRequest(`/faqs/${faqDestino.codigo}`, {
      method: "PUT",
      body: faqDestino,
    });
  } catch (err) {
    alert("Erro ao guardar a nova ordem.");
    await carregarDados();
  }
}

onMounted(carregarDados);
</script>
