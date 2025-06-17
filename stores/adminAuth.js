import { defineStore } from 'pinia'
import { useApi } from '~/composables/useApi'

export const useAdminAuthStore = defineStore('adminAuth', {
  state: () => ({
    admin: null,
    token: '', // no localStorage usage
    loading: false,
    error: '',
  }),
  actions: {
    // in your Pinia store
async registerAdmin(data) {
  this.loading = true
  this.error = ''
  try {
    const api = useApi()
    // Update the URL:
    const res = await api.post('/auth/admin/register', data)
    this.admin = res.data
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
    // Update the URL:
    const res = await api.post('/auth/admin/login', data)
    this.token = res.data.token
    this.admin = res.data.admin
  } catch (err) {
    this.error = err.response?.data?.error || err.message
  } finally {
    this.loading = false
  }
},

    logout() {
      this.admin = null
      this.token = ''
    },
  },
})
