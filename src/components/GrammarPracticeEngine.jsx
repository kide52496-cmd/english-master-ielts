import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, BookOpen, ChevronRight, CheckCircle, X as XIcon, RefreshCw, Sparkles } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { listGrammarLessons, buildExerciseSet, buildLevelDrill, gradeAnswer } from '../utils/grammarEngine'
import { recordMistake } from '../utils/notes'

function levelBadge(level) {
  const map = {
    Beginner: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    A1: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    A2: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    B1: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    'B1+': 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
    IELTS: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
  }
  return `text-[10px] font-bold px-2 py-0.5 rounded-full ${map[level] || 'bg-gray-100 text-gray-700'}`
}

function ExerciseRunner({ items, onExit, onComplete }) {
  const [idx, setIdx]               = useState(0)
  const [picked, setPicked]         = useState(null)
  const [reorderInput, setReorder]  = useState([])
  const [reorderTokens, setTokens]  = useState([])
  const [revealed, setRevealed]     = useState(false)
  const [score, setScore]           = useState(0)
  const [done, setDone]             = useState(false)

  const item = items[idx]

  useEffect(() => {
    setPicked(null)
    setRevealed(false)
    if (item?.kind === 'reorder') {
      setReorder([])
      setTokens(item.tokens || [])
    }
  }, [idx, item])

  if (!item || items.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 text-center text-gray-500 border border-gray-100 dark:border-gray-800">
        Bài học này chưa đủ dữ liệu để sinh bài tập. Hãy chọn bài khác.
        <button onClick={onExit} className="block mx-auto mt-3 px-4 py-2 rounded-lg bg-indigo-500 text-white text-sm font-semibold">
          Quay lại
        </button>
      </div>
    )
  }

  const handleSubmit = () => {
    let correct = false
    let givenLabel = ''
    if (item.kind === 'reorder') {
      const ans = reorderInput.join(' ')
      correct = gradeAnswer(item, ans)
      givenLabel = ans
    } else {
      correct = gradeAnswer(item, picked)
      givenLabel = item.options?.[picked] ?? ''
    }
    if (correct) setScore(s => s + 1)
    if (!correct) {
      const correctLabel = item.kind === 'reorder'
        ? item.correctSentence
        : item.options?.[item.correctIndex] ?? ''
      recordMistake({
        source: 'grammar',
        prompt: item.prompt,
        correct: correctLabel,
        given:   givenLabel,
        hint:    item.explanation || '',
      })
    }
    setRevealed(true)
  }

  const handleNext = () => {
    if (idx + 1 < items.length) {
      setIdx(idx + 1)
    } else {
      setDone(true)
      onComplete?.(score + (revealed && gradeAnswer(item, picked) ? 0 : 0))
    }
  }

  if (done) {
    const pct = Math.round((score / items.length) * 100)
    return (
      <div className="space-y-4">
        <div className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-2xl p-6 text-center shadow">
          <div className="text-5xl mb-2">🎯</div>
          <h2 className="text-xl font-bold">Hoàn thành!</h2>
          <p className="text-sm text-white/90 mt-1">
            Đúng {score}/{items.length} câu · {pct}%
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onExit}
            className="py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-sm font-semibold"
          >
            Quay lại danh sách
          </button>
          <button
            onClick={() => { setIdx(0); setScore(0); setDone(false); setRevealed(false); setPicked(null) }}
            className="py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold flex items-center justify-center gap-2"
          >
            <RefreshCw size={14} /> Làm lại
          </button>
        </div>
      </div>
    )
  }

  const progress = Math.round((idx / items.length) * 100)

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>{idx + 1} / {items.length}</span>
        <span>Đúng: {score}</span>
      </div>
      <div className="h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <div className="h-full bg-indigo-500 transition-all" style={{ width: `${progress}%` }} />
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm">
        <div className="flex items-center gap-2 text-xs">
          <span className="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 font-semibold uppercase">
            {item.kind}
          </span>
          <span className="text-gray-400 truncate">{item.lessonTitle}</span>
        </div>

        <p className="mt-3 text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100 leading-relaxed">
          {item.prompt}
        </p>

        {/* MC / fill / error */}
        {(item.kind === 'mc' || item.kind === 'fill' || item.kind === 'error') && (
          <div className="mt-3 space-y-2">
            {item.options.map((opt, i) => {
              const correctIdx = item.kind === 'error'
                ? item.options.findIndex(o => o === item.correctSentence)
                : item.correctIndex
              const isCorrect = revealed && i === correctIdx
              const isWrong   = revealed && i === picked && !isCorrect
              return (
                <button
                  key={i}
                  disabled={revealed}
                  onClick={() => setPicked(i)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl border-2 text-sm transition
                    ${isCorrect ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300'
                      : isWrong ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300'
                      : picked === i ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700'}
                  `}
                >
                  <span className="font-mono text-xs text-gray-400 mr-2">{String.fromCharCode(65 + i)}</span>
                  {opt}
                </button>
              )
            })}
          </div>
        )}

        {/* Reorder */}
        {item.kind === 'reorder' && (
          <div className="mt-4 space-y-3">
            <div className="min-h-[44px] p-2 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-wrap gap-1.5">
              {reorderInput.length === 0 && (
                <span className="text-xs text-gray-400 self-center px-2">
                  Bấm các thẻ bên dưới để xếp câu
                </span>
              )}
              {reorderInput.map((tok, i) => (
                <button
                  key={tok + i}
                  disabled={revealed}
                  onClick={() => {
                    setReorder(rs => rs.filter((_, k) => k !== i))
                    setTokens(ts => [...ts, tok])
                  }}
                  className="px-2.5 py-1 rounded-lg bg-indigo-500 text-white text-sm font-medium"
                >
                  {tok}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {reorderTokens.map((tok, i) => (
                <button
                  key={tok + i}
                  disabled={revealed}
                  onClick={() => {
                    setTokens(ts => ts.filter((_, k) => k !== i))
                    setReorder(rs => [...rs, tok])
                  }}
                  className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-sm hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
                >
                  {tok}
                </button>
              ))}
            </div>
          </div>
        )}

        {revealed && (
          <div className="mt-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-100">
            <div className="font-semibold mb-1">Giải thích</div>
            {item.kind === 'reorder' && (
              <div className="mb-1">
                Câu đúng: <span className="font-semibold">{item.correctSentence}</span>
              </div>
            )}
            {item.explanation || 'Đáp án đã được đánh dấu ở trên.'}
          </div>
        )}

        <div className="mt-4 flex gap-2">
          <button
            onClick={onExit}
            className="px-3 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-sm font-semibold"
          >
            Thoát
          </button>
          {!revealed ? (
            <button
              disabled={item.kind === 'reorder' ? reorderInput.length === 0 : picked === null}
              onClick={handleSubmit}
              className="flex-1 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white text-sm font-semibold"
            >
              Kiểm tra
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold flex items-center justify-center gap-1"
            >
              {idx + 1 < items.length ? (<>Tiếp <ChevronRight size={16} /></>) : 'Kết thúc'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function GrammarPracticeEngine({ setCurrentPage }) {
  const { state, dispatch } = useApp()
  const [filterLevel, setFilterLevel] = useState('All')
  const [activeId, setActiveId]       = useState(null)
  const [drillMode, setDrillMode]     = useState(false)

  const lessons = useMemo(() => {
    const all = listGrammarLessons()
    return filterLevel === 'All' ? all : all.filter(l => l.level === filterLevel)
  }, [filterLevel])

  // Build the level filter from levels that actually have lessons, so empty
  // tabs (e.g. IELTS when no IELTS grammar exists yet) never show up.
  const LEVELS = useMemo(() => {
    const ORDER = ['Beginner', 'A1', 'A2', 'B1', 'B1+', 'IELTS']
    const present = new Set(listGrammarLessons().map(l => l.level))
    const ordered = ORDER.filter(lv => present.has(lv))
    const extras = [...present].filter(lv => !ORDER.includes(lv))
    return ['All', ...ordered, ...extras]
  }, [])

  const exerciseData = useMemo(() => {
    if (drillMode) {
      const items = buildLevelDrill(filterLevel === 'All' ? null : filterLevel, 12, Date.now() & 0xFFFF)
      return { lesson: { title: `Drill ${filterLevel}` }, items }
    }
    if (activeId) return buildExerciseSet(activeId, 8, activeId * 7)
    return null
  }, [activeId, drillMode, filterLevel])

  const handleComplete = (correctCount) => {
    const xp = Math.max(5, Math.round(correctCount * 1.5))
    dispatch({ type: 'ADD_XP', amount: xp })
    if (activeId) dispatch({ type: 'COMPLETE_GRAMMAR', lessonId: activeId })
  }

  if (exerciseData) {
    return (
      <div className="space-y-3">
        <button
          onClick={() => { setActiveId(null); setDrillMode(false) }}
          className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-500"
        >
          <ArrowLeft size={16} /> {drillMode ? 'Thoát drill' : 'Danh sách bài'}
        </button>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
          {exerciseData.lesson?.title || 'Bài tập'}
        </h2>
        <ExerciseRunner
          items={exerciseData.items}
          onExit={() => { setActiveId(null); setDrillMode(false) }}
          onComplete={handleComplete}
        />
      </div>
    )
  }

  return (
    <div className="space-y-4 animate-fade-up">
      <div className="bg-gradient-to-br from-purple-500 via-fuchsia-500 to-pink-500 bg-200 animate-gradient-x text-white rounded-3xl p-5 shadow-xl relative overflow-hidden">
        <div className="blob bg-pink-300/40 w-40 h-40 -top-10 -right-10" />
        <div className="blob bg-purple-300/40 w-32 h-32 -bottom-10 -left-8 animate-float-slow" />
        <div className="relative flex items-start gap-3">
          <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center animate-float">
            <Sparkles size={22} />
          </div>
          <div className="flex-1">
            <h2 className="text-lg sm:text-xl font-bold drop-shadow">Grammar Practice Engine</h2>
            <p className="text-xs sm:text-sm text-white/90 mt-1">
              Bài tập tự sinh: trắc nghiệm · điền chỗ trống · sắp xếp câu · sửa lỗi.
            </p>
          </div>
        </div>
        <div className="relative mt-4 grid grid-cols-2 gap-2">
          <button
            onClick={() => setDrillMode(true)}
            className="bg-white/20 hover:bg-white/30 hover:scale-[1.02] backdrop-blur-sm rounded-xl px-3 py-2 text-sm font-semibold flex items-center justify-center gap-2 transition-all btn-shine"
          >
            ⚡ Drill 12 câu hỗn hợp
          </button>
          <select
            value={filterLevel}
            onChange={e => setFilterLevel(e.target.value)}
            className="bg-white/20 backdrop-blur-sm rounded-xl px-3 py-2 text-sm font-semibold border-0 outline-none"
          >
            {LEVELS.map(l => <option key={l} value={l} className="text-gray-800">{l}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-3 sm:p-4">
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
          {lessons.length} bài · click để luyện
        </div>
        <ul className="space-y-1.5 max-h-[60vh] overflow-y-auto pr-1">
          {lessons.map(l => {
            const done = state.completedGrammar?.includes(l.id)
            return (
              <li key={l.id}>
                <button
                  onClick={() => setActiveId(l.id)}
                  disabled={!l.hasExercises && !l.hasExamples}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-indigo-300 dark:hover:border-indigo-700 disabled:opacity-50 transition text-left"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={levelBadge(l.level)}>{l.level}</span>
                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">{l.title}</span>
                      {done && <CheckCircle size={14} className="text-emerald-500 flex-shrink-0" />}
                    </div>
                    {l.titleVi && (
                      <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                        {l.titleVi}
                      </div>
                    )}
                  </div>
                  <ChevronRight size={16} className="text-gray-400" />
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
