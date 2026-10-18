<script setup>
import { computed, ref, watch } from "vue";
import { uploadUrl } from "../services/api";
const props = defineProps({
  user: Object,
  version: { type: [String, Number], default: "" },
  large: Boolean,
});
const failed = ref(false);
const src = computed(() => uploadUrl(props.user?.foto, props.version));
const initials = computed(() =>
  (props.user?.nome || "?")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((n) => Array.from(n)[0])
    .join("")
    .toUpperCase(),
);
watch(src, () => (failed.value = false));
</script>
<template>
  <span
    class="user-avatar"
    :class="{ large }"
    :aria-label="user?.nome || 'Perfil'"
    ><img
      v-if="src && !failed"
      :src="src"
      :alt="user?.nome || 'Foto de perfil'"
      @error="failed = true"
    /><span v-else>{{ initials }}</span></span
  >
</template>
<style scoped>
.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  background: var(--navy-700);
  color: white;
  font-weight: 800;
}
.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.user-avatar.large {
  width: 86px;
  height: 86px;
  border-radius: 22px;
  font-size: 1.5rem;
}
</style>
