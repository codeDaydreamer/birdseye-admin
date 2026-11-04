<script setup>
import { reactive, ref, watch, onMounted } from 'vue'
import { useAdminAuthStore } from '~/stores/adminAuth'
import { useRouter } from 'vue-router'
import { definePageMeta } from '#imports'

// Page meta
definePageMeta({
  layout: 'auth',
  meta: [
    { name: 'description', content: 'Admin console login and registration' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

// Stores & router
const store = useAdminAuthStore()
const router = useRouter()

// State
const isLogin = ref(true)
const showPassword = ref(false)
const showConfirmPassword = ref(false)

// Form data
const form = reactive({
  username: '',
  email: '',
  password: '',
  passwordConfirm: ''
})

// Sync local flag with store
const allowAdminRegistration = ref(store.allowRegistration)

// Keep local ref in sync with store
watch(() => store.allowRegistration, (val) => {
  allowAdminRegistration.value = val
  if (!val && !isLogin.value) {
    isLogin.value = true
  }
})

// Reset form
function resetForm() {
  form.username = ''
  form.email = ''
  form.password = ''
  form.passwordConfirm = ''
  showPassword.value = false
  showConfirmPassword.value = false
  store.error = ''
}

// Toggle login/register view
function toggleForm() {
  if (!allowAdminRegistration.value && !isLogin.value) {
    alert('Admin registration is disabled.')
    return
  }
  isLogin.value = !isLogin.value
  resetForm()
}

// Handle form submit
async function handleSubmit() {
  store.error = ''

  if (!isLogin.value && form.password !== form.passwordConfirm) {
    store.error = 'Passwords do not match'
    return
  }

  try {
    if (isLogin.value) {
      await store.loginAdmin({ identifier: form.email, password: form.password })
      if (!store.error) {
        router.push('/')
      }
    } else {
      if (!allowAdminRegistration.value) {
        store.error = 'Registration is currently disabled'
        return
      }
      await store.registerAdmin({
        username: form.username,
        email: form.email,
        password: form.password
      })
      if (!store.error) {
        isLogin.value = true
        resetForm()
      }
    }
  } catch {
    // Errors are handled in the store
  }
}

// Initialize flag from store when page mounts
onMounted(() => {
  allowAdminRegistration.value = store.allowRegistration
});
</script>


<template>
  <section class="relative min-h-screen flex flex-col justify-center bg-light-bg dark:bg-dark-bg py-10" aria-label="Admin Authentication">
    <div class="absolute right-0 top-4"><ThemeToggle /></div>
    <!-- Brand -->
    <div class="flex flex-col items-center mb-8 text-center">
      <img src="/birdseye-logo.svg" alt="" class="h-14 w-14 mb-4" />
      <h2 class="text-2xl font-semibold tracking-tight text-light-text dark:text-dark-text">Birdseye Admin</h2>
      <p class="mt-1 text-sm text-light-subtext dark:text-dark-subtext" aria-live="polite">{{ isLogin ? 'Sign in to the console' : 'Create an admin account' }}</p>
    </div>

    <!-- Form Container -->
    <div class="w-full max-w-md bg-white dark:bg-gray-900 rounded-lg shadow-lg p-5 sm:p-10 border border-gray-200 dark:border-gray-700">
      <transition name="fade-slide" mode="out-in">
        <form :key="isLogin" @submit.prevent="handleSubmit" autocomplete="on" novalidate class="space-y-6" aria-live="polite">
          <h1 class="text-xl font-semibold text-light-text dark:text-dark-text mb-6">
            {{ isLogin ? 'Admin Login' : 'Admin Registration' }}
          </h1>

          <!-- Registration Fields -->
          <template v-if="!isLogin">
            <div>
              <label for="username" class="block mb-2 font-semibold text-gray-700 dark:text-gray-300">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                v-model="form.username"
                placeholder="Choose a username"
                required
                autocomplete="username"
                spellcheck="false"
                class="w-full rounded-md border border-gray-300 dark:border-gray-600 px-4 py-3 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
          </template>

          <!-- Common Fields -->
          <div>
            <label for="email" class="block mb-2 font-semibold text-gray-700 dark:text-gray-300">Email address</label>
            <input id="email" name="email" type="email" v-model="form.email" placeholder="you@example.com" required autocomplete="email" class="w-full rounded-md border border-gray-300 dark:border-gray-600 px-4 py-3 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" />
          </div>

          <div>
            <label for="password" class="block mb-2 font-semibold text-gray-700 dark:text-gray-300">Password</label>
            <div class="relative">
            <input :type="showPassword ? 'text' : 'password'" id="password" v-model="form.password" placeholder="Enter your password" required minlength="8" class="w-full rounded-md border border-gray-300 dark:border-gray-600 px-4 py-3 pr-10 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" />
            <button type="button" @click="showPassword = !showPassword" class="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600 dark:text-gray-400 hover:text-primary focus:outline-none" tabindex="-1">
              <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.956 9.956 0 012.535-4.665M6.88 6.88A9.956 9.956 0 0112 5c4.477 0 8.268 2.943 9.542 7-.179.57-.426 1.123-.735 1.64m-3.28 3.28L3 3" />
              </svg>
            </button>
            </div>
          </div>

          <div v-if="!isLogin" class="relative">
            <label for="passwordConfirm" class="block mb-2 font-semibold text-gray-700 dark:text-gray-300">Confirm Password</label>
            <input :type="showConfirmPassword ? 'text' : 'password'" id="passwordConfirm" v-model="form.passwordConfirm" placeholder="Confirm your password" required minlength="8" class="w-full rounded-md border border-gray-300 dark:border-gray-600 px-4 py-3 pr-10 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" />
          </div>

          <button :disabled="store.loading" type="submit" class="w-full py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-md transition-colors disabled:opacity-50">
            {{ isLogin ? 'Login' : 'Register' }}
          </button>

          <p class="mt-6 text-center text-sm text-gray-600 dark:text-gray-400 cursor-pointer select-none" @click="toggleForm" role="button" tabindex="0" @keydown.enter="toggleForm">
            {{ isLogin ? "Don't have an account? Register here" : 'Already have an account? Login' }}
          </p>

          <p v-if="store.error" role="alert" class="mt-4 text-center text-danger font-medium">
            {{ store.error }}
          </p>
        </form>
      </transition>
    </div>
  </section>
</template>
