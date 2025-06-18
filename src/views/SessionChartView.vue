<template>
  <div class="logged-container-dark stats-container">
    <div class="header">
      <h2 class="title">Statistiche sessioni</h2>
      <p class="subtitle">Andamento giornaliero</p>
    </div>

    <div class="content">
      <canvas ref="chartCanvas"></canvas>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import { Chart } from 'chart.js/auto'
const chartCanvas = ref(null)
let chartInstance = null

const fetchStats = async () => {
  try {
    const response = await axios.get('/sessions/daily')
    const labels = response.data.map((item) => item.date)
    const data = response.data.map((item) => item.count)

    if (chartInstance) {
      chartInstance.destroy()
    }

    chartInstance = new Chart(chartCanvas.value, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Sessioni per giorno',
            data,
            borderColor: '#7d6d92',
            backgroundColor: 'rgba(125,109,146,0.2)',
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            ticks: { color: '#2e2e36' },
          },
          y: {
            ticks: { color: '#2e2e36' },
            beginAtZero: true,
            precision: 0,
          },
        },
        plugins: {
          legend: { display: false },
        },
      },
    })
  } catch (err) {
    console.log(err)
    alert('Errore nel recupero statistiche')
  }
}

onMounted(fetchStats)
</script>

<style lang="scss" scoped>
@use '@/assets/scss/stats' as *;
</style>
