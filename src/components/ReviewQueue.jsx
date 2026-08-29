import { useEffect, useMemo, useState } from 'react'
import { useApp } from '../context/AppContext'
import {
  buildReviewQueue,
  rateCard,
  getCombinedSRSStats,
  getLast7DaysActivity,
  loadReviewData,
  syncFromAppState,
} from '../utils/srs'
import { vocabulary } from '../data/vocabulary'
import { stories } from '../data/stories'
import { ieltsVocabulary } from '../data/ieltsLessons'
import { grammarLessons } from '../data/grammarLessons'
import { speak } from '../utils/speech'
import {
  RefreshCw, ChevronRight, Volume2, Check, X as XIcon,
  Sparkles, Flame, Target, ArrowLeft,
} from 'lucide-react'

const RATING_BUTTONS = [
  { id: 'again', label: 'Again', desc: '< 10 phút', color: 'bg-rose-500 hover:bg-rose-600' },
  { id: 'hard',  label: 'Hard',  desc: '+1 ngày',   color: 'bg-amber-500 hover:bg-amber-600' },
  { id: 'good',  label: 'Good',  desc: '+3 ngày',   color: 'bg-emerald-500 hover:bg-emerald-600' },
  { id: 'easy',  label: 'Easy',  desc: '+7 ngày',   color: 'bg-sky-500 hover:bg-sky-600' },
]

export default function ReviewQueue({ setCurrentPage }) {
  const { state } = useApp()
  const [queue, setQueue]       = useState([])
  const [idx, setIdx]           = useState(0)
  const [showBack, setShowBack] = useState(false)
  const [stats, setStats]       = useState(null)
  const [done, setDone]         = useState(false)
  const [sessionStats, setSessionStats] = useState({ again: 0, hard: 0, good: 0, easy: 0 })

  // Build queue once on mount
  useEffect(() => {
    // Ensure newly learned vocab/stories/IELTS/grammar are turned into cards
    // before building the queue, so going straight here still shows them.
    syncFromAppState(loadReviewData(), state, vocabulary, stories, ieltsVocabulary, grammarLessons)
    setQueue(buildReviewQueue({ limit: 20 }))
    setStats(getCombinedSRSStats(state))
  }, [])

  const card = queue[idx]
  const total = queue.length
  const progressPct = total > 0 ? Math.round((idx / total) * 100) : 0
  const last7 = useMemo(() => getLast7DaysActivity(), [done])

  const handleRate = (rating) => {
    if (!card) return
    rateCard(card, rating)
    setSessionStats(s => ({ ...s, [rating]: (s[rating] || 0) + 1 }))
    if (idx + 1 < queue.length) {
      setIdx(idx + 1)
      setShowBack(false)
    } else {
      setDone(true)
    }
  }

  const handleSpeak = () => {
    if (card?.english) speak(card.english, { rate: 0.9 })
  }

  // ── empty state ──────────────────────────────────────────────────────
  if (queue.length === 0) {
    return (
      <div className="max-w-xl mx-auto space-y-4 animate-fade-up">
        <div className="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 bg-200 animate-gradient-x text-white rounded-3xl p-6 text-center shadow-xl relative overflow-hidden">
          <div className="blob bg-cyan-300/40 w-32 h-32 -top-6 -right-6" />
          <div className="blob bg-emerald-300/40 w-28 h-28 -bottom-6 -left-6 animate-float-slow" />
          <div className="relative">
            <div className="w-16 h-16 mx-auto rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3 animate-float">
              <Sparkles size={28} />
            </div>
            <h2 className="text-lg font-bold drop-shadow">
              Hôm nay không có thẻ đến hạn
            </h2>
            <p className="text-sm text-white/90 mt-2">
              Học từ vựng mới hoặc đọc story để tạo thêm thẻ ôn tập.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <button
                onClick={() => setCurrentPage?.('vocabulary')}
                className="flex-1 py-2.5 rounded-xl bg-white/25 hover:bg-white/35 hover:scale-[1.02] backdrop-blur-sm text-white text-sm font-semibold transition-all btn-shine"
              >
                Học từ vựng
              </button>
              <button
                onClick={() => setCurrentPage?.('story-book')}
                className="flex-1 py-2.5 rounded-xl bg-white/25 hover:bg-white/35 hover:scale-[1.02] backdrop-blur-sm text-white text-sm font-semibold transition-all btn-shine"
              >
                Đọc story
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── done state ───────────────────────────────────────────────────────
  if (done) {
    const total = sessionStats.again + sessionStats.hard + sessionStats.good + sessionStats.easy
    const accuracy = total > 0
      ? Math.round(((sessionStats.good + sessionStats.easy) / total) * 100)
      : 0
    return (
      <div className="max-w-xl mx-auto space-y-4">
        <div className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-2xl p-6 text-center shadow">
          <div className="text-5xl mb-2">🎉</div>
          <h2 className="text-xl font-bold">Đã ôn xong {total} thẻ</h2>
          <p className="text-sm text-white/90 mt-1">Độ chính xác: {accuracy}%</p>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {RATING_BUTTONS.map(b => (
            <div key={b.id} className="p-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-center">
              <div className={`text-xs font-bold ${b.color.split(' ')[0].replace('bg-','text-')}`}>{b.label}</div>
              <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">{sessionStats[b.id] || 0}</div>
            </div>
          ))}
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <Flame size={16} className="text-rose-500" />
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100">Hoạt động 7 ngày</h3>
          </div>
          <div className="flex items-end justify-between h-20 gap-1">
            {last7.map(d => {
              const h = Math.min(60, (d.count || 0) * 4)
              return (
                <div key={d.key} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-indigo-400 dark:bg-indigo-500 rounded-t"
                    style={{ height: `${h + 6}px` }}
                  />
                  <span className="text-[10px] text-gray-500">{d.label}</span>
                </div>
              )
            })}
          </div>
        </div>
        <button
          onClick={() => setCurrentPage?.('dashboard')}
          className="w-full py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold"
        >
          Về trang chính
        </button>
      </div>
    )
  }

  // ── reviewing state ──────────────────────────────────────────────────
  return (
    <div className="max-w-xl mx-auto space-y-4 animate-fade-up">
      <button
        onClick={() => setCurrentPage?.('review-center')}
        className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-500 hover:-translate-x-0.5 transition-all"
      >
        <ArrowLeft size={16} /> Review Center
      </button>

      {/* Premium Header */}
      <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500 bg-200 animate-gradient-x rounded-3xl p-5 text-white shadow-xl relative overflow-hidden">
        <div className="blob bg-pink-300/40 w-32 h-32 -top-6 -right-6" />
        <div className="blob bg-rose-300/40 w-28 h-28 -bottom-6 -left-6 animate-float-slow" />
        <div className="relative flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center animate-float">
            <RefreshCw size={20} />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold drop-shadow">Review Queue</h2>
            <p className="text-xs text-white/85">
              {idx + 1} / {total} · {stats?.combined?.due || 0} đến hạn tổng
            </p>
          </div>
        </div>
        <div className="relative mt-4 h-2 rounded-full bg-white/20 overflow-hidden">
          <div className="h-full bg-white progress-shine relative transition-all duration-700" style={{ width: `${progressPct}%` }} />
        </div>
      </div>

      {/* Card */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm min-h-[260px] flex flex-col">
        <div className="flex items-center justify-between text-xs">
          <span className="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 font-semibold uppercase">
            {card?.source || 'srs'}
          </span>
          {card?.level && (
            <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-semibold">
              {card.level}
            </span>
          )}
        </div>

        <div className="flex-1 flex flex-col items-center justify-center text-center mt-4">
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
            {card?.english}
          </h3>
          {card?.pronunciation && (
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 font-mono">
              {card.pronunciation}
            </p>
          )}
          <button
            onClick={handleSpeak}
            className="mt-3 inline-flex items-center gap-1 text-xs text-indigo-500 hover:text-indigo-600"
          >
            <Volume2 size={14} /> Phát âm
          </button>

          {showBack && (
            <div className="mt-5 space-y-2 animate-fade-in">
              <p className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                {card?.vietnamese}
              </p>
              {card?.example && (
                <p className="text-xs text-gray-500 dark:text-gray-400 italic max-w-sm">
                  "{card.example}"
                </p>
              )}
            </div>
          )}
        </div>

        {!showBack ? (
          <button
            onClick={() => setShowBack(true)}
            className="w-full py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold mt-4"
          >
            Hiện đáp án
          </button>
        ) : (
          <div className="grid grid-cols-4 gap-2 mt-4">
            {RATING_BUTTONS.map(b => (
              <button
                key={b.id}
                onClick={() => handleRate(b.id)}
                className={`${b.color} text-white rounded-xl py-2 text-xs font-semibold flex flex-col items-center gap-0.5`}
              >
                <span>{b.label}</span>
                <span className="text-[10px] opacity-90">{b.desc}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Session counters */}
      <div className="grid grid-cols-4 gap-2">
        <div className="text-center text-xs text-gray-500 dark:text-gray-400">
          <span className="block font-bold text-rose-500">{sessionStats.again}</span>
          Again
        </div>
        <div className="text-center text-xs text-gray-500 dark:text-gray-400">
          <span className="block font-bold text-amber-500">{sessionStats.hard}</span>
          Hard
        </div>
        <div className="text-center text-xs text-gray-500 dark:text-gray-400">
          <span className="block font-bold text-emerald-500">{sessionStats.good}</span>
          Good
        </div>
        <div className="text-center text-xs text-gray-500 dark:text-gray-400">
          <span className="block font-bold text-sky-500">{sessionStats.easy}</span>
          Easy
        </div>
      </div>
    </div>
  )
}
