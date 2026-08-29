import { useState, useMemo } from 'react'
import { GraduationCap, ChevronRight, CheckCircle, BookOpen, ArrowLeft, Search, AlertTriangle, Lightbulb, PenTool, Zap, Brain, Clock, BarChart3 } from 'lucide-react'
import { grammarLessons } from '../data/grammarLessons'
import { useApp } from '../context/AppContext'
import { ProgressRing } from './AudioVisuals'

const levelColors = {
  Beginner: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 border-green-200 dark:border-green-700',
  A1: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700',
  A2: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-700',
  B1: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 border-purple-200 dark:border-purple-700',
  'B1+': 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300 border-violet-200 dark:border-violet-700',
  IELTS: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 border-red-200 dark:border-red-700',
}

const levelBadge = {
  Beginner: 'text-xs px-2 py-0.5 rounded-full font-semibold ' + levelColors.Beginner,
  A1: 'text-xs px-2 py-0.5 rounded-full font-semibold ' + levelColors.A1,
  A2: 'text-xs px-2 py-0.5 rounded-full font-semibold ' + levelColors.A2,
  B1: 'text-xs px-2 py-0.5 rounded-full font-semibold ' + levelColors.B1,
  'B1+': 'text-xs px-2 py-0.5 rounded-full font-semibold ' + levelColors['B1+'],
  IELTS: 'text-xs px-2 py-0.5 rounded-full font-semibold ' + levelColors.IELTS,
}

function LevelProgress({ state }) {
  const levels = ['Beginner', 'A1', 'A2', 'B1', 'B1+', 'IELTS']
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
      {levels.map(lv => {
        const total = grammarLessons.filter(l => l.level === lv).length
        const done = grammarLessons.filter(l => l.level === lv && state.completedGrammar.includes(l.id)).length
        return (
          <div key={lv} className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-100 dark:border-gray-700 text-center">
            <div className={`text-xs font-bold mb-1 ${levelColors[lv] ? levelColors[lv].split(' ')[1] : ''}`}>{lv}</div>
            <div className="text-lg font-bold text-gray-700 dark:text-gray-200">{done}/{total}</div>
          </div>
        )
      })}
    </div>
  )
}

// Resolve the correct option index for a question.
// Data stores `correctAnswer` as the option text (string), but some
// future content may store a numeric index. Handle both robustly.
function getCorrectIdx(q) {
  if (!q || !Array.isArray(q.options)) return -1
  if (typeof q.correctAnswer === 'number') return q.correctAnswer
  const byValue = q.options.findIndex(o => o === q.correctAnswer)
  if (byValue >= 0) return byValue
  // Last resort: a numeric string like "2" meaning an index
  const asNum = Number(q.correctAnswer)
  if (Number.isInteger(asNum) && asNum >= 0 && asNum < q.options.length) return asNum
  return -1
}

function QuizSection({ questions, title, icon, onComplete }) {
  const [answers, setAnswers] = useState({})
  const [checked, setChecked] = useState({})
  const [showResults, setShowResults] = useState(false)

  const handleAnswer = (idx, val) => {
    if (checked[idx] || showResults) return
    setAnswers(a => ({ ...a, [idx]: val }))
  }

  const checkAll = () => {
    const newChecked = {}
    questions.forEach((_, i) => { if (answers[i] !== undefined) newChecked[i] = true })
    setChecked(newChecked)
  }

  const submitResults = () => {
    checkAll()
    setShowResults(true)
    if (onComplete) onComplete()
  }

  const correctCount = showResults
    ? questions.filter((q, i) => answers[i] === getCorrectIdx(q)).length
    : 0

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
      <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
        {icon} {title} <span className="text-xs font-normal text-gray-400">({questions.length} câu)</span>
      </h3>
      <div className="space-y-4">
        {questions.map((q, qi) => {
          const ans = answers[qi]
          const isChecked = checked[qi] || showResults
          const correctIdx = getCorrectIdx(q)
          const isCorrect = ans === correctIdx
          let borderStyle = 'border-gray-200 dark:border-gray-600'
          if (isChecked && showResults) {
            borderStyle = isCorrect ? 'border-green-400 dark:border-green-500' : 'border-red-400 dark:border-red-500'
          } else if (isChecked) {
            borderStyle = isCorrect ? 'border-green-400 dark:border-green-500' : 'border-orange-400 dark:border-orange-500'
          }
          return (
            <div key={qi} className={`border rounded-xl p-3 ${borderStyle} transition-colors`}>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">{qi + 1}. {q.question}</p>
              <div className="space-y-1.5">
                {q.options.map((opt, oi) => {
                  let style = 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                  if (ans === oi) style = 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-400 text-indigo-800 dark:text-indigo-200'
                  if (isChecked && showResults) {
                    if (oi === correctIdx) style = 'bg-green-50 dark:bg-green-900/30 border-green-400 text-green-800 dark:text-green-200'
                    else if (oi === ans) style = 'bg-red-50 dark:bg-red-900/30 border-red-400 text-red-700 dark:text-red-300'
                    else style = 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 text-gray-400'
                  } else if (isChecked) {
                    if (oi === correctIdx) style = 'bg-green-50 dark:bg-green-900/30 border-green-400 text-green-800 dark:text-green-200'
                    else if (oi === ans) style = 'bg-red-50 dark:bg-red-900/30 border-red-400 text-red-700 dark:text-red-300'
                    else style = 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 text-gray-400'
                  }
                  return (
                    <button
                      key={oi}
                      onClick={() => handleAnswer(qi, oi)}
                      className={`w-full text-left text-sm px-3 py-2 rounded-lg border transition-all ${style}`}
                    >
                      {['A','B','C','D'][oi]}. {opt}
                    </button>
                  )
                })}
              </div>
              {(isChecked || showResults) && (
                <p className={`mt-2 text-xs rounded-lg p-2 ${
                  isCorrect
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                    : 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300'
                }`}>
                  {isCorrect ? 'Đúng! ' : 'Sai. '}{q.explanation}
                </p>
              )}
            </div>
          )
        })}
      </div>
      <div className="mt-4 flex items-center justify-between">
        {showResults ? (
          <div className="flex items-center gap-3">
            <span className={`text-sm font-bold ${correctCount === questions.length ? 'text-green-600' : 'text-orange-600'}`}>
              {correctCount}/{questions.length} đúng
            </span>
          </div>
        ) : (
          <button
            onClick={submitResults}
            disabled={Object.keys(answers).length === 0}
            className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            Kiểm tra
          </button>
        )}
      </div>
    </div>
  )
}

function LessonDetail({ lesson, onBack }) {
  const { state, dispatch } = useApp()
  const isCompleted = state.completedGrammar.includes(lesson.id)
  const [activeTab, setActiveTab] = useState('overview')
  const [practiceSubmitted, setPracticeSubmitted] = useState(false)
  const [quizSubmitted, setQuizSubmitted] = useState(false)

  const handleComplete = () => {
    dispatch({ type: 'COMPLETE_GRAMMAR', lessonId: lesson.id })
  }

  const tabs = [
    { id: 'overview', label: 'Lý thuyết', icon: <BookOpen size={14} /> },
    { id: 'examples', label: 'Ví dụ', icon: <PenTool size={14} /> },
    { id: 'mistakes', label: 'Lỗi thường gặp', icon: <AlertTriangle size={14} /> },
    { id: 'tips', label: 'Mẹo', icon: <Lightbulb size={14} /> },
    { id: 'practice', label: 'Bài tập', icon: <Brain size={14} /> },
    { id: 'quiz', label: 'Kiểm tra', icon: <Zap size={14} /> },
  ].filter(tab => {
    // Hide exercise tabs when the lesson has no questions for them, so users
    // never land on an empty "0 câu" screen.
    if (tab.id === 'practice') return Array.isArray(lesson.practice) && lesson.practice.length > 0
    if (tab.id === 'quiz') return Array.isArray(lesson.quiz) && lesson.quiz.length > 0
    if (tab.id === 'examples') return Array.isArray(lesson.examples) && lesson.examples.length > 0
    if (tab.id === 'mistakes') return Array.isArray(lesson.commonMistakes) && lesson.commonMistakes.length > 0
    if (tab.id === 'tips') return Array.isArray(lesson.tips) && lesson.tips.length > 0
    return true
  })

  const allPracticeDone = practiceSubmitted
  const allQuizDone = quizSubmitted

  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft size={16} /> Danh sách bài học
      </button>

      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-2 mb-2">
          <span className={`${levelBadge[lesson.level]}`}>{lesson.level}</span>
          <span className="text-sm bg-white/20 px-2 py-0.5 rounded-full">{lesson.category}</span>
        </div>
        <h1 className="text-2xl font-bold mt-2">{lesson.title}</h1>
        <p className="text-indigo-200 text-sm mt-1">({lesson.titleVi})</p>
        <p className="text-indigo-100 mt-2 text-sm">{lesson.shortDescription}</p>
        <div className="flex items-center gap-4 mt-3 text-xs text-indigo-200">
          <span className="flex items-center gap-1"><Clock size={12} /> {lesson.estimatedMinutes} phút</span>
          <span className="flex items-center gap-1"><Zap size={12} /> {lesson.xpReward} XP</span>
        </div>
      </div>

      <div className="flex gap-1 flex-wrap border-b border-gray-200 dark:border-gray-700 pb-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-t-lg transition-all ${
              activeTab === tab.id
                ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-b-2 border-indigo-500'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-5">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-3">Giải thích</h3>
            <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
              {lesson.explanationVi}
            </div>
          </div>
          {lesson.structure && (
            <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl p-5 border border-indigo-200 dark:border-indigo-700">
              <h3 className="font-bold text-indigo-800 dark:text-indigo-300 mb-2">Công thức</h3>
              <div className="text-sm font-mono bg-white dark:bg-gray-900/50 rounded-xl p-4 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800">
                {lesson.structure}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'examples' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
            <PenTool size={16} /> Ví dụ ({lesson.examples.length})
          </h3>
          <div className="space-y-3">
            {lesson.examples.map((ex, i) => (
              <div key={i} className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-3">
                <p className="text-sm font-semibold text-indigo-800 dark:text-indigo-200">{ex.en}</p>
                <p className="text-sm text-indigo-600 dark:text-indigo-400 mt-1">{ex.vi}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'mistakes' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2 text-red-600">
            <AlertTriangle size={16} /> Lỗi thường gặp ({lesson.commonMistakes.length})
          </h3>
          <div className="space-y-4">
            {lesson.commonMistakes.map((m, i) => (
              <div key={i} className="border border-red-200 dark:border-red-800 rounded-xl p-4 bg-red-50 dark:bg-red-900/10">
                <p className="text-xs text-red-500 font-semibold mb-1">Sai: <span className="line-through">{m.mistake}</span></p>
                <p className="text-sm text-green-700 dark:text-green-300 font-semibold mb-1">Đúng: {m.correct}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{m.reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'tips' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2 text-amber-600">
            <Lightbulb size={16} /> Mẹo học ({lesson.tips.length})
          </h3>
          <ul className="space-y-3">
            {lesson.tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300 bg-amber-50 dark:bg-amber-900/10 rounded-xl p-3">
                <span className="font-bold text-amber-500 mt-0.5">#{i + 1}</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {activeTab === 'practice' && (
        <div className="space-y-4">
          <QuizSection
            questions={lesson.practice}
            title="Bài tập thực hành"
            icon={<Brain size={16} />}
            onComplete={() => setPracticeSubmitted(true)}
          />
        </div>
      )}

      {activeTab === 'quiz' && (
        <div className="space-y-4">
          <QuizSection
            questions={lesson.quiz}
            title="Kiểm tra đánh giá"
            icon={<Zap size={16} />}
            onComplete={() => setQuizSubmitted(true)}
          />
        </div>
      )}

      {(activeTab !== 'practice' && activeTab !== 'quiz') && (
        <div className="pt-2">
          {!isCompleted ? (
            <button
              onClick={handleComplete}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl py-4 font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-md"
            >
              <CheckCircle size={20} /> Hoàn thành bài học (+{lesson.xpReward} điểm)
            </button>
          ) : (
            <div className="text-center py-4 bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-200 dark:border-green-700">
              <span className="text-green-600 dark:text-green-300 font-bold flex items-center justify-center gap-2">
                <CheckCircle size={20} /> Bạn đã hoàn thành bài này!
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function GrammarPage() {
  const { state } = useApp()
  const [filterLevel, setFilterLevel] = useState('All')
  const [filterCategory, setFilterCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLesson, setSelectedLesson] = useState(null)

  const levels = useMemo(() => ['All', ...new Set(grammarLessons.map(l => l.level))], [])
  const categories = useMemo(() => ['All', ...new Set(grammarLessons.map(l => l.category))], [])

  const filtered = useMemo(() => {
    let result = grammarLessons
    if (filterLevel !== 'All') result = result.filter(l => l.level === filterLevel)
    if (filterCategory !== 'All') result = result.filter(l => l.category === filterCategory)
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase()
      result = result.filter(l =>
        l.title.toLowerCase().includes(q) ||
        l.titleVi.toLowerCase().includes(q) ||
        l.shortDescription.toLowerCase().includes(q)
      )
    }
    return result
  }, [filterLevel, filterCategory, searchQuery])

  if (selectedLesson) {
    return <LessonDetail lesson={selectedLesson} onBack={() => setSelectedLesson(null)} />
  }

  const completedCount = state.completedGrammar.length
  const totalCount = grammarLessons.length

  return (
    <div className="space-y-5 animate-fade-up">
      <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 bg-200 animate-gradient-x rounded-3xl p-6 text-white relative overflow-hidden">
        <div className="blob bg-amber-300/40 w-40 h-40 -top-10 -right-10" />
        <div className="blob bg-orange-300/40 w-32 h-32 -bottom-10 -left-8 animate-float-slow" />
        <div className="relative flex items-center gap-5 flex-wrap">
          <ProgressRing pct={totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0}
            size={84} stroke={8} gradient={['#ffffff', '#fde68a']}>
            <div className="text-center">
              <div className="text-base font-extrabold">{completedCount}</div>
              <div className="text-[10px] uppercase tracking-wider text-amber-50">đã học</div>
            </div>
          </ProgressRing>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold flex items-center gap-2 drop-shadow">
              <GraduationCap size={24} /> Ngữ Pháp
            </h1>
            <p className="text-sm text-amber-50 mt-1">
              Đã học <b className="text-white">{completedCount}</b>/{totalCount} bài
            </p>
            <div className="mt-2 flex items-center gap-2 flex-wrap text-xs">
              <span className="bg-white/20 px-2 py-0.5 rounded-full">{filtered.length} đang hiển thị</span>
              <span className="bg-white/20 px-2 py-0.5 rounded-full">{categories.length - 1} danh mục</span>
              <span className="bg-white/20 px-2 py-0.5 rounded-full">{levels.length - 1} cấp độ</span>
            </div>
          </div>
        </div>
      </div>

      <LevelProgress state={state} />

      <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-xl px-3 py-2 border border-gray-200 dark:border-gray-700 card-hover">
        <Search size={16} className="text-gray-400" />
        <input
          type="text"
          placeholder="Tìm kiếm bài học..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full bg-transparent text-sm text-gray-700 dark:text-gray-200 outline-none placeholder-gray-400"
        />
      </div>

      <div className="flex gap-2 flex-wrap">
        <select
          value={filterLevel}
          onChange={e => setFilterLevel(e.target.value)}
          className="px-3 py-2 rounded-xl text-sm font-semibold bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 outline-none card-hover"
        >
          {levels.map(l => (
            <option key={l} value={l}>{l === 'All' ? 'Tất cả trình độ' : l}</option>
          ))}
        </select>
        <select
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
          className="px-3 py-2 rounded-xl text-sm font-semibold bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 outline-none card-hover"
        >
          {categories.map(c => (
            <option key={c} value={c}>{c === 'All' ? 'Tất cả danh mục' : c}</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="text-center py-8 text-gray-400 text-sm">Không tìm thấy bài học.</div>
        )}
        {filtered.map((lesson, idx) => {
          const done = state.completedGrammar.includes(lesson.id)
          return (
            <button
              key={lesson.id}
              onClick={() => setSelectedLesson(lesson)}
              style={{ animationDelay: `${(idx % 25) * 24}ms` }}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all card-hover animate-fade-up text-left group ${
                done
                  ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/10 border-green-200 dark:border-green-700'
                  : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-orange-200 dark:hover:border-orange-600'
              }`}
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg font-bold flex-shrink-0 transition-transform group-hover:scale-110 ${
                done
                  ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow'
                  : 'bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow'
              }`}>
                {done ? '✓' : '📐'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-gray-800 dark:text-gray-100 text-sm">{lesson.title}</span>
                  <span className={`text-xs font-bold px-1.5 py-0.5 rounded-md border ${levelColors[lesson.level]}`}>{lesson.level}</span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">{lesson.category}</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{lesson.titleVi}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {done && <CheckCircle size={18} className="text-green-500" />}
                <span className="text-xs text-gray-400 flex items-center gap-1"><Clock size={11}/> {lesson.estimatedMinutes}ph</span>
                <ChevronRight size={18} className="text-gray-400 group-hover:translate-x-0.5 group-hover:text-orange-500 transition-all" />
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
