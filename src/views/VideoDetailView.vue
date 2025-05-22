<template>
  <div class="logged-container-dark video-detail-container">
    <div>
      <div class="header">
        <h2 class="title">Periodo {{ video.period }}</h2>
        <p class="subtitle" v-if="!isExtraMode">
          <a @click.prevent="goToNextPeriod">Avanza a periodo successivo →</a>
        </p>
      </div>

      <div class="video-wrapper">
        <div class="video-player" ref="videoContainer" :class="{ playing: showVideo }">
          <!-- Thumbnail + overlay + play -->
          <template v-if="!showVideo">
            <img
              :src="`https://img.youtube.com/vi/${video.video_youtube_id}/hqdefault.jpg`"
              alt="Anteprima video"
              class="video-thumbnail"
            />
            <div class="overlay" @click="handleThumbnailClick">
              <i class="play-icon bx bx-play-circle"></i>
            </div>
          </template>

          <!-- Video visibile dopo il click -->
          <iframe
            v-else
            ref="videoFrame"
            :src="youtubeUrl"
            frameborder="0"
            allowfullscreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          ></iframe>
        </div>
      </div>

      <div class="video-info">
        <h3 class="video-title">{{ video.title }}</h3>
        <p class="video-description">{{ video.description }}</p>
      </div>
    </div>

    <!-- Blocchi a mostrare solo se NON è extra -->
    <div class="content" v-if="!isExtraMode">
      <div class="progress-section">
        <h4>Registra i tuoi progressi!</h4>
        <button class="progress-btn" @click="endSession">
          <i class="bx bx-check-circle"></i>
          <span>Ho terminato la mia sessione di riabilitazione</span>
        </button>
      </div>

      <div v-if="showPopup" class="session-popup">
        <div class="popup-content">
          <h3>Prima di iniziare…</h3>
          <p>
            Una volta terminato il video, ricordati di cliccare su:<br />
            <strong>“Ho terminato la mia sessione di riabilitazione”</strong>
          </p>
          <button @click="startSession">OK, ho capito!</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue'
import axios from 'axios'
import { useRouter, useRoute } from 'vue-router'

const video = ref({
  period: '',
  title: '',
  description: '',
  video_youtube_id: '',
})

const showPopup = ref(false)
const showVideo = ref(false)

const videoContainer = ref(null)
const youtubeUrl = computed(() => {
  return `https://www.youtube-nocookie.com/embed/${video.value.video_youtube_id}?rel=0&autoplay=1`
})

const startSession = async () => {
  try {
    await axios.post('/session/start')
    showPopup.value = false
    showVideo.value = true
    openFullscreen()
  } catch (err) {
    alert('Errore nell’avvio della sessione')
  }
}

const endSession = async () => {
  try {
    await axios.post('/session/end')
    router.push('/questionario')
  } catch (err) {
    alert('Errore nella chiusura della sessione')
  }
}

const goToNextPeriod = () => {
  router.push('/questionario')
}

const router = useRouter()
const route = useRoute()

const isExtraMode = computed(() => route.params.type === 'extra')
const videoId = computed(() => route.params.id)

onMounted(async () => {
  try {
    const url = isExtraMode.value ? `/extra/${videoId.value}` : `/period`

    const response = await axios.get(url)
    video.value = response.data
  } catch (error) {
    console.error('Errore nel caricamento del video:', error)
  }
})

const handleThumbnailClick = async () => {
  if (isExtraMode.value) {
    // video extra → niente popup
    showVideo.value = true
    await nextTick()
    openFullscreen()
  } else {
    showPopup.value = true
  }
}

const openFullscreen = () => {
  if (videoContainer.value?.requestFullscreen) {
    videoContainer.value.requestFullscreen()
  } else if (videoContainer.value?.webkitRequestFullscreen) {
    videoContainer.value.webkitRequestFullscreen()
  } else if (videoContainer.value?.mozRequestFullScreen) {
    videoContainer.value.mozRequestFullScreen()
  } else if (videoContainer.value?.msRequestFullscreen) {
    videoContainer.value.msRequestFullscreen()
  }
}
</script>

<style lang="scss" scoped>
@use '@/assets/scss/video-detail' as *;
</style>
