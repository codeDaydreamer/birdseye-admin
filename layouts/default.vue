<template>
  <div class="min-h-screen flex flex-col bg-light-bg text-light-text dark:bg-dark-bg dark:text-dark-text">
    <!-- Pass isMobile prop and connect toggleMobile event -->
    <Header
      :isMobile="isMobile"
      @toggleMobile="toggleSidebar"
    />

    <div class="flex flex-1 min-h-0 relative">
      <!-- Sidebar -->
      <transition name="slide">
        <Sidebar
          v-if="!isMobile || (isMobile && isSidebarOpen)"
          :isCollapsed="isCollapsed && !isMobile"
          :isOpen="isSidebarOpen"
          :isMobile="isMobile"
          class="sidebar z-40"
          @toggleCollapse="toggleSidebar"
          @toggleMobile="toggleSidebar"
          @navigate="isSidebarOpen = false"
        />
      </transition>

      <!-- Mobile overlay -->
      <div
        v-if="isMobile && isSidebarOpen"
        class="fixed inset-0 bg-black/50 z-30"
        @click="isSidebarOpen = false"
      ></div>

      <!-- Main content -->
      <main
        :class="{
          'ml-16': isCollapsed && !isMobile,
          'ml-64': !isCollapsed && !isMobile,
          'ml-0': isMobile
        }"
        class="flex-1 min-w-0 p-4 md:p-6 overflow-auto transition-all duration-300 ease-in-out"
      >
        <NuxtPage />
      </main>
    </div>

    <Footer />
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import Header from '~/components/Header.vue'
import Sidebar from '~/components/Sidebar.vue'
import Footer from '~/components/Footer.vue'
import { useAdminAuthStore } from '~/stores/adminAuth'

const isCollapsed = ref(false)    // desktop collapse
const isMobile = ref(false)
const isSidebarOpen = ref(false)  // mobile open
const authStore = useAdminAuthStore()
const route = useRoute()

// On phones the menu is an overlay: close it whenever the page changes
watch(() => route.fullPath, () => { isSidebarOpen.value = false })

// Detect mobile
const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
  if (!isMobile.value) isSidebarOpen.value = false
}

onMounted(() => {
  authStore.restoreToken()
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onBeforeUnmount(() => window.removeEventListener('resize', checkMobile))

// Unified toggle for both desktop collapse and mobile open/close
const toggleSidebar = () => {
  if (isMobile.value) {
    isSidebarOpen.value = !isSidebarOpen.value
  } else {
    isCollapsed.value = !isCollapsed.value
  }
}
</script>
