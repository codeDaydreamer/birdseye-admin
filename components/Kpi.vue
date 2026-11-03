<template>
  <div class="rounded-xl shadow bg-light-accent dark:bg-dark-accent p-3 sm:p-4 min-w-0">
    <div class="flex items-center justify-between">
      <p class="text-[11px] sm:text-xs font-semibold uppercase tracking-wide text-light-subtext dark:text-dark-subtext">{{ label }}</p>
      <i v-if="icon" :class="['mdi', icon, 'text-xl text-primary']"></i>
    </div>
    <p class="mt-2 text-lg sm:text-2xl font-extrabold leading-tight whitespace-nowrap">{{ value }}</p>
    <p v-if="sub" :class="['mt-1 text-xs', tone === 'bad' ? 'text-red-600 dark:text-red-400' : tone === 'good' ? 'text-green-700 dark:text-green-400' : 'text-light-subtext dark:text-dark-subtext']">{{ sub }}</p>
  </div>
</template>

<script setup>
defineProps({ label: String, value: [String, Number], sub: String, icon: String, tone: String })
</script>
