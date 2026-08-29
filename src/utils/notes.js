// Notes & saved mistakes (per-user, local-only).
// Stores ad-hoc notes the user creates plus auto-saved mistakes
// from quizzes / dictation / speaking. All persisted in localStorage.

const NOTES_KEY = 'ema_notes_v1'

function load() {
  try {
    const raw = localStorage.getItem(NOTES_KEY)
    if (!raw) return { notes: [], mistakes: [] }
    const parsed = JSON.parse(raw)
    return {
      notes:    Array.isArray(parsed?.notes)    ? parsed.notes    : [],
      mistakes: Array.isArray(parsed?.mistakes) ? parsed.mistakes : [],
    }
  } catch {
    return { notes: [], mistakes: [] }
  }
}

function save(data) {
  try { localStorage.setItem(NOTES_KEY, JSON.stringify(data)) } catch {}
}

function uid() {
  return 'n_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

export function getNotes() {
  return load()
}

export function addNote({ title = '', body = '', tags = [] }) {
  const data = load()
  data.notes = [
    {
      id: uid(),
      title: String(title || '').slice(0, 120),
      body:  String(body  || '').slice(0, 4000),
      tags:  Array.isArray(tags) ? tags.slice(0, 8) : [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    ...data.notes,
  ]
  save(data)
  return data
}

export function updateNote(id, patch) {
  const data = load()
  data.notes = data.notes.map(n => n.id === id
    ? { ...n, ...patch, updatedAt: Date.now() }
    : n
  )
  save(data)
  return data
}

export function deleteNote(id) {
  const data = load()
  data.notes = data.notes.filter(n => n.id !== id)
  save(data)
  return data
}

// ── mistakes ─────────────────────────────────────────────────────────────

const MISTAKE_SOURCES = ['quiz', 'dictation', 'speaking', 'grammar', 'reading']

const SRS_INTERVALS_DAYS = [1, 2, 4, 7, 14, 30, 60]

function blankSRS() {
  return {
    interval: 0,        // index in SRS_INTERVALS_DAYS, 0 = first interval
    nextReview: Date.now(),
    lastReview: null,
    correct: 0,
    wrong: 0,
  }
}

function ensureSrs(m) {
  if (m && m.srs && typeof m.srs === 'object') return m
  return { ...m, srs: blankSRS() }
}

export function recordMistake({ source, prompt, correct, given, hint }) {
  if (!MISTAKE_SOURCES.includes(source)) source = 'quiz'
  const data = load()
  // de-duplicate same prompt within 1 day
  const key = `${source}:${String(prompt || '').slice(0, 80)}`
  const recent = data.mistakes.find(m =>
    m.key === key && (Date.now() - m.createdAt < 24 * 60 * 60 * 1000)
  )
  if (recent) {
    recent.count = (recent.count || 1) + 1
    recent.updatedAt = Date.now()
    if (!recent.srs) recent.srs = blankSRS()
  } else {
    data.mistakes = [
      {
        id: uid(),
        key,
        source,
        prompt:  String(prompt  || '').slice(0, 400),
        correct: String(correct || '').slice(0, 400),
        given:   String(given   || '').slice(0, 400),
        hint:    String(hint    || '').slice(0, 400),
        count: 1,
        mastered: false,
        srs: blankSRS(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      ...data.mistakes,
    ]
  }
  // Keep last 200 mistakes
  data.mistakes = data.mistakes.slice(0, 200)
  save(data)
  return data
}

export function reviewMistakeSRS(id, gotItRight) {
  const data = load()
  data.mistakes = data.mistakes.map(m => {
    if (m.id !== id) return m
    const cur = ensureSrs(m).srs
    const next = { ...cur, lastReview: Date.now() }
    if (gotItRight) {
      next.correct = (cur.correct || 0) + 1
      const newIdx = Math.min(cur.interval + 1, SRS_INTERVALS_DAYS.length - 1)
      next.interval = newIdx
      next.nextReview = Date.now() + SRS_INTERVALS_DAYS[newIdx] * 24 * 60 * 60 * 1000
    } else {
      next.wrong = (cur.wrong || 0) + 1
      next.interval = 0
      next.nextReview = Date.now() + 10 * 60 * 1000 // 10 minutes
    }
    return { ...m, srs: next, updatedAt: Date.now() }
  })
  save(data)
  return data
}

export function markMistakeMastered(id, mastered = true) {
  const data = load()
  data.mistakes = data.mistakes.map(m => m.id === id
    ? { ...m, mastered, updatedAt: Date.now() }
    : m
  )
  save(data)
  return data
}

export function deleteMistake(id) {
  const data = load()
  data.mistakes = data.mistakes.filter(m => m.id !== id)
  save(data)
  return data
}

export function clearMastered() {
  const data = load()
  data.mistakes = data.mistakes.filter(m => !m.mastered)
  save(data)
  return data
}

export function getDueMistakes() {
  const data = load()
  const now = Date.now()
  return data.mistakes
    .filter(m => !m.mastered)
    .map(ensureSrs)
    .filter(m => (m.srs?.nextReview || 0) <= now)
    .sort((a, b) => (a.srs?.nextReview || 0) - (b.srs?.nextReview || 0))
}

export function getMistakeStats() {
  const data = load()
  const now = Date.now()
  const total = data.mistakes.length
  const mastered = data.mistakes.filter(m => m.mastered).length
  const bySource = {}
  let due = 0
  data.mistakes.forEach(m => {
    bySource[m.source] = (bySource[m.source] || 0) + 1
    const ms = ensureSrs(m).srs
    if (!m.mastered && (ms?.nextReview || 0) <= now) due++
  })
  return { total, mastered, pending: total - mastered, due, bySource }
}
