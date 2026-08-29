const STORAGE_KEY = 'english_master_progress_v1'
const REVIEW_KEY = 'ema_review_v1'
const REVIEW_ACTIVITY_KEY = 'ema_review_activity_v1'
const DARK_MODE_KEY = 'ema_darkMode'

function hasStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

export function loadProgress() {
  try {
    if (!hasStorage()) return null
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

export function saveProgress(state) {
  try {
    if (!hasStorage()) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (e) {
    console.warn('Could not save progress:', e)
  }
}

export function clearProgress() {
  try {
    if (!hasStorage()) return
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}

// Prefixes that cover every key this app writes to localStorage:
//   english_master_progress_v1 (main state), ema_* (srs, streak, course,
//   mission, goal, notes, dark mode...), emi_* (writing drafts).
// Using prefixes means new keys are captured automatically in future.
const EXPORT_PREFIXES = ['english_master_', 'ema_', 'emi_']
const EXPORT_VERSION = 2

function isExportableKey(key) {
  return EXPORT_PREFIXES.some(p => key.startsWith(p))
}

export function exportAllProgress() {
  if (!hasStorage()) return {}
  const data = {}
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && isExportableKey(key)) {
      const value = localStorage.getItem(key)
      if (value !== null) data[key] = value
    }
  }
  // Wrap with metadata so imports can be validated and dated.
  return {
    __emi_backup__: true,
    version: EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    data,
  }
}

export function importAllProgress(payload) {
  if (!hasStorage() || !payload || typeof payload !== 'object') return false
  try {
    // Accept both the new wrapped format and the legacy flat format.
    const data = payload.__emi_backup__ && payload.data && typeof payload.data === 'object'
      ? payload.data
      : payload

    const entries = Object.entries(data).filter(
      ([key, value]) => typeof key === 'string' && isExportableKey(key) && typeof value === 'string'
    )
    if (entries.length === 0) return false

    // Validate that JSON-shaped values actually parse, so a corrupt file
    // cannot poison storage and crash the app on next load.
    for (const [key, value] of entries) {
      const looksJson = value.startsWith('{') || value.startsWith('[')
      if (looksJson) {
        try { JSON.parse(value) } catch { return false }
      }
    }

    entries.forEach(([key, value]) => localStorage.setItem(key, value))
    return true
  } catch {
    return false
  }
}

export function clearAllProgress() {
  try {
    if (!hasStorage()) return
    const toRemove = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      // Keep the dark-mode preference; wipe everything else app-related.
      if (key && isExportableKey(key) && key !== DARK_MODE_KEY) toRemove.push(key)
    }
    toRemove.forEach(key => localStorage.removeItem(key))
  } catch {}
}
