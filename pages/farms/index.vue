<template>
  <div class="space-y-6 text-light-text dark:text-dark-text">
    <div>
      <h1 class="text-2xl font-bold">Farms</h1>
      <p class="text-sm text-light-subtext dark:text-dark-subtext">{{ farms.length }} farms. Open one to see its people, batches, records and payments.</p>
    </div>

    <div class="flex flex-col sm:flex-row gap-3">
      <input v-model="search" placeholder="Search farm, owner or email" class="flex-1 p-2 border rounded-lg bg-light-bg dark:bg-dark-bg border-light-border dark:border-dark-border" />
      <select v-model="billing" class="p-2 border rounded-lg bg-light-bg dark:bg-dark-bg border-light-border dark:border-dark-border" aria-label="Billing status">
        <option value="">All billing</option><option value="trial">On trial</option><option value="paid">Paying</option><option value="unpaid">Unpaid</option>
      </select>
      <select v-model="activity" class="p-2 border rounded-lg bg-light-bg dark:bg-dark-bg border-light-border dark:border-dark-border" aria-label="Activity">
        <option value="">Any activity</option><option value="7">Active this week</option><option value="quiet">Quiet 14+ days</option><option value="never">Never recorded</option>
      </select>
      <select v-model="sort" class="p-2 border rounded-lg bg-light-bg dark:bg-dark-bg border-light-border dark:border-dark-border" aria-label="Sort">
        <option value="created">Newest</option><option value="activity">Recently active</option><option value="name">Name</option>
      </select>
    </div>

    <div class="overflow-x-auto rounded-xl shadow bg-light-accent dark:bg-dark-accent">
      <table class="min-w-full text-sm">
        <thead>
          <tr class="text-left border-b border-light-border dark:border-dark-border">
            <th class="p-3">Farm</th><th class="p-3">Owner</th><th class="p-3">Plan</th><th class="p-3">Billing</th><th class="p-3">Staff</th><th class="p-3">Last activity</th><th class="p-3">Joined</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading"><td colspan="7" class="p-3">Loading…</td></tr>
          <tr v-else-if="!rows.length"><td colspan="7" class="p-3 text-light-subtext dark:text-dark-subtext">No farms match.</td></tr>
          <tr v-for="f in rows" :key="f.id" class="border-b border-light-border/40 dark:border-dark-border cursor-pointer hover:bg-light-bg/60 dark:hover:bg-dark-bg/40" @click="navigateTo(`/farms/${f.id}`)">
            <td class="p-3 font-semibold">{{ f.name }}<span v-if="f.status !== 'active'" class="ml-2 text-xs text-red-600">{{ f.status }}</span></td>
            <td class="p-3">{{ f.owner_username }}<br /><span class="text-xs text-light-subtext dark:text-dark-subtext">{{ f.owner_email }}</span></td>
            <td class="p-3">{{ f.plan_name || '—' }}</td>
            <td class="p-3"><span :class="['px-2 py-0.5 rounded-full text-xs font-semibold', billingClass(f.payment_status)]">{{ f.payment_status }}</span></td>
            <td class="p-3">{{ f.staff_count }}</td>
            <td class="p-3" :class="quiet(f) ? 'text-amber-700 dark:text-amber-400' : ''">{{ ago(last[f.id]) }}</td>
            <td class="p-3 whitespace-nowrap">{{ date(f.created_at) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useApi } from '~/composables/useApi'
import { ago, date, billingClass } from '~/composables/format'

const api = useApi()
const farms = ref([])
const last = ref({})
const loading = ref(true)
const search = ref('')
const billing = ref(useRoute().query.billing || '')
const activity = ref('')
const sort = ref('created')

onMounted(async () => {
  try {
    const [f, a] = await Promise.all([api.get('/admin/farms'), api.get('/admin/farms-activity')])
    farms.value = (f.data.farms || []).map((x) => ({ ...x, payment_status: x.payment_status || x.farm_billing_status?.payment_status }))
    last.value = a.data.last_activity || {}
  } finally {
    loading.value = false
  }
})

const daysSince = (id) => (last.value[id] ? (Date.now() - new Date(last.value[id]).getTime()) / 86400000 : Infinity)
const quiet = (f) => last.value[f.id] && daysSince(f.id) > 14

const rows = computed(() => {
  const s = search.value.toLowerCase()
  let list = farms.value.filter((f) =>
    (!s || [f.name, f.owner_username, f.owner_email].some((v) => (v || '').toLowerCase().includes(s))) &&
    (!billing.value || f.payment_status === billing.value) &&
    (!activity.value || (activity.value === '7' ? daysSince(f.id) <= 7 : activity.value === 'quiet' ? quiet(f) : !last.value[f.id])))
  if (sort.value === 'activity') list = [...list].sort((a, b) => daysSince(a.id) - daysSince(b.id))
  if (sort.value === 'name') list = [...list].sort((a, b) => a.name.localeCompare(b.name))
  return list
})
</script>
