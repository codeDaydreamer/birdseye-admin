<template>
    <div class="bg-light-accent/20 dark:bg-dark-accent/40 p-6 rounded-xl shadow-lg">
      <h3 class="text-xl font-semibold text-light-text dark:text-dark-text text-center mb-4">User Subscriptions</h3>
      <table class="table-auto w-full">
        <thead>
          <tr>
            <th class="p-3 text-left">Plan</th>
            <th class="p-3 text-left">Start Date</th>
            <th class="p-3 text-left">Status</th>
            <th class="p-3 text-left">Billing Info</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(sub, index) in subscriptions" :key="index">
            <td class="p-3">{{ sub.plan }}</td>
            <td class="p-3">{{ sub.startDate }}</td>
            <td class="p-3">
              <span :class="sub.status === 'Active' ? 'badge badge-success' : 'badge badge-error'">
                {{ sub.status }}
              </span>
            </td>
            <td class="p-3">{{ sub.billingInfo }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps({
    subscriptions: Array
  })
  </script>
  