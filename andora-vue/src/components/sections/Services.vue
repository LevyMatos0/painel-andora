<template>
    <!-- Services Section -->
    <section id="services" class="services section">

      <!-- Section Title -->
      <div class="container section-title" data-aos="fade-up">
        <span class="description-title">{{ $t('services.titulo') }}</span>
        <h2>{{ $t('services.subtitulo') }}</h2>
        <p>{{ $t('services.descricao') }}</p>
      </div><!-- End Section Title -->

      <div class="container" data-aos="fade-up" data-aos-delay="100">

        <div class="services-container">
          <div class="row g-4">
            <div class="col-lg-6" data-aos="fade-up" data-aos-delay="100">
              <div class="service-item">
                <div class="service-icon">
                  <i class="bi bi-code-slash"></i>
                </div>
                <div class="service-content">
                  <h3 class="service-title">{{ $t('services.servico1Titulo') }}</h3>
                  <p class="service-text">{{ $t('services.servico1Descricao') }}</p>
                  <a href="#" class="service-link">
                    {{ $t('services.servico1Link') }}
                    <i class="bi bi-arrow-right"></i>
                  </a>
                </div>
              </div>
            </div>

            <div class="col-lg-6" data-aos="fade-up" data-aos-delay="200">
              <div class="service-item">
                <div class="service-icon">
                  <i class="bi bi-bar-chart"></i>
                </div>
                <div class="service-content">
                  <h3 class="service-title">{{ $t('services.servico2Titulo') }}</h3>
                  <p class="service-text">{{ $t('services.servico2Descricao') }}</p>
                  <a href="#" class="service-link">
                    {{ $t('services.servico2Link') }}
                    <i class="bi bi-arrow-right"></i>
                  </a>
                </div>
              </div>
            </div>

            <div class="col-lg-6" data-aos="fade-up" data-aos-delay="300">
              <div class="service-item">
              </div>
            </div>

            <div class="col-lg-6" data-aos="fade-up" data-aos-delay="400">
              <div class="service-item">
              </div>
            </div>
          </div>
        </div>

        <div class="cta-wrapper mt-5 text-center" data-aos="fade-up" data-aos-delay="100">
          <div class="row">
            <div class="col-lg-8 offset-lg-2">
              <div class="cta-box">
                <div class="row align-items-center">
                  <div class="col-lg-4">
                    <div class="cta-image" data-aos="zoom-in" data-aos-delay="200">
                      <img src="../../assets/img/icone/ANDORA-COMPLETO.png" alt="Services" class="img-fluid rounded-circle">
                    </div>
                  </div>
                  <div class="col-lg-8">
                    <div class="cta-content text-lg-start" data-aos="fade-left" data-aos-delay="300">
                      <h3>{{ $t('services.ctaTitulo') }}</h3>
                      <p>{{ $t('services.ctaDescricao') }}</p>
                      <a href="#contact" class="primary-btn">{{ $t('services.ctaBotao') }}</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </section><!-- /Services Section -->
</template>
