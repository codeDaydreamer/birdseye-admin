<template>
    <div class="bg-light-accent/20 dark:bg-dark-accent/40 p-6 rounded-xl shadow-lg">
      <h3 class="text-xl font-semibold text-light-text dark:text-dark-text text-center mb-4">
        Revenue Growth / Churn
      </h3>
      <line-chart :data="chartData" :options="chartOptions" />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { Line } from 'vue-chartjs'
  import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale } from 'chart.js'
  
  ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale)
  
  const chartData = ref({
    labels: ['January', 'February', 'March', 'April', 'May'],
    datasets: [
      {
        label: 'Revenue Growth',
        data: [5000, 7000, 8000, 9000, 10000],
        borderColor: '#00c8ff',
        fill: false
      },
      {
        label: 'Churn Rate',
        data: [2, 3, 1, 4, 2],
        borderColor: '#ff3d00',
        fill: false
      }
    ]
  })
  
  const chartOptions = ref({
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      }
    }
  })
  </script>
  