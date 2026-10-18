<template>
<div class="container section-title" data-aos="fade-up">
        <h2>{{ $t('faq.titulo') }}</h2>
      </div><!-- End Section Title -->

    <!-- Faq Section -->
    <section id="faq" class="faq section">

      <div class="container" data-aos="fade-up" data-aos-delay="100">

        <div class="row justify-content-center">
          <div class="col-lg-10">

            <div class="faq-wrapper">

<div class="faq-item" :class="{ 'faq-active': aberto === 0 }">
  <div class="faq-header" @click="alternar(0)">
                  <div class="faq-icon">
                    <i class="bi bi-question-circle"></i>
                  </div>
                  <h4>{{ $t('faq.pergunta1') }}</h4>
                  <div class="faq-toggle">
                    <i class="bi bi-plus"></i>
                    <i class="bi bi-dash"></i>
                  </div>
                </div>
                <div class="faq-content">
                  <div class="content-inner">
                    <p>{{ $t('faq.resposta1') }}</p>
                  </div>
                </div>
              </div><!-- End FAQ Item -->

<div class="faq-item" :class="{ 'faq-active': aberto === 1 }">
  <div class="faq-header" @click="alternar(1)">
                  <div class="faq-icon">
                    <i class="bi bi-question-circle"></i>
                  </div>
                  <h4>{{ $t('faq.pergunta2') }}</h4>
                  <div class="faq-toggle">
                    <i class="bi bi-plus"></i>
                    <i class="bi bi-dash"></i>
                  </div>
                </div>
                <div class="faq-content">
                  <div class="content-inner">
                    <p>{{ $t('faq.resposta2') }}</p>
                  </div>
                </div>
              </div><!-- End FAQ Item -->

<div class="faq-item" :class="{ 'faq-active': aberto === 2 }">
  <div class="faq-header" @click="alternar(2)">
                  <div class="faq-icon">
                    <i class="bi bi-question-circle"></i>
                  </div>
                  <h4>{{ $t('faq.pergunta3') }}</h4>
                  <div class="faq-toggle">
                    <i class="bi bi-plus"></i>
                    <i class="bi bi-dash"></i>
                  </div>
                </div>
                <div class="faq-content">
                  <div class="content-inner">
                    <p>{{ $t('faq.resposta3') }}</p>
                  </div>
                </div>
              </div><!-- End FAQ Item -->

 <div class="faq-item" :class="{ 'faq-active': aberto === 3 }">
  <div class="faq-header" @click="alternar(3)">
                  <div class="faq-icon">
                    <i class="bi bi-question-circle"></i>
                  </div>
                  <h4>{{ $t('faq.pergunta4') }}</h4>
                  <div class="faq-toggle">
                    <i class="bi bi-plus"></i>
                    <i class="bi bi-dash"></i>
                  </div>
                </div>
                <div class="faq-content">
                  <div class="content-inner">
                    <p>{{ $t('faq.resposta4') }}</p>
                  </div>
                </div>
              </div><!-- End FAQ Item -->

<div class="faq-item" :class="{ 'faq-active': aberto === 4 }">
  <div class="faq-header" @click="alternar(4)">
                  <div class="faq-icon">
                    <i class="bi bi-question-circle"></i>
                  </div>
                  <h4>{{ $t('faq.pergunta5') }}</h4>
                  <div class="faq-toggle">
                    <i class="bi bi-plus"></i>
                    <i class="bi bi-dash"></i>
                  </div>
                </div>
                <div class="faq-content">
                  <div class="content-inner">
                    <p>{{ $t('faq.resposta5') }}</p>
                  </div>
                </div>
              </div><!-- End FAQ Item -->

            </div>

          </div>
        </div>

      </div>

    </section><!-- /Faq Section -->

</template>

<script setup>
import { ref } from 'vue'

const aberto = ref(0) // índice do item aberto (0 = primeiro já começa aberto)

function alternar(i) {
  aberto.value = aberto.value === i ? null : i
}
</script>