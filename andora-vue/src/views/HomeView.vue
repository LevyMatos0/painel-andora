<template>
  <Navbar />

  <Hero />
  <About />
  <Services />
<!-- <Portfolio /> -->
  <Team />
  <FAQ />
  <Contact />

  <Footer />
</template>

<script setup>
import Navbar from '../components/layout/Navbar.vue'
import Footer from '../components/layout/Footer.vue'

import Hero from '../components/sections/Hero.vue'
import About from '../components/sections/About.vue'
import Services from '../components/sections/Services.vue'
import Portfolio from '../components/sections/Portfolio.vue'
import Team from '../components/sections/Team.vue'
import FAQ from '../components/sections/FAQ.vue'
import Contact from '../components/sections/Contact.vue'
</script>