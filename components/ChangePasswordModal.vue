<template>
  <Transition name="fade" appear>
    <div
      v-if="show"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="close"
    >
      <div
        class="bg-light-bg dark:bg-dark-bg rounded-lg shadow-lg max-w-md w-full p-6 relative"
        @keydown.esc.prevent="close"
        tabindex="0"
      >
        <!-- Close Button -->
        <button
          @click="close"
          aria-label="Close"
          class="absolute top-3 right-3 text-light-text dark:text-dark-text hover:text-danger transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
            viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>

        <h3 class="text-xl font-semibold text-light-text dark:text-dark-text mb-4">Change User Password</h3>

        <form @submit.prevent="submit">
          <label for="password" class="block mb-2 text-light-text dark:text-dark-text font-medium">New Password</label>
          <input
            id="password"
            type="password"
            v-model="password"
            placeholder="Enter new password"
            class="w-full rounded-md border border-light-border dark:border-dark-border px-3 py-2 mb-4
                   bg-light-input dark:bg-dark-input text-light-text dark:text-dark-text
                   focus:outline-none focus:ring-2 focus:ring-primary"
            required
            minlength="6"
            autocomplete="new-password"
          />

          <div class="flex justify-end space-x-4">
            <button
              type="button"
              @click="close"
              class="btn btn-outline px-4 py-2 rounded-md text-light-text dark:text-dark-text border border-light-border dark:border-dark-border hover:bg-light-accent dark:hover:bg-dark-accent transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              :disabled="loading || !password"
              class="btn btn-primary px-4 py-2 rounded-md bg-primary text-white hover:bg-secondary transition disabled:opacity-50"
            >
              {{ loading ? 'Saving...' : 'Save' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'save'])

const show = ref(props.modelValue)
const password = ref('')

watch(() => props.modelValue, val => {
  show.value = val
  if (!val) password.value = ''
})

function close() {
  emit('update:modelValue', false)
}

async function submit() {
  if (!password.value || password.value.length < 6) return

  emit('save', password.value)
}
</script>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
