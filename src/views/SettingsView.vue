<template>
  <div class="logged-container-dark settings-container">
    <div class="header">
      <h2 class="title">Impostazioni</h2>
    </div>

    <div class="content">
      <div class="button-group">
        <a class="btn btn-default" href="https://www.auslromagna.it/privacy/privacy-policy" target="_blank" rel="noopener noreferrer">
          Informativa sulla Privacy
        </a>
        <button class="btn btn-secondary" @click="logout">Effettua log out</button>
      </div>

      <div class="loghi">
        <h4>Un progetto di</h4>
        <img src="@/assets/img/loghi/logo_auslromagna.png">
        <h4>si ringrazia</h4>
        <div class="sponsor">
          <img src="@/assets/img/loghi/logo_comunesogliano.png">
          <img src="@/assets/img/loghi/logo_soglianoambiente.png">
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {useRouter} from "vue-router";

const router = useRouter()

const logout = async () => {
  try {
    localStorage.removeItem('token')
    router.push('/welcome')
  } catch (err) {
    alert('Errore durante il logout')
  }
}
</script>

<style lang="scss" scoped>
@use "@/assets/scss/settings" as *;
</style>
