<script setup>
// Accepting an emailed invite to the console: choose a username and password, then signed in
import { reactive, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useApi } from '~/composables/useApi'
import { useAdminAuthStore } from '~/stores/adminAuth'

definePageMeta({ layout: 'auth', meta: [{ name: 'robots', content: 'noindex, nofollow' }] })

const route = useRoute()
const store = useAdminAuthStore()
const router = useRouter()
const api = useApi()

const invite = ref(null)
const gone = ref('')
const busy = ref(false)
const error = ref('')
const showPassword = ref(false)
const form = reactive({ username: '', password: '', passwordConfirm: '' })

onMounted(async () => {
  store.initRouter(router)
  try {
    invite.value = (await api.get(`/auth/admin/invites/${route.params.token}`)).data
  } catch (e) {
    gone.value = e.response?.data?.error || 'This invite link does not work.'
  }
})

async function accept() {
  error.value = ''
  if (form.password.length < 10) { error.value = 'Use a password of at least 10 characters'; return }
  if (form.password !== form.passwordConfirm) { error.value = 'Passwords do not match'; return }
  busy.value = true
  try {
    store.signIn(await api.post(`/auth/admin/invites/${route.params.token}/accept`, { username: form.username, password: form.password }))
  } catch (e) {
    error.value = e.response?.data?.error || e.message
  } finally {
    busy.value = false
  }
}

const input = 'w-full rounded-md border border-gray-300 dark:border-gray-600 px-4 py-3 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
const label = 'block mb-2 font-semibold text-gray-700 dark:text-gray-300'
</script>

<template>
  <section class="relative min-h-screen flex flex-col justify-center bg-light-bg dark:bg-dark-bg py-10">
    <div class="absolute right-0 top-4"><ThemeToggle /></div>
    <div class="flex flex-col items-center mb-8 text-center">
      <img src="/birdseye-logo.svg" alt="" class="h-14 w-14 mb-4" />
      <h2 class="text-2xl font-semibold tracking-tight text-light-text dark:text-dark-text">Birdseye Admin</h2>
      <p class="mt-1 text-sm text-light-subtext dark:text-dark-subtext">Join the console</p>
    </div>

    <div class="w-full max-w-md bg-white dark:bg-gray-900 rounded-lg shadow-lg p-5 sm:p-10 border border-gray-200 dark:border-gray-700">
      <div v-if="gone" class="space-y-4">
        <p class="rounded-md bg-red-50 dark:bg-red-950/40 px-3 py-2 text-sm text-red-700 dark:text-red-300">{{ gone }}</p>
        <p class="text-sm text-gray-600 dark:text-gray-400">Ask the admin who invited you to send a new invite.</p>
        <NuxtLink to="/auth" class="inline-block text-sm font-semibold text-primary hover:underline">Go to sign-in</NuxtLink>
      </div>

      <div v-else-if="!invite" class="h-64 animate-pulse rounded-md bg-gray-100 dark:bg-gray-800"></div>

      <form v-else class="space-y-6" @submit.prevent="accept">
        <div>
          <h1 class="text-xl font-semibold text-light-text dark:text-dark-text">Set up your account</h1>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
            For <strong class="text-light-text dark:text-dark-text">{{ invite.email }}</strong>, as
            <strong class="text-light-text dark:text-dark-text">{{ invite.role }}</strong>{{ invite.role === 'viewer' ? ' (read-only)' : '' }}.
          </p>
        </div>
        <div>
          <label for="username" :class="label">Username</label>
          <input id="username" v-model="form.username" required autocomplete="username" spellcheck="false" placeholder="3 to 32 letters or numbers" :class="input" />
        </div>
        <div>
          <label for="password" :class="label">Password</label>
          <div class="relative">
            <input id="password" v-model="form.password" :type="showPassword ? 'text' : 'password'" required minlength="10" autocomplete="new-password" placeholder="At least 10 characters" :class="[input, 'pr-10']" />
            <button type="button" class="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600 dark:text-gray-400 hover:text-primary" tabindex="-1"
              :aria-label="showPassword ? 'Hide password' : 'Show password'" @click="showPassword = !showPassword">
              <i :class="['mdi text-xl', showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline']"></i>
            </button>
          </div>
        </div>
        <div>
          <label for="passwordConfirm" :class="label">Confirm password</label>
          <input id="passwordConfirm" v-model="form.passwordConfirm" :type="showPassword ? 'text' : 'password'" required autocomplete="new-password" :class="input" />
        </div>
        <p v-if="error" role="alert" class="rounded-md bg-red-50 dark:bg-red-950/40 px-3 py-2 text-sm text-red-700 dark:text-red-300">{{ error }}</p>
        <button :disabled="busy" type="submit" class="w-full py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-md transition-colors disabled:opacity-50">
          {{ busy ? 'Please wait...' : 'Join and sign in' }}
        </button>
      </form>
    </div>
  </section>
</template>
