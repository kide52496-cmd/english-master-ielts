import { dayKey } from './dates'

const SRS_KEY = 'ema_review_v1'

// SM-2 style tuning constants.
const DEFAULT_EASE = 2.5
const MIN_EASE = 1.3
const MAX_EASE = 3.2
const MAX_INTERVAL = 365      // days — no point scheduling further out
const AGAIN_STEP_MINUTES = 10
const LEARNING_STEPS = [1, 3] // days for the first two successful reviews

// ── Persistence ────────────────────────────────────────────────────────────

export function loadReviewData() {
  try {
    const raw = localStorage.getItem(SRS_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    // A tampered or half-written value must not crash every screen that reads
    // the review pool — an empty pool is recoverable, a throw is not.
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {}
    // Drop entries that are not card-shaped so downstream `.filter` callbacks
    // never see a null or a string.
    const clean = {}
    for (const [id, card] of Object.entries(parsed)) {
      if (card && typeof card === 'object' && !Array.isArray(card)) clean[id] = card
    }
    return clean
  } catch { return {} }
}

export function saveReviewData(data) {
  try {
    if (!data || typeof data !== 'object') return false
    localStorage.setItem(SRS_KEY, JSON.stringify(data))
    return true
  } catch {
    return false
  }
}

// ── Card factory helpers ───────────────────────────────────────────────────

function blankSRS() {
  return {
    interval: 0,
    nextReview: null,
    lastReview: null,
    correct: 0,
    incorrect: 0,
    // SM-2 style fields. `ease` multiplies the interval on each success, so a
    // card the user keeps getting right moves away fast, while a card they keep
    // failing stays close. `reps` counts consecutive successes (0 after a lapse)
    // and drives the two fixed learning steps.
    ease: DEFAULT_EASE,
    reps: 0,
    lapses: 0,
  }
}

export function buildVocabCard(word) {
  return {
    id: `vocab__${word.id}`,
    source: 'vocabulary',
    english: word.english,
    vietnamese: word.vietnamese,
    example: word.example || '',
    pronunciation: word.pronunciation || '',
    level: word.level || '',
    ...blankSRS(),
  }
}

export function buildStoryCard(storyId, w) {
  const slug = w.word.replace(/\s+/g, '-')
  return {
    id: `story__${storyId}_${slug}`,
    source: 'story',
    english: w.word,
    vietnamese: w.vi,
    example: w.example || '',
    pronunciation: '',
    level: 'Story',
    ...blankSRS(),
  }
}

export function buildIELTSCard(w) {
  return {
    id: `ielts__${w.word.replace(/\s+/g, '-')}`,
    source: 'ielts',
    english: w.word,
    vietnamese: w.vi,
    example: w.example || '',
    pronunciation: w.pronunciation || '',
    level: 'IELTS',
    ...blankSRS(),
  }
}

export function buildGrammarCard(lesson) {
  // Use the lesson's first practice question as a concrete recall prompt.
  // Front = question, back = correct answer + explanation.
  const q = Array.isArray(lesson.practice) && lesson.practice.length > 0
    ? lesson.practice[0]
    : null
  const front = q?.question
    ? q.question
    : `${lesson.title} — ${lesson.structure || 'Ôn lại cấu trúc'}`
  const back = q?.correctAnswer != null
    ? String(q.correctAnswer)
    : (lesson.titleVi || 'Xem lại bài học')
  return {
    id: `grammar__${lesson.id}`,
    source: 'grammar',
    english: front,
    vietnamese: back,
    example: q?.explanation || lesson.structure || '',
    pronunciation: '',
    level: lesson.level || 'Grammar',
    ...blankSRS(),
  }
}

// ── SRS scheduling ─────────────────────────────────────────────────────────
// rating: 'again' | 'hard' | 'good' | 'easy'
//
// The previous version mapped each rating to a FIXED interval
// ({again:0, hard:1, good:3, easy:7}), so a card answered 'good' twenty times
// in a row still came back every three days — the schedule never graduated and
// `getMasteredCards` (which needs a long interval) could never fire from
// 'good' alone. This version grows the interval by a per-card ease factor, so
// well-known cards drift out to weeks/months and shaky ones stay close.

const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n))

function readSRS(card) {
  const num = (v, fallback) => (Number.isFinite(Number(v)) ? Number(v) : fallback)
  const interval = Math.max(0, num(card?.interval, 0))
  const inferredReps = interval >= LEARNING_STEPS[LEARNING_STEPS.length - 1]
    ? LEARNING_STEPS.length
    : (interval > 0 ? 1 : 0)

  return {
    interval,
    correct:   Math.max(0, num(card?.correct, 0)),
    incorrect: Math.max(0, num(card?.incorrect, 0)),
    lapses:    Math.max(0, num(card?.lapses, 0)),
    ease:      clamp(num(card?.ease, DEFAULT_EASE), MIN_EASE, MAX_EASE),
    reps:      Math.max(0, num(card?.reps, inferredReps)),
  }
}

export function scheduleCard(card, rating) {
  const now = new Date()
  const prev = readSRS(card)

  let { interval, ease, reps, lapses, correct, incorrect } = prev
  let minutes = 0

  switch (rating) {
    case 'again':
      // Lapse: back to the learning steps, ease down, revisit within the hour.
      reps = 0
      interval = 0
      lapses += 1
      incorrect += 1
      ease = clamp(ease - 0.2, MIN_EASE, MAX_EASE)
      minutes = AGAIN_STEP_MINUTES
      break

    case 'hard':
      // Counts as a success, but only just: grow slowly and lower the ease.
      correct += 1
      reps += 1
      ease = clamp(ease - 0.15, MIN_EASE, MAX_EASE)
      interval = interval > 0 ? Math.max(1, Math.round(interval * 1.2)) : 1
      break

    case 'easy':
      correct += 1
      reps += 1
      ease = clamp(ease + 0.15, MIN_EASE, MAX_EASE)
      interval = reps <= LEARNING_STEPS.length
        ? LEARNING_STEPS[LEARNING_STEPS.length - 1]
        : Math.max(1, Math.round(interval * ease * 1.3))
      break

    case 'good':
    default:
      correct += 1
      reps += 1
      interval = reps <= LEARNING_STEPS.length
        ? LEARNING_STEPS[reps - 1]
        : Math.max(1, Math.round(interval * ease))
      break
  }

  interval = Math.min(interval, MAX_INTERVAL)

  const next = new Date(now)
  if (minutes > 0) next.setMinutes(next.getMinutes() + minutes)
  else next.setDate(next.getDate() + interval)

  return {
    ...card,
    interval,
    ease,
    reps,
    lapses,
    correct,
    incorrect,
    nextReview: next.toISOString(),
    lastReview: now.toISOString(),
  }
}

// ── Query helpers ──────────────────────────────────────────────────────────

// A card is "mature" once it survives three weeks between reviews — the point
// where recall is reliable rather than merely recent. It used to be 7 days,
// which the old fixed-interval scheduler could only ever reach via 'easy'.
const MATURE_INTERVAL = 21

export function isDueToday(card) {
  if (!card || !card.nextReview) return true
  const due = new Date(card.nextReview).getTime()
  // A corrupt timestamp should surface the card for review, not hide it forever.
  if (!Number.isFinite(due)) return true
  return due <= Date.now()
}

export function getDueCards(data) {
  return Object.values(data || {}).filter(isDueToday)
}

export function getWeakCards(data) {
  return Object.values(data || {}).filter(c => c && c.incorrect > 0 && c.incorrect >= c.correct)
}

export function getMasteredCards(data) {
  return Object.values(data || {}).filter(c => c && c.interval >= MATURE_INTERVAL && c.correct >= 3)
}

// ── Sync learned words into review pool ───────────────────────────────────
// Call on mount; only adds new cards, never overwrites existing SRS progress.

export function syncFromAppState(reviewData, appState, vocabList, storyList, ieltsVocabList, grammarList) {
  const updated = { ...reviewData }
  let changed = false

  const add = (card) => {
    if (!updated[card.id]) { updated[card.id] = card; changed = true }
  }

  // Vocabulary words
  ;(appState.learnedWords || []).forEach(wid => {
    const word = vocabList.find(v => v.id === wid)
    if (word) add(buildVocabCard(word))
  })

  // Story vocabulary (words from read stories)
  ;(appState.readStories || []).forEach(sid => {
    const story = storyList.find(s => s.id === sid)
    if (story?.vocabularyFocus) {
      story.vocabularyFocus.forEach(w => add(buildStoryCard(sid, w)))
    }
  })

  // IELTS vocabulary
  ;(appState.ieltsProgress?.learnedVocab || []).forEach(wordStr => {
    const word = ieltsVocabList.find(v => v.word === wordStr)
    if (word) add(buildIELTSCard(word))
  })

  // Completed grammar lessons → one recall card each
  if (Array.isArray(grammarList)) {
    ;(appState.completedGrammar || []).forEach(lessonId => {
      const lesson = grammarList.find(l => l.id === lessonId)
      if (lesson) add(buildGrammarCard(lesson))
    })
  }

  if (changed) saveReviewData(updated)
  return changed ? updated : reviewData
}

// ── Daily activity tracking ────────────────────────────────────────────────

const ACTIVITY_KEY = 'ema_review_activity_v1'
const MAX_ACTIVITY_DAYS = 30

/**
 * Local-calendar day key (YYYY-MM-DD). Re-exported from `dates.js` so existing
 * call sites that import it from here keep working.
 *
 * `toISOString().slice(0,10)` was used here before, which is the *UTC* day. In
 * UTC+7 that means everything studied between midnight and 7am was filed under
 * the previous day, so the streak chart showed an empty column for a day the
 * user had actually studied.
 */
export { dayKey }

export function loadActivity() {
  try {
    const raw = localStorage.getItem(ACTIVITY_KEY)
    const parsed = raw ? JSON.parse(raw) : {}
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {}
  } catch { return {} }
}

export function recordActivity(count = 1) {
  const today = dayKey()
  const data = loadActivity()
  const add = Math.max(1, Number.isFinite(Number(count)) ? Number(count) : 1)
  data[today] = Math.max(0, Number(data[today]) || 0) + add

  // Keep only the most recent 30 days. Keys are zero-padded YYYY-MM-DD, so a
  // plain lexicographic sort is chronological.
  const keys = Object.keys(data).sort()
  if (keys.length > MAX_ACTIVITY_DAYS) {
    keys.slice(0, keys.length - MAX_ACTIVITY_DAYS).forEach(k => delete data[k])
  }
  try { localStorage.setItem(ACTIVITY_KEY, JSON.stringify(data)) } catch {}
  return data
}

export function getLast7DaysActivity() {
  const data = loadActivity()
  const days = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = dayKey(d)
    const label = d.toLocaleDateString('vi-VN', { weekday: 'short' })
    days.push({ key, label, count: Math.max(0, Number(data[key]) || 0) })
  }
  return days
}
