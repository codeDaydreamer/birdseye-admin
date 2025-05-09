<template>
    <div class="p-6 space-y-10 bg-light-bg dark:bg-dark-bg rounded-xl shadow-xl">
      <!-- Profile Picture & Header -->
      <div class="flex flex-col items-center space-y-2">
        <img
          :src="user.profilePicture"
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
                <template v-if="item.key === 'lastLogin'">
                  {{ new Date(user.lastLogin).toLocaleString() }}
                </template>
                <template v-else-if="item.key === 'status'">
                  <span
                    :class="[
                      'badge text-white font-semibold',
                      user.status === 'active' ? 'badge-success' : 'badge-error'
                    ]"
                  >
                    {{ user.status }}
                  </span>
                </template>
                <template v-else-if="item.key === 'subscription.plan'">
  {{ user.subscription?.plan || 'N/A' }}
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
            <p class="text-xs text-light-subtext dark:text-dark-subtext uppercase">{{ label }}</p>
            <p class="font-semibold text-light-text dark:text-dark-text break-all">{{ value }}</p>
          </div>
        </div>
      </div>
  
      <!-- Activity Log -->
      <div>
        <h3 class="text-xl font-semibold text-light-text dark:text-dark-text text-center mb-4">Activity Log</h3>
        <ul class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <li
            v-for="(log, index) in showAllLogs ? user.activityLog : user.activityLog.slice(0, 3)"
            :key="'log-' + index"
            class="flex items-start gap-3 p-4 rounded-lg bg-light-bg/30 dark:bg-dark-accent/50 shadow hover:scale-[1.01]"
          >
            <i class="mdi mdi-check-circle-outline text-primary text-xl mt-1"></i>
            <div>
              <p class="text-sm text-light-text dark:text-dark-text">{{ log.message }}</p>
              <p class="text-xs text-light-subtext dark:text-dark-subtext">{{ new Date(log.timestamp).toLocaleString() }}</p>
            </div>
          </li>
        </ul>
        <div class="flex justify-center pt-2">
          <button class="btn btn-link text-sm" @click="showAllLogs = !showAllLogs">
            {{ showAllLogs ? 'Show Less' : 'View All' }}
          </button>
        </div>
      </div>
  
      <!-- Subscription History -->
      <div>
        <h3 class="text-xl font-semibold text-light-text dark:text-dark-text text-center mb-4">Subscription History</h3>
        <ul class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <li
            v-for="(entry, index) in showAllSubs ? user.subscriptionHistory : user.subscriptionHistory.slice(0, 3)"
            :key="'sub-' + index"
            class="flex items-start gap-3 p-4 rounded-lg bg-muted dark:bg-muted/30 shadow hover:scale-[1.01] bg-light-bg/30 dark:bg-dark-accent/50"
          >
            <i class="mdi mdi-calendar-check-outline text-secondary text-xl mt-1"></i>
            <span class="text-sm text-light-text dark:text-dark-text">{{ entry }}</span>
          </li>
        </ul>
        <div class="flex justify-center pt-2">
          <button class="btn btn-link text-sm" @click="showAllSubs = !showAllSubs">
            {{ showAllSubs ? 'Show Less' : 'View All' }}
          </button>
        </div>
      </div>
  
      <!-- Manual Actions -->
      <div class="flex justify-center flex-wrap gap-4 pt-6">
        <button class="btn btn-warning btn-lg hover:scale-105 bg-light-accent dark:bg-dark-accent p-3 rounded-lg">
          <i class="mdi mdi-block text-lg mr-1"></i> Deactivate
        </button>
        <button class="btn btn-info btn-lg hover:scale-105 bg-light-accent dark:bg-dark-accent p-3 rounded-lg">
          <i class="mdi mdi-lock-reset text-lg mr-1"></i> Reset Password
        </button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps({
    user: Object,
  })
  
  const showAllLogs = ref(false)
  const showAllSubs = ref(false)
  
  const infoCards = [
    {
      label: 'Email',
      key: 'email',
      icon: 'mdi mdi-email',
      iconColor: 'text-blue-500',
    },
    {
      label: 'Role',
      key: 'role',
      icon: 'mdi mdi-account-circle',
      iconColor: 'text-green-500',
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
      key: 'lastLogin',
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
  