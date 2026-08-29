import { useState, useCallback, useRef } from 'react'
import { allStories, storyTopics, storyLevels } from '../data/stories'
import { useApp } from '../context/AppContext'
import { speak, stopSpeaking } from '../utils/speech'
import { ProgressRing } from './AudioVisuals'
import {
  BookOpen, ChevronLeft, Search, Volume2, VolumeX,
  CheckCircle, Eye, EyeOff, Star, Clock, Tag, ChevronRight,
  RotateCcw, Trophy, X
} from 'lucide-react'

// ── Level badge colours ───────────────────────────────────────────────────
const levelMeta = {
  'Beginner':          { color: 'bg-lime-100 text-lime-700 dark:bg-lime-900/40 dark:text-lime-300',     dot: 'bg-lime-400' },
  'A1':                { color: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300', dot: 'bg-green-400' },
  'A2':                { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',     dot: 'bg-blue-400' },
  'B1':                { color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300', dot: 'bg-purple-400' },
  'B1+':               { color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300',     dot: 'bg-pink-400' },
  'IELTS Foundation':  { color: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',         dot: 'bg-red-400' },
  'IELTS 5.0-6.0':     { color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300', dot: 'bg-orange-400' },
}

const topicIcons = {
  'daily life': '🏠', 'school': '🏫', 'family': '👨‍👩‍👧‍👦',
  'food': '🍜', 'travel': '✈️', 'work': '💼',
  'health': '💪', 'technology': '📱', 'environment': '🌍',
  'IELTS study': '📝', 'education': '🎓', 'culture': '🎭',
  'sports': '⚽', 'science': '🔬', 'social media': '📱',
  'career': '🚀', 'society': '🤝', 'economy': '📊',
  'psychology': '🧠', 'media': '📺',
}

// ── Helpers ───────────────────────────────────────────────────────────────
// Bold words (**word**) → highlighted spans; track vocab focus words too.
// Every other word is also clickable to play the word with TTS, while
// preserving the original text exactly as written.
function parseText(text, vocabWords, onWordClick, onSpeakWord) {
  // Split out bold segments first
  const segments = []
  const boldRegex = /\*\*(.+?)\*\*/g
  let last = 0
  let m
  while ((m = boldRegex.exec(text)) !== null) {
    if (m.index > last) segments.push({ type: 'plain', content: text.slice(last, m.index) })
    segments.push({ type: 'bold', content: m[1] })
    last = m.index + m[0].length
  }
  if (last < text.length) segments.push({ type: 'plain', content: text.slice(last) })

  const out = []
  let key = 0

  // Tokenise plain segments into words and non-words while keeping spacing.
  const tokenize = (seg) => {
    // Match word characters incl. apostrophes; non-word chars kept verbatim.
    const re = /([A-Za-zÀ-ỹ][A-Za-zÀ-ỹ'’-]*)|([^A-Za-zÀ-ỹ]+)/g
    let mm
    while ((mm = re.exec(seg)) !== null) {
      if (mm[1]) {
        const word = mm[1]
        const lc = word.toLowerCase()
        const v = vocabWords?.find(x => x.word.toLowerCase() === lc)
        out.push(
          <span
            key={key++}
            onClick={() => onSpeakWord(word)}
            onContextMenu={(e) => {
              e.preventDefault()
              onWordClick(v || { word, vi: '', example: '' })
            }}
            className={`cursor-pointer rounded transition-colors hover:bg-indigo-100 dark:hover:bg-indigo-900/40 ${
              v ? 'font-bold text-indigo-600 dark:text-indigo-400 underline decoration-dotted underline-offset-2'
                : 'text-gray-800 dark:text-gray-200'
            }`}
            title="Click: đọc · Right click: xem nghĩa"
          >
            {word}
          </span>
        )
      } else if (mm[2]) {
        out.push(<span key={key++}>{mm[2]}</span>)
      }
    }
  }

  for (const s of segments) {
    if (s.type === 'plain') tokenize(s.content)
    else {
      const word = s.content
      const v = vocabWords?.find(x => x.word.toLowerCase() === word.toLowerCase())
      out.push(
        <button
          key={key++}
          onClick={() => onWordClick(v || { word, vi: '', example: '' })}
          onDoubleClick={() => onSpeakWord(word)}
          className="font-bold text-indigo-600 dark:text-indigo-400 underline decoration-dotted underline-offset-2 hover:text-indigo-800 dark:hover:text-indigo-200 transition-colors"
          title="Click: xem nghĩa · Double click: đọc"
        >
          {word}
        </button>
      )
    }
  }
  return out
}

// ── Vocab Popup ───────────────────────────────────────────────────────────
function VocabPopup({ entry, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative bg-white dark:bg-gray-800 rounded-3xl p-6 max-w-xs w-full shadow-2xl border border-gray-100 dark:border-gray-700"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
          <X size={16} className="text-gray-400" />
        </button>
        <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-1">{entry.word}</div>
        {entry.vi && <div className="text-gray-600 dark:text-gray-400 text-sm mb-3">🇻🇳 {entry.vi}</div>}
        {entry.example && (
          <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-xl p-3 text-sm text-gray-700 dark:text-gray-300 italic">
            "{entry.example}"
          </div>
        )}
        <button
          onClick={() => speak(entry.word)}
          className="mt-3 w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-2 text-sm font-semibold transition-colors"
        >
          <Volume2 size={14} /> Phát âm
        </button>
      </div>
    </div>
  )
}

// ── Story Card ────────────────────────────────────────────────────────────
function StoryCard({ story, isRead, onClick }) {
  const lm = levelMeta[story.level] || levelMeta['Beginner']
  return (
    <div
      onClick={onClick}
      className={`relative rounded-3xl border-2 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.01] overflow-hidden
        ${isRead
          ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
        }`}
    >
      {/* Illustration */}
      <div className="h-20 flex items-center justify-center text-5xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
        {story.illustrationEmoji}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-sm text-gray-800 dark:text-gray-100 leading-tight flex-1">{story.title}</h3>
          {isRead && <CheckCircle size={16} className="text-green-500 flex-shrink-0 mt-0.5" />}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{story.titleVi}</p>

        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${lm.color}`}>{story.level}</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
            {topicIcons[story.topic]} {story.topic}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-400">
          <span className="flex items-center gap-1"><Clock size={11} /> {story.estimatedMinutes} min</span>
          <span className="flex items-center gap-1 text-purple-500 font-bold"><Star size={11} /> +{story.xpReward} XP</span>
        </div>
      </div>
    </div>
  )
}

// ── Reading View ──────────────────────────────────────────────────────────
function ReadingView({ story, isRead, onBack, onComplete }) {
  const [showTrans, setShowTrans] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [popupEntry, setPopupEntry] = useState(null)
  const [phase, setPhase] = useState('read') // read | quiz | done
  const [shadPlaying, setShadPlaying] = useState(-1)
  const [quizAnswers, setQuizAnswers] = useState({})
  const [quizAnswered, setQuizAnswered] = useState({})
  const [quizScore, setQuizScore] = useState(0)
  const [readRate, setReadRate] = useState(0.9)

  const lm = levelMeta[story.level] || levelMeta['Beginner']

  const handleSpeak = () => {
    if (playing) {
      stopSpeaking()
      setPlaying(false)
    } else {
      const plain = story.englishText.replace(/\*\*/g, '')
      speak(plain, { rate: readRate, onEnd: () => setPlaying(false) })
      setPlaying(true)
    }
  }

  const speakWord = (w) => {
    stopSpeaking()
    speak(String(w || '').replace(/[^A-Za-zÀ-ỹ'’-]/g, ''), { rate: readRate })
  }

  const handleQuizAnswer = (qIdx, ansIdx) => {
    if (quizAnswered[qIdx] !== undefined) return
    const isCorrect = ansIdx === story.comprehensionQuestions[qIdx].correct
    setQuizAnswers(a => ({ ...a, [qIdx]: ansIdx }))
    setQuizAnswered(a => ({ ...a, [qIdx]: true }))
    if (isCorrect) setQuizScore(s => s + 1)
  }

  const handleFinishQuiz = () => {
    setPhase('done')
    if (!isRead) onComplete(quizScore)
  }

  const allAnswered = Object.keys(quizAnswered).length === story.comprehensionQuestions.length

  // Render paragraphs with highlighted vocab
  const paragraphs = story.englishText.split('\n\n')

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Back + header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 transition-colors"
        >
          <ChevronLeft size={18} />
        </button>
        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-gray-800 dark:text-gray-100 truncate">{story.title}</h2>
          <p className="text-xs text-gray-500">{story.titleVi}</p>
        </div>
        {isRead && <CheckCircle size={20} className="text-green-500 flex-shrink-0" />}
      </div>

      {/* Illustration + meta */}
      <div className="bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-50 dark:from-indigo-900/30 dark:via-purple-900/20 dark:to-pink-900/10 rounded-3xl p-8 text-center border border-indigo-100 dark:border-indigo-800">
        <div className="text-8xl mb-4 select-none">{story.illustrationEmoji}</div>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${lm.color}`}>{story.level}</span>
          <span className="text-xs px-3 py-1 rounded-full bg-white/70 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
            {topicIcons[story.topic]} {story.topic}
          </span>
          <span className="text-xs px-3 py-1 rounded-full bg-white/70 dark:bg-gray-700 text-gray-500 flex items-center gap-1">
            <Clock size={11} /> {story.estimatedMinutes} min
          </span>
          <span className="text-xs px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 font-bold flex items-center gap-1">
            <Star size={11} /> +{story.xpReward} XP
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-2 items-center">
        <button
          onClick={handleSpeak}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
            playing
              ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
              : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200'
          }`}
        >
          {playing ? <VolumeX size={15} /> : <Volume2 size={15} />}
          {playing ? 'Dừng' : 'Nghe bài'}
        </button>
        <button
          onClick={() => setShowTrans(t => !t)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
            showTrans
              ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
          }`}
        >
          {showTrans ? <EyeOff size={15} /> : <Eye size={15} />}
          {showTrans ? 'Ẩn dịch' : 'Xem dịch'}
        </button>
        <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-gray-100 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-300">
          <span>Tốc độ</span>
          <input
            type="range"
            min="0.6"
            max="1.2"
            step="0.05"
            value={readRate}
            onChange={e => setReadRate(Number(e.target.value))}
            className="accent-indigo-500"
          />
          <span className="font-mono">{readRate.toFixed(2)}x</span>
        </div>
      </div>

      {/* Article */}
      {phase === 'read' && (
        <>
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
            <p className="text-xs text-indigo-500 font-semibold uppercase tracking-wide mb-2">
              📖 Bấm 1 từ để nghe · Chuột phải hoặc bấm từ in đậm để xem nghĩa
            </p>
            {paragraphs.map((para, pi) => (
              <p key={pi} className="text-gray-800 dark:text-gray-200 leading-relaxed text-[15px]">
                {parseText(para, story.vocabularyFocus, setPopupEntry, speakWord)}
              </p>
            ))}
          </div>

          {showTrans && (
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-3xl p-6 border border-amber-200 dark:border-amber-800">
              <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold uppercase tracking-wide mb-3">
                🇻🇳 Bản dịch tiếng Việt
              </p>
              {story.vietnameseText.split('\n\n').map((para, pi) => (
                <p key={pi} className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm mb-3 last:mb-0">
                  {para}
                </p>
              ))}
            </div>
          )}

          {/* Vocabulary Focus */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
              <BookOpen size={16} className="text-indigo-500" /> Từ vựng trọng tâm
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {story.vocabularyFocus.map((v, i) => (
                <button
                  key={i}
                  onClick={() => setPopupEntry(v)}
                  className="flex items-center gap-2 text-left px-3 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors"
                >
                  <span className="font-bold text-indigo-600 dark:text-indigo-400 text-sm min-w-0 flex-shrink-0">{v.word}</span>
                  <span className="text-gray-500 dark:text-gray-400 text-xs truncate">— {v.vi}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Phrases */}
          {story.phrases?.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                <span className="text-lg">💬</span> Cụm từ hữu ích
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {story.phrases.map((p, i) => (
                  <div key={i} className="px-3 py-2 rounded-xl bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-800">
                    <div className="text-sm font-semibold text-teal-700 dark:text-teal-300">
                      {p.en || p}
                    </div>
                    <div className="text-xs text-teal-600 dark:text-teal-400 mt-0.5">
                      {p.vi || ''}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Shadowing Sentences */}
          {story.shadowingSentences?.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                <Volume2 size={16} className="text-rose-500" /> Shadowing — Luyện nói theo
              </h3>
              <div className="space-y-2">
                {story.shadowingSentences.map((s, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <button
                      onClick={() => {
                        if (shadPlaying === i) { stopSpeaking(); setShadPlaying(-1) }
                        else { stopSpeaking(); speak(typeof s === 'string' ? s : s.en || '', { onEnd: () => setShadPlaying(-1) }); setShadPlaying(i) }
                      }}
                      className={`flex-shrink-0 mt-0.5 w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold transition-all ${
                        shadPlaying === i
                          ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-rose-100 dark:hover:bg-rose-900/20'
                      }`}
                    >
                      {shadPlaying === i ? '⏹' : '▶'}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {typeof s === 'string' ? s : s.en}
                      </div>
                      {s.vi && <div className="text-xs text-gray-400 mt-0.5">{s.vi}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Grammar Focus */}
          {story.grammarFocus && (
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                <span className="text-lg">📐</span> Ngữ pháp trọng tâm
              </h3>
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-4 border border-amber-200 dark:border-amber-800">
                <div className="font-bold text-amber-800 dark:text-amber-300 text-sm mb-2">
                  {story.grammarFocus.point}
                </div>
                <div className="text-sm text-amber-700 dark:text-amber-400 leading-relaxed">
                  {story.grammarFocus.explanation}
                </div>
              </div>
            </div>
          )}

          <button
            onClick={() => setPhase('quiz')}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl py-4 font-bold text-base hover:opacity-90 transition-opacity shadow-md flex items-center justify-center gap-2"
          >
            Làm quiz đọc hiểu <ChevronRight size={18} />
          </button>
        </>
      )}

      {/* Quiz */}
      {phase === 'quiz' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
              🎯 Quiz đọc hiểu ({story.comprehensionQuestions.length} câu)
            </h3>
            <div className="space-y-5">
              {story.comprehensionQuestions.map((q, qi) => (
                <div key={qi}>
                  <p className="font-medium text-gray-800 dark:text-gray-100 text-sm mb-2">
                    {qi + 1}. {q.question}
                  </p>
                  <div className="space-y-1.5">
                    {q.options.map((opt, oi) => {
                      const answered = quizAnswered[qi] !== undefined
                      const isSelected = quizAnswers[qi] === oi
                      const isCorrect = q.correct === oi
                      let cls = 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-indigo-300'
                      if (answered) {
                        if (isCorrect) cls = 'bg-green-50 dark:bg-green-900/30 border-green-400 text-green-800 dark:text-green-200'
                        else if (isSelected) cls = 'bg-red-50 dark:bg-red-900/30 border-red-400 text-red-800 dark:text-red-200'
                        else cls = 'bg-gray-50 dark:bg-gray-700/30 border-gray-200 text-gray-400'
                      }
                      return (
                        <button
                          key={oi}
                          disabled={answered}
                          onClick={() => handleQuizAnswer(qi, oi)}
                          className={`w-full text-left px-3 py-2 rounded-xl border-2 text-sm transition-all ${cls}`}
                        >
                          <span className="font-bold mr-2">{['A','B','C','D'][oi]}.</span>{opt}
                          {answered && isCorrect && <span className="float-right text-green-500">✓</span>}
                          {answered && isSelected && !isCorrect && <span className="float-right text-red-500">✗</span>}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {allAnswered && (
            <button
              onClick={handleFinishQuiz}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl py-4 font-bold text-base hover:opacity-90 transition-opacity shadow-md flex items-center justify-center gap-2"
            >
              <Trophy size={18} /> Xem kết quả
            </button>
          )}
        </div>
      )}

      {/* Done */}
      {phase === 'done' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-8 text-white text-center shadow-xl">
            <div className="text-5xl mb-3">🎉</div>
            <div className="text-3xl font-bold mb-1">{quizScore}/{story.comprehensionQuestions.length}</div>
            <div className="opacity-80 text-lg">câu đúng</div>
            <div className="mt-4 text-xl font-bold">+{story.xpReward} XP đã được cộng!</div>
          </div>

          {/* Answer Explanations */}
          {story.answerExplanationVi && (
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                <CheckCircle size={16} className="text-green-500" /> Giải thích đáp án
              </h3>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-4 border border-green-200 dark:border-green-800">
                <p className="text-sm text-green-800 dark:text-green-300 leading-relaxed whitespace-pre-line">
                  {story.answerExplanationVi}
                </p>
              </div>
            </div>
          )}

          {/* Discussion Questions */}
          {story.discussionQuestions?.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                <span className="text-lg">🗣️</span> Câu hỏi thảo luận
              </h3>
              <div className="space-y-2">
                {story.discussionQuestions.map((q, i) => (
                  <div key={i} className="flex items-start gap-3 px-3 py-2.5 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800">
                    <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-purple-200 dark:bg-purple-700 text-xs font-bold text-purple-700 dark:text-purple-200">
                      {i + 1}
                    </span>
                    <p className="text-sm text-purple-800 dark:text-purple-300 leading-relaxed">{q}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={onBack}
            className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-2xl py-3 font-semibold flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
          >
            <ChevronLeft size={16} /> Quay lại danh sách
          </button>
        </div>
      )}

      {/* Word popup */}
      {popupEntry && <VocabPopup entry={popupEntry} onClose={() => setPopupEntry(null)} />}
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────
export default function StoryBook() {
  const { state, dispatch } = useApp()
  const [selectedLevel, setSelectedLevel] = useState('All')
  const [selectedTopic, setSelectedTopic] = useState('All')
  const [search, setSearch] = useState('')
  const [openStory, setOpenStory] = useState(null)

  const readStories = state.readStories || []

  const filtered = allStories.filter(s => {
    const matchLevel = selectedLevel === 'All' || s.level === selectedLevel
    const matchTopic = selectedTopic === 'All' || s.topic === selectedTopic
    const matchSearch = !search.trim() || s.title.toLowerCase().includes(search.toLowerCase()) || s.titleVi.toLowerCase().includes(search.toLowerCase())
    return matchLevel && matchTopic && matchSearch
  })

  const handleComplete = (quizScore) => {
    if (readStories.includes(openStory.id)) return
    dispatch({ type: 'MARK_LEARNED', key: 'readStories', id: openStory.id })
    dispatch({ type: 'ADD_XP', amount: openStory.xpReward })
  }

  if (openStory) {
    return (
      <ReadingView
        story={openStory}
        isRead={readStories.includes(openStory.id)}
        onBack={() => setOpenStory(null)}
        onComplete={handleComplete}
      />
    )
  }

  const totalRead = allStories.filter(s => readStories.includes(s.id)).length

  return (
    <div className="space-y-5 animate-fade-up">
      {/* Premium Header */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-600 bg-200 animate-gradient-x rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="blob bg-pink-300/40 w-44 h-44 -top-12 -right-12" />
        <div className="blob bg-indigo-300/40 w-36 h-36 -bottom-12 -left-10 animate-float-slow" />
        <div className="relative flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2 drop-shadow">
              <BookOpen size={26} className="animate-float" /> Story Book
            </h1>
            <p className="text-indigo-100 mt-1 text-sm">Học tiếng Anh qua ngữ cảnh thực tế</p>
            <div className="mt-3 flex items-center gap-2 flex-wrap text-xs">
              <span className="bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full">{filtered.length} hiển thị</span>
              <span className="bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full">{storyTopics?.length || 0} chủ đề</span>
              <span className="bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full">{storyLevels?.length || 0} cấp độ</span>
            </div>
          </div>
          <ProgressRing
            pct={allStories.length > 0 ? Math.round((totalRead / allStories.length) * 100) : 0}
            size={88} stroke={8} gradient={['#ffffff', '#fbcfe8']}>
            <div className="text-center">
              <div className="text-base font-extrabold animate-count-up">{totalRead}</div>
              <div className="text-[10px] uppercase tracking-wider text-indigo-100">/{allStories.length}</div>
            </div>
          </ProgressRing>
        </div>
        <div className="relative mt-4 bg-white/20 rounded-full h-2 overflow-hidden">
          <div
            className="bg-white rounded-full h-2 transition-all duration-700 progress-shine relative"
            style={{ width: `${(totalRead / allStories.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Search */}
      <div className="relative card-hover">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Tìm kiếm bài học..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm focus:outline-none focus:border-indigo-400 transition-colors"
        />
      </div>

      {/* Level filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {['All', ...storyLevels].map(lv => {
          const lm = levelMeta[lv]
          return (
            <button
              key={lv}
              onClick={() => setSelectedLevel(lv)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border-2 hover:scale-105
                ${selectedLevel === lv
                  ? lm ? `${lm.color} border-transparent shadow` : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-transparent shadow'
                  : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-indigo-300'
                }`}
            >
              {lv}
            </button>
          )
        })}
      </div>

      {/* Topic filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {['All', ...storyTopics].map(tp => (
          <button
            key={tp}
            onClick={() => setSelectedTopic(tp)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all border-2
              ${selectedTopic === tp
                ? 'bg-gray-800 dark:bg-white text-white dark:text-gray-800 border-transparent'
                : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-400'
              }`}
          >
            {topicIcons[tp] || '📁'} {tp === 'All' ? 'Tất cả' : tp}
          </button>
        ))}
      </div>

      {/* Count */}
      <p className="text-xs text-gray-400">{filtered.length} bài học</p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <BookOpen size={48} className="mx-auto mb-3 opacity-30" />
          <p>Không tìm thấy bài học phù hợp</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(s => (
            <StoryCard
              key={s.id}
              story={s}
              isRead={readStories.includes(s.id)}
              onClick={() => setOpenStory(s)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
