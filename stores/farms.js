// stores/farms.js
import { defineStore } from 'pinia'
import { useApi } from '~/composables/useApi'

// Farms (the tenants) with their owner, staff count and billing status, from GET /admin/farms
export const useFarmsStore = defineStore('farms', {
  state: () => ({
    farms: [],
    loading: false,
    error: null,
  }),

  getters: {
    totalFarms: (state) => state.farms.length,
    payingFarms: (state) => state.farms.filter(f => f.payment_status === 'paid').length,
    trialFarms: (state) => state.farms.filter(f => f.payment_status === 'trial').length,
    newFarmsThisWeek: (state) => {
      const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
      return state.farms.filter(f => new Date(f.created_at).getTime() >= weekAgo).length
    },
  },

  actions: {
    async loadFarms() {
      this.loading = true
      try {
        const api = useApi()
        const response = await api.get('/admin/farms')
        this.farms = response.data.farms || []
      } catch (error) {
        console.error('Failed to load farms:', error)
        this.error = error.response?.data?.error || error.message
      } finally {
        this.loading = false
      }
    },
  },
})
