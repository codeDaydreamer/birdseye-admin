<template>
  <div class="min-h-screen flex items-center justify-center bg-light-bg dark:bg-dark-bg p-6">
    <div class="w-full max-w-md bg-white dark:bg-dark-bg rounded-lg shadow-md p-8">
      <h2 class="text-2xl font-bold mb-6 text-primary dark:text-secondary text-center">
        {{ isLogin ? 'Admin Login' : 'Admin Registration' }}
      </h2>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div v-if="!isLogin">
          <label class="block mb-1 text-light-text dark:text-light-subtext" for="username">Username</label>
          <input
            v-model="form.username"
            type="text"
            id="username"
            placeholder="Enter username"
            required
            class="w-full px-4 py-2 border border-light-border dark:border-dark-border rounded-md bg-light-input dark:bg-dark-input text-light-text dark:text-light-subtext focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label class="block mb-1 text-light-text dark:text-light-subtext" for="email">Email</label>
          <input
            v-model="form.email"
            type="email"
            id="email"
            placeholder="Enter email"
            required
            class="w-full px-4 py-2 border border-light-border dark:border-dark-border rounded-md bg-light-input dark:bg-dark-input text-light-text dark:text-light-subtext focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label class="block mb-1 text-light-text dark:text-light-subtext" for="password">Password</label>
          <input
            v-model="form.password"
            type="password"
            id="password"
            placeholder="Enter password"
            required
            class="w-full px-4 py-2 border border-light-border dark:border-dark-border rounded-md bg-light-input dark:bg-dark-input text-light-text dark:text-light-subtext focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <button
          :disabled="store.loading"
          type="submit"
          class="w-full py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50"
        >
          {{ isLogin ? 'Login' : 'Register' }}
        </button>

        <p class="text-center text-sm mt-4 text-light-subtext dark:text-dark-subtext cursor-pointer" @click="toggleForm">
          {{ isLogin ? 'No account? Register here' : 'Already have an account? Login' }}
        </p>

        <p v-if="store.error" class="text-danger text-center mt-2">{{ store.error }}</p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useAdminAuthStore } from '~/stores/adminAuth'
import { useRouter } from 'vue-router'

const store = useAdminAuthStore()
const router = useRouter()

const isLogin = ref(true)

const form = reactive({ username: '', email: '', password: '' });

function resetForm() {
  form.username = ''
  form.email = ''
  form.password = ''
}

function toggleForm() {
  isLogin.value = !isLogin.value
  store.error = ''
  resetForm()
}

async function handleSubmit() {
  store.error = ''
  if (isLogin.value) {
    await store.loginAdmin({ identifier: form.email, password: form.password })
    if (!store.error && store.admin && store.token) {
      // Successful login — redirect to home
      router.push('/')
    }
  } else {
    await store.registerAdmin({ username: form.username, email: form.email, password: form.password })
    if (!store.error) {
      // After registration, revert back to login form
      isLogin.value = true
      resetForm()
    }
  }
}
</script>

