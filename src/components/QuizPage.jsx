import { useState, useCallback } from 'react'
import { CheckSquare, RotateCcw, ChevronRight, Trophy } from 'lucide-react'
import { getRandomQuestions } from '../data/quiz'
import { useApp } from '../context/AppContext'

const OPTION_LETTERS = ['A', 'B', 'C', 'D']

export default function QuizPage() {
  const { dispatch } = useApp()
  const [phase, setPhase] = useState('setup') // setup | quiz | result
  const [level, setLevel] = useState('All')
  const [count, setCount] = useState(10)
  const [questions, setQuestions] = useState([])
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [answered, setAnswered] = useState(false)
  const [results, setResults] = useState([]) // { correct: bool, question }

  const startQuiz = useCallback(() => {
    const qs = getRandomQuestions(count, level === 'All' ? null : level)
    setQuestions(qs)
    setCurrent(0)
    setSelected(null)
    setAnswered(false)
    setResults([])
    setPhase('quiz')
  }, [count, level])

  const handleSelect = (idx) => {
    if (answered) return
    setSelected(idx)
    setAnswered(true)
  }

  const handleNext = () => {
    const q = questions[current]
    const isCorrect = selected === q.correct
    const newResults = [...results, { correct: isCorrect, question: q, selected }]
    setResults(newResults)

    if (current >= questions.length - 1) {
      // Quiz done
      const score = newResults.filter(r => r.correct).length
      const total = newResults.length
      const percentage = Math.round((score / total) * 100)
      const points = score * 5
      dispatch({ type: 'ADD_QUIZ_SCORE', score: { score, total, percentage, points, level, date: new Date().toISOString() } })
      setPhase('result')
    } else {
      setCurrent(c => c + 1)
      setSelected(null)
      setAnswered(false)
    }
  }

  const q = questions[current]
  const finalScore = results.filter(r => r.correct).length

  // ── Setup screen ─────────────────────────────────────────────────────────
  if (phase === 'setup') {
    return (
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center">
          <div className="text-5xl mb-3">📝</div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Quiz Tiếng Anh</h1>
          <p className="text-gray-500 mt-1">Kiểm tra kiến thức của bạn</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-2">Cấp độ</label>
            <div className="flex gap-2 flex-wrap">
              {['All', 'A1', 'A2', 'B1', 'B1+', 'IELTS Foundation'].map(l => (
                <button
                  key={l}
                  onClick={() => setLevel(l)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    level === l
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                  }`}
                >
                  {l === 'All' ? '🌐 Tất cả' : l}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-2">
              Số câu hỏi: <span className="text-indigo-600">{count}</span>
            </label>
            <div className="flex gap-2">
              {[5, 10, 15, 20].map(n => (
                <button
                  key={n}
                  onClick={() => setCount(n)}
                  className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
                    count === n
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={startQuiz}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl py-4 font-bold text-lg hover:opacity-90 transition-opacity shadow-lg"
        >
          🚀 Bắt đầu Quiz!
        </button>
      </div>
    )
  }

  // ── Result screen ─────────────────────────────────────────────────────────
  if (phase === 'result') {
    const total = results.length
    const pct = Math.round((finalScore / total) * 100)
    const emoji = pct >= 90 ? '🏆' : pct >= 70 ? '🎉' : pct >= 50 ? '👍' : '💪'
    const message = pct >= 90 ? 'Xuất sắc!' : pct >= 70 ? 'Rất tốt!' : pct >= 50 ? 'Khá tốt!' : 'Cố gắng hơn nhé!'

    return (
      <div className="max-w-md mx-auto space-y-5 animate-fade-up">
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-3xl p-8 text-center border border-indigo-100 dark:border-indigo-800 relative overflow-hidden">
          <div className="blob bg-indigo-300/30 w-40 h-40 -top-12 -right-12" />
          <div className="blob bg-pink-300/30 w-32 h-32 -bottom-8 -left-8 animate-float-slow" />
          <div className="relative">
            <div className="text-6xl mb-3 animate-pop">{emoji}</div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{message}</h2>
            <div className="mt-4 text-6xl font-bold text-gradient animate-count-up">{pct}%</div>
            <p className="text-gray-500 mt-1">{finalScore}/{total} câu đúng</p>
            <div className="bg-white/70 dark:bg-gray-800/50 rounded-2xl p-3 mt-4">
              <span className="text-green-600 font-bold">+{finalScore * 5} điểm</span>
            </div>
          </div>
        </div>

        {/* Review wrong answers */}
        <div className="space-y-3">
          <h3 className="font-bold text-gray-800 dark:text-gray-100">📋 Xem lại đáp án</h3>
          {results.map((r, i) => (
            <div
              key={i}
              style={{ animationDelay: `${i * 40}ms` }}
              className={`rounded-2xl p-4 border animate-fade-up ${
                r.correct
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700'
                  : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700'
              }`}
            >
              <div className="flex items-start gap-2">
                <span className="text-lg">{r.correct ? '✅' : '❌'}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{r.question.question}</p>
                  {!r.correct && (
                    <p className="text-xs text-green-700 dark:text-green-400 mt-1">
                      ✓ Đáp án đúng: {r.question.options[r.question.correct]}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 italic">{r.question.explanation}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setPhase('setup')}
            className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-2xl py-3 font-semibold hover:bg-gray-200 hover:scale-[1.02] transition-all"
          >
            Quay lại
          </button>
          <button
            onClick={startQuiz}
            className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl py-3 font-semibold hover:opacity-95 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 btn-shine"
          >
            <RotateCcw size={16} /> Làm lại
          </button>
        </div>
      </div>
    )
  }

  // ── Quiz screen ───────────────────────────────────────────────────────────
  const progress = (current / questions.length) * 100
  const correctCount = results.filter(r => r.correct).length

  return (
    <div className="max-w-lg mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckSquare className="text-indigo-600" size={20} />
          <span className="font-bold text-gray-800 dark:text-gray-100">
            Câu {current + 1}/{questions.length}
          </span>
        </div>
        <div className="flex gap-3 text-sm">
          <span className="text-green-600 font-bold">✅ {correctCount}</span>
          <span className="text-red-500 font-bold">❌ {current - correctCount}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-gray-100 dark:bg-gray-700 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question card */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-md border border-gray-100 dark:border-gray-700 animate-fade-up card-hover">
        <div className="flex items-center gap-2 mb-4">
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
            q?.level === 'A1' ? 'bg-green-100 text-green-700' :
            q?.level === 'A2' ? 'bg-blue-100 text-blue-700' :
            q?.level === 'B1' ? 'bg-purple-100 text-purple-700' :
            q?.level === 'B1+' ? 'bg-fuchsia-100 text-fuchsia-700' :
            q?.level === 'IELTS Foundation' ? 'bg-amber-100 text-amber-700' :
            'bg-red-100 text-red-700'
          }`}>{q?.level}</span>
          <span className="text-xs text-gray-400">{q?.type === 'grammar' ? '📐 Ngữ pháp' : '📖 Từ vựng'}</span>
        </div>
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 leading-relaxed">{q?.question}</h2>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {q?.options.map((opt, i) => {
          let style = 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:border-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20'

          if (answered) {
            if (i === q.correct) {
              style = 'bg-green-50 dark:bg-green-900/30 border-green-400 text-green-800 dark:text-green-200'
            } else if (i === selected && i !== q.correct) {
              style = 'bg-red-50 dark:bg-red-900/30 border-red-400 text-red-800 dark:text-red-200'
            } else {
              style = 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 text-gray-400 dark:text-gray-500'
            }
          } else if (selected === i) {
            style = 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-400 text-indigo-800 dark:text-indigo-200'
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={answered}
              className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all duration-150 ${style}`}
            >
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                answered && i === q.correct ? 'bg-green-500 text-white' :
                answered && i === selected && i !== q.correct ? 'bg-red-500 text-white' :
                'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
              }`}>
                {OPTION_LETTERS[i]}
              </span>
              <span className="font-medium">{opt}</span>
              {answered && i === q.correct && <span className="ml-auto text-green-500">✓</span>}
              {answered && i === selected && i !== q.correct && <span className="ml-auto text-red-500">✗</span>}
            </button>
          )
        })}
      </div>

      {/* Explanation */}
      {answered && (
        <div className={`rounded-2xl p-4 border text-sm animate-slide-down ${
          selected === q.correct
            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 text-green-800 dark:text-green-200'
            : 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 text-orange-800 dark:text-orange-200'
        }`}>
          <p className="font-semibold mb-1">{selected === q.correct ? '✅ Chính xác!' : '❌ Chưa đúng!'}</p>
          <p>{q.explanation}</p>
        </div>
      )}

      {/* Next button */}
      {answered && (
        <button
          onClick={handleNext}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl py-4 font-bold hover:opacity-95 hover:scale-[1.01] transition-all flex items-center justify-center gap-2 shadow-sm btn-shine animate-slide-down"
        >
          {current >= questions.length - 1 ? (
            <><Trophy size={18} /> Xem kết quả</>
          ) : (
            <>Câu tiếp theo <ChevronRight size={18} /></>
          )}
        </button>
      )}
    </div>
  )
}
