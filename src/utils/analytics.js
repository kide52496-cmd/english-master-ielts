// Analytics helpers for dashboard.
// All pure/local calculations from current app state + local progress stores.

import { vocabulary } from "../data/vocabulary"
import { grammarLessons } from "../data/grammarLessons"
import { listeningScripts } from "../data/listeningScripts"
import { speakingLessons } from "../data/speakingLessons"
import { stories } from "../data/stories"
import { getCourseProgress } from "./courseProgress"
import { getSRSSummary } from "./srs"
import { getSkillScores, getWeakSkills } from "./personalization"

export function getDashboardAnalytics(state) {
  const courseProgress = getCourseProgress()
  const srs = getSRSSummary(state)

  const vocabLearned = (state.learnedWords || []).length
  const grammarDone  = (state.completedGrammar || []).length
  const listenDone   = (state.completedListening || []).length
  const speakDone    = (state.completedSpeaking || []).length
  const storiesRead  = (state.readStories || []).length

  const totalQuiz = (state.quizScores || []).length
  const avgQuiz = totalQuiz > 0
    ? Math.round((state.quizScores || []).reduce((s, q) => s + (q.percentage || 0), 0) / totalQuiz)
    : 0
  const bestQuiz = totalQuiz > 0
    ? Math.max(...(state.quizScores || []).map(q => q.percentage || 0))
    : 0

  const skillScores = getSkillScores(state, {
    totalVocab: vocabulary.length,
    totalGrammar: grammarLessons.length,
    totalListen: listeningScripts.length,
    totalSpeak: speakingLessons.length,
    totalStories: stories.length,
    totalIELTSv: 200,
  })
  const weakSkills = getWeakSkills(skillScores)

  const today = new Date().toDateString()
  const dailyGoal = state.dailyGoal || 10
  const dailyProgress = state.dailyGoalDate === today ? (state.dailyProgress || 0) : (state.dailyProgress || 0)
  const dailyPct = Math.min(100, Math.round((dailyProgress / Math.max(1, dailyGoal)) * 100))

  const courseLessonsDone = Object.keys(courseProgress).length
  const courseXP = Object.values(courseProgress).reduce((s, p) => s + (p.xpEarned || 0), 0)

  const topTopics = topVocabularyTopics(state)
  const levelBreakdown = levelProgress(state)

  return {
    overview: {
      vocabLearned,
      grammarDone,
      listenDone,
      speakDone,
      storiesRead,
      totalQuiz,
      avgQuiz,
      bestQuiz,
      courseLessonsDone,
      courseXP,
    },
    daily: {
      dailyGoal,
      dailyProgress,
      dailyPct,
      streak: state.streak || 0,
      totalPoints: state.totalPoints || 0,
      xp: state.xp || 0,
      level: state.level || 1,
    },
    skills: skillScores,
    weakSkills,
    srs,
    topTopics,
    levelBreakdown,
  }
}

function topVocabularyTopics(state) {
  const learned = new Set(state.learnedWords || [])
  const counts = {}
  vocabulary.forEach(w => {
    if (learned.has(w.id)) {
      counts[w.topic] = (counts[w.topic] || 0) + 1
    }
  })
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([topic, count]) => ({ topic, count }))
}

function levelProgress(state) {
  const learned = new Set(state.learnedWords || [])
  const levels = [...new Set(vocabulary.map(w => w.level))]
  return levels.map(level => {
    const all = vocabulary.filter(w => w.level === level)
    const done = all.filter(w => learned.has(w.id)).length
    return {
      level,
      total: all.length,
      done,
      pct: all.length > 0 ? Math.round((done / all.length) * 100) : 0,
    }
  })
}
