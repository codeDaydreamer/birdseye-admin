<template>
  <div class="relative">
    <UserCreateModal v-model:open="showCreateUserModal" />

    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 pt-4">
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

      <NuxtLink
        v-for="action in otherActions"
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
import { ref } from 'vue'
import UserCreateModal from '~/components/UserCreateModal.vue'

const showCreateUserModal = ref(false)

const otherActions = [
  {
    label: 'View All Users',
    link: '/users',
    icon: 'mdi mdi-account-group-outline',
  },
  {
    label: 'View Reports',
    link: '/reports',
    icon: 'mdi mdi-file-plus-outline',
  },
  {
    label: 'Subscription Plans',
    link: '/subscriptions',
    icon: 'mdi mdi-currency-usd',
  },
  {
    label: 'View Logs',
    link: '/logs',
    icon: 'mdi mdi-lock-alert',
  },
  {
    label: 'System Settings',
    link: '/settings',
    icon: 'mdi mdi-cog-outline',
  },
]
</script>
