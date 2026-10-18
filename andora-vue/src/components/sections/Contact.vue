<template>
 <!-- Contact Section --><a href="#contact"></a>
    <section id="contact" class="contact section">
      <!-- Section Title -->
      <div class="container section-title" data-aos="fade-up">
        <span class="description-title">{{ $t('contact.titulo') }}</span>
        <h2>{{ $t('contact.subtitulo') }}</h2>
        <p>{{ $t('contact.descricao') }}</p>
      </div><!-- End Section Title -->

      <div class="container">
        <div class="contact-wrapper">
          <div class="contact-info-panel">
            <div class="contact-info-header">
              <h3>{{ $t('contact.infoTitulo') }}</h3>
            </div>

            <div class="contact-info-cards">
              <div class="info-card">
                <div class="icon-container">
                  <i class="bi bi-pin-map-fill"></i>
                </div>
                <div class="card-content">
                  <h4>{{ $t('contact.localizacao') }}</h4>
                  <p>{{ $t('contact.endereco') }}</p>
                </div>
              </div>

              <div class="info-card">
                <div class="icon-container">
                  <i class="bi bi-envelope-open"></i>
                </div>
                <div class="card-content">
                  <h4>{{ $t('contact.email') }}</h4>
                  <p>{{ $t('contact.emailEndereco') }}</p>
                </div>
              </div>

              <div class="info-card">
                <div class="icon-container">
                  <i class="bi bi-telephone-fill"></i>
                </div>
                <div class="card-content">
                  <h4>{{ $t('contact.telefone') }}</h4>
                  <p>{{ $t('contact.telefoneNumero') }}</p>
                </div>
              </div>

              <div class="info-card">
                <div class="icon-container">
                  <i class="bi bi-clock-history"></i>
                </div>
                <div class="card-content">
                  <h4>{{ $t('contact.horario') }}</h4>
                  <p>{{ $t('contact.horarioDetalhes') }}</p>
                </div>
              </div>
            </div>

            <div class="social-links-panel">
              <h5>{{ $t('contact.redesSociais') }}</h5>
              <div class="social-icons">
                <!--a href="#"><i class="bi bi-facebook"></i></a-->
                <a href="https://x.com/Andora_dev"><i class="bi bi-twitter-x"></i></a>
                <a href="https://www.instagram.com/andora.desenvolvimento/"><i class="bi bi-instagram"></i></a>
                <!--a href="#"><i class="bi bi-linkedin"></i></a-->
                <!--a href="#"><i class="bi bi-youtube"></i></a-->
              </div>
            </div>
          </div>

          <div class="contact-form-panel">
            <div class="map-container">
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3679.3441844291274!2d-47.35159662602098!3d-22.75260477936391!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94c89bde5bd26a4b%3A0x73aa44217bc4cce7!2sCol%C3%A9gio%20Politec!5e0!3m2!1sen!2sbr!4v1774652777448!5m2!1sen!2sbr" width="100%" height="100%" style="border:0;"  loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
            </div>

            <div class="form-container">
              <h3>{{ $t('contact.formTitulo') }}</h3>

              <form action="../../assets/forms/contact.php" method="post" class="php-email-form">
                <div class="form-floating mb-3">
                  <input type="text" class="form-control" id="nameInput" name="name" :placeholder="$t('contact.nomePlaceholder')">
                  <label for="nameInput">{{ $t('contact.nomeLabel') }}</label>
                </div>

                <div class="form-floating mb-3">
                  <input type="email" class="form-control" id="emailInput" name="email" :placeholder="$t('contact.emailPlaceholder')">
                  <label for="emailInput">{{ $t('contact.emailLabel') }}</label>
                </div>

                <div class="form-floating mb-3">
                  <input type="text" class="form-control" id="subjectInput" name="subject" :placeholder="$t('contact.assuntoPlaceholder')">
                  <label for="subjectInput">{{ $t('contact.assuntoLabel') }}</label>
                </div>

                <div class="form-floating mb-3">
                  <textarea class="form-control" id="messageInput" name="message" rows="5" :placeholder="$t('contact.mensagemPlaceholder')" style="height: 150px" ></textarea>
                  <label for="messageInput">{{ $t('contact.mensagemLabel') }}</label>
                </div>

                <div class="my-3">
                  <div class="loading">{{ $t('contact.carregando') }}</div>
                  <div class="error-message"></div>
                  <div class="sent-message">{{ $t('contact.mensagemEnviada') }}</div>
                </div>

                <div class="d-grid">
                  <button type="submit" class="btn-submit">{{ $t('contact.enviarBotao') }} <i class="bi bi-send-fill ms-2"></i></button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section><!-- /Contact Section -->
</template>
