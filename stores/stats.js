import { defineStore } from 'pinia'
import { useApi } from '~/composables/useApi'

export const useStatsStore = defineStore('stats', {
  state: () => ({
    stats: [],
    statsDailyLoginTrend: [],  // <-- added for daily login trend from backend
    loading: false,
    error: '',
  }),
  actions: {
  async fetchStats() {
    this.loading = true
    this.error = ''
    try {
      const api = useApi()
      const res = await api.get('/admin/stats')

      
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

      // Store the daily login trend data directly
      this.statsDailyLoginTrend = (res.data.daily_login_trend || []).map(item => ({
  date: item.date || item.Date || '',
  count: Number(item.count ?? item.Count ?? 0),
}))


     



    } catch (err) {
      this.error = err.response?.data?.error || err.message
    } finally {
      this.loading = false
    }
  },
},


})
