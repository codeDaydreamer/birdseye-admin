<script setup>
// Who can use this console. New admins join only through an emailed invite. The first admin (made
// at setup) is marked and can't be removed or have its role changed; nobody can change their own
// role or remove themselves here. Viewers see this page read-only.
import { reactive, ref, computed, onMounted } from 'vue'
import { useApi } from '~/composables/useApi'

const api = useApi()
const team = ref(null)
const error = ref('')
const notice = ref('')
const busy = ref(false)
const form = reactive({ email: '', role: 'admin' })
const issued = ref(null) // { email, link, emailed }

const canManage = computed(() => team.value?.my_role === 'admin')
const roleText = { admin: 'Admin', viewer: 'Viewer (read-only)' }

async function load() {
  try {
    team.value = (await api.get('/admin/team')).data
  } catch (e) {
    error.value = e.response?.data?.error || e.message
  }
}
onMounted(load)

const fail = (e) => { error.value = e.response?.data?.error || e.message }

async function invite() {
  error.value = ''; notice.value = ''; issued.value = null
  busy.value = true
  try {
    const r = (await api.post('/admin/team/invites', form)).data
    issued.value = { email: form.email, link: r.link, emailed: r.emailed }
    form.email = ''
    await load()
  } catch (e) { fail(e) } finally { busy.value = false }
}

async function setRole(a, role) {
  error.value = ''; notice.value = ''
  try {
    await api.patch(`/admin/team/${a.id}`, { role })
    notice.value = `${a.username} is now ${roleText[role].toLowerCase()}.`
    await load()
  } catch (e) { fail(e); await load() }
}

async function remove(a) {
  if (!confirm(`Remove ${a.username} (${a.email}) from the console? They are signed out straight away.`)) return
  error.value = ''; notice.value = ''
  try {
    await api.delete(`/admin/team/${a.id}`)
    notice.value = `${a.username} was removed.`
    await load()
  } catch (e) { fail(e) }
}

async function revoke(inv) {
  error.value = ''; notice.value = ''
  try {
    await api.delete(`/admin/team/invites/${inv.id}`)
    await load()
  } catch (e) { fail(e) }
}

async function copy(text) {
  try { await navigator.clipboard.writeText(text); notice.value = 'Link copied.' } catch { /* the link is still shown */ }
}

const when = (d) => new Date(d).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
const input = 'w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary'
</script>

<template>
  <div class="space-y-6 text-light-text dark:text-dark-text">
    <div>
      <h1 class="text-2xl font-bold">Team</h1>
      <p class="text-sm text-light-subtext dark:text-dark-subtext max-w-3xl">
        People who can use this console. Admins can change everything; viewers can only look. New people join through an
        emailed invite. The first account can never be removed and its role can't change.
      </p>
    </div>

    <p v-if="error" role="alert" class="p-3 rounded-lg bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-300">{{ error }}</p>
    <p v-if="notice" class="p-3 rounded-lg bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-300">{{ notice }}</p>

    <div v-if="!team && !error" class="h-48 rounded-xl bg-light-accent dark:bg-dark-accent animate-pulse"></div>

    <template v-if="team">
      <!-- Invite -->
      <section v-if="canManage" class="rounded-xl shadow bg-light-accent dark:bg-dark-accent p-5">
        <h2 class="font-semibold flex items-center gap-2"><i class="mdi mdi-email-plus-outline"></i>Invite someone</h2>
        <form class="mt-4 grid gap-3 sm:grid-cols-[1fr_12rem_auto] sm:items-end" @submit.prevent="invite">
          <div>
            <label for="inv-email" class="text-sm font-medium">Email</label>
            <input id="inv-email" v-model="form.email" type="email" required placeholder="name@example.com" :class="[input, 'mt-1']" />
          </div>
          <div>
            <label for="inv-role" class="text-sm font-medium">Role</label>
            <select id="inv-role" v-model="form.role" :class="[input, 'mt-1']">
              <option v-for="r in team.roles" :key="r" :value="r">{{ roleText[r] }}</option>
            </select>
          </div>
          <button :disabled="busy" class="px-4 py-2 rounded-md bg-primary hover:bg-primary-dark text-white text-sm font-semibold disabled:opacity-50">
            {{ busy ? 'Sending...' : 'Send invite' }}
          </button>
        </form>
        <div v-if="issued" class="mt-4 rounded-lg bg-white/70 dark:bg-gray-900/60 p-3 text-sm space-y-2">
          <p>{{ issued.emailed ? `We emailed the invite to ${issued.email}. You can also send them this link:` : `The email didn't go out, so send ${issued.email} this link yourself:` }}</p>
          <div class="flex items-center gap-2">
            <code class="flex-1 min-w-0 truncate rounded bg-gray-100 dark:bg-gray-800 px-2 py-1 text-xs">{{ issued.link }}</code>
            <button type="button" class="shrink-0 text-sm font-semibold text-primary hover:underline" @click="copy(issued.link)">Copy</button>
          </div>
          <p class="text-xs text-light-subtext dark:text-dark-subtext">It works once and expires in 3 days.</p>
        </div>
      </section>

      <!-- Admins -->
      <section class="rounded-xl shadow bg-light-accent dark:bg-dark-accent p-5">
        <h2 class="font-semibold flex items-center gap-2"><i class="mdi mdi-account-key-outline"></i>Admins ({{ team.admins.length }})</h2>
        <div class="mt-3 overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="text-left text-xs uppercase tracking-wide text-light-subtext dark:text-dark-subtext">
                <th class="py-2 pr-3">Person</th><th class="py-2 pr-3">Role</th><th class="py-2 pr-3">Joined</th><th class="py-2"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="a in team.admins" :key="a.id" class="border-t border-gray-200/70 dark:border-gray-700/70">
                <td class="py-3 pr-3">
                  <p class="font-medium">
                    {{ a.username }}
                    <span v-if="a.id === team.me" class="text-xs text-light-subtext dark:text-dark-subtext">(you)</span>
                    <span v-if="a.id === team.founder_id" class="ml-1.5 rounded-full bg-primary/15 px-2 py-0.5 text-xs font-semibold text-primary" title="Made at setup. It can't be removed and its role can't change.">First account</span>
                  </p>
                  <p class="text-xs text-light-subtext dark:text-dark-subtext">{{ a.email }}</p>
                </td>
                <td class="py-3 pr-3">
                  <select v-if="canManage && a.id !== team.founder_id && a.id !== team.me" :value="a.role" :class="[input, 'w-auto !py-1']" :aria-label="`Role for ${a.username}`"
                    @change="setRole(a, $event.target.value)">
                    <option v-for="r in team.roles" :key="r" :value="r">{{ roleText[r] }}</option>
                  </select>
                  <span v-else>{{ roleText[a.role] || a.role }}</span>
                </td>
                <td class="py-3 pr-3 text-light-subtext dark:text-dark-subtext">{{ when(a.created_at) }}</td>
                <td class="py-3 text-right">
                  <button v-if="canManage && a.id !== team.founder_id && a.id !== team.me" class="text-sm font-semibold text-red-600 hover:underline" @click="remove(a)">Remove</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Open invites -->
      <section v-if="team.invites.length" class="rounded-xl shadow bg-light-accent dark:bg-dark-accent p-5">
        <h2 class="font-semibold flex items-center gap-2"><i class="mdi mdi-email-outline"></i>Open invites</h2>
        <ul class="mt-3 divide-y divide-gray-200/70 dark:divide-gray-700/70 text-sm">
          <li v-for="inv in team.invites" :key="inv.id" class="flex flex-wrap items-center justify-between gap-2 py-2">
            <span><span class="font-medium">{{ inv.email }}</span> <span class="text-light-subtext dark:text-dark-subtext">as {{ roleText[inv.role] || inv.role }}, expires {{ when(inv.expires_at) }}</span></span>
            <button v-if="canManage" class="text-sm font-semibold text-red-600 hover:underline" @click="revoke(inv)">Cancel invite</button>
          </li>
        </ul>
      </section>
    </template>
  </div>
</template>
