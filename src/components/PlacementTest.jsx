import { useState, useCallback } from 'react'
import { placementQuestions, getSuggestedStage } from '../data/placementTest'
import { roadmapStages, getStageById } from '../data/roadmap'
import { useApp } from '../context/AppContext'
import { ChevronRight, RotateCcw, Map } from 'lucide-react'

const TOTAL = placementQuestions.length

export default function PlacementTest({ setCurrentPage }) {
  const { state, dispatch } = useApp()
  const [phase, setPhase] = useState('intro') // intro | test | result
  const [answers, setAnswers] = useState({})   // { questionId: selectedIndex }
  const [current, setCurrent] = useState(0)
  const [answered, setAnswered] = useState(false)

  const q = placementQuestions[current]
  const score = Object.entries(answers).filter(([id, ans]) => {
    const q = placementQuestions.find(q => q.id === Number(id))
    return q && ans === q.correct
  }).length

  const handleSelect = (idx) => {
    if (answered) return
    setAnswers(a => ({ ...a, [q.id]: idx }))
    setAnswered(true)
  }

  const handleNext = () => {
    if (current >= TOTAL - 1) {
      // Final score
      const finalScore = Object.entries({ ...answers }).filter(([id, ans]) => {
        const qq = placementQuestions.find(x => x.id === Number(id))
        return qq && ans === qq.correct
      }).length + (answers[q.id] === q.correct ? 0 : 0)

      // Save to storage
      const result = { score: finalScore, date: new Date().toISOString() }
      dispatch({ type: 'LOAD_STATE', payload: { ...state, placementResult: result } })
      setPhase('result')
    } else {
      setCurrent(c => c + 1)
      setAnswered(false)
    }
  }

  const reset = () => {
    setAnswers({})
    setCurrent(0)
    setAnswered(false)
    setPhase('intro')
  }

  // ── Intro ────────────────────────────────────────────────────────────────
  if (phase === 'intro') {
    const prevResult = state.placementResult
    const prevSuggestion = prevResult ? getSuggestedStage(prevResult.score) : null

    return (
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center animate-fade-up">
          <div className="text-6xl mb-4 animate-float">🧪</div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Placement Test</h1>
          <p className="text-gray-500 mt-2">Kiểm tra trình độ tiếng Anh của bạn</p>
        </div>

        <div className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-2xl p-6 border border-cyan-200 dark:border-cyan-800 card-hover animate-fade-up" style={{ animationDelay: '60ms' }}>
          <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-3">📋 Thông tin bài test</h3>
          <div className="space-y-2 text-sm">
            {[
              ['📝', 'Số câu hỏi', '30 câu'],
              ['⏱️', 'Thời gian', 'Không giới hạn'],
              ['🎯', 'Nội dung', 'Vocabulary + Grammar'],
              ['📊', 'Kết quả', 'Gợi ý level phù hợp'],
            ].map(([icon, k, v]) => (
              <div key={k} className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">{icon} {k}</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">{v}</span>
              </div>
            ))}
          </div>
        </div>

        {prevResult && prevSuggestion && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
            <p className="text-xs text-gray-500 mb-1">Kết quả lần trước</p>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{prevSuggestion.icon}</span>
              <div>
                <p className="font-bold text-gray-800 dark:text-gray-100">
                  {prevResult.score}/{TOTAL} điểm → {prevSuggestion.label}
                </p>
                <p className="text-xs text-gray-400">{new Date(prevResult.date).toLocaleDateString('vi-VN')}</p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={() => setPhase('test')}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl py-4 font-bold text-lg hover:opacity-90 transition-opacity shadow-lg"
          >
            🚀 Bắt Đầu Test!
          </button>
          {prevResult && (
            <button
              onClick={() => setCurrentPage('learning-path')}
              className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-2xl py-3 font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <Map size={18} /> Xem lộ trình học
            </button>
          )}
        </div>
      </div>
    )
  }

  // ── Result ───────────────────────────────────────────────────────────────
  if (phase === 'result') {
    const finalScore = Object.entries(answers).filter(([id, ans]) => {
      const qq = placementQuestions.find(x => x.id === Number(id))
      return qq && ans === qq.correct
    }).length
    const suggestion = getSuggestedStage(finalScore)
    const stage = getStageById(suggestion.stageId)
    const pct = Math.round((finalScore / TOTAL) * 100)

    return (
      <div className="max-w-md mx-auto space-y-5 animate-fade-up">
        {/* Score */}
        <div className="bg-gradient-to-br from-cyan-500 via-sky-500 to-blue-600 bg-200 animate-gradient-x rounded-3xl p-8 text-white text-center shadow-xl relative overflow-hidden">
          <div className="blob bg-cyan-300/40 w-40 h-40 -top-10 -right-10" />
          <div className="blob bg-blue-300/40 w-36 h-36 -bottom-10 -left-10 animate-float-slow" />
          <div className="relative">
            <div className="text-5xl mb-3 animate-pop">{suggestion.icon}</div>
            <div className="text-5xl font-bold mb-1 animate-count-up">{finalScore}<span className="text-2xl opacity-70">/{TOTAL}</span></div>
            <div className="text-cyan-100 text-lg">{pct}% đúng</div>
            <div className="mt-4 bg-white/20 rounded-full h-3 overflow-hidden relative">
              <div className="bg-white rounded-full h-3 transition-all progress-shine relative" style={{ width: `${pct}%` }} />
            </div>
          </div>
        </div>

        {/* Suggestion */}
        <div className={`${stage?.bgColor || 'bg-indigo-50 dark:bg-indigo-900/20'} rounded-2xl p-5 border ${stage?.borderColor || 'border-indigo-200'}`}>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">🎯 Gợi ý level phù hợp:</p>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{stage?.icon}</span>
            <div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">{suggestion.label}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{suggestion.message}</p>
            </div>
          </div>
          {stage && (
            <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 bg-white/50 dark:bg-gray-800/50 rounded-xl p-3">
              📚 {stage.goal}
            </div>
          )}
        </div>

        {/* Score bands */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-3 text-sm">📊 Bảng điểm chuẩn</h3>
          <div className="space-y-2">
            {[
              { range: '0 – 9',   label: '🌱 Mất Gốc',          active: finalScore <= 9 },
              { range: '10 – 15', label: '🌿 A1 – Sơ Cấp',       active: finalScore >= 10 && finalScore <= 15 },
              { range: '16 – 21', label: '🌳 A2 – Tiền Trung',   active: finalScore >= 16 && finalScore <= 21 },
              { range: '22 – 26', label: '🌲 B1 – Trung Cấp',    active: finalScore >= 22 && finalScore <= 26 },
              { range: '27 – 30', label: '📐 IELTS Foundation',  active: finalScore >= 27 },
            ].map(b => (
              <div key={b.range} className={`flex justify-between items-center text-xs px-3 py-2 rounded-lg ${b.active ? 'bg-cyan-100 dark:bg-cyan-900/30 font-bold text-cyan-800 dark:text-cyan-200' : 'text-gray-500'}`}>
                <span>{b.label}</span>
                <span>{b.range} điểm {b.active ? '← bạn' : ''}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Review wrong answers */}
        <details className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
          <summary className="p-4 font-bold text-sm text-gray-800 dark:text-gray-100 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
            📋 Xem lại đáp án sai ({placementQuestions.filter(q => answers[q.id] !== q.correct).length} câu)
          </summary>
          <div className="p-4 space-y-3 border-t border-gray-100 dark:border-gray-700">
            {placementQuestions
              .filter(q => answers[q.id] !== undefined && answers[q.id] !== q.correct)
              .map(q => (
                <div key={q.id} className="text-xs bg-red-50 dark:bg-red-900/20 rounded-xl p-3 border border-red-200 dark:border-red-800">
                  <p className="font-medium text-gray-800 dark:text-gray-200">{q.id}. {q.question}</p>
                  <p className="text-red-600 dark:text-red-400 mt-1">✗ Bạn chọn: {q.options[answers[q.id]]}</p>
                  <p className="text-green-600 dark:text-green-400">✓ Đáp án đúng: {q.options[q.correct]}</p>
                </div>
              ))}
          </div>
        </details>

        <div className="flex gap-3">
          <button onClick={reset} className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-2xl py-3 font-semibold flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors">
            <RotateCcw size={16} /> Làm lại
          </button>
          <button
            onClick={() => setCurrentPage('learning-path')}
            className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl py-3 font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            <Map size={16} /> Xem lộ trình
          </button>
        </div>
      </div>
    )
  }

  // ── Test ─────────────────────────────────────────────────────────────────
  const progress = (current / TOTAL) * 100
  const correctSoFar = Object.entries(answers).filter(([id, ans]) => {
    const qq = placementQuestions.find(x => x.id === Number(id))
    return qq && ans === qq.correct
  }).length

  return (
    <div className="max-w-lg mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="font-bold text-gray-700 dark:text-gray-300 text-sm">
          🧪 Câu {current + 1} / {TOTAL}
        </span>
        <div className="flex gap-2 text-xs">
          <span className="text-green-600 font-bold">✅ {correctSoFar}</span>
          <span className="text-red-500 font-bold">❌ {current - correctSoFar}</span>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-gray-100 dark:bg-gray-700 rounded-full h-2">
        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      {/* Level badge */}
      <div className="flex items-center gap-2">
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
          q.level === 'Beginner' ? 'bg-lime-100 text-lime-700' :
          q.level === 'A1'       ? 'bg-green-100 text-green-700' :
          q.level === 'A2'       ? 'bg-blue-100 text-blue-700' :
          q.level === 'B1'       ? 'bg-purple-100 text-purple-700' :
          q.level === 'B1+'      ? 'bg-indigo-100 text-indigo-700' :
                                    'bg-red-100 text-red-700'
        }`}>
          {q.level}
        </span>
      </div>

      {/* Question card */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-md border border-gray-100 dark:border-gray-700">
        <p className="text-lg font-bold text-gray-800 dark:text-gray-100 leading-relaxed">{q.question}</p>
      </div>

      {/* Options */}
      <div className="space-y-2.5">
        {q.options.map((opt, i) => {
          const isSelected = answers[q.id] === i
          const isCorrect = q.correct === i
          let style = 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:border-cyan-300 hover:bg-cyan-50 dark:hover:bg-cyan-900/20'
          if (answered) {
            if (isCorrect) style = 'bg-green-50 dark:bg-green-900/30 border-green-400 text-green-800 dark:text-green-200'
            else if (isSelected) style = 'bg-red-50 dark:bg-red-900/30 border-red-400 text-red-800 dark:text-red-200'
            else style = 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 text-gray-400'
          } else if (isSelected) {
            style = 'bg-cyan-50 dark:bg-cyan-900/30 border-cyan-400 text-cyan-800 dark:text-cyan-200'
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={answered}
              className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all ${style}`}
            >
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                answered && isCorrect  ? 'bg-green-500 text-white' :
                answered && isSelected ? 'bg-red-500 text-white' :
                'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
              }`}>
                {['A','B','C','D'][i]}
              </span>
              <span className="font-medium text-sm">{opt}</span>
              {answered && isCorrect  && <span className="ml-auto text-green-500 text-lg">✓</span>}
              {answered && isSelected && !isCorrect && <span className="ml-auto text-red-500 text-lg">✗</span>}
            </button>
          )
        })}
      </div>

      {/* Next */}
      {answered && (
        <button
          onClick={handleNext}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl py-4 font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-sm"
        >
          {current >= TOTAL - 1 ? '📊 Xem kết quả' : <>Câu tiếp <ChevronRight size={18} /></>}
        </button>
      )}
    </div>
  )
}
