<template>
  <div class="logged-container-dark extra-container">
    <div class="header">
      <h2 class="title">Contenuti Extra</h2>
      <p class="subtitle">Da utilizzare al bisogno</p>
    </div>

    <div class="content">
      <div class="video-list">
        <div
          class="video-item"
          v-for="video in videos"
          :key="video.id"
          @click="goToVideo(video.id)"
        >
          <div class="thumbnail">
            <img
              :src="`https://img.youtube.com/vi/${video.video_youtube_id}/hqdefault.jpg`"
              alt="Anteprima video"
              class="video-thumbnail"
            />
            <div class="overlay">
              <i class="play-icon bx bx-play-circle"></i>
            </div>
          </div>
          <div class="video-info">
            <h3 class="video-title">{{ video.title }}</h3>
            <p class="video-description">{{ video.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import axios from "axios";

const router = useRouter();

const videos = ref([]);

onMounted(async () => {
  const response = await axios.get('/extras');
  videos.value = response.data;
});

// Naviga al Video Detail quando un video viene cliccato
const goToVideo = (id) => {
  router.push({name: "videoDetail", params: {id: id, type: 'extra'}});
};
</script>

<style lang="scss" scoped>
@use "@/assets/scss/extra" as *;
</style>
