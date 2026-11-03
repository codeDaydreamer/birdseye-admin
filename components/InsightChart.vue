<template>
  <div class="relative" :style="{ height: height || '240px' }">
    <canvas ref="canvas" :aria-label="label" role="img"></canvas>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { Chart, BarController, LineController, BarElement, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, Filler } from 'chart.js'

Chart.register(BarController, LineController, BarElement, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, Filler)

// type: bar | line; datasets: [{ label, data, color, fill? }]
const props = defineProps({
  type: { type: String, default: 'bar' },
  labels: { type: Array, required: true },
  datasets: { type: Array, required: true },
  height: String,
  label: String,
  money: Boolean,
  stacked: Boolean,
})

const canvas = ref(null)
let chart

const dark = () => document.documentElement.classList.contains('dark')

function render() {
  chart?.destroy()
  if (!canvas.value) return
  const grid = dark() ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'
  const text = dark() ? '#9CA3AF' : '#6B7280'
  chart = new Chart(canvas.value, {
    type: props.type,
    data: {
      labels: props.labels,
      datasets: props.datasets.map((d) => ({
        label: d.label,
        data: d.data,
        backgroundColor: props.type === 'line' ? d.color + '22' : d.color,
        borderColor: d.color,
        borderWidth: props.type === 'line' ? 2 : 0,
        borderRadius: 4,
        fill: !!d.fill,
        tension: 0.3,
        pointRadius: 0,
        pointHoverRadius: 4,
      })),
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: props.datasets.length > 1, labels: { color: text, boxWidth: 12 } },
        tooltip: {
          callbacks: props.money ? { label: (c) => `${c.dataset.label}: KES ${Math.round(c.parsed.y).toLocaleString('en-KE')}` } : {},
        },
      },
      scales: {
        x: { stacked: props.stacked, grid: { display: false }, ticks: { color: text, maxRotation: 0, autoSkip: true, maxTicksLimit: 8 } },
        y: { stacked: props.stacked, beginAtZero: true, grid: { color: grid }, ticks: { color: text, precision: 0 } },
      },
    },
  })
}

// Redraw when the theme changes so axis and grid colours match
let observer
onMounted(() => {
  render()
  let wasDark = dark()
  observer = new MutationObserver(() => {
    if (dark() !== wasDark) {
      wasDark = dark()
      render()
    }
  })
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
})
watch(() => [props.labels, props.datasets], render, { deep: true })
onBeforeUnmount(() => {
  observer?.disconnect()
  chart?.destroy()
})
</script>
