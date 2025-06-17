// stores/users.js or similar
export const useUsersStore = defineStore('users', {
  state: () => ({
    users: [],
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
      try {
        const api = useApi()
        // <-- Change to '/admin/users' to match backend route
        const response = await api.get('/admin/users')
        this.users = response.data.users  // response has { users: [...] }
      } catch (error) {
        console.error('Failed to load users:', error)
      }
    },
  },
})
