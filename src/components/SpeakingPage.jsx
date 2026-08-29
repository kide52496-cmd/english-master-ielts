import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { Mic, MicOff, Volume2, Award, Search, Filter, ChevronRight, CheckCircle, BookOpen, ArrowLeft, RotateCcw, Zap, Star, Target, Lightbulb, ChevronLeft, Clock, BarChart3, Headphones, Play, Pause, StopCircle, Settings, Volume1, VolumeX } from 'lucide-react'
import { speakingLessons } from '../data/speakingLessons'
import { speak, stopSpeaking, isSpeechSupported, isSpeechRecognitionSupported, createRecognition, compareTexts, getEnglishVoices } from '../utils/speech'
import { useApp } from '../context/AppContext'
import { Waveform, ProgressRing, MicLevelBar, PremiumStatCard } from './AudioVisuals'

const levelColors = {
  Beginner: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 border-green-200 dark:border-green-700',
  A1: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700',
  A2: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-700',
  B1: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 border-purple-200 dark:border-purple-700',
  'B1+': 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300 border-violet-200 dark:border-violet-700',
  'IELTS Foundation': 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 border-rose-200 dark:border-rose-700',
  'IELTS 5.0-6.0': 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 border-red-200 dark:border-red-700',
}

const levelBadge = (l) => `text-xs px-2 py-0.5 rounded-full font-semibold ${levelColors[l] || ''}`

const typeColors = {
  monologue: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300',
  dialogue: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  description: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300',
  opinion: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  narrative: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
  hypothetical: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
}

function useTTS() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [rate, setRate] = useState(0.85)
  const [voices, setVoices] = useState([])
  const [selectedVoice, setSelectedVoice] = useState('')
  const [volume, setVolume] = useState(1)
  const supported = isSpeechSupported()

  useEffect(() => {
    if (!supported) return
    const v = getEnglishVoices()
    setVoices(v)
    if (v.length > 0 && !selectedVoice) setSelectedVoice(v[0].name)
    const handler = () => { const nv = getEnglishVoices(); setVoices(nv) }
    window.speechSynthesis?.addEventListener?.('voiceschanged', handler)
    return () => window.speechSynthesis?.removeEventListener?.('voiceschanged', handler)
  }, [supported, selectedVoice])

  const play = useCallback((text, cb) => {
    if (!supported || !text) return
    speak(text, { rate, voice: selectedVoice, volume, onEnd: () => { setIsPlaying(false); cb?.() }, onError: () => setIsPlaying(false) })
    setIsPlaying(true)
  }, [rate, selectedVoice, volume, supported])

  const stop = useCallback(() => { stopSpeaking(); setIsPlaying(false) }, [])

  return { isPlaying, play, stop, rate, setRate, voices, selectedVoice, setSelectedVoice, volume, setVolume, supported }
}

function SpeakingLibrary({ lessons, onStart, completedSpeaking }) {
  const [search, setSearch] = useState('')
  const [levelFilter, setLevelFilter] = useState('all')
  const [topicFilter, setTopicFilter] = useState('all')

  const levels = useMemo(() => [...new Set(lessons.map(l => l.level))], [lessons])
  const topics = useMemo(() => [...new Set(lessons.map(l => l.topic))], [lessons])

  const filtered = lessons.filter(l => {
    if (levelFilter !== 'all' && l.level !== levelFilter) return false
    if (topicFilter !== 'all' && l.topic !== topicFilter) return false
    if (search) {
      const q = search.toLowerCase()
      if (!l.topic.toLowerCase().includes(q) && !l.prompt.toLowerCase().includes(q) && !l.level.toLowerCase().includes(q)) return false
    }
    return true
  })

  const totalXP = lessons.reduce((s, l) => s + l.xpReward, 0)
  const earnedXP = completedSpeaking.reduce((s, id) => {
    const l = lessons.find(x => x.id === id)
    return s + (l ? l.xpReward : 0)
  }, 0)

  return (
    <div className="space-y-5 animate-fade-up">
      <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-600 bg-200 animate-gradient-x rounded-3xl p-6 text-white relative overflow-hidden">
        <div className="blob bg-pink-300/40 w-40 h-40 -top-10 -right-10" />
        <div className="blob bg-rose-300/40 w-32 h-32 -bottom-10 -left-8 animate-float-slow" />
        <div className="relative flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Mic className="text-white" size={24} /> Luyện Nói
            </h1>
            <p className="text-sm text-rose-100 mt-1">Luyện phát âm và phản xạ tiếng Anh</p>
          </div>
          <div className="text-right text-xs text-rose-100 bg-white/15 px-4 py-2 rounded-2xl backdrop-blur-sm">
            <span className="font-bold text-white animate-count-up">{completedSpeaking.length}</span>/{lessons.length} bài<br />
            <span className="font-bold text-yellow-200">{earnedXP}</span>/{totalXP} XP
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[200px] card-hover">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text" placeholder="Tìm bài nói..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400"
          />
        </div>
        <select value={levelFilter} onChange={e => setLevelFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400 card-hover">
          <option value="all">All Levels</option>
          {levels.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
        <select value={topicFilter} onChange={e => setTopicFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-rose-400 card-hover">
          <option value="all">All Topics</option>
          {topics.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div className="space-y-2">
        {filtered.length === 0 ? (
          <p className="text-center text-gray-400 py-8 text-sm">Không tìm thấy bài nói nào</p>
        ) : filtered.map((lesson, idx) => {
          const done = completedSpeaking.includes(lesson.id)
          return (
            <button key={lesson.id} onClick={() => onStart(lesson)}
              style={{ animationDelay: `${idx * 24}ms` }}
              className={`w-full text-left p-4 rounded-2xl border transition-all animate-fade-up card-hover flex items-center gap-3 ${
                done
                  ? 'bg-rose-50 dark:bg-rose-900/10 border-rose-200 dark:border-rose-700'
                  : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700'
              }`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold shrink-0 ${
                done ? 'bg-gradient-to-br from-rose-500 to-pink-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
              }`}>{lesson.id}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-sm text-gray-800 dark:text-gray-200 truncate">{lesson.topic}</span>
                  <span className={levelBadge(lesson.level)}>{lesson.level}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${typeColors[lesson.type] || ''}`}>{lesson.type}</span>
                  {done && <CheckCircle size={14} className="text-green-500 shrink-0" />}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">{lesson.prompt}</p>
              </div>
              <ChevronRight size={16} className="text-gray-300 shrink-0 group-hover:text-rose-500" />
            </button>
          )
        })}
      </div>
    </div>
  )
}

function PracticeMode({ lesson, onBack, onComplete, dispatch, TTS }) {
  const { isPlaying, play, stop, rate, setRate, volume, setVolume, voices, selectedVoice, setSelectedVoice, supported } = TTS
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [score, setScore] = useState(null)
  const [history, setHistory] = useState([])
  const [showSuggestion, setShowSuggestion] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)
  const [showTips, setShowTips] = useState(false)
  const [recSupported] = useState(isSpeechRecognitionSupported)
  const recognitionRef = useRef(null)

  const handleListenPrompt = () => {
    stop()
    play(lesson.prompt)
  }

  const handleListenSample = () => {
    stop()
    play(lesson.sampleAnswer)
  }

  const handleRecord = () => {
    if (isRecording) {
      recognitionRef.current?.stop()
      setIsRecording(false)
      return
    }
    if (!recSupported) return
    const recognition = createRecognition()
    if (!recognition) return
    recognitionRef.current = recognition
    setTranscript('')
    setScore(null)
    setIsRecording(true)
    recognition.onresult = (event) => {
      const result = event.results[0][0].transcript
      setTranscript(result)
      const s = compareTexts(lesson.sampleAnswer, result)
      setScore(s)
      setHistory(h => [{ text: lesson.sampleAnswer, spoken: result, score: s }, ...h.slice(0, 19)])
    }
    recognition.onerror = () => setIsRecording(false)
    recognition.onend = () => setIsRecording(false)
    recognition.start()
  }

  const handleComplete = () => {
    dispatch({ type: 'COMPLETE_SPEAKING', lessonId: lesson.id, xp: lesson.xpReward })
    onComplete()
  }

  const scoreColor = score === null ? '' : score >= 80 ? 'text-green-600' : score >= 50 ? 'text-orange-500' : 'text-red-500'
  const scoreEmoji = score === null ? '' : score >= 90 ? '🏆' : score >= 75 ? '🎉' : score >= 50 ? '👍' : '💪'
  const bestScore = history.length > 0 ? Math.max(...history.map(h => h.score)) : 0
  const avgScore = history.length > 0 ? Math.round(history.reduce((s, h) => s + h.score, 0) / history.length) : 0

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <button onClick={onBack} className="flex items-center gap-1 text-sm text-gray-500 hover:text-rose-600 transition-colors">
        <ArrowLeft size={16} /> Quay lại thư viện
      </button>

      <div className="bg-gradient-to-br from-rose-500 via-pink-500 to-fuchsia-600 bg-200 animate-gradient-x rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="blob bg-pink-300/40 w-36 h-36 -top-8 -right-8" />
        <div className="blob bg-rose-300/40 w-28 h-28 -bottom-8 -left-8 animate-float-slow" />
        <div className="relative">
          <div className="flex items-center gap-2 text-sm opacity-80 mb-3 flex-wrap">
            <span className={levelBadge(lesson.level)}>{lesson.level}</span>
            <span>{lesson.topic}</span>
            <span className="opacity-60">· {lesson.type}</span>
          </div>
          <p className="text-lg font-bold leading-relaxed">{lesson.prompt}</p>
          <div className="flex flex-wrap gap-2 mt-4">
            <button onClick={handleListenPrompt}
              className="bg-white/20 hover:bg-white/30 hover:scale-105 px-3 py-1.5 rounded-xl text-xs transition-all flex items-center gap-1.5">
              {isPlaying ? <Pause size={12} /> : <Volume2 size={12} />} Đọc câu hỏi
            </button>
            <button onClick={handleListenSample}
              className="bg-white/20 hover:bg-white/30 hover:scale-105 px-3 py-1.5 rounded-xl text-xs transition-all flex items-center gap-1.5">
              <Headphones size={12} /> Nghe mẫu
            </button>
          </div>
        </div>
      </div>

      {supported && (
        <div className="flex items-center gap-3 flex-wrap bg-white dark:bg-gray-800 rounded-2xl p-3 border border-gray-100 dark:border-gray-700">
          <span className="text-xs text-gray-500">TTS:</span>
          <div className="flex items-center gap-1">
            <Volume1 size={12} className="text-gray-400" />
            <input type="range" min="0" max="1" step="0.1" value={volume} onChange={e => setVolume(Number(e.target.value))}
              className="w-16 h-1 accent-rose-500" />
            <VolumeX size={12} className="text-gray-400" />
          </div>
          <span className="text-xs text-gray-500">Tốc độ:</span>
          <div className="flex gap-1">
            {[0.75, 0.85, 1, 1.15].map(r => (
              <button key={r} onClick={() => setRate(r)}
                className={`px-2 py-0.5 rounded-lg text-xs font-medium transition-all ${rate === r ? 'bg-rose-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-rose-100'}`}>{r}x</button>
            ))}
          </div>
          {voices.length > 1 && (
            <select value={selectedVoice} onChange={e => setSelectedVoice(e.target.value)}
              className="text-xs px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300">
              {voices.map(v => <option key={v.name} value={v.name}>{v.name}</option>)}
            </select>
          )}
        </div>
      )}

      {lesson.vocabularyHints && lesson.vocabularyHints.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
          <p className="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-1"><Lightbulb size={12} /> Từ vựng gợi ý</p>
          <div className="flex flex-wrap gap-1.5">
            {lesson.vocabularyHints.map((w, i) => (
              <span key={i} className="px-2 py-0.5 bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300 rounded-lg text-xs font-medium">{w}</span>
            ))}
          </div>
        </div>
      )}

      <details open={showSuggestion} onToggle={e => setShowSuggestion(e.currentTarget.open)} className="bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-200 dark:border-amber-700">
        <summary className="px-4 py-3 cursor-pointer text-sm font-semibold text-amber-700 dark:text-amber-300 flex items-center gap-2">
          <Target size={14} /> Gợi ý trả lời
        </summary>
        <p className="px-4 pb-4 text-sm text-amber-800 dark:text-amber-200">{lesson.suggestion}</p>
      </details>

      <details open={showTips} onToggle={e => setShowTips(e.currentTarget.open)} className="bg-indigo-50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-200 dark:border-indigo-700">
        <summary className="px-4 py-3 cursor-pointer text-sm font-semibold text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
          <Lightbulb size={14} /> Tips & Phát âm
        </summary>
        <div className="px-4 pb-4 space-y-2">
          <p className="text-sm text-indigo-800 dark:text-indigo-200">{lesson.tips}</p>
          <p className="text-xs text-indigo-600 dark:text-indigo-400"><span className="font-semibold">Phát âm:</span> {lesson.pronunciationFocus}</p>
          <p className="text-xs text-indigo-600 dark:text-indigo-400"><span className="font-semibold">Ngữ pháp:</span> {lesson.grammarFocus}</p>
        </div>
      </details>

      <div className="text-center animate-fade-up">
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 max-w-md mx-auto">
          <Waveform active={isRecording} bars={28} color="from-rose-400 to-pink-500" className="mb-4" />
          <button onClick={handleRecord}
            className={`p-6 rounded-full text-white shadow-xl transition-all ${
              isRecording
                ? 'bg-red-500 hover:bg-red-600 recording-pulse'
                : recSupported ? 'bg-gradient-to-r from-rose-500 to-pink-600 hover:scale-105 btn-shine' : 'bg-gray-400 cursor-not-allowed'
            }`} disabled={!recSupported}>
            {isRecording ? <MicOff size={28} /> : <Mic size={28} />}
          </button>
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
            {!recSupported
              ? 'Trình duyệt không hỗ trợ ghi âm'
              : isRecording ? '🔴 Đang ghi âm... Nhấn để dừng' : 'Nhấn để bắt đầu nói'}
          </p>
          <div className="mt-3 px-4">
            <MicLevelBar active={isRecording} />
          </div>
        </div>
        {!recSupported && (
          <div className="mt-2 bg-amber-50 dark:bg-amber-900/20 rounded-xl p-3 text-xs text-amber-700 dark:text-amber-300">
            Hãy dùng Chrome để ghi âm. Bạn vẫn có thể nghe mẫu và luyện tập.
          </div>
        )}
      </div>

      {transcript && (
        <div className={`rounded-2xl p-4 border animate-slide-down ${
          (score ?? 0) >= 70
            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700'
            : 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700'
        }`}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Bạn đã nói:</p>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200 italic">"{transcript}"</p>
            </div>
            {score !== null && (
              <div className="flex-shrink-0">
                <ProgressRing
                  pct={score}
                  size={64}
                  stroke={6}
                  gradient={score >= 80 ? ['#10b981', '#059669'] : score >= 50 ? ['#f59e0b', '#ea580c'] : ['#ef4444', '#be123c']}
                >
                  <div className="text-center">
                    <div className={`text-base font-bold ${scoreColor}`}>{score}%</div>
                    <div className="text-sm">{scoreEmoji}</div>
                  </div>
                </ProgressRing>
              </div>
            )}
          </div>
          {score !== null && score < 100 && (
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Câu mẫu: "{lesson.sampleAnswer}"
            </p>
          )}
        </div>
      )}

      <div className="flex gap-3">
        <button onClick={() => { setShowAnswer(s => !s) }}
          className="flex-1 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:border-rose-300 hover:scale-[1.02] transition-all">
          {showAnswer ? 'Ẩn câu mẫu' : 'Xem câu mẫu'}
        </button>
        <button onClick={handleComplete}
          className="flex-1 py-3 bg-gradient-to-r from-rose-500 to-pink-600 hover:opacity-95 hover:scale-[1.02] rounded-2xl text-sm font-bold text-white transition-all flex items-center justify-center gap-1 btn-shine">
          <CheckCircle size={16} /> Hoàn thành (+{lesson.xpReward}XP)
        </button>
      </div>

      {showAnswer && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm">
          <p className="text-xs text-gray-400 mb-1">Câu mẫu:</p>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{lesson.sampleAnswer}</p>
          <button onClick={handleListenSample}
            className="mt-2 text-xs text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1">
            <Volume2 size={12} /> Nghe mẫu
          </button>
        </div>
      )}

      {history.length > 0 && (
        <>
          <div className="grid grid-cols-3 gap-3 animate-fade-up">
            <PremiumStatCard
              icon={<Award size={18} />}
              label="Lần luyện"
              value={history.length}
              sub={`mới nhất ${history[0]?.score}%`}
              color="from-rose-500 to-pink-500"
            />
            <PremiumStatCard
              icon="🏆"
              label="Cao nhất"
              value={`${bestScore}%`}
              sub={bestScore >= 90 ? 'xuất sắc' : bestScore >= 75 ? 'rất tốt' : 'tiến bộ tốt'}
              color="from-amber-500 to-orange-500"
            />
            <PremiumStatCard
              icon={<BarChart3 size={18} />}
              label="Trung bình"
              ring={avgScore}
              value={`${avgScore}%`}
              sub="qua các lần"
              color="from-indigo-500 to-purple-600"
            />
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 card-hover">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Award size={15} className="text-yellow-500" /> Lịch sử luyện tập
              </h3>
              <span className="text-xs text-gray-400">Cao nhất: {bestScore}% · TB: {avgScore}%</span>
            </div>
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {history.slice(0, 10).map((h, i) => (
                <div key={i} className="flex items-center justify-between text-xs gap-2 p-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <p className="text-gray-600 dark:text-gray-400 truncate flex-1">"{h.spoken}"</p>
                  <span className={`font-bold flex-shrink-0 ${h.score >= 70 ? 'text-green-600' : h.score >= 50 ? 'text-orange-500' : 'text-red-500'}`}>
                    {h.score}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default function SpeakingPage() {
  const { state, dispatch } = useApp()
  const [view, setView] = useState('library')
  const [currentLesson, setCurrentLesson] = useState(null)
  const TTS = useTTS()

  const handleStart = (lesson) => {
    setCurrentLesson(lesson)
    setView('practice')
  }

  const handleBack = () => {
    setView('library')
    setCurrentLesson(null)
  }

  const handleComplete = () => {
    handleBack()
  }

  if (view === 'practice' && currentLesson) {
    return (
      <PracticeMode
        lesson={currentLesson}
        onBack={handleBack}
        onComplete={handleComplete}
        dispatch={dispatch}
        TTS={TTS}
      />
    )
  }

  return (
    <SpeakingLibrary
      lessons={speakingLessons}
      onStart={handleStart}
      completedSpeaking={state.completedSpeaking}
    />
  )
}
