// Daily mission + streak freeze helpers
// Local, deterministic, no network.

import { todayKey, isSameLocalDay } from './dates'

const MISSION_KEY = 'ema_daily_mission_v1'

function xpMissionTarget(level = 1) {
  return Math.min(120, 20 + Math.max(0, (level - 1)) * 5)
}

function quizMissionTarget(level = 1) {
  return level >= 8 ? 2 : 1
}

function reviewMissionTarget(level = 1) {
  return level >= 6 ? 8 : 5
}

export function createMissionSnapshot(state) {
  const level = Number(state?.level || 1)
  return {
    date: todayKey(),
    missions: [
      {
        id: 'xp',
        title: 'Kiếm XP hôm nay',
        desc: `Đạt ${xpMissionTarget(level)} XP`,
        target: xpMissionTarget(level),
        progress: Number(state?.dailyProgress || 0) * 10,
        unit: 'xp',
      },
      {
        id: 'quiz',
        title: 'Làm quiz',
        desc: `Hoàn thành ${quizMissionTarget(level)} quiz`,
        target: quizMissionTarget(level),
        progress: Math.min(quizMissionTarget(level), countTodayQuizAttempts(state)),
        unit: 'quiz',
      },
      {
        id: 'review',
        title: 'Ôn tập SRS',
        desc: `Ôn ${reviewMissionTarget(level)} thẻ`,
        target: reviewMissionTarget(level),
        progress: Number(state?.wordReviewToday || 0),
        unit: 'cards',
      },
      {
        id: 'streak',
        title: 'Giữ streak',
        desc: 'Mở app và học ít nhất một hoạt động',
        target: 1,
        progress: Number((state?.dailyProgress || 0) > 0 ? 1 : 0),
        unit: 'day',
      },
    ],
  }
}

function countTodayQuizAttempts(state) {
  return (state?.quizScores || []).filter(q => {
    const stamp = q?.completedAt || q?.date || q?.timestamp
    return stamp ? isSameLocalDay(stamp, new Date()) : false
  }).length
}

export function saveMissionSnapshot(snapshot) {
  try { localStorage.setItem(MISSION_KEY, JSON.stringify(snapshot)) } catch {}
}

export function loadMissionSnapshot() {
  try {
    const raw = localStorage.getItem(MISSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function getActiveMissions(state) {
  const snap = createMissionSnapshot(state)
  // NOTE: do NOT persist here. This is called during render; writing to
  // localStorage on every render caused jank. Persistence (if needed) should
  // be done explicitly from an effect, not from a read-only getter.
  return snap.missions.map(m => ({
    ...m,
    percent: Math.min(100, Math.round((m.progress / Math.max(1, m.target)) * 100)),
    done: m.progress >= m.target,
  }))
}

export function getMissionSummary(state) {
  const missions = getActiveMissions(state)
  const doneCount = missions.filter(m => m.done).length
  return {
    date: todayKey(),
    missions,
    doneCount,
    total: missions.length,
    allDone: doneCount === missions.length,
  }
}

export function getAvailableFreezeCount(state) {
  return Math.max(0, Number(state?.streakFreezes || 0))
}
