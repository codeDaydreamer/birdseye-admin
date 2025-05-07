<template>
  <header class="bg-primary text-light-text dark:bg-dark-bg dark:text-dark-text shadow-md">
    <div class="max-w-screen-xl mx-auto px-4 py-4 flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <!-- Replace text with logo image -->
        <img 
          src="/birdseye-logo.png" 
          alt="Birdseye Logo" 
          class="h-10 md:h-12" 
        />
      </div>

      <!-- Right section with notifications and profile -->
      <div class="flex items-center space-x-6">
        <!-- Desktop version with text -->
        <div class="hidden md:flex items-center space-x-2">
          <button class="flex items-center space-x-2 text-light-text dark:text-dark-text">
            <i class="mdi mdi-bell-outline text-xl"></i>
            <span>Notifications</span>
          </button>
          <button class="flex items-center space-x-2 text-light-text dark:text-dark-text">
            <i class="mdi mdi-account-circle text-xl"></i>
            <span>Profile</span>
          </button>
        </div>

        <!-- Mobile version with only icons -->
        <div class="flex md:hidden items-center space-x-4">
          <button class="text-light-text dark:text-dark-text">
            <i class="mdi mdi-bell-outline text-xl"></i>
          </button>
          <button class="text-light-text dark:text-dark-text">
            <i class="mdi mdi-account-circle text-xl"></i>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
// No script logic needed yet
</script>

<style scoped>
/* Optional: Adjust the logo size */
img {
  width: auto;
  height: auto;
}

@media (max-width: 768px) {
  .md\:hidden {
    display: none;
  }

  .md\:flex {
    display: flex;
  }
}
</style>
