<template>
  <footer id="footer" class="footer light-background">

    <div class="container">
      <div class="row gy-3">

        <div class="col-lg-3 col-md-6 d-flex">
          <i class="bi bi-geo-alt icon"></i>
          <div class="address">
            <h4>{{ $t('footer.endereco') }}</h4>
            <p>{{ $t('footer.enderecoRua') }}</p>
            <p>{{ $t('footer.enderecoCidade') }}</p>
            <p></p>
          </div>
        </div>

        <div class="col-lg-3 col-md-6 d-flex">
          <i class="bi bi-telephone icon"></i>
          <div>
            <h4>{{ $t('footer.contato') }}</h4>
            <p>
              <strong>{{ $t('footer.telefoneLabel') }}</strong> <span>(19) 97815-2812</span><br>
              <strong>{{ $t('footer.emailLabel') }}</strong> <span>contato@andoradev.com</span><br>
            </p>
          </div>
        </div>

        <div class="col-lg-3 col-md-6 d-flex">
          <i class="bi bi-clock icon"></i>
          <div>
            <h4>{{ $t('footer.horario') }}</h4>
            <p>
              <strong>{{ $t('footer.segSex') }}</strong>
              <span> 8:30 - 17:00</span><br>
              <strong>{{ $t('footer.sabado') }}</strong>
              <span>{{ $t('footer.fechado') }}</span>
            </p>
          </div>
        </div>

        <div class="col-lg-3 col-md-6 d-flex">
    <i class="bi bi-link icon"></i>

    <div>
        <h4>{{ $t('footer.followUs') }}</h4>

        <div class="social-links d-flex">
            <a href="https://x.com/Andora_dev" class="twitter">
                <i class="bi bi-twitter-x"></i>
            </a>

            <a href="https://www.instagram.com/andora.desenvolvimento/" class="instagram">
                <i class="bi bi-instagram"></i>
            </a>
        </div>
    </div>
</div>

      </div>
    </div>

    <div class="container copyright text-center mt-4">
      <p>
        © <span>Copyright</span>
        <strong class="px-1 sitename">Andora</strong>
        <span>{{ $t('footer.copyright') }}</span>
      </p>

    
    
    </div>

  </footer>
</template>
