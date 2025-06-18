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
    const openPaths = ['/auth/admin/register', '/auth/admin/login']

    // If the request URL ends with one of these paths, skip token check
    if (openPaths.some(path => config.url?.endsWith(path))) {
      console.debug(`[DEBUG] Axios interceptor - Open path ${config.url}, skipping auth token check.`)
      return config
    }

    console.debug('[DEBUG] Axios interceptor - Token from Pinia:', token)

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      console.debug('[DEBUG] Axios interceptor - Authorization header set:', config.headers.Authorization)
      return config
    } else {
      console.warn('[DEBUG] Axios interceptor - No token found in Pinia! Aborting request.')
      return Promise.reject(new Error('No auth token available'))
    }
  })

  return api
}
