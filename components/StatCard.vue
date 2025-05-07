<template>
    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div
        v-for="stat in stats"
        :key="stat.title"
        class="card rounded-2xl shadow-md transition-all duration-300 bg-accent/20 hover:scale-[1.015]"
      >
        <div class="card-body flex items-center space-x-4 px-5 py-4 bg-light-accent dark:bg-dark-accent">
          <!-- Icon Section with increased size -->
          <div
            class="w-16 h-16 flex items-center justify-center rounded-full bg-base-100 text-3xl dark:bg-dark-accent"
          >
            <i :class="[stat.icon, stat.iconColor]"></i>
          </div>
  
          <!-- Text Section -->
          <div class="flex flex-col">
            <span class="text-sm font-medium text-light-subtext dark:text-dark-subtext tracking-wide uppercase">
              {{ stat.title }}
            </span>
            <span class="text-2xl font-extrabold text-light-text dark:text-dark-text leading-tight">
              {{ stat.value }}
            </span>
            <!-- Display change only if it exists -->
            <span
              v-if="stat.change"
              :class="[
                'text-sm mt-1',
                stat.trend === 'up' ? 'text-success' : stat.trend === 'down' ? 'text-danger' : 'text-light-subtext'
              ]"
            >
              {{ stat.change }}
            </span>
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <script setup lang="ts">
  interface StatItem {
    title: string
    value: string | number
    change?: string
    trend?: 'up' | 'down' | null
    icon: string
    iconColor?: string
  }
  
  const stats: StatItem[] = [
    {
      title: 'Total Users',
      value: '1,248',
      change: '+5.2%',
      trend: 'up',
      icon: 'mdi mdi-account-group',
      iconColor: 'text-primary',
    },
    {
      title: 'Active Today',
      value: '132',
      change: '-3.1%',
      trend: 'down',
      icon: 'mdi mdi-account-check',
      iconColor: 'text-success',
    },
    {
      title: 'New Signups',
      value: '34',
      change: '+8.0%',
      trend: 'up',
      icon: 'mdi mdi-account-plus',
      iconColor: 'text-info',
    },
    {
      title: 'Active Subscriptions',
      value: '589',
      change: '+8.0%',
      trend: 'up',
      icon: 'mdi mdi-star-circle',
      iconColor: 'text-warning',
    },
  ]
  </script>
  