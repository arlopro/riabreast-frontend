<template>
  <div class="logged-container-dark stats-container">
    <div class="header">
      <h2 class="title">Statistiche sessioni</h2>
      <p class="subtitle">Andamento settimanale</p>
    </div>

    <div class="week-navigation">
      <button @click="navigateWeek(-1)" class="nav-button">
        <span class="arrow">←</span>
      </button>
      <span class="week-label">{{ weekLabel }}</span>
      <button @click="navigateWeek(1)" class="nav-button">
        <span class="arrow">→</span>
      </button>
    </div>

    <div class="content stats-content">
      <canvas ref="chartCanvas"></canvas>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import axios from 'axios'
import { Chart } from 'chart.js/auto'
const chartCanvas = ref(null)
let chartInstance = null

// Week navigation
const currentWeekOffset = ref(0)
const weekStart = ref(null)
const weekEnd = ref(null)

// Format date as d/m/Y
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
}

// Get week start and end dates
const getWeekDates = (offset = 0) => {
  const now = new Date()
  const dayOfWeek = now.getDay() || 7 // Convert Sunday (0) to 7

  // Calculate the date of Monday of the current week
  const monday = new Date(now)
  monday.setDate(now.getDate() - dayOfWeek + 1 + (offset * 7))
  monday.setHours(0, 0, 0, 0)

  // Calculate the date of Sunday of the current week
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  sunday.setHours(23, 59, 59, 999)

  return { start: monday, end: sunday }
}

// Generate array of dates for the week
const generateWeekDays = (start) => {
  const days = []
  const currentDate = new Date(start)

  for (let i = 0; i < 7; i++) {
    days.push(new Date(currentDate))
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return days
}

// Week label for display
const weekLabel = computed(() => {
  if (!weekStart.value || !weekEnd.value) return ''
  return `${formatDate(weekStart.value)} - ${formatDate(weekEnd.value)}`
})

// Navigate between weeks
const navigateWeek = (direction) => {
  currentWeekOffset.value += direction
  updateChart()
}

// Filter data for the current week
const filterDataForWeek = (data, start, end) => {
  return data.filter(item => {
    const itemDate = new Date(item.date)
    return itemDate >= start && itemDate <= end
  })
}

// Prepare data for the chart with all days of the week
const prepareWeekData = (data, weekDays) => {
  // Create a map of dates to counts
  const dateMap = new Map()
  data.forEach(item => {
    dateMap.set(item.date.split('T')[0], item.count)
  })

  // Create arrays for labels and data
  const labels = []
  const counts = []

  // Add all days of the week
  weekDays.forEach(day => {
    const dateStr = day.toISOString().split('T')[0]
    labels.push(formatDate(dateStr))
    counts.push(dateMap.get(dateStr) || 0)
  })

  return { labels, counts }
}

// Custom plugin to display data values on points
const dataLabelsPlugin = {
  id: 'dataLabels',
  afterDatasetsDraw(chart) {
    const { ctx, data } = chart;

    ctx.save();

    data.datasets[0].data.forEach((datapoint, index) => {
      // Only draw label if datapoint is not zero
      if (datapoint === 0) return;

      const { x, y } = chart.getDatasetMeta(0).data[index].getCenterPoint();

      // Text configuration
      ctx.font = 'bold 12px Arial';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';

      // Draw text above the point
      ctx.fillText(datapoint, x, y - 10);
    });

    ctx.restore();
  }
};

const updateChart = async () => {
  try {
    const { start, end } = getWeekDates(currentWeekOffset.value)
    weekStart.value = start
    weekEnd.value = end

    const weekDays = generateWeekDays(start)

    const response = await axios.get('/sessions/daily')
    const filteredData = filterDataForWeek(response.data, start, end)
    const { labels, counts } = prepareWeekData(filteredData, weekDays)

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
            data: counts,
            borderColor: '#FFFFFF',
            backgroundColor: 'rgba(53,37,69,0.5)',
            tension: 0.4,
            fill: true,
          },
        ],
      },
      plugins: [dataLabelsPlugin],
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Date',
              color: '#FFFFFF',
              font: {
                size: 14
              },
              padding: {top: 10, bottom: 0}
            },
            ticks: { color: '#FFFFFF' },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Numero di sessioni',
              color: '#FFFFFF',
              font: {
                size: 14
              },
              padding: {top: 0, right: 10}
            },
            ticks: {
              color: '#FFFFFF',
              stepSize: 1,
              precision: 0
            },
            beginAtZero: true,
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            }
          },
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            enabled: true,
            backgroundColor: 'rgba(125, 109, 146, 0.8)',
            titleColor: '#FFFFFF',
            bodyColor: '#FFFFFF',
            displayColors: false
          }
        },
        // Display the session count on each point
        elements: {
          point: {
            radius: 5,
            hoverRadius: 7,
          }
        },
      },
    })
  } catch (err) {
    console.log(err)
    alert('Errore nel recupero statistiche')
  }
}

onMounted(() => {
  updateChart()
})
</script>

<style lang="scss" scoped>
@use '@/assets/scss/stats' as *;

.week-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 50%;
  padding: 15px 0 30px 0;

  .nav-button {
    background-color: rgba(125, 109, 146, 0.7);
    border: none;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    color: white;
    font-size: 18px;
    margin: 0 15px;

    &:hover {
      background-color: rgba(125, 109, 146, 1);
    }

    .arrow {
      line-height: 1;
    }
  }

  .week-label {
    font-size: 14px;
    color: white;
    min-width: 150px;
    text-align: center;
  }
}

.stats-content {
  background-color: rgba(125, 109, 146, 0.6)!important;
  border-radius: 8px!important;
  padding: 15px!important;
}
</style>
