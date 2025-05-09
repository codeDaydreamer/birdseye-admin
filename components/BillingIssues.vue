<template>
    <div class="bg-light-accent/20 dark:bg-dark-accent/40 p-6 rounded-xl shadow-lg">
      <h3 class="text-xl font-semibold text-light-text dark:text-dark-text text-center mb-4">Billing Issues</h3>
      <ul>
        <li v-for="(issue, index) in billingIssues" :key="index" class="flex justify-between items-center p-4 mb-2 bg-light-bg/30 dark:bg-dark-accent/50 rounded-lg">
          <div>
            <p class="text-sm text-light-text dark:text-dark-text">{{ issue.user }}</p>
            <p class="text-xs text-light-subtext dark:text-dark-subtext">{{ issue.issue }}</p>
          </div>
          <span class="text-sm text-light-text dark:text-dark-text">{{ issue.retryDate }}</span>
        </li>
      </ul>
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps({
    billingIssues: Array
  })
  </script>
  