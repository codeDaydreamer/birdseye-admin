<template>
  <!-- System / light / dark -->
  <div role="radiogroup" aria-label="Theme" class="inline-flex items-center rounded-full p-0.5 ring-1 ring-light-border dark:ring-dark-border bg-light-accent dark:bg-dark-accent">
    <button v-for="o in options" :key="o.value" type="button" role="radio" :aria-checked="theme.choice.value === o.value" :title="o.label" :aria-label="o.label"
      :class="['h-7 w-8 inline-flex items-center justify-center rounded-full text-base transition',
        theme.choice.value === o.value ? 'bg-white text-gray-900 shadow-sm dark:bg-dark-bg dark:text-white' : 'text-light-subtext hover:text-light-text dark:text-dark-subtext dark:hover:text-white']"
      @click="theme.set(o.value)">
      <i :class="['mdi', o.icon]"></i>
    </button>
  </div>
</template>

<script setup>
import { useTheme } from '~/composables/theme'

const theme = useTheme()
const options = [
  { value: 'system', label: 'Match system', icon: 'mdi-monitor' },
  { value: 'light', label: 'Light', icon: 'mdi-white-balance-sunny' },
  { value: 'dark', label: 'Dark', icon: 'mdi-weather-night' },
]
</script>
