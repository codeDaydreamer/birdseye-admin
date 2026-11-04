<template>
  <aside
    :class="[
      'h-screen fixed top-0 left-0 z-40 shadow-lg flex flex-col transition-all duration-300',
      'bg-neutral-950 text-neutral-300 dark:bg-dark-bg dark:text-dark-text border-r border-white/5',
      isMobile
        ? 'w-64 transform ' + (isOpen ? 'translate-x-0' : '-translate-x-full')
        : isCollapsed
          ? 'w-16'
          : 'w-64'
    ]"
  >
    <div class="relative h-16 flex items-center justify-between px-4 border-b border-white/10">
      <div class="flex items-center space-x-2 text-xl font-bold tracking-wide text-white">
        <i class="mdi mdi-chicken"></i>
        <span v-if="!isCollapsed || isMobile" class="whitespace-nowrap">Birdseye Admin</span>
      </div>

      <!-- Collapse button (desktop only) -->
      <button
        v-if="!isMobile"
        @click="toggleCollapse"
        class="p-2 bg-white/10 text-white hover:bg-white/20 rounded-full"
      >
        <i :class="isCollapsed ? 'mdi mdi-chevron-right' : 'mdi mdi-chevron-left'"></i>
      </button>

      <!-- Close button (mobile only) -->
      <button
        v-if="isMobile"
        @click="toggleMobile"
        class="p-2 bg-white/10 text-white hover:bg-white/20 rounded-full"
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
        class="flex items-center space-x-3 p-3 rounded-md border-l-2 hover:bg-white/5 hover:text-white transition-all"
        :class="isActive(item.to) ? 'bg-white/10 text-white border-primary' : 'border-transparent'"
      >
        <i :class="item.icon"></i>
        <span v-if="!isCollapsed || isMobile">{{ item.label }}</span>
      </NuxtLink>
    </nav>

    <!-- Logout -->
    <div class="p-4">
      <button
        @click="logout"
        class="w-full flex items-center space-x-3 p-3 rounded-md hover:bg-white/5 hover:text-white transition-all"
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
  { to: '/', label: 'Overview', icon: 'mdi mdi-view-dashboard-outline' },
  { to: '/farms', label: 'Farms', icon: 'mdi mdi-barn' },
  { to: '/users', label: 'Users', icon: 'mdi mdi-account-group' },
  { to: '/activity', label: 'Activity', icon: 'mdi mdi-timeline-text-outline' },
  { to: '/payments', label: 'Payments', icon: 'mdi mdi-cellphone-check' },
  { to: '/subscriptions', label: 'Subscriptions', icon: 'mdi mdi-credit-card-outline' },
  { to: '/pricing', label: 'Pricing', icon: 'mdi mdi-tag-multiple-outline' },
  { to: '/reports', label: 'Reports', icon: 'mdi mdi-file-chart' },
  { to: '/system', label: 'System health', icon: 'mdi mdi-heart-pulse' },
  { to: '/team', label: 'Team', icon: 'mdi mdi-account-key-outline' },
  { to: '/keys', label: 'Keys', icon: 'mdi mdi-key-chain-variant' },
  { to: '/audit', label: 'Audit log', icon: 'mdi mdi-text-box-search-outline' },
  { to: '/system-logs', label: 'System Logs', icon: 'mdi mdi-shield-lock-outline' },
  { to: '/settings', label: 'Settings', icon: 'mdi mdi-cog-outline' }
]

const toggleCollapse = () => emit('toggleCollapse')
const toggleMobile = () => emit('toggleMobile')

const isActive = (route) => route === '/' ? router.currentRoute.value.path === '/' : router.currentRoute.value.path.startsWith(route)
const logout = () => adminAuth.logout()
</script>
