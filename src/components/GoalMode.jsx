import { useEffect, useMemo, useState } from 'react'
import { useApp } from '../context/AppContext'
import {
  GOAL_CATALOG,
  loadActiveGoal,
  setActiveGoal,
  clearActiveGoal,
  getGoalProgress,
  getTodaySkillMix,
  getMilestones,
} from '../utils/goalMode'
import {
  Target, Flame, Calendar, ChevronRight, Trash2, Sparkles, Award,
} from 'lucide-react'

const SKILL_LABEL = {
  vocabulary: 'Từ vựng',
  grammar:    'Ngữ pháp',
  listening:  'Nghe',
  speaking:   'Nói',
  reading:    'Đọc',
  writing:    'Viết',
}

function GoalCard({ goal, active, onPick }) {
  return (
    <button
      onClick={() => onPick(goal.id)}
      className={`text-left rounded-2xl p-4 border-2 transition shadow-sm
        ${active
          ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20'
          : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-indigo-300 dark:hover:border-indigo-700'
        }`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${goal.color} text-white text-2xl flex items-center justify-center flex-shrink-0`}>
          {goal.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold text-gray-800 dark:text-gray-100">{goal.title}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{goal.desc}</div>
          <div className="flex flex-wrap gap-2 mt-2 text-[10px]">
            <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
              {goal.weeks} tuần
            </span>
            <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
              {goal.dailyMinutes} phút/ngày
            </span>
          </div>
        </div>
      </div>
    </button>
  )
}

export default function GoalMode({ setCurrentPage }) {
  const { state } = useApp()
  const [progress, setProgress] = useState(null)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    setProgress(getGoalProgress(state))
  }, [state, tick])

  const skillMix    = useMemo(() => getTodaySkillMix(progress?.goal), [progress])
  const milestones  = useMemo(() => getMilestones(progress?.goal, state), [progress, state])

  const handlePick = (goalId) => {
    setActiveGoal(goalId)
    setTick(t => t + 1)
  }

  const handleClear = () => {
    if (!confirm('Hủy mục tiêu hiện tại?')) return
    clearActiveGoal()
    setTick(t => t + 1)
  }

  // ── no goal yet ──────────────────────────────────────────────────────
  if (!progress) {
    return (
      <div className="space-y-5 animate-fade-up">
        <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 bg-200 animate-gradient-x text-white rounded-3xl p-5 shadow-xl relative overflow-hidden">
          <div className="blob bg-rose-300/40 w-44 h-44 -top-12 -right-12" />
          <div className="blob bg-amber-300/40 w-36 h-36 -bottom-12 -left-10 animate-float-slow" />
          <div className="relative flex items-start gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center animate-float">
              <Target size={22} />
            </div>
            <div className="flex-1">
              <h2 className="text-lg sm:text-xl font-bold drop-shadow">Chọn mục tiêu học của bạn</h2>
              <p className="text-xs sm:text-sm text-white/90 mt-1">
                App sẽ sinh kế hoạch tuần và mức XP/ngày phù hợp với target bạn chọn.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {GOAL_CATALOG.map((g, i) => (
            <div key={g.id} style={{ animationDelay: `${i * 40}ms` }} className="animate-fade-up">
              <GoalCard goal={g} active={false} onPick={handlePick} />
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ── active goal ──────────────────────────────────────────────────────
  const { goal, weekIndex, daysLeft, percent, dailyXP } = progress

  return (
    <div className="space-y-5 animate-fade-up">
      <div className={`bg-gradient-to-br ${goal.color} bg-200 animate-gradient-x text-white rounded-3xl p-5 shadow-xl relative overflow-hidden`}>
        <div className="blob bg-white/30 w-40 h-40 -top-10 -right-10" />
        <div className="blob bg-white/20 w-32 h-32 -bottom-8 -left-8 animate-float-slow" />
        <div className="relative flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-2xl animate-float">
            {goal.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg sm:text-xl font-bold drop-shadow">{goal.title}</h2>
            <p className="text-xs sm:text-sm text-white/90 mt-0.5">{goal.desc}</p>
          </div>
          <button
            onClick={handleClear}
            className="p-2 rounded-lg bg-white/15 hover:bg-white/25 hover:scale-110 text-white transition-all"
            title="Đổi mục tiêu"
          >
            <Trash2 size={16} />
          </button>
        </div>

        <div className="relative mt-4 grid grid-cols-3 gap-2 text-center">
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-2 hover:scale-105 transition-transform">
            <div className="text-2xl font-bold animate-count-up">{weekIndex}/{goal.weeks}</div>
            <div className="text-[10px] uppercase tracking-wider text-white/80">Tuần</div>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-2 hover:scale-105 transition-transform">
            <div className="text-2xl font-bold animate-count-up">{daysLeft}</div>
            <div className="text-[10px] uppercase tracking-wider text-white/80">Ngày còn</div>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-2 hover:scale-105 transition-transform">
            <div className="text-2xl font-bold animate-count-up">{dailyXP}</div>
            <div className="text-[10px] uppercase tracking-wider text-white/80">XP/ngày</div>
          </div>
        </div>

        <div className="relative mt-3 h-2 rounded-full bg-white/20 overflow-hidden">
          <div className="h-full bg-white progress-shine relative transition-all duration-700" style={{ width: `${percent}%` }} />
        </div>
        <div className="mt-1 text-[11px] text-white/85 text-right">{percent}% thời gian đã trôi</div>
      </div>

      {/* Today's skill mix */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 sm:p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Flame className="text-rose-500" size={18} />
          <h3 className="text-base font-bold text-gray-800 dark:text-gray-100">Chia thời gian hôm nay</h3>
        </div>
        <div className="space-y-2">
          {skillMix.map(s => {
            const pageMap = {
              vocabulary: 'vocabulary', grammar: 'grammar',
              listening:  'listening',  speaking: 'speaking',
              reading:    'story-book', writing:  'writing-workshop',
            }
            const page = pageMap[s.skill] || 'dashboard'
            return (
              <button
                key={s.skill}
                onClick={() => setCurrentPage?.(page)}
                className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition text-left"
              >
                <div className="flex-1">
                  <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                    {SKILL_LABEL[s.skill] || s.skill}
                  </div>
                  <div className="h-1.5 mt-1 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                    <div className="h-full bg-indigo-500" style={{ width: `${s.pct}%` }} />
                  </div>
                </div>
                <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
                  {s.minutes} ph
                </span>
                <ChevronRight size={16} className="text-gray-400" />
              </button>
            )
          })}
        </div>
      </div>

      {/* Milestones */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 sm:p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="text-indigo-500" size={18} />
          <h3 className="text-base font-bold text-gray-800 dark:text-gray-100">Cột mốc theo tuần</h3>
        </div>
        <ul className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
          {milestones.map(m => {
            const reached = (state?.xp || 0) >= m.targetXP
            const current = m.week === weekIndex
            return (
              <li
                key={m.week}
                className={`flex items-center gap-3 p-2 rounded-lg
                  ${current ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''}
                `}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0
                  ${reached
                    ? 'bg-emerald-500 text-white'
                    : current
                      ? 'bg-indigo-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }`}>
                  {m.week}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-gray-800 dark:text-gray-100 truncate">
                    {m.focus}
                  </div>
                  <div className="text-[11px] text-gray-500 dark:text-gray-400">
                    Target: {m.targetXP} XP
                  </div>
                </div>
                {reached && <Sparkles size={14} className="text-emerald-500" />}
              </li>
            )
          })}
        </ul>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => setCurrentPage?.('my-plan')}
          className="rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-indigo-300 dark:hover:border-indigo-700 p-3 text-center"
        >
          <Target size={18} className="mx-auto text-indigo-500" />
          <div className="text-xs mt-1 font-semibold text-gray-700 dark:text-gray-200">Plan</div>
        </button>
        <button
          onClick={() => setCurrentPage?.('review-queue')}
          className="rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-rose-300 dark:hover:border-rose-700 p-3 text-center"
        >
          <Flame size={18} className="mx-auto text-rose-500" />
          <div className="text-xs mt-1 font-semibold text-gray-700 dark:text-gray-200">Ôn</div>
        </button>
        <button
          onClick={() => setCurrentPage?.('achievements')}
          className="rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-amber-300 dark:hover:border-amber-700 p-3 text-center"
        >
          <Award size={18} className="mx-auto text-amber-500" />
          <div className="text-xs mt-1 font-semibold text-gray-700 dark:text-gray-200">Huy hiệu</div>
        </button>
      </div>
    </div>
  )
}
