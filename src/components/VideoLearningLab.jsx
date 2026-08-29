import { useState, useMemo, useRef } from 'react'
import { demoLessons, VIDEO_LEVELS, VIDEO_TOPICS } from '../data/videoLessons'
import { parseTranscript, countWordFrequency, generateFillBlanks, normalizeAnswer } from '../utils/transcript'
import { useApp } from '../context/AppContext'
import { speak, stopSpeaking } from '../utils/speech'
import { ProgressRing, Waveform } from './AudioVisuals'
import {
  Play, Pause, ChevronLeft, ChevronRight, Volume2, VolumeX,
  BookOpen, Layers, CheckSquare, Headphones, Mic, Plus, Trash2,
  Upload, Eye, EyeOff, Check, X, RotateCcw, Trophy, Star,
  Clock, FileText, Search, Zap, Video,
} from 'lucide-react'

// ── Helpers ───────────────────────────────────────────────────────────────
function extractYouTubeId(url) {
  if (!url?.trim()) return ''
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  return m ? m[1] : (url.trim().length === 11 ? url.trim() : '')
}

function uid() {
  return `vl_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
}

const TABS = [
  { id: 'watch',      label: 'Watch',      Icon: Play },
  { id: 'vocab',      label: 'Vocabulary', Icon: BookOpen },
  { id: 'flashcards', label: 'Flashcards', Icon: Layers },
  { id: 'quiz',       label: 'Quiz',       Icon: CheckSquare },
  { id: 'dictation',  label: 'Dictation',  Icon: Headphones },
  { id: 'shadowing',  label: 'Shadowing',  Icon: Mic },
]

const levelColors = {
  'A1': 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  'A2': 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  'B1': 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  'B1+': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
  'IELTS Foundation': 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
}

// ── VideoPlayer ───────────────────────────────────────────────────────────
function VideoPlayer({ youtubeId, localUrl }) {
  if (youtubeId) {
    return (
      <iframe
        src={`https://www.youtube.com/embed/${youtubeId}?rel=0`}
        className="w-full aspect-video rounded-2xl bg-black"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Video player"
      />
    )
  }
  if (localUrl) {
    return <video src={localUrl} controls className="w-full rounded-2xl bg-black max-h-64 lg:max-h-none" />
  }
  return (
    <div className="w-full aspect-video rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 flex flex-col items-center justify-center text-gray-400 select-none">
      <Video size={48} className="mb-3 opacity-30" />
      <p className="text-sm font-medium">Thêm YouTube URL để xem video</p>
      <p className="text-xs mt-1 opacity-50">Transcript features work without video</p>
    </div>
  )
}

// ── WatchTab: transcript list ─────────────────────────────────────────────
function WatchTab({ segments }) {
  const [activeIdx, setActiveIdx] = useState(-1)
  const [playing, setPlaying] = useState(false)

  const playSegment = (idx) => {
    stopSpeaking()
    setActiveIdx(idx)
    setPlaying(true)
    speak(segments[idx].text, {
      rate: 0.85,
      onEnd: () => { setActiveIdx(-1); setPlaying(false) },
    })
  }

  if (!segments.length) {
    return (
      <div className="text-center py-12 text-gray-400">
        <FileText size={40} className="mx-auto mb-3 opacity-30" />
        <p className="text-sm">Chưa có transcript. Thêm transcript để bắt đầu.</p>
      </div>
    )
  }

  return (
    <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
      <p className="text-xs text-gray-400 mb-3">{segments.length} segments · Bấm để nghe từng câu</p>
      {segments.map((seg, i) => (
        <div
          key={i}
          onClick={() => playSegment(i)}
          className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all group
            ${activeIdx === i
              ? 'bg-indigo-100 dark:bg-indigo-900/40 border-2 border-indigo-400'
              : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 border-2 border-transparent'
            }`}
        >
          <Volume2 size={14} className={`flex-shrink-0 mt-0.5 ${activeIdx === i ? 'text-indigo-500' : 'text-gray-300 group-hover:text-indigo-400'}`} />
          <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{seg.text}</span>
        </div>
      ))}
    </div>
  )
}

// ── VocabTab: word frequency ──────────────────────────────────────────────
function VocabTab({ segments }) {
  const vocab = useMemo(() => countWordFrequency(segments).slice(0, 25), [segments])
  const max = vocab[0]?.count || 1

  if (!vocab.length) return <div className="text-center py-12 text-gray-400 text-sm">Không đủ dữ liệu transcript.</div>

  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-400">Top {vocab.length} từ xuất hiện nhiều nhất · Bấm để nghe phát âm</p>
      <div className="space-y-1.5 max-h-[55vh] overflow-y-auto pr-1">
        {vocab.map(({ word, count, example }, i) => (
          <div
            key={word}
            onClick={() => speak(word)}
            className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 cursor-pointer transition-all group"
          >
            <span className="w-5 text-xs text-gray-400 text-right flex-shrink-0">{i + 1}</span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400 min-w-[100px] text-sm">{word}</span>
            <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-indigo-400 to-purple-500 h-2 rounded-full"
                style={{ width: `${(count / max) * 100}%` }}
              />
            </div>
            <span className="text-xs text-gray-500 w-6 text-right">{count}×</span>
            <Volume2 size={13} className="text-gray-300 group-hover:text-indigo-400 flex-shrink-0" />
          </div>
        ))}
      </div>
      {vocab.length > 0 && vocab[0].example && (
        <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-3 text-xs text-gray-600 dark:text-gray-400 border border-indigo-100 dark:border-indigo-800">
          <span className="font-bold text-indigo-600">{vocab[0].word}</span> in context: "{vocab[0].example}"
        </div>
      )}
    </div>
  )
}

// ── FlashcardsTab ─────────────────────────────────────────────────────────
function FlashcardsTab({ segments }) {
  const cards = useMemo(() => countWordFrequency(segments).slice(0, 15), [segments])
  const [idx, setIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [known, setKnown] = useState(new Set())

  if (!cards.length) return <div className="text-center py-12 text-gray-400 text-sm">Không đủ từ vựng.</div>

  const card = cards[idx]
  const go = (dir) => {
    setIdx(i => Math.max(0, Math.min(cards.length - 1, i + dir)))
    setFlipped(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>{idx + 1} / {cards.length} cards</span>
        <span className="text-green-600 font-medium">{known.size} known</span>
      </div>

      {/* Card */}
      <div
        onClick={() => setFlipped(f => !f)}
        className={`w-full cursor-pointer rounded-3xl p-8 text-center min-h-[180px] flex flex-col items-center justify-center transition-all duration-300 border-2 select-none
          ${flipped
            ? 'bg-indigo-600 text-white border-indigo-500'
            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:border-indigo-300'
          }`}
      >
        {!flipped ? (
          <>
            <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">{card.word}</div>
            <p className="text-xs text-gray-400">Bấm để xem ví dụ</p>
          </>
        ) : (
          <>
            <div className="text-sm font-semibold text-indigo-100 mb-3">Appears {card.count}× in transcript</div>
            {card.example && (
              <p className="text-sm text-white/90 italic leading-relaxed">"{card.example}"</p>
            )}
          </>
        )}
      </div>

      <div className="flex gap-2">
        <button onClick={() => go(-1)} disabled={idx === 0} className="p-2 rounded-xl bg-gray-100 dark:bg-gray-700 disabled:opacity-30">
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={() => { speak(card.word) }}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-indigo-100 transition-colors"
        >
          <Volume2 size={14} /> Phát âm
        </button>
        <button
          onClick={() => { setKnown(s => { const n = new Set(s); n.has(idx) ? n.delete(idx) : n.add(idx); return n }); go(1) }}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-bold transition-colors ${
            known.has(idx)
              ? 'bg-green-100 dark:bg-green-900/30 text-green-700'
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          <Check size={14} /> {known.has(idx) ? 'Known' : 'I know this'}
        </button>
        <button onClick={() => go(1)} disabled={idx === cards.length - 1} className="p-2 rounded-xl bg-gray-100 dark:bg-gray-700 disabled:opacity-30">
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}

// ── QuizTab: fill-in-blank ────────────────────────────────────────────────
function QuizTab({ segments, lessonId, onComplete }) {
  const [genKey, setGenKey] = useState(0)
  const questions = useMemo(() => generateFillBlanks(segments, 6), [genKey, lessonId])
  const [answers, setAnswers] = useState({})
  const [checked, setChecked] = useState({})
  const [done, setDone] = useState(false)

  const score = Object.entries(checked).filter(([i]) => {
    const ans = normalizeAnswer(answers[i] || '')
    return ans === normalizeAnswer(questions[i]?.answer || '')
  }).length

  if (!questions.length) return <div className="text-center py-12 text-gray-400 text-sm">Transcript quá ngắn để tạo câu hỏi.</div>

  if (done) {
    return (
      <div className="text-center space-y-4 py-6">
        <div className="text-5xl mb-2">🎯</div>
        <div className="text-3xl font-bold text-indigo-600">{score}/{questions.length}</div>
        <p className="text-gray-500">câu đúng — {Math.round((score / questions.length) * 100)}%</p>
        <button
          onClick={() => { setGenKey(k => k + 1); setAnswers({}); setChecked({}); setDone(false) }}
          className="flex items-center gap-2 mx-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-colors"
        >
          <RotateCcw size={15} /> New Questions
        </button>
      </div>
    )
  }

  const allChecked = questions.length > 0 && questions.every((_, i) => checked[i] !== undefined)

  return (
    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
      <p className="text-xs text-gray-400">Điền từ còn thiếu vào chỗ trống</p>
      {questions.map((q, i) => {
        const isChecked = checked[i] !== undefined
        const isCorrect = isChecked && normalizeAnswer(answers[i] || '') === normalizeAnswer(q.answer)
        return (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">{q.blanked}</p>
            <div className="flex gap-2">
              <input
                type="text"
                disabled={isChecked}
                value={answers[i] || ''}
                onChange={e => setAnswers(a => ({ ...a, [i]: e.target.value }))}
                onKeyDown={e => { if (e.key === 'Enter' && !isChecked) setChecked(c => ({ ...c, [i]: true })) }}
                placeholder="Nhập từ..."
                className={`flex-1 px-3 py-2 rounded-xl border-2 text-sm bg-gray-50 dark:bg-gray-700 focus:outline-none transition-colors ${
                  isChecked
                    ? isCorrect
                      ? 'border-green-400 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200'
                      : 'border-red-400 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200'
                    : 'border-gray-200 dark:border-gray-600 focus:border-indigo-400'
                }`}
              />
              {!isChecked ? (
                <button
                  onClick={() => setChecked(c => ({ ...c, [i]: true }))}
                  className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-colors"
                >
                  Check
                </button>
              ) : (
                <span className={`px-3 py-2 rounded-xl text-sm font-bold ${isCorrect ? 'text-green-600' : 'text-red-500'}`}>
                  {isCorrect ? '✓' : `→ ${q.answer}`}
                </span>
              )}
            </div>
          </div>
        )
      })}
      {allChecked && (
        <button
          onClick={() => { onComplete(); setDone(true) }}
          className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          <Trophy size={16} /> Xem kết quả
        </button>
      )}
    </div>
  )
}

// ── DictationTab: listen & type ───────────────────────────────────────────
function DictationTab({ segments, onComplete }) {
  const [idx, setIdx] = useState(0)
  const [input, setInput] = useState('')
  const [result, setResult] = useState(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const inputRef = useRef(null)

  const seg = segments[idx]

  const playAudio = () => {
    stopSpeaking()
    if (seg) speak(seg.text, { rate: 0.75 })
  }

  const checkAnswer = () => {
    const normInput = normalizeAnswer(input)
    const normCorrect = normalizeAnswer(seg.text)
    const correct = normInput === normCorrect
    if (correct) setScore(s => s + 1)
    setResult({ correct, correct_text: seg.text })
  }

  const next = () => {
    if (idx >= segments.length - 1) {
      onComplete()
      setDone(true)
    } else {
      setIdx(i => i + 1)
      setInput('')
      setResult(null)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }

  const reset = () => { setIdx(0); setInput(''); setResult(null); setScore(0); setDone(false) }

  if (!segments.length) return <div className="text-center py-12 text-gray-400 text-sm">Không có transcript.</div>

  if (done) {
    return (
      <div className="text-center space-y-4 py-6">
        <div className="text-5xl mb-2">🎧</div>
        <div className="text-3xl font-bold text-indigo-600">{score}/{segments.length}</div>
        <p className="text-gray-500">câu chính xác hoàn toàn</p>
        <button onClick={reset} className="flex items-center gap-2 mx-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold">
          <RotateCcw size={15} /> Làm lại
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>Câu {idx + 1} / {segments.length}</span>
        <span className="text-green-600 font-medium">✓ {score} đúng</span>
      </div>
      <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl p-4 text-center border border-indigo-100 dark:border-indigo-800">
        <p className="text-sm text-indigo-600 dark:text-indigo-400 mb-3">Nghe rồi gõ lại câu bạn nghe được</p>
        <button
          onClick={playAudio}
          className="flex items-center gap-2 mx-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-sm transition-colors"
        >
          <Volume2 size={16} /> Nghe lại
        </button>
      </div>

      <textarea
        ref={inputRef}
        rows={3}
        disabled={!!result}
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Gõ câu bạn vừa nghe vào đây..."
        className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:border-indigo-400 resize-none transition-colors"
      />

      {!result ? (
        <button
          onClick={checkAnswer}
          disabled={!input.trim()}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-2xl font-bold transition-colors"
        >
          Kiểm tra
        </button>
      ) : (
        <div className="space-y-2">
          <div className={`rounded-2xl p-4 border-2 ${result.correct ? 'bg-green-50 dark:bg-green-900/20 border-green-400' : 'bg-red-50 dark:bg-red-900/20 border-red-400'}`}>
            {result.correct ? (
              <p className="text-green-700 dark:text-green-300 font-bold text-sm">✓ Chính xác!</p>
            ) : (
              <>
                <p className="text-red-600 dark:text-red-400 font-bold text-sm mb-2">✗ Chưa đúng. Đáp án:</p>
                <p className="text-gray-700 dark:text-gray-300 text-sm italic">"{result.correct_text}"</p>
              </>
            )}
          </div>
          <button onClick={next} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold transition-colors flex items-center justify-center gap-2">
            {idx >= segments.length - 1 ? <><Trophy size={16} /> Hoàn thành</> : <>Tiếp theo <ChevronRight size={16} /></>}
          </button>
        </div>
      )}
    </div>
  )
}

// ── ShadowingTab: listen & repeat ─────────────────────────────────────────
function ShadowingTab({ segments, onComplete }) {
  const [idx, setIdx] = useState(0)
  const [showText, setShowText] = useState(true)
  const [done, setDone] = useState(false)
  const [rate, setRate] = useState(0.85)

  const seg = segments[idx]

  const playAudio = () => {
    stopSpeaking()
    if (seg) speak(seg.text, { rate })
  }

  const next = () => {
    if (idx >= segments.length - 1) {
      onComplete()
      setDone(true)
    } else {
      setIdx(i => i + 1)
    }
  }

  if (!segments.length) return <div className="text-center py-12 text-gray-400 text-sm">Không có transcript.</div>

  if (done) {
    return (
      <div className="text-center space-y-4 py-6">
        <div className="text-5xl mb-2">🎤</div>
        <p className="font-bold text-indigo-600 text-xl">Shadowing hoàn thành!</p>
        <button onClick={() => { setIdx(0); setDone(false) }} className="flex items-center gap-2 mx-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold">
          <RotateCcw size={15} /> Làm lại
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>Câu {idx + 1} / {segments.length}</span>
        <button onClick={() => setShowText(t => !t)} className="flex items-center gap-1 text-indigo-500 hover:text-indigo-700">
          {showText ? <EyeOff size={13} /> : <Eye size={13} />}
          {showText ? 'Ẩn chữ' : 'Hiện chữ'}
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border-2 border-indigo-200 dark:border-indigo-800 min-h-[100px] flex items-center justify-center">
        {showText
          ? <p className="text-base text-gray-800 dark:text-gray-200 text-center leading-relaxed">{seg?.text}</p>
          : <p className="text-gray-400 italic text-sm">Chữ đã bị ẩn — hãy nhắc lại câu!</p>
        }
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-500 flex-shrink-0">Tốc độ:</span>
        <input
          type="range" min="0.5" max="1.2" step="0.05"
          value={rate}
          onChange={e => setRate(Number(e.target.value))}
          className="flex-1"
        />
        <span className="text-xs font-bold text-indigo-600 w-8">{rate.toFixed(2)}×</span>
      </div>

      <div className="flex gap-3">
        <button
          onClick={playAudio}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold transition-colors"
        >
          <Volume2 size={16} /> Nghe
        </button>
        <button
          onClick={next}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-2xl font-semibold hover:bg-gray-200 transition-colors"
        >
          {idx >= segments.length - 1 ? <><Trophy size={15} /> Xong</> : <>Tiếp <ChevronRight size={15} /></>}
        </button>
      </div>

      <p className="text-xs text-center text-gray-400">Nghe câu rồi nhắc lại, cố gắng bắt chước giọng điệu</p>
    </div>
  )
}

// ── LessonView: layout + tabs ─────────────────────────────────────────────
function LessonView({ lesson, segments, localUrl, onBack, onComplete, isCompleted }) {
  const [tab, setTab] = useState('watch')
  const [xpAwarded, setXpAwarded] = useState(isCompleted)

  const handleComplete = () => {
    if (!xpAwarded) {
      onComplete()
      setXpAwarded(true)
    }
  }

  const levelColor = levelColors[lesson.level] || levelColors['A2']

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-2 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 transition-colors">
          <ChevronLeft size={18} />
        </button>
        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-gray-800 dark:text-gray-100 text-base truncate">{lesson.title}</h2>
          <p className="text-xs text-gray-500">{lesson.titleVi}</p>
        </div>
        <div className="flex items-center gap-2">
          {isCompleted && <span className="text-xs text-green-600 font-bold">✓ Done</span>}
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${levelColor}`}>{lesson.level}</span>
        </div>
      </div>

      {/* Two-column layout on desktop */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Left: Video */}
        <div className="lg:sticky lg:top-20 space-y-3">
          <VideoPlayer youtubeId={lesson.youtubeId} localUrl={localUrl} />
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1"><Clock size={11} /> {lesson.duration}</span>
            <span className="flex items-center gap-1 text-purple-500 font-bold"><Star size={11} /> +{lesson.xpReward} XP</span>
            <span>{segments.length} segments</span>
          </div>
        </div>

        {/* Right: Tabs */}
        <div>
          {/* Tab bar */}
          <div className="flex gap-1 overflow-x-auto pb-1 mb-4 scrollbar-hide">
            {TABS.map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all
                  ${tab === id
                    ? 'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300'
                    : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
              >
                <Icon size={13} /> {label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
            {tab === 'watch'      && <WatchTab segments={segments} />}
            {tab === 'vocab'      && <VocabTab segments={segments} />}
            {tab === 'flashcards' && <FlashcardsTab segments={segments} />}
            {tab === 'quiz'       && <QuizTab segments={segments} lessonId={lesson.id} onComplete={handleComplete} />}
            {tab === 'dictation'  && <DictationTab segments={segments} onComplete={handleComplete} />}
            {tab === 'shadowing'  && <ShadowingTab segments={segments} onComplete={handleComplete} />}
          </div>

          {xpAwarded && (
            <div className="mt-3 bg-green-50 dark:bg-green-900/20 rounded-2xl px-4 py-3 flex items-center gap-2 border border-green-200 dark:border-green-800">
              <Zap size={16} className="text-green-500" />
              <p className="text-sm text-green-700 dark:text-green-300 font-semibold">+{lesson.xpReward} XP đã được cộng!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── AddLessonForm ─────────────────────────────────────────────────────────
function AddLessonForm({ onSave, onCancel, setLocalVideoUrls }) {
  const [form, setForm] = useState({ title: '', youtubeUrl: '', level: 'A2', topic: 'daily life', transcript: '' })
  const [localVideoFile, setLocalVideoFile] = useState(null)
  const [localVideoName, setLocalVideoName] = useState('')
  const [tempId] = useState(() => uid())
  const fileRef = useRef(null)
  const transcriptFileRef = useRef(null)

  const ytId = extractYouTubeId(form.youtubeUrl)

  const handleVideoFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setLocalVideoFile(file)
    setLocalVideoName(file.name)
  }

  const handleTranscriptFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setForm(f => ({ ...f, transcript: ev.target.result }))
    reader.readAsText(file)
  }

  const handleSave = () => {
    if (!form.title.trim() || !form.transcript.trim()) return
    const lesson = {
      id: tempId,
      title: form.title.trim(),
      titleVi: '',
      youtubeId: ytId,
      level: form.level,
      topic: form.topic,
      description: '',
      transcript: form.transcript.trim(),
      duration: '—',
      xpReward: 70,
      isDemo: false,
      createdAt: new Date().toISOString(),
    }
    if (localVideoFile) {
      const objUrl = URL.createObjectURL(localVideoFile)
      setLocalVideoUrls(prev => ({ ...prev, [tempId]: objUrl }))
    }
    onSave(lesson)
  }

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  return (
    <div className="max-w-lg mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={onCancel} className="p-2 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200">
          <ChevronLeft size={18} />
        </button>
        <h2 className="font-bold text-gray-800 dark:text-gray-100 text-lg">Thêm Bài Học Mới</h2>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 space-y-4 border border-gray-200 dark:border-gray-700 shadow-sm">
        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Tiêu đề *</label>
          <input
            type="text"
            value={form.title}
            onChange={e => set('title', e.target.value)}
            placeholder="Nhập tên bài học..."
            className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm focus:outline-none focus:border-indigo-400"
          />
        </div>

        {/* YouTube URL */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">YouTube URL (tuỳ chọn)</label>
          <input
            type="text"
            value={form.youtubeUrl}
            onChange={e => set('youtubeUrl', e.target.value)}
            placeholder="https://youtube.com/watch?v=... hoặc ID video"
            className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm focus:outline-none focus:border-indigo-400"
          />
          {ytId && <p className="text-xs text-green-600 mt-1">✓ Video ID: {ytId}</p>}
        </div>

        {/* Local video */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Video local (tuỳ chọn, chỉ lưu trong phiên)</label>
          <button
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 text-sm text-gray-500 hover:border-indigo-400 hover:text-indigo-500 transition-colors w-full"
          >
            <Upload size={15} /> {localVideoName || 'Chọn file .mp4 / .webm'}
          </button>
          <input ref={fileRef} type="file" accept="video/*" className="hidden" onChange={handleVideoFile} />
          {localVideoName && <p className="text-xs text-amber-600 mt-1">⚠ Video sẽ mất khi reload trang</p>}
        </div>

        {/* Level + Topic */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Level</label>
            <select
              value={form.level}
              onChange={e => set('level', e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm focus:outline-none focus:border-indigo-400"
            >
              {VIDEO_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Chủ đề</label>
            <select
              value={form.topic}
              onChange={e => set('topic', e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm focus:outline-none focus:border-indigo-400"
            >
              {VIDEO_TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        {/* Transcript */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Transcript * (SRT / VTT / plain text)</label>
            <button
              onClick={() => transcriptFileRef.current?.click()}
              className="flex items-center gap-1 text-xs text-indigo-500 hover:text-indigo-700"
            >
              <Upload size={12} /> Upload file
            </button>
            <input ref={transcriptFileRef} type="file" accept=".srt,.vtt,.txt" className="hidden" onChange={handleTranscriptFile} />
          </div>
          <textarea
            rows={7}
            value={form.transcript}
            onChange={e => set('transcript', e.target.value)}
            placeholder="Dán transcript vào đây (SRT, VTT, hoặc text thường)..."
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-xs font-mono focus:outline-none focus:border-indigo-400 resize-none"
          />
          {form.transcript.trim() && (
            <p className="text-xs text-green-600 mt-1">✓ {parseTranscript(form.transcript).length} segments detected</p>
          )}
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={onCancel} className="flex-1 py-3 rounded-2xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-200 transition-colors">
          Hủy
        </button>
        <button
          onClick={handleSave}
          disabled={!form.title.trim() || !form.transcript.trim()}
          className="flex-1 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold transition-colors"
        >
          Lưu bài học
        </button>
      </div>
    </div>
  )
}

// ── LibraryView ───────────────────────────────────────────────────────────
function LibraryView({ lessons, completedIds, onAdd, onOpen, onDelete }) {
  const [search, setSearch] = useState('')
  const filtered = lessons.filter(l =>
    !search.trim() || l.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-5 animate-fade-up">
      {/* Premium Header */}
      <div className="bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 bg-200 animate-gradient-x rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="blob bg-violet-300/40 w-44 h-44 -top-12 -right-12" />
        <div className="blob bg-indigo-300/40 w-36 h-36 -bottom-12 -left-10 animate-float-slow" />
        <div className="relative flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2 drop-shadow">
              <Video size={24} className="animate-float" /> Video Lab
            </h1>
            <p className="text-violet-100 mt-1 text-sm">Học tiếng Anh qua video + transcript</p>
            <div className="mt-3 flex items-center gap-2 flex-wrap text-xs">
              <span className="bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full">{filtered.length} hiển thị</span>
              <span className="bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full">{VIDEO_TOPICS?.length || 0} chủ đề</span>
              <span className="bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full">{VIDEO_LEVELS?.length || 0} cấp độ</span>
            </div>
          </div>
          <ProgressRing
            pct={lessons.length ? Math.round((completedIds.length / lessons.length) * 100) : 0}
            size={88} stroke={8} gradient={['#ffffff', '#c4b5fd']}>
            <div className="text-center">
              <div className="text-base font-extrabold animate-count-up">{completedIds.length}</div>
              <div className="text-[10px] uppercase tracking-wider text-violet-100">/{lessons.length}</div>
            </div>
          </ProgressRing>
        </div>
        <div className="relative mt-4 bg-white/20 rounded-full h-2 overflow-hidden">
          <div className="bg-white rounded-full h-2 transition-all duration-700 progress-shine relative" style={{ width: `${lessons.length ? (completedIds.length / lessons.length) * 100 : 0}%` }} />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <div className="relative flex-1 card-hover">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm bài học..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:border-indigo-400"
          />
        </div>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-500 to-indigo-600 hover:opacity-95 hover:scale-[1.02] text-white rounded-2xl font-semibold text-sm transition-all btn-shine"
        >
          <Plus size={16} /> Thêm
        </button>
      </div>

      {/* Lessons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((lesson, idx) => {
          const done = completedIds.includes(lesson.id)
          const lc = levelColors[lesson.level] || levelColors['A2']
          return (
            <div
              key={lesson.id}
              style={{ animationDelay: `${(idx % 12) * 30}ms` }}
              className={`relative rounded-3xl border-2 overflow-hidden card-hover animate-fade-up transition-all
                ${done
                  ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/10 border-green-300 dark:border-green-700'
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 cursor-pointer'
                }`}
            >
              {/* Top visual */}
              <div
                className="h-16 bg-gradient-to-br from-violet-500 via-indigo-500 to-blue-600 bg-200 animate-gradient-x flex items-center justify-center cursor-pointer"
                onClick={() => onOpen(lesson)}
              >
                <Video size={28} className="text-white/80" />
              </div>

              <div className="p-4 cursor-pointer" onClick={() => onOpen(lesson)}>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-bold text-sm text-gray-800 dark:text-gray-100 leading-tight flex-1">{lesson.title}</h3>
                  {done && <span className="text-green-500 text-xs font-bold flex-shrink-0">✓</span>}
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${lc}`}>{lesson.level}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500">{lesson.topic}</span>
                  {lesson.isDemo && <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600">Demo</span>}
                </div>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span className="flex items-center gap-1"><Clock size={11} /> {lesson.duration}</span>
                  <span className="flex items-center gap-1 text-purple-500 font-bold"><Star size={11} /> +{lesson.xpReward} XP</span>
                </div>
              </div>

              {!lesson.isDemo && (
                <button
                  onClick={e => { e.stopPropagation(); onDelete(lesson.id) }}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/80 dark:bg-gray-700/80 text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={13} />
                </button>
              )}
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <Video size={48} className="mx-auto mb-3 opacity-30" />
          <p>Không tìm thấy bài học</p>
        </div>
      )}
    </div>
  )
}

// ── Main export ───────────────────────────────────────────────────────────
export default function VideoLearningLab() {
  const { state, dispatch } = useApp()
  const [view, setView] = useState('library')
  const [activeLessonId, setActiveLessonId] = useState(null)
  const [localVideoUrls, setLocalVideoUrls] = useState({})

  const userLessons = state.videoLessons || []
  const userIds = new Set(userLessons.map(l => l.id))
  const allLessons = [...demoLessons.filter(d => !userIds.has(d.id)), ...userLessons]

  const activeLesson = allLessons.find(l => l.id === activeLessonId) || null
  const segments = useMemo(
    () => (activeLesson ? parseTranscript(activeLesson.transcript) : []),
    [activeLessonId, activeLesson?.transcript]
  )

  const completedIds = state.completedVideoLessons || []

  const handleSaveLesson = (lesson) => {
    dispatch({ type: 'LOAD_STATE', payload: { ...state, videoLessons: [...userLessons, lesson] } })
    setView('library')
  }

  const handleDeleteLesson = (id) => {
    dispatch({ type: 'LOAD_STATE', payload: { ...state, videoLessons: userLessons.filter(l => l.id !== id) } })
  }

  const handleComplete = () => {
    if (!activeLessonId || completedIds.includes(activeLessonId)) return
    const lesson = allLessons.find(l => l.id === activeLessonId)
    dispatch({ type: 'MARK_LEARNED', key: 'completedVideoLessons', id: activeLessonId })
    dispatch({ type: 'ADD_XP', amount: lesson?.xpReward || 0 })
  }

  if (view === 'add') {
    return (
      <AddLessonForm
        onSave={handleSaveLesson}
        onCancel={() => setView('library')}
        setLocalVideoUrls={setLocalVideoUrls}
      />
    )
  }

  if (view === 'lesson' && activeLesson) {
    return (
      <LessonView
        lesson={activeLesson}
        segments={segments}
        localUrl={localVideoUrls[activeLesson.id] || ''}
        onBack={() => setView('library')}
        onComplete={handleComplete}
        isCompleted={completedIds.includes(activeLesson.id)}
      />
    )
  }

  return (
    <LibraryView
      lessons={allLessons}
      completedIds={completedIds}
      onAdd={() => setView('add')}
      onOpen={lesson => { setActiveLessonId(lesson.id); setView('lesson') }}
      onDelete={handleDeleteLesson}
    />
  )
}
