// Writing scorer (heuristic, offline).
// Analyses an IELTS Writing response and estimates a band per the four
// official criteria: Task Response, Coherence & Cohesion, Lexical Resource,
// Grammatical Range & Accuracy. This is NOT a substitute for a human marker,
// but gives concrete, actionable feedback far better than a self-tick checklist.

// ── Word lists ──────────────────────────────────────────────────────────────

// Linking / cohesive devices grouped by function.
const LINKERS = [
  'however', 'therefore', 'moreover', 'furthermore', 'nevertheless', 'nonetheless',
  'consequently', 'thus', 'hence', 'accordingly', 'meanwhile', 'whereas', 'while',
  'although', 'though', 'despite', 'in spite of', 'on the other hand', 'in contrast',
  'by contrast', 'on the contrary', 'in addition', 'additionally', 'besides',
  'for instance', 'for example', 'such as', 'in particular', 'firstly', 'secondly',
  'thirdly', 'finally', 'lastly', 'to begin with', 'overall', 'in conclusion',
  'to conclude', 'to sum up', 'in summary', 'as a result', 'because of this',
  'as well as', 'not only', 'but also', 'in other words', 'that is to say',
]

// Common informal/weak words to flag (register issues).
const INFORMAL = ['kids', 'gonna', 'wanna', 'gotta', 'stuff', 'thing', 'things', 'lots of', 'a lot of', 'ok', 'okay', 'big', 'good', 'bad', 'nice']

// Very common "filler" words excluded from the lexical-variety calculation.
const STOPWORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'of', 'to', 'in', 'on', 'at', 'for',
  'is', 'are', 'was', 'were', 'be', 'been', 'being', 'it', 'its', 'this',
  'that', 'these', 'those', 'i', 'you', 'he', 'she', 'we', 'they', 'them',
  'his', 'her', 'their', 'my', 'your', 'our', 'as', 'by', 'with', 'from',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'can', 'could',
  'should', 'may', 'might', 'must', 'not', 'no', 'so', 'if', 'than', 'then',
  'there', 'here', 'which', 'who', 'what', 'when', 'where', 'how', 'about',
])

// ── Text helpers ──────────────────────────────────────────────────────────────

function wordTokens(text) {
  return (String(text || '').toLowerCase().match(/[a-z']+/g) || [])
}

function sentenceSplit(text) {
  return String(text || '')
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(Boolean)
}

function countOccurrences(lowerText, phrases) {
  const found = []
  for (const p of phrases) {
    const re = new RegExp(`\\b${p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g')
    const m = lowerText.match(re)
    if (m) found.push({ phrase: p, count: m.length })
  }
  return found
}

// ── Individual metric calculators ──────────────────────────────────────────────

function lexicalStats(tokens) {
  const total = tokens.length
  const content = tokens.filter(w => !STOPWORDS.has(w) && w.length > 2)
  const unique = new Set(content)
  // Type-token ratio on content words (vocabulary variety).
  const ttr = content.length ? unique.size / content.length : 0

  // Most-repeated content word (flag overuse).
  const freq = {}
  content.forEach(w => { freq[w] = (freq[w] || 0) + 1 })
  let topWord = null, topCount = 0
  for (const [w, c] of Object.entries(freq)) {
    if (c > topCount) { topWord = w; topCount = c }
  }
  // Long/academic words (>= 7 letters) as a rough sophistication signal.
  const longWords = content.filter(w => w.length >= 7).length
  return { total, contentCount: content.length, uniqueCount: unique.size, ttr, topWord, topCount, longWords }
}

function sentenceStats(sentences) {
  const lengths = sentences.map(s => wordTokens(s).length)
  const avg = lengths.length ? lengths.reduce((a, b) => a + b, 0) / lengths.length : 0
  // Complex-sentence signal: subordinators / relatives present.
  const complexRe = /\b(which|who|whom|whose|that|because|although|though|while|whereas|if|unless|when|since|after|before|so that|in order to|despite|in spite of)\b/i
  const complexCount = sentences.filter(s => complexRe.test(s)).length
  // Very long run-on risk (> 40 words) and very short (< 5 words).
  const runOn = lengths.filter(l => l > 40).length
  const veryShort = lengths.filter(l => l > 0 && l < 5).length
  return { count: sentences.length, avg, complexCount, runOn, veryShort, lengths }
}

// Light-weight grammar/mechanics checks (high-precision, low-recall on purpose).
function mechanicsIssues(text, sentences) {
  const issues = []
  // Sentences not starting with a capital letter.
  const lowerStart = sentences.filter(s => /^[a-z]/.test(s)).length
  if (lowerStart > 0) issues.push({ type: 'capitalization', count: lowerStart, label: `${lowerStart} câu không viết hoa đầu câu` })

  // Repeated doubled words ("the the").
  const dup = (text.toLowerCase().match(/\b(\w+)\s+\1\b/g) || [])
  if (dup.length) issues.push({ type: 'doubled_word', count: dup.length, label: `${dup.length} chỗ lặp từ liền nhau (vd "${dup[0]}")` })

  // " i " lowercase pronoun.
  const lowerI = (text.match(/\bi\b/g) || []).length
  if (lowerI) issues.push({ type: 'lowercase_i', count: lowerI, label: `Đại từ "I" viết thường ${lowerI} lần` })

  // Space before punctuation.
  const spacePunct = (text.match(/\s+[.,!?;:]/g) || []).length
  if (spacePunct) issues.push({ type: 'space_punct', count: spacePunct, label: `${spacePunct} chỗ có dấu cách thừa trước dấu câu` })

  return issues
}

// ── Band mapping helpers ───────────────────────────────────────────────────────

// Clamp a numeric band into the valid IELTS range and snap to nearest 0.5.
function snapBand(b) {
  const clamped = Math.max(4, Math.min(8, b))
  return Math.round(clamped * 2) / 2
}

function roundIELTSBand(avg) {
  const whole = Math.floor(avg)
  const frac = avg - whole
  if (frac < 0.25) return whole
  if (frac < 0.75) return whole + 0.5
  return whole + 1
}

/**
 * Score an IELTS Writing response.
 *
 * @param {string} text       the candidate's essay
 * @param {object} opts
 * @param {number} opts.minWords   required minimum (150 task1 / 250 task2)
 * @param {2|1}    opts.taskNo      1 or 2 (affects weighting & advice)
 * @returns {{overall:number, criteria:object, stats:object, feedback:string[]}}
 */
export function scoreWriting(text, { minWords = 250, taskNo = 2 } = {}) {
  const tokens = wordTokens(text)
  const sentences = sentenceSplit(text)
  const wordCount = tokens.length
  const lower = String(text || '').toLowerCase()

  const lex = lexicalStats(tokens)
  const sen = sentenceStats(sentences)
  const linkers = countOccurrences(lower, LINKERS)
  const linkerVariety = linkers.length
  const informal = countOccurrences(lower, INFORMAL)
  const mech = mechanicsIssues(text, sentences)

  // Empty / trivial guard.
  if (wordCount < 20) {
    return {
      overall: 0,
      criteria: { TR: 0, CC: 0, LR: 0, GRA: 0 },
      stats: { wordCount, sentences: sen.count, linkerVariety, ttr: lex.ttr },
      feedback: ['Bài viết quá ngắn để chấm. Hãy viết ít nhất ' + minWords + ' từ.'],
    }
  }

  // ── Task Response (length, development) ──────────────────────────────────
  let TR = 5
  const lenRatio = wordCount / minWords
  if (lenRatio >= 1.0) TR += 1
  if (lenRatio >= 1.15) TR += 0.5
  if (lenRatio < 0.9) TR -= 1
  if (lenRatio < 0.7) TR -= 1
  // Paragraphing: blank-line separated blocks.
  const paragraphs = String(text || '').split(/\n\s*\n/).map(p => p.trim()).filter(Boolean)
  if (paragraphs.length >= (taskNo === 2 ? 4 : 3)) TR += 0.5
  else if (paragraphs.length <= 1) TR -= 1
  TR = snapBand(TR)

  // ── Coherence & Cohesion (linkers, paragraphing, sentence flow) ──────────
  let CC = 5
  if (linkerVariety >= 4) CC += 1
  if (linkerVariety >= 7) CC += 0.5
  if (linkerVariety <= 1) CC -= 1
  if (paragraphs.length >= (taskNo === 2 ? 4 : 3)) CC += 0.5
  if (paragraphs.length <= 1) CC -= 1
  // Overusing one linker hurts.
  if (linkers.some(l => l.count >= 4)) CC -= 0.5
  CC = snapBand(CC)

  // ── Lexical Resource (variety, sophistication, repetition, register) ─────
  let LR = 5
  if (lex.ttr >= 0.45) LR += 0.5
  if (lex.ttr >= 0.55) LR += 0.5
  if (lex.ttr < 0.35) LR -= 1
  const longRatio = lex.contentCount ? lex.longWords / lex.contentCount : 0
  if (longRatio >= 0.18) LR += 0.5
  if (longRatio >= 0.28) LR += 0.5
  // Repetition penalty (one content word used a lot).
  if (lex.topCount >= 6 && wordCount < 350) LR -= 1
  else if (lex.topCount >= 8) LR -= 1
  // Informal register penalty.
  if (informal.length >= 3) LR -= 0.5
  LR = snapBand(LR)

  // ── Grammatical Range & Accuracy (complexity, mechanics, run-ons) ────────
  let GRA = 5
  const complexRatio = sen.count ? sen.complexCount / sen.count : 0
  if (complexRatio >= 0.3) GRA += 0.5
  if (complexRatio >= 0.5) GRA += 0.5
  if (complexRatio < 0.15) GRA -= 1
  if (sen.avg >= 12 && sen.avg <= 25) GRA += 0.5
  if (sen.avg > 32) GRA -= 0.5 // run-on tendency
  if (sen.veryShort >= 3) GRA -= 0.5
  // Mechanics errors.
  const mechTotal = mech.reduce((a, m) => a + m.count, 0)
  if (mechTotal >= 3) GRA -= 0.5
  if (mechTotal >= 6) GRA -= 0.5
  GRA = snapBand(GRA)

  const overall = roundIELTSBand((TR + CC + LR + GRA) / 4)

  // ── Feedback ─────────────────────────────────────────────────────────────
  const feedback = []
  if (lenRatio < 1) feedback.push(`⚠️ Mới ${wordCount}/${minWords} từ — bài dưới chuẩn độ dài sẽ bị trừ điểm Task Response.`)
  else feedback.push(`✅ Đủ độ dài (${wordCount} từ).`)

  if (linkerVariety <= 2) feedback.push(`📌 Chỉ dùng ${linkerVariety} loại từ nối. Hãy thêm các liên từ như "however", "in addition", "as a result"...`)
  else feedback.push(`✅ Dùng ${linkerVariety} loại từ nối khác nhau.`)

  if (paragraphs.length <= 1) feedback.push('📌 Bài chưa chia đoạn rõ. Tách intro / body / conclusion bằng dòng trống.')

  if (lex.ttr < 0.4) feedback.push(`📌 Vốn từ lặp lại nhiều (độ đa dạng ${Math.round(lex.ttr * 100)}%). Thử dùng từ đồng nghĩa.`)
  if (lex.topCount >= 6) feedback.push(`📌 Từ "${lex.topWord}" lặp ${lex.topCount} lần — nên paraphrase.`)
  if (informal.length >= 2) feedback.push(`📌 Có ${informal.length} từ thiếu trang trọng (vd "${informal[0].phrase}"). IELTS cần văn phong học thuật.`)

  if (complexRatio < 0.2) feedback.push('📌 Ít câu phức. Hãy dùng mệnh đề quan hệ (which/who/that) và liên từ phụ thuộc (because/although).')
  else feedback.push(`✅ Có ${sen.complexCount} câu phức / ${sen.count} câu.`)

  mech.forEach(m => feedback.push(`📝 ${m.label}.`))

  return {
    overall,
    criteria: { TR, CC, LR, GRA },
    stats: {
      wordCount,
      sentences: sen.count,
      avgSentenceLen: Math.round(sen.avg),
      linkerVariety,
      ttr: Math.round(lex.ttr * 100),
      complexCount: sen.complexCount,
      longWords: lex.longWords,
      topWord: lex.topWord,
      topCount: lex.topCount,
      paragraphs: paragraphs.length,
      mechIssues: mechTotal,
    },
    feedback,
  }
}


