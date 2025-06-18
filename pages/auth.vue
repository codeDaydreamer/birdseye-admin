<script setup>
import { reactive, ref } from 'vue'
import { useAdminAuthStore } from '~/stores/adminAuth'
import { useRouter } from 'vue-router'
import { definePageMeta } from '#imports'

definePageMeta({
  layout: 'auth',
  meta: [
    { name: 'description', content: 'Admin console login and registration' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

const store = useAdminAuthStore()
const router = useRouter()

const isLogin = ref(true)
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const form = reactive({
  username: '',
  email: '',
  password: '',
  passwordConfirm: ''
})

function resetForm() {
  form.username = ''
  form.email = ''
  form.password = ''
  form.passwordConfirm = ''
  showPassword.value = false
  showConfirmPassword.value = false
  store.error = ''
}

function toggleForm() {
  isLogin.value = !isLogin.value
  resetForm()
}

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
        // Redirect after successful login
        router.push('/')
      }
    } else {
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
    // Errors are handled inside the store
  }
}
</script>


<template>
  <section
    class="min-h-screen flex flex-col justify-center bg-light-bg dark:bg-dark-bg p-6"
    aria-label="Admin Authentication"
  >
    <!-- Logo Area -->
    <div class="flex justify-center mb-10">
      <!-- Replace this SVG with your actual logo or image -->
      <svg
        class="w-20 h-20 text-primary dark:text-secondary"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    </div>

    <!-- Welcome Message -->
    <h2
      class="text-center text-2xl font-semibold mb-6 text-primary dark:text-secondary tracking-wide"
      aria-live="polite"
    >
      {{ isLogin ? 'Welcome back, Sudo User!!' : 'Hey there, Sudo User!!' }}
    </h2>

    <!-- Form Container -->
    <div
      class="w-full max-w-md bg-white dark:bg-gray-900 rounded-lg shadow-lg p-10 border border-gray-200 dark:border-gray-700"
    >
      <transition
        name="fade-slide"
        mode="out-in"
      >
        <form
          :key="isLogin"
          @submit.prevent="handleSubmit"
          autocomplete="on"
          novalidate
          class="space-y-6"
          aria-live="polite"
        >
          <h1
            class="text-3xl font-extrabold text-primary dark:text-secondary text-center mb-8 tracking-wide"
          >
            {{ isLogin ? 'Admin Login' : 'Admin Registration' }}
          </h1>

          <template v-if="!isLogin">
            <div>
              <label
                for="username"
                class="block mb-2 font-semibold text-gray-700 dark:text-gray-300"
              >
                Username
              </label>
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
                aria-describedby="usernameHelp"
              />
              <p
                id="usernameHelp"
                class="mt-1 text-xs text-gray-500 dark:text-gray-400"
              >
                Your unique admin username
              </p>
            </div>
          </template>

          <div>
            <label
              for="email"
              class="block mb-2 font-semibold text-gray-700 dark:text-gray-300"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              v-model="form.email"
              placeholder="you@example.com"
              required
              autocomplete="email"
              class="w-full rounded-md border border-gray-300 dark:border-gray-600 px-4 py-3 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              aria-describedby="emailHelp"
            />
            <p
              id="emailHelp"
              class="mt-1 text-xs text-gray-500 dark:text-gray-400"
            >
              Use a valid email address
            </p>
          </div>

          <div class="relative">
            <label
              for="password"
              class="block mb-2 font-semibold text-gray-700 dark:text-gray-300"
            >
              Password
            </label>
            <input
              :type="showPassword ? 'text' : 'password'"
              id="password"
              name="password"
              v-model="form.password"
              placeholder="Enter your password"
              required
              autocomplete="current-password"
              minlength="8"
              class="w-full rounded-md border border-gray-300 dark:border-gray-600 px-4 py-3 pr-10 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              aria-describedby="passwordHelp"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              :aria-label="showPassword ? 'Hide password' : 'Show password'"
              class="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600 dark:text-gray-400 hover:text-primary focus:outline-none"
              tabindex="-1"
            >
              <svg
                v-if="!showPassword"
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.956 9.956 0 012.535-4.665M6.88 6.88A9.956 9.956 0 0112 5c4.477 0 8.268 2.943 9.542 7-.179.57-.426 1.123-.735 1.64m-3.28 3.28L3 3"
                />
              </svg>
            </button>
            <p
              id="passwordHelp"
              class="mt-1 text-xs text-gray-500 dark:text-gray-400"
            >
              Minimum 8 characters
            </p>
          </div>

          <div
            v-if="!isLogin"
            class="relative"
          >
            <label
              for="passwordConfirm"
              class="block mb-2 font-semibold text-gray-700 dark:text-gray-300"
            >
              Confirm Password
            </label>
            <input
              :type="showConfirmPassword ? 'text' : 'password'"
              id="passwordConfirm"
              name="passwordConfirm"
              v-model="form.passwordConfirm"
              placeholder="Confirm your password"
              required
              autocomplete="new-password"
              minlength="8"
              class="w-full rounded-md border border-gray-300 dark:border-gray-600 px-4 py-3 pr-10 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
            <button
              type="button"
              @click="showConfirmPassword = !showConfirmPassword"
              :aria-label="showConfirmPassword ? 'Hide password confirmation' : 'Show password confirmation'"
              class="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600 dark:text-gray-400 hover:text-primary focus:outline-none"
              tabindex="-1"
            >
              <svg
                v-if="!showConfirmPassword"
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.956 9.956 0 012.535-4.665M6.88 6.88A9.956 9.956 0 0112 5c4.477 0 8.268 2.943 9.542 7-.179.57-.426 1.123-.735 1.64m-3.28 3.28L3 3"
                />
              </svg>
            </button>
          </div>

          <button
            :disabled="store.loading"
            type="submit"
            class="w-full py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-md transition-colors disabled:opacity-50"
            aria-busy="store.loading"
          >
            {{ isLogin ? 'Login' : 'Register' }}
          </button>

          <p
            class="mt-6 text-center text-sm text-gray-600 dark:text-gray-400 cursor-pointer select-none"
            @click="toggleForm"
            role="button"
            tabindex="0"
            @keydown.enter="toggleForm"
          >
            {{ isLogin ? "Don't have an account? Register here" : 'Already have an account? Login' }}
          </p>

          <p
            v-if="store.error"
            role="alert"
            class="mt-4 text-center text-danger font-medium"
          >
            {{ store.error }}
          </p>
        </form>
      </transition>
    </div>
  </section>
</template>

<style scoped>
/* Transition for form switching */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(15px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-15px);
}

.bg-primary {
  --tw-bg-opacity: 1;
  background-color: rgba(36, 146, 37, var(--tw-bg-opacity));
}

.bg-primary-dark {
  --tw-bg-opacity: 1;
  background-color: rgba(244, 197, 66, var(--tw-bg-opacity));
}

.text-primary {
  color: #249225;
}

.text-secondary {
  color: #F4C542;
}

input:focus {
  outline-offset: 2px;
}

button {
  transition: background-color 0.3s ease;
}

[role='button'] {
  user-select: none;
}

input {
  border-radius: 0.375rem;
}
</style>
