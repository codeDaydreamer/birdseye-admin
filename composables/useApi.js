import axios from 'axios'
import { useRuntimeConfig } from '#app'
import { useAdminAuthStore } from '~/stores/adminAuth'

export function useApi() {
  const config = useRuntimeConfig()

  const api = axios.create({ 
    baseURL: config.public.apiBaseURL,
    headers: { 'Content-Type': 'application/json' }
  })

  api.interceptors.request.use((config) => {
    const authStore = useAdminAuthStore()
    const token = authStore.token

    // Paths that do NOT require a token
    // Setup, sign-in and invite acceptance work without a token
    if (config.url?.startsWith('/auth/admin/')) {
      return config
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      return config
    } else {
      return Promise.reject(new Error('No auth token available'))
    }
  })

  return api
}
