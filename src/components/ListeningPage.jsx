import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { Headphones, Play, Pause, StopCircle, SkipForward, SkipBack, Settings, Volume2, Search, Filter, ChevronRight, CheckCircle, BookOpen, Mic, PenTool, Zap, ArrowLeft, RotateCcw, Clock, BarChart3, Star, Target, Bookmark, ChevronLeft, AlertTriangle, Lightbulb, Volume1, VolumeX } from 'lucide-react'
import { listeningScripts } from '../data/listeningScripts'
import { vocabulary } from '../data/vocabulary'
import { speak, stopSpeaking, isSpeechSupported, isSpeechRecognitionSupported, createRecognition, compareTexts, getEnglishVoices } from '../utils/speech'
import { useApp } from '../context/AppContext'
import { Waveform, ProgressRing, PremiumStatCard } from './AudioVisuals'

const levelColors = {
  Beginner: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 border-green-200 dark:border-green-700',
  A1: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700',
  A2: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-700',
  B1: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 border-purple-200 dark:border-purple-700',
  'B1+': 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300 border-violet-200 dark:border-violet-700',
  'IELTS': 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 border-red-200 dark:border-red-700',
}

const levelBadge = (l) => `text-xs px-2 py-0.5 rounded-full font-semibold ${levelColors[l] || ''}`

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

function DictationMode({ lesson, onBack }) {
  const { isPlaying, play, stop, rate, setRate, supported } = useTTS()
  const [currentSentenceIdx, setCurrentSentenceIdx] = useState(0)
  const [userInput, setUserInput] = useState('')
  const [results, setResults] = useState([])
  const [showAnswer, setShowAnswer] = useState(false)
  const inputRef = useRef(null)

  const sentences = lesson?.dictationSentences || []

  const currentSentence = sentences[currentSentenceIdx]

  const handlePlay = () => {
    if (!currentSentence) return
    play(currentSentence.english)
  }

  const handleCheck = () => {
    if (!userInput.trim() || !currentSentence) return
    const score = compareTexts(currentSentence.english, userInput)
    setResults(r => [...r, { idx: currentSentenceIdx, user: userInput, correct: currentSentence.english, score }])
    setUserInput('')
    setShowAnswer(false)
  }

  const handleNext = () => {
    if (currentSentenceIdx < sentences.length - 1) {
      setCurrentSentenceIdx(i => i + 1)
      setShowAnswer(false)
      inputRef.current?.focus()
    }
  }

  const handlePrev = () => {
    if (currentSentenceIdx > 0) {
      setCurrentSentenceIdx(i => i - 1)
      setShowAnswer(false)
    }
  }

  const totalScore = results.length > 0 ? Math.round(results.reduce((a, r) => a + r.score, 0) / results.length) : 0

  if (!supported) {
    return (
      <div className="text-center py-16">
        <p className="text-5xl mb-4">🔇</p>
        <h2 className="text-xl font-bold text-gray-700 dark:text-gray-300">Trinh duyet khong ho tro TTS</h2>
        <p className="text-gray-500 mt-2">Hay dung Chrome hoac Edge de luyen nghe</p>
      </div>
    )
  }

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 transition-colors">
        <ArrowLeft size={16} /> Quay lai
      </button>

      <div className="bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-600 bg-200 animate-gradient-x rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="blob bg-cyan-300/40 w-36 h-36 -top-8 -right-8" />
        <div className="blob bg-teal-300/40 w-28 h-28 -bottom-8 -left-8 animate-float-slow" />
        <div className="relative flex items-center gap-4">
          <ProgressRing pct={Math.round(((currentSentenceIdx + 1) / Math.max(1, sentences.length)) * 100)} size={64} stroke={6} gradient={['#ffffff', '#a7f3d0']}>
            <span className="text-xs font-bold text-white">{currentSentenceIdx + 1}/{sentences.length}</span>
          </ProgressRing>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold">Dictation - {lesson?.title}</h1>
            <p className="text-teal-100 text-sm mt-1">Nghe và gõ lại chính xác</p>
            <div className="flex items-center gap-4 mt-2 text-xs text-teal-100 flex-wrap">
              {results.length > 0 && (
                <span className="bg-white/20 px-2 py-0.5 rounded-full">Điểm TB: <b>{totalScore}%</b></span>
              )}
              <span className="bg-white/20 px-2 py-0.5 rounded-full">Đã làm: {results.length}</span>
            </div>
          </div>
        </div>
      </div>

      {sentences.length === 0 ? (
        <div className="text-center py-8 text-gray-400">Khong co cau luyen tap.</div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 card-hover animate-fade-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800 dark:text-gray-100">Câu {currentSentenceIdx + 1}</h3>
              <div className="flex items-center gap-2">
                <button onClick={handlePrev} disabled={currentSentenceIdx === 0} className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 disabled:opacity-30 hover:scale-105 transition-transform"><ChevronLeft size={14} /></button>
                <button onClick={() => { handlePlay() }} className="p-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-600 text-white hover:scale-105 transition-transform btn-shine">
                  {isPlaying ? <Pause size={16} /> : <Volume2 size={16} />}
                </button>
                <button onClick={handleNext} disabled={currentSentenceIdx >= sentences.length - 1} className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 disabled:opacity-30 hover:scale-105 transition-transform"><ChevronRight size={14} /></button>
              </div>
            </div>

            <button onClick={handlePlay} className="w-full text-left text-sm text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2 hover:text-teal-600 transition-colors">
              <RotateCcw size={12} /> Nghe lại
            </button>

            <textarea
              ref={inputRef}
              value={userInput}
              onChange={e => setUserInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleCheck() } }}
              placeholder="Gõ lại câu bạn vừa nghe..."
              className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl p-3 text-sm text-gray-700 dark:text-gray-200 outline-none resize-none h-20"
            />

            <div className="flex gap-2 mt-3">
              <button onClick={handleCheck} disabled={!userInput.trim()} className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50">
                Kiem tra
              </button>
              <button onClick={() => setShowAnswer(v => !v)} className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-4 py-2 rounded-xl text-sm hover:bg-gray-200 transition-colors">
                {showAnswer ? 'An dap an' : 'Hien dap an'}
              </button>
            </div>

            {showAnswer && (
              <div className="mt-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl p-3 text-sm text-amber-700 dark:text-amber-300">
                <span className="font-bold">Dap an: </span>{currentSentence?.english}
              </div>
            )}
          </div>

          {results.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2"><BarChart3 size={16} /> Ket qua</h3>
              <div className="space-y-2">
                {results.map((r, i) => (
                  <div key={i} className={`text-xs p-2 rounded-lg ${r.score >= 80 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : r.score >= 50 ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    <div className="font-semibold mb-1">#{i + 1}: {r.score}%</div>
                    <div>Ban go: &quot;{r.user}&quot;</div>
                    <div>Dung: &quot;{r.correct}&quot;</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
        <label className="text-xs text-gray-500 block mb-1">Toc do doc: <span className="font-bold text-teal-600">{rate.toFixed(2)}x</span></label>
        <input type="range" min="0.5" max="1.5" step="0.05" value={rate} onChange={e => setRate(Number(e.target.value))} className="w-full accent-teal-600" />
      </div>
    </div>
  )
}

function ShadowingMode({ lesson, onBack }) {
  const { isPlaying, play, stop, rate, setRate, supported } = useTTS()
  const [currentSentenceIdx, setCurrentSentenceIdx] = useState(0)
  const [recognition, setRecognition] = useState(null)
  const [recognitionResult, setRecognitionResult] = useState(null)
  const [isRecording, setIsRecording] = useState(false)
  const [shadowHistory, setShadowHistory] = useState([])
  const recoSupported = isSpeechRecognitionSupported()

  const sentences = lesson?.shadowingSentences || []
  const currentSentence = sentences[currentSentenceIdx]

  useEffect(() => {
    if (recoSupported) {
      const r = createRecognition()
      if (r) {
        r.onresult = (event) => {
          const transcript = event.results[0][0].transcript
          const score = compareTexts(currentSentence?.english || '', transcript)
          setRecognitionResult({ text: transcript, score })
          setIsRecording(false)
        }
        r.onerror = () => { setIsRecording(false) }
        r.onend = () => { setIsRecording(false) }
        setRecognition(r)
      }
    }
  }, [recoSupported, currentSentenceIdx])

  const handleRecord = () => {
    if (!recognition || !currentSentence) return
    setRecognitionResult(null)
    setIsRecording(true)
    try { recognition.start() } catch {}
  }

  const handleSaveResult = () => {
    if (!recognitionResult) return
    setShadowHistory(h => [...h, { idx: currentSentenceIdx, score: recognitionResult.score }])
    setRecognitionResult(null)
  }

  const handleNext = () => {
    if (currentSentenceIdx < sentences.length - 1) {
      setCurrentSentenceIdx(i => i + 1)
      setRecognitionResult(null)
    }
  }

  if (!supported) {
    return (
      <div className="text-center py-16">
        <p className="text-5xl mb-4">🔇</p>
        <h2 className="text-xl font-bold text-gray-700 dark:text-gray-300">Trinh duyet khong ho tro TTS</h2>
      </div>
    )
  }

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 transition-colors">
        <ArrowLeft size={16} /> Quay lai
      </button>

      <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl p-6 text-white">
        <h1 className="text-xl font-bold">Shadowing - {lesson?.title}</h1>
        <p className="text-purple-100 text-sm mt-1">Nghe mau va doc theo</p>
        <span className="text-xs text-purple-200">Cau {currentSentenceIdx + 1}/{sentences.length}</span>
      </div>

      {sentences.length === 0 ? (
        <div className="text-center py-8 text-gray-400">Khong co cau luyen tap.</div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-4">
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{currentSentence?.english}</p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button onClick={() => play(currentSentence?.english)} className="flex items-center gap-1.5 bg-teal-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-teal-700 transition-colors">
                <Volume2 size={14} /> Nghe mau
              </button>

              {recoSupported ? (
                <button onClick={handleRecord} disabled={isRecording} className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${isRecording ? 'bg-red-500 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}>
                  <Mic size={14} /> {isRecording ? 'Dang thu...' : 'Doc theo'}
                </button>
              ) : (
                <div className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 rounded-xl flex items-center gap-1.5">
                  <AlertTriangle size={12} /> Trinh duyet khong ho tro ghi am. Hay dung Chrome.
                </div>
              )}

              <button onClick={handleNext} disabled={currentSentenceIdx >= sentences.length - 1} className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-4 py-2 rounded-xl text-sm hover:bg-gray-200 transition-colors disabled:opacity-30">
                <SkipForward size={14} /> Tiep
              </button>
            </div>

            {recognitionResult && (
              <div className="mt-4 space-y-2">
                <div className={`p-3 rounded-xl text-sm ${recognitionResult.score >= 70 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300'}`}>
                  <div>Ban doc: &quot;{recognitionResult.text}&quot;</div>
                  <div className="font-bold mt-1">Do khop: {recognitionResult.score}%</div>
                </div>
                <button onClick={handleSaveResult} className="bg-indigo-600 text-white px-4 py-1.5 rounded-xl text-xs font-semibold hover:bg-indigo-700 transition-colors">
                  Luu ket qua
                </button>
              </div>
            )}
          </div>

          {shadowHistory.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-3">Lich su luyen tap</h3>
              <div className="space-y-1">
                {shadowHistory.map((h, i) => (
                  <div key={i} className="text-xs text-gray-500 dark:text-gray-400 flex justify-between">
                    <span>Cau #{h.idx + 1}</span>
                    <span className={h.score >= 70 ? 'text-green-600' : 'text-amber-600'}>{h.score}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
        <label className="text-xs text-gray-500 block mb-1">Toc do: <span className="font-bold text-teal-600">{rate.toFixed(2)}x</span></label>
        <input type="range" min="0.5" max="1.5" step="0.05" value={rate} onChange={e => setRate(Number(e.target.value))} className="w-full accent-teal-600" />
      </div>
    </div>
  )
}

function ListeningQuiz({ lesson, onComplete }) {
  const [answers, setAnswers] = useState({})
  const [checked, setChecked] = useState({})
  const [showResults, setShowResults] = useState(false)

  const questions = lesson?.questions || []

  const handleAnswer = (idx, val) => {
    if (checked[idx] || showResults) return
    setAnswers(a => ({ ...a, [idx]: val }))
  }

  const handleTF = (idx, val) => {
    if (checked[idx] || showResults) return
    setAnswers(a => ({ ...a, [idx]: val }))
  }

  const handleFB = (idx, val) => {
    if (checked[idx] || showResults) return
    setAnswers(a => ({ ...a, [idx]: val }))
  }

  const submitAll = () => {
    const nc = {}
    questions.forEach((q, i) => { if (answers[i] !== undefined) nc[i] = true })
    setChecked(nc)
    setShowResults(true)
    onComplete?.()
  }

  const correctCount = showResults ? questions.filter((q, i) => {
    if (q.type === 'truefalse') return answers[i] === q.correct
    if (q.type === 'fillblank') return answers[i]?.toLowerCase().trim() === q.correct?.toLowerCase().trim()
    return answers[i] === q.correct
  }).length : 0

  if (questions.length === 0) {
    return <div className="text-center py-8 text-gray-400">Chua co cau hoi.</div>
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
      <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
        <Zap size={16} /> Cau hoi bai nghe ({questions.length} cau)
      </h3>
      <div className="space-y-4">
        {questions.map((q, qi) => {
          const ans = answers[qi]
          const isChecked = checked[qi] || showResults
          let isCorrect = false
          if (isChecked) {
            if (q.type === 'truefalse') isCorrect = ans === q.correct
            else if (q.type === 'fillblank') isCorrect = ans?.toLowerCase().trim() === q.correct?.toLowerCase().trim()
            else isCorrect = ans === q.correct
          }
          let borderStyle = 'border-gray-200 dark:border-gray-600'
          if (isChecked) borderStyle = isCorrect ? 'border-green-400 dark:border-green-500' : 'border-red-400 dark:border-red-500'

          return (
            <div key={qi} className={`border rounded-xl p-3 ${borderStyle} transition-colors`}>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                {qi + 1}. {q.question}
                {q.type === 'truefalse' && <span className="text-xs text-gray-400 ml-2">(Dung/Sai)</span>}
                {q.type === 'fillblank' && <span className="text-xs text-gray-400 ml-2">(Dien tu)</span>}
              </p>
              {q.type === 'mcq' && q.options && (
                <div className="space-y-1.5">
                  {q.options.map((opt, oi) => {
                    let style = 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                    if (ans === oi) style = 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-400 text-indigo-800 dark:text-indigo-200'
                    if (isChecked) {
                      if (oi === q.correct) style = 'bg-green-50 dark:bg-green-900/30 border-green-400 text-green-800 dark:text-green-200'
                      else if (oi === ans && !isCorrect) style = 'bg-red-50 dark:bg-red-900/30 border-red-400 text-red-700 dark:text-red-300'
                      else if (oi !== q.correct) style = 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 text-gray-400'
                    }
                    return (
                      <button key={oi} onClick={() => handleAnswer(qi, oi)} className={`w-full text-left text-sm px-3 py-2 rounded-lg border transition-all ${style}`}>
                        {['A','B','C','D'][oi]}. {opt}
                      </button>
                    )
                  })}
                </div>
              )}
              {q.type === 'truefalse' && (
                <div className="flex gap-2">
                  {[true, false].map(val => (
                    <button key={String(val)} onClick={() => handleTF(qi, val)} className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${ans === val ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-400 text-indigo-800' : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 text-gray-600 dark:text-gray-300'}`}>
                      {val ? 'Dung' : 'Sai'}
                    </button>
                  ))}
                </div>
              )}
              {q.type === 'fillblank' && (
                <input
                  value={ans || ''}
                  onChange={e => handleFB(qi, e.target.value)}
                  placeholder="Nhap cau tra loi..."
                  className="w-full bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-200 outline-none"
                />
              )}
              {isChecked && (
                <p className={`mt-2 text-xs rounded-lg p-2 ${isCorrect ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300'}`}>
                  {isCorrect ? 'Dung! ' : 'Sai. '}{q.explanationVi || ''}
                </p>
              )}
            </div>
          )
        })}
      </div>
      {!showResults && (
        <button onClick={submitAll} disabled={Object.keys(answers).length === 0} className="mt-4 bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50">
          Kiem tra
        </button>
      )}
      {showResults && (
        <div className="mt-4 text-sm font-bold text-center">
          <span className={correctCount === questions.length ? 'text-green-600' : 'text-orange-600'}>
            {correctCount}/{questions.length} dung
          </span>
        </div>
      )}
    </div>
  )
}

function ListeningPractice({ lesson, onBack, onComplete }) {
  const { isPlaying, play, stop, rate, setRate, voices, selectedVoice, setSelectedVoice, volume, setVolume, supported } = useTTS()
  const [showTranscript, setShowTranscript] = useState(false)
  const [showTranslation, setShowTranslation] = useState(false)
  const [quizDone, setQuizDone] = useState(false)
  const [showQuiz, setShowQuiz] = useState(false)

  if (!supported) {
    return (
      <div className="text-center py-16">
        <p className="text-5xl mb-4">🔇</p>
        <h2 className="text-xl font-bold text-gray-700 dark:text-gray-300">Trinh duyet khong ho tro TTS</h2>
      </div>
    )
  }

  const handlePlayTranscript = () => {
    if (lesson?.transcript) play(lesson.transcript)
  }

  return (
    <div className="space-y-5 max-w-2xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 transition-colors">
        <ArrowLeft size={16} /> Quay lai danh sach
      </button>

      <div className="bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-600 bg-200 animate-gradient-x rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="blob bg-cyan-300/40 w-36 h-36 -top-8 -right-8" />
        <div className="blob bg-teal-300/40 w-28 h-28 -bottom-8 -left-8 animate-float-slow" />
        <div className="relative flex items-start gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className={levelBadge(lesson?.level)}>{lesson?.level}</span>
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{lesson?.topic}</span>
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{lesson?.type}</span>
            </div>
            <h1 className="text-2xl font-bold drop-shadow">{lesson?.title}</h1>
            <p className="text-teal-100 text-sm mt-1">{lesson?.titleVi}</p>
            <div className="flex items-center gap-4 mt-3 text-xs text-teal-100">
              <span className="flex items-center gap-1"><Clock size={12} /> {lesson?.estimatedMinutes} phút</span>
              <span className="flex items-center gap-1"><Zap size={12} /> {lesson?.xpReward} XP</span>
            </div>
          </div>
          <ProgressRing pct={isPlaying ? 80 : 0} size={68} stroke={6} gradient={['#ffffff', '#a7f3d0']}>
            <Headphones size={20} className="text-white" />
          </ProgressRing>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Nghe toàn bộ bài hội thoại</p>
        <Waveform active={isPlaying} bars={32} color="from-teal-400 to-cyan-500" className="mb-4" />
        <div className="flex items-center justify-center gap-4">
          <button onClick={handlePlayTranscript} className={`p-5 rounded-2xl text-white shadow-lg transition-all hover:scale-105 btn-shine ${isPlaying ? 'bg-red-500 hover:bg-red-600 animate-glow' : 'bg-gradient-to-r from-teal-500 to-cyan-600'}`}>
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>
          {isPlaying && (
            <button onClick={stop} className="p-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-500 hover:text-red-500 hover:scale-105 transition-all">
              <StopCircle size={20} />
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setShowTranscript(v => !v)} className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${showTranscript ? 'bg-teal-50 dark:bg-teal-900/30 border-teal-300 text-teal-700 dark:text-teal-300' : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300'}`}>
          <BookOpen size={14} className="inline mr-1" /> {showTranscript ? 'An transcript' : 'Hien transcript'}
        </button>
        <button onClick={() => setShowTranslation(v => !v)} className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${showTranslation ? 'bg-teal-50 dark:bg-teal-900/30 border-teal-300 text-teal-700 dark:text-teal-300' : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300'}`}>
          <BookOpen size={14} className="inline mr-1" /> {showTranslation ? 'An dich' : 'Hien dich'}
        </button>
        <button onClick={() => setShowQuiz(v => !v)} className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${showQuiz ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-300 text-indigo-700 dark:text-indigo-300' : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300'}`}>
          <Zap size={14} className="inline mr-1" /> Cau hoi
        </button>
      </div>

      {showTranscript && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
            <BookOpen size={14} /> Transcript
          </h3>
          <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed font-mono bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4">
            {lesson?.transcript}
          </div>
          {showTranslation && lesson?.vietnameseTranslation && (
            <div className="mt-3 text-sm text-teal-600 dark:text-teal-400 whitespace-pre-line leading-relaxed bg-teal-50 dark:bg-teal-900/20 rounded-xl p-4">
              {lesson.vietnameseTranslation}
            </div>
          )}
        </div>
      )}

      {lesson?.vocabularyFocus?.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2 text-amber-600">
            <Bookmark size={14} /> Tu vung trong bai
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {lesson.vocabularyFocus.map((w, i) => (
              <span key={i} className="text-xs bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 px-2 py-1 rounded-full border border-amber-200 dark:border-amber-700">{w}</span>
            ))}
          </div>
        </div>
      )}

      {showQuiz && <ListeningQuiz lesson={lesson} onComplete={() => { setQuizDone(true); onComplete?.() }} />}

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 space-y-3">
        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2"><Settings size={14} /> Cai dat</h3>
        <div>
          <label className="text-xs text-gray-500 block mb-1">Toc do: <span className="font-bold text-teal-600">{rate.toFixed(2)}x</span></label>
          <div className="flex gap-2">
            {[0.75, 0.85, 1, 1.15].map(v => (
              <button key={v} onClick={() => setRate(v)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${rate === v ? 'bg-teal-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>{v}x</button>
            ))}
          </div>
        </div>
        {voices.length > 0 && (
          <div>
            <label className="text-xs text-gray-500 block mb-1">Giong doc</label>
            <select value={selectedVoice} onChange={e => setSelectedVoice(e.target.value)} className="w-full text-xs bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-2 text-gray-700 dark:text-gray-300">
              {voices.map(v => <option key={v.name} value={v.name}>{v.name}</option>)}
            </select>
          </div>
        )}
      </div>
    </div>
  )
}

function DailyListening({ lessons, onStart }) {
  const { state } = useApp()
  const today = new Date().toDateString()

  const suggestion = useMemo(() => {
    const completed = state.completedListening || []
    const incomplete = lessons.filter(l => !completed.includes(l.id))
    if (incomplete.length === 0) return null
    const idx = Math.abs(today.split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % incomplete.length
    return incomplete[idx]
  }, [lessons, state.completedListening, today])

  if (!suggestion) return null

  return (
    <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-5 text-white">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-80 flex items-center gap-1"><Star size={12} /> Bai nghe hom nay</p>
          <h3 className="text-lg font-bold mt-1">{suggestion.title}</h3>
          <p className="text-sm opacity-80 mt-0.5">{suggestion.titleVi}</p>
        </div>
        <button onClick={() => onStart(suggestion)} className="bg-white text-orange-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-orange-50 transition-colors whitespace-nowrap">
          Bat dau
        </button>
      </div>
    </div>
  )
}

export default function ListeningPage() {
  const { state, dispatch } = useApp()
  const [page, setPage] = useState('library')
  const [selectedLesson, setSelectedLesson] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterLevel, setFilterLevel] = useState('All')
  const [filterTopic, setFilterTopic] = useState('All')
  const [filterType, setFilterType] = useState('All')

  const levels = useMemo(() => ['All', ...new Set(listeningScripts.map(l => l.level))], [])
  const topics = useMemo(() => ['All', ...new Set(listeningScripts.map(l => l.topic))], [])
  const types = useMemo(() => ['All', ...new Set(listeningScripts.map(l => l.type))], [])

  const filtered = useMemo(() => {
    let r = listeningScripts
    if (filterLevel !== 'All') r = r.filter(l => l.level === filterLevel)
    if (filterTopic !== 'All') r = r.filter(l => l.topic === filterTopic)
    if (filterType !== 'All') r = r.filter(l => l.type === filterType)
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase()
      r = r.filter(l => l.title.toLowerCase().includes(q) || l.titleVi.toLowerCase().includes(q))
    }
    return r
  }, [filterLevel, filterTopic, filterType, searchQuery])

  const completedCount = state.completedListening?.length || 0
  const totalCount = listeningScripts.length

  const handleComplete = (lesson) => {
    dispatch({ type: 'COMPLETE_LISTENING', lessonId: lesson.id, xp: lesson.xpReward })
  }

  if (page === 'practice') {
    return <ListeningPractice lesson={selectedLesson} onBack={() => { setPage('library'); setSelectedLesson(null) }} onComplete={() => handleComplete(selectedLesson)} />
  }

  if (page === 'dictation') {
    return <DictationMode lesson={selectedLesson} onBack={() => { setPage('library'); setSelectedLesson(null) }} />
  }

  if (page === 'shadowing') {
    return <ShadowingMode lesson={selectedLesson} onBack={() => { setPage('library'); setSelectedLesson(null) }} />
  }

  return (
    <div className="space-y-5">
      <div className="bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-600 bg-200 animate-gradient-x rounded-3xl p-6 text-white relative overflow-hidden">
        <div className="blob bg-cyan-300/40 w-40 h-40 -top-10 -right-10" />
        <div className="blob bg-teal-300/40 w-32 h-32 -bottom-10 -left-8 animate-float-slow" />
        <div className="relative flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Headphones className="text-white" size={24} /> Luyện Nghe
            </h1>
            <p className="text-sm text-cyan-100 mt-1">
              Đã học <span className="text-white font-bold">{completedCount}</span>/{totalCount} bài
            </p>
          </div>
          <div className="bg-white/15 rounded-2xl px-4 py-2 text-center backdrop-blur-sm">
            <div className="text-2xl font-bold text-white animate-count-up">{completedCount}</div>
            <div className="text-xs text-cyan-100">hoàn thành</div>
          </div>
        </div>
      </div>

      <DailyListening lessons={listeningScripts} onStart={(l) => { setSelectedLesson(l); setPage('practice') }} />

      <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-xl px-3 py-2 border border-gray-200 dark:border-gray-700 card-hover">
        <Search size={16} className="text-gray-400" />
        <input type="text" placeholder="Tìm bài nghe..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full bg-transparent text-sm text-gray-700 dark:text-gray-200 outline-none placeholder-gray-400" />
      </div>

      <div className="flex gap-2 flex-wrap">
        <select value={filterLevel} onChange={e => setFilterLevel(e.target.value)} className="px-3 py-2 rounded-xl text-sm font-semibold bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 outline-none card-hover">
          {levels.map(l => <option key={l} value={l}>{l === 'All' ? 'Tất cả trình độ' : l}</option>)}
        </select>
        <select value={filterTopic} onChange={e => setFilterTopic(e.target.value)} className="px-3 py-2 rounded-xl text-sm font-semibold bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 outline-none card-hover">
          {topics.map(t => <option key={t} value={t}>{t === 'All' ? 'Tất cả chủ đề' : t}</option>)}
        </select>
        <select value={filterType} onChange={e => setFilterType(e.target.value)} className="px-3 py-2 rounded-xl text-sm font-semibold bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 outline-none card-hover">
          {types.map(t => <option key={t} value={t}>{t === 'All' ? 'Tất cả loại' : t === 'ielts-section-1' ? 'IELTS Section 1' : t === 'ielts-section-2' ? 'IELTS Section 2' : t === 'ielts-section-3' ? 'IELTS Section 3' : t === 'ielts-section-4' ? 'IELTS Section 4' : t}</option>)}
        </select>
      </div>

      <div className="space-y-2">
        {filtered.length === 0 && <div className="text-center py-8 text-gray-400">Không tìm thấy bài nghe.</div>}
        {filtered.map((lesson, idx) => {
          const done = state.completedListening?.includes(lesson.id)
          return (
            <div key={lesson.id} style={{ animationDelay: `${idx * 24}ms` }} className={`rounded-2xl border transition-all animate-fade-up card-hover ${done ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700' : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-teal-200 dark:hover:border-teal-600'}`}>
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-gray-800 dark:text-gray-100 text-sm">{lesson.title}</span>
                      <span className={`text-xs font-bold px-1.5 py-0.5 rounded-md border ${levelColors[lesson.level]}`}>{lesson.level}</span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">{lesson.topic}</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{lesson.titleVi}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><Clock size={11} /> {lesson.estimatedMinutes}ph</span>
                      <span className="flex items-center gap-1"><Zap size={11} /> {lesson.xpReward}XP</span>
                      <span>{lesson.type}</span>
                      {done && <CheckCircle size={12} className="text-green-500" />}
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-gray-300 mt-1 flex-shrink-0" />
                </div>
                <div className="flex gap-1.5 mt-3 flex-wrap">
                  <button onClick={() => { setSelectedLesson(lesson); setPage('practice') }} className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:scale-105 transition-all btn-shine">
                    <Play size={11} className="inline mr-1" /> Nghe
                  </button>
                  <button onClick={() => { setSelectedLesson(lesson); setPage('dictation') }} className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-3 py-1.5 rounded-lg text-xs font-semibold hover:scale-105 transition-all">
                    <PenTool size={11} className="inline mr-1" /> Dictation
                  </button>
                  <button onClick={() => { setSelectedLesson(lesson); setPage('shadowing') }} className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-3 py-1.5 rounded-lg text-xs font-semibold hover:scale-105 transition-all">
                    <Mic size={11} className="inline mr-1" /> Shadowing
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
