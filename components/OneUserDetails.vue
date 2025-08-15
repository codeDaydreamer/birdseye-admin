<template>
  <div class="p-6 space-y-10 bg-light-bg dark:bg-dark-bg rounded-xl shadow-xl">
    <!-- Profile Picture & Header -->
    <div class="flex flex-col items-center space-y-2">
      <img
        :src="user.profile_picture || '/default-profile.png'"
        alt="Profile Picture"
        class="w-24 h-24 rounded-full border-4 border-light-accent dark:border-dark-accent shadow-lg"
      />
      <h2 class="text-3xl font-bold text-light-text dark:text-dark-text">{{ user.username || 'N/A' }}</h2>
      <p class="text-sm text-light-subtext dark:text-dark-subtext">{{ user.email || 'N/A' }}</p>

      <!-- Total Birds Summary -->
      <div
        v-if="user.flocks && user.flocks.length"
        class="mt-2 px-4 py-1 rounded-full bg-yellow-500 dark:bg-yellow-600 text-white font-semibold shadow"
      >
        Total Birds: {{ totalBirds }}
      </div>
    </div>

    <!-- Info Grid -->
    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="(item, index) in infoCards"
        :key="index"
        class="bg-light-accent/30 dark:bg-dark-accent/50 p-5 rounded-xl shadow-lg hover:scale-[1.02] hover:shadow-2xl transition-all"
      >
        <div class="flex items-start gap-4">
          <i :class="[item.icon, 'text-3xl', item.iconColor]"></i>
          <div>
            <p class="text-sm text-light-subtext dark:text-dark-subtext font-medium">{{ item.label }}</p>
            <p class="text-lg font-semibold text-light-text dark:text-dark-text">
              <template v-if="item.key === 'last_login'">
                {{ user.last_login ? new Date(user.last_login).toLocaleString() : 'N/A' }}
              </template>
              <template v-else-if="item.key === 'status'">
                <span
                  :class="[
                    'badge text-white font-semibold',
                    user.status === 'active' ? 'badge-success' :
                    user.status === 'suspended' ? 'badge-warning' :
                    'badge-error'
                  ]"
                >
                  {{ user.status ? user.status.charAt(0).toUpperCase() + user.status.slice(1) : 'N/A' }}
                </span>
              </template>
              <template v-else-if="item.key === 'payment_status'">
                {{ user.payment_status || 'N/A' }}
              </template>
              <template v-else-if="item.key === 'email_verified'">
                {{ user.email_verified ? 'Verified' : 'Unverified' }}
              </template>
              <template v-else>
                {{ user[item.key] || 'N/A' }}
              </template>
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Flocks Info -->
    <div v-if="user.flocks && user.flocks.length" class="space-y-4">
      <h3 class="text-xl font-semibold text-light-text dark:text-dark-text text-center mb-4">Flocks</h3>
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="flock in user.flocks"
          :key="flock.id"
          class="bg-light-accent/20 dark:bg-dark-accent/40 p-4 rounded-xl shadow-md"
        >
          <p class="text-sm text-light-subtext dark:text-dark-subtext font-medium">Name</p>
          <p class="text-lg font-semibold text-light-text dark:text-dark-text">{{ flock.name || 'N/A' }}</p>

          <p class="text-sm text-light-subtext dark:text-dark-subtext font-medium mt-2">Current Birds</p>
          <p class="text-lg font-semibold text-light-text dark:text-dark-text">{{ flock.bird_count || 0 }}</p>

          <p class="text-sm text-light-subtext dark:text-dark-subtext font-medium mt-2">Initial Birds</p>
          <p class="text-lg font-semibold text-light-text dark:text-dark-text">{{ flock.initial_bird_count || 0 }}</p>
        </div>
      </div>
    </div>

    <!-- Payments Info -->
    <div v-if="user.payments && user.payments.length" class="space-y-4">
      <h3 class="text-xl font-semibold text-light-text dark:text-dark-text text-center mb-4">Payments</h3>
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="bg-light-accent/20 dark:bg-dark-accent/40 p-4 rounded-xl shadow-md">
          <p class="text-sm text-light-subtext dark:text-dark-subtext font-medium">Last Payment</p>
          <p class="text-lg font-semibold text-light-text dark:text-dark-text">
            {{ lastPayment ? formatCurrency(lastPayment.amount) + ' via ' + lastPayment.gateway : 'N/A' }}
          </p>
          <p class="text-xs text-light-subtext dark:text-dark-subtext mt-1">
            {{ lastPayment ? new Date(lastPayment.paid_at).toLocaleString() : '' }}
          </p>
        </div>

        <div class="bg-light-accent/20 dark:bg-dark-accent/40 p-4 rounded-xl shadow-md">
          <p class="text-sm text-light-subtext dark:text-dark-subtext font-medium">Payment Status</p>
          <p class="text-lg font-semibold text-light-text dark:text-dark-text">
            <span
              :class="[
                'badge text-white font-semibold',
                lastPayment && lastPayment.status === 'paid' ? 'badge-success' :
                'badge-error'
              ]"
            >
              {{ lastPayment ? lastPayment.status.toUpperCase() : 'N/A' }}
            </span>
          </p>
        </div>

        <div class="bg-light-accent/20 dark:bg-dark-accent/40 p-4 rounded-xl shadow-md">
          <p class="text-sm text-light-subtext dark:text-dark-subtext font-medium">Payments Due</p>
          <p class="text-lg font-semibold text-light-text dark:text-dark-text">
            {{ duePayments.length || 0 }}
          </p>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex justify-center flex-wrap gap-4 pt-6">
      <button
        class="btn btn-lg hover:scale-105 p-3 rounded-lg"
        :class="[
          user.status === 'suspended' 
            ? 'bg-green-600 dark:bg-green-700 text-white'
            : 'bg-yellow-500 dark:bg-yellow-600 text-white'
        ]"
        @click="toggleSuspendUser"
        :disabled="loading"
      >
        <i
          :class="[
            'mdi text-lg mr-1',
            user.status === 'suspended' ? 'mdi-account-check' : 'mdi-account-off'
          ]"
        ></i>
        {{ user.status === 'suspended' ? 'Reactivate' : 'Suspend' }}
      </button>

      <button
        class="btn btn-danger btn-lg bg-red-600 dark:bg-red-700 hover:scale-105 p-3 rounded-lg"
        @click="deleteUserConfirm"
        :disabled="loading"
      >
        <i class="mdi mdi-delete text-lg mr-1"></i> Delete User
      </button>

      <button
        class="btn btn-info btn-lg bg-blue-500 dark:bg-blue-600 hover:scale-105 p-3 rounded-lg"
        @click="showChangePasswordModal = true"
        :disabled="loading"
      >
        <i class="mdi mdi-lock-reset text-lg mr-1"></i> Change Password
      </button>
    </div>

    <!-- Change Password Modal -->
    <ChangePasswordModal
      v-model="showChangePasswordModal"
      :loading="loading"
      @save="onSaveNewPassword"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ChangePasswordModal from '~/components/ChangePasswordModal.vue'
import { useUsersStore } from '~/stores/users'

const props = defineProps({
  user: { type: Object, required: true } // expects user.flocks & user.payments arrays
})

const store = useUsersStore()
const loading = ref(false)
const showChangePasswordModal = ref(false)

// Total birds
const totalBirds = computed(() => {
  if (!props.user.flocks) return 0
  return props.user.flocks.reduce((sum, flock) => sum + (flock.bird_count || 0), 0)
})

// Payments
const sortedPayments = computed(() => {
  if (!props.user.payments) return []
  return [...props.user.payments].sort(
    (a, b) => new Date(b.paid_at) - new Date(a.paid_at)
  )
})

const lastPayment = computed(() => sortedPayments.value[0] || null)
const duePayments = computed(() => {
  if (!props.user.payments) return []
  return props.user.payments.filter(p => p.status !== 'paid')
})

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(amount)
}

// Actions
async function toggleSuspendUser() {
  loading.value = true
  const newStatus = props.user.status === 'suspended' ? 'active' : 'suspended'
  try {
    await store.updateUser(props.user.id, { status: newStatus })
    alert(`User ${newStatus === 'active' ? 'reactivated' : 'suspended'} successfully.`)
  } catch (e) {
    alert('Failed to update user status.')
  } finally {
    loading.value = false
  }
}

async function deleteUserConfirm() {
  if (!confirm('Are you sure you want to permanently delete this user?')) return
  loading.value = true
  try {
    await store.deleteUser(props.user.id)
    alert('User deleted successfully.')
  } catch (e) {
    alert('Failed to delete user.')
  } finally {
    loading.value = false
  }
}

async function onSaveNewPassword(newPassword) {
  loading.value = true
  try {
    await store.adminResetUserPassword(props.user.id, newPassword)
    alert('Password changed successfully.')
    showChangePasswordModal.value = false
  } catch (e) {
    alert('Failed to change password.')
  } finally {
    loading.value = false
  }
}

const infoCards = [
  { label: 'Username', key: 'username', icon: 'mdi mdi-account-circle', iconColor: 'text-green-500' },
  { label: 'Email', key: 'email', icon: 'mdi mdi-email', iconColor: 'text-blue-500' },
  { label: 'Role', key: 'role', iconColor: 'text-purple-500', icon: 'mdi mdi-account-key' },
  { label: 'Status', key: 'status', icon: 'mdi mdi-checkbox-marked-circle-outline', iconColor: 'text-green-600' },
  { label: 'Payment Status', key: 'payment_status', icon: 'mdi mdi-currency-usd', iconColor: 'text-yellow-500' },
  { label: 'Email Verified', key: 'email_verified', icon: 'mdi mdi-email-check-outline', iconColor: 'text-indigo-500' },
  { label: 'Last Login', key: 'last_login', icon: 'mdi mdi-clock-outline', iconColor: 'text-gray-500' },
  { label: 'Phone', key: 'phone_number', icon: 'mdi mdi-phone-outline', iconColor: 'text-indigo-500' },
]
</script>
