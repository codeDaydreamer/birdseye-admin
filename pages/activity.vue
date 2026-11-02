<template>
  <div class="space-y-6 text-light-text dark:text-dark-text">
    <div>
      <h1 class="text-2xl font-bold">Activity</h1>
      <p class="text-sm text-light-subtext dark:text-dark-subtext">Sign-ups, new farms, payments, staff joining and new batches, newest first.</p>
    </div>
    <div class="flex flex-wrap gap-2">
      <button v-for="k in kinds" :key="k.value" :class="['px-3 py-1.5 rounded-full text-sm', kind === k.value ? 'bg-primary text-white' : 'bg-light-accent dark:bg-dark-accent']" @click="kind = k.value">{{ k.label }}</button>
    </div>
    <section class="rounded-xl shadow bg-light-accent dark:bg-dark-accent p-4">
      <ActivityList :items="items.filter((a) => !kind || a.kind === kind)" />
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useApi } from '~/composables/useApi'

const api = useApi()
const items = ref([])
const kind = ref('')
const kinds = [
  { value: '', label: 'Everything' }, { value: 'signup', label: 'Sign-ups' }, { value: 'farm', label: 'Farms' },
  { value: 'payment', label: 'Payments' }, { value: 'staff', label: 'Staff' }, { value: 'batch', label: 'Batches' },
]
onMounted(async () => {
  items.value = (await api.get('/admin/activity', { params: { limit: 200 } })).data.activity
})
</script>
