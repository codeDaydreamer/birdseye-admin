<template>
  <ul class="divide-y divide-light-border/30 dark:divide-dark-border">
    <li v-for="(a, i) in items" :key="i" class="flex items-start gap-3 py-2.5 text-sm">
      <span :class="['mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full', style(a).bg]"><i :class="['mdi', style(a).icon]"></i></span>
      <div class="min-w-0 flex-1">
        <p>
          <NuxtLink v-if="a.farm_id" :to="`/farms/${a.farm_id}`" class="hover:underline">{{ a.text }}</NuxtLink>
          <NuxtLink v-else-if="a.user_id" :to="`/user/${a.user_id}`" class="hover:underline">{{ a.text }}</NuxtLink>
          <span v-else>{{ a.text }}</span>
          <span v-if="a.amount" class="font-semibold"> · {{ kes(a.amount) }}</span>
        </p>
        <p class="text-xs text-light-subtext dark:text-dark-subtext">{{ ago(a.at) }}</p>
      </div>
    </li>
    <li v-if="!items.length" class="py-3 text-sm text-light-subtext dark:text-dark-subtext">Nothing yet.</li>
  </ul>
</template>

<script setup>
import { kes, ago } from '~/composables/format'
defineProps({ items: { type: Array, default: () => [] } })
const style = (a) =>
  ({
    signup: { icon: 'mdi-account-plus', bg: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300' },
    farm: { icon: 'mdi-barn', bg: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' },
    staff: { icon: 'mdi-account-group', bg: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300' },
    batch: { icon: 'mdi-bird', bg: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300' },
    payment: a.status === 'success'
      ? { icon: 'mdi-cash-check', bg: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' }
      : a.status === 'refunded'
        ? { icon: 'mdi-cash-refund', bg: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300' }
        : { icon: 'mdi-cash-remove', bg: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300' },
  }[a.kind] || { icon: 'mdi-circle-small', bg: 'bg-gray-100 dark:bg-gray-800' })
</script>
