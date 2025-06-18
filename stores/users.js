// stores/users.js
import { defineStore } from 'pinia'
import { useApi } from '~/composables/useApi'

export const useUsersStore = defineStore('users', {
  state: () => ({
    users: [],
    loading: false,
    error: null,
  }),

  getters: {
    activeUsers(state) {
      return state.users.filter(user => user.status === 'active')
    },
    getUserById: (state) => {
      return (id) => state.users.find(user => user.id === id)
    },
  },

  actions: {
    async loadUsers() {
      this.loading = true
      try {
        const api = useApi()
        const response = await api.get('/admin/users')

        console.log('Raw user data from API:', response.data.users)

        // Normalize structure
        this.users = response.data.users.map(user => ({
          ...user,
          subscription: user.subscription || {},  // singular
          billing_info: user.billing_info || {},  // already correct
        }))

        console.log('Mapped users in store:', this.users)
      } catch (error) {
        console.error('Failed to load users:', error)
        this.error = error.response?.data?.error || error.message
      } finally {
        this.loading = false
      }
    },

    async createUser(payload) {
      this.loading = true
      try {
        const api = useApi()
        const response = await api.post('/auth/register', payload)
        this.users.push(response.data.user)
        return response.data.user
      } catch (error) {
        console.error('Create user error:', error)
        this.error = error.response?.data?.error || error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateUser(id, updateData) {
      this.loading = true
      try {
        const api = useApi()
        const response = await api.put(`/admin/user/${id}`, updateData)
        const index = this.users.findIndex(user => user.id === id)
        if (index !== -1) {
          this.users[index] = response.data.user
        }
        return response.data.user
      } catch (error) {
        console.error('Update user error:', error)
        this.error = error.response?.data?.error || error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteUser(id) {
      this.loading = true
      try {
        const api = useApi()
        await api.delete(`/admin/user/${id}`)
        this.users = this.users.filter(user => user.id !== id)
      } catch (error) {
        console.error('Delete user error:', error)
        this.error = error.response?.data?.error || error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async getUserByIdFromServer(id) {
      this.loading = true
      try {
        const api = useApi()
        const response = await api.get(`/admin/user/${id}`)
        return response.data.user
      } catch (error) {
        console.error('Fetch user by ID error:', error)
        this.error = error.response?.data?.error || error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // New action for Admin to reset a user's password
    async adminResetUserPassword(id, newPassword) {
      this.loading = true
      try {
        const api = useApi()
        await api.put(`/admin/user/${id}/reset-password`, { new_password: newPassword })
        // Optionally you can update the user locally or refetch user data here
        // e.g., await this.getUserByIdFromServer(id) to refresh user info
      } catch (error) {
        console.error('Admin reset user password error:', error)
        this.error = error.response?.data?.error || error.message
        throw error
      } finally {
        this.loading = false
      }
    },
  },
})
