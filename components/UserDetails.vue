<template>
  <div
    v-if="selectedUser"
    class="drawer-side fixed top-0 right-0 w-80 h-full bg-white dark:bg-dark-bg shadow-lg z-50 p-4 overflow-y-auto"
  >
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold text-light-text dark:text-dark-text">User Details</h3>
      <button class="btn btn-sm btn-ghost" @click="$emit('close')">✕</button>
    </div>

    <div class="space-y-3 text-sm text-light-text dark:text-dark-text">
      <p><strong>Username:</strong> {{ selectedUser.username }}</p>
      <p><strong>Email:</strong> {{ selectedUser.email }}</p>
      <p><strong>Contact:</strong> {{ selectedUser.contact || 'N/A' }}</p>
      <p><strong>Role:</strong> {{ selectedUser.role }}</p>
      <p><strong>Status:</strong> {{ selectedUser.status }}</p>

      <p>
        <strong>Subscription Plan:</strong>
        <span :class="selectedUser.subscription?.plan ? 'text-success' : 'text-danger'">
          {{ selectedUser.subscription?.plan || 'N/A' }}
        </span>
      </p>

      <p>
        <strong>Subscription Expiry:</strong>
        {{ formatDate(selectedUser.subscription?.expiry_date) }}
      </p>

      <p>
        <strong>Subscription Status:</strong>
        <span :class="isActive(selectedUser.subscription?.expiry_date) ? 'text-success' : 'text-danger'">
          {{ isActive(selectedUser.subscription?.expiry_date) ? 'Active' : 'Expired' }}
        </span>
      </p>

      <p><strong>Card Number:</strong> {{ selectedUser.billing_info?.card_number || 'N/A' }}</p>
      <p><strong>Billing Address:</strong> {{ selectedUser.billing_info?.address || 'N/A' }}</p>
      <p><strong>Last Login:</strong> {{ formatDate(selectedUser.last_login) }}</p>

      <hr class="border-light-border dark:border-dark-border" />

      <div>
        <h4 class="font-semibold mb-1">Activity Log</h4>
        <ul v-if="selectedUser.activityLog?.length" class="list-disc ml-5">
          <li v-for="(log, index) in selectedUser.activityLog" :key="index">{{ log }}</li>
        </ul>
        <p v-else class="text-light-subtext dark:text-dark-subtext">No activity logs available.</p>
      </div>

      <div>
        <h4 class="font-semibold mb-1">Subscription History</h4>
        <ul v-if="selectedUser.subscriptionHistory?.length" class="list-disc ml-5">
          <li v-for="(entry, index) in selectedUser.subscriptionHistory" :key="index">{{ entry }}</li>
        </ul>
        <p v-else class="text-light-subtext dark:text-dark-subtext">No subscription history available.</p>
      </div>

      <div class="pt-4">
        <button class="btn btn-sm bg-warning text-white w-full mb-2">Deactivate</button>
        <button class="btn btn-sm bg-secondary text-white w-full">Reset Password</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useUsersStore } from '~/stores/users'

const props = defineProps({
  userId: String
})

const store = useUsersStore()

const selectedUser = computed(() =>
  store.users.find(u => u.id === props.userId)
)

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
  return new Date(expiryDate) > new Date()
}
</script>
