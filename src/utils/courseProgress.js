const STORAGE_KEY = 'ema_course_progress'

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveProgress(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {}
}

export function getCourseProgress() {
  return loadProgress()
}

export function getLessonProgress(lessonId) {
  const progress = loadProgress()
  return progress[lessonId] || null
}

export function completeLesson(lessonId, xpEarned) {
  const progress = loadProgress()
  progress[lessonId] = {
    completedAt: Date.now(),
    xpEarned: xpEarned || 0,
    attempts: (progress[lessonId]?.attempts || 0) + 1,
  }
  saveProgress(progress)
  return progress
}

export function resetLesson(lessonId) {
  const progress = loadProgress()
  delete progress[lessonId]
  saveProgress(progress)
}

export function getLevelProgress(levelId, lessons) {
  const progress = loadProgress()
  const levelLessons = lessons.filter(l => l.levelId === levelId)
  const completed = levelLessons.filter(l => progress[l.id]).length
  return { total: levelLessons.length, completed, percent: levelLessons.length > 0 ? Math.round(completed / levelLessons.length * 100) : 0 }
}

export function isLessonUnlocked(lessonId, lessons) {
  const lesson = lessons.find(l => l.id === lessonId)
  if (!lesson) return false
  if (lesson.unlockRequirement === undefined || lesson.unlockRequirement === null) return true
  const progress = loadProgress()
  const completedCount = Object.keys(progress).length
  return completedCount >= lesson.unlockRequirement
}

export function isLevelUnlocked(levelId, lessons) {
  const levelIndex = { 'mat-goc': 0, 'a1': 1, 'a2': 2, 'b1': 3, 'b1plus': 4, 'ielts-f': 5, 'ielts-5': 6, 'ielts-55': 7, 'ielts-6': 8 }[levelId]
  if (levelIndex === 0) return true
  const prevLevelId = ['mat-goc', 'a1', 'a2', 'b1', 'b1plus', 'ielts-f', 'ielts-5', 'ielts-55', 'ielts-6'][levelIndex - 1]
  const prevProgress = getLevelProgress(prevLevelId, lessons)
  return prevProgress.percent >= 50
}

export function getTotalXp() {
  const progress = loadProgress()
  return Object.values(progress).reduce((sum, p) => sum + (p.xpEarned || 0), 0)
}

export function getStreak() {
  try {
    const streak = localStorage.getItem('ema_streak')
    return streak ? parseInt(streak) : 0
  } catch { return 0 }
}

export function updateStreak() {
  try {
    const today = new Date().toDateString()
    const lastDate = localStorage.getItem('ema_last_study_date')
    let streak = parseInt(localStorage.getItem('ema_streak') || '0')
    if (lastDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      streak = lastDate === yesterday ? streak + 1 : 1
      localStorage.setItem('ema_streak', String(streak))
      localStorage.setItem('ema_last_study_date', today)
    }
    return streak
  } catch { return 0 }
}
