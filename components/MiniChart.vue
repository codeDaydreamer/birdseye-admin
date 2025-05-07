<template>
    <section class="w-full pt-6">
      <div class="shadow-md bg-light-accent dark:bg-dark-accent p-6 rounded-lg">
        <!-- Chart Header -->
        <div class="text-center mb-4">
          <h2 class="text-xl font-semibold text-light-text dark:text-dark-text">
            Daily Logged-In Users (This Week)
          </h2>
          <p class="text-sm text-light-subtext dark:text-dark-subtext">
            A summary of how many users logged into the system each day.
          </p>
        </div>
  
        <!-- Chart Canvas -->
        <div class="p-2 rounded-lg">
          <canvas ref="chartCanvas" class="w-full h-52"></canvas>
        </div>
      </div>
    </section>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  LineController
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  LineController
)

export default {
  setup() {
    const chartCanvas = ref(null)

    onMounted(() => {
      const ctx = chartCanvas.value.getContext('2d')

      // Detect current theme via Tailwind class
      const isDark = document.documentElement.classList.contains('dark')
      const tickColor = isDark ? '#d1d5db' : '#374151' // light-subtext vs dark-subtext Tailwind color hex

      // Create gradient fill
      const gradient = ctx.createLinearGradient(0, 0, 0, 200)
      gradient.addColorStop(0, 'rgba(37, 99, 235, 0.4)') // Blue-600 @ 40%
      gradient.addColorStop(1, 'rgba(37, 99, 235, 0)')   // Fully transparent

      const chartData = {
        labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        datasets: [
          {
            label: 'Logged-In Users',
            data: [42, 55, 48, 60, 52, 70, 66],
            borderColor: '#2563eb',
            backgroundColor: gradient,
            pointBackgroundColor: '#2563eb',
            tension: 0,
            fill: true,
          },
        ],
      }

      const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: true },
        },
        scales: {
          x: {
            ticks: {
              color: tickColor,
            },
            grid: {
              display: false,
            },
          },
          y: {
            ticks: {
              color: tickColor,
            },
            grid: {
              color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
            },
          },
        },
      }

      new ChartJS(ctx, {
        type: 'line',
        data: chartData,
        options: chartOptions,
      })
    })

    return {
      chartCanvas,
    }
  }
}

  </script>
  