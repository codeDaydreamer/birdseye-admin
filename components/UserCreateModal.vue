<template>
  <transition name="fade">
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="close"
    >
      <div
        class="relative max-w-md w-full p-6 rounded-md border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg shadow-lg"
        @click.stop
      >
        <!-- Close button -->
        <button
          @click="close"
          aria-label="Close modal"
          class="absolute top-4 right-4 text-light-text dark:text-dark-text hover:text-primary transition"
        >
          ✕
        </button>

        <h2
          class="text-2xl font-semibold mb-6 text-light-text dark:text-dark-text"
        >
          Create New User
        </h2>

        <div class="space-y-4 mb-6">
          <input
            v-model="form.username"
            placeholder="Username"
            class="w-full px-4 py-2 rounded-md border border-light-input dark:border-dark-input bg-white dark:bg-dark-bg text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            v-model="form.email"
            placeholder="Email"
            class="w-full px-4 py-2 rounded-md border border-light-input dark:border-dark-input bg-white dark:bg-dark-bg text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            v-model="form.contact"
            placeholder="Contact"
            class="w-full px-4 py-2 rounded-md border border-light-input dark:border-dark-input bg-white dark:bg-dark-bg text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            v-model="form.password"
            type="password"
            placeholder="Password"
            class="w-full px-4 py-2 rounded-md border border-light-input dark:border-dark-input bg-white dark:bg-dark-bg text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <button
          @click="submit"
          :disabled="loading"
          class="w-full py-2 rounded-md bg-primary text-light-bg disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {{ loading ? 'Creating...' : 'Create User' }}
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useUsersStore } from '~/stores/users'

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['update:open'])

const isOpen = ref(props.open)
watch(() => props.open, (val) => (isOpen.value = val))
watch(isOpen, (val) => emit('update:open', val))

const form = ref({
  username: '',
  email: '',
  contact: '',
  password: '',
})

const userStore = useUsersStore()
const loading = ref(false)

async function submit() {
  loading.value = true
  try {
    await userStore.createUser(form.value)
    close()
    form.value = { username: '', email: '', contact: '', password: '' }
  } catch (err) {
    // Optional error handling here
  } finally {
    loading.value = false
  }
}

function close() {
  isOpen.value = false
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
