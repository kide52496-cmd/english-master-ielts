import { createContext, useContext, useReducer, useEffect, useRef } from 'react'
import { loadProgress, saveProgress } from '../utils/storage'
import { checkNewAchievements } from '../data/achievements'
import { getStageByXP } from '../data/roadmap'

const AppContext = createContext()

const initialState = {
  learnedWords: [],
  quizScores: [],
  completedGrammar: [],
  completedListening: [],
  completedSpeaking: [],
  favoritePhrases: [],
  mockTestHistory: [],
  streak: 0,
  lastStudyDate: null,
  totalPoints: 0,
  xp: 0,
  level: 1,
  unlockedAchievements: [],
  currentStageId: 'beginner',
  dailyGoal: 10,
  dailyProgress: 0,
  dailyGoalDate: null,
  streakFreezes: 2,
  wordReviewToday: 0,
  wordReviewDate: null,
  missionRewardClaimedDate: null,
  newAchievements: [],
  readStories: [],
  completedVideoLessons: [],
  videoLessons: [],
  wordReviews: {},
  ieltsProgress: {
    completedListening: [],
    completedReading: [],
    completedWriting: [],
    practicedSpeaking: [],
    learnedVocab: [],
    checkedItems: [],
    targetBand: '6.0',
  },
}

function calcLevel(xp) {
  return Math.floor(xp / 500) + 1
}

function calcXPForNextLevel(level) {
  return level * 500
}

function normalizeState(payload = {}) {
  const next = { ...initialState, ...payload }
  const xp = Math.max(0, Number(next.xp || 0))
  return {
    ...next,
    learnedWords: Array.isArray(next.learnedWords) ? next.learnedWords : [],
    quizScores: Array.isArray(next.quizScores) ? next.quizScores : [],
    completedGrammar: Array.isArray(next.completedGrammar) ? next.completedGrammar : [],
    completedListening: Array.isArray(next.completedListening) ? next.completedListening : [],
    completedSpeaking: Array.isArray(next.completedSpeaking) ? next.completedSpeaking : [],
    favoritePhrases: Array.isArray(next.favoritePhrases) ? next.favoritePhrases : [],
    mockTestHistory: Array.isArray(next.mockTestHistory) ? next.mockTestHistory : [],
    unlockedAchievements: Array.isArray(next.unlockedAchievements) ? next.unlockedAchievements : [],
    newAchievements: Array.isArray(next.newAchievements) ? next.newAchievements : [],
    readStories: Array.isArray(next.readStories) ? next.readStories : [],
    completedVideoLessons: Array.isArray(next.completedVideoLessons) ? next.completedVideoLessons : [],
    videoLessons: Array.isArray(next.videoLessons) ? next.videoLessons : [],
    streakFreezes: Math.max(0, Number(next.streakFreezes || 0)),
    wordReviewToday: Math.max(0, Number(next.wordReviewToday || 0)),
    wordReviewDate: next.wordReviewDate || null,
    missionRewardClaimedDate: next.missionRewardClaimedDate || null,
    wordReviews: next.wordReviews && typeof next.wordReviews === 'object' ? next.wordReviews : {},
    ieltsProgress: { ...initialState.ieltsProgress, ...(next.ieltsProgress || {}) },
    xp,
    level: calcLevel(xp),
    currentStageId: getStageByXP(xp).id,
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'LOAD_STATE':
      return normalizeState({ ...action.payload, newAchievements: [] })

    case 'LEARN_WORD': {
      if (state.learnedWords.includes(action.wordId)) return state
      const newXP = state.xp + 10
      return {
        ...state,
        learnedWords: [...state.learnedWords, action.wordId],
        totalPoints: state.totalPoints + 10,
        xp: newXP,
        level: calcLevel(newXP),
        currentStageId: getStageByXP(newXP).id,
        dailyProgress: state.dailyProgress + 1,
      }
    }

    case 'UNLEARN_WORD':
      return {
        ...state,
        learnedWords: state.learnedWords.filter(id => id !== action.wordId),
        xp: Math.max(0, state.xp - 10),
      }

    case 'ADD_QUIZ_SCORE': {
      const newXP = state.xp + action.score.points
      return {
        ...state,
        quizScores: [...state.quizScores.slice(-49), action.score],
        totalPoints: state.totalPoints + action.score.points,
        xp: newXP,
        level: calcLevel(newXP),
        currentStageId: getStageByXP(newXP).id,
        dailyProgress: state.dailyProgress + Math.ceil(action.score.points / 5),
      }
    }

    case 'COMPLETE_GRAMMAR': {
      if (state.completedGrammar.includes(action.lessonId)) return state
      const newXP = state.xp + 20
      return {
        ...state,
        completedGrammar: [...state.completedGrammar, action.lessonId],
        totalPoints: state.totalPoints + 20,
        xp: newXP,
        level: calcLevel(newXP),
        currentStageId: getStageByXP(newXP).id,
        dailyProgress: state.dailyProgress + 2,
      }
    }

    case 'COMPLETE_LISTENING': {
      if (state.completedListening.includes(action.lessonId)) return state
      const newXP = state.xp + (action.xp || 30)
      return {
        ...state,
        completedListening: [...state.completedListening, action.lessonId],
        totalPoints: state.totalPoints + (action.xp || 30),
        xp: newXP,
        level: calcLevel(newXP),
        currentStageId: getStageByXP(newXP).id,
        dailyProgress: state.dailyProgress + 2,
      }
    }

    case 'COMPLETE_SPEAKING': {
      if (state.completedSpeaking.includes(action.lessonId)) return state
      const newXP = state.xp + (action.xp || 30)
      return {
        ...state,
        completedSpeaking: [...state.completedSpeaking, action.lessonId],
        totalPoints: state.totalPoints + (action.xp || 30),
        xp: newXP,
        level: calcLevel(newXP),
        currentStageId: getStageByXP(newXP).id,
        dailyProgress: state.dailyProgress + 2,
      }
    }

    case 'UNLOCK_ACHIEVEMENT': {
      if (state.unlockedAchievements.includes(action.achievementId)) return state
      const newXP = state.xp + (action.xpReward || 0)
      return {
        ...state,
        unlockedAchievements: [...state.unlockedAchievements, action.achievementId],
        xp: newXP,
        level: calcLevel(newXP),
        currentStageId: getStageByXP(newXP).id,
        newAchievements: [...state.newAchievements, action.achievementId],
      }
    }

    case 'CLEAR_NEW_ACHIEVEMENTS':
      return { ...state, newAchievements: [] }

    case 'UPDATE_STREAK':
      return { ...state, streak: action.streak, lastStudyDate: action.date }

    case 'RESET_DAILY_PROGRESS':
      return { ...state, dailyProgress: 0, dailyGoalDate: action.date }

    case 'SET_DAILY_GOAL':
      return { ...state, dailyGoal: Math.max(1, Math.min(100, Number(action.goal) || 10)) }

    case 'USE_STREAK_FREEZE':
      return { ...state, streakFreezes: Math.max(0, (state.streakFreezes || 0) - 1) }

    case 'RESET_STREAK_FREEZES':
      return { ...state, streakFreezes: Math.max(0, Number(action.count || 2)) }

    case 'RECORD_REVIEW_ACTIVITY': {
      const today = new Date().toDateString()
      const sameDay = state.wordReviewDate === today
      return {
        ...state,
        wordReviewDate: today,
        wordReviewToday: (sameDay ? state.wordReviewToday : 0) + Math.max(1, Number(action.count || 1)),
      }
    }

    case 'CLAIM_MISSION_REWARD':
      return {
        ...state,
        missionRewardClaimedDate: new Date().toDateString(),
      }

    case 'ADD_XP': {
      const amount = Number(action.amount || 0)
      const newXP = Math.max(0, (state.xp || 0) + amount)
      return {
        ...state,
        totalPoints: Math.max(0, (state.totalPoints || 0) + amount),
        xp: newXP,
        level: calcLevel(newXP),
        currentStageId: getStageByXP(newXP).id,
        dailyProgress: state.dailyProgress + Math.max(1, Math.ceil(amount / 10)),
      }
    }

    case 'MARK_LEARNED': {
      // generic mark learned for stories/videos/ielts/etc. action.key='learnedStories' | 'learnedVideos' | etc.
      const key = action.key
      const id = action.id
      const arr = Array.isArray(state[key]) ? state[key] : []
      if (arr.includes(id)) return state
      return { ...state, [key]: [...arr, id] }
    }

    case 'UNMARK_LEARNED': {
      const key = action.key
      const id = action.id
      const arr = Array.isArray(state[key]) ? state[key] : []
      return { ...state, [key]: arr.filter(x => x !== id) }
    }

    case 'RECORD_WORD_REVIEW': {
      // Spaced repetition: track correct/wrong reviews per wordId
      const wordId = typeof action.wordId === 'string' || typeof action.wordId === 'number'
        ? String(action.wordId)
        : null
      if (!wordId) return state

      const wordReviews = { ...(state.wordReviews || {}) }
      const existing = wordReviews[wordId]
      // Validate existing shape — reject tampered data
      const cur = (existing && typeof existing === 'object' && !Array.isArray(existing))
        ? { ...existing }
        : { correct: 0, wrong: 0, lastReview: null, nextDue: null, streak: 0 }

      // Sanitize numeric fields
      cur.correct = Math.max(0, Number.isFinite(cur.correct) ? cur.correct : 0)
      cur.wrong   = Math.max(0, Number.isFinite(cur.wrong)   ? cur.wrong   : 0)
      cur.streak  = Math.max(0, Number.isFinite(cur.streak)  ? cur.streak  : 0)

      if (action.correct) {
        cur.correct += 1
        cur.streak  += 1
        const intervals = [1, 2, 4, 7, 14, 30, 60, 120]
        const days = intervals[Math.min(cur.streak - 1, intervals.length - 1)] || 1
        cur.nextDue = Date.now() + days * 24 * 60 * 60 * 1000
      } else {
        cur.wrong   += 1
        cur.streak   = 0
        cur.nextDue  = Date.now() + 24 * 60 * 60 * 1000
      }
      cur.lastReview = Date.now()
      wordReviews[wordId] = cur
      return { ...state, wordReviews }
    }

    case 'UPDATE_IELTS_PROGRESS':
      return {
        ...state,
        ieltsProgress: { ...state.ieltsProgress, ...action.payload },
      }

    case 'RESET_PROGRESS':
      return { ...initialState }

    case 'RESET_REVIEWS':
      // Security: clear tampered SRS data
      return { ...state, wordReviews: {} }

    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const initialized = useRef(false)
  const streakUpdated = useRef(false)

  useEffect(() => {
    const saved = loadProgress()
    if (saved) {
      dispatch({ type: 'LOAD_STATE', payload: saved })
    }
    initialized.current = true
  }, [])

  useEffect(() => {
    if (!initialized.current) return

    // Debounce the (potentially large) full-state serialize so a burst of
    // rapid changes only writes to localStorage once, not on every dispatch.
    const t = setTimeout(() => saveProgress(state), 400)

    // Achievement check is cheap and should stay responsive.
    const newOnes = checkNewAchievements(state)
    newOnes.forEach(a => {
      dispatch({ type: 'UNLOCK_ACHIEVEMENT', achievementId: a.id, xpReward: a.xp })
    })

    return () => clearTimeout(t)
  }, [state.learnedWords, state.quizScores, state.completedGrammar, state.completedListening, state.completedSpeaking, state.streak, state.xp])

  useEffect(() => {
    if (!initialized.current || streakUpdated.current) return
    const today = new Date().toDateString()
    if (state.lastStudyDate === today) return
    streakUpdated.current = true

    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const isConsecutive = state.lastStudyDate === yesterday.toDateString()
    const canFreeze = (state.streakFreezes || 0) > 0
    const shouldUseFreeze = Boolean(state.lastStudyDate) && !isConsecutive

    if (shouldUseFreeze && canFreeze) {
      dispatch({ type: 'USE_STREAK_FREEZE' })
      dispatch({ type: 'UPDATE_STREAK', streak: state.streak, date: today })
    } else {
      const newStreak = isConsecutive ? state.streak + 1 : 1
      dispatch({ type: 'UPDATE_STREAK', streak: newStreak, date: today })
    }

    // Weekly refill: every Monday reset freezes to 2
    const now = new Date()
    if (now.getDay() === 1) {
      dispatch({ type: 'RESET_STREAK_FREEZES', count: 2 })
    }

    // Reset daily progress for new day
    if (state.dailyGoalDate !== today) {
      dispatch({ type: 'RESET_DAILY_PROGRESS', date: today })
    }
  }, [state.lastStudyDate, state.streak, state.dailyGoalDate, state.streakFreezes])

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}

export { calcLevel, calcXPForNextLevel }
