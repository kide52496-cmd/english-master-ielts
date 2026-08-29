import { useMemo } from 'react'
import { useApp } from '../context/AppContext'
import { vocabulary } from '../data/vocabulary'
import { grammarLessons } from '../data/grammarLessons'
import { listeningScripts } from '../data/listeningScripts'
import { speakingLessons } from '../data/speakingLessons'
import { stories } from '../data/stories'
import {
  getStageProgress,
  getSkillScores,
  getWeakSkills,
  getTodayPlan,
  getStageFocus,
  getSkillLabel,
} from '../utils/personalization'
import {
  loadReviewData, getDueCards, getWeakCards, getMasteredCards,
} from '../utils/spacedRepetition'
import {
  Target, Sparkles, ChevronRight, Flame, BookOpen,
  TrendingUp, AlertCircle, Trophy,
} from 'lucide-react'

const SKILL_BAR_COLORS = {
  vocabulary: 'bg-blue-500',
  grammar:    'bg-purple-500',
  listening:  'bg-cyan-500',
  speaking:   'bg-pink-500',
  reading:    'bg-amber-500',
  writing:    'bg-emerald-500',
}

function SkillBar({ skill, score }) {
  const color = SKILL_BAR_COLORS[skill] || 'bg-indigo-500'
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-gray-700 dark:text-gray-200">
          {getSkillLabel(skill)}
        </span>
        <span className="text-xs font-mono text-gray-500 dark:text-gray-400">{score}%</span>
      </div>
      <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <div className={`h-full ${color} transition-all duration-500`}
             style={{ width: `${score}%` }} />
      </div>
    </div>
  )
}

export default function PersonalizedPlan({ setCurrentPage }) {
  const { state } = useApp()

  const ctx = useMemo(() => ({
    totalVocab:    vocabulary.length || 200,
    totalGrammar:  grammarLessons.length || 30,
    totalListen:   listeningScripts.length || 18,
    totalSpeak:    speakingLessons.length || 12,
    totalStories:  stories.length || 15,
    totalIELTSv:   200,
  }), [])

  const reviewData = useMemo(() => loadReviewData(), [])
  const dueCards     = useMemo(() => getDueCards(reviewData), [reviewData])
  const weakCards    = useMemo(() => getWeakCards(reviewData), [reviewData])
  const masteredCards = useMemo(() => getMasteredCards(reviewData), [reviewData])

  const scores      = useMemo(() => getSkillScores(state, ctx), [state, ctx])
  const weakSkills  = useMemo(() => getWeakSkills(scores), [scores])
  const stageProg   = useMemo(() => getStageProgress(state), [state])
  const stageFocus  = useMemo(() => getStageFocus(state), [state])
  const todayPlan   = useMemo(
    () => getTodayPlan(state, { ...ctx, dueCount: dueCards.length }),
    [state, ctx, dueCards.length],
  )

  const goPage = (page) => setCurrentPage?.(page)

  return (
    <div className="space-y-5 animate-fade-up">
      {/* Premium Header */}
      <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 bg-200 animate-gradient-x text-white rounded-3xl p-5 shadow-xl relative overflow-hidden">
        <div className="blob bg-pink-300/40 w-44 h-44 -top-12 -right-12" />
        <div className="blob bg-indigo-300/40 w-36 h-36 -bottom-12 -left-10 animate-float-slow" />
        <div className="relative flex items-start gap-3 flex-wrap">
          <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center text-2xl animate-float">
            <Sparkles size={22} />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg sm:text-xl font-bold drop-shadow">Lộ trình của bạn hôm nay</h2>
            <p className="text-xs sm:text-sm text-white/90 mt-1">
              Plan dựa trên tiến độ hiện tại, kỹ năng yếu và thẻ đến hạn ôn tập.
            </p>
          </div>
        </div>

        {/* Stage progress */}
        <div className="relative mt-4 bg-white/15 backdrop-blur-sm rounded-xl p-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold">
              {stageProg.current.icon} {stageProg.current.name}
            </span>
            {stageProg.next ? (
              <span className="text-xs text-white/80">
                → {stageProg.next.icon} {stageProg.next.name}
              </span>
            ) : (
              <span className="text-xs text-white/80">🎯 Stage cuối</span>
            )}
          </div>
          <div className="mt-2 h-2 rounded-full bg-white/25 overflow-hidden relative">
            <div className="h-full bg-white transition-all duration-700 progress-shine relative"
                 style={{ width: `${stageProg.percent}%` }} />
          </div>
          <div className="mt-2 text-xs text-white/85">
            {stageProg.xpInStage} / {stageProg.xpNeeded} XP · {stageProg.percent}%
          </div>
          <p className="mt-2 text-xs text-white/90 italic">{stageFocus.advice}</p>
        </div>
      </div>

      {/* Today's plan */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 sm:p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Target className="text-indigo-500" size={18} />
          <h3 className="text-base font-bold text-gray-800 dark:text-gray-100">
            Hôm nay nên làm
          </h3>
        </div>
        <ul className="space-y-2">
          {todayPlan.map(item => (
            <li key={item.id}>
              <button
                onClick={() => goPage(item.page)}
                className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50/40 dark:hover:bg-indigo-900/20 transition text-left"
              >
                <div className="flex-1">
                  <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                    {item.title}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {item.desc}
                  </div>
                </div>
                <ChevronRight size={18} className="text-gray-400" />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Skill scores */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 sm:p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="text-emerald-500" size={18} />
          <h3 className="text-base font-bold text-gray-800 dark:text-gray-100">
            Phân tích kỹ năng
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
          {Object.entries(scores).map(([skill, score]) => (
            <SkillBar key={skill} skill={skill} score={score} />
          ))}
        </div>

        {weakSkills.length > 0 && (
          <div className="mt-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 flex items-start gap-2">
            <AlertCircle size={16} className="text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-amber-800 dark:text-amber-200">
              <span className="font-semibold">Điểm yếu cần luyện thêm:</span>{' '}
              {weakSkills.map(w => `${getSkillLabel(w.skill)} (${w.score}%)`).join(', ')}
            </p>
          </div>
        )}
      </div>

      {/* SRS overview */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 sm:p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Flame className="text-rose-500" size={18} />
          <h3 className="text-base font-bold text-gray-800 dark:text-gray-100">
            Spaced Repetition
          </h3>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-900/20 text-center">
            <div className="text-2xl font-bold text-rose-600 dark:text-rose-300">{dueCards.length}</div>
            <div className="text-xs text-rose-700 dark:text-rose-300/80">Đến hạn</div>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-center">
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-300">{weakCards.length}</div>
            <div className="text-xs text-amber-700 dark:text-amber-300/80">Hay quên</div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-center">
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-300">{masteredCards.length}</div>
            <div className="text-xs text-emerald-700 dark:text-emerald-300/80">Đã thuộc</div>
          </div>
        </div>
        <button
          onClick={() => goPage('review-center')}
          className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold transition"
        >
          <BookOpen size={16} />
          Mở Review Center
        </button>
      </div>

      {/* Achievements quick link */}
      <button
        onClick={() => goPage('achievements')}
        className="w-full flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-amber-300 dark:hover:border-amber-700 transition"
      >
        <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
          <Trophy className="text-amber-500" size={20} />
        </div>
        <div className="flex-1 text-left">
          <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">
            {state.unlockedAchievements?.length || 0} thành tích đã mở khóa
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Khám phá huy hiệu kế tiếp
          </div>
        </div>
        <ChevronRight size={18} className="text-gray-400" />
      </button>
    </div>
  )
}
