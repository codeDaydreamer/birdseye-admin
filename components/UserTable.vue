<template>
  <div class="overflow-x-auto w-full pt-4 p-4">
    <!-- Filters -->
    <div class="mb-4 flex gap-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search by username or email"
        class="input input-bordered w-1/2 p-3 dark:bg-dark-input dark:text-dark-text dark:border-dark-border bg-light-input text-light-text border-light-border"
      />
      <select v-model="selectedRole" class="p-3 select select-bordered w-1/4">
        <option value="">All Roles</option>
        <option value="admin">Admin</option>
        <option value="moderator">Moderator</option>
        <option value="user">User</option>
      </select>
      <select v-model="selectedStatus" class="p-3 select select-bordered w-1/4">
        <option value="">All Statuses</option>
        <option value="active">Active</option>
        <option value="expired">Expired</option>
      </select>
    </div>

<!-- User Table -->
<div class="overflow-x-auto max-w-full">
  <table class="table table-zebra w-full text-sm min-w-[1300px] border border-light-border dark:border-dark-border">
    <thead>
      <tr class="bg-light-accent dark:bg-dark-subtext text-light-text dark:text-dark-text">
        <th class="p-3 border">ID</th>
        <th class="p-3 border">Username</th>
        <th class="p-3 border">Email</th>
        <th class="p-3 border">Contact</th>
        <th class="p-3 border">Role</th>
        <th class="p-3 border">Status</th>
        <th class="p-3 border">Sub. Plan</th>
        <th class="p-3 border">Sub. Expiry</th>
        <th class="p-3 border">Sub. Status</th>
        <th class="p-3 border">Card Number</th>
        <th class="p-3 border">Billing Address</th>
        <th class="p-3 border">Last Login</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="user in paginatedUsers"
        :key="user.id"
        class="hover:bg-light-subtext dark:hover:bg-dark-accent cursor-pointer text-light-text dark:text-dark-text"
        @click="goToUser(user.id)"
      >
        <td class="px-4 py-2 border">{{ user.id }}</td>
        <td class="px-4 py-2 border">{{ user.username }}</td>
        <td class="px-4 py-2 border">{{ user.email }}</td>
        <td class="px-4 py-2 border">{{ user.contact }}</td>
        <td class="px-4 py-2 border capitalize">{{ user.role }}</td>
        <td class="px-4 py-2 border capitalize">{{ user.status }}</td>
        <td class="px-4 py-2 border">
          <span :class="user.subscription?.plan ? 'text-success' : 'text-danger'">
            {{ user.subscription?.plan || 'N/A' }}
          </span>
        </td>
        <td class="px-4 py-2 border">{{ formatDate(user.subscription?.expiry_date) }}</td>
        <td class="px-4 py-2 border">
          <span :class="isActive(user.subscription?.expiry_date) ? 'text-success' : 'text-danger'">
            {{ isActive(user.subscription?.expiry_date) ? 'Active' : 'Expired' }}
          </span>
        </td>
        <td class="px-4 py-2 border">{{ user.billing_info?.card_number || 'N/A' }}</td>
        <td class="px-4 py-2 border">{{ user.billing_info?.address || 'N/A' }}</td>
        <td class="px-4 py-2 border">{{ formatDate(user.last_login) }}</td>
      </tr>
    </tbody>
  </table>
</div>


    <!-- Pagination -->
    <div class="flex justify-between items-center mt-4">
      <button
        @click="currentPage > 1 && currentPage--"
        :disabled="currentPage <= 1"
        class="btn text-gray-600 bg-gray-200 p-2 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 rounded-lg disabled:cursor-not-allowed"
      >
        Previous
      </button>
      <span class="text-sm text-gray-700 dark:text-gray-300">
        Page {{ currentPage }} of {{ totalPages }}
      </span>
      <button
        @click="currentPage < totalPages && currentPage++"
        :disabled="currentPage >= totalPages"
        class="btn text-gray-600 bg-gray-200 p-2 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 rounded-lg disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUsersStore } from '~/stores/users'

const router = useRouter()
const store = useUsersStore()

const searchQuery = ref('')
const selectedRole = ref('')
const selectedStatus = ref('')
const currentPage = ref(1)
const usersPerPage = 10

onMounted(() => {
  store.loadUsers()
})

const goToUser = (id) => {
  router.push(`/user/${id}`)
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(dateString))
}

const isActive = (expiryDate) => {
  if (!expiryDate) return false
  const now = new Date()
  const expiry = new Date(expiryDate)
  return expiry > now
}

const filteredUsers = computed(() => {
  return store.users.filter(user => {
    const searchLower = searchQuery.value.toLowerCase()
    const matchesSearch =
      user.username?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower)

    const matchesRole = selectedRole.value ? user.role === selectedRole.value : true

    const status = isActive(user.subscription?.expiry_date) ? 'active' : 'expired'
    const matchesStatus = selectedStatus.value ? status === selectedStatus.value : true

    return matchesSearch && matchesRole && matchesStatus
  })
})

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * usersPerPage
  return filteredUsers.value.slice(start, start + usersPerPage)
})

const totalPages = computed(() => {
  return Math.ceil(filteredUsers.value.length / usersPerPage)
})
</script>
