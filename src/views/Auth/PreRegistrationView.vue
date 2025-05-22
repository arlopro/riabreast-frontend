<template>
  <div class="auth-container pre-registration-container">
    <h1>Registrazione</h1>
    <h3>Prima di accedere all'app, guarda questo breve video introduttivo</h3>
    <iframe
      ref="videoFrame"
      src="https://www.youtube-nocookie.com/embed/-P0wEpG4L_Q?rel=0"
      frameborder="0"
      allowfullscreen
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    ></iframe>

    <button @click="goToRegistration" class="btn btn-primary">Continua con la registrazione</button>
    <router-link to="/" class="btn btn-secondary btn-back">Torna alla schermata principale</router-link>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

const goToRegistration = () => {
  router.push({ name: 'register' })
}
</script>

<style lang="scss" scoped>
@use "@/assets/scss/auth";
</style>
