<template>
    <div
      :class="[
        'w-full flex items-center justify-between px-6 py-3 shadow-sm',
        systemStatus === 'online' ? 'bg-green-600' : 'bg-red-600',
      ]"
    >
      <div class="flex items-center space-x-3">
        <i :class="statusIcon" class="text-white text-2xl"></i>
        <span class="text-white font-medium text-base">
          {{ systemStatusMessage }}
        </span>
      </div>
  
      <span class="text-white text-sm">
        {{ uptime }}
      </span>
    </div>
  </template>
  
  <script setup lang="ts">
  const systemStatus: 'online' | 'offline' = 'online' // Can be 'online' or 'offline'
  const statusIcon: string = systemStatus === 'online' ? 'mdi mdi-check-circle' : 'mdi mdi-alert-circle'
  const systemStatusMessage: string = systemStatus === 'online' ? 'System is Online' : 'System is Offline'
  const uptime: string = 'Uptime: 24 hours'
  </script>
  