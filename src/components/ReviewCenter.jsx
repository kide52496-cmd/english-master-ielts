import { useState, useEffect, useMemo, useCallback } from 'react'
import { useApp } from '../context/AppContext'
import { vocabulary } from '../data/vocabulary'
import { stories } from '../data/stories'
import { ieltsVocabulary } from '../data/ieltsLessons'
import { grammarLessons } from '../data/grammarLessons'
import {
  loadReviewData, saveReviewData, syncFromAppState,
  getDueCards, getWeakCards, getMasteredCards, scheduleCard,
  getLast7DaysActivity, recordActivity,
} from '../utils/spacedRepetition'
import {
  RotateCcw, CheckCircle, TrendingUp, Search, Filter,
  ChevronLeft, ChevronRight, BookOpen, Star, Zap,
  BarChart2, Target, Flame, Brain, Award, RefreshCw,
} from 'lucide-react'
import { ProgressRing } from './AudioVisuals'

const SOURCE_LABELS = {
  vocabulary: { label: 'Từ Vựng', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300', dot: 'bg-blue-500' },
  story:      { label: 'Story',   color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300', dot: 'bg-purple-500' },
  ielts:      { label: 'IELTS',   color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300', dot: 'bg-orange-500' },
  grammar:    { label: 'Ngữ Pháp', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300', dot: 'bg-emerald-500' },
  video:      { label: 'Video',   color: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300', dot: 'bg-teal-500' },
}

const TABS = [
  { id: 'overview',   label: 'Tổng Quan', icon: BookOpen },
  { id: 'flashcard',  label: 'Ôn Tập',    icon: Brain },
  { id: 'analytics',  label: 'Phân Tích', icon: BarChart2 },
]

// ── Utility ────────────────────────────────────────────────────────────────

function SourceBadge({ source }) {
  const cfg = SOURCE_LABELS[source] || SOURCE_LABELS.vocabulary
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cfg.color}`}>
      {cfg.label}
    </span>
  )
}

function StatCard({ icon: Icon, value, label, color, sub }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl mb-2 ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
      <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">{value}</div>
      <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
      {sub && <div className="text-xs text-gray-400 mt-0.5">{sub}</div>}
    </div>
  )
}

// ── Word List Item ─────────────────────────────────────────────────────────

function WordItem({ card, onRate }) {
  const [open, setOpen] = useState(false)
  const accuracy = card.correct + card.incorrect > 0
    ? Math.round((card.correct / (card.correct + card.incorrect)) * 100)
    : null
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${SOURCE_LABELS[card.source]?.dot || 'bg-gray-400'}`} />
          <span className="font-semibold text-gray-800 dark:text-gray-100 truncate">{card.english}</span>
          <SourceBadge source={card.source} />
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {accuracy !== null && (
            <span className={`text-xs font-bold ${accuracy >= 70 ? 'text-green-500' : accuracy >= 40 ? 'text-yellow-500' : 'text-red-500'}`}>
              {accuracy}%
            </span>
          )}
          <ChevronRight size={14} className={`text-gray-400 transition-transform ${open ? 'rotate-90' : ''}`} />
        </div>
      </button>
      {open && (
        <div className="px-4 pb-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
          <div className="pt-2 space-y-1">
            {card.pronunciation && <p className="text-xs text-gray-400 font-mono">{card.pronunciation}</p>}
            <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-300">{card.vietnamese}</p>
            {card.example && <p className="text-xs text-gray-500 italic">"{card.example}"</p>}
            <div className="flex gap-1 pt-2">
              {card.correct + card.incorrect > 0 && (
                <span className="text-xs text-gray-400">✓{card.correct} ✗{card.incorrect}</span>
              )}
            </div>
            {onRate && (
              <div className="flex gap-1.5 pt-1">
                {['again','hard','good','easy'].map(r => (
                  <button key={r} onClick={() => onRate(card.id, r)}
                    className={`flex-1 text-xs py-1 rounded-lg font-medium transition-colors ${
                      r === 'again' ? 'bg-red-100 text-red-700 hover:bg-red-200' :
                      r === 'hard'  ? 'bg-orange-100 text-orange-700 hover:bg-orange-200' :
                      r === 'good'  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' :
                                      'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {r === 'again' ? '↺ Again' : r === 'hard' ? '1d' : r === 'good' ? '3d' : '7d ⭐'}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Overview Tab ───────────────────────────────────────────────────────────

function OverviewTab({ reviewData, onDataChange }) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [listMode, setListMode] = useState('due') // 'due' | 'weak' | 'mastered' | 'all'

  const allCards = useMemo(() => Object.values(reviewData), [reviewData])
  const dueCards = useMemo(() => getDueCards(reviewData), [reviewData])
  const weakCards = useMemo(() => getWeakCards(reviewData), [reviewData])
  const masteredCards = useMemo(() => getMasteredCards(reviewData), [reviewData])

  const displayCards = useMemo(() => {
    let base
    switch (listMode) {
      case 'due':      base = dueCards; break
      case 'weak':     base = weakCards; break
      case 'mastered': base = masteredCards; break
      default:         base = allCards
    }
    if (filter !== 'all') base = base.filter(c => c.source === filter)
    if (search.trim()) {
      const q = search.toLowerCase()
      base = base.filter(c => c.english.toLowerCase().includes(q) || c.vietnamese.toLowerCase().includes(q))
    }
    return base
  }, [listMode, filter, search, allCards, dueCards, weakCards, masteredCards])

  const handleRate = useCallback((cardId, rating) => {
    const card = reviewData[cardId]
    if (!card) return
    const updated = { ...reviewData, [cardId]: scheduleCard(card, rating) }
    saveReviewData(updated)
    recordActivity(1)
    onDataChange(updated)
  }, [reviewData, onDataChange])

  const listTabs = [
    { id: 'due',      label: `Hôm Nay (${dueCards.length})`,      color: dueCards.length > 0 ? 'text-red-600' : 'text-gray-500' },
    { id: 'weak',     label: `Yếu (${weakCards.length})`,          color: 'text-orange-600' },
    { id: 'mastered', label: `Thuộc (${masteredCards.length})`,    color: 'text-green-600' },
    { id: 'all',      label: `Tất Cả (${allCards.length})`,        color: 'text-gray-600' },
  ]

  return (
    <div className="space-y-4">
      {/* List tabs */}
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
        {listTabs.map(t => (
          <button key={t.id} onClick={() => setListMode(t.id)}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              listMode === t.id ? 'bg-white dark:bg-gray-700 shadow-sm ' + t.color : 'text-gray-500 hover:text-gray-700'
            }`}
          >{t.label}</button>
        ))}
      </div>

      {/* Search + Filter row */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Tìm từ..."
            className="w-full pl-8 pr-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
        <div className="relative">
          <Filter size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <select value={filter} onChange={e => setFilter(e.target.value)}
            className="pl-7 pr-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none appearance-none"
          >
            <option value="all">Tất cả</option>
            <option value="vocabulary">Từ Vựng</option>
            <option value="story">Story</option>
            <option value="video">Video</option>
            <option value="ielts">IELTS</option>
          </select>
        </div>
      </div>

      {/* Word list */}
      {displayCards.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <div className="text-4xl mb-2">{listMode === 'due' ? '🎉' : '📭'}</div>
          <p className="text-sm">
            {listMode === 'due' ? 'Đã ôn hết rồi! Quay lại sau nhé.' : 'Chưa có từ nào ở đây.'}
          </p>
          {allCards.length === 0 && (
            <p className="text-xs mt-2 text-gray-400">Hãy học từ vựng / đọc stories / IELTS vocab để thêm từ vào đây.</p>
          )}
        </div>
      ) : (
        <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
          {displayCards.map(card => (
            <WordItem key={card.id} card={card} onRate={listMode !== 'mastered' ? handleRate : undefined} />
          ))}
        </div>
      )}
    </div>
  )
}

// ── Flashcard Tab ──────────────────────────────────────────────────────────

function FlashcardTab({ reviewData, onDataChange }) {
  const dueCards = useMemo(() => getDueCards(reviewData), [reviewData])
  const weakCards = useMemo(() => getWeakCards(reviewData), [reviewData])

  const [mode, setMode] = useState('menu') // 'menu' | 'session' | 'done'
  const [queue, setQueue] = useState([])
  const [idx, setIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [sessionStats, setSessionStats] = useState({ again: 0, hard: 0, good: 0, easy: 0 })

  const startSession = (cards) => {
    setQueue(cards.slice())
    setIdx(0)
    setFlipped(false)
    setSessionStats({ again: 0, hard: 0, good: 0, easy: 0 })
    setMode('session')
  }

  const handleRate = (rating) => {
    const card = queue[idx]
    const updated = { ...reviewData, [card.id]: scheduleCard(card, rating) }
    saveReviewData(updated)
    recordActivity(1)
    onDataChange(updated)
    setSessionStats(s => ({ ...s, [rating]: s[rating] + 1 }))

    // 'again' cards go back at end of queue
    const newQueue = [...queue]
    if (rating === 'again') newQueue.push(card)

    if (idx + 1 >= newQueue.length || (rating !== 'again' && idx + 1 >= queue.length)) {
      setMode('done')
    } else {
      setQueue(newQueue)
      setIdx(i => i + 1)
      setFlipped(false)
    }
  }

  if (mode === 'menu') {
    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">Chọn bộ ôn tập:</p>
        <div className="grid grid-cols-1 gap-3">
          <button onClick={() => startSession(dueCards)} disabled={dueCards.length === 0}
            className="flex items-center gap-3 p-4 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-2xl disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity shadow-md"
          >
            <RotateCcw size={22} />
            <div className="text-left">
              <div className="font-bold">Ôn Hôm Nay</div>
              <div className="text-sm opacity-80">{dueCards.length} từ cần ôn · Ưu tiên cao</div>
            </div>
          </button>
          <button onClick={() => startSession(weakCards)} disabled={weakCards.length === 0}
            className="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-2xl disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity shadow-md"
          >
            <Target size={22} />
            <div className="text-left">
              <div className="font-bold">Luyện Từ Yếu</div>
              <div className="text-sm opacity-80">{weakCards.length} từ sai nhiều</div>
            </div>
          </button>
          <button onClick={() => startSession(Object.values(reviewData).sort(() => Math.random() - 0.5).slice(0, 20))}
            disabled={Object.keys(reviewData).length === 0}
            className="flex items-center gap-3 p-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity shadow-md"
          >
            <RefreshCw size={22} />
            <div className="text-left">
              <div className="font-bold">Ôn Ngẫu Nhiên</div>
              <div className="text-sm opacity-80">20 từ random từ kho</div>
            </div>
          </button>
        </div>
        {Object.keys(reviewData).length === 0 && (
          <p className="text-center text-xs text-gray-400 pt-4">
            Hãy học từ vựng, đọc stories hoặc học IELTS vocab trước để tạo kho từ ôn tập.
          </p>
        )}
      </div>
    )
  }

  if (mode === 'done') {
    const total = sessionStats.again + sessionStats.hard + sessionStats.good + sessionStats.easy
    const correct = sessionStats.good + sessionStats.easy
    return (
      <div className="text-center py-8 space-y-4">
        <div className="text-6xl">🎉</div>
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Hoàn thành buổi ôn!</h3>
        <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto">
          {[
            { label: 'Again', v: sessionStats.again, color: 'text-red-500' },
            { label: 'Hard',  v: sessionStats.hard,  color: 'text-orange-500' },
            { label: 'Good',  v: sessionStats.good,  color: 'text-blue-500' },
            { label: 'Easy',  v: sessionStats.easy,  color: 'text-green-500' },
          ].map(s => (
            <div key={s.label} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-2">
              <div className={`text-lg font-bold ${s.color}`}>{s.v}</div>
              <div className="text-xs text-gray-400">{s.label}</div>
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Độ chính xác: <span className="font-bold">{total > 0 ? Math.round(correct / total * 100) : 0}%</span>
        </p>
        <button onClick={() => setMode('menu')}
          className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
        >
          Ôn tiếp
        </button>
      </div>
    )
  }

  // Session
  const card = queue[idx]
  const total = queue.length
  const progress = Math.round((idx / total) * 100)

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div>
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>{idx + 1} / {total}</span>
          <button onClick={() => setMode('menu')} className="text-gray-400 hover:text-gray-600">Thoát</button>
        </div>
        <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
          <div className="h-1.5 rounded-full bg-indigo-500 transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Flip card */}
      <div
        onClick={() => setFlipped(f => !f)}
        className="cursor-pointer select-none min-h-[220px] bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 text-white flex flex-col items-center justify-center text-center shadow-xl hover:shadow-2xl transition-shadow"
      >
        {!flipped ? (
          <>
            <div className="text-xs opacity-70 mb-3">Nghĩa là gì? · Tap để xem</div>
            <div className="text-3xl font-bold mb-2">{card.english}</div>
            {card.pronunciation && <div className="text-sm opacity-70 font-mono">{card.pronunciation}</div>}
            <SourceBadge source={card.source} />
          </>
        ) : (
          <>
            <div className="text-xs opacity-70 mb-3">Đáp án</div>
            <div className="text-2xl font-bold mb-2 text-yellow-200">{card.vietnamese}</div>
            <div className="text-sm font-semibold opacity-90 mb-2">{card.english}</div>
            {card.example && <div className="text-xs opacity-70 italic max-w-xs">"{card.example}"</div>}
          </>
        )}
      </div>

      {/* Rating buttons */}
      {flipped ? (
        <div className="grid grid-cols-4 gap-2">
          {[
            { r: 'again', label: '↺ Again', sub: 'Quên',    cls: 'bg-red-100 text-red-700 border-red-200 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300' },
            { r: 'hard',  label: 'Khó',     sub: '1 ngày',  cls: 'bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-300' },
            { r: 'good',  label: 'Ổn',      sub: '3 ngày',  cls: 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300' },
            { r: 'easy',  label: 'Dễ ⭐',   sub: '7 ngày',  cls: 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300' },
          ].map(({ r, label, sub, cls }) => (
            <button key={r} onClick={() => handleRate(r)}
              className={`border rounded-xl py-2.5 text-center transition-all ${cls}`}
            >
              <div className="text-sm font-bold">{label}</div>
              <div className="text-xs opacity-70">{sub}</div>
            </button>
          ))}
        </div>
      ) : (
        <p className="text-center text-sm text-gray-400">Tap thẻ để xem đáp án</p>
      )}
    </div>
  )
}

// ── Analytics Tab ──────────────────────────────────────────────────────────

function AnalyticsTab({ reviewData }) {
  const { state } = useApp()
  const activity = useMemo(() => getLast7DaysActivity(), [])

  const allCards = Object.values(reviewData)
  const dueCount = getDueCards(reviewData).length
  const weakCount = getWeakCards(reviewData).length
  const masteredCount = getMasteredCards(reviewData).length
  const totalReviewed = allCards.filter(c => c.lastReview).length
  const totalCorrect = allCards.reduce((s, c) => s + c.correct, 0)
  const totalAttempts = allCards.reduce((s, c) => s + c.correct + c.incorrect, 0)
  const accuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0

  const quizAccuracy = state.quizScores.length > 0
    ? Math.round(state.quizScores.reduce((s, q) => s + (q.percentage || 0), 0) / state.quizScores.length)
    : 0

  const maxActivity = Math.max(...activity.map(d => d.count), 1)

  // Source distribution
  const srcCount = allCards.reduce((acc, c) => {
    acc[c.source] = (acc[c.source] || 0) + 1
    return acc
  }, {})

  // Today suggestion
  const suggestions = []
  if (dueCount > 0) suggestions.push(`Ôn ${dueCount} từ đến hạn hôm nay`)
  if (weakCount > 0) suggestions.push(`Luyện ${Math.min(weakCount, 5)} từ yếu`)
  if (state.completedGrammar.length < grammarLessons.length) suggestions.push('Học thêm 1 bài ngữ pháp')
  if ((state.learnedWords || []).length < 50) suggestions.push('Học thêm từ vựng cơ bản')
  if (suggestions.length === 0) suggestions.push('Tuyệt vời! Hãy thử Mock Test IELTS')

  return (
    <div className="space-y-5">
      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard icon={BookOpen} value={allCards.length} label="Từ trong kho" color="bg-indigo-500" sub={`${masteredCount} đã thuộc`} />
        <StatCard icon={RotateCcw} value={dueCount}       label="Cần ôn hôm nay" color="bg-red-500"    sub={weakCount > 0 ? `${weakCount} từ yếu` : 'Tốt lắm!'} />
        <StatCard icon={CheckCircle} value={`${accuracy}%`} label="Độ chính xác" color="bg-green-500"  sub={`${totalReviewed} từ đã luyện`} />
        <StatCard icon={Flame}     value={state.streak || 0}  label="Streak ngày"  color="bg-orange-500" sub={`Quiz: ${quizAccuracy}%`} />
      </div>

      {/* 7-day activity chart */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
        <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
          <TrendingUp size={16} className="text-indigo-500" /> Hoạt Động 7 Ngày
        </h3>
        <div className="flex items-end gap-1.5 h-24">
          {activity.map(({ key, label, count }) => {
            const today = new Date().toISOString().slice(0, 10)
            const isToday = key === today
            const pct = Math.round((count / maxActivity) * 100)
            return (
              <div key={key} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex flex-col justify-end" style={{ height: '72px' }}>
                  <div
                    className={`w-full rounded-t-md transition-all ${isToday ? 'bg-indigo-500' : 'bg-indigo-200 dark:bg-indigo-800'}`}
                    style={{ height: `${Math.max(pct, count > 0 ? 10 : 2)}%` }}
                    title={`${count} từ`}
                  />
                </div>
                <span className={`text-xs ${isToday ? 'text-indigo-600 font-bold' : 'text-gray-400'}`}>{label}</span>
              </div>
            )
          })}
        </div>
        <p className="text-xs text-gray-400 mt-2 text-center">Số từ ôn mỗi ngày</p>
      </div>

      {/* Source distribution */}
      {allCards.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
          <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Filter size={16} className="text-purple-500" /> Phân Bố Nguồn
          </h3>
          <div className="space-y-2.5">
            {Object.entries(srcCount).map(([src, count]) => {
              const pct = Math.round((count / allCards.length) * 100)
              const cfg = SOURCE_LABELS[src] || SOURCE_LABELS.vocabulary
              return (
                <div key={src}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className={`font-semibold px-2 py-0.5 rounded-full ${cfg.color}`}>{cfg.label}</span>
                    <span className="text-gray-500">{count} từ ({pct}%)</span>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                    <div className={`h-2 rounded-full ${cfg.dot}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Level progress */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
        <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
          <Zap size={16} className="text-yellow-500" /> Tổng Tiến Độ
        </h3>
        <div className="space-y-2">
          {[
            { label: 'Từ Vựng Cơ Bản', done: state.learnedWords.length, total: vocabulary.length, color: 'bg-blue-500' },
            { label: 'IELTS Vocab', done: (state.ieltsProgress?.learnedVocab || []).length, total: 144, color: 'bg-orange-500' },
            { label: 'Ngữ Pháp', done: state.completedGrammar.length, total: grammarLessons.length, color: 'bg-purple-500' },
            { label: 'Story Đã Đọc', done: (state.readStories || []).length, total: 10, color: 'bg-green-500' },
          ].map(({ label, done, total, color }) => (
            <div key={label}>
              <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                <span>{label}</span>
                <span>{done}/{total}</span>
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                <div className={`h-2 rounded-full ${color} transition-all`} style={{ width: `${Math.min(Math.round(done / total * 100), 100)}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Suggestions */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-2xl p-5 border border-indigo-100 dark:border-indigo-800">
        <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
          <Award size={16} className="text-indigo-500" /> Gợi Ý Hôm Nay
        </h3>
        <ul className="space-y-2">
          {suggestions.map((s, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
              <span className="text-indigo-400 mt-0.5">→</span> {s}
            </li>
          ))}
        </ul>
        <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
          <Star size={12} className="text-yellow-400" />
          <span>XP tổng: {(state.xp || 0).toLocaleString()} · Level {state.level || 1}</span>
        </div>
      </div>
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────

export default function ReviewCenter() {
  const { state } = useApp()
  const [tab, setTab] = useState('overview')
  const [reviewData, setReviewData] = useState({})

  // Load + sync on mount
  useEffect(() => {
    const raw = loadReviewData()
    const synced = syncFromAppState(raw, state, vocabulary, stories, ieltsVocabulary, grammarLessons)
    setReviewData(synced)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleDataChange = useCallback((updated) => {
    setReviewData(updated)
  }, [])

  const dueCount = useMemo(() => getDueCards(reviewData).length, [reviewData])

  return (
    <div className="space-y-5 animate-fade-up">
      {/* Premium Header */}
      <div className="bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 bg-200 animate-gradient-x rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="blob bg-fuchsia-300/40 w-44 h-44 -top-12 -right-12" />
        <div className="blob bg-violet-300/40 w-36 h-36 -bottom-12 -left-10 animate-float-slow" />
        <div className="relative flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-violet-200 text-sm">Trung Tâm Ôn Tập Thông Minh</p>
            <h1 className="text-2xl font-bold mt-0.5 drop-shadow flex items-center gap-2">
              <RefreshCw size={22} className="animate-float" /> Review Center
            </h1>
            <p className="text-sm text-violet-100 mt-1">Spaced Repetition · Analytics · Weak Word Tracker</p>
          </div>
          <ProgressRing
            pct={Object.keys(reviewData).length > 0
              ? Math.round((getMasteredCards(reviewData).length / Math.max(1, Object.keys(reviewData).length)) * 100)
              : 0}
            size={80} stroke={7} gradient={['#ffffff', '#f0abfc']}>
            <div className="text-center">
              <div className="text-base font-extrabold animate-count-up">{getMasteredCards(reviewData).length}</div>
              <div className="text-[10px] uppercase tracking-wider text-violet-100">đã thuộc</div>
            </div>
          </ProgressRing>
        </div>
        <div className="relative grid grid-cols-3 gap-2 mt-4">
          {[
            { v: Object.keys(reviewData).length, l: 'Trong kho', e: '📚' },
            { v: dueCount, l: 'Cần ôn', e: '🔔', highlight: dueCount > 0 },
            { v: getMasteredCards(reviewData).length, l: 'Đã thuộc', e: '⭐' },
          ].map((s, i) => (
            <div key={i} className={`rounded-xl p-2.5 text-center hover:scale-105 transition-transform ${s.highlight ? 'bg-red-400/40 ring-1 ring-red-300 animate-glow' : 'bg-white/15 backdrop-blur-sm'}`}>
              <div className="text-sm">{s.e}</div>
              <div className="font-bold animate-count-up">{s.v}</div>
              <div className="text-xs text-violet-100 leading-none">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-2xl p-1">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-semibold rounded-xl transition-all ${
              tab === id
                ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Icon size={15} />
            {label}
            {id === 'overview' && dueCount > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center leading-none">
                {dueCount > 9 ? '9+' : dueCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'overview'  && <OverviewTab  reviewData={reviewData} onDataChange={handleDataChange} />}
      {tab === 'flashcard' && <FlashcardTab reviewData={reviewData} onDataChange={handleDataChange} />}
      {tab === 'analytics' && <AnalyticsTab reviewData={reviewData} />}
    </div>
  )
}
