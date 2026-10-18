<script setup>
defineProps({ visivel: Boolean, texto: String });
</script>
<template>
  <div class="notice" :class="{ show: visivel }">{{ texto }}</div>
</template>
