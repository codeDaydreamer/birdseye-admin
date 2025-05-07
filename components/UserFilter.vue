<template>
    <div class="flex flex-wrap gap-4 mb-4">
      <select v-model="filters.role" class="select select-sm">
        <option value="">All Roles</option>
        <option value="admin">Admin</option>
        <option value="user">User</option>
      </select>
      <select v-model="filters.subscription" class="select select-sm">
        <option value="">All Subscriptions</option>
        <option value="free">Free</option>
        <option value="premium">Premium</option>
      </select>
      <select v-model="filters.status" class="select select-sm">
        <option value="">All Statuses</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
    </div>
  </template>
  
  <script setup>
  const props = defineProps(['filters']);
  </script>