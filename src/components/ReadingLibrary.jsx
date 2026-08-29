import { useState, useMemo, useEffect } from 'react'
import { BookOpen, Search, Volume2, ChevronRight, ArrowLeft, CheckCircle, Languages, Lightbulb, RotateCcw } from 'lucide-react'
import { readingLibrary, READING_LEVELS, READING_TOPICS, getReadingById } from '../data/readingLibrary'
import { useApp } from '../context/AppContext'
import { speak, stopSpeaking } from '../utils/speech'
import { ProgressRing } from './AudioVisuals'

// Vietnamese labels (unicode-escaped to keep this file ASCII-safe on disk)
const T = {
  title: '\u0110\u1ecdc Hi\u1ec3u',
  subtitle: 'Th\u01b0 vi\u1ec7n b\u00e0i \u0111\u1ecdc t\u1eeb Beginner \u0111\u1ebfn IELTS 6.0',
  done: '\u0111\u00e3 \u0111\u1ecdc',
  search: 'T\u00ecm b\u00e0i \u0111\u1ecdc...',
  allLevels: 'T\u1ea5t c\u1ea3 tr\u00ecnh \u0111\u1ed9',
  back: 'Quay l\u1ea1i th\u01b0 vi\u1ec7n',
  listen: 'Nghe b\u00e0i',
  stop: 'D\u1eebng',
  showVi: 'Hi\u1ec7n d\u1ecbch',
  hideVi: '\u1ea8n d\u1ecbch',
  keywords: 'T\u1eeb kh\u00f3a',
  questions: 'C\u00e2u h\u1ecfi \u0111\u1ecdc hi\u1ec3u',
  check: 'Ki\u1ec3m tra',
  retry: 'L\u00e0m l\u1ea1i',
  strategy: 'Chi\u1ebfn thu\u1eadt l\u00e0m b\u00e0i',
  correct: '\u0110\u00fang',
  answerIs: '\u0110\u00e1p \u00e1n',
  yourScore: '\u0110\u00fang',
  markDone: '\u0110\u00e1nh d\u1ea5u \u0111\u00e3 \u0111\u1ecdc',
  doneLabel: '\u0110\u00e3 \u0111\u1ecdc xong',
  enterAnswer: 'Nh\u1eadp c\u00e2u tr\u1ea3 l\u1eddi...',
  notFound: 'Kh\u00f4ng t\u00ecm th\u1ea5y b\u00e0i \u0111\u1ecdc n\u00e0o.',
  inputPlaceholder: 'Nh\u1eadp c\u00e2u tr\u1ea3 l\u1eddi...',
}

const TFNG_OPTS = ['True', 'False', 'Not Given']

const LEVEL_BADGE = {
  Beginner: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  A1: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  A2: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  B1: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  'B1+': 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  'IELTS Foundation': 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300',
  'IELTS 5.0': 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
  'IELTS 6.0': 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
}

function levelBadgeClass(level) {
  return 'text-xs px-2 py-0.5 rounded-full font-semibold ' + (LEVEL_BADGE[level] || 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300')
}

function PassageReader({ passage, onBack, isDone, onMarkDone }) {
  const [showVi, setShowVi] = useState(false)
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
    setShowVi(false)
    setAnswers({})
    setSubmitted(false)
    return () => { try { stopSpeaking() } catch {} }
  }, [passage.id])

  const questions = Array.isArray(passage.questions) ? passage.questions : []

  function answerOf(q) {
    if (q.type === 'tfng') return q.answer
    if (q.type === 'mcq') return q.options ? q.options[q.correct] : ''
    if (q.type === 'fill') return q.answer
    return ''
  }

  function isCorrect(q, idx) {
    const given = answers[idx]
    if (given === undefined || given === null || given === '') return false
    if (q.type === 'fill') {
      return String(given).trim().toLowerCase() === String(q.answer || '').trim().toLowerCase()
    }
    return String(given) === String(answerOf(q))
  }

  const score = submitted
    ? questions.reduce((acc, q, i) => acc + (isCorrect(q, i) ? 1 : 0), 0)
    : 0

  function handlePlay() {
    if (isPlaying) { try { stopSpeaking() } catch {}; setIsPlaying(false); return }
    setIsPlaying(true)
    speak(passage.passage, { rate: 0.9, onEnd: () => setIsPlaying(false), onError: () => setIsPlaying(false) })
  }

  return (
    <div className="space-y-5 max-w-3xl mx-auto animate-fade-in">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 transition-colors">
        <ArrowLeft size={16} /> {T.back}
      </button>

      <div className="bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-600 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className={levelBadgeClass(passage.level)}>{passage.level}</span>
          <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{passage.topic}</span>
          <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{passage.wordCount} từ</span>
        </div>
        <h1 className="text-2xl font-bold">{passage.title}</h1>
        <p className="text-cyan-100 text-sm mt-1">{passage.titleVi}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button onClick={handlePlay} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 text-white text-sm font-semibold hover:bg-cyan-700 transition-colors">
          <Volume2 size={16} /> {isPlaying ? T.stop : T.listen}
        </button>
        <button onClick={() => setShowVi(v => !v)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
          <Languages size={16} /> {showVi ? T.hideVi : T.showVi}
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="text-[15px] text-gray-800 dark:text-gray-100 leading-relaxed whitespace-pre-line">{passage.passage}</div>
        {showVi && (
          <div className="mt-4 pt-4 border-t border-dashed border-gray-200 dark:border-gray-600 text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
            {passage.translationVi}
          </div>
        )}
      </div>

      {Array.isArray(passage.keywords) && passage.keywords.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-3 text-sm">{T.keywords}</h3>
          <div className="flex flex-wrap gap-2">
            {passage.keywords.map((k, i) => (
              <span key={i} className="text-xs bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300 px-2.5 py-1 rounded-lg">
                <b>{k.word}</b> — {k.vi}
              </span>
            ))}
          </div>
        </div>
      )}

      {questions.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
            <CheckCircle size={16} /> {T.questions} <span className="text-xs font-normal text-gray-400">({questions.length})</span>
          </h3>
          <div className="space-y-4">
            {questions.map((q, qi) => {
              const given = answers[qi]
              const correct = isCorrect(q, qi)
              return (
                <div key={qi} className={`border rounded-xl p-3 transition-colors ${submitted ? (correct ? 'border-green-400 dark:border-green-600' : 'border-red-400 dark:border-red-600') : 'border-gray-200 dark:border-gray-600'}`}>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    {qi + 1}. {q.type === 'tfng' ? q.statement : q.question}
                  </p>

                  {q.type === 'mcq' && (
                    <div className="space-y-1.5">
                      {q.options.map((opt, oi) => {
                        let style = 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                        if (given === oi) style = 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-400 text-indigo-800 dark:text-indigo-200'
                        if (submitted) {
                          if (oi === q.correct) style = 'bg-green-50 dark:bg-green-900/30 border-green-400 text-green-800 dark:text-green-200'
                          else if (oi === given) style = 'bg-red-50 dark:bg-red-900/30 border-red-400 text-red-700 dark:text-red-300'
                        }
                        return (
                          <button key={oi} disabled={submitted} onClick={() => setAnswers(a => ({ ...a, [qi]: oi }))}
                            className={`w-full text-left text-sm px-3 py-2 rounded-lg border transition-all ${style}`}>
                            {['A', 'B', 'C', 'D'][oi]}. {opt}
                          </button>
                        )
                      })}
                    </div>
                  )}

                  {q.type === 'tfng' && (
                    <div className="flex flex-wrap gap-2">
                      {TFNG_OPTS.map(opt => {
                        let style = 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                        if (given === opt) style = 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-400 text-indigo-800 dark:text-indigo-200'
                        if (submitted) {
                          if (opt === q.answer) style = 'bg-green-50 dark:bg-green-900/30 border-green-400 text-green-800 dark:text-green-200'
                          else if (opt === given) style = 'bg-red-50 dark:bg-red-900/30 border-red-400 text-red-700 dark:text-red-300'
                        }
                        return (
                          <button key={opt} disabled={submitted} onClick={() => setAnswers(a => ({ ...a, [qi]: opt }))}
                            className={`text-sm px-3 py-2 rounded-lg border transition-all ${style}`}>
                            {opt}
                          </button>
                        )
                      })}
                    </div>
                  )}

                  {q.type === 'fill' && (
                    <input
                      type="text"
                      disabled={submitted}
                      value={given || ''}
                      onChange={e => setAnswers(a => ({ ...a, [qi]: e.target.value }))}
                      placeholder={T.enterAnswer}
                      className={`w-full bg-gray-50 dark:bg-gray-700/50 border rounded-lg px-3 py-2 text-sm outline-none ${submitted ? (correct ? 'border-green-400 text-green-700 dark:text-green-300' : 'border-red-400 text-red-700 dark:text-red-300') : 'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200'}`}
                    />
                  )}

                  {submitted && (
                    <div className={`mt-2 text-xs rounded-lg p-2 ${correct ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300'}`}>
                      <b>{correct ? T.correct : T.answerIs}: </b>
                      {q.type === 'fill' ? q.answer : (q.type === 'tfng' ? q.answer : q.options[q.correct])}
                      {q.explanationVi ? ' — ' + q.explanationVi : ''}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <div className="mt-4 flex items-center gap-3">
            {!submitted ? (
              <button onClick={() => setSubmitted(true)} disabled={Object.keys(answers).length === 0}
                className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50">
                {T.check}
              </button>
            ) : (
              <>
                <span className={`text-sm font-bold ${score === questions.length ? 'text-green-600' : 'text-orange-600'}`}>
                  {score}/{questions.length} {T.yourScore}
                </span>
                <button onClick={() => { setAnswers({}); setSubmitted(false) }}
                  className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-4 py-2 rounded-xl text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  <RotateCcw size={14} /> {T.retry}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {passage.strategyVi && (
        <div className="bg-amber-50 dark:bg-amber-900/10 rounded-2xl p-5 border border-amber-200 dark:border-amber-800">
          <h3 className="font-bold text-amber-700 dark:text-amber-300 mb-2 flex items-center gap-2 text-sm">
            <Lightbulb size={16} /> {T.strategy}
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{passage.strategyVi}</p>
        </div>
      )}

      <div className="pt-1">
        {isDone ? (
          <div className="text-center py-3 bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-200 dark:border-green-700 text-green-600 dark:text-green-300 font-bold flex items-center justify-center gap-2">
            <CheckCircle size={18} /> {T.doneLabel}
          </div>
        ) : (
          <button onClick={onMarkDone}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl py-3.5 font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-md">
            <CheckCircle size={18} /> {T.markDone} (+{passage.xpReward} XP)
          </button>
        )}
      </div>
    </div>
  )
}

const LEVEL_ORDER = ['Beginner', 'A1', 'A2', 'B1', 'B1+', 'IELTS Foundation', 'IELTS 5.0', 'IELTS 6.0']

export default function ReadingLibrary() {
  const { state, dispatch } = useApp()
  const [selectedId, setSelectedId] = useState(null)
  const [search, setSearch] = useState('')
  const [filterLevel, setFilterLevel] = useState('All')

  const readPassages = Array.isArray(state.readPassages) ? state.readPassages : []

  const levels = useMemo(() => {
    const present = [...new Set(readingLibrary.map(p => p.level))]
    return ['All', ...LEVEL_ORDER.filter(l => present.includes(l))]
  }, [])

  const filtered = useMemo(() => {
    let result = readingLibrary
    if (filterLevel !== 'All') result = result.filter(p => p.level === filterLevel)
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        (p.titleVi || '').toLowerCase().includes(q) ||
        (p.topic || '').toLowerCase().includes(q)
      )
    }
    const orderIdx = (lv) => { const i = LEVEL_ORDER.indexOf(lv); return i === -1 ? 99 : i }
    return [...result].sort((a, b) => orderIdx(a.level) - orderIdx(b.level))
  }, [search, filterLevel])

  if (selectedId) {
    const passage = getReadingById(selectedId)
    if (!passage) {
      return (
        <div className="text-center py-16 text-gray-400">
          {T.notFound}
          <div className="mt-4">
            <button onClick={() => setSelectedId(null)} className="text-indigo-600 text-sm">{T.back}</button>
          </div>
        </div>
      )
    }
    return (
      <PassageReader
        passage={passage}
        onBack={() => setSelectedId(null)}
        isDone={readPassages.includes(passage.id)}
        onMarkDone={() => {
          if (!readPassages.includes(passage.id)) {
            dispatch({ type: 'MARK_LEARNED', key: 'readPassages', id: passage.id })
            dispatch({ type: 'ADD_XP', amount: passage.xpReward || 20 })
          }
        }}
      />
    )
  }

  const doneCount = readPassages.length
  const total = readingLibrary.length

  return (
    <div className="space-y-5 animate-fade-up">
      <div className="bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-600 bg-200 animate-gradient-x rounded-3xl p-6 text-white relative overflow-hidden">
        <div className="blob bg-cyan-300/40 w-40 h-40 -top-10 -right-10" />
        <div className="blob bg-sky-300/40 w-32 h-32 -bottom-10 -left-8 animate-float-slow" />
        <div className="relative flex items-center gap-5 flex-wrap">
          <ProgressRing pct={total > 0 ? Math.round((doneCount / total) * 100) : 0} size={84} stroke={8} gradient={['#ffffff', '#bae6fd']}>
            <div className="text-center">
              <div className="text-base font-extrabold">{doneCount}</div>
              <div className="text-[10px] uppercase tracking-wider text-cyan-50">{T.done}</div>
            </div>
          </ProgressRing>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold flex items-center gap-2 drop-shadow">
              <BookOpen size={24} /> {T.title}
            </h1>
            <p className="text-sm text-cyan-50 mt-1">{T.subtitle}</p>
            <div className="mt-2 flex items-center gap-2 flex-wrap text-xs">
              <span className="bg-white/20 px-2 py-0.5 rounded-full">{total} bài đọc</span>
              <span className="bg-white/20 px-2 py-0.5 rounded-full">{levels.length - 1} cấp độ</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-xl px-3 py-2 border border-gray-200 dark:border-gray-700">
        <Search size={16} className="text-gray-400" />
        <input
          type="text"
          placeholder={T.search}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-transparent text-sm text-gray-700 dark:text-gray-200 outline-none placeholder-gray-400"
        />
      </div>

      <div className="flex gap-2 flex-wrap">
        {levels.map(l => (
          <button key={l} onClick={() => setFilterLevel(l)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${filterLevel === l ? 'bg-cyan-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600'}`}>
            {l === 'All' ? T.allLevels : l}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="text-center py-8 text-gray-400 text-sm">{T.notFound}</div>
        )}
        {filtered.map((p, idx) => {
          const done = readPassages.includes(p.id)
          return (
            <button key={p.id} onClick={() => setSelectedId(p.id)}
              style={{ animationDelay: `${(idx % 20) * 24}ms` }}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all card-hover animate-fade-up text-left group ${done ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/10 border-green-200 dark:border-green-700' : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-cyan-200 dark:hover:border-cyan-600'}`}>
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg flex-shrink-0 transition-transform group-hover:scale-110 ${done ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white' : 'bg-gradient-to-br from-cyan-500 to-sky-600 text-white'}`}>
                {done ? '✓' : '📖'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-gray-800 dark:text-gray-100 text-sm">{p.title}</span>
                  <span className={levelBadgeClass(p.level)}>{p.level}</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{p.titleVi}</p>
                <p className="text-xs text-gray-400 mt-0.5">{p.topic} · {p.wordCount} từ · {(p.questions || []).length} câu hỏi</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {done && <CheckCircle size={18} className="text-green-500" />}
                <ChevronRight size={18} className="text-gray-400 group-hover:translate-x-0.5 group-hover:text-cyan-500 transition-all" />
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}



