<template>
<section id="hero" class="hero section">
      <div class="hero-background">
        <div class="hero-overlay"></div>
      </div>

      <div class="container" data-aos="fade-up" data-aos-delay="100">
        <div class="row justify-content-center text-center">
          <div class="col-lg-10">
            <div class="hero-content" data-aos="fade-up" data-aos-delay="200">
              <h1>{{ $t('hero.titulo') }}</h1>
              <p>{{ $t('hero.descricao') }}</p>

              <div class="hero-btns" data-aos="fade-up" data-aos-delay="300">
                <a href="#about" class="btn btn-primary">{{ $t('hero.saibaMais') }}</a>
              </div>
            </div>
          </div>
        </div>

        <div class="row justify-content-center">
          <div class="col-lg-8">
            <div class="hero-image-container" data-aos="zoom-in" data-aos-delay="400">
              <div class="hero-image">
                <img src="../../assets/img/icone/ANDORA-COMPLETO.png" alt="Business Innovation" class="img-fluid">
                <div class="image-decoration"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

</template>
