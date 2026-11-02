<template>
  <div class="space-y-6 text-light-text dark:text-dark-text">
    <div>
      <h1 class="text-2xl font-bold">M-Pesa payments</h1>
      <p class="text-sm text-light-subtext dark:text-dark-subtext">Subscription payments from every farm, through Dynapay.</p>
    </div>
    <div class="flex flex-col sm:flex-row gap-3">
      <input v-model="q" placeholder="Farm, phone, receipt or reference" class="flex-1 p-2 border rounded-lg bg-light-bg dark:bg-dark-bg border-light-border dark:border-dark-border" @keyup.enter="reload" />
      <select v-model="status" class="p-2 border rounded-lg bg-light-bg dark:bg-dark-bg border-light-border dark:border-dark-border" aria-label="Status" @change="reload">
        <option value="">All</option><option value="success">Paid</option><option value="initiated">Waiting</option><option value="failed">Failed</option><option value="refunded">Refunded</option>
      </select>
    </div>
    <div class="overflow-x-auto rounded-xl shadow bg-light-accent dark:bg-dark-accent">
      <table class="min-w-full text-sm">
        <thead><tr class="text-left border-b border-light-border dark:border-dark-border"><th class="p-3">Date</th><th class="p-3">Farm</th><th class="p-3">Amount</th><th class="p-3">Plan</th><th class="p-3">Status</th><th class="p-3">Paid by</th><th class="p-3">Receipt</th><th class="p-3">Note</th></tr></thead>
        <tbody>
          <tr v-if="loading"><td colspan="8" class="p-3">Loading…</td></tr>
          <tr v-for="p in list" :key="p.id" class="border-b border-light-border/30 dark:border-dark-border">
            <td class="p-3 whitespace-nowrap">{{ dateTime(p.created_at) }}</td>
            <td class="p-3"><NuxtLink :to="`/farms/${p.farm_id}`" class="hover:underline">{{ p.farm_name }}</NuxtLink></td>
            <td class="p-3 font-semibold whitespace-nowrap">{{ kes(p.amount) }}</td>
            <td class="p-3">{{ p.plan_name || '—' }} <span v-if="p.billing_period" class="text-xs text-light-subtext">{{ p.billing_period }}</span></td>
            <td class="p-3"><span :class="['px-2 py-0.5 rounded-full text-xs font-semibold', billingClass(p.status)]">{{ p.status }}</span><span v-if="stuck(p)" class="ml-1 text-xs text-amber-700">stuck</span></td>
            <td class="p-3">{{ p.payer }}<br /><span class="text-xs text-light-subtext dark:text-dark-subtext">{{ p.phone_number }}</span></td>
            <td class="p-3 font-mono text-xs">{{ p.mpesa_reference || '—' }}</td>
            <td class="p-3 text-xs text-light-subtext dark:text-dark-subtext max-w-xs truncate">{{ p.result_description }}</td>
          </tr>
          <tr v-if="!loading && !list.length"><td colspan="8" class="p-3 text-light-subtext dark:text-dark-subtext">No payments.</td></tr>
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
import { kes, dateTime, billingClass } from '~/composables/format'

const api = useApi()
const list = ref([])
const total = ref(0)
const page = ref(1)
const q = ref('')
const status = ref(useRoute().query.status || '')
const loading = ref(false)
const stuck = (p) => p.status === 'initiated' && Date.now() - new Date(p.created_at).getTime() > 20 * 60000

async function load() {
  loading.value = true
  try {
    const r = await api.get('/admin/payments', { params: { q: q.value || undefined, status: status.value || undefined, page: page.value } })
    list.value = r.data.payments
    total.value = r.data.total
  } finally {
    loading.value = false
  }
}
function reload() {
  page.value = 1
  load()
}
onMounted(load)
</script>
