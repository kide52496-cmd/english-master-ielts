import { useMemo } from 'react'
import { useApp } from '../context/AppContext'
import { vocabulary } from '../data/vocabulary'
import { achievements } from '../data/achievements'
import { grammarLessons } from '../data/grammarLessons'
import { listeningScripts } from '../data/listeningScripts'
import { speakingLessons } from '../data/speakingLessons'
import { listeningExercises } from '../data/ieltsListening'
import { readingPassages } from '../data/ieltsReading'
import { writingTasks } from '../data/ieltsWriting'
import { ieltsVocabulary } from '../data/ieltsLessons'
import { roadmapStages, getStageByXP, getNextStage } from '../data/roadmap'
import { BookOpen, Trophy, Zap, Target, ChevronRight, Star, BarChart3, Flame, Brain } from 'lucide-react'
import { getDashboardAnalytics } from '../utils/analytics'
import { getMissionSummary } from '../utils/dailyMission'

const levelColors = {
  Beginner: 'bg-lime-100 text-lime-700',
  A1: 'bg-green-100 text-green-700', A2: 'bg-blue-100 text-blue-700',
  B1: 'bg-purple-100 text-purple-700', 'B1+': 'bg-fuchsia-100 text-fuchsia-700',
  'IELTS Foundation': 'bg-amber-100 text-amber-700',
  'IELTS 5.0-6.0': 'bg-red-100 text-red-700',
}

function XPRingSmall({ xp, targetXP, size = 64 }) {
  const sw = 6
  const r = (size - sw) / 2
  const circ = 2 * Math.PI * r
  const pct = Math.min(xp / targetXP, 1)
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="currentColor" strokeWidth={sw} className="text-white/20" />
      <circle cx={size/2} cy={size/2} r={r} fill="none" strokeWidth={sw}
        stroke="white" strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)}
        strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.8s ease' }}
      />
    </svg>
  )
}

export default function Dashboard({ setCurrentPage }) {
  const { state, dispatch } = useApp()
  const { learnedWords, quizScores, streak, totalPoints, completedGrammar, completedListening, completedSpeaking, xp, level, unlockedAchievements, dailyProgress, dailyGoal } = state

  const quickActions = [
    { id: 'roadmap',    label: 'Lộ Trình',   desc: `${roadmapStages.length} stage từ mất gốc`, icon: '🗺️', color: 'from-indigo-500 to-purple-600', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
    { id: 'vocabulary', label: 'Từ Vựng',   desc: `${vocabulary.length} từ offline`, icon: '📖', color: 'from-blue-500 to-cyan-500',    bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { id: 'flashcard',  label: 'Flashcard', desc: 'Lật thẻ ghi nhớ',    icon: '🃏', color: 'from-purple-500 to-pink-500',  bg: 'bg-purple-50 dark:bg-purple-900/20' },
    { id: 'quiz',       label: 'Quiz',      desc: `${quizScores.length} câu trắc nghiệm`, icon: '📝', color: 'from-green-500 to-emerald-500', bg: 'bg-green-50 dark:bg-green-900/20' },
    { id: 'grammar',    label: 'Ngữ Pháp',  desc: `${grammarLessons.length} bài ngữ pháp`,   icon: '📚', color: 'from-orange-500 to-amber-500',  bg: 'bg-orange-50 dark:bg-orange-900/20' },
    { id: 'listening-pack', label: '100 Bài Nghe-Nói', desc: 'Foundation → IELTS 6.5', icon: '🎧', color: 'from-teal-500 to-cyan-500', bg: 'bg-teal-50 dark:bg-teal-900/20' },
    { id: 'speaking',   label: 'Nói',       desc: `${speakingLessons.length} bài nói`, icon: '🎙️', color: 'from-red-500 to-rose-500',    bg: 'bg-red-50 dark:bg-red-900/20' },
    { id: 'phrasebook', label: 'Phrasebook',desc: `8 tình huống giao tiếp`, icon: '💬', color: 'from-fuchsia-500 to-purple-600', bg: 'bg-fuchsia-50 dark:bg-fuchsia-900/20' },
  ]

  const currentStage = getStageByXP(xp || 0)
  const nextStage = getNextStage(currentStage.id)
  // These scan large data sets (up to 8000 words) and read localStorage —
  // memoize so they don't re-run on every render.
  const analytics = useMemo(() => getDashboardAnalytics(state), [
    state.learnedWords, state.quizScores, state.xp, state.completedGrammar,
    state.completedListening, state.completedSpeaking,
  ])
  const missions = useMemo(() => getMissionSummary(state), [
    state.dailyProgress, state.level, state.quizScores, state.wordReviewToday,
  ])
  const xpInLevel = (xp || 0) % 500
  const xpNextLevel = 500

  const bestQuizScore = quizScores.length > 0 ? Math.max(...quizScores.map(s => s.percentage || 0)) : 0
  const wordOfDay = vocabulary.length > 0 ? vocabulary[new Date().getDate() % vocabulary.length] : null
  const dailyGoalPct = Math.min(Math.round(((dailyProgress || 0) / (dailyGoal || 10)) * 100), 100)
  const dailyDone = (dailyProgress || 0) >= (dailyGoal || 10)

  // Recent achievements (last 3) — memoized on the achievement list only.
  const recentAchievements = useMemo(
    () => (unlockedAchievements || []).slice(-3).reverse().map(id => achievements.find(a => a.id === id)).filter(Boolean),
    [unlockedAchievements]
  )
  const lockedAchievements = useMemo(
    () => achievements.filter(a => !(unlockedAchievements || []).includes(a.id)).slice(0, 3),
    [unlockedAchievements]
  )

  // Per-level vocab progress. Single pass over the (large) vocab list instead
  // of 14 full scans, and only recomputed when learnedWords changes.
  const levelProgress = useMemo(() => {
    const LEVELS = ['Beginner', 'A1', 'A2', 'B1', 'B1+', 'IELTS Foundation', 'IELTS 5.0-6.0']
    const learnedSet = new Set(learnedWords)
    const totals = Object.fromEntries(LEVELS.map(l => [l, { total: 0, learned: 0 }]))
    for (const w of vocabulary) {
      const bucket = totals[w.level]
      if (!bucket) continue
      bucket.total += 1
      if (learnedSet.has(w.id)) bucket.learned += 1
    }
    return LEVELS.map(level => {
      const { total, learned } = totals[level]
      return { level, total, learned, pct: total > 0 ? Math.round((learned / total) * 100) : 0 }
    })
  }, [learnedWords])

  // IELTS Hub progress totals — derived from the actual data so they never
  // go stale when content is added (previously hardcoded 4/5/4/144).
  const ieltsTotals = useMemo(() => ({
    listening: listeningExercises.length,
    reading: readingPassages.length,
    writing: writingTasks.task1.length + writingTasks.task2.length,
    vocab: ieltsVocabulary.length,
  }), [])

  return (
    <div className="space-y-5">

      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 bg-300 animate-gradient-x rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        {/* Animated decorative blobs */}
        <div className="blob bg-pink-400/40 w-48 h-48 -top-8 -right-8" />
        <div className="blob bg-indigo-300/40 w-40 h-40 -bottom-12 -left-12 animate-float-slow" />
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative flex items-start justify-between gap-4">
          <div className="flex-1">
            <p className="text-indigo-200 text-sm">Chào mừng trở lại! 👋</p>
            <h1 className="text-2xl font-bold mt-0.5 text-gradient">English Master IELTS</h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-lg animate-float">{currentStage.icon}</span>
              <span className="text-sm text-indigo-200">{currentStage.name}</span>
            </div>

            {/* XP Progress bar */}
            <div className="mt-3">
              <div className="flex justify-between text-xs text-indigo-200 mb-1">
                <span>Level {level || 1} → {(level || 1) + 1}</span>
                <span>{xpInLevel}/{xpNextLevel} XP</span>
              </div>
              <div className="bg-white/20 rounded-full h-2 overflow-hidden relative">
                <div className="bg-white rounded-full h-2 transition-all duration-700 progress-shine relative" style={{ width: `${(xpInLevel / xpNextLevel) * 100}%` }} />
              </div>
            </div>
          </div>

          {/* XP Ring */}
          <div className="relative flex-shrink-0 animate-float">
            <XPRingSmall xp={xpInLevel} targetXP={xpNextLevel} size={72} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg font-bold leading-none animate-count-up">{level || 1}</span>
              <span className="text-xs opacity-70">Lv</span>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-6 gap-2 mt-4">
          {[
            { v: (xp || 0).toLocaleString(), l: 'XP', e: '⚡' },
            { v: `${completedGrammar.length}/${grammarLessons.length}`, l: 'Ngữ pháp', e: '✏️' },
            { v: `${completedListening.length}/${listeningScripts.length}`, l: 'Nghe', e: '🔊' },
            { v: `${completedSpeaking.length}/${speakingLessons.length}`, l: 'Nói', e: '🎙️' },
            { v: streak || 0, l: 'Streak', e: '🔥' },
            { v: (unlockedAchievements || []).length, l: 'Huy hiệu', e: '🏅' },
          ].map((s, i) => (
            <div key={i} className="bg-white/10 rounded-xl p-2 text-center">
              <div className="text-xs">{s.e}</div>
              <div className="font-bold text-sm">{s.v}</div>
              <div className="text-xs text-indigo-200 leading-none">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Goal */}
      <div className={`rounded-2xl p-4 border-2 transition-all card-hover animate-fade-up ${dailyDone ? 'bg-green-50 dark:bg-green-900/20 border-green-400 animate-glow' : 'bg-white dark:bg-gray-800 border-indigo-200 dark:border-indigo-700'}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Target size={18} className={dailyDone ? 'text-green-500 animate-wiggle' : 'text-indigo-600'} />
            <span className="font-bold text-sm text-gray-800 dark:text-gray-100">
              {dailyDone ? '🎉 Mục tiêu hôm nay đạt rồi!' : 'Mục tiêu hôm nay'}
            </span>
          </div>
          <span className={`text-xs font-bold ${dailyDone ? 'text-green-600' : 'text-indigo-600'}`}>
            {dailyProgress || 0}/{dailyGoal || 10}
          </span>
        </div>
        <div className="bg-gray-100 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden relative">
          <div
            className={`h-2.5 rounded-full transition-all duration-700 progress-shine relative ${dailyDone ? 'bg-green-500' : 'bg-gradient-to-r from-indigo-500 to-purple-500'}`}
            style={{ width: `${dailyGoalPct}%` }}
          />
        </div>
      </div>

      {/* Daily Mission */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <Target size={18} className="text-indigo-500" /> Daily Mission
          </h3>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {missions.doneCount}/{missions.total} hoàn thành
          </div>
        </div>
        <div className="space-y-2.5">
          {missions.missions.map((m) => (
            <div key={m.id} className="rounded-xl bg-gray-50 dark:bg-gray-700/40 px-3 py-3">
              <div className="flex items-center justify-between mb-1">
                <div className="text-sm font-semibold text-gray-700 dark:text-gray-200">{m.title}</div>
                <div className={`text-xs font-bold ${m.done ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}`}>
                  {m.progress}/{m.target}
                </div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">{m.desc}</div>
              <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className={`h-2 rounded-full transition-all duration-700 ${m.done ? 'bg-green-500' : 'bg-indigo-500'}`} style={{ width: `${m.percent}%` }} />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>Freeze còn lại: <span className="font-bold text-orange-500">{state.streakFreezes || 0}</span></span>
          <span>{missions.allDone ? '🎉 Hoàn thành mission hôm nay' : 'Còn nhiệm vụ cần làm'}</span>
        </div>
      </div>

      {/* Current Stage + Next */}
      <div
        onClick={() => setCurrentPage('roadmap')}
        className={`${currentStage.bgColor} rounded-2xl p-4 border ${currentStage.borderColor} cursor-pointer hover:shadow-md transition-all`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{currentStage.icon}</span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-800 dark:text-gray-100">{currentStage.name}</span>
                <span className="text-xs bg-indigo-600 text-white px-2 py-0.5 rounded-full">ĐANG HỌC</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{currentStage.goal.slice(0, 60)}...</p>
            </div>
          </div>
          <ChevronRight size={18} className="text-gray-400" />
        </div>
        {nextStage && (
          <div className="mt-3 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <span>Tiếp theo:</span>
            <span>{nextStage.icon} {nextStage.name}</span>
            <span>({nextStage.xpRequired - (xp || 0) > 0 ? `cần ${(nextStage.xpRequired - (xp || 0)).toLocaleString()} XP` : '🔓 Đã mở khóa!'})</span>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-base font-bold text-gray-800 dark:text-gray-100 mb-3">⚡ Học ngay</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickActions.slice(0, 4).map((a, i) => (
            <button key={a.id} onClick={() => setCurrentPage(a.id)}
              style={{ animationDelay: `${i * 50}ms` }}
              className={`${a.bg} card-hover animate-fade-up rounded-2xl p-4 text-left group transition-all border border-white/60 dark:border-gray-700`}>
              <div className="text-2xl mb-2 group-hover:scale-110 group-hover:animate-wiggle transition-transform">{a.icon}</div>
              <div className="font-bold text-gray-800 dark:text-gray-100 text-sm">{a.label}</div>
              <div className="text-xs text-gray-500 mt-0.5">{a.desc}</div>
            </button>
          ))}
        </div>
        <div className="grid grid-cols-4 gap-3 mt-3">
          {quickActions.slice(4).map((a, i) => (
            <button key={a.id} onClick={() => setCurrentPage(a.id)}
              style={{ animationDelay: `${(i + 4) * 50}ms` }}
              className={`${a.bg} card-hover animate-fade-up rounded-2xl p-3 text-left group transition-all border border-white/60 dark:border-gray-700`}>
              <div className="text-xl mb-1 group-hover:scale-110 transition-transform">{a.icon}</div>
              <div className="font-bold text-gray-800 dark:text-gray-100 text-xs">{a.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Achievements + Level Progress row */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Achievements */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
              <Trophy size={18} className="text-yellow-500" /> Thành Tích
            </h3>
            <span className="text-xs text-gray-400">{(unlockedAchievements || []).length}/{achievements.length}</span>
          </div>
          <div className="space-y-2">
            {recentAchievements.length > 0 ? recentAchievements.map(a => (
              <div key={a.id} className="flex items-center gap-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-2">
                <span className="text-xl">{a.icon}</span>
                <div>
                  <div className="text-xs font-bold text-gray-800 dark:text-gray-100">{a.titleVi}</div>
                  <div className="text-xs text-gray-500">+{a.xp} XP</div>
                </div>
              </div>
            )) : (
              <p className="text-xs text-gray-400 text-center py-2">Hãy học để mở khóa thành tích!</p>
            )}
            {lockedAchievements.slice(0, 2).map(a => (
              <div key={a.id} className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 rounded-xl p-2 opacity-60">
                <span className="text-xl grayscale">{a.icon}</span>
                <div>
                  <div className="text-xs font-bold text-gray-600 dark:text-gray-400">{a.titleVi}</div>
                  <div className="text-xs text-gray-400">{a.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Module Progress */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Zap size={18} className="text-indigo-500" /> Tiến Độ Mô-đun
          </h3>
          <div className="space-y-3 mb-5">
            {[
              { label: 'Ngữ pháp', done: completedGrammar.length, total: grammarLessons.length, color: 'bg-orange-500' },
              { label: 'Nghe', done: completedListening.length, total: listeningScripts.length, color: 'bg-teal-500' },
              { label: 'Nói', done: completedSpeaking.length, total: speakingLessons.length, color: 'bg-rose-500' },
            ].map(m => {
              const pct = m.total > 0 ? Math.round((m.done / m.total) * 100) : 0
              return (
                <div key={m.label}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">{m.label}</span>
                    <span className="text-xs text-gray-500">{m.done}/{m.total}</span>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                    <div className={`h-2 rounded-full transition-all duration-700 ${m.color}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
          <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3">Tiến Độ Từ Vựng Theo Level</h4>
          <div className="space-y-3">
            {levelProgress.map(({ level: lv, total, learned, pct }) => (
              <div key={lv}>
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${levelColors[lv]}`}>{lv}</span>
                  <span className="text-xs text-gray-500">{learned}/{total}</span>
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                  <div className={`h-2 rounded-full transition-all duration-700 ${
                    lv === 'Beginner' ? 'bg-lime-500'
                    : lv === 'A1' ? 'bg-green-500'
                    : lv === 'A2' ? 'bg-blue-500'
                    : lv === 'B1' ? 'bg-purple-500'
                    : lv === 'B1+' ? 'bg-fuchsia-500'
                    : lv === 'IELTS Foundation' ? 'bg-amber-500'
                    : 'bg-red-500'
                  }`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* IELTS Hub Progress */}
      {(state.ieltsProgress) && (
        <div
          onClick={() => setCurrentPage('ielts-hub')}
          className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-5 text-white cursor-pointer hover:shadow-lg hover:opacity-95 transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-xs text-indigo-200 mb-0.5">Mục tiêu: Band {state.ieltsProgress.targetBand}</div>
              <h3 className="font-bold flex items-center gap-2">🏆 IELTS Hub</h3>
            </div>
            <ChevronRight size={18} className="text-indigo-200" />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[
              { icon: '🎧', done: state.ieltsProgress.completedListening.length, total: ieltsTotals.listening },
              { icon: '📖', done: state.ieltsProgress.completedReading.length,   total: ieltsTotals.reading },
              { icon: '✍️', done: state.ieltsProgress.completedWriting.length,   total: ieltsTotals.writing },
              { icon: '📚', done: state.ieltsProgress.learnedVocab.length,       total: ieltsTotals.vocab },
            ].map((s, i) => {
              const pct = Math.round((s.done / s.total) * 100)
              return (
                <div key={i} className="bg-white/10 rounded-xl p-2 text-center">
                  <div className="text-lg">{s.icon}</div>
                  <div className="text-xs font-bold mt-0.5">{s.done}/{s.total}</div>
                  <div className="w-full bg-white/20 rounded-full h-1.5 mt-1">
                    <div className="h-1.5 rounded-full bg-white transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Word of Day */}
      {wordOfDay && (
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-2xl p-5 border border-indigo-100 dark:border-indigo-800">
        <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
          ✨ Từ Của Ngày Hôm Nay
        </h3>
        <div className="flex gap-4 items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl font-bold text-indigo-700 dark:text-indigo-300">{wordOfDay.english}</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${levelColors[wordOfDay.level]}`}>{wordOfDay.level}</span>
            </div>
            <p className="text-xs text-gray-400 font-mono">{wordOfDay.pronunciation}</p>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mt-1">{wordOfDay.vietnamese}</p>
            <p className="text-xs text-gray-500 italic mt-1">"{wordOfDay.example}"</p>
          </div>
        </div>
      </div>
      )}
      {/* Analytics */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 lg:col-span-2">
          <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
            <BarChart3 size={18} className="text-indigo-500" /> Analytics học tập
          </h3>
          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-3 mb-4">
            {[
              { label: 'Quiz TB', value: `${analytics.overview.avgQuiz}%`, sub: `best ${analytics.overview.bestQuiz}%`, color: 'bg-indigo-50 dark:bg-indigo-900/20' },
              { label: 'Course XP', value: analytics.overview.courseXP, sub: `${analytics.overview.courseLessonsDone} bài`, color: 'bg-cyan-50 dark:bg-cyan-900/20' },
              { label: 'Review tuần', value: analytics.srs.weeklyReviews, sub: `${analytics.srs.combined.due} due`, color: 'bg-rose-50 dark:bg-rose-900/20' },
              { label: 'Top streak', value: analytics.daily.streak, sub: `${analytics.daily.dailyPct}% goal`, color: 'bg-amber-50 dark:bg-amber-900/20' },
            ].map((card, i) => (
              <div key={i} className={`${card.color} rounded-xl p-3`}>
                <div className="text-xs text-gray-500 dark:text-gray-400">{card.label}</div>
                <div className="text-xl font-bold text-gray-800 dark:text-gray-100 mt-1">{card.value}</div>
                <div className="text-xs text-gray-400 mt-0.5">{card.sub}</div>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <div className="text-xs uppercase tracking-wider text-gray-400 mb-2">Kỹ năng yếu</div>
              <div className="space-y-2">
                {analytics.weakSkills.map((w, i) => (
                  <div key={w.skill} className="flex items-center justify-between rounded-xl bg-gray-50 dark:bg-gray-700/40 px-3 py-2">
                    <div className="flex items-center gap-2">
                      <Brain size={14} className="text-purple-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-200">{w.skill}</span>
                    </div>
                    <span className="text-xs font-mono text-gray-500">{w.score}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-gray-400 mb-2">Top chủ đề đã học</div>
              <div className="space-y-2">
                {analytics.topTopics.length > 0 ? analytics.topTopics.map((t) => (
                  <div key={t.topic} className="flex items-center justify-between rounded-xl bg-gray-50 dark:bg-gray-700/40 px-3 py-2">
                    <span className="text-sm text-gray-700 dark:text-gray-200 truncate mr-2">{t.topic}</span>
                    <span className="text-xs font-mono text-gray-500">{t.count}</span>
                  </div>
                )) : (
                  <p className="text-xs text-gray-400">Chưa đủ dữ liệu chủ đề.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Flame size={18} className="text-rose-500" /> Hoạt động 7 ngày
          </h3>
          <div className="flex items-end justify-between gap-2 h-32 mb-4">
            {analytics.srs.last7Days.map((d) => {
              const h = Math.min(110, (d.count || 0) * 8)
              return (
                <div key={d.key} className="flex-1 flex flex-col items-center justify-end gap-2">
                  <div className="text-[10px] text-gray-500">{d.count}</div>
                  <div className="w-full rounded-t bg-gradient-to-t from-rose-500 to-pink-400" style={{ height: `${Math.max(8, h)}px` }} />
                  <div className="text-[10px] text-gray-400">{d.label}</div>
                </div>
              )
            })}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
            <div>Due cards: <span className="font-bold text-gray-700 dark:text-gray-200">{analytics.srs.combined.due}</span></div>
            <div>Mastered: <span className="font-bold text-gray-700 dark:text-gray-200">{analytics.srs.combined.mastered}</span></div>
            <div>Weak cards: <span className="font-bold text-gray-700 dark:text-gray-200">{analytics.srs.combined.weak}</span></div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-3 text-xs text-gray-400 dark:text-gray-600 border-t border-gray-100 dark:border-gray-800 mt-2">
        © 2025 <span className="font-medium text-gray-500 dark:text-gray-500">Nguyễn An Dương</span> · English Master IELTS
      </div>
    </div>
  )
}
