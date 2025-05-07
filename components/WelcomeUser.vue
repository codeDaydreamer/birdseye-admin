<template>
    <div class="bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text p-6 rounded-xl shadow-md">
      <h2 class="text-2xl font-bold mb-2">👋 {{ greeting }}, {{ userName }}!</h2>
      <p class="text-sm text-light-subtext dark:text-dark-subtext">Welcome back to Birdseye Admin Console</p>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  
  // TODO: Replace this with your actual Pinia store later
  const userName = ref('Kevin') // placeholder for now
  
  const greeting = computed(() => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  })
  </script>
  