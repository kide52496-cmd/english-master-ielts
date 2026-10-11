// One definition of "today".
//
// The app previously mixed three incompatible notions of a calendar day:
//   - `new Date().toDateString()`            → local day, human-readable
//   - `new Date().toISOString().slice(0,10)` → UTC day, sortable
//   - ad-hoc `getDate()` comparisons
//
// In UTC+7 (the app's audience) the UTC day lags the local one by 7 hours, so
// anything studied between midnight and 7am was filed under the previous day:
// streak charts showed empty columns for days the user had studied, and daily
// missions reset at 7am instead of midnight.
//
// Everything date-related should now come from here.

/** Sortable local-calendar key, e.g. `2026-08-30`. */
export function dayKey(date = new Date()) {
  const d = date instanceof Date ? date : new Date(date)
  if (Number.isNaN(d.getTime())) return dayKey(new Date())
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** Today's local key. */
export function todayKey() {
  return dayKey()
}

/** `dayKey` for N days before today (N may be negative for the future). */
export function dayKeyOffset(days) {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return dayKey(d)
}

/** True when two values fall on the same local calendar day. */
export function isSameLocalDay(a, b) {
  if (!a || !b) return false
  const da = a instanceof Date ? a : new Date(a)
  const db = b instanceof Date ? b : new Date(b)
  if (Number.isNaN(da.getTime()) || Number.isNaN(db.getTime())) return false
  return dayKey(da) === dayKey(db)
}

/** Whole local days between two dates (b - a), ignoring the time of day. */
export function daysBetween(a, b = new Date()) {
  const da = a instanceof Date ? a : new Date(a)
  const db = b instanceof Date ? b : new Date(b)
  if (Number.isNaN(da.getTime()) || Number.isNaN(db.getTime())) return 0
  const midnight = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
  return Math.round((midnight(db) - midnight(da)) / 86400000)
}

/** The last `count` local day keys, oldest first, ending today. */
export function recentDayKeys(count = 7) {
  const out = []
  for (let i = count - 1; i >= 0; i--) out.push(dayKeyOffset(i))
  return out
}
