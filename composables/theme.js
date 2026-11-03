// Light / dark / system theme, remembered per browser
import { ref, readonly } from 'vue'

const KEY = 'birdseye-admin.theme'
const choice = ref('system')
let media = null

function apply() {
  const dark = choice.value === 'dark' || (choice.value === 'system' && !!media?.matches)
  document.documentElement.classList.toggle('dark', dark)
}

/** Call once from app.vue */
export function initTheme() {
  media = window.matchMedia('(prefers-color-scheme: dark)')
  try {
    const v = localStorage.getItem(KEY)
    choice.value = v === 'light' || v === 'dark' ? v : 'system'
  } catch { /* storage blocked */ }
  apply()
  media.addEventListener('change', apply)
}

export function useTheme() {
  return {
    choice: readonly(choice),
    set(v) {
      choice.value = v
      try {
        if (v === 'system') localStorage.removeItem(KEY)
        else localStorage.setItem(KEY, v)
      } catch { /* storage blocked: still applies for this visit */ }
      apply()
    },
  }
}
