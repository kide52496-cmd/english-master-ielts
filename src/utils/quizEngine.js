// Quiz Pro engine.
// Lazy data loading — keeps bundle thin until quiz starts.
// Question kinds:
//   - mc          : classic multiple choice
//   - vocab_ctx   : vocabulary used in context (single sentence with blank)
//   - reading     : long passage (200-400 words) + 4-6 comprehension questions
//   - gapfill     : paragraph with multiple blanks
//   - tf          : true / false on a sentence
// All deterministic per (seed) for stable navigation.

let _vocab = null
let _stories = null

async function loadVocab() {
  if (_vocab) return _vocab
  const mod = await import("../data/vocabulary")
  _vocab = mod.vocabulary
  return _vocab
}
async function loadStories() {
  if (_stories) return _stories
  const mod = await import("../data/stories")
  _stories = mod.stories
  return _stories
}

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
function pick(arr, n, seed = 1) { return shuffle(arr, seed).slice(0, n) }

function vocabPool(vocab, level) {
  if (!level || level === "All") return vocab
  return vocab.filter(w => w.level === level)
}

function genVocabMC(vocab, level, count, seed) {
  const pool = vocabPool(vocab, level).filter(w => w.english && w.vietnamese)
  const target = pick(pool, count, seed)
  const items = []
  target.forEach((w, i) => {
    const distractPool = pool.filter(x => x.id !== w.id && x.vietnamese !== w.vietnamese)
    const distract = pick(distractPool, 3, seed + i + 11).map(x => x.vietnamese)
    const options = shuffle([w.vietnamese, ...distract], seed + i + 23)
    items.push({
      id: "vmc-" + w.id + "-" + i,
      kind: "mc",
      prompt: `Nghĩa của từ "${w.english}" là gì?`,
      options,
      correctIndex: options.findIndex(o => o === w.vietnamese),
      explanation: w.example_vi || "",
    })
  })
  return items
}

function genVocabContext(vocab, level, count, seed) {
  const pool = vocabPool(vocab, level).filter(w => w.example && w.example.length > 20)
  const target = pick(pool, count, seed)
  const items = []
  target.forEach((w, i) => {
    const sentence = String(w.example).replace(new RegExp(w.english, "i"), "____")
    const distract = pick(pool.filter(x => x.id !== w.id), 3, seed + i + 7).map(x => x.english)
    const options = shuffle([w.english, ...distract], seed + i + 13)
    items.push({
      id: "vctx-" + w.id + "-" + i,
      kind: "vocab_ctx",
      prompt: "Điền từ thích hợp vào câu:",
      passage: sentence,
      options,
      correctIndex: options.findIndex(o => o === w.english),
      explanation: w.vietnamese ? `${w.english} = ${w.vietnamese}` : "",
    })
  })
  return items
}

function genReading(stories, level, count, seed) {
  const pool = stories.filter(s => s && s.content && s.content.length > 200)
  if (pool.length === 0) return []
  const target = pick(pool, Math.min(count, pool.length), seed)
  const items = []
  target.forEach((story, idx) => {
    const passage = story.content
    const subQs = []
    if (Array.isArray(story.comprehensionQuestions)) {
      story.comprehensionQuestions.slice(0, 6).forEach((q, i) => {
        const opts = Array.isArray(q.options) ? q.options : []
        if (opts.length >= 2) {
          subQs.push({
            id: "rdq-" + story.id + "-" + i,
            kind: "mc",
            prompt: q.question || q.prompt,
            options: opts,
            correctIndex: typeof q.correct === "number" ? q.correct : 0,
            explanation: q.explanation || "",
          })
        }
      })
    }
    if (subQs.length === 0) {
      const sentences = passage.split(/[.!?]+/).map(s => s.trim()).filter(Boolean)
      const first = sentences[0] || ""
      const last  = sentences[sentences.length - 1] || ""
      subQs.push({
        id: "rdq-" + story.id + "-auto",
        kind: "mc",
        prompt: "Đoạn văn nói chủ yếu về điều gì?",
        options: [
          first.slice(0, 60),
          last.slice(0, 60),
          (sentences[1] || "Một sự kiện ngẫu nhiên").slice(0, 60),
          "Không có đủ thông tin",
        ],
        correctIndex: 0,
        explanation: "Câu mở đầu thường nêu chủ đề.",
      })
    }
    items.push({
      id: "rd-" + story.id + "-" + idx,
      kind: "reading",
      prompt: story.title || "Bài đọc",
      passage,
      subQuestions: subQs,
    })
  })
  return items
}

function genGapFill(vocab, level, count, seed) {
  const pool = vocabPool(vocab, level).filter(w => w.example && w.example.length > 25)
  if (pool.length < 5) return []
  const items = []
  for (let g = 0; g < count; g++) {
    const target = pick(pool, 5, seed + g * 17)
    const blanks = target.map((w, i) => ({ idx: i, answer: w.english, source: w }))
    const paragraph = target.map((w, i) => {
      return String(w.example).replace(new RegExp(w.english, "i"), `____(${i+1})`)
    }).join(" ")
    const allChoices = shuffle(target.map(t => t.english), seed + g + 31)
    items.push({
      id: "gap-" + g + "-" + seed,
      kind: "gapfill",
      prompt: "Điền các từ vào chỗ trống cho đúng:",
      passage: paragraph,
      blanks: blanks.map(b => b.answer),
      choices: allChoices,
      explanation: target.map(t => `${t.english} = ${t.vietnamese}`).join("\n"),
    })
  }
  return items
}

function genTrueFalse(vocab, level, count, seed) {
  const pool = vocabPool(vocab, level).filter(w => w.example && w.vietnamese)
  if (pool.length < count) return []
  const target = pick(pool, count, seed)
  const items = []
  target.forEach((w, i) => {
    const flip = (seed + i) % 2 === 0
    const correctVi = w.vietnamese
    const wrongVi = pick(pool.filter(x => x.id !== w.id), 1, seed + i + 99)[0]?.vietnamese || "khác"
    const claim = flip
      ? `Câu "${w.example}" có nghĩa là: "${correctVi}".`
      : `Câu "${w.example}" có nghĩa là: "${wrongVi}".`
    items.push({
      id: "tf-" + w.id + "-" + i,
      kind: "tf",
      prompt: claim,
      options: ["True", "False"],
      correctIndex: flip ? 0 : 1,
      explanation: `Nghĩa đúng: ${correctVi}`,
    })
  })
  return items
}

export const QUIZ_KINDS = [
  { id: "mc",        label: "Trắc nghiệm" },
  { id: "vocab_ctx", label: "Từ trong ngữ cảnh" },
  { id: "reading",   label: "Đọc hiểu (đoạn dài)" },
  { id: "gapfill",   label: "Điền chỗ trống" },
  { id: "tf",        label: "Đúng / Sai" },
]

/**
 * Build a quiz set lazily; returns Promise<Item[]>.
 */
export async function buildQuizSet({ kinds, level, count = 10, seed = 1 } = {}) {
  const wanted = (kinds && kinds.length ? kinds : QUIZ_KINDS.map(k => k.id))
  const perKind = Math.max(1, Math.ceil(count / wanted.length))
  const out = []

  const needsVocab = wanted.some(k => k === "mc" || k === "vocab_ctx" || k === "gapfill" || k === "tf")
  const needsStories = wanted.includes("reading")
  const [vocab, stories] = await Promise.all([
    needsVocab   ? loadVocab()    : Promise.resolve([]),
    needsStories ? loadStories()  : Promise.resolve([]),
  ])

  if (wanted.includes("mc"))         out.push(...genVocabMC(vocab, level, perKind, seed + 1))
  if (wanted.includes("vocab_ctx"))  out.push(...genVocabContext(vocab, level, perKind, seed + 5))
  if (wanted.includes("reading"))    out.push(...genReading(stories, level, Math.min(2, perKind), seed + 9))
  if (wanted.includes("gapfill"))    out.push(...genGapFill(vocab, level, Math.max(1, Math.floor(perKind / 2)), seed + 13))
  if (wanted.includes("tf"))         out.push(...genTrueFalse(vocab, level, perKind, seed + 17))

  return shuffle(out, seed + 1000).slice(0, count)
}

export function gradeAnswer(item, answer) {
  if (!item) return false
  if (item.kind === "reading") return false
  if (item.kind === "gapfill") {
    if (!Array.isArray(answer)) return false
    return item.blanks.every((b, i) => String(answer[i] || "").toLowerCase() === b.toLowerCase())
  }
  return Number(answer) === Number(item.correctIndex)
}

export function flattenReading(item) {
  if (!item || item.kind !== "reading") return [item].filter(Boolean)
  return (item.subQuestions || []).map(sq => ({ ...sq, _passage: item.passage, _passageTitle: item.prompt }))
}
