import { useState } from 'react'
import { roadmapStages, getNextStage } from '../data/roadmap'
import { useApp } from '../context/AppContext'
import { ChevronRight, Lock, CheckCircle, Star, Play, BookOpen, Zap } from 'lucide-react'

function StageNode({ stage, status, xpProgress, xpNeeded, onClick, isLast }) {
  const pulse = status === 'active'

  const nodeBase = `w-16 h-16 rounded-2xl flex items-center justify-center text-2xl shadow-lg transition-all duration-200 cursor-pointer select-none`
  const nodeStyle =
    status === 'completed' ? `bg-gradient-to-br ${stage.color} opacity-80` :
    status === 'active'    ? `bg-gradient-to-br ${stage.color} ring-4 ring-white dark:ring-gray-700 ring-offset-2 scale-110` :
                             `bg-gray-200 dark:bg-gray-700 grayscale`

  return (
    <div
      onClick={onClick}
      className={`${nodeBase} ${nodeStyle} ${pulse ? 'animate-bounce-slow' : ''} hover:scale-110`}
    >
      {status === 'locked'     ? <Lock size={24} className="text-gray-400" /> :
       status === 'completed'  ? <span className="text-2xl filter-none">{stage.icon}</span> :
                                  <span className="text-2xl">{stage.icon}</span>}
    </div>
  )
}

export default function LearningPath({ setCurrentPage }) {
  const { state } = useApp()
  const [selectedStage, setSelectedStage] = useState(null)
  const currentXP = state.xp || 0

  const getStageStatus = (stage) => {
    if (currentXP >= stage.xpRequired + stage.xpReward) return 'completed'
    if (currentXP >= stage.xpRequired) return 'active'
    return 'locked'
  }

  const getStageXPProgress = (stage) => {
    if (currentXP < stage.xpRequired) return 0
    return Math.min(currentXP - stage.xpRequired, stage.xpReward)
  }

  // Display top-to-bottom: IELTS 6.0 first → Beginner last (like climbing a mountain)
  const displayStages = [...roadmapStages].reverse()

  const activeStage = roadmapStages.find(s => getStageStatus(s) === 'active') || roadmapStages[0]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">🗺️ Lộ Trình Học</h1>
        <p className="text-gray-500 text-sm mt-1">Từ mất gốc đến IELTS 6.0</p>
      </div>

      {/* Current status banner */}
      <div
        className={`bg-gradient-to-r ${activeStage.color} rounded-2xl p-4 text-white cursor-pointer hover:opacity-95 transition-opacity shadow-lg`}
        onClick={() => setSelectedStage(activeStage)}
      >
        <div className="flex items-center gap-3">
          <span className="text-3xl">{activeStage.icon}</span>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-bold">Đang học: {activeStage.name}</span>
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">ACTIVE</span>
            </div>
            <div className="text-xs opacity-80 mt-0.5">{activeStage.goal.slice(0, 55)}...</div>
            <div className="mt-2 bg-white/20 rounded-full h-1.5">
              <div
                className="bg-white rounded-full h-1.5 transition-all"
                style={{ width: `${Math.min((getStageXPProgress(activeStage) / activeStage.xpReward) * 100, 100)}%` }}
              />
            </div>
          </div>
          <button className="bg-white/20 hover:bg-white/30 px-3 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-1 flex-shrink-0">
            <Play size={14} /> Học
          </button>
        </div>
      </div>

      {/* The winding path */}
      <div className="relative">
        {/* Vertical guide line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-red-400 via-purple-400 via-blue-400 to-green-400 opacity-20 -translate-x-1/2" />

        <div className="space-y-2">
          {displayStages.map((stage, idx) => {
            const status = getStageStatus(stage)
            const xpProg = getStageXPProgress(stage)
            const pct = Math.min(Math.round((xpProg / stage.xpReward) * 100), 100)
            const isRight = idx % 2 === 0   // alternate direction
            const isSelected = selectedStage?.id === stage.id

            return (
              <div key={stage.id}>
                {/* Stage row */}
                <div className={`flex items-center gap-3 ${isRight ? 'flex-row' : 'flex-row-reverse'}`}>
                  {/* Offset spacer on one side */}
                  <div className="w-12 sm:w-20 flex-shrink-0" />

                  {/* Stage Card */}
                  <div
                    onClick={() => setSelectedStage(isSelected ? null : stage)}
                    className={`flex-1 rounded-2xl border-2 cursor-pointer transition-all duration-200 hover:shadow-lg
                      ${isSelected ? 'shadow-xl scale-[1.01]' : ''}
                      ${status === 'completed'
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
                        : status === 'active'
                        ? `${stage.bgColor} ${stage.borderColor} shadow-md`
                        : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-60'
                      }`}
                  >
                    <div className="p-4">
                      <div className="flex items-center gap-3">
                        {/* Icon node */}
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stage.color} flex items-center justify-center text-xl flex-shrink-0 shadow-sm ${status === 'locked' ? 'grayscale opacity-50' : ''}`}>
                          {status === 'locked' ? '🔒' : stage.icon}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`font-bold text-sm ${status === 'locked' ? 'text-gray-400' : 'text-gray-800 dark:text-gray-100'}`}>
                              {stage.name}
                            </span>
                            {status === 'active' && (
                              <span className="text-xs bg-indigo-600 text-white px-2 py-0.5 rounded-full animate-pulse">
                                ĐANG HỌC
                              </span>
                            )}
                            {status === 'completed' && (
                              <CheckCircle size={15} className="text-green-500" />
                            )}
                            {status === 'locked' && (
                              <span className="text-xs text-gray-400">🔒 {stage.xpRequired.toLocaleString()} XP</span>
                            )}
                          </div>
                          {status !== 'locked' && (
                            <>
                              <div className="bg-gray-200 dark:bg-gray-600 rounded-full h-1 mt-2">
                                <div
                                  className={`h-1 rounded-full bg-gradient-to-r ${stage.color} transition-all duration-700`}
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                              <div className="text-xs text-gray-400 mt-0.5">{pct}% · +{stage.xpReward} XP</div>
                            </>
                          )}
                        </div>

                        <ChevronRight size={16} className={`text-gray-400 transition-transform flex-shrink-0 ${isSelected ? 'rotate-90' : ''}`} />
                      </div>
                    </div>

                    {/* Expanded detail */}
                    {isSelected && (
                      <div className={`border-t ${stage.borderColor} dark:border-gray-700 px-4 pb-4 pt-3 space-y-3`}>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{stage.goal}</p>

                        <div className="grid grid-cols-3 gap-2">
                          <div className="bg-white/60 dark:bg-gray-700 rounded-xl p-2 text-center">
                            <div className="font-bold text-indigo-600 text-sm">{stage.units}</div>
                            <div className="text-xs text-gray-500">units</div>
                          </div>
                          <div className="bg-white/60 dark:bg-gray-700 rounded-xl p-2 text-center">
                            <div className="font-bold text-green-600 text-sm">{stage.targetVocab}</div>
                            <div className="text-xs text-gray-500">từ vựng</div>
                          </div>
                          <div className="bg-white/60 dark:bg-gray-700 rounded-xl p-2 text-center">
                            <div className="font-bold text-purple-600 text-sm">+{stage.xpReward}</div>
                            <div className="text-xs text-gray-500">XP</div>
                          </div>
                        </div>

                        <div className="space-y-1">
                          {stage.skills.slice(0, 3).map((skill, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                              <span className="text-indigo-400">◆</span> {skill}
                            </div>
                          ))}
                        </div>

                        {status !== 'locked' ? (
                          <button
                            onClick={(e) => { e.stopPropagation(); setCurrentPage('vocabulary') }}
                            className={`w-full py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r ${stage.color} hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-sm`}
                          >
                            {status === 'completed' ? <><BookOpen size={16}/> Ôn tập</> : <><Play size={16}/> Học ngay</>}
                          </button>
                        ) : (
                          <div className="w-full py-2.5 rounded-xl text-sm text-center text-gray-400 bg-gray-100 dark:bg-gray-700">
                            🔒 Cần {(stage.xpRequired - currentXP).toLocaleString()} XP để mở khóa
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Connector dot (center) */}
                  <div className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 shadow-sm z-10"
                    style={{
                      background: status === 'completed' ? '#22c55e' : status === 'active' ? '#6366f1' : '#d1d5db'
                    }}
                  />
                </div>

                {/* Connector path to next */}
                {idx < displayStages.length - 1 && (
                  <div className={`flex ${isRight ? 'justify-start pl-16 sm:pl-24' : 'justify-end pr-16 sm:pr-24'} my-1`}>
                    <div className={`w-px h-6 ${
                      getStageStatus(displayStages[idx + 1]) !== 'locked' ? 'bg-indigo-300 dark:bg-indigo-700' : 'bg-gray-200 dark:bg-gray-700'
                    }`} />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Placement test CTA */}
      <div
        onClick={() => setCurrentPage('placement')}
        className="cursor-pointer bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 bg-200 animate-gradient-x rounded-2xl p-5 text-white shadow-lg hover:scale-[1.01] transition-all relative overflow-hidden btn-shine"
      >
        <div className="blob bg-cyan-300/40 w-32 h-32 -top-6 -right-6" />
        <div className="relative flex items-center gap-4">
          <div className="text-4xl animate-float">🧪</div>
          <div className="flex-1">
            <h3 className="font-bold">Chưa biết mình ở level nào?</h3>
            <p className="text-cyan-100 text-sm mt-0.5">Làm Placement Test (30 câu) để tìm ra điểm xuất phát phù hợp</p>
          </div>
          <ChevronRight size={20} />
        </div>
      </div>
    </div>
  )
}
