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
import { BookOpen, Trophy, Zap, Target, ChevronRight, Star, BarChart3, Flame, Brain, Database, Bot, Sparkles } from 'lucide-react'
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
    { id: 'mongodb-cloud', label: 'MongoDB Cloud', desc: 'Cluster0 · Sync dữ liệu', icon: '🍃', color: 'from-emerald-500 to-teal-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
    { id: 'ai-tutor',   label: 'AI IELTS Copilot', desc: 'Chấm Writing & Speaking', icon: '🤖', color: 'from-purple-500 to-indigo-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
    { id: 'roadmap',    label: 'Lộ Trình',   desc: `${roadmapStages.length} stage từ mất gốc`, icon: '🗺️', color: 'from-indigo-500 to-purple-600', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
    { id: 'vocabulary', label: 'Từ Vựng',   desc: `${vocabulary.length} từ offline`, icon: '📖', color: 'from-blue-500 to-cyan-500',    bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { id: 'flashcard',  label: 'Flashcard', desc: 'Lật thẻ ghi nhớ',    icon: '🃏', color: 'from-purple-500 to-pink-500',  bg: 'bg-purple-50 dark:bg-purple-900/20' },
    { id: 'quiz',       label: 'Quiz',      desc: `${quizScores.length} câu trắc nghiệm`, icon: '📝', color: 'from-green-500 to-emerald-500', bg: 'bg-green-50 dark:bg-green-900/20' },
    { id: 'grammar',    label: 'Ngữ Pháp',  desc: `${grammarLessons.length} bài ngữ pháp`,   icon: '📚', color: 'from-orange-500 to-amber-500',  bg: 'bg-orange-50 dark:bg-orange-900/20' },
    { id: 'listening-pack', label: '100 Bài Nghe-Nói', desc: 'Foundation → IELTS 6.5', icon: '🎧', color: 'from-teal-500 to-cyan-500', bg: 'bg-teal-50 dark:bg-teal-900/20' },
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
    <div className="space-y-6">

      {/* Hero Banner: Cyber-Luminous Command Center */}
      <div className="relative rounded-3xl p-6 sm:p-8 text-white shadow-2xl overflow-hidden bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600 border border-white/20">
        {/* Animated dynamic glowing auras */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-pink-400/30 rounded-full blur-3xl pointer-events-none animate-float" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-cyan-400/30 rounded-full blur-3xl pointer-events-none animate-float-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/10 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1 space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-xs font-semibold tracking-wide shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Học tập không giới hạn · Offline 100%</span>
            </div>

            <div>
              <p className="text-indigo-100 text-sm font-medium">Chào mừng trở lại! 👋</p>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display bg-gradient-to-r from-white via-indigo-50 to-pink-100 bg-clip-text text-transparent">
                English Master IELTS
              </h1>
            </div>

            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-sm">
              <span className="text-xl animate-float">{currentStage.icon}</span>
              <span className="font-semibold text-white">{currentStage.name}</span>
              <span className="text-xs bg-indigo-500/80 px-2 py-0.5 rounded-full font-bold">Giai đoạn hiện tại</span>
            </div>

            {/* XP Progress bar */}
            <div className="pt-1 max-w-md">
              <div className="flex justify-between text-xs text-indigo-100 font-semibold mb-1.5">
                <span>Cấp độ {level || 1} → {(level || 1) + 1}</span>
                <span>{xpInLevel} / {xpNextLevel} XP</span>
              </div>
              <div className="bg-black/25 backdrop-blur-md rounded-full h-3 p-0.5 border border-white/20 overflow-hidden relative shadow-inner">
                <div
                  className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-pink-300 rounded-full h-full transition-all duration-700 progress-shine relative shadow-md"
                  style={{ width: `${(xpInLevel / xpNextLevel) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* XP Ring & Level Orb */}
          <div className="flex items-center gap-4 self-center md:self-auto">
            <div className="relative flex-shrink-0 animate-float p-3 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/25 shadow-xl">
              <XPRingSmall xp={xpInLevel} targetXP={xpNextLevel} size={84} />
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black font-display leading-none text-white drop-shadow-md">{level || 1}</span>
                <span className="text-[11px] font-bold text-indigo-200 tracking-wider uppercase mt-0.5">LEVEL</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 mt-6 pt-6 border-t border-white/15 relative z-10">
          {[
            { v: (xp || 0).toLocaleString(), l: 'Điểm XP', e: '⚡', grad: 'from-amber-400 to-yellow-500' },
            { v: `${completedGrammar.length}/${grammarLessons.length}`, l: 'Ngữ pháp', e: '✏️', grad: 'from-orange-400 to-amber-500' },
            { v: `${completedListening.length}/${listeningScripts.length}`, l: 'Luyện nghe', e: '🔊', grad: 'from-teal-400 to-cyan-500' },
            { v: `${completedSpeaking.length}/${speakingLessons.length}`, l: 'Luyện nói', e: '🎙️', grad: 'from-rose-400 to-pink-500' },
            { v: streak || 0, l: 'Streak ngày', e: '🔥', grad: 'from-red-400 to-orange-500' },
            { v: (unlockedAchievements || []).length, l: 'Huy hiệu', e: '🏅', grad: 'from-purple-400 to-indigo-500' },
          ].map((s, i) => (
            <div
              key={i}
              className="bg-white/10 hover:bg-white/20 transition-all rounded-2xl p-2.5 sm:p-3 text-center backdrop-blur-md border border-white/15 shadow-sm group hover:-translate-y-1"
            >
              <div className="text-lg sm:text-xl mb-1 group-hover:scale-125 transition-transform">{s.e}</div>
              <div className="font-extrabold text-sm sm:text-base leading-tight font-display">{s.v}</div>
              <div className="text-[11px] text-indigo-100/90 font-medium leading-none mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Goal: Gamified Progress Bar */}
      <div className={`rounded-3xl p-5 border transition-all glass-card ${dailyDone ? 'border-emerald-500/40 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-lg shadow-emerald-500/10' : 'border-indigo-500/20 shadow-md'}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-md ${dailyDone ? 'bg-emerald-500 text-white shadow-emerald-500/30 animate-wiggle' : 'bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-indigo-500/30'}`}>
              <Target size={20} />
            </div>
            <div>
              <span className="font-bold text-sm sm:text-base text-slate-800 dark:text-slate-100 block font-display">
                {dailyDone ? '🎉 Mục tiêu hôm nay đã hoàn thành xuất sắc!' : 'Mục tiêu rèn luyện hôm nay'}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {dailyDone ? 'Bạn đã giữ vững phong độ học tập' : 'Hoàn thành các hoạt động để duy trì chuỗi học'}
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className={`text-base font-extrabold font-display ${dailyDone ? 'text-emerald-600 dark:text-emerald-400' : 'text-indigo-600 dark:text-indigo-400'}`}>
              {dailyProgress || 0} / {dailyGoal || 10}
            </span>
            <span className="block text-[11px] text-slate-400 font-medium">hoạt động</span>
          </div>
        </div>
        <div className="bg-slate-200/80 dark:bg-slate-800/80 rounded-full h-3 p-0.5 overflow-hidden relative shadow-inner">
          <div
            className={`h-full rounded-full transition-all duration-700 progress-shine relative shadow-sm ${dailyDone ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-emerald-500/50' : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'}`}
            style={{ width: `${dailyGoalPct}%` }}
          />
        </div>
      </div>

      {/* Full-Stack Cloud & AI Command Deck */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: MongoDB Cloud Controller */}
        <div
          onClick={() => setCurrentPage('mongodb-cloud')}
          className="relative overflow-hidden rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-emerald-950/80 via-slate-900 to-slate-950 border border-emerald-500/30 shadow-xl hover:border-emerald-500/60 transition-all cursor-pointer group"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform" />
          <div className="relative z-10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>MongoDB Atlas Cloud</span>
              </div>
              <span className="text-xs font-mono text-emerald-400/80">Cluster0 · 28ms</span>
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white group-hover:text-emerald-400 transition-colors flex items-center gap-2">
                <Database size={20} className="text-emerald-400" />
                <span>MongoDB Cloud Control</span>
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Kiểm soát 4 Collections dữ liệu (user_progress, srs_cards, ielts_submissions). Đồng bộ đám mây 2 chiều.
              </p>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
              <span className="text-emerald-400 font-semibold">db.user_progress.find()</span>
              <span className="text-white font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                Mở Control Hub <ChevronRight size={14} />
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: AI IELTS Copilot */}
        <div
          onClick={() => setCurrentPage('ai-tutor')}
          className="relative overflow-hidden rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-indigo-950/80 via-purple-950 to-slate-950 border border-indigo-500/30 shadow-xl hover:border-indigo-500/60 transition-all cursor-pointer group"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/10 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform" />
          <div className="relative z-10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold">
                <Sparkles size={12} className="text-yellow-400" />
                <span>AI IELTS Examiner 2.0</span>
              </div>
              <span className="text-xs font-mono text-indigo-300/80">4 tiêu chí BC / IDP</span>
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white group-hover:text-indigo-400 transition-colors flex items-center gap-2">
                <Bot size={20} className="text-indigo-400" />
                <span>AI IELTS Copilot & Examiner</span>
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Tự động chấm bài Writing Task 1 & 2, đối thoại Speaking trực tiếp và nâng cấp câu văn lên Band 8.5+.
              </p>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-indigo-950/80 text-xs">
              <span className="text-indigo-300 font-semibold">Writing · Speaking · Q&A</span>
              <span className="text-white font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                Luyện cùng AI <ChevronRight size={14} />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Bento Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 font-display">
            <Zap size={18} className="text-amber-500 fill-amber-500" /> Trung Tâm Học Tập
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">8 mô-đun cốt lõi</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {quickActions.map((a, i) => (
            <button
              key={a.id}
              onClick={() => setCurrentPage(a.id)}
              style={{ animationDelay: `${i * 40}ms` }}
              className="glass-card glass-card-hover rounded-3xl p-4 sm:p-5 text-left group transition-all relative overflow-hidden flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${a.color} flex items-center justify-center text-2xl shadow-lg shadow-indigo-500/15 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                  {a.icon}
                </div>
                <ChevronRight size={16} className="text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </div>
              <div>
                <div className="font-bold text-slate-800 dark:text-slate-100 text-sm sm:text-base font-display group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {a.label}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1 font-medium">
                  {a.desc}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Achievements + Level Progress row */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Achievements */}
        <div className="glass-card rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 font-display text-base">
              <Trophy size={18} className="text-amber-500 fill-amber-500" /> Bảng Thành Tích
            </h3>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              {(unlockedAchievements || []).length} / {achievements.length}
            </span>
          </div>
          <div className="space-y-2.5">
            {recentAchievements.length > 0 ? recentAchievements.map(a => (
              <div key={a.id} className="flex items-center gap-3 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl p-3 hover:scale-[1.01] transition-transform">
                <span className="text-2xl p-1.5 rounded-xl bg-white/60 dark:bg-slate-800/60 shadow-sm">{a.icon}</span>
                <div className="flex-1">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-100 font-display">{a.titleVi}</div>
                  <div className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold mt-0.5">+{a.xp} XP đạt được</div>
                </div>
              </div>
            )) : (
              <p className="text-xs text-slate-400 text-center py-4">Bắt đầu học các bài đầu tiên để mở khóa huy hiệu nhé!</p>
            )}
            {lockedAchievements.slice(0, 2).map(a => (
              <div key={a.id} className="flex items-center gap-3 bg-slate-100/60 dark:bg-slate-800/40 border border-slate-200/40 dark:border-white/5 rounded-2xl p-3 opacity-60">
                <span className="text-2xl grayscale p-1.5 rounded-xl bg-white/40 dark:bg-slate-700/40">{a.icon}</span>
                <div>
                  <div className="text-xs font-bold text-slate-600 dark:text-slate-400">{a.titleVi}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{a.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Module Progress */}
        <div className="glass-card rounded-3xl p-6 shadow-sm">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2 font-display text-base">
            <Zap size={18} className="text-indigo-500 fill-indigo-500" /> Tiến Độ Các Kỹ Năng
          </h3>
          <div className="space-y-3.5 mb-6">
            {[
              { label: 'Ngữ pháp cơ bản & nâng cao', done: completedGrammar.length, total: grammarLessons.length, grad: 'from-orange-500 to-amber-400' },
              { label: 'Luyện nghe phản xạ (Audio)', done: completedListening.length, total: listeningScripts.length, grad: 'from-teal-500 to-emerald-400' },
              { label: 'Luyện nói phát âm AI', done: completedSpeaking.length, total: speakingLessons.length, grad: 'from-rose-500 to-pink-400' },
            ].map(m => {
              const pct = m.total > 0 ? Math.round((m.done / m.total) * 100) : 0
              return (
                <div key={m.label}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{m.label}</span>
                    <span className="text-xs font-bold text-slate-500 font-mono">{m.done}/{m.total} ({pct}%)</span>
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-800/80 rounded-full h-2.5 p-0.5 overflow-hidden relative">
                    <div className={`h-full rounded-full transition-all duration-700 bg-gradient-to-r ${m.grad} progress-shine relative shadow-sm`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
          <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 font-display">Tiến Độ Từ Vựng Theo Level</h4>
          <div className="space-y-3">
            {levelProgress.map(({ level: lv, total, learned, pct }) => (
              <div key={lv}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${levelColors[lv]}`}>{lv}</span>
                  <span className="text-xs font-semibold text-slate-500 font-mono">{learned}/{total}</span>
                </div>
                <div className="bg-slate-100 dark:bg-slate-800/80 rounded-full h-2 p-0.5 overflow-hidden relative">
                  <div className={`h-full rounded-full transition-all duration-700 ${
                    lv === 'Beginner' ? 'bg-lime-500'
                    : lv === 'A1' ? 'bg-emerald-500'
                    : lv === 'A2' ? 'bg-blue-500'
                    : lv === 'B1' ? 'bg-purple-500'
                    : lv === 'B1+' ? 'bg-fuchsia-500'
                    : lv === 'IELTS Foundation' ? 'bg-amber-500'
                    : 'bg-rose-500'
                  }`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* IELTS Hub Progress: High-End Neon Card */}
      {(state.ieltsProgress) && (
        <div
          onClick={() => setCurrentPage('ielts-hub')}
          className="relative rounded-3xl p-6 text-white cursor-pointer overflow-hidden bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all border border-white/20 group"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform" />
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-indigo-100 mb-1 border border-white/25">
                Target: Band {state.ieltsProgress.targetBand}
              </div>
              <h3 className="text-xl font-black flex items-center gap-2 font-display">🏆 IELTS Hub Chuyên Sâu</h3>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:translate-x-1 transition-transform border border-white/30">
              <ChevronRight size={20} className="text-white" />
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative z-10">
            {[
              { icon: '🎧', label: 'Listening', done: state.ieltsProgress.completedListening.length, total: ieltsTotals.listening },
              { icon: '📖', label: 'Reading', done: state.ieltsProgress.completedReading.length,   total: ieltsTotals.reading },
              { icon: '✍️', label: 'Writing', done: state.ieltsProgress.completedWriting.length,   total: ieltsTotals.writing },
              { icon: '📚', label: 'Vocab 6.0', done: state.ieltsProgress.learnedVocab.length,       total: ieltsTotals.vocab },
            ].map((s, i) => {
              const pct = Math.round((s.done / s.total) * 100)
              return (
                <div key={i} className="bg-white/15 hover:bg-white/25 transition-colors backdrop-blur-md rounded-2xl p-3 text-center border border-white/15">
                  <div className="text-2xl mb-1">{s.icon}</div>
                  <div className="text-[11px] font-medium text-indigo-100">{s.label}</div>
                  <div className="text-xs font-bold font-display mt-0.5">{s.done} / {s.total}</div>
                  <div className="w-full bg-black/25 rounded-full h-1.5 mt-2 overflow-hidden">
                    <div className="h-full rounded-full bg-white transition-all shadow-sm" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Word of Day */}
      {wordOfDay && (
      <div className="glass-card rounded-3xl p-6 shadow-sm relative overflow-hidden border border-indigo-500/20">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 font-display text-base">
            <span className="text-xl">✨</span> Từ Vựng Nổi Bật Hôm Nay
          </h3>
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${levelColors[wordOfDay.level]}`}>
            {wordOfDay.level}
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50">
          <div>
            <div className="flex items-baseline gap-2.5 mb-1">
              <span className="text-2xl font-extrabold text-indigo-700 dark:text-indigo-300 font-display tracking-tight">{wordOfDay.english}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">{wordOfDay.pronunciation}</span>
            </div>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{wordOfDay.vietnamese}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 italic mt-1 bg-white/60 dark:bg-black/20 p-2 rounded-xl">"{wordOfDay.example}"</p>
          </div>
          <button
            onClick={() => setCurrentPage('vocabulary')}
            className="self-start sm:self-auto px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold shadow-md shadow-indigo-500/25 hover:scale-105 transition-all whitespace-nowrap btn-shine"
          >
            Học Từ Này →
          </button>
        </div>
      </div>
      )}

      {/* Analytics */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="glass-card rounded-3xl p-6 shadow-sm lg:col-span-2">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2 font-display text-base">
            <BarChart3 size={18} className="text-indigo-500" /> Báo Cáo Hoạt Động & Năng Lực
          </h3>
          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-3 mb-5">
            {[
              { label: 'Điểm Quiz TB', value: `${analytics.overview.avgQuiz}%`, sub: `Tốt nhất ${analytics.overview.bestQuiz}%`, color: 'bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300' },
              { label: 'Kinh nghiệm Course', value: analytics.overview.courseXP, sub: `${analytics.overview.courseLessonsDone} bài hoàn thành`, color: 'bg-cyan-50/70 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300' },
              { label: 'Ôn tập tuần này', value: analytics.srs.weeklyReviews, sub: `${analytics.srs.combined.due} thẻ đến hạn`, color: 'bg-rose-50/70 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300' },
              { label: 'Kỷ lục Streak', value: `${analytics.daily.streak} ngày`, sub: `${analytics.daily.dailyPct}% mục tiêu`, color: 'bg-amber-50/70 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300' },
            ].map((card, i) => (
              <div key={i} className={`${card.color} rounded-2xl p-3.5 border border-current/10 shadow-sm`}>
                <div className="text-[11px] opacity-80 font-medium">{card.label}</div>
                <div className="text-xl font-extrabold font-display mt-1">{card.value}</div>
                <div className="text-[11px] opacity-70 mt-0.5">{card.sub}</div>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 font-display">Kỹ năng cần củng cố</div>
              <div className="space-y-2">
                {analytics.weakSkills.map((w) => (
                  <div key={w.skill} className="flex items-center justify-between rounded-2xl bg-slate-100/70 dark:bg-slate-800/50 px-3.5 py-2.5">
                    <div className="flex items-center gap-2">
                      <Brain size={14} className="text-purple-500" />
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{w.skill}</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400">{w.score}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 font-display">Chủ đề từ vựng hàng đầu</div>
              <div className="space-y-2">
                {analytics.topTopics.length > 0 ? analytics.topTopics.map((t) => (
                  <div key={t.topic} className="flex items-center justify-between rounded-2xl bg-slate-100/70 dark:bg-slate-800/50 px-3.5 py-2.5">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate mr-2">{t.topic}</span>
                    <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">{t.count} từ</span>
                  </div>
                )) : (
                  <p className="text-xs text-slate-400 py-3 text-center">Chưa đủ dữ liệu chủ đề.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6 shadow-sm">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2 font-display text-base">
            <Flame size={18} className="text-rose-500 fill-rose-500" /> Hoạt Động 7 Ngày Qua
          </h3>
          <div className="flex items-end justify-between gap-2.5 h-36 mb-4 pt-4 px-1">
            {analytics.srs.last7Days.map((d) => {
              const h = Math.min(110, (d.count || 0) * 8)
              return (
                <div key={d.key} className="flex-1 flex flex-col items-center justify-end gap-1.5 h-full">
                  <div className="text-[10px] font-bold text-slate-500 font-mono">{d.count}</div>
                  <div className="w-full rounded-t-xl bg-gradient-to-t from-rose-500 via-pink-500 to-indigo-400 shadow-sm" style={{ height: `${Math.max(10, h)}px` }} />
                  <div className="text-[10px] font-semibold text-slate-400">{d.label}</div>
                </div>
              )
            })}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1.5 pt-3 border-t border-slate-200/60 dark:border-white/5">
            <div className="flex justify-between"><span>Thẻ cần ôn:</span><span className="font-bold text-slate-800 dark:text-slate-200">{analytics.srs.combined.due}</span></div>
            <div className="flex justify-between"><span>Đã thành thạo:</span><span className="font-bold text-emerald-600 dark:text-emerald-400">{analytics.srs.combined.mastered}</span></div>
            <div className="flex justify-between"><span>Thẻ còn yếu:</span><span className="font-bold text-rose-600 dark:text-rose-400">{analytics.srs.combined.weak}</span></div>
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
