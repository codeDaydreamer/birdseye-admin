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
import { initTheme } from '~/composables/theme'

const router = useRouter()
const authStore = useAdminAuthStore()

onMounted(async () => {
  initTheme()

  // Restore token from localStorage and fetch user info if token exists
  await authStore.initialize()

  // If not authenticated, go to sign-in (invite links work signed out)
  if (!authStore.isAuthenticated && !router.currentRoute.value.path.startsWith('/invite/')) {
    router.push('/auth')
  }
})
</script>

<style>
/* On phones, keep table cells on one line: tables scroll sideways inside their card instead of wrapping word by word */
@media (max-width: 767px) {
  .overflow-x-auto table th,
  .overflow-x-auto table td { white-space: nowrap; }
}
</style>
