import { useState, useEffect, useMemo } from 'react'
import { ChevronLeft, ChevronRight, CheckCircle, Circle, Lock, Play, Headphones, BookOpen, PenLine, Mic, Sparkles, Award, Volume2, Library } from 'lucide-react'
import { lessons, LEVELS } from '../data/courseLessons.js'
import { vocabulary } from '../data/vocabulary.js'
import { speak } from '../utils/speech.js'
import {
  getCourseProgress, getLevelProgress, completeLesson, isLessonUnlocked,
  getTotalXp, updateStreak
} from '../utils/courseProgress.js'

const skillIcon = { vocabulary: BookOpen, grammar: BookOpen, listening: Headphones, speaking: Mic, reading: BookOpen, writing: PenLine, mixed: Sparkles, ielts: Award }

const skillColors = {
  vocabulary: { bg: 'bg-blue-100 dark:bg-blue-900/40', text: 'text-blue-700 dark:text-blue-300', icon: 'text-blue-500' },
  grammar: { bg: 'bg-green-100 dark:bg-green-900/40', text: 'text-green-700 dark:text-green-300', icon: 'text-green-500' },
  listening: { bg: 'bg-purple-100 dark:bg-purple-900/40', text: 'text-purple-700 dark:text-purple-300', icon: 'text-purple-500' },
  speaking: { bg: 'bg-orange-100 dark:bg-orange-900/40', text: 'text-orange-700 dark:text-orange-300', icon: 'text-orange-500' },
  reading: { bg: 'bg-cyan-100 dark:bg-cyan-900/40', text: 'text-cyan-700 dark:text-cyan-300', icon: 'text-cyan-500' },
  writing: { bg: 'bg-pink-100 dark:bg-pink-900/40', text: 'text-pink-700 dark:text-pink-300', icon: 'text-pink-500' },
  mixed: { bg: 'bg-indigo-100 dark:bg-indigo-900/40', text: 'text-indigo-700 dark:text-indigo-300', icon: 'text-indigo-500' },
  ielts: { bg: 'bg-rose-100 dark:bg-rose-900/40', text: 'text-rose-700 dark:text-rose-300', icon: 'text-rose-500' },
}

function LevelCard({ level, onClick }) {
  const prog = getLevelProgress(level.id, lessons)
  const levelLessons = lessons.filter(l => l.levelId === level.id)
  const unlocked = levelLessons.length === 0 || isLessonUnlocked(levelLessons[0].id, lessons)
  return (
    <button onClick={() => unlocked && onClick(level)}
      className={`relative flex items-center gap-4 p-5 rounded-2xl border-2 text-left w-full transition-all hover:shadow-lg
        ${unlocked ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 cursor-pointer'
                   : 'bg-gray-100 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 opacity-60 cursor-not-allowed'}`}>
      <div className="flex-shrink-0">
        <span className="text-4xl">{level.icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-gray-900 dark:text-white text-lg">{level.title}</h3>
          {!unlocked && <Lock size={14} className="text-gray-400" />}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{level.titleEn}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{prog.completed}/{prog.total} bài · {prog.percent}%</p>
        <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div className="h-2 rounded-full transition-all duration-500" style={{ width: prog.percent + '%', backgroundColor: level.color }} />
        </div>
      </div>
      {unlocked && <ChevronRight size={20} className="text-gray-400 flex-shrink-0" />}
    </button>
  )
}

function LessonCard({ lesson, onClick, progress }) {
  const done = !!progress
  const colors = skillColors[lesson.skill] || skillColors.mixed
  const Icon = skillIcon[lesson.skill] || BookOpen
  return (
    <button onClick={onClick}
      className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all text-left w-full cursor-pointer">
      <div className={`p-2 rounded-lg ${colors.bg}`}>
        <Icon size={18} className={colors.icon} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="font-semibold text-sm text-gray-900 dark:text-white truncate">{lesson.title}</h4>
          {done ? <CheckCircle size={14} className="text-green-500 flex-shrink-0" /> : <Circle size={14} className="text-gray-300 dark:text-gray-600 flex-shrink-0" />}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{lesson.titleVi}</p>
        <p className="text-xs text-gray-400 mt-0.5">{lesson.estimatedMinutes} phút · {lesson.skill}</p>
      </div>
      <Play size={16} className="text-indigo-500 flex-shrink-0" />
    </button>
  )
}

function LessonDetail({ lesson, onBack }) {
  const [currentPractice, setCurrentPractice] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [quizAnswers, setQuizAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
    setCurrentPractice(0)
    setSelectedAnswers({})
    setQuizAnswers({})
    setShowResults(false)
    setCompleted(false)
  }, [lesson.id])

  // Scans the full 8000-word vocab list — memoize so it only runs when the
  // lesson changes, not on every render of the lesson view.
  const relatedVocab = useMemo(
    () => vocabulary.filter(v => lesson.title.toLowerCase().includes(v.topic.toLowerCase())).slice(0, 5),
    [lesson.title]
  )

  function handlePracticeSelect(index, answer) {
    setSelectedAnswers(prev => ({ ...prev, [`p_${index}`]: answer }))
  }

  function handleQuizSelect(index, answer) {
    setQuizAnswers(prev => ({ ...prev, [`q_${index}`]: answer }))
  }

  function handleComplete() {
    completeLesson(lesson.id, lesson.xpReward)
    updateStreak()
    setCompleted(true)
  }

  function isPracticeCorrect(index) {
    const q = lesson.practice[index]
    if (!q) return true
    return selectedAnswers[`p_${index}`] === q.correctAnswer
  }

  function getQuizScore() {
    if (lesson.miniQuiz.length === 0) return 0
    let correct = 0
    for (let i = 0; i < lesson.miniQuiz.length; i++) {
      if (quizAnswers[`q_${i}`] === lesson.miniQuiz[i].correctAnswer) correct++
    }
    return Math.round(correct / lesson.miniQuiz.length * 100)
  }

  const progress = getCourseProgress()[lesson.id]
  const colors = skillColors[lesson.skill] || skillColors.mixed
  const Icon = skillIcon[lesson.skill] || BookOpen

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all cursor-pointer">
          <ChevronLeft size={20} className="text-gray-500" />
        </button>
        <div className={`p-2.5 rounded-xl ${colors.bg}`}>
          <Icon size={22} className={colors.icon} />
        </div>
        <div className="flex-1">
          <h2 className="font-bold text-xl text-gray-900 dark:text-white">{lesson.title}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{lesson.titleVi} · {lesson.estimatedMinutes} phút</p>
        </div>
        {completed && (
          <div className="flex items-center gap-1.5 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 px-3 py-1.5 rounded-xl text-sm font-medium">
            <Award size={16} /> +{lesson.xpReward} XP
          </div>
        )}
      </div>

      {/* Objectives */}
      <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50">
        <h3 className="font-semibold text-sm text-indigo-700 dark:text-indigo-300 mb-2">Mục tiêu bài học</h3>
        <ul className="space-y-1">
          {lesson.objectives.map((o, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
              <span className="text-indigo-500 mt-0.5">•</span>
              {o}
            </li>
          ))}
        </ul>
      </div>

      {/* Bài giảng */}
      <div className="p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <h3 className="font-bold text-gray-900 dark:text-white mb-3">📖 Bài giảng</h3>
        <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{lesson.explanationVi}</div>
      </div>

      {/* Examples */}
      {lesson.examples.length > 0 && (
        <div className="p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <h3 className="font-bold text-gray-900 dark:text-white mb-3">📝 Ví dụ</h3>
          <div className="space-y-3">
            {lesson.examples.map((ex, i) => (
              <div key={i} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{ex.en}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{ex.vi}</p>
                  </div>
                  <button onClick={() => speak(ex.en)} className="p-1.5 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-all flex-shrink-0 cursor-pointer">
                    <Volume2 size={16} className="text-indigo-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related Vocabulary */}
      {relatedVocab.length > 0 && (
        <div className="p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <h3 className="font-bold text-gray-900 dark:text-white mb-3">📚 Từ vựng liên quan</h3>
          <div className="flex flex-wrap gap-2">
            {relatedVocab.map(v => (
              <button key={v.id} onClick={() => speak(v.english)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-all cursor-pointer">
                {v.english}
                <Volume2 size={12} className="opacity-50" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Practice Exercises */}
      {lesson.practice.length > 0 && (
        <div className="p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <h3 className="font-bold text-gray-900 dark:text-white mb-3">✏️ Bài tập luyện tập</h3>
          <div className="space-y-4">
            {lesson.practice.map((q, i) => (
              <div key={i} className={`p-4 rounded-xl border ${selectedAnswers[`p_${i}`] ? (isPracticeCorrect(i) ? 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20' : 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20') : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/30'}`}>
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-3">{i + 1}. {q.question}</p>
                <div className="space-y-2">
                  {q.options.map((opt, j) => (
                    <button key={j} onClick={() => handlePracticeSelect(i, opt)}
                      className={`w-full text-left p-2.5 rounded-lg text-sm transition-all border cursor-pointer
                        ${selectedAnswers[`p_${i}`] === opt
                          ? (opt === q.correctAnswer ? 'bg-green-100 dark:bg-green-900/40 border-green-400 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-900/40 border-red-400 text-red-800 dark:text-red-200')
                          : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-indigo-300'}`}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mini Quiz */}
      {lesson.miniQuiz.length > 0 && (
        <div className="p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <h3 className="font-bold text-gray-900 dark:text-white mb-3">🎯 Mini Quiz</h3>
          <div className="space-y-4">
            {lesson.miniQuiz.map((q, i) => (
              <div key={i} className="p-4 rounded-xl border border-gray-200 dark:border-gray-600 bg-amber-50 dark:bg-amber-900/10">
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-3">{i + 1}. {q.question}</p>
                <div className="space-y-2">
                  {q.options.map((opt, j) => (
                    <button key={j} onClick={() => handleQuizSelect(i, opt)}
                      className={`w-full text-left p-2.5 rounded-lg text-sm transition-all border cursor-pointer
                        ${quizAnswers[`q_${i}`] === opt
                          ? (opt === q.correctAnswer ? 'bg-green-100 dark:bg-green-900/40 border-green-400 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-900/40 border-red-400 text-red-800 dark:text-red-200')
                          : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-amber-300'}`}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {Object.keys(quizAnswers).length === lesson.miniQuiz.length && (
            <div className="mt-4 p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-center">
              <span className="font-bold text-indigo-700 dark:text-indigo-300">Điểm Quiz: {getQuizScore()}%</span>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        {!completed && (
          <button onClick={handleComplete}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold hover:opacity-90 transition-all cursor-pointer">
            ✅ Hoàn thành bài học (+{lesson.xpReward} XP)
          </button>
        )}
        {completed && (
          <div className="flex-1 py-3 rounded-xl bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 font-semibold text-center">
            🎉 Đã hoàn thành! Nhận {lesson.xpReward} XP
          </div>
        )}
        {lesson.nextLessonId && (
          <button onClick={() => {
            const next = lessons.find(l => l.id === lesson.nextLessonId)
            if (next) onBack()
          }} className="px-6 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all cursor-pointer">
            Bài tiếp <ChevronRight size={16} className="inline" />
          </button>
        )}
      </div>
    </div>
  )
}

export default function Course() {
  const [view, setView] = useState('levels')
  const [selectedLevel, setSelectedLevel] = useState(null)
  const [selectedLesson, setSelectedLesson] = useState(null)
  const [refresh, setRefresh] = useState(0)
  const totalXp = getTotalXp()

  function handleLevelClick(level) {
    setSelectedLevel(level)
    setView('lessons')
  }

  function handleLessonClick(lesson) {
    setSelectedLesson(lesson)
    setView('lesson')
  }

  function handleBack() {
    if (view === 'lesson') {
      setView('lessons')
      setRefresh(r => r + 1)
    } else {
      setView('levels')
      setSelectedLevel(null)
    }
  }

  function renderLevels() {
    return (
      <div className="space-y-6 animate-fade-up">
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 bg-200 animate-gradient-x rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
          <div className="blob bg-amber-300/40 w-44 h-44 -top-12 -right-12" />
          <div className="blob bg-rose-300/40 w-36 h-36 -bottom-12 -left-10 animate-float-slow" />
          <div className="relative flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl font-bold drop-shadow flex items-center gap-2">
                <Library size={22} className="animate-float" /> Lộ Trình Học
              </h1>
              <p className="text-sm text-amber-50 mt-1">Từ mất gốc đến IELTS 6.0 · {LEVELS.length} cấp độ · {lessons.length} bài</p>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl hover:scale-105 transition-transform">
              <Award size={16} />
              <span className="font-bold text-sm animate-count-up">{totalXp.toLocaleString()} XP</span>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          {LEVELS.map((level, i) => (
            <div key={level.id} style={{ animationDelay: `${i * 30}ms` }} className="animate-fade-up">
              <LevelCard level={level} onClick={handleLevelClick} />
            </div>
          ))}
        </div>
      </div>
    )
  }

  function renderLessons() {
    if (!selectedLevel) return null
    const levelLessons = lessons.filter(l => l.levelId === selectedLevel.id)
    const progress = getCourseProgress()
    const unlocked = levelLessons.filter(l => isLessonUnlocked(l.id, lessons))

    return (
      <div className="space-y-4 animate-fade-in">
        <div className="flex items-center gap-3">
          <button onClick={handleBack} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all cursor-pointer">
            <ChevronLeft size={20} className="text-gray-500" />
          </button>
          <span className="text-3xl">{selectedLevel.icon}</span>
          <div>
            <h2 className="font-bold text-xl text-gray-900 dark:text-white">{selectedLevel.title}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{selectedLevel.titleEn}</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50">
          <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 mb-1">🎯 Mục tiêu</p>
          <p className="text-sm text-gray-700 dark:text-gray-300">{selectedLevel.goal}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">📌 Đầu ra: {selectedLevel.output}</p>
        </div>

        <div className="space-y-3">
          {levelLessons.map((lesson, idx) => {
            const unlockedState = isLessonUnlocked(lesson.id, lessons)
            return (
              <div key={lesson.id} className="relative">
                <LessonCard
                  lesson={lesson}
                  onClick={() => unlockedState && handleLessonClick(lesson)}
                  progress={progress[lesson.id]}
                />
                {!unlockedState && (
                  <div className="absolute inset-0 bg-gray-100/80 dark:bg-gray-800/80 rounded-xl flex items-center justify-center cursor-not-allowed">
                    <Lock size={20} className="text-gray-400 mr-2" />
                    <span className="text-sm text-gray-400">Hoàn thành bài trước</span>
                  </div>
                )}
                {idx < levelLessons.length - 1 && (
                  <div className="ml-6 pl-10 py-1">
                    <div className="w-0.5 h-6 bg-gray-200 dark:bg-gray-700 mx-auto" />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  function renderLessonDetail() {
    if (!selectedLesson) return null
    return <LessonDetail key={selectedLesson.id + '_' + refresh} lesson={selectedLesson} onBack={handleBack} />
  }

  return (
    <div>
      {view === 'levels' && renderLevels()}
      {view === 'lessons' && renderLessons()}
      {view === 'lesson' && renderLessonDetail()}
    </div>
  )
}
