<template>
  <div class="space-y-6 text-light-text dark:text-dark-text">
    <div>
      <h1 class="text-2xl font-bold">Admin audit log</h1>
      <p class="text-sm text-light-subtext dark:text-dark-subtext">Every change made in this console: who, what, when and from where.</p>
    </div>
    <div class="flex flex-col sm:flex-row gap-3">
      <input v-model="admin" placeholder="Admin email" class="p-2 border rounded-lg bg-light-bg dark:bg-dark-bg border-light-border dark:border-dark-border" @keyup.enter="reload" />
      <input v-model="path" placeholder="Path, e.g. /admin/user" class="flex-1 p-2 border rounded-lg bg-light-bg dark:bg-dark-bg border-light-border dark:border-dark-border" @keyup.enter="reload" />
    </div>
    <div class="overflow-x-auto rounded-xl shadow bg-light-accent dark:bg-dark-accent">
      <table class="min-w-full text-sm">
        <thead><tr class="text-left border-b border-light-border dark:border-dark-border"><th class="p-3">When</th><th class="p-3">Admin</th><th class="p-3">Action</th><th class="p-3">Target</th><th class="p-3">Result</th><th class="p-3">IP</th></tr></thead>
        <tbody>
          <tr v-for="e in events" :key="e.id" class="border-b border-light-border/30 dark:border-dark-border">
            <td class="p-3 whitespace-nowrap">{{ dateTime(e.created_at) }}</td>
            <td class="p-3">{{ e.admin_email || `#${e.admin_id}` }}</td>
            <td class="p-3"><span class="font-semibold">{{ describe(e) }}</span><br /><span class="font-mono text-xs text-light-subtext dark:text-dark-subtext">{{ e.method }} {{ e.path }}</span></td>
            <td class="p-3">{{ e.target_id || '—' }}</td>
            <td class="p-3"><span :class="['px-2 py-0.5 rounded-full text-xs font-semibold', e.status < 400 ? billingClass('success') : billingClass('failed')]">{{ e.status }}</span></td>
            <td class="p-3 font-mono text-xs">{{ e.ip }}</td>
          </tr>
          <tr v-if="!events.length"><td colspan="6" class="p-3 text-light-subtext dark:text-dark-subtext">No changes recorded yet.</td></tr>
        </tbody>
      </table>
      <div v-if="total > 50" class="flex justify-between items-center p-3 text-sm">
        <span>{{ (page - 1) * 50 + 1 }}–{{ Math.min(total, page * 50) }} of {{ total }}</span>
        <span class="space-x-2"><button class="px-3 py-1 rounded border disabled:opacity-40" :disabled="page === 1" @click="page--; load()">Previous</button><button class="px-3 py-1 rounded border disabled:opacity-40" :disabled="page * 50 >= total" @click="page++; load()">Next</button></span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useApi } from '~/composables/useApi'
import { dateTime, billingClass } from '~/composables/format'

const api = useApi()
const events = ref([])
const total = ref(0)
const page = ref(1)
const admin = ref('')
const path = ref('')

const labels = {
  'PUT /admin/user/:id': 'Edited a user', 'DELETE /admin/user/:id': 'Deleted a user', 'POST /admin/create-user': 'Created a user',
  'PUT /admin/user/:id/reset-password': "Reset a user's password", 'POST /admin/plans': 'Created a plan', 'PUT /admin/plans/:id': 'Edited a plan',
  'DELETE /admin/plans/:id': 'Deleted a plan', 'POST /admin/promo-codes': 'Created a promo code', 'PUT /admin/promo-codes/:id': 'Edited a promo code',
  'PUT /admin/settings': 'Changed platform settings', 'PUT /admin/farms/:id/billing': "Changed a farm's billing",
}
const describe = (e) => labels[e.action] || e.action

async function load() {
  const r = await api.get('/admin/audit', { params: { admin: admin.value || undefined, path: path.value || undefined, page: page.value } })
  events.value = r.data.events
  total.value = r.data.total
}
function reload() {
  page.value = 1
  load()
}
onMounted(load)
</script>
