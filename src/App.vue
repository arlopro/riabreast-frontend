<script setup>
import { useRoute } from 'vue-router'
import TabBar from '@/components/TabBar.vue'

const route = useRoute()
</script>

<template>
  <div class="app-container">
    <div class="content">
        <router-view />
    </div>
    <!-- Mostra la Tab Bar solo se NON siamo in una pagina di autenticazione -->
    <TabBar v-if="!['welcome', 'login', 'register', 'registerSuccess', 'preRegistration'].includes(route.name)" />
  </div>
</template>

<style scoped>
.app-container {
  width: 100%;
  max-width: 768px;
  height: 100vh;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}

.content {
  flex: 1; /* 🔹 Occupa tutto lo spazio disponibile sopra la Tab Bar */
  display: flex;
}
</style>
