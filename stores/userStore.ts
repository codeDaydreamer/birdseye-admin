import { defineStore } from 'pinia'

export interface ActivityLogEntry {
  message: string
  timestamp: string // ISO format
}

export interface User {
  id: string
  name: string
  email: string
  contact: string
  profilePicture: string
  role: 'admin' | 'moderator' | 'user'
  subscription: {
    plan: 'free' | 'pro' | 'enterprise'
    startDate: string
  }
  billing_info: {
    billingEmail: string
    billingPhone: string
    billingAddress: string
    paymentMethod: string
  }
  status: 'active' | 'inactive'
  lastLogin: string
  activityLog: ActivityLogEntry[]
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
    getUserById: (state) => {
      return (id: string) => state.users.find(user => user.id === id)
    }
  },

  actions: {
    loadUsers() {
      this.users = [
        {
          id: '1',
          name: 'Jane Doe',
          email: 'jane@example.com',
          contact: '+254700000001',
          profilePicture: 'https://i.pravatar.cc/150?img=1',
          role: 'admin',
          subscription: {
            plan: 'enterprise',
            startDate: '2025-03-01',
          },
          billing_info: {
            billingEmail: 'jane.billing@example.com',
            billingPhone: '+254700000001',
            billingAddress: 'Nairobi, Kenya',
            paymentMethod: 'Visa **** 1234',
          },
          status: 'active',
          lastLogin: '2025-05-06T14:23:00Z',
          activityLog: [
            { message: 'Logged in', timestamp: '2025-05-06T14:23:00Z' },
            { message: 'Updated profile', timestamp: '2025-05-05T12:00:00Z' },
          ],
          subscriptionHistory: [
            'Subscribed to Pro Plan - Jan 2025',
            'Upgraded to Enterprise on Mar 2025',
          ],
        },
        {
          id: '2',
          name: 'John Smith',
          email: 'john@example.com',
          contact: '+254700000002',
          profilePicture: 'https://i.pravatar.cc/150?img=2',
          role: 'user',
          subscription: {
            plan: 'pro',
            startDate: '2025-01-15',
          },
          billing_info: {
            billingEmail: 'john.billing@example.com',
            billingPhone: '+254700000002',
            billingAddress: 'Nakuru, Kenya',
            paymentMethod: 'MasterCard **** 5678',
          },
          status: 'inactive',
          lastLogin: '2025-05-05T09:00:00Z',
          activityLog: [
            { message: 'Logged in', timestamp: '2025-05-05T09:00:00Z' },
            { message: 'Viewed dashboard', timestamp: '2025-05-04T16:30:00Z' },
          ],
          subscriptionHistory: [
            'Pro plan since Jan 2025',
          ],
        },
        {
          id: '3',
          name: 'Alice Johnson',
          email: 'alice@example.com',
          contact: '+254700000003',
          profilePicture: 'https://i.pravatar.cc/150?img=3',
          role: 'moderator',
          subscription: {
            plan: 'free',
            startDate: '2025-02-20',
          },
          billing_info: {
            billingEmail: 'alice.billing@example.com',
            billingPhone: '+254700000003',
            billingAddress: 'Mombasa, Kenya',
            paymentMethod: 'MPESA',
          },
          status: 'active',
          lastLogin: '2025-05-07T08:10:00Z',
          activityLog: [
            { message: 'Logged in', timestamp: '2025-05-07T08:10:00Z' },
            { message: 'Changed password', timestamp: '2025-05-06T11:45:00Z' },
          ],
          subscriptionHistory: ['Free plan since Feb 2025'],
        },
        // ... Add users 4 and 5 in the same structure
      ]
    },
  },
})
