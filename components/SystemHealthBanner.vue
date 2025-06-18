<template>
  <div
    :class="[
      'w-full flex items-center justify-between px-6 py-3 shadow-sm',
      systemStatusClass,
    ]"
  >
    <div class="flex items-start flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-3">
      <div class="flex items-center space-x-2">
        <i :class="statusIcon" class="text-white text-2xl"></i>
        <div>
          <span class="text-white font-medium text-base">
            {{ systemStatusMessage }}
          </span>
        </div>
      </div>

      <div class="text-white text-xs flex flex-col sm:flex-row sm:space-x-2">
        <span v-if="!dbConnected">⚠️ Database not connected</span>
        <span v-if="!googleReady">⚠️ Google Auth not configured</span>
      </div>
    </div>

    <span class="text-white text-sm">
      {{ uptime }}
    </span>
  </div>
</template>

<script setup>
import { ref, onMounted, watchEffect } from 'vue'
import { useApi } from '~/composables/useApi'

const systemStatus = ref('offline') // 'offline' | 'degraded' | 'online'
const statusIcon = ref('mdi mdi-alert-circle')
const systemStatusMessage = ref('Checking system status...')
const uptime = ref('Checking uptime...')
const dbConnected = ref(false)
const googleReady = ref(false)

let interval = null

const fetchSystemStatus = async () => {
  const api = useApi()

  try {
    const { data } = await api.get('/ping')

    dbConnected.value = data.database?.connected ?? false
    googleReady.value = !!data.googleClientID

    if (data.status === 'ok') {
      if (dbConnected.value) {
        systemStatus.value = 'online'
        statusIcon.value = 'mdi mdi-check-circle'
        systemStatusMessage.value = 'System is Online'
      } else {
        systemStatus.value = 'degraded'
        statusIcon.value = 'mdi mdi-alert'
        systemStatusMessage.value = 'System Online - DB Disconnected'
      }
    } else {
      systemStatus.value = 'offline'
      statusIcon.value = 'mdi mdi-alert-circle-outline'
      systemStatusMessage.value = 'System is Unhealthy'
    }

    uptime.value = `Uptime: ${data.uptime || 'Unknown'}`
  } catch (error) {
    systemStatus.value = 'offline'
    statusIcon.value = 'mdi mdi-alert-circle'
    systemStatusMessage.value = 'System is Offline'
    uptime.value = 'Uptime: N/A'
    dbConnected.value = false
    googleReady.value = false
    console.error('Health check failed:', error)
  }
}

const systemStatusClass = computed(() => {
  switch (systemStatus.value) {
    case 'online':
      return 'bg-green-600'
    case 'degraded':
      return 'bg-yellow-500'
    default:
      return 'bg-red-600'
  }
})

onMounted(() => {
  fetchSystemStatus()

  interval = setInterval(() => {
    if (systemStatus.value !== 'online') {
      fetchSystemStatus()
    }
  }, 2000)
})

onUnmounted(() => {
  if (interval) {
    clearInterval(interval)
  }
})
</script>
