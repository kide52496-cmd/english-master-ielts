import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  loadReviewData,
  saveReviewData,
  scheduleCard,
  isDueToday,
  getDueCards,
  getWeakCards,
  getMasteredCards,
  buildVocabCard,
  buildStoryCard,
  buildIELTSCard,
  buildGrammarCard,
  syncFromAppState,
  loadActivity,
  recordActivity,
  getLast7DaysActivity,
} from '../src/utils/spacedRepetition'

const SRS_KEY = 'ema_review_v1'
const ACTIVITY_KEY = 'ema_review_activity_v1'

const DAY = 24 * 60 * 60 * 1000

/** A card as it exists straight after being built, before any review. */
function newCard(overrides = {}) {
  return {
    id: 'vocab__1',
    source: 'vocabulary',
    english: 'hello',
    vietnamese: 'xin chào',
    example: '',
    pronunciation: '',
    level: 'A1',
    interval: 0,
    nextReview: null,
    lastReview: null,
    correct: 0,
    incorrect: 0,
    ease: 2.5,
    reps: 0,
    lapses: 0,
    ...overrides,
  }
}

/** Rate a card repeatedly and return the final state. */
function rate(card, ratings) {
  return ratings.reduce((c, r) => scheduleCard(c, r), card)
}

afterEach(() => {
  vi.useRealTimers()
})

describe('loadReviewData', () => {
  it('returns an empty pool when nothing is stored', () => {
    expect(loadReviewData()).toEqual({})
  })

  it('returns an empty pool for corrupt JSON rather than throwing', () => {
    localStorage.setItem(SRS_KEY, '{not json')
    expect(loadReviewData()).toEqual({})
  })

  it('rejects a stored array or primitive (wrong shape)', () => {
    localStorage.setItem(SRS_KEY, JSON.stringify([1, 2, 3]))
    expect(loadReviewData()).toEqual({})
    localStorage.setItem(SRS_KEY, JSON.stringify('hello'))
    expect(loadReviewData()).toEqual({})
    localStorage.setItem(SRS_KEY, JSON.stringify(null))
    expect(loadReviewData()).toEqual({})
  })

  it('drops entries that are not card-shaped but keeps the good ones', () => {
    localStorage.setItem(SRS_KEY, JSON.stringify({
      good: newCard({ id: 'good' }),
      nullish: null,
      str: 'nope',
      arr: [1, 2],
      num: 7,
    }))
    const data = loadReviewData()
    expect(Object.keys(data)).toEqual(['good'])
  })
})

describe('saveReviewData', () => {
  it('persists a pool and reports success', () => {
    expect(saveReviewData({ a: newCard({ id: 'a' }) })).toBe(true)
    expect(loadReviewData().a.id).toBe('a')
  })

  it('refuses a non-object payload', () => {
    expect(saveReviewData(null)).toBe(false)
    expect(saveReviewData('x')).toBe(false)
    expect(saveReviewData(undefined)).toBe(false)
  })

  it('reports failure instead of throwing when storage rejects the write', () => {
    const spy = vi.spyOn(localStorage, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError')
    })
    expect(saveReviewData({ a: newCard() })).toBe(false)
    spy.mockRestore()
  })
})

describe('scheduleCard — learning steps', () => {
  it('sends a brand new card to 1 day on the first "good"', () => {
    const c = scheduleCard(newCard(), 'good')
    expect(c.interval).toBe(1)
    expect(c.reps).toBe(1)
    expect(c.correct).toBe(1)
    expect(c.incorrect).toBe(0)
  })

  it('sends it to 3 days on the second "good"', () => {
    const c = rate(newCard(), ['good', 'good'])
    expect(c.interval).toBe(3)
    expect(c.reps).toBe(2)
  })

  it('graduates past the fixed steps and multiplies by ease afterwards', () => {
    const c = rate(newCard(), ['good', 'good', 'good'])
    // 3 days * ease 2.5 = 7.5 → 8
    expect(c.interval).toBe(8)
    expect(c.reps).toBe(3)
  })

  it('keeps growing so a well-known card drifts out to weeks', () => {
    const c = rate(newCard(), ['good', 'good', 'good', 'good', 'good'])
    expect(c.interval).toBeGreaterThan(21)
  })
})

describe('scheduleCard — ratings', () => {
  it('"again" lapses the card: reps reset, interval 0, revisit within the hour', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 7, 30, 12, 0, 0))
    const mature = rate(newCard(), ['good', 'good', 'good'])
    const lapsed = scheduleCard(mature, 'again')

    expect(lapsed.reps).toBe(0)
    expect(lapsed.interval).toBe(0)
    expect(lapsed.lapses).toBe(1)
    expect(lapsed.incorrect).toBe(1)
    expect(lapsed.ease).toBeCloseTo(mature.ease - 0.2, 5)

    const gap = new Date(lapsed.nextReview).getTime() - Date.now()
    expect(gap).toBeGreaterThan(0)
    expect(gap).toBeLessThanOrEqual(60 * 60 * 1000)
  })

  it('"hard" still counts as correct but grows slowly and lowers ease', () => {
    const graduated = rate(newCard(), ['good', 'good', 'good']) // interval 8
    const hard = scheduleCard(graduated, 'hard')
    expect(hard.correct).toBe(4)
    expect(hard.incorrect).toBe(0)
    expect(hard.ease).toBeCloseTo(graduated.ease - 0.15, 5)
    expect(hard.interval).toBe(Math.round(8 * 1.2))
    expect(hard.interval).toBeGreaterThan(graduated.interval)
  })

  it('"easy" grows faster than "good" from the same card', () => {
    const base = rate(newCard(), ['good', 'good', 'good'])
    const easy = scheduleCard(base, 'easy')
    const good = scheduleCard(base, 'good')
    expect(easy.interval).toBeGreaterThan(good.interval)
    expect(easy.ease).toBeGreaterThan(base.ease)
  })

  it('an unknown rating is treated as "good" rather than corrupting the card', () => {
    const c = scheduleCard(newCard(), 'wat')
    expect(c.interval).toBe(1)
    expect(c.correct).toBe(1)
  })

  it('clamps ease into [1.3, 3.2] however it is rated', () => {
    let c = newCard()
    for (let i = 0; i < 40; i++) c = scheduleCard(c, 'again')
    expect(c.ease).toBe(1.3)

    let d = newCard()
    for (let i = 0; i < 40; i++) d = scheduleCard(d, 'easy')
    expect(d.ease).toBeLessThanOrEqual(3.2)
  })

  it('never schedules further out than a year', () => {
    let c = newCard()
    for (let i = 0; i < 40; i++) c = scheduleCard(c, 'easy')
    expect(c.interval).toBeLessThanOrEqual(365)
  })

  it('never produces a negative interval or a nextReview in the past', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 7, 30, 12, 0, 0))
    for (const rating of ['again', 'hard', 'good', 'easy']) {
      const c = scheduleCard(newCard(), rating)
      expect(c.interval).toBeGreaterThanOrEqual(0)
      expect(new Date(c.nextReview).getTime()).toBeGreaterThan(Date.now() - 1)
      expect(Number.isFinite(new Date(c.nextReview).getTime())).toBe(true)
    }
  })

  it('stamps both timestamps as valid ISO strings', () => {
    const c = scheduleCard(newCard(), 'good')
    expect(() => new Date(c.nextReview).toISOString()).not.toThrow()
    expect(Number.isFinite(new Date(c.lastReview).getTime())).toBe(true)
  })

  it('preserves the card payload (content fields are not lost)', () => {
    const c = scheduleCard(newCard({ english: 'ubiquitous', level: 'B2' }), 'good')
    expect(c.english).toBe('ubiquitous')
    expect(c.level).toBe('B2')
    expect(c.id).toBe('vocab__1')
  })

  it('does not mutate the card passed in', () => {
    const before = newCard()
    const snapshot = JSON.stringify(before)
    scheduleCard(before, 'good')
    expect(JSON.stringify(before)).toBe(snapshot)
  })
})

describe('scheduleCard — hand-edited / legacy storage', () => {
  it('coerces garbage numeric fields instead of producing NaN', () => {
    const c = scheduleCard(newCard({
      interval: 'abc', ease: null, reps: {}, correct: -5, incorrect: NaN, lapses: 'x',
    }), 'good')
    expect(Number.isFinite(c.interval)).toBe(true)
    expect(Number.isFinite(c.ease)).toBe(true)
    expect(Number.isFinite(c.reps)).toBe(true)
    expect(c.correct).toBeGreaterThanOrEqual(0)
    expect(c.incorrect).toBeGreaterThanOrEqual(0)
    expect(Number.isFinite(new Date(c.nextReview).getTime())).toBe(true)
  })

  it('survives a card with no SRS fields at all', () => {
    const c = scheduleCard({ id: 'bare', english: 'x' }, 'good')
    expect(c.interval).toBe(1)
    expect(c.ease).toBe(2.5)
  })

  it('does not collapse a long-standing legacy interval back to 3 days', () => {
    // A card saved before `reps` existed: the user has answered it right many
    // times and it is 30 days out. Answering "good" must not throw that away
    // by restarting the fixed learning steps.
    const legacy = { id: 'old', english: 'x', interval: 30, correct: 9, incorrect: 1 }
    const c = scheduleCard(legacy, 'good')
    expect(c.interval).toBeGreaterThanOrEqual(30)
  })

  it('does not collapse a long-standing legacy interval on "easy" either', () => {
    const legacy = { id: 'old', english: 'x', interval: 30, correct: 9, incorrect: 1 }
    const c = scheduleCard(legacy, 'easy')
    expect(c.interval).toBeGreaterThanOrEqual(30)
  })

  it('still uses the learning steps for a legacy card that never graduated', () => {
    const fresh = { id: 'new', english: 'x', interval: 0, correct: 0, incorrect: 0 }
    expect(scheduleCard(fresh, 'good').interval).toBe(1)
  })
})

describe('isDueToday', () => {
  it('treats a never-reviewed card as due', () => {
    expect(isDueToday(newCard())).toBe(true)
    expect(isDueToday({ id: 'x' })).toBe(true)
  })

  it('treats a missing or corrupt card as due rather than hiding it forever', () => {
    expect(isDueToday(null)).toBe(true)
    expect(isDueToday(undefined)).toBe(true)
    expect(isDueToday({ id: 'x', nextReview: 'not-a-date' })).toBe(true)
  })

  it('is false while the card is still scheduled in the future', () => {
    expect(isDueToday({ id: 'x', nextReview: new Date(Date.now() + DAY).toISOString() })).toBe(false)
  })

  it('is true once the scheduled moment has passed', () => {
    expect(isDueToday({ id: 'x', nextReview: new Date(Date.now() - 1000).toISOString() })).toBe(true)
  })
})

describe('query helpers', () => {
  const pool = {
    due:      { id: 'due',      nextReview: new Date(Date.now() - DAY).toISOString(), correct: 1, incorrect: 0, interval: 2 },
    future:   { id: 'future',   nextReview: new Date(Date.now() + 5 * DAY).toISOString(), correct: 4, incorrect: 0, interval: 5 },
    weak:     { id: 'weak',     nextReview: new Date(Date.now() + 5 * DAY).toISOString(), correct: 1, incorrect: 3, interval: 1 },
    mastered: { id: 'mastered', nextReview: new Date(Date.now() + 40 * DAY).toISOString(), correct: 6, incorrect: 0, interval: 40 },
  }

  it('getDueCards picks only cards at or past their schedule', () => {
    expect(getDueCards(pool).map(c => c.id)).toEqual(['due'])
  })

  it('getWeakCards picks cards missed at least as often as they were hit', () => {
    expect(getWeakCards(pool).map(c => c.id)).toEqual(['weak'])
  })

  it('getMasteredCards needs both a mature interval and a few successes', () => {
    expect(getMasteredCards(pool).map(c => c.id)).toEqual(['mastered'])
    // A long interval alone is not mastery.
    expect(getMasteredCards({ a: { id: 'a', interval: 60, correct: 1 } })).toEqual([])
    // Nor are successes with a short interval.
    expect(getMasteredCards({ a: { id: 'a', interval: 2, correct: 30 } })).toEqual([])
  })

  it('all three tolerate an empty, missing or dirty pool', () => {
    for (const fn of [getDueCards, getWeakCards, getMasteredCards]) {
      expect(fn(undefined)).toEqual([])
      expect(fn(null)).toEqual([])
      expect(fn({})).toEqual([])
      expect(() => fn({ bad: null, worse: 'str' })).not.toThrow()
    }
  })
})

describe('card builders', () => {
  it('buildVocabCard namespaces the id and starts with a blank schedule', () => {
    const c = buildVocabCard({ id: 42, english: 'cat', vietnamese: 'mèo' })
    expect(c.id).toBe('vocab__42')
    expect(c.source).toBe('vocabulary')
    expect(c.interval).toBe(0)
    expect(c.nextReview).toBeNull()
    expect(c.ease).toBe(2.5)
    expect(c.example).toBe('')
  })

  it('buildStoryCard slugifies multi-word entries so the id has no spaces', () => {
    const c = buildStoryCard('s1', { word: 'give up', vi: 'từ bỏ' })
    expect(c.id).toBe('story__s1_give-up')
    expect(c.id).not.toMatch(/\s/)
    expect(c.english).toBe('give up')
  })

  it('buildIELTSCard slugifies too', () => {
    const c = buildIELTSCard({ word: 'on the whole', vi: 'nhìn chung' })
    expect(c.id).toBe('ielts__on-the-whole')
    expect(c.source).toBe('ielts')
  })

  it('buildGrammarCard uses the first practice question as the prompt', () => {
    const c = buildGrammarCard({
      id: 'g1',
      title: 'Present Simple',
      level: 'A1',
      practice: [{ question: 'She ___ to school.', correctAnswer: 'goes', explanation: '3rd person -s' }],
    })
    expect(c.id).toBe('grammar__g1')
    expect(c.english).toBe('She ___ to school.')
    expect(c.vietnamese).toBe('goes')
    expect(c.example).toBe('3rd person -s')
  })

  it('buildGrammarCard falls back to the lesson title when there is no practice', () => {
    const c = buildGrammarCard({ id: 'g2', title: 'Articles', titleVi: 'Mạo từ', structure: 'a / an / the' })
    expect(c.english).toContain('Articles')
    expect(c.vietnamese).toBe('Mạo từ')
  })

  it('buildGrammarCard tolerates a numeric or zero correctAnswer (index-style)', () => {
    const c = buildGrammarCard({
      id: 'g3', title: 'X',
      practice: [{ question: 'pick one', correctAnswer: 0 }],
    })
    expect(c.vietnamese).toBe('0')
  })

  it('every builder produces a non-empty, collision-free id', () => {
    const ids = [
      buildVocabCard({ id: 1, english: 'a', vietnamese: 'b' }).id,
      buildStoryCard('s', { word: 'a', vi: 'b' }).id,
      buildIELTSCard({ word: 'a', vi: 'b' }).id,
      buildGrammarCard({ id: 'g', title: 't' }).id,
    ]
    expect(new Set(ids).size).toBe(4)
    for (const id of ids) expect(id.length).toBeGreaterThan(2)
  })
})

describe('syncFromAppState', () => {
  const vocab = [
    { id: 1, english: 'cat', vietnamese: 'mèo' },
    { id: 2, english: 'dog', vietnamese: 'chó' },
  ]
  const stories = [
    { id: 's1', vocabularyFocus: [{ word: 'brave', vi: 'dũng cảm' }] },
    { id: 's2' }, // no vocabularyFocus — must not throw
  ]
  const ieltsVocab = [{ word: 'sustainable', vi: 'bền vững' }]
  const grammar = [{ id: 'g1', title: 'Tenses', practice: [{ question: 'q', correctAnswer: 'a' }] }]

  it('adds one card per learned item across all four sources', () => {
    const out = syncFromAppState({}, {
      learnedWords: [1, 2],
      readStories: ['s1', 's2'],
      ieltsProgress: { learnedVocab: ['sustainable'] },
      completedGrammar: ['g1'],
    }, vocab, stories, ieltsVocab, grammar)

    expect(Object.keys(out).sort()).toEqual([
      'grammar__g1', 'ielts__sustainable', 'story__s1_brave', 'vocab__1', 'vocab__2',
    ])
  })

  it('persists the additions', () => {
    syncFromAppState({}, { learnedWords: [1] }, vocab, stories, ieltsVocab, grammar)
    expect(Object.keys(loadReviewData())).toEqual(['vocab__1'])
  })

  it('never overwrites existing SRS progress for a card already in the pool', () => {
    const existing = { vocab__1: { ...newCard({ id: 'vocab__1' }), interval: 30, correct: 9, reps: 5 } }
    const out = syncFromAppState(existing, { learnedWords: [1] }, vocab, stories, ieltsVocab, grammar)
    expect(out.vocab__1.interval).toBe(30)
    expect(out.vocab__1.correct).toBe(9)
  })

  it('returns the SAME object reference when nothing was added (no needless re-render)', () => {
    const existing = { vocab__1: newCard({ id: 'vocab__1' }) }
    const out = syncFromAppState(existing, { learnedWords: [1] }, vocab, stories, ieltsVocab, grammar)
    expect(out).toBe(existing)
  })

  it('ignores ids that are not in the content lists', () => {
    const out = syncFromAppState({}, {
      learnedWords: [999],
      readStories: ['nope'],
      ieltsProgress: { learnedVocab: ['missing'] },
      completedGrammar: ['nope'],
    }, vocab, stories, ieltsVocab, grammar)
    expect(out).toEqual({})
  })

  it('tolerates a completely empty app state', () => {
    expect(() => syncFromAppState({}, {}, vocab, stories, ieltsVocab, grammar)).not.toThrow()
    expect(syncFromAppState({}, {}, vocab, stories, ieltsVocab, grammar)).toEqual({})
  })

  it('tolerates a missing grammar list (older call sites pass five args)', () => {
    expect(() =>
      syncFromAppState({}, { learnedWords: [1] }, vocab, stories, ieltsVocab)
    ).not.toThrow()
  })
})

describe('activity tracking', () => {
  it('starts empty and tolerates corrupt storage', () => {
    expect(loadActivity()).toEqual({})
    localStorage.setItem(ACTIVITY_KEY, '{broken')
    expect(loadActivity()).toEqual({})
    localStorage.setItem(ACTIVITY_KEY, JSON.stringify([1, 2]))
    expect(loadActivity()).toEqual({})
  })

  it('accumulates today\'s count across calls', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 7, 30, 9, 0, 0))
    recordActivity(1)
    recordActivity(4)
    expect(loadActivity()['2026-08-30']).toBe(5)
  })

  it('counts at least 1 for a nonsense count', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 7, 30, 9, 0, 0))
    recordActivity('abc')
    recordActivity(-10)
    recordActivity(0)
    expect(loadActivity()['2026-08-30']).toBe(3)
  })

  it('keys by local day, so a 1am session counts as that day', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 7, 31, 1, 0, 0))
    recordActivity(2)
    expect(loadActivity()['2026-08-31']).toBe(2)
    expect(loadActivity()['2026-08-30']).toBeUndefined()
  })

  it('prunes to the most recent 30 days', () => {
    const data = {}
    for (let i = 0; i < 60; i++) {
      const d = new Date(2026, 0, 1)
      d.setDate(d.getDate() + i)
      data[`2026-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`] = 1
    }
    localStorage.setItem(ACTIVITY_KEY, JSON.stringify(data))
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 7, 30, 9, 0, 0))

    const out = recordActivity(1)
    expect(Object.keys(out).length).toBeLessThanOrEqual(30)
    // Today must survive the prune.
    expect(out['2026-08-30']).toBe(1)
    // And the oldest days must be the ones dropped.
    expect(out['2026-01-01']).toBeUndefined()
  })

  it('getLast7DaysActivity returns 7 labelled days, oldest first, ending today', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 7, 30, 9, 0, 0))
    recordActivity(3)
    const days = getLast7DaysActivity()

    expect(days).toHaveLength(7)
    expect(days.map(d => d.key)).toEqual([...days.map(d => d.key)].sort())
    expect(days.at(-1).key).toBe('2026-08-30')
    expect(days.at(-1).count).toBe(3)
    expect(days[0].count).toBe(0)
    for (const d of days) {
      expect(typeof d.label).toBe('string')
      expect(d.label.length).toBeGreaterThan(0)
      expect(Number.isFinite(d.count)).toBe(true)
      expect(d.count).toBeGreaterThanOrEqual(0)
    }
  })

  it('getLast7DaysActivity never yields NaN from dirty stored values', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 7, 30, 9, 0, 0))
    localStorage.setItem(ACTIVITY_KEY, JSON.stringify({ '2026-08-30': 'lots', '2026-08-29': null }))
    const days = getLast7DaysActivity()
    expect(days.every(d => Number.isFinite(d.count))).toBe(true)
  })
})
