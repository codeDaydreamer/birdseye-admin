<template>
  <div class="space-y-6 text-light-text dark:text-dark-text">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h1 class="text-2xl font-bold">Pricing</h1>
        <p class="text-sm text-light-subtext dark:text-dark-subtext">
          Plans farms can buy, promo codes, and the free trial. Changes apply straight away.
        </p>
      </div>
      <div class="flex gap-2">
        <button
          v-for="t in tabs"
          :key="t.key"
          @click="tab = t.key"
          :class="['px-4 py-2 rounded-lg border border-light-border dark:border-dark-border transition',
                   tab === t.key ? 'bg-primary text-white' : 'hover:bg-light-accent dark:hover:bg-dark-accent']"
        >
          {{ t.label }}
        </button>
      </div>
    </div>

    <p v-if="notice" :class="['p-3 rounded-lg', notice.error ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800']">
      {{ notice.text }}
    </p>
    <p v-if="pricing.error" class="p-3 rounded-lg bg-red-100 text-red-800">{{ pricing.error }}</p>
    <p v-if="pricing.loading" class="text-light-subtext dark:text-dark-subtext">Loading...</p>

    <!-- Plans -->
    <section v-if="tab === 'plans' && !pricing.loading" class="space-y-4">
      <div class="flex justify-end">
        <button @click="openPlan()" class="px-4 py-2 rounded-lg bg-primary text-white">
          <i class="mdi mdi-plus"></i> New plan
        </button>
      </div>
      <p v-if="!pricing.plans.length" class="text-light-subtext dark:text-dark-subtext">
        No plans yet. Until you create one, farms aren't limited and can't pay.
      </p>
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <div
          v-for="plan in pricing.plans"
          :key="plan.id"
          :class="['p-5 rounded-lg shadow bg-light-accent dark:bg-dark-accent space-y-3', !plan.is_active && 'opacity-60']"
        >
          <div class="flex items-start justify-between gap-2">
            <div>
              <h2 class="text-xl font-semibold">{{ plan.name }}</h2>
              <p class="text-sm text-light-subtext dark:text-dark-subtext">{{ plan.description }}</p>
            </div>
            <div class="flex flex-col items-end gap-1 text-xs">
              <span v-if="plan.is_default" class="px-2 py-0.5 rounded bg-primary text-white">Default</span>
              <span v-if="!plan.is_active" class="px-2 py-0.5 rounded bg-gray-500 text-white">Inactive</span>
            </div>
          </div>
          <div class="text-lg">
            <span v-if="plan.monthly_price">{{ money(plan.monthly_price) }}<span class="text-sm">/month</span></span>
            <span v-if="plan.monthly_price && plan.yearly_price"> · </span>
            <span v-if="plan.yearly_price">{{ money(plan.yearly_price) }}<span class="text-sm">/year</span></span>
          </div>
          <ul class="text-sm space-y-1">
            <li><i class="mdi mdi-account-multiple"></i> {{ limitText(plan.max_staff, 'staff') }}</li>
            <li><i class="mdi mdi-home-group"></i> {{ limitText(plan.max_flocks, 'flocks') }}</li>
            <li><i class="mdi mdi-bird"></i> {{ limitText(plan.max_birds, 'birds') }}</li>
            <li v-for="f in pricing.features" :key="f.key">
              <i :class="plan.features?.[f.key] ? 'mdi mdi-check text-green-600' : 'mdi mdi-close text-red-500'"></i>
              {{ f.label }}
            </li>
          </ul>
          <div class="flex gap-3 pt-2">
            <button @click="openPlan(plan)" class="text-primary hover:underline">Edit</button>
            <button @click="removePlan(plan)" class="text-red-600 hover:underline">Delete</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Promo codes -->
    <section v-if="tab === 'promos' && !pricing.loading" class="space-y-4">
      <div class="flex justify-end">
        <button @click="openPromo()" class="px-4 py-2 rounded-lg bg-primary text-white">
          <i class="mdi mdi-plus"></i> New promo code
        </button>
      </div>
      <div class="overflow-x-auto rounded-lg shadow bg-light-accent dark:bg-dark-accent">
        <table class="min-w-full text-sm">
          <thead>
            <tr class="text-left border-b border-light-border dark:border-dark-border">
              <th class="p-3">Code</th>
              <th class="p-3">Discount</th>
              <th class="p-3">Plan</th>
              <th class="p-3">Valid</th>
              <th class="p-3">Used</th>
              <th class="p-3">Status</th>
              <th class="p-3"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!pricing.promoCodes.length">
              <td colspan="7" class="p-3 text-light-subtext dark:text-dark-subtext">No promo codes yet.</td>
            </tr>
            <tr v-for="promo in pricing.promoCodes" :key="promo.id" class="border-b border-light-border dark:border-dark-border">
              <td class="p-3 font-mono font-semibold">{{ promo.code }}</td>
              <td class="p-3">{{ promo.discount_type === 'percent' ? `${promo.discount_value}%` : money(promo.discount_value) }} off</td>
              <td class="p-3">{{ planName(promo.plan_id) }}</td>
              <td class="p-3">{{ validity(promo) }}</td>
              <td class="p-3">{{ promo.redemption_count }}{{ promo.max_redemptions ? ` / ${promo.max_redemptions}` : '' }}</td>
              <td class="p-3">{{ promo.is_active ? 'Active' : 'Disabled' }}</td>
              <td class="p-3 text-right whitespace-nowrap">
                <button @click="openPromo(promo)" class="text-primary hover:underline mr-3">Edit</button>
                <button @click="togglePromo(promo)" class="hover:underline">{{ promo.is_active ? 'Disable' : 'Enable' }}</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Trial & billing settings -->
    <section v-if="tab === 'settings' && settingsForm" class="max-w-xl p-5 rounded-lg shadow bg-light-accent dark:bg-dark-accent">
      <form @submit.prevent="saveSettings" class="space-y-4">
        <label class="flex items-center gap-3">
          <input v-model="settingsForm.trial_enabled" type="checkbox" class="w-5 h-5" />
          <span>Give new farms a free trial</span>
        </label>
        <div>
          <label class="block text-sm mb-1">Trial length (days)</label>
          <input v-model.number="settingsForm.trial_days" :disabled="!settingsForm.trial_enabled" type="number" min="0" max="365" :class="inputClass" />
        </div>
        <div>
          <label class="block text-sm mb-1">Grace period after a subscription ends (days)</label>
          <input v-model.number="settingsForm.grace_period_days" type="number" min="0" max="60" :class="inputClass" />
          <p class="text-xs text-light-subtext dark:text-dark-subtext mt-1">Farms keep access this long after their paid period before they're asked to pay.</p>
        </div>
        <div>
          <label class="block text-sm mb-1">Currency</label>
          <input v-model="settingsForm.currency" type="text" maxlength="10" :class="inputClass" />
        </div>
        <p class="text-xs text-light-subtext dark:text-dark-subtext">
          Trial changes apply to farms created from now on. To give an existing farm more time, extend its trial on the Subscriptions page.
        </p>
        <button type="submit" class="px-4 py-2 rounded-lg bg-primary text-white">Save settings</button>
      </form>
    </section>

    <!-- Plan editor -->
    <div v-if="planForm" class="fixed inset-0 bg-gray-500 bg-opacity-75 z-50 flex justify-center items-center p-4">
      <form @submit.prevent="savePlan" class="bg-light-bg dark:bg-dark-bg rounded-xl p-6 w-full max-w-lg shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
        <h3 class="text-2xl font-bold">{{ planForm.id ? 'Edit plan' : 'New plan' }}</h3>
        <div>
          <label class="block text-sm mb-1">Name</label>
          <input v-model="planForm.name" required maxlength="100" :class="inputClass" />
        </div>
        <div>
          <label class="block text-sm mb-1">Description</label>
          <textarea v-model="planForm.description" rows="2" :class="inputClass"></textarea>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-sm mb-1">Monthly price</label>
            <input v-model.number="planForm.monthly_price" type="number" min="0" step="1" :class="inputClass" />
          </div>
          <div>
            <label class="block text-sm mb-1">Yearly price</label>
            <input v-model.number="planForm.yearly_price" type="number" min="0" step="1" :class="inputClass" />
          </div>
        </div>
        <p class="text-xs text-light-subtext dark:text-dark-subtext -mt-2">Leave a price at 0 to not offer that billing period.</p>
        <div class="grid grid-cols-3 gap-3">
          <div>
            <label class="block text-sm mb-1">Max staff</label>
            <input v-model.number="planForm.max_staff" type="number" min="0" :class="inputClass" />
          </div>
          <div>
            <label class="block text-sm mb-1">Max flocks</label>
            <input v-model.number="planForm.max_flocks" type="number" min="0" :class="inputClass" />
          </div>
          <div>
            <label class="block text-sm mb-1">Max birds</label>
            <input v-model.number="planForm.max_birds" type="number" min="0" :class="inputClass" />
          </div>
        </div>
        <p class="text-xs text-light-subtext dark:text-dark-subtext -mt-2">0 means unlimited. Staff includes the owner.</p>
        <fieldset class="space-y-2">
          <legend class="text-sm mb-1">Included features</legend>
          <label v-for="f in pricing.features" :key="f.key" class="flex items-start gap-3">
            <input v-model="planForm.features[f.key]" type="checkbox" class="w-5 h-5 mt-0.5" />
            <span>{{ f.label }} <span class="text-xs text-light-subtext dark:text-dark-subtext">— {{ f.description }}</span></span>
          </label>
        </fieldset>
        <div class="grid grid-cols-2 gap-3">
          <label class="flex items-center gap-3"><input v-model="planForm.is_active" type="checkbox" class="w-5 h-5" /> Offered to farms</label>
          <label class="flex items-center gap-3"><input v-model="planForm.is_default" type="checkbox" class="w-5 h-5" /> Default for new farms</label>
        </div>
        <div>
          <label class="block text-sm mb-1">Display order</label>
          <input v-model.number="planForm.sort_order" type="number" :class="inputClass" />
        </div>
        <p v-if="formError" class="text-red-600 text-sm">{{ formError }}</p>
        <div class="flex justify-end gap-3 pt-2">
          <button type="button" @click="planForm = null" class="px-4 py-2 rounded-lg border border-light-border dark:border-dark-border">Cancel</button>
          <button type="submit" class="px-4 py-2 rounded-lg bg-primary text-white">Save plan</button>
        </div>
      </form>
    </div>

    <!-- Promo code editor -->
    <div v-if="promoForm" class="fixed inset-0 bg-gray-500 bg-opacity-75 z-50 flex justify-center items-center p-4">
      <form @submit.prevent="savePromo" class="bg-light-bg dark:bg-dark-bg rounded-xl p-6 w-full max-w-lg shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
        <h3 class="text-2xl font-bold">{{ promoForm.id ? 'Edit promo code' : 'New promo code' }}</h3>
        <div>
          <label class="block text-sm mb-1">Code</label>
          <input v-model="promoForm.code" required maxlength="50" class="uppercase" :class="inputClass" />
        </div>
        <div>
          <label class="block text-sm mb-1">Description (internal)</label>
          <input v-model="promoForm.description" :class="inputClass" />
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-sm mb-1">Discount type</label>
            <select v-model="promoForm.discount_type" :class="inputClass">
              <option value="percent">Percentage</option>
              <option value="fixed">Fixed amount</option>
            </select>
          </div>
          <div>
            <label class="block text-sm mb-1">{{ promoForm.discount_type === 'percent' ? 'Percent off' : 'Amount off' }}</label>
            <input v-model.number="promoForm.discount_value" type="number" min="0" :max="promoForm.discount_type === 'percent' ? 100 : undefined" required :class="inputClass" />
          </div>
        </div>
        <div>
          <label class="block text-sm mb-1">Only for plan</label>
          <select v-model="promoForm.plan_id" :class="inputClass">
            <option :value="null">Any plan</option>
            <option v-for="p in pricing.plans" :key="p.id" :value="p.id">{{ p.name }}</option>
          </select>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-sm mb-1">Valid from</label>
            <input v-model="promoForm.valid_from_date" type="date" :class="inputClass" />
          </div>
          <div>
            <label class="block text-sm mb-1">Valid until</label>
            <input v-model="promoForm.valid_until_date" type="date" :class="inputClass" />
          </div>
        </div>
        <div>
          <label class="block text-sm mb-1">Max uses (0 = unlimited)</label>
          <input v-model.number="promoForm.max_redemptions" type="number" min="0" :class="inputClass" />
        </div>
        <label class="flex items-center gap-3"><input v-model="promoForm.is_active" type="checkbox" class="w-5 h-5" /> Active</label>
        <p v-if="formError" class="text-red-600 text-sm">{{ formError }}</p>
        <div class="flex justify-end gap-3 pt-2">
          <button type="button" @click="promoForm = null" class="px-4 py-2 rounded-lg border border-light-border dark:border-dark-border">Cancel</button>
          <button type="submit" class="px-4 py-2 rounded-lg bg-primary text-white">Save code</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { usePricingStore } from '~/stores/pricing'

const pricing = usePricingStore()

const tabs = [
  { key: 'plans', label: 'Plans' },
  { key: 'promos', label: 'Promo codes' },
  { key: 'settings', label: 'Trial & billing' },
]
const tab = ref('plans')
const notice = ref(null)
const formError = ref('')
const planForm = ref(null)
const promoForm = ref(null)
const settingsForm = ref(null)

const inputClass =
  'w-full p-2 border rounded-lg bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text border-light-border dark:border-dark-border'

const currency = computed(() => pricing.settings?.currency || 'KES')
const money = (n) => `${currency.value} ${Number(n || 0).toLocaleString()}`
const limitText = (n, what) => (n > 0 ? `Up to ${n.toLocaleString()} ${what}` : `Unlimited ${what}`)
const planName = (id) => (id ? pricing.plans.find((p) => p.id === id)?.name || `Plan #${id}` : 'Any plan')
const dateOnly = (v) => (v ? String(v).slice(0, 10) : '')
const validity = (p) => {
  const from = dateOnly(p.valid_from)
  const until = dateOnly(p.valid_until)
  if (!from && !until) return 'Always'
  return `${from || '…'} → ${until || '…'}`
}

const flash = (text, error = false) => {
  notice.value = { text, error }
  setTimeout(() => (notice.value = null), 4000)
}

watch(
  () => pricing.settings,
  (s) => {
    settingsForm.value = s ? { ...s } : null
  },
  { immediate: true }
)

const openPlan = (plan) => {
  formError.value = ''
  planForm.value = plan
    ? { ...plan, features: { ...(plan.features || {}) } }
    : { name: '', description: '', monthly_price: 0, yearly_price: 0, max_staff: 0, max_flocks: 0, max_birds: 0,
        features: {}, is_active: true, is_default: !pricing.plans.length, sort_order: pricing.plans.length + 1 }
}

const savePlan = async () => {
  const error = await pricing.savePlan(planForm.value)
  if (error) {
    formError.value = error
    return
  }
  flash(`Plan "${planForm.value.name}" saved.`)
  planForm.value = null
}

const removePlan = async (plan) => {
  if (!window.confirm(`Delete the "${plan.name}" plan?`)) return
  const res = await pricing.deletePlan(plan.id)
  flash(res.error || res.message, !!res.error)
}

const openPromo = (promo) => {
  formError.value = ''
  promoForm.value = promo
    ? { ...promo, valid_from_date: dateOnly(promo.valid_from), valid_until_date: dateOnly(promo.valid_until) }
    : { code: '', description: '', discount_type: 'percent', discount_value: 10, plan_id: null,
        valid_from_date: '', valid_until_date: '', max_redemptions: 0, is_active: true }
}

// Date inputs give YYYY-MM-DD; "until" runs to the end of that day
const promoPayload = (form) => {
  const { valid_from_date, valid_until_date, ...rest } = form
  return {
    ...rest,
    valid_from: valid_from_date ? new Date(`${valid_from_date}T00:00:00`).toISOString() : null,
    valid_until: valid_until_date ? new Date(`${valid_until_date}T23:59:59`).toISOString() : null,
  }
}

const savePromo = async () => {
  const error = await pricing.savePromoCode(promoPayload(promoForm.value))
  if (error) {
    formError.value = error
    return
  }
  flash(`Promo code ${promoForm.value.code.toUpperCase()} saved.`)
  promoForm.value = null
}

const togglePromo = async (promo) => {
  const error = await pricing.savePromoCode({ ...promo, is_active: !promo.is_active })
  flash(error || `${promo.code} ${promo.is_active ? 'disabled' : 'enabled'}.`, !!error)
}

const saveSettings = async () => {
  const error = await pricing.saveSettings(settingsForm.value)
  flash(error || 'Settings saved.', !!error)
}

onMounted(() => pricing.loadAll())
</script>
