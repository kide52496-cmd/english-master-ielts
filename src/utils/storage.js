const STORAGE_KEY = 'english_master_progress_v1'
const REVIEW_KEY = 'ema_review_v1'
const REVIEW_ACTIVITY_KEY = 'ema_review_activity_v1'
const DARK_MODE_KEY = 'ema_darkMode'

// Bumped whenever the saved shape changes in a way that needs fixing up on
// load. `migrate()` below is the only place that knows about older shapes.
const SCHEMA_VERSION = 2

// Runtime-only fields: recomputed on every boot, so writing them wastes space
// and re-importing them would resurrect stale UI state.
const TRANSIENT_KEYS = ['newAchievements', 'hydrated']

function hasStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

function migrate(saved) {
  if (!saved || typeof saved !== 'object') return null
  const version = Number(saved.__v || 1)

  // v1 → v2: `readPassages` (Reading Library) did not exist. Absent is
  // equivalent to empty, so there is nothing to move — the key is just
  // declared here so a v1 save is stamped and stops being re-migrated.
  if (version < 2) {
    saved = { ...saved, readPassages: Array.isArray(saved.readPassages) ? saved.readPassages : [] }
  }

  return { ...saved, __v: SCHEMA_VERSION }
}

export function loadProgress() {
  try {
    if (!hasStorage()) return null
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) return null
    return migrate(JSON.parse(data))
  } catch {
    return null
  }
}

// The last write failure, if any. `Settings` reads this to tell the user their
// progress is no longer being saved instead of failing silently forever.
let lastSaveError = null
export function getLastSaveError() {
  return lastSaveError
}

// Remembering the last serialized payload turns a no-op save (the common case
// when an effect re-fires without a real change) into a string compare instead
// of a localStorage write.
let lastSerialized = null

export function saveProgress(state) {
  try {
    if (!hasStorage()) return
    const payload = { __v: SCHEMA_VERSION, ...state }
    TRANSIENT_KEYS.forEach(k => { delete payload[k] })

    const serialized = JSON.stringify(payload)
    if (serialized === lastSerialized) return

    localStorage.setItem(STORAGE_KEY, serialized)
    lastSerialized = serialized
    lastSaveError = null
  } catch (e) {
    // Almost always QuotaExceededError (or Safari private mode, where the
    // quota is zero). Keep it visible without spamming a hot effect.
    if (!lastSaveError) console.warn('Could not save progress:', e)
    lastSaveError = e && e.name ? e.name : 'SaveError'
  }
}

export function clearProgress() {
  try {
    if (!hasStorage()) return
    localStorage.removeItem(STORAGE_KEY)
    lastSerialized = null
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
    // The identity cache now describes a payload that is no longer on disk.
    lastSerialized = null
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
    lastSerialized = null
  } catch {}
}
