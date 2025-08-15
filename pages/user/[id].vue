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
    <div v-if="loading" class="text-center mt-12">
      <p class="text-gray-500 text-lg font-semibold animate-fade-in">Loading user data...</p>
    </div>

    <div v-else-if="!user" class="text-center mt-12">
      <p class="text-red-500 text-lg font-semibold animate-fade-in">User not found.</p>
    </div>

    <div v-else class="space-y-6">
      <!-- Header -->
      <h1
        class="text-3xl sm:text-4xl font-extrabold text-center text-light-text dark:text-dark-text flex items-center justify-center gap-3 animate-fade-up"
      >
        <i class="mdi mdi-account-circle text-4xl text-secondary"></i>
        <span>Username: {{ user.username || 'N/A' }}</span>
      </h1>

      <!-- Details Component -->
      <OneUserDetails :user="user" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useUsersStore } from '~/stores/users'
import OneUserDetails from '~/components/OneUserDetails.vue'

const route = useRoute()
const usersStore = useUsersStore()
const loading = ref(true)
const userId = parseInt(route.params.id)

const user = computed(() => usersStore.getUserById(userId))

async function loadUser() {
  loading.value = true
  try {
    // Ensure users are loaded
    if (!usersStore.users.length) {
      await usersStore.loadUsers()
    }

    // If user not found locally, fetch from server
    if (!user.value) {
      const freshUser = await usersStore.getUserByIdFromServer(userId)
      if (freshUser) usersStore.users.push(freshUser)
    }
  } catch (err) {
    console.error('Failed to fetch user:', err)
  } finally {
    loading.value = false
  }
}

onMounted(loadUser)

// Watch for route changes (optional if navigating to another user)
watch(
  () => route.params.id,
  async (newId) => {
    if (parseInt(newId) !== userId) {
      await loadUser()
    }
  }
)
</script>
