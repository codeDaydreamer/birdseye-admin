<template>
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <!-- Total Registered Farms -->
      <div class="bg-light-accent dark:bg-dark-accent text-light-text dark:text-dark-text p-4 rounded-lg shadow flex items-center gap-4">
        <div class="bg-primary/10 p-3 rounded-full text-2xl sm:text-3xl md:text-4xl">
          <i class="mdi mdi-home text-primary dark:text-primary" style="font-size: 2rem;"></i>
        </div>
        <div>
          <h3 class="text-xl font-semibold" style="font-size: 1.5rem;">Total Registered Farms</h3>
          <p class="font-bold" style="font-size: 2rem;">{{ farmsStore.totalFarms }}</p>
          <small class="text-sm text-light-subtext dark:text-dark-subtext" style="font-size: 1rem;">Since platform launch</small>
        </div>
      </div>
  
      <!-- Paying Farms -->
      <div class="bg-light-accent dark:bg-dark-accent text-light-text dark:text-dark-text p-4 rounded-lg shadow flex items-center gap-4">
        <div class="bg-info/10 p-3 rounded-full text-2xl sm:text-3xl md:text-4xl">
          <i class="mdi mdi-cash-check text-info dark:text-info" style="font-size: 2rem;"></i>
        </div>
        <div>
          <h3 class="text-xl font-semibold" style="font-size: 1.5rem;">Paying Farms</h3>
          <p class="font-bold" style="font-size: 2rem;">{{ farmsStore.payingFarms }}</p>
          <small class="text-sm text-light-subtext dark:text-dark-subtext" style="font-size: 1rem;">Subscription paid up</small>
        </div>
      </div>
  
      <!-- New Farms This Week -->
      <div class="bg-light-accent dark:bg-dark-accent text-light-text dark:text-dark-text p-4 rounded-lg shadow flex items-center gap-4">
        <div class="bg-success/10 p-3 rounded-full text-2xl sm:text-3xl md:text-4xl">
          <i class="mdi mdi-plus-box text-success dark:text-success" style="font-size: 2rem;"></i>
        </div>
        <div>
          <h3 class="text-xl font-semibold" style="font-size: 1.5rem;">New Farms This Week</h3>
          <p class="font-bold" style="font-size: 2rem;">{{ farmsStore.newFarmsThisWeek }}</p>
          <small class="text-sm text-light-subtext dark:text-dark-subtext" style="font-size: 1rem;">New registrations in the past 7 days</small>
        </div>
      </div>
  
      <!-- Farms on Trial -->
      <div class="bg-light-accent dark:bg-dark-accent text-light-text dark:text-dark-text p-4 rounded-lg shadow flex items-center gap-4">
        <div class="bg-warning/10 p-3 rounded-full text-2xl sm:text-3xl md:text-4xl">
          <i class="mdi mdi-clock-outline text-warning dark:text-warning" style="font-size: 2rem;"></i>
        </div>
        <div>
          <h3 class="text-xl font-semibold" style="font-size: 1.5rem;">On Trial</h3>
          <p class="font-bold" style="font-size: 2rem;">{{ farmsStore.trialFarms }}</p>
          <small class="text-sm text-light-subtext dark:text-dark-subtext" style="font-size: 1rem;">Farms still in their free trial</small>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { onMounted } from 'vue'
  import { useFarmsStore } from '~/stores/farms'
  
  const farmsStore = useFarmsStore()
  
  onMounted(() => farmsStore.loadFarms())
  </script>
  