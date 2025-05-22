<template>
  <div class="tab-bar">
    <router-link
      v-for="(tab, index) in tabs"
      :key="index"
      class="tab-item"
      :class="{ active: isActive(tab.path) }"
      :to="tab.path"
    >
      <i :class="tab.icon"></i>
      <span v-if="isActive(tab.path)">{{ tab.label }}</span>
    </router-link>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

// Definiamo i diversi stati della Tab Bar
const tabStates = [
  [
    { path: "/home", icon: "bx bx-video", label: "Riabilitazione" },
    { path: "/extra", icon: "bx bx-plus", label: "Video Extra" },
    { path: "/faq", icon: "bx bx-message-square-dots", label: "FAQ" },
    { path: "/settings", icon: "bx bx-cog", label: "Impostazioni" },
  ],
];

const tabs = ref(tabStates[0]); // Seleziona lo stato iniziale

// Funzione per verificare se il tab è attivo
const isActive = (path) => route.path === path;
</script>

<style lang="scss" scoped>
@use "@/assets/scss/index" as *;

.tab-bar {
  position: fixed;
  bottom: 0;
  width: 100%;
  max-width: 768px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 0 12px;
  /* fallback per vecchie iOS */
  padding-bottom: constant(safe-area-inset-bottom);
  /* vero padding per PWA/standalone */
  padding-bottom: env(safe-area-inset-bottom);

  background: white;
  box-sizing: border-box;
  height: 80px;
  border-top: 3px solid $primary-color-light;
}

.tab-item {
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  background: none;
  border: none;
  color: $primary-color-light;
  font-size: 15px;
  padding: 8px 16px;
  cursor: pointer;
  border-radius: 16px;
  transition: background 0.3s ease-in-out;

  i {
    font-size: 40px;

    @media only screen and (max-width: 400px) {
      font-size: 30px;
    }
  }

  &.active {
    background: $primary-color-light;
    color: white;

    i {
      font-size: 40px;
      margin-right: 8px;

      @media only screen and (max-width: 400px) {
        font-size: 30px;
      }
    }
  }
}

</style>
