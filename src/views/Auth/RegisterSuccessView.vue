<template>
  <div class="auth-container success-container">
    <h1>Successo!</h1>
    <p class="message">
      La registrazione è stata completata con successo!
    </p>
    <h3>Segnati il pin qua sopra o fai uno screenshot con il tuo cellulare.
      Utilizzalo per accedere all'app cliccando il pulsante "Accedi" di seguito.</h3>

    <div class="pin-box">
      <span class="pin">{{ pin }}</span>
    </div>

    <button @click="goToLogin" class="btn btn-primary">Accedi all’app</button>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const pin = route.query.pin || '------' // 🔹 Mostra un placeholder se il PIN non esiste

const goToLogin = () => {
  router.push({ name: 'login' }) // 🔹 Reindirizza alla schermata di accesso
}
</script>

<style lang="scss" scoped>
@use "@/assets/scss/auth";
</style>
