<template>
  <header class="bg-white text-light-text border-b border-light-border dark:border-dark-border dark:bg-dark-bg dark:text-dark-text relative">
    <div class="max-w-screen-xl mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
      
      <!-- Left section with logo and mobile menu button -->
      <div class="flex items-center space-x-2 md:space-x-4">
        <!-- Mobile toggle button (Hamburger) -->
        <button
          v-if="isMobile"
          @click="$emit('toggleMobile')"
          class="p-2 -ml-1 rounded-full hover:bg-light-input dark:hover:bg-dark-accent"
          aria-label="Open menu"
        >
          <i class="mdi mdi-menu text-xl"></i>
        </button>

        <!-- Logo -->
        <img 
          src="/birdseye-logo.png" 
          alt="Birdseye Logo" 
          class="h-9 md:h-12" 
        />
      </div>

      <!-- Right section with notifications and profile -->
      <div class="flex items-center space-x-3 md:space-x-6">
        <ThemeToggle />
        <!-- Desktop version with text -->
        <div class="hidden md:flex items-center space-x-2">
          <button class="flex items-center space-x-2">
            <i class="mdi mdi-bell-outline text-xl"></i>
            <span>Notifications</span>
          </button>
          <button class="flex items-center space-x-2">
            <i class="mdi mdi-account-circle text-xl"></i>
            <span>Profile</span>
          </button>
        </div>

        <!-- Mobile version with only icons -->
        <div class="flex md:hidden items-center space-x-4">
          <button>
            <i class="mdi mdi-bell-outline text-xl"></i>
          </button>
          <button>
            <i class="mdi mdi-account-circle text-xl"></i>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const isMobile = ref(false)

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>

<style scoped>
img {
  width: auto;
  height: auto;
}
</style>
