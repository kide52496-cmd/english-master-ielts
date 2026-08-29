import { useState, useEffect, useRef } from 'react'
import { useApp } from '../context/AppContext'
import { calcLevel } from '../context/AppContext'
import { getStageByXP } from '../data/roadmap'
import { listeningExercises } from '../data/ieltsListening'
import { readingPassages } from '../data/ieltsReading'
import { writingTasks } from '../data/ieltsWriting'
import { speakingPart1, speakingPart2, speakingPart3 } from '../data/ieltsSpeaking'
import { speak, stopSpeaking, speakDialogue } from '../utils/speech'
import { scoreWriting } from '../utils/writingScorer'
import {
  Clock, ChevronRight, CheckCircle,
  Volume2, VolumeX, RotateCcw, Award, Zap, AlertCircle,
} from 'lucide-react'

// Official IELTS Academic raw-score (out of 40) → band conversion tables.
// Each entry: [minimum raw score for this band, band]. Sorted high → low.
const READING_BANDS = [
  [39, 9.0], [37, 8.5], [35, 8.0], [33, 7.5], [30, 7.0], [27, 6.5],
  [23, 6.0], [19, 5.5], [15, 5.0], [13, 4.5], [10, 4.0], [8, 3.5],
  [6, 3.0], [4, 2.5], [3, 2.0], [2, 1.0], [0, 0],
]
const LISTENING_BANDS = [
  [39, 9.0], [37, 8.5], [35, 8.0], [32, 7.5], [30, 7.0], [26, 6.5],
  [23, 6.0], [18, 5.5], [16, 5.0], [13, 4.5], [11, 4.0], [8, 3.5],
  [6, 3.0], [4, 2.5], [3, 2.0], [2, 1.0], [0, 0],
]

// Convert a raw score to an IELTS band by scaling to the standard /40 test,
// then looking up the official table. Returns a numeric band (e.g. 6.5).
function bandFromRaw(correct, total, table) {
  if (!total) return 0
  const scaled = Math.round((correct / total) * 40)
  for (const [min, band] of table) {
    if (scaled >= min) return band
  }
  return 0
}

// Writing & Speaking here are SELF-ASSESSED (checklist / practice completion),
// not graded by a marker. Map the self-check ratio to a conservative estimated
// band so it can still factor into the overall — clearly labelled as an estimate.
function selfEstimatedBand(ratio) {
  if (ratio >= 0.9) return 6.5
  if (ratio >= 0.75) return 6.0
  if (ratio >= 0.6) return 5.5
  if (ratio >= 0.4) return 5.0
  if (ratio > 0) return 4.5
  return 0
}

// Round an average to the nearest half band using the official IELTS rule:
// .25 rounds up to .5, .75 rounds up to the next whole band.
function roundIELTSBand(avg) {
  const whole = Math.floor(avg)
  const frac = avg - whole
  if (frac < 0.25) return whole
  if (frac < 0.75) return whole + 0.5
  return whole + 1
}

// Snap a raw heuristic writing band to the nearest valid 0.5 step, clamped.
function snapWritingBand(b) {
  const clamped = Math.max(0, Math.min(9, b))
  return Math.round(clamped * 2) / 2
}

function bandColor(band) {
  if (band >= 7) return 'text-yellow-600'
  if (band >= 6.5) return 'text-green-600'
  if (band >= 6) return 'text-emerald-600'
  if (band >= 5.5) return 'text-blue-600'
  return 'text-gray-600'
}

// Timer hook
function useTimer(seconds, onExpire) {
  const [remaining, setRemaining] = useState(seconds)
  const ref = useRef(null)

  useEffect(() => {
    setRemaining(seconds)
  }, [seconds])

  useEffect(() => {
    if (remaining <= 0) { onExpire?.(); return }
    ref.current = setTimeout(() => setRemaining(r => r - 1), 1000)
    return () => clearTimeout(ref.current)
  }, [remaining])

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
  return { remaining, display: fmt(remaining), reset: (s) => setRemaining(s) }
}

// ── SECTION 1: LISTENING ─────────────────────────────────────────────────────

function ListeningSection({ exercise, questions, onComplete }) {
  const [answers, setAnswers] = useState({})
  const [ttsOn, setTtsOn] = useState(false)
  const ex = exercise
  const { remaining, display } = useTimer(480, () => handleSubmit())

  const handleSubmit = () => {
    stopSpeaking(); setTtsOn(false)
    let score = 0
    questions.forEach(item => {
      const q = item.qRef
      if (q.type === 'mcq') {
        if (answers[q.id] === q.correct) score++
      } else if (q.type === 'gap_fill' || q.type === 'form_completion') {
        const a = String(answers[q.id] || '').toLowerCase().trim()
        const ok = String(q.answer || '').toLowerCase().trim()
        if (a && a === ok) score++
      }
    })
    onComplete({ score, total: questions.length, answers })
  }

  const playTranscript = () => {
    if (ttsOn) { stopSpeaking(); setTtsOn(false); return }
    setTtsOn(true)
    const isDialogue = (ex.transcript.match(/^[A-Z][A-Za-z .'-]{0,24}:/gm) || []).length >= 2
    if (isDialogue) {
      speakDialogue(ex.transcript, { onEnd: () => setTtsOn(false), onError: () => setTtsOn(false) })
    } else {
      speak(ex.transcript, { rate: 0.9, onEnd: () => setTtsOn(false) })
    }
  }

  return (
    <div className="space-y-5 animate-fade-up">
      <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl px-4 py-3 border border-blue-100 dark:border-blue-800">
        <span className="font-bold text-blue-700 dark:text-blue-300 text-sm">🎧 Listening — {questions.length} câu</span>
        <div className={`flex items-center gap-1.5 font-mono font-bold text-sm px-3 py-1 rounded-xl transition-all ${remaining < 60 ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white animate-glow' : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'}`}>
          <Clock size={13} />{display}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{ex.title}</span>
          <button onClick={playTranscript}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${ttsOn ? 'bg-red-100 text-red-600' : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600'}`}>
            {ttsOn ? <VolumeX size={13} /> : <Volume2 size={13} />}
            {ttsOn ? 'Dừng' : 'Nghe'}
          </button>
        </div>
        <div className="p-4 max-h-48 overflow-y-auto">
          <pre className="text-xs text-gray-600 dark:text-gray-400 whitespace-pre-wrap font-sans leading-relaxed">{ex.transcript}</pre>
        </div>
      </div>

      <div className="space-y-3">
        {questions.map((item, idx) => {
          const q = item.qRef
          if (q.type === 'gap_fill' || q.type === 'form_completion') {
            return (
              <div key={q.id} className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
                <p className="text-[11px] uppercase font-semibold text-blue-600 dark:text-blue-300 mb-1">{q.type === 'gap_fill' ? 'Gap-fill' : 'Form completion'}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{q.instruction}</p>
                <p className="text-sm font-semibold text-gray-800 dark:text-white mb-2">{idx + 1}. {q.question}</p>
                <input type="text"
                  value={answers[q.id] || ''}
                  onChange={e => setAnswers(a => ({ ...a, [q.id]: e.target.value }))}
                  placeholder="Nhập câu trả lời..."
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:border-indigo-400" />
              </div>
            )
          }
          return (
            <div key={q.id} className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
              <p className="text-sm font-semibold text-gray-800 dark:text-white mb-3">{idx + 1}. {q.question}</p>
              <div className="space-y-1.5">
                {(q.options || []).map((opt, i) => (
                  <label key={i} className={`flex items-center gap-2.5 p-2 rounded-xl cursor-pointer transition-all ${answers[q.id] === i ? 'bg-indigo-50 dark:bg-indigo-900/30' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                    <input type="radio" name={`lmq${q.id}`}
                      checked={answers[q.id] === i}
                      onChange={() => setAnswers(a => ({ ...a, [q.id]: i }))}
                      className="accent-indigo-600" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <button onClick={handleSubmit}
        className="w-full py-3 bg-indigo-600 text-white rounded-2xl font-semibold hover:bg-indigo-700 flex items-center justify-center gap-2 transition-all">
        Nộp Listening <ChevronRight size={18} />
      </button>
    </div>
  )
}

// ── SECTION 2: READING ───────────────────────────────────────────────────────

function ReadingSection({ passage, items, onComplete }) {
  const [answers, setAnswers] = useState({})
  const { remaining, display } = useTimer(600, () => handleSubmit())

  const BoldText = ({ text }) => {
    const parts = text.split(/\*\*([^*]+)\*\*/g)
    return <>{parts.map((p, i) => i % 2 === 1 ? <strong key={i} className="font-semibold text-indigo-700 dark:text-indigo-300">{p}</strong> : p)}</>
  }

  const handleSubmit = () => {
    let score = 0
    items.forEach(item => {
      const q = item.qRef
      if (q.type === 'mcq' && answers[q.id] === q.correct) score++
      if (q.type === 'tfng' && answers[q.id]?.toLowerCase() === q.answer.toLowerCase()) score++
      if (q.type === 'sentence_completion' && answers[q.id]?.toLowerCase().trim() === q.answer.toLowerCase().trim()) score++
      if (q.type === 'matching_headings' && Number(answers[q.id]) === Number(q.answer)) score++
      if (q.type === 'matching_features' && Number(answers[q.id]) === Number(q.answer)) score++
    })
    onComplete({ score, total: items.length, answers })
  }

  return (
    <div className="space-y-5 animate-fade-up">
      <div className="flex items-center justify-between bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl px-4 py-3 border border-green-100 dark:border-green-800">
        <span className="font-bold text-green-700 dark:text-green-300 text-sm">📖 Reading — {items.length} câu</span>
        <div className={`flex items-center gap-1.5 font-mono font-bold text-sm px-3 py-1 rounded-xl transition-all ${remaining < 60 ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white animate-glow' : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'}`}>
          <Clock size={13} />{display}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 max-h-64 overflow-y-auto">
        <h4 className="font-bold text-gray-800 dark:text-white mb-2 text-sm">{passage.title}</h4>
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          <BoldText text={passage.passage} />
        </p>
      </div>

      <div className="space-y-3">
        {items.map((item, idx) => {
          const q = item.qRef
          return (
            <div key={q.id} className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
              {q.type === 'tfng' && (
                <>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white mb-3">{idx + 1}. "{q.statement}"</p>
                  <div className="flex gap-2">
                    {['True', 'False', 'Not Given'].map(opt => (
                      <label key={opt} className={`flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer border transition-all ${answers[q.id] === opt ? 'bg-indigo-50 border-indigo-300 dark:bg-indigo-900/30 dark:border-indigo-600' : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                        <input type="radio" name={`rmq${q.id}`}
                          checked={answers[q.id] === opt}
                          onChange={() => setAnswers(a => ({ ...a, [q.id]: opt }))}
                          className="accent-indigo-600" />
                        <span className="text-sm font-medium">{opt}</span>
                      </label>
                    ))}
                  </div>
                </>
              )}
              {q.type === 'mcq' && (
                <>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white mb-3">{idx + 1}. {q.question}</p>
                  <div className="space-y-1.5">
                    {q.options.map((opt, i) => (
                      <label key={i} className={`flex items-center gap-2.5 p-2 rounded-xl cursor-pointer transition-all ${answers[q.id] === i ? 'bg-indigo-50 dark:bg-indigo-900/30' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                        <input type="radio" name={`rmq${q.id}`}
                          checked={answers[q.id] === i}
                          onChange={() => setAnswers(a => ({ ...a, [q.id]: i }))}
                          className="accent-indigo-600" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{opt}</span>
                      </label>
                    ))}
                  </div>
                </>
              )}
              {q.type === 'sentence_completion' && (
                <>
                  <p className="text-xs text-gray-400 mb-1">{q.instruction}</p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white mb-2">{idx + 1}. {q.stem}</p>
                  <input type="text"
                    value={answers[q.id] || ''}
                    onChange={e => setAnswers(a => ({ ...a, [q.id]: e.target.value }))}
                    placeholder="Nhập câu trả lời..."
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:border-indigo-400" />
                </>
              )}
              {q.type === 'matching_headings' && (
                <>
                  <p className="text-[11px] uppercase font-semibold text-emerald-600 dark:text-emerald-400 mb-1">Matching headings</p>
                  <p className="text-xs text-gray-400 mb-1">{q.instruction}</p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white mb-3">{idx + 1}. {q.paragraphLabel}</p>
                  <div className="space-y-1.5">
                    {q.options.map((opt, i) => (
                      <label key={i} className={`flex items-center gap-2.5 p-2 rounded-xl cursor-pointer transition-all ${Number(answers[q.id]) === i ? 'bg-indigo-50 dark:bg-indigo-900/30' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                        <input type="radio" name={`mhq${q.id}`}
                          checked={Number(answers[q.id]) === i}
                          onChange={() => setAnswers(a => ({ ...a, [q.id]: i }))}
                          className="accent-indigo-600" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{opt}</span>
                      </label>
                    ))}
                  </div>
                </>
              )}
              {q.type === 'matching_features' && (
                <>
                  <p className="text-[11px] uppercase font-semibold text-emerald-600 dark:text-emerald-400 mb-1">Matching features</p>
                  <p className="text-xs text-gray-400 mb-1">{q.instruction}</p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-white mb-3">{idx + 1}. {q.question}</p>
                  <div className="space-y-1.5">
                    {q.options.map((opt, i) => (
                      <label key={i} className={`flex items-center gap-2.5 p-2 rounded-xl cursor-pointer transition-all ${Number(answers[q.id]) === i ? 'bg-indigo-50 dark:bg-indigo-900/30' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                        <input type="radio" name={`mfq${q.id}`}
                          checked={Number(answers[q.id]) === i}
                          onChange={() => setAnswers(a => ({ ...a, [q.id]: i }))}
                          className="accent-indigo-600" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{opt}</span>
                      </label>
                    ))}
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>

      <button onClick={handleSubmit}
        className="w-full py-3 bg-green-600 text-white rounded-2xl font-semibold hover:bg-green-700 flex items-center justify-center gap-2 transition-all">
        Nộp Reading <ChevronRight size={18} />
      </button>
    </div>
  )
}

// ── SECTION 3: WRITING ───────────────────────────────────────────────────────

function WritingSection({ task1, task2, onComplete }) {
  const [text1, setText1] = useState('')
  const [text2, setText2] = useState('')
  const [showSample1, setShowSample1] = useState(false)
  const [showSample2, setShowSample2] = useState(false)
  const { remaining, display } = useTimer(1200, () => handleSubmit())

  const wc = (t) => (t.trim() ? t.trim().split(/\s+/).length : 0)

  const handleSubmit = () => {
    // Score both tasks with the real heuristic scorer.
    const r1 = scoreWriting(text1, { minWords: 150, taskNo: 1 })
    const r2 = scoreWriting(text2, { minWords: 250, taskNo: 2 })
    // IELTS weights Task 2 twice as heavily as Task 1.
    const hasText = r1.overall > 0 || r2.overall > 0
    const band = hasText
      ? (r1.overall * 1 + r2.overall * 2) / 3
      : 0
    onComplete({
      band,                       // real estimated writing band (0 if blank)
      score: Math.round(band * 10),
      total: 90,
      detail: { task1: r1, task2: r2 },
    })
  }

  return (
    <div className="space-y-5 animate-fade-up">
      <div className="flex items-center justify-between bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl px-4 py-3 border border-amber-100 dark:border-amber-800">
        <span className="font-bold text-amber-700 dark:text-amber-300 text-sm">✍️ Writing — Viết bài</span>
        <div className={`flex items-center gap-1.5 font-mono font-bold text-sm px-3 py-1 rounded-xl transition-all ${remaining < 120 ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white animate-glow' : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'}`}>
          <Clock size={13} />{display}
        </div>
      </div>

      <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-3 border border-amber-100 dark:border-amber-800">
        <p className="text-xs text-amber-700 dark:text-amber-300 flex items-start gap-1.5">
          <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
          Viết bài thật vào ô bên dưới. Khi nộp, hệ thống sẽ phân tích bài viết và ước tính band tự động (heuristic — tham khảo, không thay người chấm).
        </p>
      </div>

      {/* Task 1 */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 px-4 py-3 border-b border-gray-100 dark:border-gray-700">
          <span className="text-xs font-bold text-amber-700 dark:text-amber-300">{task1.emoji} Task 1 — {task1.typeVi}</span>
          <p className="text-sm font-semibold text-gray-800 dark:text-white mt-0.5">{task1.title}</p>
        </div>
        <div className="p-4 space-y-3">
          <p className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">{task1.prompt}</p>
          {task1.chartDescription && (
            <p className="text-xs text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 whitespace-pre-line">{task1.chartDescription}</p>
          )}
          <textarea
            value={text1}
            onChange={e => setText1(e.target.value)}
            placeholder="Viết bài Task 1 của bạn (tối thiểu 150 từ)..."
            className="w-full h-40 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:border-amber-400 resize-y"
          />
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold ${wc(text1) >= 150 ? 'text-green-600' : 'text-gray-500'}`}>{wc(text1)} / 150 từ</span>
            <button onClick={() => setShowSample1(v => !v)}
              className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
              {showSample1 ? '▲ Ẩn bài mẫu' : '▼ Xem bài mẫu'}
            </button>
          </div>
          {showSample1 && (
            <pre className="text-xs text-gray-600 dark:text-gray-400 whitespace-pre-wrap font-sans bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 max-h-40 overflow-y-auto">{task1.sampleAnswer}</pre>
          )}
        </div>
      </div>

      {/* Task 2 */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 px-4 py-3 border-b border-gray-100 dark:border-gray-700">
          <span className="text-xs font-bold text-amber-700 dark:text-amber-300">{task2.emoji} Task 2 — {task2.typeVi}</span>
          <p className="text-sm font-semibold text-gray-800 dark:text-white mt-0.5">{task2.title}</p>
        </div>
        <div className="p-4 space-y-3">
          <p className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">{task2.prompt}</p>
          <textarea
            value={text2}
            onChange={e => setText2(e.target.value)}
            placeholder="Viết bài Task 2 của bạn (tối thiểu 250 từ)..."
            className="w-full h-48 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:border-amber-400 resize-y"
          />
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold ${wc(text2) >= 250 ? 'text-green-600' : 'text-gray-500'}`}>{wc(text2)} / 250 từ</span>
            <button onClick={() => setShowSample2(v => !v)}
              className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
              {showSample2 ? '▲ Ẩn bài mẫu' : '▼ Xem bài mẫu'}
            </button>
          </div>
          {showSample2 && (
            <pre className="text-xs text-gray-600 dark:text-gray-400 whitespace-pre-wrap font-sans bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 max-h-40 overflow-y-auto">{task2.sampleAnswer}</pre>
          )}
        </div>
      </div>

      <button onClick={handleSubmit}
        className="w-full py-3 bg-amber-600 text-white rounded-2xl font-semibold hover:bg-amber-700 flex items-center justify-center gap-2 transition-all">
        Nộp Writing <ChevronRight size={18} />
      </button>
    </div>
  )
}

// ── SECTION 4: SPEAKING ──────────────────────────────────────────────────────

function SpeakingSection({ onComplete }) {
  // Pick a random item from each part once per mount (stable during the section).
  const [p1] = useState(() => speakingPart1[Math.floor(Math.random() * speakingPart1.length)])
  const [p2] = useState(() => speakingPart2[Math.floor(Math.random() * speakingPart2.length)])
  const [p3] = useState(() => speakingPart3[Math.floor(Math.random() * speakingPart3.length)])

  const [phase, setPhase] = useState('p1')
  const [showSample, setShowSample] = useState(false)
  const [ttsOn, setTtsOn] = useState(false)
  const [practiced, setPracticed] = useState({ p1: false, p2: false, p3: false })

  const phaseItems = { p1, p2, p3 }
  const phaseLabels = { p1: 'Part 1', p2: 'Part 2', p3: 'Part 3' }

  const playAnswer = (text) => {
    if (ttsOn) { stopSpeaking(); setTtsOn(false); return }
    setTtsOn(true)
    speak(text, { rate: 0.85, onEnd: () => setTtsOn(false) })
  }

  const markPracticed = () => {
    setPracticed(prev => ({ ...prev, [phase]: true }))
    stopSpeaking(); setTtsOn(false); setShowSample(false)
    if (phase === 'p1') setPhase('p2')
    else if (phase === 'p2') setPhase('p3')
  }

  const handleFinish = () => {
    stopSpeaking()
    const score = Object.values(practiced).filter(Boolean).length
    onComplete({ score, total: 3 })
  }

  const current = phaseItems[phase]

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between bg-red-50 dark:bg-red-900/20 rounded-2xl px-4 py-3">
        <span className="font-bold text-red-700 dark:text-red-300 text-sm">🎤 Speaking — {phaseLabels[phase]}</span>
        <div className="flex gap-2">
          {['p1', 'p2', 'p3'].map(p => (
            <button key={p} onClick={() => { setPhase(p); setShowSample(false); stopSpeaking(); setTtsOn(false) }}
              className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all ${phase === p ? 'bg-red-600 text-white' : 'bg-red-100 text-red-600'}`}>
              {practiced[p] ? '✓' : phaseLabels[p].split(' ')[1]}
            </button>
          ))}
        </div>
      </div>

      {phase === 'p1' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 space-y-3">
          <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">{current.topic}</span>
          <p className="font-semibold text-gray-800 dark:text-white">{current.question}</p>
          <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-3">
            <p className="text-xs text-indigo-700 dark:text-indigo-300"><strong>Tip:</strong> {current.tip}</p>
          </div>
        </div>
      )}
      {phase === 'p2' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 space-y-3">
          <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">{current.topic}</span>
          <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-sans">{current.cueCard}</pre>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3">
            <p className="text-xs text-blue-700 dark:text-blue-300"><strong>Chuẩn bị:</strong> {current.preparationTip}</p>
          </div>
        </div>
      )}
      {phase === 'p3' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 space-y-3">
          <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">{current.topic}</span>
          <p className="font-semibold text-gray-800 dark:text-white">{current.question}</p>
        </div>
      )}

      <div className="flex gap-2">
        <button onClick={() => setShowSample(v => !v)}
          className="flex-1 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-200 transition-all">
          {showSample ? 'Ẩn bài mẫu' : 'Xem bài mẫu'}
        </button>
        <button onClick={() => playAnswer(current.sampleAnswer)}
          className={`px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-1.5 transition-all ${ttsOn ? 'bg-red-100 text-red-600' : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600'}`}>
          {ttsOn ? <VolumeX size={14} /> : <Volume2 size={14} />}
          {ttsOn ? 'Dừng' : 'Nghe'}
        </button>
      </div>

      {showSample && (
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-4">
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{current.sampleAnswer}</p>
          <div className="flex gap-1 flex-wrap mt-3">
            {current.keywords.map(kw => (
              <span key={kw} className="text-xs bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded">{kw}</span>
            ))}
          </div>
        </div>
      )}

      {!practiced[phase] ? (
        <button onClick={markPracticed}
          className="w-full py-3 bg-green-600 text-white rounded-2xl font-semibold hover:bg-green-700 flex items-center justify-center gap-2 transition-all">
          <CheckCircle size={16} /> Đã Luyện → {phase !== 'p3' ? 'Tiếp theo' : 'Xong Speaking'}
        </button>
      ) : (
        phase === 'p3' && (
          <button onClick={handleFinish}
            className="w-full py-3 bg-red-600 text-white rounded-2xl font-semibold hover:bg-red-700 flex items-center justify-center gap-2 transition-all">
            Nộp Speaking <ChevronRight size={18} />
          </button>
        )
      )}
    </div>
  )
}

// ── RESULTS ───────────────────────────────────────────────────────────────────

function Results({ results, onRetry, onDone }) {
  const { state, dispatch } = useApp()
  const xpEarned = 100
  const [saved, setSaved] = useState(false)

  const listenBand = bandFromRaw(results.listening.score, results.listening.total, LISTENING_BANDS)
  const readBand = bandFromRaw(results.reading.score, results.reading.total, READING_BANDS)
  const writeRatio = results.writing.total ? results.writing.score / results.writing.total : 0
  const speakRatio = results.speaking.total ? results.speaking.score / results.speaking.total : 0
  const writePct = Math.round(writeRatio * 100)
  const speakPct = Math.round(speakRatio * 100)
  // Writing now carries a real heuristic band; fall back to the ratio estimate.
  const writeBand = typeof results.writing.band === 'number'
    ? snapWritingBand(results.writing.band)
    : selfEstimatedBand(writeRatio)
  const speakBand = selfEstimatedBand(speakRatio)

  // Overall = average of ALL FOUR skills, rounded by the official IELTS rule.
  const overallBand = roundIELTSBand(
    (listenBand + readBand + writeBand + speakBand) / 4
  ).toFixed(1)

  const fmtBand = (b) => (b >= 9 ? '9.0' : b.toFixed(1))

  const saveXP = () => {
    if (saved) return
    const newXP = (state.xp || 0) + xpEarned
    const testRecord = {
      date: new Date().toISOString(),
      overallBand,
      listening: { score: results.listening.score, total: results.listening.total, band: fmtBand(listenBand) },
      reading: { score: results.reading.score, total: results.reading.total, band: fmtBand(readBand) },
      writing: { score: results.writing.score, total: results.writing.total, band: fmtBand(writeBand) },
      speaking: { score: results.speaking.score, total: results.speaking.total, band: fmtBand(speakBand) },
    }
    dispatch({
      type: 'LOAD_STATE',
      payload: {
        ...state,
        xp: newXP,
        level: calcLevel(newXP),
        currentStageId: getStageByXP(newXP).id,
        totalPoints: (state.totalPoints || 0) + xpEarned,
        mockTestHistory: [...(state.mockTestHistory || []), testRecord],
      },
    })
    setSaved(true)
  }

  useEffect(() => { saveXP() }, [])

  return (
    <div className="space-y-5 animate-fade-up">
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-200 animate-gradient-x rounded-3xl p-6 text-white text-center relative overflow-hidden">
        <div className="blob bg-pink-300/40 w-44 h-44 -top-12 -right-12" />
        <div className="blob bg-indigo-300/40 w-36 h-36 -bottom-12 -left-10 animate-float-slow" />
        <div className="relative">
          <Award size={40} className="mx-auto mb-2 opacity-90 animate-float" />
          <h2 className="text-2xl font-bold drop-shadow">Kết Quả Mock Test</h2>
          <div className="text-5xl font-bold mt-3 animate-count-up text-gradient">{overallBand}</div>
          <div className="text-indigo-100 text-sm">Estimated Overall Band</div>
          <div className="mt-3 bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 inline-flex items-center gap-2 text-sm">
            <Zap size={14} />+{xpEarned} XP đã nhận
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 text-center">
          <div className="text-2xl mb-1">🎧</div>
          <div className={`text-xl font-bold ${bandColor(listenBand)}`}>{fmtBand(listenBand)}</div>
          <div className="text-xs text-gray-500">Listening</div>
          <div className="text-xs text-gray-400 mt-0.5">{results.listening.score}/{results.listening.total} câu</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 text-center">
          <div className="text-2xl mb-1">📖</div>
          <div className={`text-xl font-bold ${bandColor(readBand)}`}>{fmtBand(readBand)}</div>
          <div className="text-xs text-gray-500">Reading</div>
          <div className="text-xs text-gray-400 mt-0.5">{results.reading.score}/{results.reading.total} câu</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 text-center">
          <div className="text-2xl mb-1">✍️</div>
          <div className={`text-xl font-bold ${bandColor(writeBand)}`}>{fmtBand(writeBand)}</div>
          <div className="text-xs text-gray-500">Writing</div>
          <div className="text-xs text-gray-400 mt-0.5">Chấm tự động</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 text-center">
          <div className="text-2xl mb-1">🎤</div>
          <div className={`text-xl font-bold ${bandColor(speakBand)}`}>{fmtBand(speakBand)}</div>
          <div className="text-xs text-gray-500">Speaking</div>
          <div className="text-xs text-gray-400 mt-0.5">Đã luyện {speakPct}%</div>
        </div>
      </div>

      <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-3 border border-amber-100 dark:border-amber-800">
        <p className="text-xs text-amber-700 dark:text-amber-300 flex items-start gap-1.5">
          <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
          Band Listening &amp; Reading được quy đổi theo bảng điểm IELTS chuẩn. Band Writing được <strong>chấm tự động bằng heuristic</strong> và Speaking là ước tính từ tự đánh giá — để biết band thật cần người chấm.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
        <h4 className="font-semibold text-gray-800 dark:text-white text-sm mb-3">Nhận Xét</h4>
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          {results.listening.score >= 4 && <p>✅ Listening tốt — tiếp tục luyện Section 3 & 4 khó hơn.</p>}
          {results.listening.score < 4 && <p>📌 Listening cần cải thiện — tập trung vào từ khóa và paraphrase.</p>}
          {results.reading.score >= 4 && <p>✅ Reading tốt — luyện thêm passages Band 6.5+.</p>}
          {results.reading.score < 4 && <p>📌 Reading cần cải thiện — đọc nhanh và skimming/scanning.</p>}
          {writePct >= 70 && <p>✅ Writing self-check cao — thực hành viết thật và tự chỉnh sửa.</p>}
          {writePct < 70 && <p>📌 Writing cần ôn lại structure và Academic vocabulary.</p>}
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={onRetry}
          className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-2xl font-semibold hover:bg-gray-200 flex items-center justify-center gap-2 transition-all">
          <RotateCcw size={16} /> Thi Lại
        </button>
        <button onClick={onDone}
          className="flex-1 py-3 bg-indigo-600 text-white rounded-2xl font-semibold hover:bg-indigo-700 transition-all">
          Về IELTS Hub
        </button>
      </div>
    </div>
  )
}

// ── INTRO ─────────────────────────────────────────────────────────────────────

function Intro({ onStart }) {
  const sections = [
    { icon: '🎧', name: 'Listening', desc: '5 MCQ · 8 phút', color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200' },
    { icon: '📖', name: 'Reading', desc: '5 câu hỏi · 10 phút', color: 'bg-green-50 dark:bg-green-900/20 border-green-200' },
    { icon: '✍️', name: 'Writing', desc: 'Tự đánh giá · 20 phút', color: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200' },
    { icon: '🎤', name: 'Speaking', desc: 'Part 1+2+3 · Tự luyện', color: 'bg-red-50 dark:bg-red-900/20 border-red-200' },
  ]
  return (
    <div className="space-y-6 animate-fade-up">
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-200 animate-gradient-x rounded-3xl p-6 text-white relative overflow-hidden">
        <div className="blob bg-pink-300/40 w-44 h-44 -top-12 -right-12" />
        <div className="blob bg-indigo-300/40 w-36 h-36 -bottom-12 -left-10 animate-float-slow" />
        <div className="relative flex items-center gap-3">
          <span className="text-4xl animate-float">📝</span>
          <div>
            <h1 className="text-2xl font-bold drop-shadow">Mock Test IELTS</h1>
            <p className="text-indigo-100 text-sm">Thi thử 4 kỹ năng · Ước tính Band Score</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {sections.map((s, i) => (
          <div key={s.name} style={{ animationDelay: `${i * 50}ms` }} className={`rounded-2xl p-4 border card-hover animate-fade-up ${s.color}`}>
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="font-semibold text-gray-800 dark:text-white text-sm">{s.name}</div>
            <div className="text-xs text-gray-500 mt-0.5">{s.desc}</div>
          </div>
        ))}
      </div>
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-4 border border-indigo-100 dark:border-indigo-800">
        <p className="text-sm text-indigo-700 dark:text-indigo-300">
          <strong>Lưu ý:</strong> Đây là phiên bản thi thử rút gọn. Mỗi section có timer, khi hết giờ sẽ tự động nộp. Sau khi hoàn thành sẽ nhận <strong>+100 XP</strong> và ước tính Band Score.
        </p>
      </div>
      <button onClick={onStart}
        className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-95 hover:scale-[1.01] text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg btn-shine">
        Bắt Đầu Thi <ChevronRight size={20} />
      </button>
    </div>
  )
}

// ── MAIN ──────────────────────────────────────────────────────────────────────

export default function MockTest({ onExit }) {
  const [stage, setStage] = useState('intro')
  const [results, setResults] = useState({})

  // Pick a fresh random set each attempt so retaking the test isn't identical.
  // Re-rolled whenever we return to the intro screen (reset).
  const [picks, setPicks] = useState(() => rollPicks())

  function rollPicks() {
    const rand = (arr) => Math.floor(Math.random() * arr.length)
    return {
      listening: rand(listeningExercises),
      reading: rand(readingPassages),
      task1: rand(writingTasks.task1),
      task2: rand(writingTasks.task2),
    }
  }

  const listenEx = listeningExercises[picks.listening]
  const readPassage = readingPassages[picks.reading]
  const listenQs = listenEx.questions.slice(0, 8).map(q => ({ qRef: q }))
  const readQs   = readPassage.questions.slice(0, 8).map(q => ({ qRef: q }))

  const reset = () => {
    setPicks(rollPicks())
    setStage('intro')
    setResults({})
  }

  return (
    <div className="max-w-2xl mx-auto">
      {stage === 'intro' && <Intro onStart={() => setStage('listening')} />}
      {stage === 'listening' && (
        <ListeningSection exercise={listenEx} questions={listenQs} onComplete={r => { setResults(prev => ({ ...prev, listening: r })); setStage('reading') }} />
      )}
      {stage === 'reading' && (
        <ReadingSection passage={readPassage} items={readQs} onComplete={r => { setResults(prev => ({ ...prev, reading: r })); setStage('writing') }} />
      )}
      {stage === 'writing' && (
        <WritingSection task1={writingTasks.task1[picks.task1]} task2={writingTasks.task2[picks.task2]} onComplete={r => { setResults(prev => ({ ...prev, writing: r })); setStage('speaking') }} />
      )}
      {stage === 'speaking' && (
        <SpeakingSection onComplete={r => { setResults(prev => ({ ...prev, speaking: r })); setStage('results') }} />
      )}
      {stage === 'results' && results.listening && results.reading && results.writing && results.speaking && (
        <Results results={results} onRetry={reset} onDone={onExit} />
      )}
    </div>
  )
}
