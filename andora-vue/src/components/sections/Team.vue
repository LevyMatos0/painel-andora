<template>
    <!-- Team Section -->
    <section id="team" class="team section">

      <!-- Section Title -->
      <div class="container section-title" data-aos="fade-up">
        <span class="description-title">{{ $t('team.titulo') }}</span>
        <h2>{{ $t('team.subtitulo') }}</h2>
        <p>{{ $t('team.descricao') }}</p>
      </div><!-- End Section Title -->

      <div class="container" data-aos="fade-up" data-aos-delay="100">

        <div class="row g-4">

          <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="200">
            <div class="team-member">
              <div class="member-image">
                <img src="../../assets/img/person/clara.jpeg" class="img-fluid" alt="" loading="lazy">
                <div class="social-overlay">
                  <div class="social-icons">
                    <a href="https://www.linkedin.com/in/clara-dearo-gonzalez-87bab334a/"><i class="bi bi-linkedin"></i></a>
                    <a href="https://www.instagram.com/claradg__/"><i class="bi bi-instagram"></i></a>
                  </div>
                </div>
              </div>
              <div class="member-info">
                <h4>Clara Dearo Gonzalez</h4>
                <span>{{ $t('team.cargo1') }}</span>
                <p>{{ $t('team.bio1') }}</p>
              </div>
            </div><!-- End Team Member -->
          </div>

          <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="300">
            <div class="team-member">
              <div class="member-image">
                <img src="../../assets/img/person/levy.png" class="img-fluid" alt="" loading="lazy">
                <div class="social-overlay">
                  <div class="social-icons">
                    <a href="https://www.linkedin.com/in/levy-matos/"><i class="bi bi-linkedin"></i></a>
                    <a href="https://www.instagram.com/levy._matos/"><i class="bi bi-instagram"></i></a>
                  </div>
                </div>
              </div>
              <div class="member-info">
                <h4>Levy Santos Matos</h4>
                <span>{{ $t('team.cargo2') }}</span>
                <p>{{ $t('team.bio2') }}</p>
              </div>
            </div><!-- End Team Member -->
          </div>

          <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="400">
            <div class="team-member">
              <div class="member-image">
                <img src="../../assets/img/person/doarda.jpeg" class="img-fluid" alt="" loading="lazy">
                <div class="social-overlay">
                  <div class="social-icons">
                    <a href="www.linkedin.com/in/maria-eduarda-pires-zerbeto-5081b1352"><i class="bi bi-linkedin"></i></a>
                
                    <a href="https://www.instagram.com/mariaeduarda_zerbeto/"><i class="bi bi-instagram"></i></a>
                  </div>
                </div>
              </div>
              <div class="member-info">
                <h4>Maria Eduarda Pires Zerbeto</h4>
                <span>{{ $t('team.cargo3') }}</span>
                <p>{{ $t('team.bio3') }}</p>
              </div>
            </div>
      </div>
</div></div>
    </section><!-- /Team Section -->

</template>
