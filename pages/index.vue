<template>
  <div class="space-y-6 text-light-text dark:text-dark-text">
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold">What's happening in Birdseye</h1>
        <p class="text-sm text-light-subtext dark:text-dark-subtext">Farms, farmers, money and usage across the platform.</p>
      </div>
      <div class="flex items-center gap-2">
        <NuxtLink v-if="system" to="/system" :class="['text-xs px-3 py-1.5 rounded-full font-semibold', healthy ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' : 'bg-amber-100 text-amber-800']">
          <i :class="['mdi', healthy ? 'mdi-check-circle' : 'mdi-alert']"></i> {{ healthy ? 'Systems normal' : 'Check system health' }}
        </NuxtLink>
        <select v-model.number="days" class="p-2 text-sm border rounded-lg bg-light-bg dark:bg-dark-bg border-light-border dark:border-dark-border" aria-label="Period">
          <option :value="7">Last 7 days</option>
          <option :value="30">Last 30 days</option>
          <option :value="90">Last 90 days</option>
          <option :value="365">Last 12 months</option>
        </select>
      </div>
    </div>

    <p v-if="error" class="p-3 rounded-lg bg-red-100 text-red-800">{{ error }}</p>

    <template v-if="d">
      <!-- Headline numbers -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Kpi label="Monthly recurring revenue" :value="kes(d.billing.mrr)" :sub="`${d.billing.status.paid} paying farms · ARR ${kes(d.billing.arr)}`" icon="mdi-cash-sync" />
        <Kpi label="Active farms (7 days)" :value="d.totals.active_farms_7d" :sub="`${pct(d.totals.active_farms_7d, d.totals.farms)} of ${d.totals.farms} farms recorded something`" icon="mdi-barn" />
        <Kpi label="New farms" :value="d.totals.new_farms" :sub="`${d.totals.new_users} new users in ${periodLabel}`" icon="mdi-account-plus" />
        <Kpi label="Trial to paid" :value="d.billing.trial_conversion == null ? '—' : `${d.billing.trial_conversion.toFixed(0)}%`" :sub="`${d.billing.converted} of ${d.billing.trials_ended} finished trials paid`"
          :tone="d.billing.trial_conversion != null && d.billing.trial_conversion < 20 ? 'bad' : undefined" icon="mdi-swap-horizontal-circle-outline" />
      </div>
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Kpi :label="`Revenue (${periodLabel})`" :value="kes(d.revenue.period)" :sub="`${d.revenue.payments_ok} payments · ${d.revenue.payments_failed} failed`" :tone="d.revenue.payments_failed > d.revenue.payments_ok ? 'bad' : undefined" icon="mdi-cellphone-check" />
        <Kpi label="Birds on Birdseye" :value="compact(d.totals.birds)" :sub="`${d.totals.active_batches} active batches`" icon="mdi-bird" />
        <Kpi :label="`Eggs recorded (${periodLabel})`" :value="compact(d.totals.eggs)" :sub="`${compact(Math.round(d.totals.eggs / 30))} trays`" icon="mdi-egg-outline" />
        <Kpi :label="`Farm sales recorded (${periodLabel})`" :value="kes(d.totals.sales_recorded)" :sub="`Expenses ${kes(d.totals.expenses_recorded)}`" icon="mdi-storefront-outline" />
      </div>

      <!-- Growth and engagement -->
      <div class="grid gap-6 xl:grid-cols-2">
        <section class="rounded-xl shadow bg-light-accent dark:bg-dark-accent p-4">
          <h2 class="font-semibold">Farms recording each day</h2>
          <p class="text-xs text-light-subtext dark:text-dark-subtext mb-3">Distinct farms that logged eggs, sales, expenses, birds, vaccinations or batches.</p>
          <InsightChart type="line" :labels="labels" :datasets="[{ label: 'Active farms', data: d.series.active_farms.map((x) => x.count), color: '#2563EB', fill: true }]" label="Active farms per day" />
        </section>
        <section class="rounded-xl shadow bg-light-accent dark:bg-dark-accent p-4">
          <h2 class="font-semibold">Sign-ups</h2>
          <p class="text-xs text-light-subtext dark:text-dark-subtext mb-3">New users and new farms per day.</p>
          <InsightChart type="bar" :labels="labels" :datasets="[
            { label: 'Users', data: d.series.signups.map((x) => x.count), color: '#94A3B8' },
            { label: 'Farms', data: d.series.farms.map((x) => x.count), color: '#2563EB' },
          ]" label="Sign-ups per day" />
        </section>
      </div>

      <!-- Money -->
      <div class="grid gap-6 xl:grid-cols-3">
        <section class="rounded-xl shadow bg-light-accent dark:bg-dark-accent p-4 xl:col-span-2">
          <h2 class="font-semibold">Subscription revenue by month</h2>
          <p class="text-xs text-light-subtext dark:text-dark-subtext mb-3">Successful M-Pesa payments. All time: {{ kes(d.revenue.all_time) }}.</p>
          <InsightChart type="bar" money :labels="d.revenue.months.map((m) => monthLabel(m.month))" :datasets="[{ label: 'Revenue', data: d.revenue.months.map((m) => m.amount), color: '#2563EB' }]" label="Revenue per month" />
        </section>
        <section class="rounded-xl shadow bg-light-accent dark:bg-dark-accent p-4">
          <h2 class="font-semibold">Farms by billing</h2>
          <div class="mt-4 space-y-3">
            <div v-for="s in ['paid', 'trial', 'unpaid']" :key="s">
              <div class="flex justify-between text-sm"><span>{{ s === 'unpaid' ? 'Unpaid (blocked)' : s === 'trial' ? 'On trial' : 'Paying' }}</span><span class="font-semibold">{{ d.billing.status[s] }}</span></div>
              <div class="h-2 mt-1 rounded-full bg-slate-100 dark:bg-dark-bg overflow-hidden"><div :class="['h-full rounded-full', s === 'paid' ? 'bg-emerald-500' : s === 'trial' ? 'bg-primary' : 'bg-red-500']" :style="{ width: pct(d.billing.status[s], d.totals.farms) }"></div></div>
            </div>
          </div>
          <h3 class="mt-6 text-sm font-semibold">Paying farms by plan</h3>
          <ul class="mt-2 text-sm space-y-1">
            <li v-for="(n, plan) in d.billing.plan_mix" :key="plan" class="flex justify-between"><span>{{ plan }}</span><span class="font-semibold">{{ n }}</span></li>
            <li v-if="!Object.keys(d.billing.plan_mix).length" class="text-light-subtext dark:text-dark-subtext">No paying farms yet</li>
          </ul>
          <p v-if="d.revenue.payments_stuck" class="mt-4 p-2 rounded bg-amber-100 text-amber-900 text-xs">{{ d.revenue.payments_stuck }} M-Pesa payments stuck for over 20 minutes. <NuxtLink to="/payments?status=initiated" class="underline">See them</NuxtLink></p>
        </section>
      </div>

      <!-- Usage -->
      <div class="grid gap-6 xl:grid-cols-3">
        <section class="rounded-xl shadow bg-light-accent dark:bg-dark-accent p-4">
          <h2 class="font-semibold">What farmers use</h2>
          <p class="text-xs text-light-subtext dark:text-dark-subtext mb-3">Records in {{ periodLabel }} and how many farms used each.</p>
          <ul class="space-y-2.5">
            <li v-for="u in d.usage" :key="u.feature" class="text-sm">
              <div class="flex justify-between"><span>{{ u.feature }}</span><span class="text-light-subtext dark:text-dark-subtext">{{ u.records.toLocaleString() }} · {{ u.farms }} farms</span></div>
              <div class="h-1.5 mt-1 rounded-full bg-slate-100 dark:bg-dark-bg overflow-hidden"><div class="h-full bg-primary rounded-full" :style="{ width: pct(u.farms, d.totals.farms) }"></div></div>
            </li>
          </ul>
        </section>
        <section class="rounded-xl shadow bg-light-accent dark:bg-dark-accent p-4">
          <h2 class="font-semibold">Flocks on the platform</h2>
          <ul class="mt-3 space-y-2 text-sm">
            <li v-for="t in d.production_types" :key="t.production_type" class="flex justify-between">
              <span>{{ productionLabel[t.production_type] || t.production_type }}</span>
              <span><strong>{{ compact(t.birds) }}</strong> birds <span class="text-light-subtext dark:text-dark-subtext">· {{ t.batches }} batches</span></span>
            </li>
          </ul>
          <h3 class="mt-5 text-sm font-semibold">Where farms are</h3>
          <ul class="mt-2 space-y-1 text-sm">
            <li v-for="l in d.locations" :key="l.location" class="flex justify-between"><span>{{ l.location }}</span><span class="font-semibold">{{ l.farms }}</span></li>
            <li v-if="!d.locations.length" class="text-light-subtext dark:text-dark-subtext">Locations appear as farms finish setup</li>
          </ul>
        </section>
        <section class="rounded-xl shadow bg-light-accent dark:bg-dark-accent p-4">
          <h2 class="font-semibold">Most active farms</h2>
          <ul class="mt-3 space-y-2 text-sm">
            <li v-for="(f, i) in d.top_farms" :key="f.farm_id" class="flex items-center gap-2">
              <span class="w-5 text-light-subtext dark:text-dark-subtext">{{ i + 1 }}</span>
              <NuxtLink :to="`/farms/${f.farm_id}`" class="flex-1 hover:underline truncate">{{ f.name }}</NuxtLink>
              <span class="font-semibold">{{ f.records }}</span>
            </li>
          </ul>
          <p class="mt-4 text-xs text-light-subtext dark:text-dark-subtext">{{ d.totals.staff_members }} staff members across farms · {{ d.totals.logged_in_7d }} people signed in this week · {{ pct(d.totals.verified_users, d.totals.users) }} verified their email</p>
        </section>
      </div>

      <!-- Needs attention -->
      <div class="grid gap-6 xl:grid-cols-2">
        <section class="rounded-xl shadow bg-light-accent dark:bg-dark-accent p-4">
          <h2 class="font-semibold">Trials ending this week</h2>
          <p class="text-xs text-light-subtext dark:text-dark-subtext mb-3">A good moment to call: active ones are likely to convert.</p>
          <ul class="divide-y divide-light-border/30 dark:divide-dark-border">
            <li v-for="t in d.billing.trials_ending_7d" :key="t.farm_id" class="flex items-center justify-between py-2 text-sm">
              <NuxtLink :to="`/farms/${t.farm_id}`" class="hover:underline">{{ t.name }}</NuxtLink>
              <span class="flex items-center gap-2">
                <span v-if="t.active_7d" class="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300">active</span>
                <span class="text-light-subtext dark:text-dark-subtext">{{ ago(t.trial_ends_at) }}</span>
              </span>
            </li>
            <li v-if="!d.billing.trials_ending_7d.length" class="py-2 text-sm text-light-subtext dark:text-dark-subtext">None this week</li>
          </ul>
        </section>
        <section class="rounded-xl shadow bg-light-accent dark:bg-dark-accent p-4">
          <h2 class="font-semibold">Farms that went quiet</h2>
          <p class="text-xs text-light-subtext dark:text-dark-subtext mb-3">Recorded in the month before, nothing in the last 14 days.</p>
          <ul class="divide-y divide-light-border/30 dark:divide-dark-border">
            <li v-for="f in d.quiet_farms.slice(0, 8)" :key="f.farm_id" class="flex justify-between py-2 text-sm">
              <NuxtLink :to="`/farms/${f.farm_id}`" class="hover:underline">{{ f.name }}</NuxtLink>
              <span class="text-light-subtext dark:text-dark-subtext">last {{ ago(f.last_activity) }}</span>
            </li>
            <li v-if="!d.quiet_farms.length" class="py-2 text-sm text-light-subtext dark:text-dark-subtext">Everyone active is still active</li>
          </ul>
        </section>
      </div>

      <section class="rounded-xl shadow bg-light-accent dark:bg-dark-accent p-4">
        <div class="flex justify-between items-center"><h2 class="font-semibold">Latest activity</h2><NuxtLink to="/activity" class="text-sm text-primary hover:underline">All activity</NuxtLink></div>
        <ActivityList :items="activity" class="mt-2" />
      </section>
    </template>
    <div v-else-if="!error" class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="i in 8" :key="i" class="h-24 rounded-xl bg-light-accent dark:bg-dark-accent animate-pulse"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useApi } from '~/composables/useApi'
import { kes, compact, ago, productionLabel } from '~/composables/format'

const api = useApi()
const days = ref(30)
const d = ref(null)
const activity = ref([])
const system = ref(null)
const error = ref('')

const periodLabel = computed(() => (days.value === 365 ? '12 months' : `${days.value} days`))
const labels = computed(() => (d.value?.series.signups || []).map((x) => new Date(x.day + 'T00:00:00').toLocaleDateString('en-KE', { day: 'numeric', month: 'short' })))
const pct = (a, b) => (b ? `${Math.round((a / b) * 100)}%` : '0%')
const monthLabel = (m) => new Date(m + '-01T00:00:00').toLocaleDateString('en-KE', { month: 'short', year: '2-digit' })
const healthy = computed(() => !system.value || (system.value.database.ok && (!system.value.dynapay.configured || system.value.dynapay.ok) && !system.value.payments.stuck_over_20m))

async function load() {
  error.value = ''
  try {
    d.value = (await api.get('/admin/insights', { params: { days: days.value } })).data
  } catch (e) {
    error.value = e?.response?.data?.error || e.message
  }
}
watch(days, load)
onMounted(async () => {
  await load()
  api.get('/admin/activity', { params: { limit: 12 } }).then((r) => (activity.value = r.data.activity)).catch(() => {})
  api.get('/admin/system').then((r) => (system.value = r.data)).catch(() => {})
})
</script>
