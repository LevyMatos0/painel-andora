<template>
  <div class="modulo-container">
    <div class="modulo-header">
      <div>
        <h2>Perguntas Frequentes (FAQ)</h2>
        <p>Faça a gestão das dúvidas comuns apresentadas no site</p>
      </div>
      <button class="btn-principal" @click="abrirModal()">+ Nova Pergunta</button>
    </div>

    <div v-if="carregando" class="alerta">A carregar perguntas...</div>
    <div v-else-if="erroGeral" class="alerta erro">{{ erroGeral }}</div>

    <table v-else class="tabela-dados">
      <thead>
        <tr>
          <th>Ordem</th>
          <th>Pergunta</th>
          <th>Resposta</th>
          <th>Status</th>
          <th class="acoes">Ações</th>
        </tr>
      </thead>
      <tbody>
        <!-- Adicionado o 'index' para conseguirmos saber qual FAQ estamos a mover -->
        <tr v-for="(faq, index) in faqs" :key="faq.id">
          
          <!-- CONTROLO DE ORDEM DIRETO NA TABELA -->
          <td>
            <div class="controles-ordem">
              <button class="btn-seta" @click="moverFaq(index, -1)" :disabled="index === 0" title="Subir">▲</button>
              <span class="ordem-numero">{{ faq.ordem }}</span>
              <button class="btn-seta" @click="moverFaq(index, 1)" :disabled="index === faqs.length - 1" title="Descer">▼</button>
            </div>
          </td>
          
          <td><strong>{{ faq.pergunta }}</strong></td>
          <td class="col-desc">{{ faq.resposta }}</td>
          
          <!-- CONTROLO DE STATUS DIRETO NA TABELA -->
          <td>
            <button 
              @click="alternarStatus(faq)" 
              :class="['badge-btn', faq.status ? 'ativo' : 'inativo']"
              title="Clique para alterar a visibilidade"
            >
              {{ faq.status ? 'Ativo' : 'Oculto' }}
            </button>
          </td>
          
          <td class="acoes">
            <button class="btn-acao btn-editar" @click="abrirModal(faq)">Editar</button>
            <button class="btn-acao btn-excluir" @click="excluir(faq.id)">Excluir</button>
          </td>
        </tr>
        <tr v-if="faqs.length === 0">
          <td colspan="5" class="vazio">Nenhuma pergunta cadastrada.</td>
        </tr>
      </tbody>
    </table>

    <!-- Modal Form (Mantido para criar novas e editar textos) -->
    <div v-if="modalAberto" class="modal-backdrop">
      <div class="modal-card">
        <h3>{{ form.id ? 'Editar FAQ' : 'Nova FAQ' }}</h3>
        
        <form @submit.prevent="salvar">
          <div class="campo">
            <label>Pergunta *</label>
            <input v-model="form.pergunta" required maxlength="255" placeholder="Ex: Qual é o prazo de entrega?" />
          </div>

          <div class="campo">
            <label>Resposta *</label>
            <textarea v-model="form.resposta" rows="4" required placeholder="Escreva a resposta detalhada..."></textarea>
          </div>

          <div class="campo-duplo">
            <div class="campo">
              <label>Ordem de exibição</label>
              <input v-model.number="form.ordem" type="number" min="0" />
            </div>
            <div class="campo checkbox" style="justify-content: flex-end; padding-bottom: 10px;">
              <label>
                <input v-model="form.status" type="checkbox" /> Visível no Site
              </label>
            </div>
          </div>

          <div class="modal-acoes">
            <button type="button" class="btn-cancelar" @click="fecharModal">Cancelar</button>
            <button type="submit" class="btn-principal" :disabled="salvando">
              {{ salvando ? 'A guardar...' : 'Guardar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { apiRequest } from '../services/api';

const faqs = ref([]);
const carregando = ref(true);
const salvando = ref(false);
const erroGeral = ref(null);
const modalAberto = ref(false);

const formPadrao = {
  id: null,
  pergunta: '',
  resposta: '',
  ordem: 0,
  status: true
};

const form = ref({ ...formPadrao });

async function carregar() {
  carregando.value = true;
  erroGeral.value = null;
  try {
    faqs.value = await apiRequest('/faqs');
  } catch (err) {
    erroGeral.value = err.message || 'Falha ao buscar dados das FAQs.';
  } finally {
    carregando.value = false;
  }
}

function abrirModal(item = null) {
  if (item) {
    form.value = { ...item, status: Boolean(item.status) };
  } else {
    form.value = { ...formPadrao, ordem: faqs.value.length + 1 };
  }
  modalAberto.value = true;
}

function fecharModal() {
  modalAberto.value = false;
  form.value = { ...formPadrao };
}

async function salvar() {
  salvando.value = true;
  try {
    if (form.value.id) {
      await apiRequest(`/faqs/${form.value.id}`, {
        method: 'PUT',
        body: form.value
      });
    } else {
      await apiRequest('/faqs', {
        method: 'POST',
        body: form.value
      });
    }
    fecharModal();
    await carregar();
  } catch (err) {
    alert(err.message || 'Erro ao gravar os dados.');
  } finally {
    salvando.value = false;
  }
}

async function excluir(id) {
  if (!confirm('Deseja excluir esta pergunta permanentemente?')) return;
  try {
    await apiRequest(`/faqs/${id}`, { method: 'DELETE' });
    faqs.value = faqs.value.filter(f => f.id !== id);
  } catch (err) {
    alert(err.message || 'Erro ao excluir a FAQ.');
  }
}

// NOVA FUNÇÃO: Alternar status diretamente na tabela
async function alternarStatus(faq) {
  const novoStatus = !faq.status;
  try {
    await apiRequest(`/faqs/${faq.id}`, {
      method: 'PUT',
      body: { ...faq, status: novoStatus }
    });
    faq.status = novoStatus; // Atualiza a cor do botão imediatamente
  } catch (err) {
    alert('Erro ao alterar o status.');
  }
}

// NOVA FUNÇÃO: Mover FAQ para cima ou para baixo
async function moverFaq(index, direcao) {
  const faqAtual = faqs.value[index];
  const faqDestino = faqs.value[index + direcao];

  if (!faqDestino) return;

  // 1. Troca a numeração da ordem entre as duas FAQs
  const ordemTemporaria = faqAtual.ordem;
  faqAtual.ordem = faqDestino.ordem;
  faqDestino.ordem = ordemTemporaria;

  // 2. Reordena a lista visualmente de imediato
  faqs.value.sort((a, b) => a.ordem - b.ordem);

  // 3. Guarda as duas alterações na base de dados
  try {
    await apiRequest(`/faqs/${faqAtual.id}`, { method: 'PUT', body: faqAtual });
    await apiRequest(`/faqs/${faqDestino.id}`, { method: 'PUT', body: faqDestino });
  } catch (err) {
    alert('Erro ao guardar a nova ordem.');
    await carregar(); // Se falhar, recarrega para repor a ordem real da base de dados
  }
}

onMounted(carregar);
</script>

<style scoped>
.col-desc { max-width: 350px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.checkbox label { display: flex; align-items: center; gap: 8px; cursor: pointer; }

/* ESTILOS NOVOS PARA OS CONTROLOS DA TABELA */
.controles-ordem {
  display: flex;
  align-items: center;
  gap: 8px;
}
.btn-seta {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  color: #061930;
  padding: 4px;
  transition: transform 0.2s;
}
.btn-seta:hover:not(:disabled) {
  transform: scale(1.2);
}
.btn-seta:disabled {
  color: #ccc;
  cursor: not-allowed;
}
.ordem-numero {
  font-weight: bold;
  min-width: 20px;
  text-align: center;
}

/* Transforma o Badge num botão clicável */
.badge-btn {
  border: none;
  cursor: pointer;
  padding: 5px 12px;
  border-radius: 12px;
  font-weight: bold;
  transition: opacity 0.2s, transform 0.1s;
}
.badge-btn:hover {
  opacity: 0.85;
  transform: scale(1.05);
}
.badge-btn.ativo { background-color: #86895D; color: white; }
.badge-btn.inativo { background-color: #3D240C; color: white; }
</style>