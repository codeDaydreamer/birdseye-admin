<template>
  <div class="p-6 max-w-7xl mx-auto space-y-8">
    <!-- Back Button -->
    <NuxtLink
      to="/users"
      class="btn btn-outline btn-primary flex items-center gap-2 w-fit transition-all duration-300 hover:scale-105 animate-fade-left"
    >
      <i class="mdi mdi-arrow-left-bold text-lg"></i>
      Back to Users
    </NuxtLink>

    <!-- Conditional Content -->
    <div v-if="!user" class="text-center mt-12">
      <p class="text-red-500 text-lg font-semibold animate-fade-in">User not found.</p>
    </div>

    <div v-else class="space-y-6">
      <!-- Header -->
      <h1
        class="text-3xl sm:text-4xl font-extrabold text-center text-light-text dark:text-dark-text flex items-center justify-center gap-3 animate-fade-up"
      >
        <i class="mdi mdi-account-circle text-4xl text-secondary"></i>
        <span>User Name: {{ user.name }}</span>
      </h1>

      <!-- Details Component -->
      <OneUserDetails :user="user" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useUsersStore } from '~/stores/userStore'

const route = useRoute()
const userId = route.params.id as string
const usersStore = useUsersStore()

// Load users if not already loaded
if (!usersStore.users.length) {
  usersStore.loadUsers()
}

const user = computed(() => usersStore.getUserById(userId))
</script>
