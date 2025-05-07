<template>
  <div class="overflow-x-auto w-full pt-4 p-4">
    <!-- Search and Filter Bar -->
    <div class="mb-4 flex gap-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search by name or email"
        class="input input-bordered w-1/2 dark:bg-dark-input dark:text-dark-text dark:border-dark-border bg-light-input text-light-text border-light-border p-3"
      />
      <select v-model="selectedRole" class="p-3 select select-bordered w-1/4 dark:bg-dark-input dark:text-dark-text dark:border-dark-border bg-light-input text-light-text border-light-border">
        <option value="">All Roles</option>
        <option value="admin">Admin</option>
        <option value="moderator">Moderator</option>
        <option value="user">User</option>
      </select>
      <select v-model="selectedStatus" class="p-3 select select-bordered w-1/4 dark:bg-dark-input dark:text-dark-text dark:border-dark-border bg-light-input text-light-text border-light-border">
        <option value="">All Statuses</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
    </div>

    <!-- Users Table -->
    <table class="table table-zebra w-full text-sm dark:text-dark-text border border-light-border dark:border-dark-border">
      <thead class="bg-light-accent dark:bg-dark-accent p-3">
        <tr>
          <th class="p-3 border-b border-r border-light-border dark:border-dark-border">Name</th>
          <th class="p-3 border-b border-r border-light-border dark:border-dark-border">Email</th>
          <th class="p-3 border-b border-r border-light-border dark:border-dark-border">Role</th>
          <th class="p-3 border-b border-r border-light-border dark:border-dark-border">Subscription</th>
          <th class="p-3 border-b border-r border-light-border dark:border-dark-border">Status</th>
          <th class="p-3 border-b border-r border-light-border dark:border-dark-border">Last Login</th>
        </tr>
      </thead>
      <tbody class="transition-all duration-300 ease-in-out">
        <tr v-for="user in paginatedUsers" :key="user.id" class="hover:bg-light-subtext dark:hover:bg-dark-accent">
          <td class="px-4 py-2 border-b border-r border-light-border dark:border-dark-border">{{ user.name }}</td>
          <td class="px-4 py-2 border-b border-r border-light-border dark:border-dark-border">{{ user.email }}</td>
          <td class="px-4 py-2 border-b border-r border-light-border dark:border-dark-border">{{ user.role }}</td>
          <td class="px-4 py-2 border-b border-r border-light-border dark:border-dark-border">{{ user.subscription }}</td>
          <td class="px-4 py-2 border-b border-r border-light-border dark:border-dark-border">
            <span :class="user.status === 'active' ? 'text-success' : 'text-danger'">
              {{ user.status }}
            </span>
          </td>
          <td class="px-4 py-2 border-b border-r border-light-border dark:border-dark-border">{{ user.lastLogin }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination -->
    <div class="flex justify-between items-center mt-4">
      <button 
        @click="currentPage > 1 && currentPage--" 
        :disabled="currentPage <= 1"
        class="btn text-gray-600 bg-gray-200 p-2 hover:bg-gray-300 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 disabled:bg-gray-400 disabled:text-gray-400 disabled:bg-transparent disabled:cursor-not-allowed border-solid rounded-lg transition-colors"
      >
        Previous
      </button>

      <!-- Page Information -->
      <span class="text-sm text-gray-700 dark:text-gray-300">
        Page {{ currentPage }} of {{ totalPages }}
      </span>

      <button 
        @click="currentPage < totalPages && currentPage++" 
        :disabled="currentPage >= totalPages"
        class="btn text-gray-600 bg-gray-200 p-2 hover:bg-gray-300 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 disabled:bg-gray-400 disabled:text-gray-400 disabled:bg-transparent disabled:cursor-not-allowed border-solid rounded-lg transition-colors"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUsersStore } from '@/stores/userStore'

const store = useUsersStore()

// Reactive state for search query, filters, and pagination
const searchQuery = ref('')
const selectedRole = ref('')
const selectedStatus = ref('')
const currentPage = ref(1)
const usersPerPage = 10

// Fetch users from the store
onMounted(() => {
  store.loadUsers()  // Populate the users store
})

// Computed property to filter users based on search and filter criteria
const filteredUsers = computed(() => {
  return store.users
    .filter(user => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.value.toLowerCase())
      const matchesRole = selectedRole.value ? user.role === selectedRole.value : true
      const matchesStatus = selectedStatus.value ? user.status === selectedStatus.value : true

      return matchesSearch && matchesRole && matchesStatus
    })
})

// Computed property to get the users for the current page
const paginatedUsers = computed(() => {
  const startIndex = (currentPage.value - 1) * usersPerPage
  const endIndex = startIndex + usersPerPage
  return filteredUsers.value.slice(startIndex, endIndex)
})

// Computed property for total pages
const totalPages = computed(() => {
  return Math.ceil(filteredUsers.value.length / usersPerPage)
})
</script>

<style scoped>
/* Custom Styling (if needed) */
</style>
