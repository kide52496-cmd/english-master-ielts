import { useEffect, useMemo, useState } from "react"
import { useApp } from "../context/AppContext"
import { speak } from "../utils/speech"
import { buildQuizSet, gradeAnswer, flattenReading, QUIZ_KINDS } from "../utils/quizEngine"
import { recordMistake } from "../utils/notes"
import { ArrowLeft, ChevronRight, Sparkles, BookOpen, RefreshCw, Volume2 } from "lucide-react"

const LEVELS = ["All", "Beginner", "A1", "A2", "B1", "B1+", "IELTS Foundation", "IELTS 5.0-6.0"]

function ReadingPassage({ item, onSubmit }) {
  const [pickedMap, setPicked] = useState({})
  const [revealed, setRev]     = useState(false)
  const subs = flattenReading(item)
  const [idx, setIdx]          = useState(0)
  const sub = subs[idx]
  if (!sub) return null

  const advance = () => {
    if (idx + 1 < subs.length) { setIdx(idx + 1); setRev(false) }
    else {
      let correctCount = 0
      subs.forEach((s, i) => { if (gradeAnswer(s, pickedMap[i])) correctCount++ })
      onSubmit(correctCount, subs.length, item)
    }
  }
  const correctIdx = sub.correctIndex
  const myPick = pickedMap[idx]

  return (
    <div className="space-y-4">
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 sm:p-5 max-h-[40vh] overflow-y-auto">
        <h3 className="text-sm font-bold text-amber-800 dark:text-amber-200 mb-2 flex items-center gap-2">
          <BookOpen size={16} /> {item.prompt}
        </h3>
        <p className="text-sm leading-relaxed text-amber-900 dark:text-amber-100 whitespace-pre-line">
          {item.passage}
        </p>
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 sm:p-5">
        <div className="text-xs text-gray-500 mb-2">Câu {idx + 1} / {subs.length}</div>
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-3">{sub.prompt}</p>
        <div className="space-y-2">
          {sub.options.map((opt, i) => {
            const isCorrect = revealed && i === correctIdx
            const isWrong   = revealed && i === myPick && !isCorrect
            return (
              <button
                key={i}
                disabled={revealed}
                onClick={() => setPicked(m => ({ ...m, [idx]: i }))}
                className={`w-full text-left px-3 py-2.5 rounded-xl border-2 text-sm transition
                  ${isCorrect ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300"
                    : isWrong ? "border-rose-500 bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300"
                    : myPick === i ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700"}
                `}
              >
                <span className="font-mono text-xs text-gray-400 mr-2">{String.fromCharCode(65 + i)}</span>
                {opt}
              </button>
            )
          })}
        </div>
        {revealed && sub.explanation && (
          <p className="mt-3 text-xs text-amber-800 dark:text-amber-200 bg-amber-50 dark:bg-amber-900/20 rounded-lg p-2">
            {sub.explanation}
          </p>
        )}
        <div className="mt-4">
          {!revealed ? (
            <button
              disabled={myPick === undefined}
              onClick={() => setRev(true)}
              className="w-full py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white text-sm font-semibold"
            >
              Kiểm tra
            </button>
          ) : (
            <button
              onClick={advance}
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold flex items-center justify-center gap-1"
            >
              {idx + 1 < subs.length ? (<>Tiếp <ChevronRight size={16} /></>) : "Kết thúc bài đọc"}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function GapFillItem({ item, onSubmit }) {
  const [picked, setPicked] = useState({})
  const [used, setUsed]     = useState({})
  const [revealed, setRev]  = useState(false)
  const blanks = item.blanks || []
  const choices = item.choices || []

  const fillBlank = (blankIdx, choice) => {
    setPicked(p => ({ ...p, [blankIdx]: choice }))
    setUsed(u => ({ ...u, [choice]: blankIdx }))
  }
  const clear = (blankIdx) => {
    const c = picked[blankIdx]
    setPicked(p => { const n = { ...p }; delete n[blankIdx]; return n })
    setUsed(u => { const n = { ...u }; delete n[c]; return n })
  }
  const submit = () => {
    const ans = blanks.map((_, i) => picked[i] || "")
    setRev(true)
    onSubmit(gradeAnswer(item, ans), 1, item)
  }
  const allFilled = blanks.every((_, i) => picked[i])

  return (
    <div className="space-y-4">
      <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{item.prompt}</p>
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 leading-loose text-sm text-gray-700 dark:text-gray-200">
        {item.passage.split(/____\((\d+)\)/).map((seg, i) => {
          if (i % 2 === 0) return <span key={i}>{seg}</span>
          const blankIdx = Number(seg) - 1
          const val = picked[blankIdx]
          const correct = revealed && val && val.toLowerCase() === blanks[blankIdx].toLowerCase()
          const wrong   = revealed && val && !correct
          return (
            <button
              key={i}
              disabled={revealed}
              onClick={() => clear(blankIdx)}
              className={`mx-1 px-2 py-0.5 rounded-md border-2 align-middle font-semibold
                ${correct ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                  : wrong   ? "border-rose-500 bg-rose-50 dark:bg-rose-900/20"
                  : val     ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                  : "border-dashed border-gray-300 dark:border-gray-700 text-gray-400"}
              `}
            >
              {val || `__(${blankIdx + 1})__`}
            </button>
          )
        })}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {choices.map((c, i) => {
          const isUsed = used[c] !== undefined
          return (
            <button
              key={c + i}
              disabled={isUsed || revealed}
              onClick={() => {
                const firstEmpty = blanks.findIndex((_, k) => !picked[k])
                if (firstEmpty >= 0) fillBlank(firstEmpty, c)
              }}
              className={`px-2.5 py-1 rounded-lg text-sm font-medium
                ${isUsed
                  ? "bg-gray-100 dark:bg-gray-800 text-gray-400 line-through"
                  : "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-900/60"}
              `}
            >
              {c}
            </button>
          )
        })}
      </div>
      {revealed && item.explanation && (
        <pre className="text-xs text-amber-800 dark:text-amber-200 bg-amber-50 dark:bg-amber-900/20 rounded-lg p-2 whitespace-pre-wrap">
{item.explanation}
        </pre>
      )}
      {!revealed && (
        <button
          disabled={!allFilled}
          onClick={submit}
          className="w-full py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white text-sm font-semibold"
        >
          Kiểm tra
        </button>
      )}
    </div>
  )
}

function StandardItem({ item, onSubmit }) {
  const [picked, setPicked] = useState(null)
  const [revealed, setRev]  = useState(false)
  const correct = item.correctIndex
  return (
    <div className="space-y-3">
      <p className="text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-100 leading-relaxed">
        {item.prompt}
      </p>
      {item.passage && (
        <p className="text-sm italic text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl">
          {item.passage}
        </p>
      )}
      <div className="space-y-2">
        {item.options.map((opt, i) => {
          const isCorrect = revealed && i === correct
          const isWrong   = revealed && i === picked && !isCorrect
          return (
            <button
              key={i}
              disabled={revealed}
              onClick={() => setPicked(i)}
              className={`w-full text-left px-3 py-2.5 rounded-xl border-2 text-sm transition
                ${isCorrect ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300"
                  : isWrong ? "border-rose-500 bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300"
                  : picked === i ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700"}
              `}
            >
              <span className="font-mono text-xs text-gray-400 mr-2">{String.fromCharCode(65 + i)}</span>
              {opt}
            </button>
          )
        })}
      </div>
      {revealed && item.explanation && (
        <p className="text-xs text-amber-800 dark:text-amber-200 bg-amber-50 dark:bg-amber-900/20 rounded-lg p-2">
          {item.explanation}
        </p>
      )}
      {!revealed ? (
        <button
          disabled={picked === null}
          onClick={() => {
            setRev(true)
            const ok = gradeAnswer(item, picked)
            if (!ok) {
              recordMistake({
                source: 'quiz',
                prompt: item.prompt + (item.passage ? `\n${item.passage}` : ''),
                correct: item.options?.[item.correctIndex] ?? '',
                given: item.options?.[picked] ?? '',
                hint: item.explanation || '',
              })
            }
            onSubmit(ok, 1, item)
          }}
          className="w-full py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white text-sm font-semibold"
        >
          Kiểm tra
        </button>
      ) : null}
    </div>
  )
}

export default function QuizPro({ setCurrentPage }) {
  const { dispatch } = useApp()
  const [level, setLevel]       = useState("All")
  const [kinds, setKinds]       = useState(QUIZ_KINDS.map(k => k.id))
  const [count, setCount]       = useState(10)
  const [seed, setSeed]         = useState(Date.now() & 0xFFFF)
  const [items, setItems]       = useState([])
  const [idx, setIdx]            = useState(0)
  const [score, setScore]       = useState(0)
  const [done, setDone]         = useState(false)
  const [advanceArmed, setArm]  = useState(false)
  const [loading, setLoading]   = useState(false)

  const start = () => {
    setLoading(true)
    buildQuizSet({ kinds, level, count, seed })
      .then(s => {
        setItems(s); setIdx(0); setScore(0); setDone(false); setArm(false); setLoading(false)
      })
      .catch(err => {
        console.warn("Quiz build failed:", err)
        setLoading(false)
      })
  }
  useEffect(() => { if (items.length === 0) return; setArm(false) }, [idx])

  const handleSubmit = (correctOrCount, total = 1) => {
    if (typeof correctOrCount === "boolean") {
      if (correctOrCount) setScore(s => s + 1)
    } else {
      setScore(s => s + correctOrCount)
    }
    setArm(true)
  }
  const next = () => {
    if (idx + 1 < items.length) setIdx(idx + 1)
    else {
      setDone(true)
      const earnedXp = Math.max(5, score * 2)
      dispatch({ type: "ADD_XP", amount: earnedXp })
    }
  }

  // ── pre-quiz screen ───────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="space-y-4 animate-fade-up">
        <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 bg-200 animate-gradient-x text-white rounded-3xl p-5 shadow-xl relative overflow-hidden">
          <div className="blob bg-pink-300/40 w-40 h-40 -top-10 -right-10" />
          <div className="blob bg-purple-300/40 w-32 h-32 -bottom-10 -left-8 animate-float-slow" />
          <div className="relative flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center animate-float">
              <Sparkles size={22} />
            </div>
            <div className="flex-1">
              <h2 className="text-lg sm:text-xl font-bold drop-shadow">Quiz Pro</h2>
              <p className="text-xs sm:text-sm text-white/90 mt-1">
                Đoạn đọc dài · Từ trong ngữ cảnh · Điền chỗ trống · Trắc nghiệm · Đúng/Sai
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 sm:p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Cấp độ</label>
            <select value={level} onChange={e => setLevel(e.target.value)}
              className="w-full text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2">
              {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Số câu</label>
            <input type="number" min="5" max="40" value={count}
              onChange={e => setCount(Math.max(5, Math.min(40, Number(e.target.value) || 10)))}
              className="w-full text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-2">Dạng câu hỏi</label>
            <div className="flex flex-wrap gap-2">
              {QUIZ_KINDS.map(k => {
                const active = kinds.includes(k.id)
                return (
                  <button
                    key={k.id}
                    onClick={() => setKinds(prev => active ? prev.filter(x => x !== k.id) : [...prev, k.id])}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border-2 transition
                      ${active
                        ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300"
                        : "border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400"}
                    `}
                  >
                    {k.label}
                  </button>
                )
              })}
            </div>
          </div>
          <button
            disabled={kinds.length === 0 || loading}
            onClick={start}
            className="w-full py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white text-sm font-semibold flex items-center justify-center gap-2"
          >
            <Sparkles size={16} /> {loading ? "Đang tạo quiz..." : "Bắt đầu quiz"}
          </button>
        </div>
      </div>
    )
  }

  // ── done screen ───────────────────────────────────────────────────
  if (done) {
    const totalQ = items.reduce((sum, it) => sum + (it.kind === "reading" ? (it.subQuestions?.length || 1) : 1), 0)
    const pct = Math.round((score / Math.max(1, totalQ)) * 100)
    return (
      <div className="space-y-4 animate-fade-up">
        <div className="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 bg-200 animate-gradient-x text-white rounded-3xl p-6 text-center shadow-xl relative overflow-hidden">
          <div className="blob bg-cyan-300/40 w-36 h-36 -top-8 -right-8" />
          <div className="blob bg-emerald-300/40 w-28 h-28 -bottom-8 -left-8 animate-float-slow" />
          <div className="relative">
            <div className="text-5xl mb-2 animate-pop">🎉</div>
            <h2 className="text-xl font-bold drop-shadow">Hoàn thành!</h2>
            <p className="text-sm text-white/90 mt-1">Đúng {score}/{totalQ} · {pct}% · +{Math.max(5, score * 2)} XP</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => { setItems([]); setSeed(Date.now() & 0xFFFF) }}
            className="py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-sm font-semibold hover:scale-[1.02] transition-transform">
            Thoát
          </button>
          <button onClick={() => { setSeed((seed * 7 + 1) & 0xFFFF); start() }}
            className="py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-95 hover:scale-[1.02] text-white text-sm font-semibold flex items-center justify-center gap-1 transition-all btn-shine">
            <RefreshCw size={14} /> Quiz mới
          </button>
        </div>
      </div>
    )
  }

  // ── question screen ───────────────────────────────────────────────
  const item = items[idx]
  const progress = Math.round((idx / items.length) * 100)

  return (
    <div className="space-y-3 max-w-2xl mx-auto">
      <button onClick={() => setItems([])}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-500">
        <ArrowLeft size={16} /> Thoát
      </button>
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{idx + 1} / {items.length} · {item.kind}</span>
        <span>Đúng: {score}</span>
      </div>
      <div className="h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <div className="h-full bg-indigo-500 transition-all" style={{ width: `${progress}%` }} />
      </div>

      {item.kind === "reading" && (
        <ReadingPassage item={item} onSubmit={(correct, total) => { setScore(s => s + correct); setArm(true) }} />
      )}
      {item.kind === "gapfill" && <GapFillItem item={item} onSubmit={handleSubmit} />}
      {(item.kind === "mc" || item.kind === "vocab_ctx" || item.kind === "tf") && (
        <StandardItem item={item} onSubmit={handleSubmit} />
      )}

      {advanceArmed && (
        <button onClick={next}
          className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold flex items-center justify-center gap-1">
          {idx + 1 < items.length ? (<>Câu kế <ChevronRight size={16} /></>) : "Kết thúc"}
        </button>
      )}
    </div>
  )
}
