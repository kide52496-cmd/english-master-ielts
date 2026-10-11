// Unified SRS facade.
// Wraps both legacy stores so everything else can use ONE api:
//   - localStorage 'ema_review_v1'  (rich SRS cards: vocab/story/ielts)
//   - AppContext state.wordReviews  (legacy per-wordId review counters)
//
// All consumers should now import from here instead of using the two
// stores directly. The two stores keep working untouched, so nothing
// breaks if a screen still reads them. New screens (Review Queue,
// Personalized Plan, Dashboard) read aggregated stats from this file.

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
  dayKey,
} from './spacedRepetition'

// ── re-export so call sites can use one import path ──────────────────────
export {
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
  dayKey,
}

// ── aggregated stats across BOTH stores ──────────────────────────────────

/**
 * Combined stats from rich SRS + legacy AppContext.wordReviews.
 *
 * @param {object} appState  state.wordReviews map (optional)
 */
export function getCombinedSRSStats(appState = {}) {
  const data = loadReviewData()
  const due       = getDueCards(data).length
  const weak      = getWeakCards(data).length
  const mastered  = getMasteredCards(data).length
  const total     = Object.keys(data).length

  // Legacy counters (per-wordId; not full SRS cards)
  const legacy    = appState?.wordReviews || {}
  const legacyIds = Object.keys(legacy)
  const legacyDue = legacyIds.filter(id => {
    const r = legacy[id]
    return !r?.nextDue || r.nextDue <= Date.now()
  }).length

  return {
    rich:   { due, weak, mastered, total },
    legacy: { due: legacyDue, total: legacyIds.length },
    combined: {
      due:       due + legacyDue,
      total:     total + legacyIds.length,
      mastered,
      weak,
    },
  }
}

/**
 * Build a deterministic, prioritised review queue for today.
 * Order:
 *   1. Cards overdue (most overdue first)
 *   2. Cards due today
 *   3. Weak cards (incorrect >= correct)
 *   4. New cards never reviewed
 * Caps at `limit` so the user never feels overwhelmed.
 */
export function buildReviewQueue({ limit = 20 } = {}) {
  const data = loadReviewData()
  const all = Object.values(data)
  const now = Date.now()

  const overdue = []
  const dueNow  = []
  const weak    = []
  const fresh   = []

  for (const c of all) {
    if (!c || typeof c !== 'object' || !c.id) continue
    const nr = c.nextReview ? new Date(c.nextReview).getTime() : NaN
    // Never reviewed, or an unusable timestamp: treat as new rather than
    // dropping it — a NaN comparison is false in every branch below, which
    // used to make such cards invisible to the queue forever.
    if (!Number.isFinite(nr)) {
      fresh.push(c)
      continue
    }
    if (nr < now - 12 * 3600 * 1000) {
      overdue.push({ card: c, lateBy: now - nr })
      continue
    }
    if (nr <= now) {
      dueNow.push(c)
      continue
    }
    if (c.incorrect > 0 && c.incorrect >= c.correct) {
      weak.push(c)
    }
  }

  overdue.sort((a, b) => b.lateBy - a.lateBy)
  const queue = [
    ...overdue.map(x => x.card),
    ...dueNow,
    ...weak,
    ...fresh,
  ]

  // Deduplicate by id while preserving order
  const seen = new Set()
  const unique = []
  for (const c of queue) {
    if (seen.has(c.id)) continue
    seen.add(c.id)
    unique.push(c)
    if (unique.length >= limit) break
  }
  return unique
}

/**
 * Apply a rating ('again'|'hard'|'good'|'easy') to a card and persist.
 * Records activity for streak/charts.
 */
export function rateCard(card, rating) {
  const data = loadReviewData()
  const updated = scheduleCard(card, rating)
  data[card.id] = updated
  saveReviewData(data)
  if (rating !== 'again') recordActivity(1)
  return updated
}

/**
 * Reset a single card's SRS schedule (used when user wants to re-learn).
 */
export function resetCardSchedule(cardId) {
  const data = loadReviewData()
  if (!data[cardId]) return false
  data[cardId] = {
    ...data[cardId],
    interval:    0,
    nextReview:  null,
    lastReview:  null,
    correct:     0,
    incorrect:   0,
    // Also clear the SM-2 fields, otherwise a card "reset to re-learn" keeps
    // the ease and rep count it earned and immediately jumps back to a long
    // interval on its first correct answer.
    ease:        2.5,
    reps:        0,
    lapses:      0,
  }
  saveReviewData(data)
  return true
}

/**
 * Snapshot for analytics/dashboard (small, JSON-serialisable).
 */
export function getSRSSummary(appState = {}) {
  const stats = getCombinedSRSStats(appState)
  const activity = getLast7DaysActivity()
  const weeklyTotal = activity.reduce((s, d) => s + (d.count || 0), 0)
  return {
    ...stats,
    last7Days: activity,
    weeklyReviews: weeklyTotal,
  }
}
