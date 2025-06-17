<template>
  <div class="w-full max-w-3xl mx-auto rounded-xl shadow-md p-4 bg-light-bg text-light-text dark:bg-dark-bg dark:text-dark-text">
    <h2 class="text-xl font-semibold mb-4">Weekly Login Trend</h2>
    <div class="relative h-[300px]"> <!-- ✅ FIXED HEIGHT -->
      <canvas ref="chartRef" class="absolute inset-0" />
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted, watch } from 'vue'
import { useStatsStore } from '@/stores/stats'
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

// Register Chart.js components
Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend)

const chartRef = ref(null)
const statsStore = useStatsStore()
let chartInstance = null

// Helper: Format dates into weekday labels
const formatDateToLabel = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { weekday: 'short' }) // e.g., "Mon", "Tue"
}

const renderChart = () => {
  const trendData = statsStore.statsDailyLoginTrend
  if (!trendData.length || !chartRef.value) return

  const labels = trendData.map(item => formatDateToLabel(item.date))
  const dataPoints = trendData.map(item => item.count)

  // Destroy old chart if exists
  if (chartInstance) chartInstance.destroy()

  chartInstance = new Chart(chartRef.value, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Logins',
          data: dataPoints,
          borderColor: getComputedStyle(document.documentElement).getPropertyValue('--tw-color-primary') || '#249225',
          backgroundColor: 'rgba(36, 146, 37, 0.2)', // light green fill
          tension: 0.4,
          pointRadius: 5,
          pointBackgroundColor: '#F4C542', // secondary
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: getComputedStyle(document.documentElement).getPropertyValue('--tw-text-light-text') || '#1F2937',
          },
          grid: {
            color: getComputedStyle(document.documentElement).getPropertyValue('--tw-color-light-border') || '#8B4513',
          }
        },
        x: {
          ticks: {
            color: getComputedStyle(document.documentElement).getPropertyValue('--tw-text-light-subtext') || '#6B7280',
          },
          grid: {
            color: 'transparent',
          }
        },
      },
      plugins: {
        legend: {
          labels: {
            color: getComputedStyle(document.documentElement).getPropertyValue('--tw-text-light-text') || '#1F2937',
          }
        },
      },
    }
  })
}

onMounted(async () => {
  if (!statsStore.statsDailyLoginTrend.length) {
    await statsStore.fetchStats()
  }
  renderChart()
})

watch(() => statsStore.statsDailyLoginTrend, renderChart, { deep: true });
</script>


