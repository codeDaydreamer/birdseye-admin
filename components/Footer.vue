<template>
    <footer class="bg-primary text-light-text dark:bg-dark-bg dark:text-dark-text py-4">
      <div class="max-w-screen-xl mx-auto text-center">
        <p>&copy; {{ currentYear }} Birdseye Poultry. All rights reserved.</p>
      </div>
    </footer>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const currentYear = ref(new Date().getFullYear());
  </script>
  
  <style scoped>
  /* You can add additional styles here if needed */
  </style>
  