<template>
  <aside
    :class="[
      'h-screen fixed top-0 left-0 z-40 shadow-lg flex flex-col transition-all duration-300',
      'bg-primary text-light-text dark:bg-dark-bg dark:text-dark-text',
      isMobile
        ? 'w-64 transform ' + (isOpen ? 'translate-x-0' : '-translate-x-full')
        : isCollapsed
          ? 'w-16'
          : 'w-64'
    ]"
  >
    <div class="relative h-16 flex items-center justify-between px-4 border-b border-light-border dark:border-dark-border">
      <div class="flex items-center space-x-2 text-xl font-bold tracking-wide">
        <i class="mdi mdi-chicken"></i>
        <span v-if="!isCollapsed || isMobile" class="whitespace-nowrap">Birdseye Admin</span>
      </div>

      <!-- Collapse button (desktop only) -->
      <button
        v-if="!isMobile"
        @click="toggleCollapse"
        class="p-2 bg-light-accent dark:bg-dark-accent rounded-full shadow"
      >
        <i :class="isCollapsed ? 'mdi mdi-chevron-right' : 'mdi mdi-chevron-left'"></i>
      </button>

      <!-- Close button (mobile only) -->
      <button
        v-if="isMobile"
        @click="toggleMobile"
        class="p-2 bg-light-accent dark:bg-dark-accent rounded-full shadow"
      >
        <i class="mdi mdi-close"></i>
      </button>
    </div>

    <!-- Navigation -->
    <nav class="flex-grow px-4 space-y-2 mt-2">
      <NuxtLink
        v-for="item in menuItems"
        :key="item.to"
        :to="item.to"
        class="flex items-center space-x-3 p-3 rounded-md hover:bg-light-accent dark:hover:bg-dark-accent transition-all"
        :class="{ 'bg-light-accent dark:bg-dark-accent': isActive(item.to) }"
      >
        <i :class="item.icon"></i>
        <span v-if="!isCollapsed || isMobile">{{ item.label }}</span>
      </NuxtLink>
    </nav>

    <!-- Logout -->
    <div class="p-4">
      <button
        @click="logout"
        class="w-full flex items-center space-x-3 p-3 rounded-md hover:bg-light-accent dark:hover:bg-dark-accent transition-all"
      >
        <i class="mdi mdi-logout"></i>
        <span v-if="!isCollapsed || isMobile">Logout</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAdminAuthStore } from '~/stores/adminAuth'

const props = defineProps({
  isCollapsed: Boolean, // desktop collapse state
  isOpen: Boolean,      // mobile open state
  isMobile: Boolean     // mobile detection from layout
})

const emit = defineEmits(['toggleCollapse', 'toggleMobile'])
const router = useRouter()
const adminAuth = useAdminAuthStore()

const menuItems = [
  { to: '/', label: 'Dashboard', icon: 'mdi mdi-view-dashboard-outline' },
  { to: '/users', label: 'Users', icon: 'mdi mdi-account-group' },
  { to: '/subscriptions', label: 'Subscriptions', icon: 'mdi mdi-credit-card-outline' },
  { to: '/reports', label: 'Reports', icon: 'mdi mdi-file-chart' },
  { to: '/system-logs', label: 'System Logs', icon: 'mdi mdi-shield-lock-outline' },
  { to: '/settings', label: 'Settings', icon: 'mdi mdi-cog-outline' }
]

const toggleCollapse = () => emit('toggleCollapse')
const toggleMobile = () => emit('toggleMobile')

const isActive = (route) => router.currentRoute.value.path === route
const logout = () => adminAuth.logout()
</script>
