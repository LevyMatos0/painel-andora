<script setup>
import { computed, reactive, ref, onMounted, onUnmounted } from "vue";
import UserAvatar from "../components/UserAvatar.vue";
import { apiRequest } from "../services/api";
import { loadProfile, setProfile } from "../services/profile";

const usuario = reactive({
  nome: "",
  cargo: "",
  cargo_ingles: "",
  email: "",
  telefone: "",
  bio: "",
  bio_ingles: "",
  foto: null,
});
const senhas = reactive({ atual: "", nova: "", confirmar: "" });
const carregando = ref(true),
  pronto = ref(false),
  salvando = ref(false),
  mudandoSenha = ref(false);
const erro = ref(""),
  sucesso = ref(""),
  erroSenha = ref(""),
  sucessoSenha = ref("");
const arquivoFoto = ref(null),
  preview = ref(""),
  removerFoto = ref(false),
  fotoInput = ref(null);
const avatar = computed(() => ({
  ...usuario,
  foto: removerFoto.value ? null : usuario.foto,
}));
function limparPreview() {
  if (preview.value) URL.revokeObjectURL(preview.value);
  preview.value = "";
}
function carregarFoto(event) {
  const file = event.target.files[0];
  if (!file) return;
  if (
    !["image/png", "image/jpeg", "image/webp"].includes(file.type) ||
    file.size > 5 * 1024 * 1024
  ) {
    erro.value = "Escolha uma imagem PNG, JPEG ou WebP de até 5 MB.";
    event.target.value = "";
    return;
  }
  limparPreview();
  arquivoFoto.value = file;
  preview.value = URL.createObjectURL(file);
  removerFoto.value = false;
  erro.value = "";
}
function remover() {
  limparPreview();
  arquivoFoto.value = null;
  removerFoto.value = true;
  if (fotoInput.value) fotoInput.value.value = "";
}
async function carregarDados() {
  carregando.value = true;
  pronto.value = false;
  erro.value = "";
  try {
    Object.assign(usuario, await loadProfile());
    pronto.value = true;
  } catch (error) {
    erro.value = error.message;
  } finally {
    carregando.value = false;
  }
}
async function salvar() {
  if (!pronto.value || salvando.value) return;
  salvando.value = true;
  erro.value = "";
  sucesso.value = "";
  try {
    const body = new FormData();
    for (const field of [
      "nome",
      "cargo",
      "cargo_ingles",
      "email",
      "telefone",
      "bio",
      "bio_ingles",
    ])
      body.append(field, usuario[field] || "");
    if (arquivoFoto.value) body.append("foto", arquivoFoto.value);
    else if (removerFoto.value) body.append("remover_foto", "1");
    const data = await apiRequest("/perfil", { method: "PUT", body });
    Object.assign(usuario, setProfile(data));
    limparPreview();
    arquivoFoto.value = null;
    removerFoto.value = false;
    if (fotoInput.value) fotoInput.value.value = "";
    window.dispatchEvent(new Event("perfilAtualizado"));
    sucesso.value = "Perfil salvo no banco de dados.";
  } catch (error) {
    erro.value = error.message;
  } finally {
    salvando.value = false;
  }
}
async function atualizarSenha() {
  erroSenha.value = "";
  sucessoSenha.value = "";
  if (senhas.nova !== senhas.confirmar) {
    erroSenha.value = "A confirmação deve ser igual à nova senha.";
    return;
  }
  mudandoSenha.value = true;
  try {
    await apiRequest("/perfil/senha", {
      method: "PUT",
      body: { senhaAtual: senhas.atual, novaSenha: senhas.nova },
    });
    Object.assign(senhas, { atual: "", nova: "", confirmar: "" });
    sucessoSenha.value = "Senha atualizada com sucesso.";
  } catch (error) {
    erroSenha.value = error.message;
  } finally {
    mudandoSenha.value = false;
  }
}
onMounted(carregarDados);
onUnmounted(limparPreview);
</script>
<template>
  <div class="page-content profile-page">
    <section class="page-head">
      <div>
        <h2>Meu perfil</h2>
        <p>Edite os dados vinculados ao seu acesso.</p>
      </div>
    </section>
    <p v-if="erro" class="status-alert" role="alert">
      {{ erro }}
      <button
        v-if="!pronto && !carregando"
        class="btn btn-secondary"
        @click="carregarDados"
      >
        Tentar novamente
      </button>
    </p>
    <p v-if="sucesso" class="status-success" role="status">{{ sucesso }}</p>
    <p v-if="carregando" class="state-empty" role="status">
      Carregando seu perfil…
    </p>
    <template v-if="pronto">
      <form class="card card-pad" @submit.prevent="salvar">
        <fieldset :disabled="salvando" class="profile-fields">
          <div class="profile-photo-editor">
            <img
              v-if="preview"
              :src="preview"
              alt="Prévia da nova foto"
              class="profile-photo-preview"
            />
            <UserAvatar v-else :user="avatar" large />
            <div>
              <h3>Foto de perfil</h3>
              <div class="profile-photo-actions">
                <label class="btn btn-secondary" for="foto">Trocar foto</label>
                <input
                  id="foto"
                  ref="fotoInput"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  @change="carregarFoto"
                />
                <button class="btn btn-danger" type="button" @click="remover">
                  Remover foto
                </button>
              </div>
              <p class="form-help">
                PNG, JPEG ou WebP, até 5 MB. Salve o perfil para aplicar.
              </p>
            </div>
          </div>
          <div class="form-grid" style="margin-top: 22px">
            <div class="field">
              <label for="nome">Nome</label
              ><input
                id="nome"
                v-model.trim="usuario.nome"
                class="input"
                required
                autocomplete="name"
              />
            </div>
            <div class="field">
              <label for="email">E-mail</label
              ><input
                id="email"
                v-model.trim="usuario.email"
                class="input"
                type="email"
                required
                autocomplete="email"
              />
            </div>
            <div class="field">
              <label for="cargo">Cargo (PT)</label
              ><input
                id="cargo"
                v-model.trim="usuario.cargo"
                class="input"
                required
              />
            </div>
            <div class="field">
              <label for="cargo-en">Cargo (EN)</label
              ><input
                id="cargo-en"
                v-model="usuario.cargo_ingles"
                class="input"
                lang="en"
              />
            </div>
            <div class="field full">
              <label for="telefone">Telefone</label
              ><input
                id="telefone"
                v-model="usuario.telefone"
                class="input"
                type="tel"
                autocomplete="tel"
              />
            </div>
            <div class="field">
              <label for="bio">Apresentação (PT)</label
              ><textarea
                id="bio"
                v-model="usuario.bio"
                class="textarea"
              ></textarea>
            </div>
            <div class="field">
              <label for="bio-en">Apresentação (EN)</label
              ><textarea
                id="bio-en"
                v-model="usuario.bio_ingles"
                class="textarea"
                lang="en"
              ></textarea>
            </div>
          </div>
          <div class="form-actions">
            <button class="btn btn-primary" type="submit">
              {{ salvando ? "Salvando…" : "Salvar perfil" }}
            </button>
          </div>
        </fieldset>
      </form>
      <form class="card card-pad" @submit.prevent="atualizarSenha">
        <div class="section-title">
          <div>
            <h3>Segurança</h3>
            <span>Atualize sua senha de acesso</span>
          </div>
        </div>
        <p v-if="erroSenha" class="status-alert" role="alert">
          {{ erroSenha }}
        </p>
        <p v-if="sucessoSenha" class="status-success" role="status">
          {{ sucessoSenha }}
        </p>
        <fieldset :disabled="mudandoSenha" class="profile-fields">
          <div class="form-grid">
            <div class="field">
              <label for="senha-atual">Senha atual</label
              ><input
                id="senha-atual"
                v-model="senhas.atual"
                class="input"
                type="password"
                required
                autocomplete="current-password"
              />
            </div>
            <div class="field">
              <label for="senha-nova">Nova senha</label
              ><input
                id="senha-nova"
                v-model="senhas.nova"
                class="input"
                type="password"
                required
                autocomplete="new-password"
              />
            </div>
            <div class="field">
              <label for="senha-confirmar">Confirmar nova senha</label
              ><input
                id="senha-confirmar"
                v-model="senhas.confirmar"
                class="input"
                type="password"
                required
                autocomplete="new-password"
              />
            </div>
          </div>
          <div class="form-actions">
            <button class="btn btn-secondary" type="submit">
              {{ mudandoSenha ? "Atualizando…" : "Atualizar senha" }}
            </button>
          </div>
        </fieldset>
      </form>
    </template>
  </div>
</template>
<style scoped>
.profile-fields {
  border: 0;
  padding: 0;
  margin: 0;
  min-width: 0;
}
#foto {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
}
.profile-photo-actions:focus-within {
  outline: 2px solid var(--brand-yellow);
  outline-offset: 4px;
}
</style>
