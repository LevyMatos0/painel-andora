<template>
  <nav class="bg-dark text-white p-3">
    <header id="header" class="header d-flex align-items-center sticky-top">
    <div class="container position-relative d-flex align-items-center justify-content-between">

      <a href="index.html" class="logo d-flex align-items-center me-auto me-xl-0">
        
        <!-- Uncomment the line below if you also wish to use an image logo -->
        <!-- <img src="assets/img/logo.webp" alt=""> -->
        <h1 class="sitename"> <img src='../../assets/img/icone/ANDORA-COMPLETO-ST-NEGATIVO.png'></h1>
      </a>

      <nav id="navmenu" class="navmenu">
        <ul>
          <li><a href="#hero" class="active">{{ $t('nav.inicio') }}</a></li>
          <li><a href="#about">{{ $t('nav.sobre') }}</a></li>
          <li><a href="#services">{{ $t('nav.servicos') }}</a></li>
          <li><a href="#portfolio">{{ $t('nav.projetos') }}</a></li>
          <li><a href="#team">{{ $t('nav.quemSomos') }}</a></li>
          <li><a href="#contact">{{ $t('nav.contato') }}</a></li>
        </ul>
        <i class="mobile-nav-toggle d-xl-none bi bi-list"></i>
      </nav>

      <button
        class="btn btn-outline-light btn-sm ms-3 d-flex align-items-center gap-1"
        :title="$t('langButton.tooltip')"
        @click="toggleLocale"
      >
        <i class="bi bi-globe2"></i>
        <span>{{ $t('langButton.label') }}</span>
      </button>

      <div class="header-social-links">
        <a href="https://www.instagram.com/andora.desenvolvimento/" class="instagram"><i class="bi bi-instagram"></i></a>
         <a href="https://x.com/Andora_dev" class="twitter"><i class="bi bi-twitter-x" style="background-image: url(https://assets.streamlinehq.com/image/private/w_300,h_300,ar_1/f_auto/v1/icons/logos/linktree-hrggdeqdzll06zjl9h6j.png/linktree-bafynmeua3noot52xbu71.png?_a=DATAiZAAZAA0);"></i></a>
         <!-- lembrar de colocar o linktree onde era linkedin - se for o caso mais mídias sociais -->

      </div>

    </div>
  </header>
  </nav>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

function toggleLocale() {
  locale.value = locale.value === 'pt' ? 'en' : 'pt'
}
</script>