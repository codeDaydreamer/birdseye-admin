// stores/pricing.js
import { defineStore } from 'pinia'
import { useApi } from '~/composables/useApi'

// Plans, promo codes and trial/billing settings: everything that controls Birdseye's pricing
export const usePricingStore = defineStore('pricing', {
  state: () => ({
    plans: [],
    features: [], // catalogue of features a plan can include: [{ key, label, description }]
    promoCodes: [],
    settings: null,
    loading: false,
    error: null,
  }),

  actions: {
    errorMessage(error, fallback) {
      return error.response?.data?.error || error.message || fallback
    },

    async loadAll() {
      this.loading = true
      this.error = null
      try {
        const api = useApi()
        const [plans, features, promos, settings] = await Promise.all([
          api.get('/admin/plans'),
          api.get('/admin/plan-features'),
          api.get('/admin/promo-codes'),
          api.get('/admin/settings'),
        ])
        this.plans = plans.data.plans || []
        this.features = features.data.features || []
        this.promoCodes = promos.data.promo_codes || []
        this.settings = settings.data
      } catch (error) {
        this.error = this.errorMessage(error, 'Failed to load pricing')
      } finally {
        this.loading = false
      }
    },

    // Creates the plan, or updates it when it has an id. Returns an error message or null.
    async savePlan(plan) {
      try {
        const api = useApi()
        if (plan.id) await api.put(`/admin/plans/${plan.id}`, plan)
        else await api.post('/admin/plans', plan)
        const res = await api.get('/admin/plans')
        this.plans = res.data.plans || []
        return null
      } catch (error) {
        return this.errorMessage(error, 'Failed to save plan')
      }
    },

    async deletePlan(id) {
      try {
        const api = useApi()
        const res = await api.delete(`/admin/plans/${id}`)
        const plans = await api.get('/admin/plans')
        this.plans = plans.data.plans || []
        return { message: res.data.message }
      } catch (error) {
        return { error: this.errorMessage(error, 'Failed to delete plan') }
      }
    },

    async savePromoCode(promo) {
      try {
        const api = useApi()
        if (promo.id) await api.put(`/admin/promo-codes/${promo.id}`, promo)
        else await api.post('/admin/promo-codes', promo)
        const res = await api.get('/admin/promo-codes')
        this.promoCodes = res.data.promo_codes || []
        return null
      } catch (error) {
        return this.errorMessage(error, 'Failed to save promo code')
      }
    },

    async saveSettings(settings) {
      try {
        const api = useApi()
        const res = await api.put('/admin/settings', settings)
        this.settings = res.data
        return null
      } catch (error) {
        return this.errorMessage(error, 'Failed to save settings')
      }
    },

    // Extends a farm's trial and/or moves it to another plan
    async updateFarmBilling(farmId, changes) {
      try {
        const api = useApi()
        await api.put(`/admin/farms/${farmId}/billing`, changes)
        return null
      } catch (error) {
        return this.errorMessage(error, 'Failed to update farm')
      }
    },
  },
})
