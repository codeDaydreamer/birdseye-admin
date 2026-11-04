<script setup>
// Sign-in to the console. While no admin exists yet it shows the one-time setup instead, which
// creates the first admin (that account can never be removed or have its role changed). After
// that there is no sign-up: other admins join through an invite from the Team page.
import { reactive, ref, onMounted } from 'vue'
import { useAdminAuthStore } from '~/stores/adminAuth'
import { useRouter } from 'vue-router'

definePageMeta({
  layout: 'auth',
  meta: [{ name: 'robots', content: 'noindex, nofollow' }]
})

const store = useAdminAuthStore()
const router = useRouter()

const mode = ref('loading') // loading | setup | login
const showPassword = ref(false)
const form = reactive({ username: '', email: '', password: '', passwordConfirm: '' })
const localError = ref('')

onMounted(async () => {
  store.initRouter(router) // browser only: a router in the store breaks server rendering
  mode.value = (await store.setupStatus()) ? 'setup' : 'login'
})

async function handleSubmit() {
  localError.value = ''
  store.error = ''
  if (mode.value === 'setup') {
    if (form.password.length < 10) { localError.value = 'Use a password of at least 10 characters'; return }
    if (form.password !== form.passwordConfirm) { localError.value = 'Passwords do not match'; return }
    await store.setupFirstAdmin({ username: form.username, email: form.email, password: form.password })
    // Someone else finished setup first: fall back to sign-in
    if (store.error && /already done/.test(store.error)) mode.value = 'login'
  } else {
    await store.loginAdmin({ identifier: form.email, password: form.password })
  }
}

const input = 'w-full rounded-md border border-gray-300 dark:border-gray-600 px-4 py-3 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
const label = 'block mb-2 font-semibold text-gray-700 dark:text-gray-300'
</script>

<template>
  <section class="relative min-h-screen flex flex-col justify-center bg-light-bg dark:bg-dark-bg py-10" aria-label="Admin sign-in">
    <div class="absolute right-0 top-4"><ThemeToggle /></div>

    <div class="flex flex-col items-center mb-8 text-center">
      <img src="/birdseye-logo.svg" alt="" class="h-14 w-14 mb-4" />
      <h2 class="text-2xl font-semibold tracking-tight text-light-text dark:text-dark-text">Birdseye Admin</h2>
      <p class="mt-1 text-sm text-light-subtext dark:text-dark-subtext">{{ mode === 'setup' ? 'First-time setup' : 'Sign in to the console' }}</p>
    </div>

    <div class="w-full max-w-md bg-white dark:bg-gray-900 rounded-lg shadow-lg p-5 sm:p-10 border border-gray-200 dark:border-gray-700">
      <div v-if="mode === 'loading'" class="h-64 animate-pulse rounded-md bg-gray-100 dark:bg-gray-800"></div>

      <form v-else @submit.prevent="handleSubmit" autocomplete="on" class="space-y-6">
        <div>
          <h1 class="text-xl font-semibold text-light-text dark:text-dark-text">{{ mode === 'setup' ? 'Create the first admin' : 'Admin login' }}</h1>
          <p v-if="mode === 'setup'" class="mt-2 text-sm text-gray-600 dark:text-gray-400">
            This page shows only once, while the console has no admins. This first account can never be removed and its
            role can't change. Invite everyone else from the Team page.
          </p>
        </div>

        <div v-if="mode === 'setup'">
          <label for="username" :class="label">Username</label>
          <input id="username" v-model="form.username" type="text" required autocomplete="username" spellcheck="false" placeholder="Choose a username" :class="input" />
        </div>

        <div>
          <label for="email" :class="label">{{ mode === 'setup' ? 'Email address' : 'Email or username' }}</label>
          <input id="email" v-model="form.email" :type="mode === 'setup' ? 'email' : 'text'" required :autocomplete="mode === 'setup' ? 'email' : 'username'" placeholder="you@example.com" :class="input" />
        </div>

        <div>
          <label for="password" :class="label">Password</label>
          <div class="relative">
            <input id="password" v-model="form.password" :type="showPassword ? 'text' : 'password'" required :minlength="mode === 'setup' ? 10 : 1"
              :autocomplete="mode === 'setup' ? 'new-password' : 'current-password'" :placeholder="mode === 'setup' ? 'At least 10 characters' : 'Enter your password'" :class="[input, 'pr-10']" />
            <button type="button" class="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600 dark:text-gray-400 hover:text-primary" tabindex="-1"
              :aria-label="showPassword ? 'Hide password' : 'Show password'" @click="showPassword = !showPassword">
              <i :class="['mdi text-xl', showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline']"></i>
            </button>
          </div>
        </div>

        <div v-if="mode === 'setup'">
          <label for="passwordConfirm" :class="label">Confirm password</label>
          <input id="passwordConfirm" v-model="form.passwordConfirm" :type="showPassword ? 'text' : 'password'" required autocomplete="new-password" :class="input" />
        </div>

        <p v-if="localError || store.error" role="alert" class="rounded-md bg-red-50 dark:bg-red-950/40 px-3 py-2 text-sm text-red-700 dark:text-red-300">{{ localError || store.error }}</p>

        <button :disabled="store.loading" type="submit" class="w-full py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-md transition-colors disabled:opacity-50">
          {{ store.loading ? 'Please wait...' : mode === 'setup' ? 'Create admin and sign in' : 'Login' }}
        </button>

        <p v-if="mode === 'login'" class="text-center text-sm text-gray-600 dark:text-gray-400">
          Need access? Ask an admin to invite you from the Team page.
        </p>
      </form>
    </div>
  </section>
</template>
