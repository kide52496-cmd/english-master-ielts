import { vocabBeginner } from './vocab_beginner.js'
import { vocabA1 } from './vocab_a1.js'
import { vocabA2 } from './vocab_a2.js'
import { vocabB1Plus } from './vocab_b1plus.js'
import { vocabIELTSFoundation } from './vocab_ielts_foundation.js'
import { vocabIELTS5 } from './vocab_ielts_5.js'
import { vocabBGaps } from './vocab_b1_gaps.js'
import { vocabBPlusGaps } from './vocab_b1plus_gaps.js'
import { vocabIELTSFoundationFull } from './vocab_ielts_foundation_full.js'
import { vocabIELTSFull } from './vocab_ielts_5_full.js'
import { vocabSupp_travel } from './vocab_supp_travel.js'
import { vocabSupp_work } from './vocab_supp_work.js'
import { vocabSupp_family } from './vocab_supp_family.js'
import { vocabSupp_health } from './vocab_supp_health.js'
import { vocabSupp_society } from './vocab_supp_society.js'

export const LEVELS = ['Beginner', 'A1', 'A2', 'B1', 'B1+', 'IELTS Foundation', 'IELTS 5.0-6.0']

function inferPartOfSpeech(word) {
  if (word.partOfSpeech) return word.partOfSpeech
  const english = (word.english || '').toLowerCase()
  if (english.includes(' ')) return 'phrase'
  if (english.endsWith('ly')) return 'adverb'
  if (/(ing|ed|ate|fy|ise|ize)$/.test(english)) return 'verb'
  if (/(ful|less|ive|ous|able|al|ic|ent|ant)$/.test(english)) return 'adjective'
  return 'noun'
}

function normalizeWord(word, fallbackId) {
  const id = Number(word.id) || fallbackId
  return {
    id,
    english: String(word.english || '').trim(),
    vietnamese: String(word.vietnamese || '').trim(),
    pronunciation: word.pronunciation || `/${String(word.english || '').toLowerCase()}/`,
    example: word.example || `I want to learn the word "${word.english}".`,
    example_vi: word.example_vi || `Toi muon hoc tu "${word.english}".`,
    level: word.level || 'A1',
    topic: word.topic || 'General',
    partOfSpeech: inferPartOfSpeech(word),
  }
}

const allSources = [
  vocabBeginner, vocabA1, vocabA2,
  vocabBGaps, vocabB1Plus, vocabBPlusGaps,
  vocabIELTSFoundation, vocabIELTSFoundationFull,
  vocabIELTS5, vocabIELTSFull,
  vocabSupp_travel, vocabSupp_work, vocabSupp_family,
  vocabSupp_health, vocabSupp_society,
]

const idSet = new Set()
const baseVocabulary = []
let nextFallbackId = 1
for (const batch of allSources) {
  for (const word of batch) {
    const w = normalizeWord(word, nextFallbackId++)
    if (w.english && !idSet.has(w.id)) {
      idSet.add(w.id)
      baseVocabulary.push(w)
    }
  }
}

baseVocabulary.sort((a, b) => a.id - b.id)

export const vocabulary = baseVocabulary.slice(0, 8000)
export const levels = LEVELS
export const topics = [...new Set(vocabulary.map(w => w.topic))].sort()
export const partsOfSpeech = [...new Set(vocabulary.map(w => w.partOfSpeech))].sort()

export function getWordsByLevel(level) {
  if (!level || level === 'All') return vocabulary
  return vocabulary.filter(w => w.level === level)
}

export function getRandomWords(count = 10, level = null) {
  const pool = level ? getWordsByLevel(level) : vocabulary
  const shuffled = [...pool].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

export function getWordsByTopic(topic) {
  if (!topic || topic === 'All') return vocabulary
  return vocabulary.filter(w => w.topic === topic)
}
