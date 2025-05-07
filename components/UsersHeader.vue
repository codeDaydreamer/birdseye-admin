<template>
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 px-4 bg-light-accent dark:bg-dark-accent p-3">
      <!-- Title and Description -->
      <div>
        <h1 class="text-2xl font-semibold text-primary dark:text-dark-text flex items-center space-x-2">
          <i class="mdi mdi-account-group text-xl"></i>
          <span>Users</span>
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage registered users, assign roles, and track user activity.
        </p>
      </div>
  
      <!-- Add User Button -->
      <button
        class="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-light-accent text-white dark:bg-dark-bg rounded-lg shadow hover:bg-primary/90 transition"
        @click="onAddUser"
      >
        <i class="mdi mdi-account-plus mr-2"></i>
        <span>Add User</span>
      </button>
    </div>
  </template>
  
  <script setup>
  const onAddUser = () => {
    // Emit an event or navigate to user creation form
    console.log('Add User clicked');
  };
  </script>
  