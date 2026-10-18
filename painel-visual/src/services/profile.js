import { ref } from "vue";
import { apiRequest, saveCachedProfile } from "./api";
export const profile = ref(null);
export const profileError = ref("");
let pending;
export function setProfile(data) {
  profile.value = {
    id: data.id ?? data.usr_codigo,
    nome: data.nome ?? data.usr_nome ?? "",
    email: data.email ?? data.usr_email ?? "",
    cargo: data.cargo ?? data.usr_cargo ?? "",
    cargo_ingles: data.cargo_ingles ?? data.usr_cargo_ingles ?? "",
    telefone: data.telefone ?? data.usr_telefone ?? "",
    bio: data.bio ?? data.usr_bio ?? "",
    bio_ingles: data.bio_ingles ?? data.usr_bio_ingles ?? "",
    foto: data.foto ?? data.usr_foto ?? null,
  };
  profileError.value = "";
  saveCachedProfile(profile.value);
  return profile.value;
}
export function loadProfile() {
  if (pending) return pending;
  pending = apiRequest("/perfil")
    .then(setProfile)
    .catch((error) => {
      profileError.value = error.message;
      throw error;
    })
    .finally(() => {
      pending = null;
    });
  return pending;
}
