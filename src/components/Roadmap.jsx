import { useState } from 'react'
import { roadmapStages, getNextStage } from '../data/roadmap'
import { useApp } from '../context/AppContext'
import { CheckCircle, Lock, ChevronRight, Star, Map } from 'lucide-react'

function XPRing({ xp, targetXP, size = 80, strokeWidth = 8 }) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const pct = Math.min(xp / targetXP, 1)
  const offset = circumference * (1 - pct)

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
      <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="currentColor" strokeWidth={strokeWidth} className="text-gray-200 dark:text-gray-700" />
      <circle
        cx={size/2} cy={size/2} r={radius}
        fill="none" strokeWidth={strokeWidth}
        stroke="url(#xpGrad)"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.6s ease' }}
      />
      <defs>
        <linearGradient id="xpGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export default function Roadmap({ setCurrentPage }) {
  const { state } = useApp()
  const [selectedStage, setSelectedStage] = useState(null)
  const currentXP = state.xp || 0

  const getStageStatus = (stage) => {
    if (currentXP >= stage.xpRequired + stage.xpReward) return 'completed'
    if (currentXP >= stage.xpRequired) return 'active'
    return 'locked'
  }

  if (selectedStage) {
    const status = getStageStatus(selectedStage)
    const stageXP = Math.max(0, currentXP - selectedStage.xpRequired)
    const neededXP = selectedStage.xpReward
    const pct = Math.min(Math.round((stageXP / neededXP) * 100), 100)

    return (
      <div className="max-w-lg mx-auto space-y-5">
        <button
          onClick={() => setSelectedStage(null)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 transition-colors"
        >
          ← Quay lại lộ trình
        </button>

        <div className={`bg-gradient-to-br ${selectedStage.color} rounded-3xl p-6 text-white shadow-xl`}>
          <div className="flex items-start justify-between">
            <div>
              <div className="text-4xl mb-2">{selectedStage.icon}</div>
              <h2 className="text-2xl font-bold">{selectedStage.name}</h2>
              <p className="text-white/80 text-sm mt-1">{selectedStage.nameEn}</p>
            </div>
            <div className="text-right">
              <div className={`text-xs font-bold px-3 py-1 rounded-full ${
                status === 'completed' ? 'bg-white text-green-600' :
                status === 'active' ? 'bg-white/20 text-white' :
                'bg-black/20 text-white/60'
              }`}>
                {status === 'completed' ? '✅ Hoàn thành' : status === 'active' ? '🎯 Đang học' : '🔒 Chưa mở'}
              </div>
            </div>
          </div>
          {status !== 'locked' && (
            <div className="mt-4">
              <div className="flex justify-between text-xs opacity-80 mb-1">
                <span>Tiến độ stage</span><span>{pct}%</span>
              </div>
              <div className="bg-white/20 rounded-full h-2">
                <div className="bg-white rounded-full h-2 transition-all" style={{ width: `${pct}%` }} />
              </div>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
          <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-3">🎯 Mục tiêu</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">{selectedStage.goal}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
          <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-3">📚 Kỹ năng học được</h3>
          <div className="space-y-2">
            {selectedStage.skills.map((skill, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <span className="w-5 h-5 bg-indigo-100 dark:bg-indigo-900/40 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-300 text-xs font-bold">{i+1}</span>
                {skill}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 text-center">
            <div className="text-xl font-bold text-blue-600">{selectedStage.units}</div>
            <div className="text-xs text-blue-500">Units</div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-4 text-center">
            <div className="text-xl font-bold text-green-600">{selectedStage.targetVocab}</div>
            <div className="text-xs text-green-500">Từ vựng</div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-4 text-center">
            <div className="text-xl font-bold text-purple-600">+{selectedStage.xpReward}</div>
            <div className="text-xs text-purple-500">XP reward</div>
          </div>
        </div>

        {status === 'locked' ? (
          <div className="text-center py-4 bg-gray-50 dark:bg-gray-700 rounded-2xl border border-gray-200 dark:border-gray-600">
            <p className="text-gray-500 text-sm">🔒 Cần {selectedStage.xpRequired.toLocaleString()} XP để mở khóa</p>
            <p className="text-gray-400 text-xs mt-1">Bạn hiện có {currentXP.toLocaleString()} XP</p>
          </div>
        ) : (
          <button
            onClick={() => setCurrentPage('vocabulary')}
            className={`w-full bg-gradient-to-r ${selectedStage.color} text-white rounded-2xl py-4 font-bold hover:opacity-90 transition-opacity shadow-lg flex items-center justify-center gap-2`}
          >
            {status === 'completed' ? '🔁 Ôn tập lại' : '🚀 Bắt đầu học!'} <ChevronRight size={18} />
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center justify-center gap-2">
          <Map className="text-indigo-600" size={26} /> Lộ Trình Học
        </h1>
        <p className="text-gray-500 text-sm mt-1">Từ mất gốc đến IELTS 6.0</p>
      </div>

      {/* XP Overview */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-200 animate-gradient-x rounded-2xl p-6 text-white flex items-center gap-6 relative overflow-hidden">
        <div className="blob bg-pink-400/40 w-32 h-32 -top-6 -right-6" />
        <div className="blob bg-indigo-300/40 w-28 h-28 -bottom-8 -left-6 animate-float-slow" />
        <div className="relative flex-shrink-0 animate-float">
          <XPRing xp={currentXP % 500} targetXP={500} size={90} strokeWidth={8} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold">Lv.{state.level || 1}</span>
            <span className="text-xs opacity-70">Level</span>
          </div>
        </div>
        <div className="relative flex-1">
          <div className="text-2xl font-bold animate-count-up">{currentXP.toLocaleString()} XP</div>
          <div className="text-indigo-200 text-sm">Đến level tiếp theo: {500 - (currentXP % 500)} XP</div>
          <div className="mt-2 text-xs text-indigo-200">
            🔥 Streak: {state.streak || 0} ngày · 🏅 {(state.unlockedAchievements || []).length} thành tích
          </div>
        </div>
      </div>

      {/* Stages map */}
      <div className="space-y-3">
        {roadmapStages.map((stage, idx) => {
          const status = getStageStatus(stage)
          const stageXP = Math.max(0, currentXP - stage.xpRequired)
          const pct = status === 'completed' ? 100 : Math.min(Math.round((stageXP / stage.xpReward) * 100), 100)

          return (
            <div key={stage.id} className="relative animate-fade-up" style={{ animationDelay: `${idx * 40}ms` }}>
              {/* Connector line */}
              {idx < roadmapStages.length - 1 && (
                <div className="absolute left-9 top-full w-0.5 h-3 bg-gray-200 dark:bg-gray-700 z-10" />
              )}

              <button
                onClick={() => setSelectedStage(stage)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all card-hover text-left ${
                  status === 'completed'
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
                    : status === 'active'
                    ? `${stage.bgColor} ${stage.borderColor} shadow-sm animate-glow`
                    : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-60'
                }`}
              >
                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stage.color} flex items-center justify-center text-2xl flex-shrink-0 ${status === 'locked' ? 'opacity-40 grayscale' : status === 'active' ? 'animate-float' : ''} shadow-sm`}>
                  {status === 'locked' ? '🔒' : stage.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`font-bold text-sm ${status === 'locked' ? 'text-gray-400 dark:text-gray-500' : 'text-gray-800 dark:text-gray-100'}`}>
                      {stage.name}
                    </span>
                    {status === 'active' && (
                      <span className="text-xs bg-indigo-600 text-white px-2 py-0.5 rounded-full animate-pulse">ĐANG HỌC</span>
                    )}
                    {status === 'completed' && (
                      <CheckCircle size={16} className="text-green-500" />
                    )}
                  </div>
                  <p className={`text-xs mt-0.5 line-clamp-1 ${status === 'locked' ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>
                    {stage.description}
                  </p>
                  {status !== 'locked' && (
                    <div className="mt-2">
                      <div className="bg-gray-200 dark:bg-gray-600 rounded-full h-1.5 overflow-hidden relative">
                        <div
                          className={`h-1.5 rounded-full bg-gradient-to-r ${stage.color} transition-all duration-700 progress-shine relative`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">{pct}% · {stage.units} units · +{stage.xpReward} XP</div>
                    </div>
                  )}
                  {status === 'locked' && (
                    <div className="text-xs text-gray-400 mt-1">🔒 Cần {stage.xpRequired.toLocaleString()} XP</div>
                  )}
                </div>

                <ChevronRight size={18} className="text-gray-400 flex-shrink-0" />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
