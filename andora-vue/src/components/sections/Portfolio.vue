<template>
  <!-- Portfolio Section -->
    <section id="portfolio" class="portfolio section">

      <!-- Section Title -->
      <div class="container section-title" data-aos="fade-up">
        <span class="description-title">{{ $t('portfolio.titulo') }}</span>
        <h2>{{ $t('portfolio.subtitulo') }}</h2>
        <p>{{ $t('portfolio.descricao') }}</p>
      </div><!-- End Section Title -->

      <div class="container" data-aos="fade-up" data-aos-delay="100">

        <div class="isotope-layout" data-default-filter="*" data-layout="fitRows" data-sort="original-order">

          <div class="portfolio-filters-wrapper" data-aos="fade-up" data-aos-delay="100">
            <ul class="portfolio-filters isotope-filters">
              <li data-filter="*" class="filter-active">{{ $t('portfolio.filtroTodos') }}</li>
              <li data-filter=".filter-branding">Branding</li>
              <li data-filter=".filter-web">Web Design</li>
              <li data-filter=".filter-print">{{ $t('portfolio.filtroImpressao') }}</li>
              <li data-filter=".filter-motion">Mockup</li>
            </ul>
          </div>

          <div class="row gy-4 portfolio-grid isotope-container" data-aos="fade-up" data-aos-delay="200">

            <div class="col-lg-4 col-md-6 portfolio-item isotope-item filter-branding">
              <div class="portfolio-card">
                <div class="image-container">
                  <img src="../../assets/img/portfolio/portfolio-3.webp" class="img-fluid" alt="Brand Identity" loading="lazy">
                  <div class="overlay">
                    <div class="overlay-content">
                      <a href="../../assets/img/portfolio/portfolio-3.webp" class="glightbox zoom-link" title="Brand Identity Project">
                        <i class="bi bi-zoom-in"></i>
                      </a>
                      <a href="portfolio-details.html" class="details-link" title="View Project Details">
                        <i class="bi bi-arrow-right"></i>
                      </a>
                    </div>
                  </div>
                </div>
                <div class="content">
                  <h3>{{ $t('portfolio.item1Titulo') }}</h3>
                  <p>{{ $t('portfolio.item1Descricao') }}</p>
                </div>
              </div>
            </div><!-- End Portfolio Item -->
                        <div class="col-lg-4 col-md-6 portfolio-item isotope-item filter-web">
              <div class="portfolio-card">
                <div class="image-container">
                  <img src="../../assets/img/portfolio/portfolio-7.webp" class="img-fluid" alt="E-commerce Platform" loading="lazy">
                  <div class="overlay">
                    <div class="overlay-content">
                      <a href="../../assets/img/portfolio/portfolio-7.webp" class="glightbox zoom-link" title="E-commerce Platform">
                        <i class="bi bi-zoom-in"></i>
                      </a>
                      <a href="portfolio-details.html" class="details-link" title="View Project Details">
                        <i class="bi bi-arrow-right"></i>
                      </a>
                    </div>
                  </div>
                </div>
                <div class="content">
                  <h3>{{ $t('portfolio.item2Titulo') }}</h3>
                  <p>{{ $t('portfolio.item2Descricao') }}</p>
                </div>
              </div>
            </div><!-- End Portfolio Item -->

            <div class="col-lg-4 col-md-6 portfolio-item isotope-item filter-print">
              <div class="portfolio-card">
                <div class="image-container">
                  <img src="../../assets/img/portfolio/portfolio-portrait-5.webp" class="img-fluid" alt="Magazine Design" loading="lazy">
                  <div class="overlay">
                    <div class="overlay-content">
                      <a href="../../assets/img/portfolio/portfolio-portrait-5.webp" class="glightbox zoom-link" title="Magazine Design">
                        <i class="bi bi-zoom-in"></i>
                      </a>
                      <a href="portfolio-details.html" class="details-link" title="View Project Details">
                        <i class="bi bi-arrow-right"></i>
                      </a>
                    </div>
                  </div>
                </div>
                <div class="content">
                  <h3>{{ $t('portfolio.item3Titulo') }}</h3>
                  <p>{{ $t('portfolio.item3Descricao') }}</p>
                </div>
              </div>
            </div><!-- End Portfolio Item -->

            <div class="col-lg-4 col-md-6 portfolio-item isotope-item filter-motion">
              <div class="portfolio-card">
                <div class="image-container">
                  <img src="../../assets/img/portfolio/portfolio-8.webp" class="img-fluid" alt="Motion Graphics" loading="lazy">
                  <div class="overlay">
                    <div class="overlay-content">
                      <a href="../../assets/img/portfolio/portfolio-8.webp" class="glightbox zoom-link" title="Motion Graphics">
                        <i class="bi bi-zoom-in"></i>
                      </a>
                      <a href="portfolio-details.html" class="details-link" title="View Project Details">
                        <i class="bi bi-arrow-right"></i>
                      </a>
                    </div>
                  </div>
                </div>
                <div class="content">
                  <h3>{{ $t('portfolio.item4Titulo') }}</h3>
                  <p>{{ $t('portfolio.item4Descricao') }}</p>
                </div>
              </div>
            </div><!-- End Portfolio Item -->

            <div class="col-lg-4 col-md-6 portfolio-item isotope-item filter-branding">
              <div class="portfolio-card">
                <div class="image-container">
                  <img src="../../assets/img/portfolio/portfolio-9.webp" class="img-fluid" alt="Logo Collection" loading="lazy">
                  <div class="overlay">
                    <div class="overlay-content">
                      <a href="../../assets/img/portfolio/portfolio-9.webp" class="glightbox zoom-link" title="Logo Collection">
                        <i class="bi bi-zoom-in"></i>
                      </a>
                      <a href="portfolio-details.html" class="details-link" title="View Project Details">
                        <i class="bi bi-arrow-right"></i>
                      </a>
                    </div>
                  </div>
                </div>
                <div class="content">
                  <h3>{{ $t('portfolio.item5Titulo') }}</h3>
                  <p>{{ $t('portfolio.item5Descricao') }}</p>
                </div>
              </div>
            </div><!-- End Portfolio Item -->

            <div class="col-lg-4 col-md-6 portfolio-item isotope-item filter-web">
              <div class="portfolio-card">
                <div class="image-container">
                  <img src="../../assets/img/portfolio/portfolio-portrait-8.webp" class="img-fluid" alt="Mobile App Design" loading="lazy">
                  <div class="overlay">
                    <div class="overlay-content">
                      <a href="../../assets/img/portfolio/portfolio-portrait-8.webp" class="glightbox zoom-link" title="Mobile App Design">
                        <i class="bi bi-zoom-in"></i>
                      </a>
                      <a href="portfolio-details.html" class="details-link" title="View Project Details">
                        <i class="bi bi-arrow-right"></i>
                      </a>
                    </div>
                  </div>
                </div>
                <div class="content">
                  <h3>{{ $t('portfolio.item6Titulo') }}</h3>
                  <p>{{ $t('portfolio.item6Descricao') }}</p>
                </div>
              </div>
            </div><!-- End Portfolio Item -->

            <div class="col-lg-4 col-md-6 portfolio-item isotope-item filter-print">
              <div class="portfolio-card">
                <div class="image-container">
                  <img src="../../assets/img/portfolio/portfolio-10.webp" class="img-fluid" alt="Packaging Design" loading="lazy">
                  <div class="overlay">
                    <div class="overlay-content">
                      <a href="../../assets/img/portfolio/portfolio-10.webp" class="glightbox zoom-link" title="Packaging Design">
                        <i class="bi bi-zoom-in"></i>
                      </a>
                      <a href="portfolio-details.html" class="details-link" title="View Project Details">
                        <i class="bi bi-arrow-right"></i>
                      </a>
                    </div>
                  </div>
                </div>
                <div class="content">
                  <h3>{{ $t('portfolio.item7Titulo') }}</h3>
                  <p>{{ $t('portfolio.item7Descricao') }}</p>
                </div>
              </div>
            </div><!-- End Portfolio Item -->

            <div class="col-lg-4 col-md-6 portfolio-item isotope-item filter-motion">
              <div class="portfolio-card">
                <div class="image-container">
                  <img src="../../assets/img/portfolio/portfolio-11.webp" class="img-fluid" alt="Brand Animation" loading="lazy">
                  <div class="overlay">
                    <div class="overlay-content">
                      <a href="../../assets/img/portfolio/portfolio-11.webp" class="glightbox zoom-link" title="Brand Animation">
                        <i class="bi bi-zoom-in"></i>
                      </a>
                      <a href="portfolio-details.html" class="details-link" title="View Project Details">
                        <i class="bi bi-arrow-right"></i>
                      </a>
                    </div>
                  </div>
                </div>
                <div class="content">
                  <h3>{{ $t('portfolio.item8Titulo') }}</h3>
                  <p>{{ $t('portfolio.item8Descricao') }}</p>
                </div>
              </div>
            </div><!-- End Portfolio Item -->

          </div><!-- End Portfolio Grid -->

        </div>

      </div>

    </section><!-- /Portfolio Section -->
</template>
