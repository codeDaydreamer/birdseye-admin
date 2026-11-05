<template>
  <div class="space-y-6 text-light-text dark:text-dark-text">
    <div>
      <h1 class="text-2xl font-bold">Farm subscriptions</h1>
      <p class="text-sm text-light-subtext dark:text-dark-subtext">
        Every farm, its plan and billing state. Extend a trial or move a farm to another plan here.
      </p>
    </div>

    <FarmStats />

    <p v-if="notice" :class="['p-3 rounded-lg', notice.error ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800']">
      {{ notice.text }}
    </p>

    <div class="flex flex-col sm:flex-row gap-3">
      <input
        v-model="search"
        placeholder="Search farm or owner"
        class="flex-1 p-2 border rounded-lg bg-light-bg dark:bg-dark-bg border-light-border dark:border-dark-border"
      />
      <select v-model="statusFilter" class="p-2 border rounded-lg bg-light-bg dark:bg-dark-bg border-light-border dark:border-dark-border">
        <option value="">All statuses</option>
        <option value="trial">On trial</option>
        <option value="paid">Paid</option>
        <option value="unpaid">Unpaid</option>
      </select>
    </div>

    <div class="overflow-x-auto rounded-lg shadow bg-light-accent dark:bg-dark-accent">
      <table class="min-w-full text-sm">
        <thead>
          <tr class="text-left border-b border-light-border dark:border-dark-border">
            <th class="p-3">Farm</th>
            <th class="p-3">Owner</th>
            <th class="p-3">Plan</th>
            <th class="p-3">Status</th>
            <th class="p-3">Trial ends</th>
            <th class="p-3">Paid until</th>
            <th class="p-3">Staff</th>
            <th class="p-3"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="farmsStore.loading">
            <td colspan="8" class="p-3">Loading...</td>
          </tr>
          <tr v-else-if="!filteredFarms.length">
            <td colspan="8" class="p-3 text-light-subtext dark:text-dark-subtext">No farms found.</td>
          </tr>
          <tr v-for="farm in filteredFarms" :key="farm.id" class="border-b border-light-border dark:border-dark-border">
            <td class="p-3 font-semibold">{{ farm.name }}</td>
            <td class="p-3">{{ farm.owner_username }}<br /><span class="text-xs text-light-subtext dark:text-dark-subtext">{{ farm.owner_email }}</span></td>
            <td class="p-3">{{ farm.plan_name || '—' }}<span v-if="farm.plan_name" class="text-xs"> ({{ farm.billing_period }})</span></td>
            <td class="p-3">
              <span :class="['px-2 py-0.5 rounded text-xs text-white', statusColour(farm.payment_status)]">{{ farm.payment_status }}</span>
            </td>
            <td class="p-3">{{ formatDate(farm.trial_ends_at) }}</td>
            <td class="p-3">{{ formatDate(farm.paid_until) }}</td>
            <td class="p-3">{{ farm.staff_count }}</td>
            <td class="p-3 text-right">
              <button @click="openEdit(farm)" class="text-primary hover:underline">Manage</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Extend trial / change plan -->
    <div v-if="editing" class="fixed inset-0 bg-gray-500 bg-opacity-75 z-50 flex justify-center items-center p-4">
      <form @submit.prevent="saveEdit" class="bg-light-bg dark:bg-dark-bg rounded-xl p-6 w-full max-w-md shadow-xl space-y-4">
        <h3 class="text-2xl font-bold">{{ editing.name }}</h3>
        <div>
          <label class="block text-sm mb-1">Trial ends on</label>
          <input v-model="editing.trialDate" type="date" class="w-full p-2 border rounded-lg bg-light-bg dark:bg-dark-bg border-light-border dark:border-dark-border" />
          <div class="grid grid-cols-3 gap-2 mt-2 text-xs">
            <button v-for="d in [7, 14, 30]" :key="d" type="button" @click="extendBy(d)" class="px-2 py-1 rounded border border-light-border dark:border-dark-border">
              +{{ d }} days from today
            </button>
          </div>
        </div>
        <div>
          <label class="block text-sm mb-1">Plan</label>
          <select v-model="editing.planId" class="w-full p-2 border rounded-lg bg-light-bg dark:bg-dark-bg border-light-border dark:border-dark-border">
            <option :value="null" disabled>Choose a plan</option>
            <option v-for="p in pricing.plans" :key="p.id" :value="p.id">{{ p.name }}{{ p.is_active ? '' : ' (inactive)' }}</option>
          </select>
          <p class="text-xs text-light-subtext dark:text-dark-subtext mt-1">
            Changes which limits and features apply now. It doesn't change what they've paid for.
          </p>
        </div>
        <p v-if="formError" class="text-red-600 text-sm">{{ formError }}</p>
        <div class="grid grid-cols-2 gap-3 pt-2 sm:flex sm:justify-end">
          <button type="button" @click="editing = null" class="px-4 py-2 rounded-lg border border-light-border dark:border-dark-border">Cancel</button>
          <button type="submit" class="px-4 py-2 rounded-lg bg-primary text-white">Save</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useFarmsStore } from '~/stores/farms'
import { usePricingStore } from '~/stores/pricing'
import FarmStats from '~/components/FarmStats.vue'

const farmsStore = useFarmsStore()
const pricing = usePricingStore()

const search = ref('')
const statusFilter = ref('')
const editing = ref(null)
const formError = ref('')
const notice = ref(null)

const filteredFarms = computed(() => {
  const q = search.value.toLowerCase()
  return farmsStore.farms.filter((f) =>
    (!statusFilter.value || f.payment_status === statusFilter.value) &&
    (!q || f.name.toLowerCase().includes(q) || (f.owner_username || '').toLowerCase().includes(q) ||
      (f.owner_email || '').toLowerCase().includes(q))
  )
})

const formatDate = (v) => (v ? new Date(v).toLocaleDateString() : '—')
const statusColour = (s) => ({ paid: 'bg-green-600', trial: 'bg-blue-600', unpaid: 'bg-red-600' }[s] || 'bg-gray-500')
const toDateInput = (v) => (v ? new Date(v).toISOString().slice(0, 10) : '')

const openEdit = (farm) => {
  formError.value = ''
  editing.value = { id: farm.id, name: farm.name, trialDate: toDateInput(farm.trial_ends_at), planId: farm.plan_id ?? null,
                    original: { trialDate: toDateInput(farm.trial_ends_at), planId: farm.plan_id ?? null } }
}

const extendBy = (days) => {
  const d = new Date()
  d.setDate(d.getDate() + days)
  editing.value.trialDate = d.toISOString().slice(0, 10)
}

const saveEdit = async () => {
  const e = editing.value
  const changes = {}
  if (e.trialDate && e.trialDate !== e.original.trialDate) changes.trial_ends_at = new Date(`${e.trialDate}T23:59:59`).toISOString()
  if (e.planId && e.planId !== e.original.planId) changes.plan_id = e.planId
  if (!Object.keys(changes).length) {
    editing.value = null
    return
  }
  const error = await pricing.updateFarmBilling(e.id, changes)
  if (error) {
    formError.value = error
    return
  }
  notice.value = { text: `${e.name} updated.` }
  setTimeout(() => (notice.value = null), 4000)
  editing.value = null
  await farmsStore.loadFarms()
}

onMounted(() => {
  farmsStore.loadFarms()
  pricing.loadAll()
})
</script>
