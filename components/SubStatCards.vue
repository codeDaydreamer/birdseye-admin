<template>
    <div class="bg-light-accent/20 dark:bg-dark-accent/40 p-6 rounded-xl shadow-lg">
      <div class="flex items-center gap-4">
        <i :class="[icon, 'text-3xl']"></i>
        <div>
          <p class="text-sm text-light-subtext dark:text-dark-subtext">{{ title }}</p>
          <p class="text-xl font-semibold text-light-text dark:text-dark-text">{{ value }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps({
    title: String,
    value: String,
    icon: String
  })
  </script>
  