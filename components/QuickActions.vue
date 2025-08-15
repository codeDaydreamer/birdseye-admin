<template>
  <div class="relative">
    <UserCreateModal v-model:open="showCreateUserModal" />

    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 pt-4">
      <!-- Add User -->
      <button
        class="group flex flex-col items-center justify-center bg-accent/20 dark:bg-dark-accent p-4 shadow-sm hover:shadow-md transition-all duration-200 text-center"
        @click="showCreateUserModal = true"
      >
        <div class="text-3xl mb-2 text-primary group-hover:scale-110 transition-transform duration-200">
          <i class="mdi mdi-account-plus" />
        </div>
        <span class="text-sm font-medium text-light-text dark:text-dark-text">
          Add User
        </span>
      </button>

      <!-- Toggle Admin Registration -->
      <button
        class="group flex flex-col items-center justify-center p-4 shadow-sm transition-all duration-200 text-center"
        :class="allowRegistration ? 'bg-green-200 dark:bg-green-700 hover:shadow-md' : 'bg-accent/20 dark:bg-dark-accent hover:shadow-md'"
        @click="allowRegistration = !allowRegistration"
      >
        <div class="text-3xl mb-2 text-primary group-hover:scale-110 transition-transform duration-200">
          <i class="mdi mdi-account-key" />
        </div>
        <span class="text-sm font-medium text-light-text dark:text-dark-text">
          {{ allowRegistration ? 'Admin Registration Enabled' : 'Enable Admin Registration' }}
        </span>
      </button>

      <!-- Other Actions -->
      <NuxtLink
        v-for="action in filteredActions"
        :key="action.label"
        :to="action.link"
        class="group flex flex-col items-center justify-center bg-accent/20 dark:bg-dark-accent p-4 shadow-sm hover:shadow-md transition-all duration-200 text-center"
      >
        <div class="text-3xl mb-2 text-primary group-hover:scale-110 transition-transform duration-200">
          <i :class="action.icon" />
        </div>
        <span class="text-sm font-medium text-light-text dark:text-dark-text">
          {{ action.label }}
        </span>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useAdminAuthStore } from '~/stores/adminAuth'
import UserCreateModal from '~/components/UserCreateModal.vue'

const showCreateUserModal = ref(false)
const store = useAdminAuthStore()

// Bind allowRegistration flag to store
const allowRegistration = ref(store.allowRegistration)
watch(allowRegistration, (val) => {
  store.allowRegistration = val
})

// Actions list without "Subscription Plans"
const otherActions = [
  { label: 'View All Users', link: '/users', icon: 'mdi mdi-account-group-outline' },
  { label: 'View Reports', link: '/reports', icon: 'mdi mdi-file-plus-outline' },
  { label: 'View Logs', link: '/logs', icon: 'mdi mdi-lock-alert' },
  { label: 'System Settings', link: '/settings', icon: 'mdi mdi-cog-outline' },
]

// Computed to filter out any removed actions if needed
const filteredActions = computed(() => otherActions)
</script>
