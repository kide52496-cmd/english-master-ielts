// Vocabulary enrichment engine.
// Adds derived information on top of the existing vocab data without
// touching the original files. Pure functions, deterministic.
//
// Provides:
//   - normalised IPA-like pronunciation
//   - part-of-speech inference
//   - word family (verb/noun/adj/adv siblings)
//   - basic synonyms / antonyms (curated)
//   - collocations (curated)
//   - difficulty score (1-5)

// ── tiny curated dictionaries ────────────────────────────────────────────

const SYNONYMS = {
  big:    ['large', 'huge', 'enormous', 'massive'],
  small:  ['tiny', 'little', 'minor', 'compact'],
  good:   ['great', 'excellent', 'fine', 'positive'],
  bad:    ['poor', 'terrible', 'awful', 'negative'],
  fast:   ['quick', 'rapid', 'swift', 'speedy'],
  slow:   ['gradual', 'sluggish', 'unhurried'],
  happy:  ['joyful', 'glad', 'pleased', 'cheerful'],
  sad:    ['unhappy', 'sorrowful', 'depressed'],
  smart:  ['clever', 'intelligent', 'bright', 'brilliant'],
  important: ['crucial', 'significant', 'vital', 'essential'],
  difficult:  ['hard', 'tough', 'challenging'],
  easy:   ['simple', 'effortless', 'straightforward'],
  begin:  ['start', 'commence', 'initiate'],
  end:    ['finish', 'conclude', 'terminate'],
  show:   ['display', 'demonstrate', 'reveal', 'indicate'],
  help:   ['assist', 'support', 'aid'],
  use:    ['utilise', 'employ', 'apply'],
  make:   ['create', 'produce', 'build'],
  think:  ['believe', 'consider', 'reckon', 'reflect'],
  see:    ['observe', 'notice', 'perceive', 'witness'],
  say:    ['state', 'mention', 'remark', 'declare'],
  get:    ['obtain', 'receive', 'acquire'],
}

const ANTONYMS = {
  big:    ['small'],
  small:  ['big'],
  good:   ['bad'],
  bad:    ['good'],
  fast:   ['slow'],
  slow:   ['fast'],
  happy:  ['sad'],
  sad:    ['happy'],
  easy:   ['difficult'],
  difficult:  ['easy'],
  begin:  ['end'],
  end:    ['begin'],
  hot:    ['cold'],
  cold:   ['hot'],
  rich:   ['poor'],
  poor:   ['rich'],
  high:   ['low'],
  low:    ['high'],
  buy:    ['sell'],
  sell:   ['buy'],
  open:   ['close'],
  close:  ['open'],
  always: ['never'],
  never:  ['always'],
}

const COLLOCATIONS = {
  decision: ['make a decision', 'reach a decision', 'tough decision'],
  effort:   ['make an effort', 'a great effort', 'effortless'],
  mistake:  ['make a mistake', 'common mistake', 'fix a mistake'],
  attention:['pay attention', 'draw attention', 'attention span'],
  research: ['conduct research', 'research findings', 'further research'],
  problem:  ['solve a problem', 'face a problem', 'serious problem'],
  question: ['ask a question', 'answer a question', 'good question'],
  question_phrase: ['out of the question'],
  business: ['do business', 'run a business', 'small business'],
  risk:     ['take a risk', 'high risk', 'at risk'],
  chance:   ['take a chance', 'by chance', 'good chance'],
  meeting:  ['attend a meeting', 'hold a meeting', 'arrange a meeting'],
  experience:['gain experience', 'work experience', 'previous experience'],
  effect:   ['have an effect', 'side effect', 'positive effect'],
  impact:   ['have an impact', 'major impact', 'environmental impact'],
  goal:     ['set a goal', 'achieve a goal', 'long-term goal'],
  effort_phrase: ['put effort into'],
  time:     ['spend time', 'waste time', 'on time'],
  money:    ['spend money', 'save money', 'earn money'],
  attention_phrase: ['pay close attention'],
}

// ── inference helpers ────────────────────────────────────────────────────

function rootOf(word) {
  if (!word) return ''
  let w = String(word).toLowerCase().trim()
  if (w.includes(' ')) return w.split(' ')[0]
  // strip common suffixes
  w = w.replace(/(ies|ied|ying)$/, 'y')
  w = w.replace(/(ses|ssed|ssing)$/, 'ss')
  w = w.replace(/(ed|ing|s)$/, '')
  return w
}

export function inferPos(english) {
  const e = String(english || '').toLowerCase()
  if (!e) return 'unknown'
  if (e.includes(' ')) return 'phrase'
  if (e.endsWith('ly')) return 'adverb'
  if (/(ing|ate|fy|ise|ize)$/.test(e)) return 'verb'
  if (/(ful|less|ive|ous|able|ible|al|ic|ent|ant)$/.test(e)) return 'adjective'
  if (/(tion|sion|ment|ness|ity|ship|ance|ence)$/.test(e)) return 'noun'
  return 'noun'
}

function deriveFamily(english) {
  const root = rootOf(english).replace(/[^a-z]/g, '')
  if (!root) return []
  const base = root
  return [
    { form: 'verb',      word: base },
    { form: 'noun',      word: base + (base.endsWith('e') ? '' : 'e') + 'r' },
    { form: 'adjective', word: base + 'ful' },
    { form: 'adjective', word: base + 'ive' },
    { form: 'adverb',    word: base + 'ly' },
  ].filter(f => f.word && f.word.length > 2)
}

function difficulty(word) {
  const len = String(word.english || '').length
  const isPhrase = String(word.english || '').includes(' ')
  const lvl = String(word.level || 'A1')
  const lvlScore = ({
    Beginner: 1, A1: 1, A2: 2, B1: 3, 'B1+': 4,
    'IELTS Foundation': 4, 'IELTS 5.0-6.0': 5, IELTS: 5,
  })[lvl] || 2
  let score = lvlScore
  if (isPhrase) score += 1
  if (len > 10) score += 1
  return Math.max(1, Math.min(5, score))
}

function toIPA(pronunciation, english) {
  const raw = String(pronunciation || '').trim()
  if (raw && raw !== `/${String(english || '').toLowerCase()}/`) return raw
  // Fallback: very rough phonetic skeleton (only for display)
  const w = String(english || '').toLowerCase()
  if (!w) return ''
  const phonetic = w
    .replace(/ee/g, 'iː')
    .replace(/oo/g, 'uː')
    .replace(/ai/g, 'eɪ')
    .replace(/ou/g, 'aʊ')
    .replace(/th/g, 'θ')
    .replace(/sh/g, 'ʃ')
    .replace(/ch/g, 'tʃ')
  return `/${phonetic}/`
}

// ── public api ───────────────────────────────────────────────────────────

/**
 * Returns an enriched copy of a vocabulary word.
 */
export function enrichWord(word) {
  if (!word || typeof word !== 'object') return null
  const english = String(word.english || '').trim()
  const lower = english.toLowerCase()
  const head  = lower.split(' ')[0]
  const root  = rootOf(english)

  return {
    ...word,
    pos:           word.partOfSpeech || inferPos(english),
    ipa:           toIPA(word.pronunciation, english),
    family:        deriveFamily(english),
    synonyms:      SYNONYMS[lower] || SYNONYMS[head] || SYNONYMS[root] || [],
    antonyms:      ANTONYMS[lower] || ANTONYMS[head] || ANTONYMS[root] || [],
    collocations:  COLLOCATIONS[lower] || COLLOCATIONS[head] || COLLOCATIONS[root] || [],
    difficulty:    difficulty(word),
  }
}

/**
 * Quick stats about a word's enrichment for UI badges.
 */
export function enrichmentSummary(word) {
  const e = enrichWord(word)
  if (!e) return null
  return {
    hasIPA:      Boolean(e.ipa && e.ipa.length > 2),
    synCount:    e.synonyms.length,
    antCount:    e.antonyms.length,
    colloCount:  e.collocations.length,
    difficulty:  e.difficulty,
  }
}
