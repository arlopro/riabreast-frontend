<template>
  <div v-if="showCongrats" class="popup-congrats">
    <div v-if="!showNoMore" class="popup-content">
      <h3>Complimenti!</h3>
      <p>
        Puoi passare al periodo successivo<br />
        <strong>Continua a seguire con attenzione le prossime sessioni</strong>
      </p>
      <button @click="closePopup">OK, ho capito!</button>
    </div>

    <div v-if="showNoMore" class="popup-content">
      <h3>Complimenti!</h3>
      <p>
        Hai completato il periodo di riabilitazione<br />
        <strong>Da ora in poi potrai seguire i nostri esercizi giusto all'occorrenza</strong>
      </p>
      <button @click="closePopup">OK, ho capito!</button>
    </div>
  </div>

  <div class="logged-container-dark home-container">
    <div>
      <h2 class="title">Periodo {{ periodOrder }}</h2>
      <h4>{{ periodTitle }}</h4>
      <p class="subtitle">
        <a @click.prevent="goToNextPeriod">Avanza a periodo successivo →</a>
        <a v-if="periodOrder > 0" @click.prevent="goToPreviousPeriod"
          >← Torna al periodo precedente</a
        >
      </p>
    </div>

    <div>
      <button class="play-button" @click="startSession">
        <svg
          width="200"
          height="200"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M80 60C80 58 82.2 57 83.9 58.1L145.9 96.1C147.6 97.2 147.6 99.8 145.9 100.9L83.9 138.9C82.2 140 80 139 80 137V60Z"
            fill="#B89ACB"
          />
        </svg>
      </button>
      <h3>Inizia sessione</h3>
    </div>

    <div class="session-count" @click="goToStats">
      <i
        :class="
          todaySessions === 0
            ? 'bx bx-sad'
            : todaySessions === 1
              ? 'bx bx-confused'
              : 'bx bx-wink-smile'
        "
      ></i>
      <p>{{ todaySessions }}<small>/3</small> Session{{ todaySessions === 1 ? 'e' : 'i' }}</p>
      <label>eseguit{{ todaySessions === 1 ? 'a' : 'e' }} oggi</label>
      <p class="stats-button">Guarda statistiche</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/assets/scss/home' as *;
</style>

<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const periodTitle = ref('')
const periodOrder = ref('')
const todaySessions = ref(0)
const periodId = ref(null)
const showCongrats = ref(false)
const showNoMore = ref(false)

const fetchHomeData = async () => {
  try {
    const response = await axios.get('/home')

    periodTitle.value = response.data.period.title
    periodOrder.value = response.data.period.order
    todaySessions.value = response.data.today_sessions
    periodId.value = response.data.period.id
  } catch (error) {
    console.log('Errore nel recupero dati home')
  }
}

const startSession = () => {
  router.push({ name: 'videoDetail', params: { id: periodId.value, type: 'period' } })
}

const goToNextPeriod = () => {
  router.push('/questionario') // sempre obbligatorio farlo prima di avanzare
}

const goToPreviousPeriod = async () => {
  try {
    await axios.post('/period/previous')
    await fetchHomeData()
  } catch (error) {
    console.log(error)
    alert('Errore nel tornare al periodo precedente: ' + error.response.data.error)
  }
}

const goToStats = () => {
  router.push('/stats')
}

onMounted(async () => {
  try {
    fetchHomeData()

    // Controlla se ha appena superato un periodo
    if (localStorage.getItem('justAdvanced') === 'true') {
      if (localStorage.getItem('justFinished') === 'true') {
        localStorage.removeItem('justFinished')
        showNoMore.value = true
      }
      showCongrats.value = true
      localStorage.removeItem('justAdvanced')
    }
  } catch (error) {
    alert('Errore nel recupero dati home')
  }
})

const closePopup = async () => {
  showCongrats.value = false
}
</script>
