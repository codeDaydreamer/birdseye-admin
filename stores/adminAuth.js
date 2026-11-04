import { defineStore } from 'pinia'
import { useApi } from '~/composables/useApi'

export const useAdminAuthStore = defineStore('adminAuth', {
  state: () => ({
    admin: null,
    token: '',
    loading: false,
    error: '',
    router: null,        // store router instance here
  }),

  actions: {
    initRouter(router) {
      this.router = router
    },

    // signIn keeps a token from setup, invite acceptance or login and opens the console
    signIn(res) {
      this.token = res.data.token || ''
      this.admin = res.data.admin || null
      if (process.client) localStorage.setItem('token', this.token)
      if (this.router) this.router.push('/')
    },

    async setupStatus() {
      try {
        const res = await useApi().get('/auth/admin/status')
        return !!res.data.setup_required
      } catch {
        return false
      }
    },

    // Creates the first admin; only works while the console has no admins
    async setupFirstAdmin(data) {
      this.loading = true
      this.error = ''
      try {
        this.signIn(await useApi().post('/auth/admin/register', data))
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
