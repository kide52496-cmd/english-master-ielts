// Grammar practice engine.
// Generates exercises on demand from the existing lesson data:
//   - Multiple choice (from lesson.exercises if present)
//   - Fill-in-the-blank (auto from lesson examples)
//   - Sentence reorder (shuffle words of a sentence)
//   - Error correction (insert a typical mistake)
// All deterministic per (lessonId, kind, seed) so navigation feels stable.

import { grammarLessons } from '../data/grammarLessons'

// ── seeded shuffle ───────────────────────────────────────────────────────

function mulberry32(seed) {
  let t = seed >>> 0
  return function () {
    t |= 0; t = (t + 0x6D2B79F5) | 0
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

function shuffle(arr, seed = 1) {
  const rng = mulberry32(seed)
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function pick(arr, n, seed = 1) {
  return shuffle(arr, seed).slice(0, n)
}

// ── generators ───────────────────────────────────────────────────────────

// Resolve the correct option index from a question.
// Data stores `correctAnswer` as the option TEXT (string); some items may
// store `correct` as a numeric index. Handle both robustly.
function resolveCorrectIndex(q) {
  if (!q || !Array.isArray(q.options)) return -1
  if (typeof q.correct === 'number') return q.correct
  const answer = q.correctAnswer ?? q.correct
  if (typeof answer === 'number') return answer
  if (answer == null) return -1
  const byValue = q.options.findIndex(o => o === answer)
  if (byValue >= 0) return byValue
  // Last resort: a numeric string like "2" meaning an index
  const asNum = Number(answer)
  if (Number.isInteger(asNum) && asNum >= 0 && asNum < q.options.length) return asNum
  return -1
}

function fromMultipleChoice(lesson, seed) {
  // Real authored questions live in `practice[]` and `quiz[]`.
  // (Legacy `exercises[]` is also supported if ever present.)
  const pool = [
    ...(Array.isArray(lesson.practice) ? lesson.practice : []),
    ...(Array.isArray(lesson.quiz) ? lesson.quiz : []),
    ...(Array.isArray(lesson.exercises) ? lesson.exercises : []),
  ]
  if (pool.length === 0) return []

  return pick(pool, Math.min(6, pool.length), seed)
    .map((q, i) => {
      const options = Array.isArray(q.options) ? q.options : []
      const correctIndex = resolveCorrectIndex(q)
      if (options.length < 2 || correctIndex < 0) return null
      return {
        id: `mc-${lesson.id}-${i}`,
        kind: 'mc',
        prompt: q.question || q.prompt || 'Choose the best answer:',
        options,
        correctIndex,
        explanation: q.explanation || '',
        lessonTitle: lesson.title,
      }
    })
    .filter(Boolean)
}

function fromExamples(lesson, seed) {
  const ex = Array.isArray(lesson.examples) ? lesson.examples : []
  if (ex.length === 0) return []
  const out = []
  ex.slice(0, 6).forEach((sample, i) => {
    const en = String(sample.en || sample.english || '').trim()
    if (!en) return
    const words = en.split(/\s+/)
    if (words.length < 4) return
    // pick a word with > 3 letters to blank out
    const candidateIdxs = words
      .map((w, idx) => ({ w, idx }))
      .filter(({ w }) => /^[a-zA-Z]{3,}$/.test(w))
      .map(({ idx }) => idx)
    if (candidateIdxs.length === 0) return
    const rng = mulberry32(seed + i)
    const idx = candidateIdxs[Math.floor(rng() * candidateIdxs.length)]
    const correct = words[idx].replace(/[.,!?]+$/, '')
    const sentence = words.map((w, k) => k === idx ? '____' : w).join(' ')

    // distractors: pick 3 other words from same sentence or lesson examples
    const pool = ex.flatMap(s => String(s.en || s.english || '').split(/\s+/))
      .filter(w => /^[a-zA-Z]{3,}$/.test(w) && w.toLowerCase() !== correct.toLowerCase())
    const distract = pick(pool, 3, seed + i)
    const options = shuffle([correct, ...distract], seed + i)

    out.push({
      id: `fb-${lesson.id}-${i}`,
      kind: 'fill',
      prompt: sentence,
      options,
      correctIndex: options.findIndex(o => o.toLowerCase() === correct.toLowerCase()),
      explanation: sample.vi || sample.vietnamese || '',
      lessonTitle: lesson.title,
    })
  })
  return out
}

function fromReorder(lesson, seed) {
  const ex = Array.isArray(lesson.examples) ? lesson.examples : []
  if (ex.length === 0) return []
  const out = []
  ex.slice(0, 4).forEach((sample, i) => {
    const en = String(sample.en || sample.english || '').replace(/[.,!?]+$/, '').trim()
    if (!en) return
    const words = en.split(/\s+/)
    if (words.length < 4 || words.length > 12) return
    const shuffled = shuffle(words, seed + i)
    if (shuffled.join(' ') === words.join(' ')) shuffled.reverse()
    out.push({
      id: `ro-${lesson.id}-${i}`,
      kind: 'reorder',
      prompt: 'Sắp xếp lại các từ thành câu đúng:',
      tokens: shuffled,
      correctSentence: words.join(' '),
      explanation: sample.vi || sample.vietnamese || '',
      lessonTitle: lesson.title,
    })
  })
  return out
}

function fromCommonMistakes(lesson, seed) {
  const list = Array.isArray(lesson.commonMistakes) ? lesson.commonMistakes : []
  if (list.length === 0) return []
  return list.slice(0, 4).map((m, i) => {
    const wrong   = m.mistake || m.wrong || m.bad || ''
    const correct = m.correct || m.fix   || m.good || ''
    return {
      id: `err-${lesson.id}-${i}`,
      kind: 'error',
      prompt: 'Câu nào đúng?',
      options: shuffle([correct, wrong].filter(Boolean), seed + i),
      correctSentence: correct,
      explanation: m.reason || m.explanation || '',
      lessonTitle: lesson.title,
    }
  }).filter(x => x.options.length === 2)
}

// ── public api ───────────────────────────────────────────────────────────

export function listGrammarLessons() {
  return grammarLessons.map(l => {
    const mcqCount =
      (Array.isArray(l.practice) ? l.practice.length : 0) +
      (Array.isArray(l.quiz) ? l.quiz.length : 0) +
      (Array.isArray(l.exercises) ? l.exercises.length : 0)
    return {
      id: l.id,
      title: l.title,
      titleVi: l.titleVi,
      level: l.level,
      category: l.category || l.topic || '',
      estimatedMinutes: l.estimatedMinutes || 10,
      hasExercises: mcqCount > 0,
      hasExamples:  Array.isArray(l.examples)  && l.examples.length  > 0,
    }
  })
}

/**
 * Build a mixed exercise set for a lesson.
 * @param {number} lessonId
 * @param {number} count    target number of items
 * @param {number} seed     deterministic shuffle seed
 */
export function buildExerciseSet(lessonId, count = 8, seed = 1) {
  const lesson = grammarLessons.find(l => l.id === lessonId)
  if (!lesson) return { lesson: null, items: [] }

  const items = []
  items.push(...fromMultipleChoice(lesson, seed))
  items.push(...fromExamples(lesson, seed + 7))
  items.push(...fromReorder(lesson, seed + 13))
  items.push(...fromCommonMistakes(lesson, seed + 19))

  const mixed = shuffle(items, seed + 31).slice(0, count)
  return { lesson, items: mixed }
}

/**
 * Build a "smart drill" across multiple lessons of a level.
 */
export function buildLevelDrill(level, count = 12, seed = 1) {
  const pool = grammarLessons.filter(l => !level || level === 'All' || l.level === level)
  const lessons = pick(pool, Math.min(6, pool.length), seed)
  const items = []
  lessons.forEach((l, i) => {
    items.push(...fromMultipleChoice(l, seed + i))
    items.push(...fromExamples(l, seed + i + 100))
  })
  return shuffle(items, seed + 999).slice(0, count)
}

export function gradeAnswer(item, answer) {
  if (!item) return false
  if (item.kind === 'mc' || item.kind === 'fill') {
    return Number(answer) === Number(item.correctIndex)
  }
  if (item.kind === 'error') {
    const idx = item.options.findIndex(o => o === item.correctSentence)
    return Number(answer) === idx
  }
  if (item.kind === 'reorder') {
    return String(answer || '').replace(/\s+/g, ' ').trim().toLowerCase() ===
           String(item.correctSentence || '').replace(/\s+/g, ' ').trim().toLowerCase()
  }
  return false
}
