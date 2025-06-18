<template>
  <div class="max-w-3xl mx-auto p-6 bg-white rounded shadow">
    <h2 class="text-2xl font-bold mb-4">Admin Profile</h2>

    <div v-if="loading" class="text-gray-500">Loading admin info...</div>

    <div v-else-if="error" class="text-red-600">{{ error }}</div>

    <div v-else-if="admin">
      <p><strong>ID:</strong> {{ admin.id }}</p>
      <p><strong>Name:</strong> {{ admin.name }}</p>
      <p><strong>Email:</strong> {{ admin.email }}</p>
      <p><strong>Role:</strong> {{ admin.role || 'Admin' }}</p>
      <p><strong>Created At:</strong> {{ new Date(admin.created_at).toLocaleString() }}</p>
      <!-- Add more fields as per your admin model -->
    </div>

    <div v-else>
      <p>No admin data available.</p>
    </div>

  </div>
  <button
  @click="adminAuth.logout()"
  class="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
>
  Logout
</button>

</template>

<script setup>
import { onMounted } from 'vue'
import { useAdminAuthStore } from '~/stores/adminAuth'

const adminAuth = useAdminAuthStore()

const { admin, loading, error, fetchAdmin } = adminAuth

onMounted(async () => {
  if (!admin) {
    await fetchAdmin()
  }
})
</script>
