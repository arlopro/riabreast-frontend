<template>
  <div class="welcome-container auth-container">
    <img class="logo" src="/img/logo.png">
    <p>Esegui l’accesso con il tuo PIN o registrati per riceverne uno</p>

    <router-link to="/login" class="btn btn-primary"><i class="bx bx-lock-alt"></i>Esegui accesso</router-link>

    <p>oppure</p>

    <router-link to="/pre-registration" class="btn btn-secondary"><i class="bx bx-plus"></i>Registrati</router-link>
  </div>
</template>

<style lang="scss" scoped>
@use "@/assets/scss/auth";
</style>
<script setup>
</script>
