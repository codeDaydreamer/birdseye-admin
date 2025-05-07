import { defineStore } from 'pinia'

export interface User {
    id: string
    name: string
    email: string
    role: 'admin' | 'moderator' | 'user'
    subscription: 'free' | 'pro' | 'enterprise'
    status: 'active' | 'inactive'
    lastLogin: string // ISO format or readable date string
    activityLog: string[]
    subscriptionHistory: string[]
  }
  

export const useUsersStore = defineStore('users', {
  state: () => ({
    users: [] as User[],
  }),

  getters: {
    activeUsers(state): User[] {
      return state.users.filter(user => user.status === 'active')
    },
  },

  actions: {
    loadUsers() {
      this.users = [
        {
          id: '1',
          name: 'Jane Doe',
          email: 'jane@example.com',
          role: 'admin',
          subscription: 'enterprise',
          status: 'active',
          lastLogin: '2025-05-06T14:23:00Z',
          activityLog: ['Logged in on Monday', 'Updated profile on Tuesday'],
subscriptionHistory: ['Pro plan since Jan 2025', 'Upgraded to Enterprise on Mar 2025'],

        },
        {
          id: '2',
          name: 'John Smith',
          email: 'john@example.com',
          role: 'user',
          subscription: 'pro',
          status: 'inactive',
          lastLogin: '2025-05-05T09:00:00Z',
          activityLog: ['Logged in on Monday', 'Updated profile on Tuesday'],
subscriptionHistory: ['Pro plan since Jan 2025', 'Upgraded to Enterprise on Mar 2025'],

        },
        {
          id: '3',
          name: 'Alice Johnson',
          email: 'alice@example.com',
          role: 'moderator',
          subscription: 'free',
          status: 'active',
          lastLogin: '2025-05-07T08:10:00Z',
          activityLog: ['Logged in on Monday', 'Updated profile on Tuesday'],
subscriptionHistory: ['Pro plan since Jan 2025', 'Upgraded to Enterprise on Mar 2025'],

        },
        {
          id: '4',
          name: 'Bob Lee',
          email: 'bob@example.com',
          role: 'user',
          subscription: 'pro',
          status: 'active',
          lastLogin: '2025-05-06T17:45:00Z',
          activityLog: ['Logged in on Monday', 'Updated profile on Tuesday'],
subscriptionHistory: ['Pro plan since Jan 2025', 'Upgraded to Enterprise on Mar 2025'],

        },
        {
          id: '5',
          name: 'Emily Chen',
          email: 'emily@example.com',
          role: 'user',
          subscription: 'free',
          status: 'inactive',
          lastLogin: '2025-05-04T11:30:00Z',
          activityLog: ['Logged in on Monday', 'Updated profile on Tuesday'],
subscriptionHistory: ['Pro plan since Jan 2025', 'Upgraded to Enterprise on Mar 2025'],

        },
      ]
    },
  },
})
