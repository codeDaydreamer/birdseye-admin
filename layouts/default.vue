<template>
  <div class="min-h-screen flex flex-col bg-light-bg text-light-text dark:bg-dark-bg dark:text-dark-text">
    <Header />
    <div class="flex flex-1 min-h-0">
      <!-- Sidebar with dynamic width based on the collapsed state -->
      <Sidebar :isCollapsed="isCollapsed" @toggleSidebar="toggleSidebar" />
  
      <!-- Main content adjusts dynamically based on the sidebar state -->
      <main
        :class="{
          'ml-16': isCollapsed && !isMobile,
          'ml-64': !isCollapsed && !isMobile,
          'ml-0': isMobile
        }"
        class="flex-1 p-6 overflow-auto transition-all duration-300 ease-in-out"
      >
        <NuxtPage />
      </main>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useAdminAuthStore } from '~/stores/adminAuth'

const isCollapsed = ref(false)
const isMobile = ref(false)
const authStore = useAdminAuthStore()

// Resize handler
const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
}

// Restore token & check screen size
onMounted(() => {
  authStore.restoreToken()
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

// Cleanup
onBeforeUnmount(() => {
  window.removeEventListener('resize', checkMobile)
})

// Toggle Sidebar
const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}
</script>


<style scoped>
/* Sidebar transition for width */
.sidebar {
  transition: width 0.3s ease;
}

/* Button transition for smooth icon rotation */
button {
  transition: transform 0.3s ease;
}

/* Main content transition for smooth margin adjustment */
main {
  transition: margin-left 0.3s ease-in-out;
}

/* Optional: Add responsive behavior for smaller screens */
@media (max-width: 768px) {
  .ml-64 {
    margin-left: 0 !important;
  }
  .ml-16 {
    margin-left: 0 !important;
  }
}
</style>
