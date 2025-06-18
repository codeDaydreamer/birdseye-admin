import { defineStore } from 'pinia'
import { useApi } from '~/composables/useApi'
import { useAdminAuthStore } from './adminAuth'

export const useStatsStore = defineStore('stats', {
  state: () => ({
    stats: [],
    statsDailyLoginTrend: [],
    loading: false,
    error: '',
  }),

  actions: {
    async fetchStats() {
      const authStore = useAdminAuthStore()

      if (!authStore.token) {
        console.warn('[DEBUG] Token not available yet, skipping stats fetch')
        return
      }

      this.loading = true
      this.error = ''

      try {
        const api = useApi()
        console.debug('[DEBUG] fetchStats() - About to make request')
        const res = await api.get('/admin/stats')
        console.debug('[DEBUG] fetchStats() - Response received:', res.data)

        this.stats = [
          {
            title: 'Total Users',
            value: res.data.total_users,
            icon: 'mdi mdi-account-group',
            iconColor: 'text-primary',
          },
          {
            title: 'Active Today',
            value: res.data.active_today,
            icon: 'mdi mdi-account-check',
            iconColor: 'text-success',
          },
          {
            title: 'New Signups',
            value: res.data.new_signups,
            icon: 'mdi mdi-account-plus',
            iconColor: 'text-info',
          },
          {
            title: 'Active Subscriptions',
            value: res.data.active_subscriptions,
            icon: 'mdi mdi-star-circle',
            iconColor: 'text-warning',
          },
        ]

        this.statsDailyLoginTrend = (res.data.daily_login_trend || []).map(item => ({
          date: item.date || item.Date || '',
          count: Number(item.count ?? item.Count ?? 0),
        }))

      } catch (err) {
        // Special handling for interceptor error when no token is available
        if (err.message === 'No auth token available') {
          console.warn('[DEBUG] fetchStats skipped: no auth token available')
          // Don't set this.error, it's expected and not a real error for UI
        } else {
          console.error('[ERROR] fetchStats failed:', err)
          this.error = err.response?.data?.error || err.message || 'Unknown error'
        }
      } finally {
        this.loading = false
      }
    },
  },
})
