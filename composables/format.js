// Display helpers for the admin console

export const kes = (n) => `KES ${Math.round(Number(n || 0)).toLocaleString('en-KE')}`

export const compact = (n) => {
  const v = Number(n || 0)
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`
  if (v >= 10_000) return `${Math.round(v / 1000)}K`
  return Math.round(v).toLocaleString('en-KE')
}

export const date = (v) => (v ? new Date(v).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' }) : '—')
export const dateTime = (v) => (v ? new Date(v).toLocaleString('en-KE', { dateStyle: 'medium', timeStyle: 'short' }) : '—')

export const ago = (v) => {
  if (!v) return 'never'
  const s = Math.round((Date.now() - new Date(v).getTime()) / 1000)
  if (s < 0) {
    const f = -s
    return f < 86400 ? `in ${Math.max(1, Math.round(f / 3600))} h` : `in ${Math.round(f / 86400)} d`
  }
  if (s < 60) return 'just now'
  if (s < 3600) return `${Math.floor(s / 60)} min ago`
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`
  if (s < 86400 * 60) return `${Math.floor(s / 86400)} d ago`
  return date(v)
}

export const billingClass = (s) =>
  ({
    paid: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
    trial: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
    unpaid: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
    success: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
    failed: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
    initiated: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
    refunded: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
  }[s] || 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300')

export const productionLabel = {
  layers: 'Layers', broilers: 'Broilers', kienyeji: 'Kienyeji', breeders: 'Breeders', chicks: 'Chicks for sale',
}
