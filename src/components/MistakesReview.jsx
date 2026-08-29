import { useEffect, useMemo, useState } from "react"
import { ArrowLeft, ChevronRight, RefreshCw, CheckCircle2, X as XIcon, Sparkles, AlertTriangle } from "lucide-react"
import { useApp } from "../context/AppContext"
import { getNotes, getDueMistakes, reviewMistakeSRS, markMistakeMastered, deleteMistake } from "../utils/notes"

const SOURCE_LABEL = {
  quiz:      "Quiz",
  grammar:   "Grammar",
  dictation: "Dictation",
  speaking:  "Speaking",
  reading:   "Reading",
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildPracticeItems(mistakes) {
  return shuffle(mistakes).map(m => {
    const correctOption = String(m.correct || "").trim()
    const distractors = []
    if (m.given && m.given !== m.correct) distractors.push(String(m.given).trim())
    distractors.push("Không chắc")
    distractors.push("Bỏ qua")
    const options = shuffle([correctOption || "Đáp án đúng", ...distractors.filter(Boolean)])
    return {
      id: m.id,
      mistakeId: m.id,
      source: m.source,
      prompt: m.prompt || "Hãy chọn đáp án đúng",
      hint: m.hint || "",
      correct: correctOption,
      options,
      raw: m,
    }
  })
}

export default function MistakesReview({ setCurrentPage }) {
  const { dispatch } = useApp()
  const [mistakes, setMistakes] = useState([])
  const [items, setItems]       = useState([])
  const [idx, setIdx]            = useState(0)
  const [picked, setPicked]      = useState(null)
  const [revealed, setRevealed]  = useState(false)
  const [score, setScore]         = useState(0)
  const [done, setDone]           = useState(false)

  useEffect(() => {
    const due = getDueMistakes()
    const data = getNotes()
    const allPending = (data.mistakes || []).filter(m => !m.mastered)
    // If no due cards yet, fall back to all pending so user can still practice.
    const pool = due.length > 0 ? due : allPending
    setMistakes(pool)
    setItems(buildPracticeItems(pool).slice(0, 12))
  }, [])

  const total = items.length
  const progressPct = total > 0 ? Math.round((idx / total) * 100) : 0
  const item = items[idx]

  const handleSubmit = () => {
    if (!item) return
    const ok = item.options[picked] === item.correct
    setRevealed(true)
    if (ok) setScore(s => s + 1)
    // Persist SRS feedback (right/wrong) to notes.js
    reviewMistakeSRS(item.mistakeId, ok)
  }

  const handleNext = () => {
    if (!item) return
    if (idx + 1 < items.length) {
      setIdx(idx + 1); setPicked(null); setRevealed(false)
    } else {
      // award XP and finish
      const earnedXp = Math.max(5, score * 4)
      dispatch({ type: "ADD_XP", amount: earnedXp })
      setDone(true)
    }
  }

  const handleMarkMastered = () => {
    if (!item) return
    markMistakeMastered(item.mistakeId, true)
    handleNext()
  }

  const handleDeleteMistake = () => {
    if (!item) return
    deleteMistake(item.mistakeId)
    handleNext()
  }

  if (mistakes.length === 0) {
    return (
      <div className="space-y-4 max-w-xl mx-auto animate-fade-up">
        <div className="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 bg-200 animate-gradient-x text-white rounded-3xl p-6 text-center shadow-xl relative overflow-hidden">
          <div className="blob bg-cyan-300/40 w-36 h-36 -top-8 -right-8" />
          <div className="blob bg-emerald-300/40 w-28 h-28 -bottom-8 -left-8 animate-float-slow" />
          <div className="relative">
            <div className="text-5xl mb-2 animate-pop">🎯</div>
            <h2 className="text-xl font-bold drop-shadow">Không còn lỗi cần ôn</h2>
            <p className="text-sm text-white/90 mt-1">SRS đã sắp xếp lịch ôn. Khi tới hạn lỗi sẽ tự xuất hiện. Trong lúc đó hãy luyện thêm Quiz Pro / Grammar / Dictation.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => setCurrentPage?.("quiz-pro")}
            className="py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-95 hover:scale-[1.02] text-white text-sm font-semibold transition-all btn-shine">Quiz Pro</button>
          <button onClick={() => setCurrentPage?.("grammar-practice")}
            className="py-3 rounded-xl bg-gradient-to-r from-purple-500 to-fuchsia-600 hover:opacity-95 hover:scale-[1.02] text-white text-sm font-semibold transition-all btn-shine">Grammar Practice</button>
        </div>
      </div>
    )
  }

  if (done) {
    const pct = Math.round((score / Math.max(1, total)) * 100)
    return (
      <div className="space-y-4 max-w-xl mx-auto animate-fade-up">
        <div className="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 bg-200 animate-gradient-x text-white rounded-3xl p-6 text-center shadow-xl relative overflow-hidden">
          <div className="blob bg-cyan-300/40 w-36 h-36 -top-8 -right-8" />
          <div className="blob bg-emerald-300/40 w-28 h-28 -bottom-8 -left-8 animate-float-slow" />
          <div className="relative">
            <div className="text-5xl mb-2 animate-pop">🎉</div>
            <h2 className="text-xl font-bold drop-shadow">Hoàn thành ôn lỗi</h2>
            <p className="text-sm text-white/90 mt-1">Đúng {score}/{total} · {pct}% · +{Math.max(5, score * 4)} XP</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => setCurrentPage?.("notes")}
            className="py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-sm font-semibold hover:scale-[1.02] transition-transform">Về Notes</button>
          <button onClick={() => {
            const due = getDueMistakes()
            const data = getNotes()
            const allPending = (data.mistakes || []).filter(m => !m.mastered)
            const pool = due.length > 0 ? due : allPending
            setMistakes(pool)
            setItems(buildPracticeItems(pool).slice(0, 12))
            setIdx(0); setScore(0); setDone(false); setPicked(null); setRevealed(false)
          }}
            className="py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-95 hover:scale-[1.02] text-white text-sm font-semibold flex items-center justify-center gap-1 transition-all btn-shine">
            <RefreshCw size={14} /> Ôn tiếp
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3 max-w-2xl mx-auto animate-fade-up">
      <button onClick={() => setCurrentPage?.("notes")}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-500">
        <ArrowLeft size={16} /> Quay lại Notes
      </button>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>Câu {idx + 1} / {total}</span>
        <span>Đúng: {score}</span>
      </div>
      <div className="h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <div className="h-full bg-indigo-500 transition-all" style={{ width: `${progressPct}%` }} />
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm">
        <div className="flex items-center gap-2 text-xs">
          <span className="px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-300 font-semibold uppercase flex items-center gap-1">
            <AlertTriangle size={12} /> Lỗi cũ · {SOURCE_LABEL[item.source] || item.source}
          </span>
          {item.raw?.count > 1 && (
            <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 text-[10px]">sai {item.raw.count} lần</span>
          )}
        </div>

        <p className="mt-3 text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100 leading-relaxed whitespace-pre-line">
          {item.prompt}
        </p>

        <div className="mt-3 space-y-2">
          {item.options.map((opt, i) => {
            const isCorrect = revealed && opt === item.correct
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

        {revealed && (
          <div className="mt-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-100 space-y-1">
            <div><b>Đáp án đúng:</b> {item.correct}</div>
            {item.raw?.given && <div><b>Bạn đã nói/gõ:</b> {item.raw.given}</div>}
            {item.hint && <div><b>Gợi ý:</b> {item.hint}</div>}
          </div>
        )}

        <div className="mt-4 grid grid-cols-2 gap-2">
          {!revealed ? (
            <>
              <button onClick={() => setCurrentPage?.("notes")}
                className="py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-sm font-semibold">Thoát</button>
              <button disabled={picked === null}
                onClick={handleSubmit}
                className="py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white text-sm font-semibold">
                Kiểm tra
              </button>
            </>
          ) : (
            <>
              <button onClick={handleMarkMastered}
                className="py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold flex items-center justify-center gap-1">
                <CheckCircle2 size={14} /> Đã thuộc
              </button>
              <button onClick={handleNext}
                className="py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold flex items-center justify-center gap-1">
                {idx + 1 < items.length ? (<>Câu kế <ChevronRight size={16} /></>) : "Kết thúc"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
