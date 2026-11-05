<template>
  <div class="space-y-6 text-light-text dark:text-dark-text">
    <div>
      <h1 class="text-2xl font-bold">Keys and integrations</h1>
      <p class="text-sm text-light-subtext dark:text-dark-subtext max-w-3xl">
        Keys saved here are encrypted in the database and take effect straight away, with no restart. They override the
        server's environment variables; clear one to go back to the environment value. Secrets are never shown again
        after saving, only their last 4 characters. Saving needs your password.
      </p>
    </div>
    <p v-if="error" class="p-3 rounded-lg bg-red-100 text-red-800">{{ error }}</p>

    <div v-if="!groups.length && !error" class="grid gap-6 xl:grid-cols-2">
      <div v-for="i in 4" :key="i" class="h-56 rounded-xl bg-light-accent dark:bg-dark-accent animate-pulse"></div>
    </div>

    <div class="grid gap-6 xl:grid-cols-2">
      <section v-for="g in groups" :key="g.id" class="min-w-0 rounded-xl shadow bg-light-accent dark:bg-dark-accent p-4 sm:p-5 flex flex-col">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <h2 class="font-semibold flex items-center gap-2"><i :class="['mdi', icons[g.id]]"></i>{{ g.title }}</h2>
            <p class="text-xs text-light-subtext dark:text-dark-subtext mt-0.5">{{ g.about }}</p>
          </div>
          <span :class="['shrink-0 px-2 py-0.5 rounded-full text-xs font-semibold', g.configured ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300']">
            {{ g.configured ? 'Set up' : 'Not set up' }}
          </span>
        </div>

        <div class="mt-4 space-y-4 flex-1">
          <div v-for="f in g.fields" :key="f.key">
            <div class="flex items-center justify-between gap-2">
              <label :for="f.key" class="text-sm font-medium">{{ f.label }}</label>
              <span class="text-[11px] text-light-subtext dark:text-dark-subtext">
                <template v-if="clear[f.key]"><span class="text-red-600">will be cleared</span></template>
                <template v-else-if="f.source === 'console'">saved here{{ f.updated_at ? ' ' + ago(f.updated_at) : '' }}</template>
                <template v-else-if="f.source === 'env'">from server environment</template>
                <template v-else>not set</template>
              </span>
            </div>
            <p v-if="f.preview && !editing[f.key]" class="mt-1 flex items-center gap-2">
              <code class="flex-1 truncate text-xs px-2 py-1.5 rounded bg-light-bg dark:bg-dark-bg">{{ f.preview }}</code>
              <button type="button" class="text-xs hover:underline" @click="startEdit(f)">{{ f.secret ? 'Replace' : 'Change' }}</button>
              <button v-if="f.source === 'console'" type="button" class="text-xs text-red-600 hover:underline" @click="toggleClear(f)">{{ clear[f.key] ? 'Keep' : 'Clear' }}</button>
            </p>
            <template v-else>
              <textarea v-if="f.multiline" :id="f.key" v-model="draft[f.key]" rows="4" :placeholder="f.placeholder" spellcheck="false" autocomplete="off"
                class="mt-1 w-full p-2 text-xs font-mono border rounded-lg bg-light-bg dark:bg-dark-bg border-light-border dark:border-dark-border placeholder:text-light-subtext/50 dark:placeholder:text-dark-subtext/40"></textarea>
              <div v-else class="mt-1 flex gap-2">
                <input :id="f.key" v-model="draft[f.key]" :type="f.secret && !reveal[f.key] ? 'password' : 'text'" :placeholder="f.placeholder" spellcheck="false" autocomplete="off"
                  class="flex-1 min-w-0 p-2 text-sm border rounded-lg bg-light-bg dark:bg-dark-bg border-light-border dark:border-dark-border placeholder:text-light-subtext/50 dark:placeholder:text-dark-subtext/40" />
                <button v-if="f.secret" type="button" class="px-2 text-light-subtext dark:text-dark-subtext" :aria-label="reveal[f.key] ? 'Hide' : 'Show'" @click="reveal[f.key] = !reveal[f.key]">
                  <i :class="['mdi', reveal[f.key] ? 'mdi-eye-off-outline' : 'mdi-eye-outline']"></i>
                </button>
                <button v-if="f.preview" type="button" class="text-xs hover:underline" @click="cancelEdit(f)">Cancel</button>
              </div>
            </template>
            <p v-if="f.help" class="mt-1 text-[11px] text-light-subtext dark:text-dark-subtext">{{ f.help }}</p>
          </div>
        </div>

        <div class="mt-5 pt-4 border-t border-light-border/40 dark:border-dark-border grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center">
          <button :class="['px-3 py-2 text-sm rounded-lg bg-primary text-white disabled:opacity-50', !hasExtra(g) && 'col-span-2 sm:col-auto']" :disabled="!changed(g)" @click="askSave(g)">Save</button>
          <template v-if="g.id === 'email'">
            <input v-model="testTo" type="email" placeholder="you@example.com" aria-label="Send a test email to"
              class="col-span-2 order-first sm:order-none sm:flex-1 min-w-0 sm:min-w-[10rem] p-2 text-sm border rounded-lg bg-light-bg dark:bg-dark-bg border-light-border dark:border-dark-border placeholder:text-light-subtext/50 dark:placeholder:text-dark-subtext/40" />
            <button class="px-3 py-2 text-sm rounded-lg border border-light-border dark:border-dark-border disabled:opacity-50" :disabled="!testTo || busy.email" @click="testEmail">Send test</button>
          </template>
          <button v-if="g.id === 'dynapay'" class="px-3 py-2 text-sm rounded-lg border border-light-border dark:border-dark-border disabled:opacity-50" :disabled="busy.dynapay" @click="testDynapay">Test connection</button>
          <button v-if="g.id === 'push'" class="px-3 py-2 text-sm rounded-lg border border-light-border dark:border-dark-border" @click="askGenerate">Generate new key pair</button>
          <p v-if="notes[g.id]" :class="['w-full text-xs', notes[g.id].error ? 'text-red-600' : 'text-green-700 dark:text-green-400']">{{ notes[g.id].text }}</p>
        </div>
      </section>
    </div>

    <!-- Password confirmation -->
    <div v-if="confirm" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" @click.self="confirm = null">
      <form class="w-full max-w-sm rounded-xl bg-light-accent dark:bg-dark-accent p-5 shadow-xl space-y-3" @submit.prevent="runConfirm">
        <h3 class="font-semibold">{{ confirm.title }}</h3>
        <p class="text-sm text-light-subtext dark:text-dark-subtext">{{ confirm.text }}</p>
        <input ref="pwInput" v-model="password" type="password" autocomplete="current-password" placeholder="Your password" aria-label="Your password"
          class="w-full p-2 text-sm border rounded-lg bg-light-bg dark:bg-dark-bg border-light-border dark:border-dark-border placeholder:text-light-subtext/50 dark:placeholder:text-dark-subtext/40" />
        <p v-if="confirmError" class="text-xs text-red-600">{{ confirmError }}</p>
        <div class="flex justify-end gap-2">
          <button type="button" class="px-3 py-2 text-sm rounded-lg border border-light-border dark:border-dark-border" @click="confirm = null">Cancel</button>
          <button type="submit" class="px-3 py-2 text-sm rounded-lg bg-primary text-white disabled:opacity-50" :disabled="!password || confirmBusy">{{ confirm.action }}</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, nextTick, onMounted } from 'vue'
import { useApi } from '~/composables/useApi'
import { ago } from '~/composables/format'

const api = useApi()
const groups = ref([])
// Groups with a second action next to Save (the two share the footer row evenly on phones)
const hasExtra = (g) => ['email', 'dynapay', 'push'].includes(g.id)
const error = ref('')
const draft = reactive({})
const editing = reactive({})
const reveal = reactive({})
const clear = reactive({})
const notes = reactive({})
const busy = reactive({})
const testTo = ref('')
const confirm = ref(null)
const password = ref('')
const confirmError = ref('')
const confirmBusy = ref(false)
const pwInput = ref(null)
const icons = { email: 'mdi-email-outline', push: 'mdi-bell-outline', fcm: 'mdi-cellphone-message', google: 'mdi-google', dynapay: 'mdi-cellphone-check' }

const msg = (e) => e?.response?.data?.error || e.message

function reset(data) {
  groups.value = data.groups
  for (const g of data.groups) for (const f of g.fields) {
    draft[f.key] = ''
    editing[f.key] = false
    clear[f.key] = false
  }
}
async function load() {
  try {
    reset((await api.get('/admin/config')).data)
  } catch (e) {
    error.value = msg(e)
  }
}
onMounted(load)

function startEdit(f) { editing[f.key] = true; draft[f.key] = f.secret ? '' : f.preview; nextTick(() => document.getElementById(f.key)?.focus()) }
function cancelEdit(f) { editing[f.key] = false; draft[f.key] = '' }
function toggleClear(f) { clear[f.key] = !clear[f.key] }
const edited = (f) => (editing[f.key] || !f.preview) && draft[f.key].trim() !== '' && draft[f.key].trim() !== (f.secret ? '' : f.preview)
const changed = (g) => g.fields.some((f) => edited(f) || clear[f.key])

function openConfirm(c) {
  confirm.value = c
  password.value = ''
  confirmError.value = ''
  nextTick(() => pwInput.value?.focus())
}
function askSave(g) {
  openConfirm({ title: `Save ${g.title}`, text: 'Enter your password to change these keys. The change applies immediately.', action: 'Save', group: g.id,
    run: (pw) => {
      const set = {}, clr = []
      for (const f of g.fields) {
        if (clear[f.key]) clr.push(f.key)
        else if (edited(f)) set[f.key] = draft[f.key]
      }
      return api.put('/admin/config', { password: pw, set, clear: clr })
    }, done: 'Saved. The new keys are in use.' })
}
function askGenerate() {
  openConfirm({ title: 'Generate a new push key pair', text: 'Browsers already signed up for notifications stop getting them until the person opens the app again. Enter your password to continue.',
    action: 'Generate', group: 'push', run: (pw) => api.post('/admin/config/vapid', { password: pw }), done: 'New key pair saved. The web app picks it up on next load.' })
}
async function runConfirm() {
  const c = confirm.value
  confirmBusy.value = true
  confirmError.value = ''
  try {
    const r = await c.run(password.value)
    reset(r.data)
    notes[c.group] = { text: c.done }
    confirm.value = null
  } catch (e) {
    if (e?.response?.status === 401) confirmError.value = msg(e)
    else { notes[c.group] = { error: true, text: msg(e) }; confirm.value = null }
  } finally {
    confirmBusy.value = false
    password.value = ''
  }
}

async function testEmail() {
  busy.email = true
  try { notes.email = { text: (await api.post('/admin/config/test/email', { to: testTo.value })).data.message } }
  catch (e) { notes.email = { error: true, text: msg(e) } }
  finally { busy.email = false }
}
async function testDynapay() {
  busy.dynapay = true
  try { notes.dynapay = { text: (await api.post('/admin/config/test/dynapay')).data.message } }
  catch (e) { notes.dynapay = { error: true, text: msg(e) } }
  finally { busy.dynapay = false }
}
</script>
