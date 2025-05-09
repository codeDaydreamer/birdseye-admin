<!-- EditUserModal.vue -->
<template>
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-gray-500 bg-opacity-75 z-50 flex justify-center items-center"
    >
      <div class="bg-light-bg dark:bg-dark-bg rounded-xl p-6 w-96 shadow-xl">
        <h3 class="text-2xl font-bold text-light-text dark:text-dark-text mb-4">Edit User Details</h3>
  
        <!-- User Info Form -->
        <form @submit.prevent="submitForm">
          <div class="space-y-4">
            <div>
              <label for="name" class="text-sm text-light-subtext dark:text-dark-subtext">Name</label>
              <input
                v-model="editedUser.name"
                id="name"
                type="text"
                class="input input-bordered w-full"
                required
              />
            </div>
            <div>
              <label for="email" class="text-sm text-light-subtext dark:text-dark-subtext">Email</label>
              <input
                v-model="editedUser.email"
                id="email"
                type="email"
                class="input input-bordered w-full"
                required
              />
            </div>
            <div>
              <label for="role" class="text-sm text-light-subtext dark:text-dark-subtext">Role</label>
              <select
                v-model="editedUser.role"
                id="role"
                class="select select-bordered w-full"
                required
              >
                <option value="admin">Admin</option>
                <option value="moderator">Moderator</option>
                <option value="user">User</option>
              </select>
            </div>
            <div>
              <label for="status" class="text-sm text-light-subtext dark:text-dark-subtext">Status</label>
              <select
                v-model="editedUser.status"
                id="status"
                class="select select-bordered w-full"
                required
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div class="flex justify-between items-center pt-6">
              <button
                type="button"
                class="btn btn-secondary"
                @click="closeModal"
              >
                Cancel
              </button>
              <button type="submit" class="btn btn-primary">
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, defineProps, defineEmits } from 'vue'
  
  const props = defineProps({
    isOpen: Boolean,
    user: Object,
  })
  
  const emit = defineEmits(['updateUser', 'close'])
  
  const editedUser = ref({ ...props.user }) // Clone the user to edit
  
  // Handle form submission
  const submitForm = () => {
    // Emit the updated user details back to the parent
    emit('updateUser', editedUser.value)
    closeModal()
  }
  
  // Close the modal
  const closeModal = () => {
    emit('close')
  }
  </script>
  
  <style scoped>
  /* Optional: Custom modal styling */
  </style>
  