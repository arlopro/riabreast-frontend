<template>
  <div class="auth-container pin-container">
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-spinner"></div>
      <p>Accesso in corso…</p>
    </div>

    <h1>Accedi</h1>
    <p>Inserisci il codice che ti è stato dato in fase di registrazione</p>

    <div class="pin-box">
      <span v-for="(digit, index) in formattedPin" :key="index" class="pin-digit">
        {{ digit || '•' }}
      </span>
    </div>

    <div class="keypad">
      <button v-for="num in numbers" :key="num" @click="addDigit(num)" class="key">
        {{ num }}
      </button>
      <button @click="removeDigit" class="key action">
        <i class="bx bx-chevron-left"></i>
      </button>
      <button @click="addDigit(0)" class="key">
        0
      </button>
      <button @click="clearPin" class="key action">
        ⌫
      </button>
    </div>

    <router-link to="/" class="btn btn-secondary btn-back">Torna alla schermata principale</router-link>
  </div>
</template>

<script setup>
import {ref, computed} from 'vue' // ✅ Aggiunto computed
import {useRouter} from 'vue-router'
import axios from 'axios'

const pin = ref('')
const router = useRouter()
const isLoading = ref(false)

// Numeri per il tastierino
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]

// Funzione per aggiungere cifre
const addDigit = (num) => {
  if (pin.value.length < 6) {
    pin.value += num
    if (pin.value.length === 6) {
      login()
    }
  }
}

// Funzione per rimuovere l'ultima cifra
const removeDigit = () => {
  pin.value = pin.value.slice(0, -1)
}

// Funzione per svuotare il PIN
const clearPin = () => {
  pin.value = ''
}

// Funzione per il login
const login = async () => {
  isLoading.value = true

  try {
    const response = await axios.post('/auth/login', { pin: pin.value })

    if (response.data.token) {
      localStorage.setItem('token', response.data.token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`

      setTimeout(() => {
        isLoading.value = false
        router.push('/home')
      }, 100)
    } else {
      isLoading.value = false
      alert('Errore: nessun token ricevuto')
    }
  } catch (error) {
    isLoading.value = false
    alert('PIN non valido!')
    clearPin()
  }
}


// 🔹 Usa `computed` per formattare il PIN
const formattedPin = computed(() => pin.value.split('').concat(Array(6 - pin.value.length).fill('')))
</script>


<style lang="scss" scoped>
@use "@/assets/scss/auth";
</style>
