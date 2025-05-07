<template>
    <div v-if="selectedUser" class="drawer-side fixed top-0 right-0 w-80 h-full bg-white dark:bg-gray-900 shadow-lg z-50 p-4">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold text-light-text dark:text-dark-text">User Details</h3>
        <button class="btn btn-sm btn-ghost" @click="$emit('close')">✕</button>
      </div>
      <div class="space-y-2 text-sm">
        <p><strong>Name:</strong> {{ selectedUser.name }}</p>
        <p><strong>Email:</strong> {{ selectedUser.email }}</p>
        <p><strong>Role:</strong> {{ selectedUser.role }}</p>
        <p><strong>Status:</strong> {{ selectedUser.status }}</p>
        <p><strong>Subscription:</strong> {{ selectedUser.subscription }}</p>
        <p><strong>Last Login:</strong> {{ selectedUser.lastLogin }}</p>
  
        <hr />
  
        <div>
          <h4 class="font-semibold mb-1">Activity Log</h4>
          <ul class="list-disc ml-5">
            <li v-for="(log, index) in selectedUser.activityLog" :key="index">{{ log }}</li>
          </ul>
        </div>
  
        <div>
          <h4 class="font-semibold mb-1">Subscription History</h4>
          <ul class="list-disc ml-5">
            <li v-for="(entry, index) in selectedUser.subscriptionHistory" :key="index">{{ entry }}</li>
          </ul>
        </div>
  
        <div class="pt-2">
          <button class="btn btn-sm btn-warning w-full mb-1">Deactivate</button>
          <button class="btn btn-sm btn-secondary w-full">Reset Password</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue'
  import { useUsersStore } from '@/stores/userStore'
  
  const props = defineProps<{
    userId: string
  }>()
  
  const usersStore = useUsersStore()
  
  const selectedUser = computed(() =>
    usersStore.users.find(u => u.id === props.userId)
  )
  </script>
  