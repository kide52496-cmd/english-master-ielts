// Goal Mode engine.
// Lets the learner pick a study goal (e.g. "Mất gốc 30 ngày", "IELTS 6.0 in 12 weeks")
// and turns it into:
//   - a target stage on the existing roadmap
//   - a deadline / number of weeks
//   - a recommended daily XP target + skill mix
//   - a milestone breakdown
// Persisted in localStorage under 'ema_goal_v1'.

import { roadmapStages, getStageById } from '../data/roadmap'

const KEY = 'ema_goal_v1'

// ── catalogue ────────────────────────────────────────────────────────────

export const GOAL_CATALOG = [
  {
    id: 'lostroot-30',
    title: 'Mất Gốc 30 Ngày',
    desc:  'Học lại từ A-Z, đủ giao tiếp cơ bản trong 1 tháng',
    icon:  '🌱',
    stageId: 'a1',
    weeks: 4,
    dailyMinutes: 25,
    skillMix: { vocabulary: 40, grammar: 25, speaking: 20, listening: 15 },
    color: 'from-lime-400 to-green-500',
  },
  {
    id: 'a2-8w',
    title: 'A2 Trong 8 Tuần',
    desc:  'Nắm vững thì quá khứ, modal verbs, comparative',
    icon:  '🌳',
    stageId: 'a2',
    weeks: 8,
    dailyMinutes: 30,
    skillMix: { vocabulary: 35, grammar: 30, speaking: 15, listening: 20 },
    color: 'from-teal-400 to-cyan-500',
  },
  {
    id: 'b1-12w',
    title: 'B1 Trong 12 Tuần',
    desc:  'Trung cấp: Present Perfect, Passive, Conditionals',
    icon:  '🌲',
    stageId: 'b1',
    weeks: 12,
    dailyMinutes: 35,
    skillMix: { vocabulary: 30, grammar: 30, speaking: 20, listening: 20 },
    color: 'from-blue-400 to-indigo-500',
  },
  {
    id: 'ielts5-12w',
    title: 'IELTS 5.0 - 12 Tuần',
    desc:  'Chiến lược 4 kỹ năng, cấu trúc bài thi cơ bản',
    icon:  '⭐',
    stageId: 'ielts_5',
    weeks: 12,
    dailyMinutes: 45,
    skillMix: { vocabulary: 25, grammar: 20, speaking: 20, listening: 20, writing: 15 },
    color: 'from-yellow-400 to-orange-500',
  },
  {
    id: 'ielts55-16w',
    title: 'IELTS 5.5 - 16 Tuần',
    desc:  'Đề thật mỗi tuần, paraphrasing, complex grammar',
    icon:  '⭐⭐',
    stageId: 'ielts_55',
    weeks: 16,
    dailyMinutes: 50,
    skillMix: { vocabulary: 25, grammar: 20, speaking: 20, listening: 20, writing: 15 },
    color: 'from-orange-400 to-red-500',
  },
  {
    id: 'ielts6-20w',
    title: 'IELTS 6.0 - 20 Tuần',
    desc:  'Mục tiêu 6.0 cho du học/định cư',
    icon:  '🏆',
    stageId: 'ielts_6',
    weeks: 20,
    dailyMinutes: 60,
    skillMix: { vocabulary: 25, grammar: 15, speaking: 20, listening: 20, writing: 20 },
    color: 'from-red-500 to-rose-600',
  },
  {
    id: 'sprint-14',
    title: 'Sprint 14 Ngày',
    desc:  'Ôn cấp tốc trước buổi nói chuyện/phỏng vấn quan trọng',
    icon:  '⚡',
    stageId: 'a2',
    weeks: 2,
    dailyMinutes: 45,
    skillMix: { vocabulary: 30, speaking: 35, listening: 25, grammar: 10 },
    color: 'from-amber-400 to-yellow-500',
  },
]

// ── persistence ──────────────────────────────────────────────────────────

export function loadActiveGoal() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const obj = JSON.parse(raw)
    if (obj && typeof obj === 'object' && obj.goalId) return obj
    return null
  } catch { return null }
}

export function setActiveGoal(goalId) {
  const goal = GOAL_CATALOG.find(g => g.id === goalId)
  if (!goal) return null
  const now = Date.now()
  const deadline = now + goal.weeks * 7 * 24 * 3600 * 1000
  const payload = {
    goalId,
    startedAt: now,
    deadline,
    weeksTotal: goal.weeks,
  }
  try { localStorage.setItem(KEY, JSON.stringify(payload)) } catch {}
  return payload
}

export function clearActiveGoal() {
  try { localStorage.removeItem(KEY) } catch {}
}

// ── derived ──────────────────────────────────────────────────────────────

export function getGoalById(id) {
  return GOAL_CATALOG.find(g => g.id === id) || null
}

/**
 * Returns goal + run-time progress (week index, days left, daily XP target).
 */
export function getGoalProgress(state) {
  const active = loadActiveGoal()
  if (!active) return null
  const goal = getGoalById(active.goalId)
  if (!goal) return null

  const now = Date.now()
  const elapsedDays = Math.max(0, Math.floor((now - active.startedAt) / (24 * 3600 * 1000)))
  const totalDays   = Math.max(1, goal.weeks * 7)
  const daysLeft    = Math.max(0, totalDays - elapsedDays)
  const weekIndex   = Math.min(goal.weeks, Math.floor(elapsedDays / 7) + 1)
  const percent     = Math.min(100, Math.round((elapsedDays / totalDays) * 100))

  // Daily XP target: stage XP needed / total study days, with a sane floor.
  const stage = getStageById(goal.stageId)
  const xpRange = stage ? (stage.xpReward + Math.max(0, stage.xpRequired - (state?.xp || 0))) : 1500
  const dailyXP = Math.max(40, Math.round(xpRange / totalDays))

  return {
    goal,
    active,
    elapsedDays,
    totalDays,
    daysLeft,
    weekIndex,
    percent,
    dailyXP,
    onTrack: percent <= ((state?.xp || 0) / Math.max(1, stage?.xpRequired || 1)) * 100 + 10,
  }
}

/**
 * Returns ["Vocab x phút", "Grammar y phút", ...] based on dailyMinutes & skillMix.
 */
export function getTodaySkillMix(goal) {
  if (!goal) return []
  const total = goal.dailyMinutes
  const out = []
  for (const [skill, pct] of Object.entries(goal.skillMix || {})) {
    const minutes = Math.max(2, Math.round(total * pct / 100))
    out.push({ skill, pct, minutes })
  }
  return out
}

/**
 * Generate weekly milestones for the active goal: an array of {week, focus, target}.
 */
export function getMilestones(goal, state) {
  if (!goal) return []
  const stage = getStageById(goal.stageId)
  if (!stage) return []
  const out = []
  const startXP = state?.xp || 0
  const xpToGain = Math.max(stage.xpReward, stage.xpRequired - startXP)
  const xpPerWeek = Math.max(50, Math.round(xpToGain / goal.weeks))
  for (let w = 1; w <= goal.weeks; w++) {
    out.push({
      week: w,
      targetXP: startXP + xpPerWeek * w,
      focus: pickWeeklyFocus(stage, w, goal.weeks),
    })
  }
  return out
}

function pickWeeklyFocus(stage, week, totalWeeks) {
  if (!stage?.skills?.length) return 'Học đều các kỹ năng'
  const idx = Math.floor(((week - 1) / totalWeeks) * stage.skills.length)
  return stage.skills[Math.min(idx, stage.skills.length - 1)]
}

export function getAllStagesForPicker() {
  return roadmapStages
}
