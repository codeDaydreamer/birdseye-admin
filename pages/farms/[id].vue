<template>
  <div class="space-y-6 text-light-text dark:text-dark-text">
    <NuxtLink to="/farms" class="text-sm text-light-subtext dark:text-dark-subtext hover:underline"><i class="mdi mdi-arrow-left"></i> Farms</NuxtLink>
    <p v-if="error" class="p-3 rounded-lg bg-red-100 text-red-800">{{ error }}</p>

    <template v-if="d">
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold flex items-center gap-3">{{ d.farm.name }}
            <span :class="['px-2 py-0.5 rounded-full text-xs font-semibold', billingClass(d.billing?.payment_status)]">{{ d.billing?.payment_status }}</span>
          </h1>
          <p class="text-sm text-light-subtext dark:text-dark-subtext">
            {{ d.farm.location || 'No location' }} · joined {{ date(d.farm.created_at) }} · last activity {{ ago(d.last_activity) }}
            <template v-if="d.farm.enterprises"> · keeps {{ d.farm.enterprises.split(',').map((e) => productionLabel[e] || e).join(', ') }}</template>
          </p>
        </div>
        <NuxtLink :to="`/user/${d.owner.id}`" class="text-sm px-3 py-2 rounded-lg bg-light-accent dark:bg-dark-accent hover:underline"><i class="mdi mdi-account"></i> Owner: {{ d.owner.username }}</NuxtLink>
      </div>

      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Kpi label="Birds" :value="birds.toLocaleString()" :sub="`${activeBatches} active batches`" icon="mdi-bird" />
        <Kpi label="Eggs (30 days)" :value="d.last_30_days.eggs.toLocaleString()" :sub="`${d.last_30_days.records.egg_productions} collections logged`" icon="mdi-egg-outline" />
        <Kpi label="Sales (30 days)" :value="kes(d.last_30_days.sales)" :sub="`Expenses ${kes(d.last_30_days.expenses)}`" icon="mdi-cash" />
        <Kpi label="Records (30 days)" :value="records" :sub="`${activeDays} of 30 days with records`" :tone="activeDays < 5 ? 'bad' : 'good'" icon="mdi-notebook-edit-outline" />
      </div>

      <div class="grid gap-6 xl:grid-cols-3">
        <section class="rounded-xl shadow bg-light-accent dark:bg-dark-accent p-4 xl:col-span-2">
          <h2 class="font-semibold mb-3">Records per day (30 days)</h2>
          <InsightChart type="bar" height="200px" :labels="d.activity.map((x) => new Date(x.day + 'T00:00:00').toLocaleDateString('en-KE', { day: 'numeric', month: 'short' }))"
            :datasets="[{ label: 'Records', data: d.activity.map((x) => x.count), color: '#2563EB' }]" label="Records per day" />
          <div class="mt-3 flex flex-wrap gap-2 text-xs">
            <span v-for="(n, k) in d.last_30_days.records" :key="k" class="px-2 py-1 rounded-full bg-light-bg dark:bg-dark-bg">{{ recordLabel[k] || k }}: <strong>{{ n }}</strong></span>
          </div>
        </section>

        <section class="rounded-xl shadow bg-light-accent dark:bg-dark-accent p-4 space-y-3">
          <h2 class="font-semibold">Plan and billing</h2>
          <dl class="text-sm space-y-1.5">
            <div class="flex justify-between"><dt class="text-light-subtext dark:text-dark-subtext">Plan</dt><dd>{{ d.plan ? `${d.plan.name} (${d.farm.billing_period})` : 'None chosen' }}</dd></div>
            <div class="flex justify-between"><dt class="text-light-subtext dark:text-dark-subtext">Trial ends</dt><dd>{{ date(d.farm.trial_ends_at) }}</dd></div>
            <div class="flex justify-between"><dt class="text-light-subtext dark:text-dark-subtext">Paid until</dt><dd>{{ date(d.farm.paid_until) }}</dd></div>
            <div class="flex justify-between"><dt class="text-light-subtext dark:text-dark-subtext">Total paid</dt><dd class="font-semibold">{{ kes(totalPaid) }}</dd></div>
          </dl>
          <div class="pt-3 border-t border-light-border/40 dark:border-dark-border space-y-2">
            <div class="flex gap-2">
              <select v-model.number="extendDays" class="flex-1 min-w-0 p-2 text-sm border rounded-lg bg-light-bg dark:bg-dark-bg border-light-border dark:border-dark-border" aria-label="Extend trial by">
                <option :value="7">7 days</option><option :value="14">14 days</option><option :value="30">30 days</option>
              </select>
              <button class="w-28 shrink-0 px-3 py-2 text-sm rounded-lg bg-primary text-white disabled:opacity-50" :disabled="busy" @click="extendTrial">Extend trial</button>
            </div>
            <div class="flex gap-2">
              <select v-model="planId" class="flex-1 min-w-0 p-2 text-sm border rounded-lg bg-light-bg dark:bg-dark-bg border-light-border dark:border-dark-border" aria-label="Plan">
                <option v-for="p in plans" :key="p.id" :value="p.id">{{ p.name }} (KES {{ p.monthly_price }}/mo)</option>
              </select>
              <button class="w-28 shrink-0 px-3 py-2 text-sm rounded-lg border border-light-border dark:border-dark-border disabled:opacity-50" :disabled="busy || planId === d.farm.plan_id" @click="changePlan">Set plan</button>
            </div>
            <p v-if="notice" :class="['text-xs', notice.error ? 'text-red-600' : 'text-green-700']">{{ notice.text }}</p>
          </div>
        </section>
      </div>

      <div class="grid gap-6 xl:grid-cols-2">
        <section class="rounded-xl shadow bg-light-accent dark:bg-dark-accent p-4">
          <h2 class="font-semibold mb-2">People ({{ d.members.filter((m) => m.status === 'active').length }})</h2>
          <ul class="divide-y divide-light-border/30 dark:divide-dark-border">
            <li v-for="m in d.members" :key="m.user_id" class="flex items-center justify-between py-2 text-sm" :class="{ 'opacity-50': m.status !== 'active' }">
              <NuxtLink :to="`/user/${m.user_id}`" class="hover:underline">{{ m.username }} <span class="text-xs text-light-subtext dark:text-dark-subtext">{{ m.email }}</span></NuxtLink>
              <span class="text-xs"><span class="capitalize font-semibold">{{ m.role }}</span> · signed in {{ ago(m.last_login) }}</span>
            </li>
          </ul>
        </section>
        <section class="rounded-xl shadow bg-light-accent dark:bg-dark-accent p-4">
          <h2 class="font-semibold mb-2">Batches</h2>
          <ul class="divide-y divide-light-border/30 dark:divide-dark-border">
            <li v-for="b in d.batches" :key="b.id" class="flex items-center justify-between py-2 text-sm" :class="{ 'opacity-50': b.status !== 'active' }">
              <span>{{ b.name }} <span class="text-xs text-light-subtext dark:text-dark-subtext">{{ productionLabel[b.production_type] || b.production_type }} · {{ b.breed }}</span></span>
              <span class="text-xs"><strong>{{ b.bird_count.toLocaleString() }}</strong> / {{ b.initial_bird_count.toLocaleString() }} birds · {{ b.status }}</span>
            </li>
            <li v-if="!d.batches.length" class="py-2 text-sm text-light-subtext dark:text-dark-subtext">No batches yet: the farm may need help getting started.</li>
          </ul>
        </section>
      </div>

      <section class="rounded-xl shadow bg-light-accent dark:bg-dark-accent p-4">
        <h2 class="font-semibold mb-2">M-Pesa payments</h2>
        <div class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead><tr class="text-left border-b border-light-border dark:border-dark-border"><th class="p-2">Date</th><th class="p-2">Amount</th><th class="p-2">Status</th><th class="p-2">Phone</th><th class="p-2">Receipt</th><th class="p-2">Note</th></tr></thead>
            <tbody>
              <tr v-for="p in d.payments" :key="p.id" class="border-b border-light-border/30 dark:border-dark-border">
                <td class="p-2 whitespace-nowrap">{{ dateTime(p.created_at) }}</td>
                <td class="p-2 font-semibold">{{ kes(p.amount) }}<span v-if="p.discount_amount" class="text-xs text-light-subtext"> (−{{ kes(p.discount_amount) }})</span></td>
                <td class="p-2"><span :class="['px-2 py-0.5 rounded-full text-xs font-semibold', billingClass(p.status)]">{{ p.status }}</span></td>
                <td class="p-2">{{ p.phone_number }}</td>
                <td class="p-2 font-mono text-xs">{{ p.mpesa_reference || '—' }}</td>
                <td class="p-2 text-xs text-light-subtext dark:text-dark-subtext">{{ p.result_description }}</td>
              </tr>
              <tr v-if="!d.payments.length"><td colspan="6" class="p-2 text-light-subtext dark:text-dark-subtext">No payments yet.</td></tr>
            </tbody>
          </table>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useApi } from '~/composables/useApi'
import { kes, ago, date, dateTime, billingClass, productionLabel } from '~/composables/format'

const api = useApi()
const id = useRoute().params.id
const d = ref(null)
const plans = ref([])
const error = ref('')
const busy = ref(false)
const notice = ref(null)
const extendDays = ref(14)
const planId = ref(null)

const recordLabel = { egg_productions: 'Egg collections', sales: 'Sales', expenses: 'Expenses', bird_movements: 'Bird movements', vaccinations: 'Vaccinations', flocks: 'New batches' }
const birds = computed(() => d.value.batches.filter((b) => b.status === 'active').reduce((s, b) => s + b.bird_count, 0))
const activeBatches = computed(() => d.value.batches.filter((b) => b.status === 'active').length)
const records = computed(() => Object.values(d.value.last_30_days.records).reduce((a, b) => a + b, 0))
const activeDays = computed(() => d.value.activity.filter((x) => x.count > 0).length)
const totalPaid = computed(() => d.value.payments.filter((p) => p.status === 'success').reduce((s, p) => s + p.amount, 0))

async function load() {
  try {
    d.value = (await api.get(`/admin/farms/${id}/overview`)).data
    planId.value = d.value.farm.plan_id
  } catch (e) {
    error.value = e?.response?.data?.error || e.message
  }
}
onMounted(async () => {
  await load()
  api.get('/admin/plans').then((r) => (plans.value = r.data.plans || r.data || [])).catch(() => {})
})

async function updateBilling(body, okText) {
  busy.value = true
  notice.value = null
  try {
    await api.put(`/admin/farms/${id}/billing`, body)
    notice.value = { text: okText }
    await load()
  } catch (e) {
    notice.value = { error: true, text: e?.response?.data?.error || e.message }
  } finally {
    busy.value = false
  }
}
function extendTrial() {
  const from = new Date(Math.max(Date.now(), new Date(d.value.farm.trial_ends_at).getTime()))
  from.setDate(from.getDate() + extendDays.value)
  updateBilling({ trial_ends_at: from.toISOString() }, `Trial extended to ${date(from)}`)
}
function changePlan() {
  updateBilling({ plan_id: planId.value }, 'Plan changed')
}
</script>
