import axios from 'axios'
import { useRuntimeConfig } from '#app'

export function useApi() {
  const config = useRuntimeConfig()

  const api = axios.create({ 
    baseURL: config.public.apiBaseURL,
    headers: { 'Content-Type': 'application/json' }
  })

  api.interceptors.request.use((config) => {
    if (process.client) { // avoid accessing localStorage during SSR
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  })

  return api
}
// This composable creates an Axios instance with a base URL and sets up an interceptor to add the Authorization header with the token from localStorage.