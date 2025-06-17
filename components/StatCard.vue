<template>
  <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <div
      v-for="stat in statsStore.stats"
      :key="stat.title"
      class="card rounded-2xl shadow-md transition-all duration-300 bg-accent/20 hover:scale-[1.015]"
    >
      <div class="card-body flex items-center space-x-4 px-5 py-4 bg-light-accent dark:bg-dark-accent">
        <!-- Icon Section with increased size -->
        <div
          class="w-16 h-16 flex items-center justify-center rounded-full bg-base-100 text-3xl dark:bg-dark-accent"
        >
          <i :class="[stat.icon, stat.iconColor]"></i>
        </div>

        <!-- Text Section -->
        <div class="flex flex-col">
          <span
            class="text-sm font-medium text-light-subtext dark:text-dark-subtext tracking-wide uppercase"
          >
            {{ stat.title }}
          </span>
          <span
            class="text-2xl font-extrabold text-light-text dark:text-dark-text leading-tight"
          >
            {{ stat.value }}
          </span>
          <!-- Display change only if it exists -->
          <span
            v-if="stat.change"
            :class="[
              'text-sm mt-1',
              stat.trend === 'up'
                ? 'text-success'
                : stat.trend === 'down'
                ? 'text-danger'
                : 'text-light-subtext',
            ]"
          >
            {{ stat.change }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue'
import { useStatsStore } from '~/stores/stats' 

const statsStore = useStatsStore()

onMounted(() => {
  statsStore.fetchStats()
})
</script>
