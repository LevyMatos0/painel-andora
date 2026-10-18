<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import logo from "../assets/img/andora-logo.png";
import { apiRequest, saveSession } from "../services/api";
import { setProfile } from "../services/profile";

const router = useRouter();
const login = reactive({
  email: "",
  senha: "",
  manter: true,
});

const carregando = ref(false);
const erro = ref(null);

async function entrar() {
  if (!login.email || !login.senha) return;

  carregando.value = true;
  erro.value = null;

  try {
    const resposta = await apiRequest("/auth/login", {
      method: "POST",
      body: {
        email: login.email.trim(),
        senha: login.senha,
      },
    });

    // Guarda o token e as informações da sessão
    saveSession(resposta.token, resposta.utilizador, login.manter);
    setProfile(resposta.utilizador);

    router.push("/dashboard");
  } catch (err) {
    erro.value =
      err.message || "Credenciais inválidas. Verifique os dados introduzidos.";
  } finally {
    carregando.value = false;
  }
}
</script>

<template>
  <main class="login-page">
    <section class="login-art">

      <div class="login-message">
        <p class="eyebrow" style="color: var(--brand-yellow)">
          Gestão de conteúdo
        </p>
        <h1>Seu site, sob controle.</h1>
        <p>
          Atualize textos, imagens, serviços e informações da Andora em um
          painel organizado e preparado.
        </p>
      </div>
      <small>© 2026 Andora Desenvolvimento de Sistemas</small>
    </section>

    <section class="login-panel">
      <form class="login-card" @submit.prevent="entrar">
        <div class="brand" style="padding-left: 0; color: var(--navy-950)">
          <span class="brand-mark">A</span>
          <span class="brand-copy">
            <strong>ANDORA</strong>
            <span>Painel administrativo</span>
          </span>
        </div>

        <h2>Bem-vindo de volta</h2>
        <p>Entre com suas credenciais para continuar.</p>

        <div
          v-if="erro"
          class="alert alert-danger"
          style="
            margin-bottom: 16px;
            padding: 10px 12px;
            border-radius: 6px;
            font-size: 0.85rem;
            color: #b91c1c;
            background-color: #fef2f2;
            border: 1px solid #fecaca;
          "
        >
          {{ erro }}
        </div>

        <div class="field">
          <label for="email">E-mail</label>
          <input
            id="email"
            v-model.trim="login.email"
            class="input"
            type="email"
            required
            :disabled="carregando"
          />
        </div>

        <div class="field" style="margin-top: 16px">
          <label for="senha">Senha</label>
          <input
            id="senha"
            v-model="login.senha"
            class="input"
            type="password"
            required
            :disabled="carregando"
          />
        </div>

        <label style="display: block; margin: 14px 0 24px; font-size: 0.8rem">
          <input
            v-model="login.manter"
            type="checkbox"
            :disabled="carregando"
          />
          Manter conectado
        </label>

        <button
          class="btn btn-primary"
          style="width: 100%; padding: 13px"
          :disabled="carregando"
        >
          {{ carregando ? "A autenticar..." : "Entrar no painel" }}
        </button>
      </form>
    </section>
  </main>
</template>
