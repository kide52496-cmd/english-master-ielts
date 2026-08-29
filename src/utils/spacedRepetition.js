const SRS_KEY = 'ema_review_v1'

// ── Persistence ────────────────────────────────────────────────────────────

export function loadReviewData() {
  try {
    const raw = localStorage.getItem(SRS_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch { return {} }
}

export function saveReviewData(data) {
  try {
    localStorage.setItem(SRS_KEY, JSON.stringify(data))
  } catch {}
}

// ── Card factory helpers ───────────────────────────────────────────────────

function blankSRS() {
  return { interval: 0, nextReview: null, lastReview: null, correct: 0, incorrect: 0 }
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

const INTERVALS = { again: 0, hard: 1, good: 3, easy: 7 }

export function scheduleCard(card, rating) {
  const now = new Date()
  const interval = INTERVALS[rating] ?? 1
  const next = new Date(now)
  if (interval === 0) {
    next.setMinutes(next.getMinutes() + 10) // again → 10 min
  } else {
    next.setDate(next.getDate() + interval)
  }
  return {
    ...card,
    interval,
    nextReview: next.toISOString(),
    lastReview: now.toISOString(),
    correct:   rating === 'again' ? card.correct   : card.correct + 1,
    incorrect: rating === 'again' ? card.incorrect + 1 : card.incorrect,
  }
}

// ── Query helpers ──────────────────────────────────────────────────────────

export function isDueToday(card) {
  if (!card.nextReview) return true
  return new Date(card.nextReview) <= new Date()
}

export function getDueCards(data) {
  return Object.values(data).filter(isDueToday)
}

export function getWeakCards(data) {
  return Object.values(data).filter(c => c.incorrect > 0 && c.incorrect >= c.correct)
}

export function getMasteredCards(data) {
  return Object.values(data).filter(c => c.interval >= 7 && c.correct >= 3)
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

export function loadActivity() {
  try {
    const raw = localStorage.getItem(ACTIVITY_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch { return {} }
}

export function recordActivity(count = 1) {
  const today = new Date().toISOString().slice(0, 10)
  const data = loadActivity()
  data[today] = (data[today] || 0) + count
  // Keep only last 30 days
  const keys = Object.keys(data).sort()
  if (keys.length > 30) {
    keys.slice(0, keys.length - 30).forEach(k => delete data[k])
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
    const key = d.toISOString().slice(0, 10)
    const label = d.toLocaleDateString('vi-VN', { weekday: 'short' })
    days.push({ key, label, count: data[key] || 0 })
  }
  return days
}
