// Personalization engine
// Decides what the learner should focus on next, based on:
//  - placement-test score (if any)
//  - learnedWords / completedGrammar / SRS reviews
//  - current XP stage
// Pure functions, no React.

import { roadmapStages, getStageByXP, getNextStage } from '../data/roadmap'

// ── helpers ──────────────────────────────────────────────────────────────

function clamp(n, lo, hi) { return Math.max(lo, Math.min(hi, n)) }

function pct(part, whole) {
  if (!whole || whole <= 0) return 0
  return clamp(Math.round((part / whole) * 100), 0, 100)
}

// ── public api ───────────────────────────────────────────────────────────

/**
 * Returns the user's current/target stage info for the dashboard.
 */
export function getStageProgress(state) {
  const xp = Math.max(0, Number(state?.xp || 0))
  const current = getStageByXP(xp)
  const next = getNextStage(current.id)

  const xpInStage = xp - current.xpRequired
  const xpNeeded  = next ? (next.xpRequired - current.xpRequired) : current.xpReward

  return {
    current,
    next,
    xpInStage: Math.max(0, xpInStage),
    xpNeeded:  Math.max(1, xpNeeded),
    percent:   pct(xpInStage, xpNeeded),
    isMaxStage: !next,
  }
}

/**
 * Score 0-100 per skill based on what the user has already done.
 * Higher = better. Used to pick what to recommend next.
 */
export function getSkillScores(state, ctx = {}) {
  const learnedWords      = (state?.learnedWords || []).length
  const completedGrammar  = (state?.completedGrammar || []).length
  const completedListen   = (state?.completedListening || []).length
  const completedSpeak    = (state?.completedSpeaking || []).length
  const readStories       = (state?.readStories || []).length
  const ieltsLearnedVocab = (state?.ieltsProgress?.learnedVocab || []).length

  const totalVocab    = ctx.totalVocab    ?? 200
  const totalGrammar  = ctx.totalGrammar  ?? 30
  const totalListen   = ctx.totalListen   ?? 18
  const totalSpeak    = ctx.totalSpeak    ?? 12
  const totalStories  = ctx.totalStories  ?? 15
  const totalIELTSv   = ctx.totalIELTSv   ?? 200

  return {
    vocabulary: pct(learnedWords + ieltsLearnedVocab, totalVocab + totalIELTSv),
    grammar:    pct(completedGrammar, totalGrammar),
    listening:  pct(completedListen,  totalListen),
    speaking:   pct(completedSpeak,   totalSpeak),
    reading:    pct(readStories,      totalStories),
    writing:    Math.min(100, completedGrammar * 4 + completedSpeak * 3),
  }
}

/**
 * Pick the 1-2 weakest skills as focus priorities.
 */
export function getWeakSkills(scores) {
  const arr = Object.entries(scores)
    .map(([k, v]) => ({ skill: k, score: v }))
    .sort((a, b) => a.score - b.score)
  return arr.slice(0, 2)
}

const SKILL_TO_PAGE = {
  vocabulary: { page: 'vocabulary', label: 'Học từ vựng', icon: '📖' },
  grammar:    { page: 'grammar',    label: 'Luyện ngữ pháp', icon: '🧩' },
  listening:  { page: 'listening',  label: 'Luyện nghe', icon: '🎧' },
  speaking:   { page: 'speaking',   label: 'Luyện nói', icon: '🎤' },
  reading:    { page: 'story-book', label: 'Đọc truyện', icon: '📚' },
  writing:    { page: 'writing-workshop', label: 'Luyện viết', icon: '✍️' },
}

const SKILL_LABEL_VI = {
  vocabulary: 'Từ vựng',
  grammar:    'Ngữ pháp',
  listening:  'Nghe',
  speaking:   'Nói',
  reading:    'Đọc',
  writing:    'Viết',
}

export function getSkillLabel(skill) {
  return SKILL_LABEL_VI[skill] || skill
}

/**
 * Build today's recommended action list.
 * Always returns 3-5 items, mix of: weak skill, SRS review, daily quiz.
 */
export function getTodayPlan(state, ctx = {}) {
  const scores = getSkillScores(state, ctx)
  const weak = getWeakSkills(scores)
  const dueCount = ctx.dueCount || 0
  const goal = state?.dailyGoal || 10
  const progress = state?.dailyProgress || 0

  const items = []

  // Item 1: priority weak skill
  if (weak[0]) {
    const w = weak[0]
    const route = SKILL_TO_PAGE[w.skill]
    items.push({
      id: 'weak-1',
      title: `${route?.icon || '🎯'} ${route?.label || 'Học tiếp'}`,
      desc:  `${getSkillLabel(w.skill)} đang yếu (${w.score}%)`,
      page:  route?.page || 'dashboard',
      priority: 1,
    })
  }

  // Item 2: SRS review if due cards
  if (dueCount > 0) {
    items.push({
      id: 'srs',
      title: `🔁 Ôn ${Math.min(dueCount, 30)} thẻ đến hạn`,
      desc:  `Spaced repetition giúp nhớ lâu hơn`,
      page:  'review-center',
      priority: 1,
    })
  }

  // Item 3: second weak skill
  if (weak[1]) {
    const w = weak[1]
    const route = SKILL_TO_PAGE[w.skill]
    items.push({
      id: 'weak-2',
      title: `${route?.icon || '✨'} ${route?.label || 'Luyện thêm'}`,
      desc:  `Củng cố ${getSkillLabel(w.skill)} (${w.score}%)`,
      page:  route?.page || 'dashboard',
      priority: 2,
    })
  }

  // Item 4: a quick quiz to reinforce
  items.push({
    id: 'quiz',
    title: '📝 Một quiz ngắn',
    desc:  'Đánh giá nhanh 5–10 câu',
    page:  'quiz',
    priority: 3,
  })

  // Item 5: daily goal nudge
  if (progress < goal) {
    items.push({
      id: 'daily-goal',
      title: '🎯 Hoàn thành mục tiêu hôm nay',
      desc:  `${progress}/${goal} điểm hôm nay`,
      page:  'dashboard',
      priority: 4,
    })
  }

  return items.slice(0, 5)
}

/**
 * Suggested next stage focus, based on current progress.
 */
export function getStageFocus(state) {
  const sp = getStageProgress(state)
  return {
    stage: sp.current,
    next:  sp.next,
    advice: sp.isMaxStage
      ? 'Bạn đã hoàn thành lộ trình tới IELTS 6.0. Hãy luyện đề thật và Mock Test.'
      : sp.percent < 30
        ? `Hãy tập trung vào ${sp.current.skills.slice(0, 2).join(' & ')}.`
        : sp.percent < 70
          ? 'Bạn đang đi đúng hướng. Học đều cả 4 kỹ năng.'
          : `Sắp lên ${sp.next?.name || 'level mới'}! Cố gắng hoàn thành stage hiện tại.`,
    percent: sp.percent,
  }
}
