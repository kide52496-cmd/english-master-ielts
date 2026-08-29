import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, RotateCcw, Volume2, Shuffle, CheckCircle, XCircle, Layers } from 'lucide-react'
import { vocabulary, levels } from '../data/vocabulary'
import { useApp } from '../context/AppContext'
import { speak } from '../utils/speech'

const levelColors = {
  Beginner: 'from-lime-400 to-green-500',
  A1: 'from-green-400 to-emerald-500',
  A2: 'from-blue-400 to-cyan-500',
  B1: 'from-purple-400 to-violet-500',
  'B1+': 'from-fuchsia-400 to-pink-500',
  'IELTS Foundation': 'from-amber-400 to-orange-500',
  'IELTS 5.0-6.0': 'from-rose-400 to-red-500',
}

export default function FlashcardPage() {
  const { state, dispatch } = useApp()
  const [filterLevel, setFilterLevel] = useState('All')
  const [cards, setCards] = useState([])
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [session, setSession] = useState({ known: 0, practice: 0 })
  const [finished, setFinished] = useState(false)

  const buildDeck = useCallback((level) => {
    let pool = level === 'All' ? [...vocabulary] : vocabulary.filter(w => w.level === level)
    pool.sort(() => Math.random() - 0.5)
    setCards(pool)
    setIndex(0)
    setFlipped(false)
    setSession({ known: 0, practice: 0 })
    setFinished(false)
  }, [])

  useEffect(() => { buildDeck(filterLevel) }, [filterLevel, buildDeck])

  const current = cards[index]

  const handleFlip = () => setFlipped(f => !f)

  const handleKnow = () => {
    if (current) dispatch({ type: 'LEARN_WORD', wordId: current.id })
    setSession(s => ({ ...s, known: s.known + 1 }))
    advance()
  }

  const handlePractice = () => {
    setSession(s => ({ ...s, practice: s.practice + 1 }))
    advance()
  }

  const advance = () => {
    setFlipped(false)
    if (index >= cards.length - 1) {
      setFinished(true)
    } else {
      setIndex(i => i + 1)
    }
  }

  const prev = () => {
    if (index > 0) {
      setFlipped(false)
      setIndex(i => i - 1)
    }
  }

  const restart = () => buildDeck(filterLevel)

  if (!cards.length) return (
    <div className="text-center py-20 text-gray-400">
      <p className="text-4xl mb-3">🃏</p>
      <p>Không có thẻ nào</p>
    </div>
  )

  if (finished) {
    const total = session.known + session.practice
    const pct = Math.round((session.known / (total || 1)) * 100)
    return (
      <div className="max-w-md mx-auto text-center space-y-6 animate-fade-up">
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-3xl p-8 border border-indigo-100 dark:border-indigo-800 relative overflow-hidden">
          <div className="blob bg-indigo-300/30 w-40 h-40 -top-12 -right-12" />
          <div className="blob bg-pink-300/30 w-32 h-32 -bottom-8 -left-8 animate-float-slow" />
          <div className="relative">
            <div className="text-6xl mb-4 animate-pop">{pct >= 80 ? '🎉' : pct >= 50 ? '👍' : '💪'}</div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Đã xong!</h2>
            <p className="text-gray-500 mb-6">Bạn đã ôn hết {cards.length} thẻ</p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-green-50 dark:bg-green-900/30 rounded-2xl p-4 card-hover">
                <div className="text-3xl font-bold text-green-600 animate-count-up">{session.known}</div>
                <div className="text-sm text-green-600">✅ Đã biết</div>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/30 rounded-2xl p-4 card-hover">
                <div className="text-3xl font-bold text-orange-600 animate-count-up">{session.practice}</div>
                <div className="text-sm text-orange-600">🔄 Cần ôn</div>
              </div>
            </div>
            <div className="bg-white/70 dark:bg-gray-800/50 rounded-2xl p-3 mb-4">
              <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">Tỷ lệ ghi nhớ</div>
              <div className="text-3xl font-bold text-gradient">{pct}%</div>
            </div>
            <button
              onClick={restart}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl py-3 font-semibold hover:opacity-95 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 btn-shine"
            >
              <RotateCcw size={18} /> Học lại
            </button>
          </div>
        </div>
      </div>
    )
  }

  const levelGradient = levelColors[current?.level] || 'from-indigo-400 to-purple-500'

  return (
    <div className="max-w-lg mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <Layers className="text-purple-600" size={22} /> Flashcard
        </h1>
        <button
          onClick={restart}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600 transition-colors"
        >
          <Shuffle size={16} /> Xáo bài
        </button>
      </div>

      {/* Level filter */}
      <div className="flex gap-2 flex-wrap">
        {['All', ...levels].map(l => (
          <button
            key={l}
            onClick={() => setFilterLevel(l)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterLevel === l
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600'
            }`}
          >
            {l === 'All' ? 'Tất cả' : l}
          </button>
        ))}
      </div>

      {/* Progress */}
      <div>
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>{index + 1} / {cards.length}</span>
          <span className="flex gap-3">
            <span className="text-green-600">✅ {session.known}</span>
            <span className="text-orange-600">🔄 {session.practice}</span>
          </span>
        </div>
        <div className="bg-gray-100 dark:bg-gray-700 rounded-full h-1.5">
          <div
            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${((index + 1) / cards.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Card */}
      <div
        className="relative cursor-pointer select-none"
        style={{ height: '320px', perspective: '1000px' }}
        onClick={handleFlip}
      >
        <div className={`flip-card-inner ${flipped ? 'flipped' : ''}`}>
          {/* Front */}
          <div className={`flip-card-front bg-gradient-to-br ${levelGradient} bg-200 animate-gradient-x rounded-3xl shadow-xl flex flex-col items-center justify-center p-8 text-white relative overflow-hidden`}>
            <div className="blob bg-white/30 w-40 h-40 -top-10 -right-10" />
            <div className="blob bg-white/20 w-32 h-32 -bottom-8 -left-8 animate-float-slow" />
            <div className="relative flex flex-col items-center">
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full mb-4 font-medium">{current?.level} • {current?.topic}</span>
              <h2 className="text-4xl font-bold mb-3 text-center drop-shadow">{current?.english}</h2>
              <p className="text-lg opacity-80 font-mono">{current?.pronunciation}</p>
              <p className="mt-6 text-sm opacity-70 animate-pulse">Nhấn để lật thẻ</p>
              <button
                onClick={e => { e.stopPropagation(); speak(current?.english) }}
                className="mt-4 bg-white/20 hover:bg-white/30 hover:scale-110 p-3 rounded-full transition-all"
                title="Phát âm"
              >
                <Volume2 size={20} />
              </button>
            </div>
          </div>

          {/* Back */}
          <div className="flip-card-back bg-white dark:bg-gray-800 rounded-3xl shadow-xl flex flex-col items-center justify-center p-8 border-2 border-indigo-100 dark:border-indigo-800 relative overflow-hidden">
            <div className="blob bg-indigo-200/40 dark:bg-indigo-700/30 w-40 h-40 -top-10 -right-10" />
            <div className="relative flex flex-col items-center">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full mb-4 bg-gradient-to-r ${levelGradient} text-white`}>{current?.level}</span>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2 text-center">{current?.vietnamese}</h2>
              <p className="text-gray-500 dark:text-gray-400 font-mono text-sm mb-4">{current?.pronunciation}</p>
              <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl p-4 w-full">
                <p className="text-sm text-gray-700 dark:text-gray-300 italic text-center">"{current?.example}"</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">{current?.example_vi}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      {flipped ? (
        <div className="grid grid-cols-2 gap-3 animate-slide-down">
          <button
            onClick={handlePractice}
            className="flex items-center justify-center gap-2 bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/40 text-orange-700 dark:text-orange-300 rounded-2xl py-4 font-semibold transition-all hover:scale-[1.02] border border-orange-200 dark:border-orange-700 btn-shine"
          >
            <XCircle size={20} /> Cần ôn lại
          </button>
          <button
            onClick={handleKnow}
            className="flex items-center justify-center gap-2 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/40 text-green-700 dark:text-green-300 rounded-2xl py-4 font-semibold transition-all hover:scale-[1.02] border border-green-200 dark:border-green-700 btn-shine"
          >
            <CheckCircle size={20} /> Đã biết! ✓
          </button>
        </div>
      ) : (
        <div className="flex gap-3 justify-center">
          <button
            onClick={prev}
            disabled={index === 0}
            className="p-3 rounded-xl bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 disabled:opacity-30 hover:border-indigo-300 hover:scale-105 transition-all shadow-sm"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={handleFlip}
            className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-95 text-white rounded-xl py-3 font-semibold transition-all shadow-sm btn-shine"
          >
            Lật thẻ 🔄
          </button>
          <button
            onClick={() => advance()}
            className="p-3 rounded-xl bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-indigo-300 hover:scale-105 transition-all shadow-sm"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  )
}
