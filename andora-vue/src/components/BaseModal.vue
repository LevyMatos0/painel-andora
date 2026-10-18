<script setup>
import { onMounted, onUnmounted } from "vue";
const props = defineProps({
  aberto: Boolean,
  titulo: String,
  descricao: String,
  largura: { type: String, default: "" },
});
const emit = defineEmits(["fechar"]);
function teclado(event) {
  if (event.key === "Escape" && props.aberto) emit("fechar");
}
onMounted(() => document.addEventListener("keydown", teclado));
onUnmounted(() => document.removeEventListener("keydown", teclado));
</script>

<template>
  <Teleport to="body">
    <div
      v-if="aberto"
      class="modal-layer open"
      role="dialog"
      aria-modal="true"
      @click.self="$emit('fechar')"
    >
      <section class="modal-card" :class="largura">
        <header class="modal-head">
          <div>
            <h2>{{ titulo }}</h2>
            <p v-if="descricao">{{ descricao }}</p>
          </div>
          <button
            class="icon-btn modal-close"
            aria-label="Fechar"
            @click="$emit('fechar')"
          >
            ×
          </button>
        </header>
        <slot />
      </section>
    </div>
  </Teleport>
</template>
