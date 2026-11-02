<template>
  <div class="space-y-6 text-light-text dark:text-dark-text">
    <div class="flex items-end justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold">System health</h1>
        <p class="text-sm text-light-subtext dark:text-dark-subtext">Checked {{ s ? dateTime(s.checked_at) : '…' }}</p>
      </div>
      <button class="px-3 py-2 rounded-lg bg-light-accent dark:bg-dark-accent text-sm" @click="load"><i class="mdi mdi-refresh"></i> Refresh</button>
    </div>
    <template v-if="s">
      <div class="grid gap-4 md:grid-cols-3">
        <Check label="Database" :ok="s.database.ok" :detail="s.database.ok ? `${s.database.latency_ms} ms · ${s.database.pool.open} connections` : 'unreachable'" />
        <Check label="Dynapay (M-Pesa)" :ok="s.dynapay.configured && s.dynapay.ok" :detail="!s.dynapay.configured ? 'Not configured: DYNAPAY_API_URL / DYNAPAY_CLIENT_ID missing' : s.dynapay.ok ? `reachable, ${s.dynapay.latency_ms} ms` : s.dynapay.error || `HTTP ${s.dynapay.status}`" />
        <Check label="Payments" :ok="!s.payments.stuck_over_20m" :detail="`${s.payments.initiated} waiting · ${s.payments.stuck_over_20m} stuck over 20 min`" />
      </div>
      <section class="rounded-xl shadow bg-light-accent dark:bg-dark-accent p-4">
        <h2 class="font-semibold mb-3">Configuration</h2>
        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Check v-for="(ok, k) in s.config" :key="k" :label="configLabel[k] || k" :ok="ok" :detail="ok ? 'configured' : configHelp[k]" small />
        </div>
      </section>
      <div class="grid gap-6 md:grid-cols-2">
        <section class="rounded-xl shadow bg-light-accent dark:bg-dark-accent p-4">
          <h2 class="font-semibold mb-3">Server</h2>
          <dl class="text-sm space-y-1.5">
            <div class="flex justify-between"><dt>Up for</dt><dd>{{ uptime }}</dd></div>
            <div class="flex justify-between"><dt>Go</dt><dd>{{ s.server.go }}</dd></div>
            <div class="flex justify-between"><dt>Memory</dt><dd>{{ s.server.memory_mb }} MB</dd></div>
            <div class="flex justify-between"><dt>Goroutines</dt><dd>{{ s.server.goroutines }}</dd></div>
          </dl>
        </section>
        <section class="rounded-xl shadow bg-light-accent dark:bg-dark-accent p-4">
          <h2 class="font-semibold mb-3">Database rows</h2>
          <dl class="text-sm grid grid-cols-2 gap-x-6 gap-y-1.5">
            <div v-for="(n, t) in s.database.rows" :key="t" class="flex justify-between"><dt class="font-mono text-xs">{{ t }}</dt><dd>{{ n.toLocaleString() }}</dd></div>
          </dl>
        </section>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, h } from 'vue'
import { useApi } from '~/composables/useApi'
import { dateTime } from '~/composables/format'

const api = useApi()
const s = ref(null)
const configLabel = { email: 'Email (Resend)', web_push: 'Web push (VAPID)', google_login: 'Google sign-in', dynapay_webhooks: 'Dynapay webhook secret', firebase_push: 'Android push (Firebase)' }
const configHelp = { email: 'Set RESEND_API_KEY and EMAIL_FROM', web_push: 'Set VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY', google_login: 'Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET', dynapay_webhooks: 'Set DYNAPAY_WEBHOOK_SECRET or payment results will be rejected', firebase_push: 'Set FIREBASE_SERVICE_ACCOUNT_FILE or _JSON' }
const uptime = computed(() => {
  const t = s.value.server.uptime_seconds
  return t > 86400 ? `${Math.floor(t / 86400)} d ${Math.floor((t % 86400) / 3600)} h` : `${Math.floor(t / 3600)} h ${Math.floor((t % 3600) / 60)} min`
})

const Check = (props) =>
  h('div', { class: ['rounded-xl shadow bg-light-accent dark:bg-dark-accent flex items-start gap-3', props.small ? 'p-3 shadow-none bg-light-bg dark:bg-dark-bg' : 'p-4'] }, [
    h('i', { class: ['mdi text-2xl', props.ok ? 'mdi-check-circle text-green-600' : 'mdi-alert-circle text-red-500'] }),
    h('div', [h('p', { class: 'font-semibold text-sm' }, props.label), h('p', { class: 'text-xs text-light-subtext dark:text-dark-subtext' }, props.detail)]),
  ])
Check.props = ['label', 'ok', 'detail', 'small']

async function load() {
  s.value = (await api.get('/admin/system')).data
}
onMounted(load)
</script>
