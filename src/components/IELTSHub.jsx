import { useState, useMemo } from 'react'
import { useApp } from '../context/AppContext'
import { calcLevel } from '../context/AppContext'
import { getStageByXP } from '../data/roadmap'
import {
  ieltsBands, ieltsSkills, readinessChecklist,
  ieltsVocabulary, vocabTopics,
} from '../data/ieltsLessons'
import { listeningExercises } from '../data/ieltsListening'
import { readingPassages } from '../data/ieltsReading'
import { writingTasks } from '../data/ieltsWriting'
import { speakingPart1, speakingPart2, speakingPart3 } from '../data/ieltsSpeaking'
import { speak, stopSpeaking, speakDialogue, parseDialogue } from '../utils/speech'
import {
  BookOpen, ChevronLeft, CheckCircle, Circle,
  Volume2, VolumeX, Eye, Search, Target, BarChart2,
  ChevronDown, ChevronUp, Star, Zap,
} from 'lucide-react'

const DEFAULT_PROGRESS = {
  completedListening: [],
  completedReading: [],
  completedWriting: [],
  practicedSpeaking: [],
  learnedVocab: [],
  checkedItems: [],
  targetBand: '6.0',
}

function BoldText({ text }) {
  const parts = text.split(/\*\*([^*]+)\*\*/g)
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1
          ? <strong key={i} className="font-semibold text-indigo-700 dark:text-indigo-300">{part}</strong>
          : part
      )}
    </>
  )
}

// ── OVERVIEW ──────────────────────────────────────────────────────────────────

function OverviewTab({ progress, update }) {
  const TOTALS = {
    listening: listeningExercises.length,
    reading: readingPassages.length,
    writing: writingTasks.task1.length + writingTasks.task2.length,
    speaking: speakingPart1.length + speakingPart2.length + speakingPart3.length,
    vocabulary: ieltsVocabulary.length,
  }
  const done = {
    listening: progress.completedListening.length,
    reading: progress.completedReading.length,
    writing: progress.completedWriting.length,
    speaking: progress.practicedSpeaking.length,
    vocabulary: progress.learnedVocab.length,
  }

  const toggleCheck = (id) => {
    const next = progress.checkedItems.includes(id)
      ? progress.checkedItems.filter(c => c !== id)
      : [...progress.checkedItems, id]
    update({ checkedItems: next })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
          <Target size={20} className="text-indigo-500" /> Mục Tiêu Band Score
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {ieltsBands.map(band => (
            <button key={band.band} onClick={() => update({ targetBand: band.band })}
              className={`p-4 rounded-2xl border-2 text-left transition-all ${
                progress.targetBand === band.band
                  ? `border-indigo-500 ${band.bgColor} shadow-md`
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-indigo-300'
              }`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{band.emoji}</span>
                <span className="font-bold text-sm text-gray-800 dark:text-white">{band.label}</span>
                {progress.targetBand === band.band && <CheckCircle size={14} className="text-indigo-500 ml-auto" />}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{band.desc}</p>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
          <BarChart2 size={20} className="text-indigo-500" /> Tiến Độ Theo Kỹ Năng
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {ieltsSkills.map(skill => {
            const total = TOTALS[skill.id] || skill.total
            const pct = Math.round((done[skill.id] / total) * 100)
            return (
              <div key={skill.id} className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{skill.emoji}</span>
                    <span className="font-semibold text-sm text-gray-800 dark:text-white">{skill.name}</span>
                  </div>
                  <span className="text-xs text-gray-500">{done[skill.id]}/{total}</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                  <div className={`h-2 rounded-full bg-gradient-to-r ${skill.color} transition-all`} style={{ width: `${pct}%` }} />
                </div>
                <p className="text-xs text-gray-400 mt-1">{pct}% hoàn thành</p>
              </div>
            )
          })}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
          <CheckCircle size={20} className="text-indigo-500" /> Checklist Sẵn Sàng Thi
          <span className="ml-auto text-sm font-normal text-gray-500">{progress.checkedItems.length}/{readinessChecklist.length}</span>
        </h3>
        <div className="space-y-2">
          {readinessChecklist.map(item => {
            const checked = progress.checkedItems.includes(item.id)
            return (
              <button key={item.id} onClick={() => toggleCheck(item.id)}
                className={`w-full flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                  checked
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                    : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-indigo-200'
                }`}>
                {checked
                  ? <CheckCircle size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
                  : <Circle size={18} className="text-gray-300 flex-shrink-0 mt-0.5" />}
                <span className={`text-sm flex-1 ${checked ? 'text-green-700 dark:text-green-400 line-through' : 'text-gray-700 dark:text-gray-300'}`}>
                  {item.text}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 flex-shrink-0">{item.category}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ── LISTENING ─────────────────────────────────────────────────────────────────

function ListeningTab({ progress, onComplete }) {
  const [selectedId, setSelectedId] = useState(null)
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [ttsOn, setTtsOn] = useState(false)
  const [activeSeg, setActiveSeg] = useState(-1)

  const ex = listeningExercises.find(e => e.id === selectedId)
  const isDone = id => progress.completedListening.includes(id)

  // A transcript is a dialogue if several lines start with "Name:".
  const isDialogue = ex
    ? (ex.transcript.match(/^[A-Z][A-Za-z .'-]{0,24}:/gm) || []).length >= 2
    : false

  // Pre-split segments so we can highlight the one being spoken (karaoke).
  const segments = useMemo(() => (ex ? parseDialogue(ex.transcript) : []), [ex])

  const playTranscript = () => {
    if (ttsOn) { stopSpeaking(); setTtsOn(false); setActiveSeg(-1); return }
    setTtsOn(true)
    setActiveSeg(-1)
    if (isDialogue) {
      // Two-voice conversation playback with live segment highlighting.
      speakDialogue(ex.transcript, {
        onSegment: (i) => setActiveSeg(i),
        onEnd: () => { setTtsOn(false); setActiveSeg(-1) },
        onError: () => { setTtsOn(false); setActiveSeg(-1) },
      })
    } else {
      speak(ex.transcript, { rate: 0.9, onEnd: () => setTtsOn(false) })
    }
  }

  const score = submitted && ex
    ? ex.questions.filter(q => {
        if (q.type === 'gap_fill' || q.type === 'form_completion' || q.type === 'sentence_completion') {
          return String(answers[q.id] || '').toLowerCase().trim() === String(q.answer || '').toLowerCase().trim()
        }
        return answers[q.id] === q.correct
      }).length
    : 0

  const handleBack = () => {
    stopSpeaking(); setTtsOn(false); setActiveSeg(-1)
    setSelectedId(null); setAnswers({}); setSubmitted(false)
  }

  if (selectedId && ex) {
    return (
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <button onClick={handleBack} className="p-2 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 transition-all">
            <ChevronLeft size={20} />
          </button>
          <div>
            <div className="text-xs text-gray-400">{ex.section}</div>
            <h3 className="font-bold text-gray-800 dark:text-white">{ex.title}</h3>
          </div>
          {isDone(selectedId) && (
            <span className="ml-auto flex items-center gap-1 text-green-600 text-sm font-medium">
              <CheckCircle size={16} /> Đã hoàn thành
            </span>
          )}
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 border border-blue-100 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-200 italic">{ex.context}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
            <span className="font-semibold text-sm text-gray-800 dark:text-white">Transcript</span>
            <button onClick={playTranscript}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                ttsOn ? 'bg-red-100 dark:bg-red-900/30 text-red-600' : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600'
              }`}>
              {ttsOn ? <VolumeX size={13} /> : <Volume2 size={13} />}
              {ttsOn ? 'Dừng' : (isDialogue ? 'Nghe (2 giọng)' : 'Nghe TTS')}
            </button>
          </div>
          {isDialogue ? (
            <div className="p-4 space-y-2 text-sm leading-relaxed max-h-80 overflow-y-auto">
              {segments.map((seg, i) => {
                const active = i === activeSeg
                return (
                  <p
                    key={i}
                    className={`rounded-lg px-2 py-1 transition-colors ${
                      active
                        ? 'bg-indigo-100 dark:bg-indigo-900/40 ring-1 ring-indigo-300 dark:ring-indigo-600'
                        : ''
                    }`}
                  >
                    {seg.speaker !== '__narrator__' && (
                      <span className="font-semibold text-indigo-600 dark:text-indigo-300 mr-1">{seg.speaker}:</span>
                    )}
                    <span className={active ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-600 dark:text-gray-300'}>
                      {seg.text}
                    </span>
                  </p>
                )
              })}
            </div>
          ) : (
            <pre className="p-4 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-sans leading-relaxed">
              {ex.transcript}
            </pre>
          )}
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-gray-800 dark:text-white">Câu hỏi</h4>
          {ex.questions.map((q, idx) => {
            const isText = q.type === 'gap_fill' || q.type === 'form_completion' || q.type === 'sentence_completion'
            const textCorrect = isText && submitted &&
              String(answers[q.id] || '').toLowerCase().trim() === String(q.answer || '').toLowerCase().trim()
            const cardOk = isText ? textCorrect : answers[q.id] === q.correct
            return (
            <div key={q.id} className={`bg-white dark:bg-gray-800 rounded-2xl p-4 border ${
              submitted
                ? cardOk ? 'border-green-300 bg-green-50 dark:bg-green-900/20' : 'border-red-300 bg-red-50 dark:bg-red-900/20'
                : 'border-gray-100 dark:border-gray-700'
            }`}>
              {q.instruction && <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{q.instruction}</p>}
              <p className="text-sm font-semibold text-gray-800 dark:text-white mb-3">{idx + 1}. {q.question}</p>
              {isText ? (
                <div>
                  <input type="text" disabled={submitted}
                    value={answers[q.id] || ''}
                    onChange={e => setAnswers(a => ({ ...a, [q.id]: e.target.value }))}
                    placeholder="Nhập câu trả lời..."
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:border-indigo-400" />
                  {submitted && !textCorrect && (
                    <p className="text-xs text-green-600 dark:text-green-400 mt-2">Đáp án đúng: <strong>{q.answer}</strong></p>
                  )}
                </div>
              ) : (
              <div className="space-y-2">
                {(q.options || []).map((opt, i) => (
                  <label key={i} className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-all ${
                    submitted
                      ? i === q.correct ? 'bg-green-100 dark:bg-green-900/30'
                        : answers[q.id] === i ? 'bg-red-100 dark:bg-red-900/30' : 'opacity-50'
                      : answers[q.id] === i ? 'bg-indigo-50 dark:bg-indigo-900/30' : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}>
                    <input type="radio" name={`lq${q.id}`} disabled={submitted}
                      checked={answers[q.id] === i}
                      onChange={() => setAnswers(a => ({ ...a, [q.id]: i }))}
                      className="accent-indigo-600" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{opt}</span>
                    {submitted && i === q.correct && <CheckCircle size={13} className="text-green-500 ml-auto" />}
                  </label>
                ))}
              </div>
              )}
              {submitted && <p className="text-xs text-gray-400 mt-2 italic">{q.explanation}</p>}
            </div>
            )
          })}
        </div>

        <div className="flex gap-3">
          {!submitted ? (
            <button onClick={() => setSubmitted(true)}
              disabled={Object.keys(answers).length < ex.questions.length}
              className="flex-1 py-3 bg-indigo-600 text-white rounded-2xl font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
              Nộp Bài
            </button>
          ) : (
            <>
              <div className="flex-1 bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-3 text-center border border-gray-100 dark:border-gray-700">
                <div className="text-2xl font-bold text-indigo-600">{score}/{ex.questions.length}</div>
                <div className="text-xs text-gray-500">câu đúng</div>
              </div>
              {!isDone(selectedId) && (
                <button onClick={() => { onComplete(selectedId, ex.xpReward, 'completedListening'); handleBack() }}
                  className="flex-1 py-3 bg-green-600 text-white rounded-2xl font-semibold hover:bg-green-700 flex items-center justify-center gap-2 transition-all">
                  <Zap size={16} /> +{ex.xpReward} XP
                </button>
              )}
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500 dark:text-gray-400">Đọc transcript → Nghe TTS → Trả lời câu hỏi MCQ.</p>
      {listeningExercises.map(e => (
        <button key={e.id}
          onClick={() => { setSelectedId(e.id); setAnswers({}); setSubmitted(false) }}
          className="w-full bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 hover:border-indigo-300 hover:shadow-md transition-all text-left">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs text-gray-400 mb-1">{e.section}</div>
              <h4 className="font-bold text-gray-800 dark:text-white">{e.title}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{e.context}</p>
              <div className="flex gap-3 mt-2">
                <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 px-2 py-0.5 rounded-full">{e.questions.length} câu hỏi</span>
                <span className="text-xs text-gray-400 flex items-center gap-1"><Zap size={11} />{e.xpReward} XP</span>
              </div>
            </div>
            {isDone(e.id)
              ? <CheckCircle size={24} className="text-green-500 flex-shrink-0" />
              : <div className="w-8 h-8 rounded-full border-2 border-gray-200 dark:border-gray-600 flex-shrink-0" />}
          </div>
        </button>
      ))}
    </div>
  )
}

// ── READING ───────────────────────────────────────────────────────────────────

function ReadingTab({ progress, onComplete }) {
  const [selectedId, setSelectedId] = useState(null)
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const p = readingPassages.find(x => x.id === selectedId)
  const isDone = id => progress.completedReading.includes(id)

  const getResult = (q) => {
    if (!submitted) return null
    if (q.type === 'mcq') return answers[q.id] === q.correct
    if (q.type === 'tfng') return answers[q.id]?.toLowerCase() === String(q.answer || '').toLowerCase()
    if (q.type === 'sentence_completion')
      return answers[q.id]?.toLowerCase().trim() === String(q.answer || '').toLowerCase().trim()
    if (q.type === 'matching_headings' || q.type === 'matching_features')
      return Number(answers[q.id]) === Number(q.answer)
    return false
  }

  const score = submitted && p ? p.questions.filter(q => getResult(q)).length : 0

  const handleBack = () => { setSelectedId(null); setAnswers({}); setSubmitted(false) }

  if (selectedId && p) {
    return (
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <button onClick={handleBack} className="p-2 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 transition-all">
            <ChevronLeft size={20} />
          </button>
          <div>
            <div className="text-xs text-gray-400">{p.level} · {p.wordCount} words</div>
            <h3 className="font-bold text-gray-800 dark:text-white">{p.title}</h3>
          </div>
          {isDone(selectedId) && (
            <span className="ml-auto flex items-center gap-1 text-green-600 text-sm font-medium">
              <CheckCircle size={16} /> Hoàn thành
            </span>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            <BoldText text={p.passage} />
          </p>
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-gray-800 dark:text-white">Câu hỏi</h4>
          {p.questions.map((q, idx) => {
            const result = getResult(q)
            return (
              <div key={q.id} className={`bg-white dark:bg-gray-800 rounded-2xl p-4 border ${
                submitted
                  ? result ? 'border-green-300 bg-green-50 dark:bg-green-900/20' : 'border-red-300 bg-red-50 dark:bg-red-900/20'
                  : 'border-gray-100 dark:border-gray-700'
              }`}>
                {q.type === 'tfng' && (
                  <>
                    <p className="text-sm font-semibold text-gray-800 dark:text-white mb-3">{idx + 1}. "{q.statement}"</p>
                    <div className="flex gap-2 flex-wrap">
                      {['True', 'False', 'Not Given'].map(opt => (
                        <label key={opt} className={`flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer border transition-all ${
                          submitted
                            ? opt === q.answer ? 'bg-green-100 border-green-300'
                              : answers[q.id] === opt ? 'bg-red-100 border-red-300' : 'opacity-50 border-gray-200'
                            : answers[q.id] === opt
                              ? 'bg-indigo-50 border-indigo-300 dark:bg-indigo-900/30 dark:border-indigo-600'
                              : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}>
                          <input type="radio" name={`rq${q.id}`} disabled={submitted}
                            checked={answers[q.id] === opt}
                            onChange={() => setAnswers(a => ({ ...a, [q.id]: opt }))}
                            className="accent-indigo-600" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{opt}</span>
                        </label>
                      ))}
                    </div>
                  </>
                )}
                {q.type === 'mcq' && (
                  <>
                    <p className="text-sm font-semibold text-gray-800 dark:text-white mb-3">{idx + 1}. {q.question}</p>
                    <div className="space-y-2">
                      {(q.options || []).map((opt, i) => (
                        <label key={i} className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-all ${
                          submitted
                            ? i === q.correct ? 'bg-green-100 dark:bg-green-900/30'
                              : answers[q.id] === i ? 'bg-red-100 dark:bg-red-900/30' : 'opacity-50'
                            : answers[q.id] === i ? 'bg-indigo-50 dark:bg-indigo-900/30' : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}>
                          <input type="radio" name={`rq${q.id}`} disabled={submitted}
                            checked={answers[q.id] === i}
                            onChange={() => setAnswers(a => ({ ...a, [q.id]: i }))}
                            className="accent-indigo-600" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{opt}</span>
                          {submitted && i === q.correct && <CheckCircle size={13} className="text-green-500 ml-auto" />}
                        </label>
                      ))}
                    </div>
                  </>
                )}
                {q.type === 'sentence_completion' && (
                  <>
                    <p className="text-xs text-gray-400 mb-1">{q.instruction}</p>
                    <p className="text-sm font-semibold text-gray-800 dark:text-white mb-3">{idx + 1}. {q.stem}</p>
                    <input type="text" disabled={submitted}
                      value={answers[q.id] || ''}
                      onChange={e => setAnswers(a => ({ ...a, [q.id]: e.target.value }))}
                      placeholder="Nhập câu trả lời..."
                      className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:border-indigo-400" />
                    {submitted && <p className="text-xs text-gray-500 mt-1">Đáp án: <strong>{q.answer}</strong></p>}
                  </>
                )}
                {(q.type === 'matching_headings' || q.type === 'matching_features') && (
                  <>
                    {q.instruction && <p className="text-xs text-gray-400 mb-1">{q.instruction}</p>}
                    <p className="text-sm font-semibold text-gray-800 dark:text-white mb-3">
                      {idx + 1}. {q.paragraphLabel || q.question}
                    </p>
                    <div className="space-y-2">
                      {(q.options || []).map((opt, i) => (
                        <label key={i} className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-all ${
                          submitted
                            ? i === Number(q.answer) ? 'bg-green-100 dark:bg-green-900/30'
                              : Number(answers[q.id]) === i ? 'bg-red-100 dark:bg-red-900/30' : 'opacity-50'
                            : Number(answers[q.id]) === i ? 'bg-indigo-50 dark:bg-indigo-900/30' : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}>
                          <input type="radio" name={`rq${q.id}`} disabled={submitted}
                            checked={Number(answers[q.id]) === i}
                            onChange={() => setAnswers(a => ({ ...a, [q.id]: i }))}
                            className="accent-indigo-600" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{opt}</span>
                          {submitted && i === Number(q.answer) && <CheckCircle size={13} className="text-green-500 ml-auto" />}
                        </label>
                      ))}
                    </div>
                  </>
                )}
                {submitted && <p className="text-xs text-gray-400 mt-2 italic">{q.explanation}</p>}
              </div>
            )
          })}
        </div>

        <div className="flex gap-3">
          {!submitted ? (
            <button onClick={() => setSubmitted(true)}
              className="flex-1 py-3 bg-indigo-600 text-white rounded-2xl font-semibold hover:bg-indigo-700 transition-all">
              Kiểm Tra Đáp Án
            </button>
          ) : (
            <>
              <div className="flex-1 bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-3 text-center border border-gray-100 dark:border-gray-700">
                <div className="text-2xl font-bold text-indigo-600">{score}/{p.questions.length}</div>
                <div className="text-xs text-gray-500">câu đúng</div>
              </div>
              {!isDone(selectedId) && (
                <button onClick={() => { onComplete(selectedId, p.xpReward, 'completedReading'); handleBack() }}
                  className="flex-1 py-3 bg-green-600 text-white rounded-2xl font-semibold hover:bg-green-700 flex items-center justify-center gap-2 transition-all">
                  <Zap size={16} /> +{p.xpReward} XP
                </button>
              )}
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500 dark:text-gray-400">Đọc passage → Trả lời T/F/NG, MCQ, Sentence Completion.</p>
      {readingPassages.map(r => (
        <button key={r.id}
          onClick={() => { setSelectedId(r.id); setAnswers({}); setSubmitted(false) }}
          className="w-full bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 hover:border-indigo-300 hover:shadow-md transition-all text-left">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs text-gray-400 mb-1">{r.level} · {r.wordCount} words</div>
              <h4 className="font-bold text-gray-800 dark:text-white">{r.title}</h4>
              <div className="flex gap-3 mt-2">
                <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-600 px-2 py-0.5 rounded-full">{r.questions.length} câu hỏi</span>
                <span className="text-xs text-gray-400 flex items-center gap-1"><Zap size={11} />{r.xpReward} XP</span>
              </div>
            </div>
            {isDone(r.id)
              ? <CheckCircle size={24} className="text-green-500 flex-shrink-0" />
              : <div className="w-8 h-8 rounded-full border-2 border-gray-200 dark:border-gray-600 flex-shrink-0" />}
          </div>
        </button>
      ))}
    </div>
  )
}

// ── WRITING ───────────────────────────────────────────────────────────────────

function WritingTab({ progress, onComplete }) {
  const [subTab, setSubTab] = useState('task1')
  const [selectedId, setSelectedId] = useState(null)
  const [localChecks, setLocalChecks] = useState({})
  const [showTpl, setShowTpl] = useState(false)
  const [showSample, setShowSample] = useState(false)

  const tasks = subTab === 'task1' ? writingTasks.task1 : writingTasks.task2
  const task = tasks.find(t => t.id === selectedId)
  const isDone = id => progress.completedWriting.includes(id)

  const handleBack = () => {
    setSelectedId(null); setLocalChecks({})
    setShowTpl(false); setShowSample(false)
  }

  if (selectedId && task) {
    return (
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <button onClick={handleBack} className="p-2 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 transition-all">
            <ChevronLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span>{task.emoji}</span><span>{task.typeVi}</span>
            </div>
            <h3 className="font-bold text-gray-800 dark:text-white">{task.title}</h3>
          </div>
          {isDone(selectedId) && (
            <span className="ml-auto flex items-center gap-1 text-green-600 text-sm font-medium">
              <CheckCircle size={16} /> Hoàn thành
            </span>
          )}
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-4 border border-amber-100 dark:border-amber-800">
          <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1">Đề bài:</p>
          <p className="text-sm text-amber-900 dark:text-amber-100">{task.prompt}</p>
        </div>

        {task.chartDescription && (
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-4 border border-gray-200 dark:border-gray-600">
            <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Mô tả biểu đồ</p>
            <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-sans">{task.chartDescription}</pre>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          <button onClick={() => setShowTpl(v => !v)}
            className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
            <span className="flex items-center gap-2"><BookOpen size={15} className="text-indigo-500" />Template & Cấu trúc</span>
            {showTpl ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>
          {showTpl && (
            <pre className="px-4 pb-4 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-sans leading-relaxed border-t border-gray-100 dark:border-gray-700 mt-0 pt-3">
              {task.template}
            </pre>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          <button onClick={() => setShowSample(v => !v)}
            className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
            <span className="flex items-center gap-2"><Eye size={15} className="text-green-500" />Bài Mẫu</span>
            {showSample ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>
          {showSample && (
            <pre className="px-4 pb-4 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-sans leading-relaxed border-t border-gray-100 dark:border-gray-700 pt-3">
              {task.sampleAnswer}
            </pre>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4">
          <h4 className="font-semibold text-sm text-gray-800 dark:text-white mb-3 flex items-center gap-2">
            <CheckCircle size={15} className="text-indigo-500" /> Tự Kiểm Tra
            <span className="ml-auto text-xs text-gray-400">{Object.values(localChecks).filter(Boolean).length}/{task.checklist.length}</span>
          </h4>
          {['Task Achievement', 'Coherence', 'Vocabulary', 'Grammar'].map(cat => {
            const items = task.checklist.filter(i => i.category === cat)
            if (!items.length) return null
            return (
              <div key={cat} className="mb-3">
                <p className="text-xs font-bold text-gray-400 uppercase mb-1.5">{cat}</p>
                {items.map(item => (
                  <button key={item.id} onClick={() => setLocalChecks(c => ({ ...c, [item.id]: !c[item.id] }))}
                    className={`w-full flex items-start gap-2 p-2 rounded-xl text-left transition-all mb-1 ${
                      localChecks[item.id] ? 'bg-green-50 dark:bg-green-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}>
                    {localChecks[item.id]
                      ? <CheckCircle size={14} className="text-green-500 flex-shrink-0 mt-0.5" />
                      : <Circle size={14} className="text-gray-300 flex-shrink-0 mt-0.5" />}
                    <span className={`text-xs ${localChecks[item.id] ? 'text-green-700 dark:text-green-400 line-through' : 'text-gray-600 dark:text-gray-400'}`}>
                      {item.item}
                    </span>
                  </button>
                ))}
              </div>
            )
          })}
        </div>

        {!isDone(selectedId) && (
          <button onClick={() => { onComplete(selectedId, task.xpReward, 'completedWriting'); handleBack() }}
            className="w-full py-3 bg-green-600 text-white rounded-2xl font-semibold hover:bg-green-700 flex items-center justify-center gap-2 transition-all">
            <Zap size={16} /> Đánh Dấu Đã Xem · +{task.xpReward} XP
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {['task1', 'task2'].map(t => (
          <button key={t} onClick={() => { setSubTab(t); setSelectedId(null) }}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              subTab === t ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
            }`}>
            {t === 'task1' ? 'Task 1 — Data' : 'Task 2 — Essay'}
          </button>
        ))}
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {subTab === 'task1' ? 'Mô tả biểu đồ/dữ liệu. Tối thiểu 150 từ.' : 'Bài luận học thuật. Tối thiểu 250 từ.'}
      </p>
      {tasks.map(t => (
        <button key={t.id} onClick={() => setSelectedId(t.id)}
          className="w-full bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 hover:border-indigo-300 hover:shadow-md transition-all text-left">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0 mr-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{t.emoji}</span>
                <span className="text-xs text-gray-400">{t.typeVi}</span>
              </div>
              <h4 className="font-bold text-gray-800 dark:text-white">{t.title}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{t.prompt}</p>
              <span className="text-xs text-gray-400 flex items-center gap-1 mt-2"><Zap size={11} />{t.xpReward} XP</span>
            </div>
            {isDone(t.id)
              ? <CheckCircle size={24} className="text-green-500 flex-shrink-0" />
              : <div className="w-8 h-8 rounded-full border-2 border-gray-200 dark:border-gray-600 flex-shrink-0" />}
          </div>
        </button>
      ))}
    </div>
  )
}

// ── SPEAKING ──────────────────────────────────────────────────────────────────

function SpeakingTab({ progress, onPractice }) {
  const [subTab, setSubTab] = useState('part1')
  const [expandedId, setExpandedId] = useState(null)
  const [ttsId, setTtsId] = useState(null)

  const isPracticed = id => progress.practicedSpeaking.includes(id)

  const playAnswer = (id, text) => {
    if (ttsId === id) { stopSpeaking(); setTtsId(null); return }
    stopSpeaking()
    setTtsId(id)
    speak(text, { rate: 0.85, onEnd: () => setTtsId(null) })
  }

  const toggle = (id) => {
    if (ttsId) { stopSpeaking(); setTtsId(null) }
    setExpandedId(prev => prev === id ? null : id)
  }

  const changeSubTab = (t) => {
    stopSpeaking(); setTtsId(null); setExpandedId(null); setSubTab(t)
  }

  const CardWrapper = ({ id, topicLabel, topicColor, header, children }) => (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl border transition-all ${
      expandedId === id ? 'border-indigo-300 dark:border-indigo-600 shadow-md' : 'border-gray-100 dark:border-gray-700'
    }`}>
      <button onClick={() => toggle(id)} className="w-full flex items-center justify-between p-4 text-left">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className={`text-xs px-2 py-0.5 rounded-full ${topicColor}`}>{topicLabel}</span>
            {isPracticed(id) && <CheckCircle size={13} className="text-green-500" />}
          </div>
          {header}
        </div>
        {expandedId === id ? <ChevronUp size={15} className="text-gray-400 ml-2 flex-shrink-0" /> : <ChevronDown size={15} className="text-gray-400 ml-2 flex-shrink-0" />}
      </button>
      {expandedId === id && (
        <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700">
          {children}
        </div>
      )}
    </div>
  )

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {[
          { id: 'part1', label: 'Part 1 — Q&A' },
          { id: 'part2', label: 'Part 2 — Cue Card' },
          { id: 'part3', label: 'Part 3 — Discussion' },
        ].map(pt => (
          <button key={pt.id} onClick={() => changeSubTab(pt.id)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              subTab === pt.id ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
            }`}>
            {pt.label}
          </button>
        ))}
      </div>

      {subTab === 'part1' && (
        <div className="space-y-3">
          <p className="text-sm text-gray-500 dark:text-gray-400">Câu hỏi về cuộc sống thường ngày. Trả lời 2–3 câu mỗi câu hỏi.</p>
          {speakingPart1.map(q => (
            <CardWrapper key={q.id} id={q.id}
              topicLabel={q.topic} topicColor="bg-red-100 text-red-600"
              header={<p className="text-sm font-semibold text-gray-800 dark:text-white">{q.question}</p>}>
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <button onClick={() => playAnswer(q.id, q.sampleAnswer)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    ttsId === q.id ? 'bg-red-100 text-red-600' : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600'
                  }`}>
                  {ttsId === q.id ? <VolumeX size={13} /> : <Volume2 size={13} />}
                  {ttsId === q.id ? 'Dừng' : 'Nghe'}
                </button>
                {q.keywords.map(kw => (
                  <span key={kw} className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 px-1.5 py-0.5 rounded">{kw}</span>
                ))}
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mt-3">{q.sampleAnswer}</p>
              <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-3 mt-3">
                <p className="text-xs text-indigo-700 dark:text-indigo-300"><strong>Tip:</strong> {q.tip}</p>
              </div>
              {!isPracticed(q.id) && (
                <button onClick={() => onPractice(q.id)}
                  className="mt-3 w-full py-2 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition-all flex items-center justify-center gap-1.5">
                  <CheckCircle size={14} /> Đã Luyện · +5 XP
                </button>
              )}
            </CardWrapper>
          ))}
        </div>
      )}

      {subTab === 'part2' && (
        <div className="space-y-3">
          <p className="text-sm text-gray-500 dark:text-gray-400">Thẻ chủ đề — nói 1–2 phút liên tục không ngừng.</p>
          {speakingPart2.map(q => (
            <CardWrapper key={q.id} id={q.id}
              topicLabel={q.topic} topicColor="bg-purple-100 text-purple-600"
              header={<p className="text-sm font-semibold text-gray-800 dark:text-white">Cue Card: {q.topic}</p>}>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 mt-3">
                <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-sans">{q.cueCard}</pre>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 mt-2">
                <p className="text-xs text-blue-700 dark:text-blue-300"><strong>Chuẩn bị:</strong> {q.preparationTip}</p>
              </div>
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <button onClick={() => playAnswer(q.id, q.sampleAnswer)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    ttsId === q.id ? 'bg-red-100 text-red-600' : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600'
                  }`}>
                  {ttsId === q.id ? <VolumeX size={13} /> : <Volume2 size={13} />}
                  {ttsId === q.id ? 'Dừng' : 'Nghe Bài Mẫu'}
                </button>
                {q.keywords.map(kw => (
                  <span key={kw} className="text-xs bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded">{kw}</span>
                ))}
              </div>
              <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-sans leading-relaxed mt-3">{q.sampleAnswer}</pre>
              {!isPracticed(q.id) && (
                <button onClick={() => onPractice(q.id)}
                  className="mt-3 w-full py-2 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition-all flex items-center justify-center gap-1.5">
                  <CheckCircle size={14} /> Đã Luyện · +5 XP
                </button>
              )}
            </CardWrapper>
          ))}
        </div>
      )}

      {subTab === 'part3' && (
        <div className="space-y-3">
          <p className="text-sm text-gray-500 dark:text-gray-400">Câu hỏi thảo luận học thuật. Đưa ra quan điểm và lập luận.</p>
          {speakingPart3.map(q => (
            <CardWrapper key={q.id} id={q.id}
              topicLabel={q.topic} topicColor="bg-orange-100 text-orange-600"
              header={<p className="text-sm font-semibold text-gray-800 dark:text-white">{q.question}</p>}>
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <button onClick={() => playAnswer(q.id, q.sampleAnswer)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    ttsId === q.id ? 'bg-red-100 text-red-600' : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600'
                  }`}>
                  {ttsId === q.id ? <VolumeX size={13} /> : <Volume2 size={13} />}
                  {ttsId === q.id ? 'Dừng' : 'Nghe'}
                </button>
                {q.keywords.map(kw => (
                  <span key={kw} className="text-xs bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded">{kw}</span>
                ))}
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mt-3">{q.sampleAnswer}</p>
              {!isPracticed(q.id) && (
                <button onClick={() => onPractice(q.id)}
                  className="mt-3 w-full py-2 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition-all flex items-center justify-center gap-1.5">
                  <CheckCircle size={14} /> Đã Luyện · +5 XP
                </button>
              )}
            </CardWrapper>
          ))}
        </div>
      )}
    </div>
  )
}

// ── VOCABULARY ────────────────────────────────────────────────────────────────

function VocabTab({ progress, onLearn }) {
  const [search, setSearch] = useState('')
  const [topicFilter, setTopicFilter] = useState('all')
  const [expandedWord, setExpandedWord] = useState(null)

  const filtered = ieltsVocabulary.filter(w => {
    const matchTopic = topicFilter === 'all' || w.topic === topicFilter
    const matchSearch = !search ||
      w.word.toLowerCase().includes(search.toLowerCase()) ||
      w.vi.includes(search)
    return matchTopic && matchSearch
  })

  const isLearned = word => progress.learnedVocab.includes(word)
  const pct = Math.round((progress.learnedVocab.length / ieltsVocabulary.length) * 100)

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600 dark:text-gray-400 font-medium">Từ đã học</span>
          <span className="font-bold text-indigo-600">{progress.learnedVocab.length}/{ieltsVocabulary.length}</span>
        </div>
        <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3">
          <div className="h-3 rounded-full bg-gradient-to-r from-purple-400 to-indigo-500 transition-all" style={{ width: `${pct}%` }} />
        </div>
        <p className="text-xs text-gray-400 mt-1">{pct}% IELTS Academic Vocabulary</p>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Tìm từ..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:border-indigo-400" />
        </div>
        <select value={topicFilter} onChange={e => setTopicFilter(e.target.value)}
          className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none">
          <option value="all">Tất cả</option>
          {vocabTopics.map(t => (
            <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filtered.map(w => {
          const learned = isLearned(w.word)
          const expanded = expandedWord === w.word
          return (
            <div key={w.word} className={`rounded-2xl border transition-all ${
              learned
                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700'
            }`}>
              <button onClick={() => setExpandedWord(expanded ? null : w.word)}
                className="w-full flex items-start justify-between p-4 text-left">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`font-bold ${learned ? 'text-green-700 dark:text-green-400' : 'text-gray-800 dark:text-white'}`}>
                      {w.word}
                    </span>
                    {learned && <CheckCircle size={13} className="text-green-500" />}
                  </div>
                  <span className="text-xs text-gray-400">{w.pronunciation}</span>
                  <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">{w.vi}</p>
                </div>
                <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                  <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 px-2 py-0.5 rounded-full">{w.topic}</span>
                  {expanded ? <ChevronUp size={13} className="text-gray-400" /> : <ChevronDown size={13} className="text-gray-400" />}
                </div>
              </button>
              {expanded && (
                <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700 space-y-2 pt-2">
                  <p className="text-xs text-gray-600 dark:text-gray-400 italic">"{w.example}"</p>
                  <div className="flex flex-wrap gap-1">
                    {(w.collocation || '').split(' / ').filter(Boolean).map(c => (
                      <span key={c} className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full">{c}</span>
                    ))}
                  </div>
                  {!learned && (
                    <button onClick={() => onLearn(w.word)}
                      className="w-full py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition-all flex items-center justify-center gap-1.5">
                      <Star size={12} /> Đã Học · +10 XP
                    </button>
                  )}
                </div>
              )}
            </div>
          )
        })}
        {filtered.length === 0 && (
          <p className="col-span-2 text-center py-10 text-gray-400">Không tìm thấy từ nào.</p>
        )}
      </div>
    </div>
  )
}

// ── MAIN ──────────────────────────────────────────────────────────────────────

export default function IELTSHub() {
  const { state, dispatch } = useApp()
  const [activeTab, setActiveTab] = useState('overview')

  const ieltsProgress = state.ieltsProgress || DEFAULT_PROGRESS

  const saveProgress = (updates, xpAmount = 0) => {
    const newProgress = { ...ieltsProgress, ...updates }
    const newXP = (state.xp || 0) + xpAmount
    dispatch({
      type: 'LOAD_STATE',
      payload: {
        ...state,
        ieltsProgress: newProgress,
        xp: newXP,
        level: calcLevel(newXP),
        currentStageId: getStageByXP(newXP).id,
        totalPoints: (state.totalPoints || 0) + xpAmount,
        dailyProgress: (state.dailyProgress || 0) + (xpAmount > 0 ? 1 : 0),
      },
    })
  }

  const handleComplete = (id, xpReward, completedKey) => {
    if (ieltsProgress[completedKey]?.includes(id)) return
    saveProgress({ [completedKey]: [...(ieltsProgress[completedKey] || []), id] }, xpReward)
  }

  const handleLearnVocab = (word) => {
    if (ieltsProgress.learnedVocab.includes(word)) return
    saveProgress({ learnedVocab: [...ieltsProgress.learnedVocab, word] }, 10)
  }

  const handlePractice = (id) => {
    if (ieltsProgress.practicedSpeaking.includes(id)) return
    saveProgress({ practicedSpeaking: [...ieltsProgress.practicedSpeaking, id] }, 5)
  }

  const tabs = [
    { id: 'overview',   label: 'Tổng Quan',  icon: '🎯' },
    { id: 'listening',  label: 'Listening',  icon: '🎧' },
    { id: 'reading',    label: 'Reading',    icon: '📖' },
    { id: 'writing',    label: 'Writing',    icon: '✍️' },
    { id: 'speaking',   label: 'Speaking',   icon: '🎤' },
    { id: 'vocabulary', label: 'Vocabulary', icon: '📚' },
  ]

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-200 animate-gradient-x rounded-3xl p-6 text-white relative overflow-hidden">
        <div className="blob bg-pink-400/40 w-44 h-44 -top-10 -right-10" />
        <div className="blob bg-indigo-300/40 w-36 h-36 -bottom-12 -left-10 animate-float-slow" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl animate-float">🏆</span>
            <div>
              <h1 className="text-2xl font-bold">IELTS Hub</h1>
              <p className="text-indigo-200 text-sm">Từ mất gốc → Band {ieltsProgress.targetBand}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm bg-white/20 px-3 py-1.5 rounded-xl hover:scale-105 transition-transform">🎧 {ieltsProgress.completedListening.length}/{listeningExercises.length}</span>
            <span className="text-sm bg-white/20 px-3 py-1.5 rounded-xl hover:scale-105 transition-transform">📖 {ieltsProgress.completedReading.length}/{readingPassages.length}</span>
            <span className="text-sm bg-white/20 px-3 py-1.5 rounded-xl hover:scale-105 transition-transform">✍️ {ieltsProgress.completedWriting.length}/{writingTasks.task1.length + writingTasks.task2.length}</span>
            <span className="text-sm bg-white/20 px-3 py-1.5 rounded-xl hover:scale-105 transition-transform">🎤 {ieltsProgress.practicedSpeaking.length}/{speakingPart1.length + speakingPart2.length + speakingPart3.length}</span>
            <span className="text-sm bg-white/20 px-3 py-1.5 rounded-xl hover:scale-105 transition-transform">📚 {ieltsProgress.learnedVocab.length}/{ieltsVocabulary.length}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105 ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-indigo-300'
            }`}>
            <span>{tab.icon}</span>{tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview'   && <OverviewTab  progress={ieltsProgress} update={updates => saveProgress(updates)} />}
      {activeTab === 'listening'  && <ListeningTab progress={ieltsProgress} onComplete={handleComplete} />}
      {activeTab === 'reading'    && <ReadingTab   progress={ieltsProgress} onComplete={handleComplete} />}
      {activeTab === 'writing'    && <WritingTab   progress={ieltsProgress} onComplete={handleComplete} />}
      {activeTab === 'speaking'   && <SpeakingTab  progress={ieltsProgress} onPractice={handlePractice} />}
      {activeTab === 'vocabulary' && <VocabTab     progress={ieltsProgress} onLearn={handleLearnVocab} />}
    </div>
  )
}
