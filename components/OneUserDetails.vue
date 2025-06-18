<template>
  <div class="p-6 space-y-10 bg-light-bg dark:bg-dark-bg rounded-xl shadow-xl">
    <!-- Profile Picture & Header -->
    <div class="flex flex-col items-center space-y-2">
      <img
        :src="user.profile_picture"
        alt="Profile Picture"
        class="w-24 h-24 rounded-full border-4 border-light-accent dark:border-dark-accent shadow-lg"
      />
      <h2 class="text-3xl font-bold text-light-text dark:text-dark-text">User Details</h2>
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
                  {{ user.status.charAt(0).toUpperCase() + user.status.slice(1) }}
                </span>
              </template>
              <template v-else-if="item.key.startsWith('subscription.')">
                {{ getNested(user, item.key) || 'N/A' }}
              </template>
              <template v-else>
                {{ user[item.key] }}
              </template>
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Billing Info -->
    <div>
      <h3 class="text-xl font-semibold text-light-text dark:text-dark-text text-center mb-4">Billing Information</h3>
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="(value, label) in user.billing_info"
          :key="label"
          class="bg-light-accent/20 dark:bg-dark-accent/40 p-4 rounded-xl"
        >
          <p class="text-xs text-light-subtext dark:text-dark-subtext uppercase">{{ formatLabel(label) }}</p>
          <p class="font-semibold text-light-text dark:text-dark-text break-all">{{ value || 'N/A' }}</p>
        </div>
      </div>
    </div>

    <!-- Actions -->
<div class="flex justify-center flex-wrap gap-4 pt-6">
  <button
    class="btn btn-lg hover:scale-105 p-3 rounded-lg"
    :class="[
      user.status === 'suspended' 
        ? 'bg-green-600 dark:bg-green-700 text-white'  // Reactivate: green
        : 'bg-yellow-500 dark:bg-yellow-600 text-white' // Suspend: yellow
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
import { ref, watch } from 'vue'
import { useUsersStore } from '~/stores/users'
import ChangePasswordModal from '~/components/ChangePasswordModal.vue'

const props = defineProps({
  user: {
    type: Object,
    required: true
  }
})

const store = useUsersStore()
const loading = ref(false)
const showChangePasswordModal = ref(false)

function getNested(obj, keyPath) {
  return keyPath.split('.').reduce((o, k) => (o && o[k] !== undefined) ? o[k] : null, obj)
}

function formatLabel(label) {
  return label.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

async function toggleSuspendUser() {
  loading.value = true
  const newStatus = props.user.status === 'suspended' ? 'active' : 'suspended'
  try {
    await store.updateUser(props.user.id, { status: newStatus })
    alert(`User ${newStatus === 'active' ? 'reactivated' : 'suspended'} successfully.`)
  } catch (e) {
    alert('Failed to update user status.')
    console.error(e)
  } finally {
    loading.value = false
  }
}

async function deleteUserConfirm() {
  if (confirm('Are you sure you want to permanently delete this user?')) {
    loading.value = true
    try {
      await store.deleteUser(props.user.id)
      alert('User deleted successfully.')
      // Optionally, emit event to parent
    } catch (e) {
      alert('Failed to delete user.')
      console.error(e)
    } finally {
      loading.value = false
    }
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
    console.error(e)
  } finally {
    loading.value = false
  }
}

const infoCards = [
  {
    label: 'Username',
    key: 'username',
    icon: 'mdi mdi-account-circle',
    iconColor: 'text-green-500',
  },
  {
    label: 'Email',
    key: 'email',
    icon: 'mdi mdi-email',
    iconColor: 'text-blue-500',
  },
  {
    label: 'Role',
    key: 'role',
    icon: 'mdi mdi-account-key',
    iconColor: 'text-purple-500',
  },
  {
    label: 'Status',
    key: 'status',
    icon: 'mdi mdi-checkbox-marked-circle-outline',
    iconColor: 'text-green-600',
  },
  {
    label: 'Subscription Plan',
    key: 'subscription.plan',
    icon: 'mdi mdi-currency-usd',
    iconColor: 'text-yellow-500',
  },
  {
    label: 'Last Login',
    key: 'last_login',
    icon: 'mdi mdi-clock-outline',
    iconColor: 'text-gray-500',
  },
  {
    label: 'Contact',
    key: 'contact',
    icon: 'mdi mdi-phone-outline',
    iconColor: 'text-indigo-500',
  },
]
</script>
