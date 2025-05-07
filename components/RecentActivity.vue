<template>
    <div class="bg-light-accent dark:bg-dark-accent mt-6 p-4 rounded-2xl shadow-md">
      <h3 class="text-lg font-bold text-base-content dark:text-dark-content">Recent Activity</h3>
      <ul class="mt-3">
        <li
          v-for="(activity, index) in activities"
          :key="index"
          class="flex items-center space-x-2 border-b border-base-border dark:border-dark-border py-2"
        >
          <i :class="activity.icon" class="text-xl text-primary"></i>
          <span class="text-sm text-light-subtext dark:text-dark-subtext">{{ activity.message }}</span>
          <span class="ml-auto text-xs text-light-subtext dark:text-dark-subtext">{{ activity.timestamp }}</span>
        </li>
      </ul>
    </div>
  </template>
  
  <script setup lang="ts">
  interface Activity {
    icon: string
    message: string
    timestamp: string
  }
  
  const activities: Activity[] = [
    {
      icon: 'mdi mdi-login',
      message: 'User John Doe logged in',
      timestamp: '10:45 AM',
    },
    {
      icon: 'mdi mdi-account-cog',
      message: 'Admin updated user profile',
      timestamp: '9:30 AM',
    },
    {
      icon: 'mdi mdi-plus-circle',
      message: 'New user registration',
      timestamp: 'Yesterday',
    },
    {
      icon: 'mdi mdi-cogs',
      message: 'Admin changed system settings',
      timestamp: 'Last week',
    },
  ]
  </script>
  