import { useEffect, useState } from "react"
import { Headphones, Volume2, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react"
import { useApp } from "../context/AppContext"
import { speak, stopSpeaking } from "../utils/speech"
import { recordMistake } from "../utils/notes"
import { DICTATION_SAMPLES } from "../data/dictationSamples"

const SAMPLES = DICTATION_SAMPLES


const PUNCT_RE = /[.,!?;:"()\[\]\u2018\u2019\u201C\u201D\u2014\-]/g
function normalize(s){return String(s||"").toLowerCase().replace(PUNCT_RE,"").replace(/\s+/g," ").trim()}
function tokens(s){return normalize(s).split(/\s+/).filter(Boolean)}

function diffWords(target, typed) {
  const t = tokens(target), u = tokens(typed)
  const T = t.length, U = u.length
  const dp = Array(T + 1).fill(0).map(() => Array(U + 1).fill(0))
  for (let i = 1; i <= T; i++) {
    for (let j = 1; j <= U; j++) {
      dp[i][j] = t[i - 1] === u[j - 1]
        ? dp[i - 1][j - 1] + 1
        : Math.max(dp[i - 1][j], dp[i][j - 1])
    }
  }
  let i = T, j = U
  const annotated = Array(T).fill(null)
  while (i > 0 && j > 0) {
    if (t[i - 1] === u[j - 1]) {
      annotated[i - 1] = { word: t[i - 1], status: "correct" }; i--; j--
    } else if (dp[i - 1][j] >= dp[i][j - 1]) {
      annotated[i - 1] = { word: t[i - 1], status: "missing" }; i--
    } else { j-- }
  }
  while (i > 0) { annotated[i - 1] = { word: t[i - 1], status: "missing" }; i-- }
  for (let k = 0; k < T; k++) if (!annotated[k]) annotated[k] = { word: t[k], status: "missing" }
  const correctCount = annotated.filter(x => x.status === "correct").length
  const score = T > 0 ? Math.round((correctCount / T) * 100) : 0
  return { annotated, score, total: T, correct: correctCount }
}

export default function DictationMode() {
  const { dispatch } = useApp()
  const [idx, setIdx] = useState(0)
  const [rate, setRate] = useState(0.85)
  const [typed, setTyped] = useState('')
  const [revealed, setRevealed] = useState(false)
  const [showText, setShowText] = useState(false)
  const [result, setResult] = useState(null)

  const target = SAMPLES[idx]

  useEffect(() => {
    setTyped('')
    setRevealed(false)
    setShowText(false)
    setResult(null)
    stopSpeaking()
  }, [idx])

  const handlePlay = () => speak(target.text, { rate })

  const handleCheck = () => {
    const r = diffWords(target.text, typed)
    setResult(r)
    setRevealed(true)
    const xp = Math.max(2, Math.floor(r.score / 10))
    dispatch({ type: 'ADD_XP', amount: xp })
    if (r.score < 80) {
      recordMistake({
        source: 'dictation',
        prompt: 'Dictation: nghe và gõ lại câu',
        correct: target.text,
        given:   typed,
        hint:    `Đúng ${r.correct}/${r.total} từ`,
      })
    }
  }

  const colorClass = (status) => {
    if (status === 'correct') return 'text-emerald-600 dark:text-emerald-400'
    if (status === 'missing') return 'text-rose-600 dark:text-rose-400 underline decoration-wavy'
    return 'text-gray-500'
  }

  return (
    <div className="space-y-4 max-w-2xl mx-auto animate-fade-up">
      <div className="bg-gradient-to-br from-cyan-500 via-sky-500 to-indigo-500 bg-200 animate-gradient-x text-white rounded-3xl p-5 shadow-xl relative overflow-hidden">
        <div className="blob bg-cyan-300/40 w-40 h-40 -top-10 -right-10" />
        <div className="blob bg-indigo-300/40 w-32 h-32 -bottom-10 -left-8 animate-float-slow" />
        <div className="relative flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center animate-float">
            <Headphones size={22} />
          </div>
          <div className="flex-1">
            <h2 className="text-lg sm:text-xl font-bold drop-shadow">Dictation Mode</h2>
            <p className="text-xs sm:text-sm text-white/90 mt-1">
              Nghe, gõ lại, chấm điểm. Luyện nghe + viết chính tả cùng lúc.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Câu {idx + 1} / {SAMPLES.length} · {target.level}</span>
          <div className="flex gap-1">
            <button onClick={() => setIdx(i => Math.max(0, i - 1))} disabled={idx === 0}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40">
              <ChevronLeft size={16} />
            </button>
            <button onClick={() => setIdx(i => Math.min(SAMPLES.length - 1, i + 1))} disabled={idx === SAMPLES.length - 1}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button onClick={handlePlay}
            className="px-3 py-2 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-sm font-semibold flex items-center gap-1">
            <Volume2 size={14} /> Nghe mẫu
          </button>
          <label className="flex items-center gap-2 text-xs text-gray-500 px-2">
            Tốc độ
            <input type="range" min="0.6" max="1.2" step="0.05" value={rate}
              onChange={e => setRate(Number(e.target.value))} />
            <span className="font-mono">{rate.toFixed(2)}x</span>
          </label>
          <button onClick={() => setShowText(v => !v)}
            className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-sm font-semibold">
            {showText ? 'Ẩn text' : 'Hiện text'}
          </button>
        </div>

        {showText && (
          <div className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 leading-relaxed">
            {target.text}
          </div>
        )}

        <textarea
          value={typed}
          onChange={e => setTyped(e.target.value)}
          rows={5}
          placeholder="Nghe rồi gõ lại câu bạn vừa nghe..."
          className="w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-sm text-gray-800 dark:text-gray-100 outline-none focus:border-indigo-400"
        />

        {!revealed ? (
          <button onClick={handleCheck} disabled={!typed.trim()}
            className="w-full py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white text-sm font-semibold">
            Kiểm tra bài nghe
          </button>
        ) : (
          <button onClick={() => { setTyped(''); setResult(null); setRevealed(false) }}
            className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold flex items-center justify-center gap-1">
            <RefreshCw size={14} /> Làm lại câu này
          </button>
        )}
      </div>

      {result && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 sm:p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-extrabold ${
              result.score >= 75 ? 'bg-emerald-500 text-white' : result.score >= 50 ? 'bg-amber-500 text-white' : 'bg-rose-500 text-white'
            }`}>
              {result.score}
            </div>
            <div>
              <div className="text-sm font-bold text-gray-800 dark:text-gray-100">Điểm dictation</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Đúng {result.correct}/{result.total} từ</div>
            </div>
          </div>

          <div className="text-xs uppercase tracking-wider font-semibold text-gray-500 mb-1">Từ mục tiêu</div>
          <p className="text-sm leading-relaxed">
            {result.annotated.map((a, i) => (
              <span key={i} className={`mr-1 ${colorClass(a.status)}`}>{a.word}</span>
            ))}
          </p>
        </div>
      )}
    </div>
  )
}

