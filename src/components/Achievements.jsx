import { useApp } from '../context/AppContext'
import { achievements } from '../data/achievements'
import { Trophy, Lock } from 'lucide-react'

const categoryLabels = {
  vocabulary: { label: 'Từ Vựng', icon: '📚', color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' },
  grammar:    { label: 'Ngữ Pháp', icon: '✏️', color: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20' },
  listening:  { label: 'Nghe',     icon: '🔊', color: 'text-teal-600 bg-teal-50 dark:bg-teal-900/20' },
  speaking:   { label: 'Nói',      icon: '🎙️', color: 'text-rose-600 bg-rose-50 dark:bg-rose-900/20' },
  quiz:       { label: 'Quiz',     icon: '🎯', color: 'text-green-600 bg-green-50 dark:bg-green-900/20' },
  streak:     { label: 'Streak',   icon: '🔥', color: 'text-red-600 bg-red-50 dark:bg-red-900/20' },
  xp:         { label: 'XP',       icon: '⚡', color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20' },
  ielts:      { label: 'IELTS',    icon: '🏆', color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20' },
  review:     { label: 'Ôn Tập',   icon: '🔄', color: 'text-cyan-600 bg-cyan-50 dark:bg-cyan-900/20' },
  reading:    { label: 'Đọc',      icon: '📜', color: 'text-fuchsia-600 bg-fuchsia-50 dark:bg-fuchsia-900/20' },
  video:      { label: 'Video',    icon: '🎬', color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' },
}

export default function Achievements() {
  const { state } = useApp()
  const unlocked = state.unlockedAchievements || []

  const byCategory = Object.groupBy
    ? Object.groupBy(achievements, a => a.category)
    : achievements.reduce((acc, a) => {
        if (!acc[a.category]) acc[a.category] = []
        acc[a.category].push(a)
        return acc
      }, {})

  const totalXPFromAchievements = unlocked.reduce((sum, id) => {
    const a = achievements.find(x => x.id === id)
    return sum + (a ? a.xp : 0)
  }, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 bg-200 animate-gradient-x rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="blob bg-yellow-200/50 w-40 h-40 -top-8 -left-8" />
        <div className="blob bg-pink-300/40 w-44 h-44 -bottom-12 -right-8 animate-float-slow" />
        <div className="relative flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Trophy size={26} className="animate-wiggle" /> Thành Tích
            </h1>
            <p className="text-yellow-100 mt-1 text-sm">
              {unlocked.length}/{achievements.length} đã mở khóa
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold animate-count-up">⚡{totalXPFromAchievements}</div>
            <div className="text-yellow-100 text-xs">XP từ thành tích</div>
          </div>
        </div>
        {/* Progress bar */}
        <div className="mt-4 relative">
          <div className="bg-white/20 rounded-full h-3 overflow-hidden">
            <div
              className="bg-white rounded-full h-3 transition-all duration-700 progress-shine relative"
              style={{ width: `${(unlocked.length / achievements.length) * 100}%` }}
            />
          </div>
          <p className="text-yellow-100 text-xs mt-1">
            {Math.round((unlocked.length / achievements.length) * 100)}% hoàn thành
          </p>
        </div>
      </div>

      {/* Achievements by category */}
      {Object.entries(categoryLabels).map(([cat, meta], catIdx) => {
        const items = byCategory[cat] || []
        if (!items.length) return null
        const unlockedInCat = items.filter(a => unlocked.includes(a.id)).length

        return (
          <div key={cat} className="animate-fade-up" style={{ animationDelay: `${catIdx * 60}ms` }}>
            <div className="flex items-center justify-between mb-3">
              <h2 className={`font-bold text-sm px-3 py-1 rounded-full ${meta.color}`}>
                {meta.icon} {meta.label}
              </h2>
              <span className="text-xs text-gray-400">{unlockedInCat}/{items.length}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {items.map((ach, i) => {
                const isUnlocked = unlocked.includes(ach.id)
                return (
                  <div
                    key={ach.id}
                    style={{ animationDelay: `${i * 30}ms` }}
                    className={`flex items-center gap-4 rounded-2xl p-4 border card-hover transition-all animate-fade-up ${
                      isUnlocked
                        ? 'bg-white dark:bg-gray-800 border-yellow-200 dark:border-yellow-700 shadow-sm'
                        : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 opacity-60'
                    }`}
                  >
                    <div className={`text-3xl flex-shrink-0 ${!isUnlocked ? 'grayscale' : 'group-hover:animate-wiggle'}`}>
                      {isUnlocked ? ach.icon : '🔒'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold text-sm ${isUnlocked ? 'text-gray-800 dark:text-gray-100' : 'text-gray-400'}`}>
                          {ach.titleVi}
                        </span>
                        {isUnlocked && (
                          <span className="text-xs bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300 px-1.5 py-0.5 rounded-full font-bold animate-pop">
                            ✓
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{ach.description}</p>
                      <p className="text-xs font-bold text-purple-600 dark:text-purple-400 mt-1">⚡+{ach.xp} XP</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}

      {unlocked.length === achievements.length && (
        <div className="text-center py-8 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl border border-yellow-200 dark:border-yellow-700 animate-pop">
          <div className="text-5xl mb-3 animate-bounce-slow">🏆</div>
          <p className="font-bold text-yellow-700 dark:text-yellow-300 text-lg">Bạn đã mở khóa TẤT CẢ thành tích!</p>
          <p className="text-gray-500 text-sm mt-1">Thật xuất sắc! 🎉</p>
        </div>
      )}
    </div>
  )
}
