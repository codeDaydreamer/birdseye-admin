<template>
  <header class="bg-white text-light-text border-b border-light-border dark:border-dark-border dark:bg-dark-bg dark:text-dark-text relative z-20">
    <div class="px-4 py-2.5 md:py-3 flex items-center justify-between gap-3">
      <!-- Left: menu button (phones) and logo -->
      <div class="flex items-center gap-2 md:gap-4 min-w-0">
        <button
          v-if="isMobile"
          type="button"
          @click="$emit('toggleMobile')"
          class="h-10 w-10 -ml-1 inline-flex items-center justify-center rounded-lg hover:bg-light-input dark:hover:bg-dark-accent"
          aria-label="Open menu"
        >
          <i class="mdi mdi-menu text-2xl"></i>
        </button>
        <img src="/birdseye-logo.png" alt="Birdseye" class="h-9 md:h-10 w-auto" />
      </div>

      <!-- Right: theme, notifications, profile -->
      <div ref="menus" class="flex items-center gap-1 md:gap-2">
        <ThemeToggle class="mr-1" />

        <!-- Notifications: the latest platform activity, with a count of what's new since you last looked -->
        <div class="relative">
          <button
            type="button"
            class="relative h-10 inline-flex items-center gap-2 px-2.5 rounded-lg hover:bg-light-input dark:hover:bg-dark-accent"
            :aria-expanded="open === 'notes'"
            aria-label="Notifications"
            @click="toggle('notes')"
          >
            <i class="mdi mdi-bell-outline text-xl"></i>
            <span class="hidden md:inline text-sm">Notifications</span>
            <span v-if="unread" class="absolute top-1 left-6 min-w-[1.1rem] h-[1.1rem] px-1 rounded-full bg-red-600 text-white text-[10px] font-bold leading-[1.1rem] text-center">{{ unread > 9 ? '9+' : unread }}</span>
          </button>
          <div v-if="open === 'notes'" class="fixed md:absolute inset-x-3 md:inset-x-auto md:right-0 top-16 md:top-12 md:w-96 rounded-xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-accent shadow-xl">
            <div class="flex items-center justify-between px-4 py-3 border-b border-light-border/60 dark:border-dark-border">
              <p class="font-semibold">Notifications</p>
              <NuxtLink to="/activity" class="text-sm text-primary hover:underline" @click="open = ''">All activity</NuxtLink>
            </div>
            <div class="max-h-[60vh] overflow-y-auto px-4">
              <p v-if="notesError" class="py-3 text-sm text-red-600">{{ notesError }}</p>
              <ActivityList v-else :items="notes" />
            </div>
          </div>
        </div>

        <!-- Profile -->
        <div class="relative">
          <button
            type="button"
            class="h-10 inline-flex items-center gap-2 px-2.5 rounded-lg hover:bg-light-input dark:hover:bg-dark-accent"
            :aria-expanded="open === 'profile'"
            aria-label="Profile"
            @click="toggle('profile')"
          >
            <span class="h-7 w-7 rounded-full bg-primary text-white text-xs font-bold inline-flex items-center justify-center">{{ initials }}</span>
            <span class="hidden md:inline text-sm max-w-[10rem] truncate">{{ admin?.username || 'Profile' }}</span>
            <i class="hidden md:inline mdi mdi-chevron-down text-light-subtext dark:text-dark-subtext"></i>
          </button>
          <div v-if="open === 'profile'" class="absolute right-0 top-12 w-64 rounded-xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-accent shadow-xl py-2">
            <div class="px-4 py-2 border-b border-light-border/60 dark:border-dark-border">
              <p class="font-semibold truncate">{{ admin?.username || 'Admin' }}</p>
              <p class="text-xs text-light-subtext dark:text-dark-subtext truncate">{{ admin?.email }}</p>
              <p v-if="admin" class="mt-1 text-xs text-light-subtext dark:text-dark-subtext">{{ admin.founder ? 'Owner' : roleText[admin.role] || admin.role }}</p>
            </div>
            <NuxtLink to="/team" class="flex items-center gap-3 px-4 py-2 text-sm hover:bg-light-input dark:hover:bg-dark-bg" @click="open = ''"><i class="mdi mdi-account-key-outline"></i>Team</NuxtLink>
            <NuxtLink to="/audit" class="flex items-center gap-3 px-4 py-2 text-sm hover:bg-light-input dark:hover:bg-dark-bg" @click="open = ''"><i class="mdi mdi-text-box-search-outline"></i>Audit log</NuxtLink>
            <button type="button" class="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-light-input dark:hover:bg-dark-bg" @click="auth.logout()"><i class="mdi mdi-logout"></i>Sign out</button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { useApi } from '~/composables/useApi'
import { useAdminAuthStore } from '~/stores/adminAuth'

defineProps({ isMobile: Boolean })
defineEmits(['toggleMobile'])

const api = useApi()
const auth = useAdminAuthStore()
const route = useRoute()
const admin = computed(() => auth.admin)
const roleText = { admin: 'Admin', viewer: 'Viewer' }
const initials = computed(() => (admin.value?.username || admin.value?.email || 'A').trim().slice(0, 2).toUpperCase())

const open = ref('')
const menus = ref(null)
const notes = ref([])
const notesError = ref('')
const seenKey = 'notifications_seen_at'
const seenAt = ref(0)
const unread = computed(() => notes.value.filter((n) => new Date(n.at).getTime() > seenAt.value).length)

function toggle(which) {
  open.value = open.value === which ? '' : which
  if (open.value === 'notes') {
    seenAt.value = Date.now()
    try { localStorage.setItem(seenKey, String(seenAt.value)) } catch {}
  }
}

async function loadNotes() {
  try {
    notes.value = (await api.get('/admin/activity', { params: { limit: 15 } })).data.activity || []
    notesError.value = ''
  } catch (e) {
    notesError.value = e?.response?.data?.error || 'Could not load notifications'
  }
}

const onDocClick = (e) => { if (open.value && menus.value && !menus.value.contains(e.target)) open.value = '' }
const onKey = (e) => { if (e.key === 'Escape') open.value = '' }
let timer
onMounted(() => {
  try { seenAt.value = Number(localStorage.getItem(seenKey)) || 0 } catch {}
  if (!auth.admin) auth.fetchAdmin()
  loadNotes()
  timer = setInterval(loadNotes, 60000)
  document.addEventListener('click', onDocClick)
  document.addEventListener('keydown', onKey)
})
onBeforeUnmount(() => {
  clearInterval(timer)
  document.removeEventListener('click', onDocClick)
  document.removeEventListener('keydown', onKey)
})
watch(() => route.fullPath, () => { open.value = '' })
</script>
