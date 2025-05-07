<template>
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <!-- Total Registered Farms -->
      <div class="bg-light-accent dark:bg-dark-accent text-light-text dark:text-dark-text p-4 rounded-lg shadow flex items-center gap-4">
        <div class="bg-primary/10 p-3 rounded-full text-2xl sm:text-3xl md:text-4xl">
          <i class="mdi mdi-home text-primary dark:text-primary" style="font-size: 2rem;"></i>
        </div>
        <div>
          <h3 class="text-xl font-semibold" style="font-size: 1.5rem;">Total Registered Farms</h3>
          <p class="font-bold" style="font-size: 2rem;">{{ totalFarms }}</p>
          <small class="text-sm text-light-subtext dark:text-dark-subtext" style="font-size: 1rem;">Since platform launch</small>
        </div>
      </div>
  
      <!-- Active Sessions -->
      <div class="bg-light-accent dark:bg-dark-accent text-light-text dark:text-dark-text p-4 rounded-lg shadow flex items-center gap-4">
        <div class="bg-info/10 p-3 rounded-full text-2xl sm:text-3xl md:text-4xl">
          <i class="mdi mdi-access-point text-info dark:text-info" style="font-size: 2rem;"></i>
        </div>
        <div>
          <h3 class="text-xl font-semibold" style="font-size: 1.5rem;">Active Sessions</h3>
          <p class="font-bold" style="font-size: 2rem;">{{ activeFarms }}</p>
          <small class="text-sm text-light-subtext dark:text-dark-subtext" style="font-size: 1rem;">Users active in last 10 mins</small>
        </div>
      </div>
  
      <!-- New Farms This Week -->
      <div class="bg-light-accent dark:bg-dark-accent text-light-text dark:text-dark-text p-4 rounded-lg shadow flex items-center gap-4">
        <div class="bg-success/10 p-3 rounded-full text-2xl sm:text-3xl md:text-4xl">
          <i class="mdi mdi-plus-box text-success dark:text-success" style="font-size: 2rem;"></i>
        </div>
        <div>
          <h3 class="text-xl font-semibold" style="font-size: 1.5rem;">New Farms This Week</h3>
          <p class="font-bold" style="font-size: 2rem;">{{ newFarmsWeek }}</p>
          <small class="text-sm text-light-subtext dark:text-dark-subtext" style="font-size: 1rem;">New registrations in the past 7 days</small>
        </div>
      </div>
  
      <!-- Pending Requests -->
      <div class="bg-light-accent dark:bg-dark-accent text-light-text dark:text-dark-text p-4 rounded-lg shadow flex items-center gap-4">
        <div class="bg-warning/10 p-3 rounded-full text-2xl sm:text-3xl md:text-4xl">
          <i class="mdi mdi-clock-outline text-warning dark:text-warning" style="font-size: 2rem;"></i>
        </div>
        <div>
          <h3 class="text-xl font-semibold" style="font-size: 1.5rem;">Pending Requests</h3>
          <p class="font-bold" style="font-size: 2rem;">{{ pendingRequests }}</p>
          <small class="text-sm text-light-subtext dark:text-dark-subtext" style="font-size: 1rem;">Requests awaiting approval</small>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const totalFarms = ref(150)
  const activeFarms = ref(35)
  const newFarmsWeek = ref(12)
  const pendingRequests = ref(5)
  </script>
  