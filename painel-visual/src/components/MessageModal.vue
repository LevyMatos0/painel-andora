<script setup>
import BaseModal from "./BaseModal.vue";
defineProps({ aberto: Boolean, mensagem: Object });
defineEmits(["fechar", "excluir"]);
</script>

<template>
  <BaseModal
    :aberto="aberto"
    :titulo="mensagem?.assunto || 'Mensagem'"
    largura="mail-card"
    @fechar="$emit('fechar')"
  >
    <template v-if="mensagem">
      <div class="mail-toolbar">
        <button class="btn btn-ghost" @click="$emit('fechar')">← Voltar</button>
        <div class="row-actions">
          <a class="btn btn-secondary" :href="`mailto:${mensagem.email}`"
            >Responder</a
          ><button
            class="btn btn-danger"
            @click="$emit('excluir', mensagem.codigo)"
          >
            Excluir
          </button>
        </div>
      </div>
      <div class="modal-body">
        <div class="mail-sender">
          <span class="avatar">{{ mensagem.iniciais }}</span>
          <div>
            <strong>{{ mensagem.nome }}</strong
            ><span>{{ mensagem.email }}</span>
          </div>
          <time class="mail-date" style="margin-left: auto">{{
            mensagem.data
          }}</time>
        </div>
        <div class="mail-content">
          <p v-for="(paragrafo, indice) in mensagem.conteudo" :key="indice">
            {{ paragrafo }}
          </p>
        </div>
      </div>
    </template>
  </BaseModal>
</template>
