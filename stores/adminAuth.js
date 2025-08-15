import { defineStore } from 'pinia'
import { useApi } from '~/composables/useApi'

export const useAdminAuthStore = defineStore('adminAuth', {
  state: () => ({
    admin: null,
    token: '',
    loading: false,
    error: '',
    router: null,        // store router instance here
    allowRegistration: false, // <-- NEW FLAG
  }),

  actions: {
    initRouter(router) {
      this.router = router
    },

    enableRegistration() {
      this.allowRegistration = true
    },

    disableRegistration() {
      this.allowRegistration = false
    },

    async registerAdmin(data) {
      if (!this.allowRegistration) {
        this.error = 'Admin registration is disabled'
        return
      }

      this.loading = true
      this.error = ''
      try {
        const api = useApi()
        const res = await api.post('/auth/admin/register', data)
        this.admin = res.data
        // Optionally disable registration after adding an admin
        this.allowRegistration = false
      } catch (err) {
        this.error = err.response?.data?.error || err.message
      } finally {
        this.loading = false
      }
    },

    async loginAdmin(data) {
      this.loading = true
      this.error = ''
      try {
        const api = useApi()
        const res = await api.post('/auth/admin/login', data)

        this.token = res.data.token || ''
        this.admin = res.data.admin || null

        if (process.client) {
          localStorage.setItem('token', this.token)
        }

        if (this.router) {
          this.router.push('/')
        }
      } catch (err) {
        this.error = err.response?.data?.error || err.message
      } finally {
        this.loading = false
      }
    },

    logout() {
      this.admin = null
      this.token = ''
      if (process.client) {
        localStorage.removeItem('token')
        if (this.router) {
          this.router.push('/auth')
        }
      }
    },

    restoreToken() {
      if (process.client) {
        const token = localStorage.getItem('token')
        if (token) {
          this.token = token
          return true
        }
      }
      return false
    },

    async fetchAdmin() {
      if (!this.token) return
      this.loading = true
      this.error = ''
      try {
        const api = useApi()
        const res = await api.get('/admin/me')
        this.admin = res.data
      } catch (err) {
        this.error = err.response?.data?.error || err.message
        this.logout()
      } finally {
        this.loading = false
      }
    },

    async initialize() {
      // Called once when app starts
      const hasToken = this.restoreToken()
      if (hasToken) {
        await this.fetchAdmin()
      }
    }
  },

  getters: {
    isAuthenticated: (state) => !!state.token,
    getAdmin: (state) => state.admin,
    getToken: (state) => state.token,
    canRegister: (state) => state.allowRegistration, // optional getter for easy access
  },
})
