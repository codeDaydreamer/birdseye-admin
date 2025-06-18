<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminAuthStore } from '~/stores/adminAuth'

const router = useRouter()
const authStore = useAdminAuthStore()

onMounted(async () => {
  // Restore token from localStorage and fetch user info if token exists
  await authStore.initialize()

  // If not authenticated, redirect to /auth
  if (!authStore.isAuthenticated) {
    router.push('/auth')
  }

  const htmlEl = document.documentElement

  const applyTheme = () => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    htmlEl.classList.toggle('dark', prefersDark)
  }

  applyTheme() // Initial run

  // Listen for theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme)
})
</script>
