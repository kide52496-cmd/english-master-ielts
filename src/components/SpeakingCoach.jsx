import { useEffect, useMemo, useState } from "react"
import { Mic, Volume2, RefreshCw, Sparkles, ChevronRight, ChevronLeft } from "lucide-react"
import { speak, isSpeechRecognitionSupported, createRecognition } from "../utils/speech"
import { scoreUtterance, tipsByScore } from "../utils/pronunciationScorer"
import { useApp } from "../context/AppContext"
import { SPEAKING_SAMPLES } from "../data/speakingCoachSamples"

const SAMPLES = SPEAKING_SAMPLES


function statusColor(s) {
  switch (s) {
    case "correct": return "text-emerald-600 dark:text-emerald-400"
    case "close":   return "text-amber-600 dark:text-amber-400"
    case "wrong":   return "text-rose-600 dark:text-rose-400"
    case "missed":  return "text-rose-600 dark:text-rose-400 line-through"
    case "extra":   return "text-gray-400 italic"
    default:        return ""
  }
}

export default function SpeakingCoach() {
  const { dispatch } = useApp()
  const [idx, setIdx]            = useState(0)
  const [recognising, setRec]    = useState(false)
  const [transcript, setTrans]   = useState("")
  const [result, setResult]      = useState(null)
  const [error, setError]        = useState("")
  const supported = useMemo(() => isSpeechRecognitionSupported(), [])

  const target = SAMPLES[idx]

  useEffect(() => {
    setTrans(""); setResult(null); setError("")
  }, [idx])

  const handlePlay = () => speak(target.en, { rate: 0.85 })

  const handleListen = () => {
    if (!supported) {
      setError("Trình duyệt chưa hỗ trợ Speech Recognition. Hãy dùng Chrome/Edge mới nhất.")
      return
    }
    const rec = createRecognition()
    if (!rec) {
      setError("Không khởi tạo được nhận dạng giọng nói.")
      return
    }
    rec.continuous = false
    rec.interimResults = false
    rec.maxAlternatives = 1
    rec.lang = "en-US"

    setRec(true); setError(""); setTrans(""); setResult(null)

    rec.onresult = (ev) => {
      const text = Array.from(ev.results)
        .map(r => r[0]?.transcript || "")
        .join(" ")
      setTrans(text)
      const r = scoreUtterance(target.en, text)
      setResult(r)
      // award XP based on score
      const xp = Math.max(2, Math.floor(r.score / 10))
      dispatch({ type: "ADD_XP", amount: xp })
    }
    rec.onerror = (ev) => {
      setError(ev?.error ? `Lỗi: ${ev.error}` : "Lỗi không xác định khi nghe.")
      setRec(false)
    }
    rec.onend = () => setRec(false)

    try { rec.start() } catch (e) { setError("Không thể bắt đầu ghi âm."); setRec(false) }
  }

  const tips = result ? tipsByScore(result.score) : []

  return (
    <div className="space-y-4 max-w-2xl mx-auto animate-fade-up">
      <div className="bg-gradient-to-br from-rose-500 via-orange-500 to-amber-500 bg-200 animate-gradient-x text-white rounded-3xl p-5 shadow-xl relative overflow-hidden">
        <div className="blob bg-amber-300/40 w-40 h-40 -top-10 -right-10" />
        <div className="blob bg-rose-300/40 w-32 h-32 -bottom-10 -left-8 animate-float-slow" />
        <div className="relative flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center animate-float">
            <Mic size={22} />
          </div>
          <div className="flex-1">
            <h2 className="text-lg sm:text-xl font-bold drop-shadow">Speaking Coach</h2>
            <p className="text-xs sm:text-sm text-white/90 mt-1">
              Nói theo câu mẫu, AI nhận dạng và chấm phát âm theo từng từ.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 sm:p-5">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
          <span>Câu {idx + 1} / {SAMPLES.length} · {target.level}</span>
          <div className="flex gap-1">
            <button onClick={() => setIdx(i => Math.max(0, i - 1))}
              disabled={idx === 0}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40">
              <ChevronLeft size={16} />
            </button>
            <button onClick={() => setIdx(i => Math.min(SAMPLES.length - 1, i + 1))}
              disabled={idx === SAMPLES.length - 1}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
        <p className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100 leading-relaxed">
          {target.en}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{target.vi}</p>

        <div className="mt-3 flex gap-2">
          <button onClick={handlePlay}
            className="px-3 py-2 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-sm font-semibold flex items-center gap-1">
            <Volume2 size={14} /> Nghe mẫu
          </button>
          <button onClick={handleListen}
            disabled={recognising}
            className={`flex-1 px-4 py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-2
              ${recognising
                ? "bg-rose-500 text-white animate-pulse"
                : "bg-emerald-500 hover:bg-emerald-600 text-white"}
            `}>
            <Mic size={16} />
            {recognising ? "Đang nghe..." : "Bắt đầu nói"}
          </button>
        </div>
        {error && <p className="mt-2 text-xs text-rose-600 dark:text-rose-300">{error}</p>}
      </div>

      {transcript && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 sm:p-5">
          <div className="text-xs text-gray-500 mb-1">Bạn đã nói:</div>
          <p className="text-sm text-gray-800 dark:text-gray-100 italic">"{transcript}"</p>
        </div>
      )}

      {result && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 sm:p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-extrabold
              ${result.score >= 75 ? "bg-emerald-500 text-white"
                : result.score >= 50 ? "bg-amber-500 text-white"
                : "bg-rose-500 text-white"}
            `}>
              {result.score}
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold text-gray-800 dark:text-gray-100">Điểm phát âm</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{result.hint}</div>
            </div>
          </div>

          <div className="text-xs uppercase font-semibold text-gray-500 mb-1 tracking-wider">Diff theo từng từ</div>
          <p className="text-sm leading-relaxed">
            {result.alignment.map((a, i) => {
              const display = a.target || a.spoken || ""
              return (
                <span key={i} className={`mr-1 ${statusColor(a.status)}`}>
                  {display}
                </span>
              )
            })}
          </p>

          {tips.length > 0 && (
            <ul className="mt-3 space-y-1 text-xs text-amber-800 dark:text-amber-200 bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3">
              {tips.map((t, i) => <li key={i}>• {t}</li>)}
            </ul>
          )}

          <div className="mt-3 flex gap-2">
            <button onClick={handleListen}
              className="flex-1 px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold flex items-center justify-center gap-1">
              <RefreshCw size={14} /> Thử lại
            </button>
            <button onClick={() => setIdx(i => Math.min(SAMPLES.length - 1, i + 1))}
              className="px-3 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold flex items-center gap-1">
              Câu kế <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      <div className="text-[11px] text-gray-400 text-center">
        Tính năng dùng Web Speech API trên trình duyệt. Không gửi giọng nói lên server.
      </div>
    </div>
  )
}
