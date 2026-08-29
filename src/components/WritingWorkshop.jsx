import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useApp } from '../context/AppContext'
import { writingTasks } from '../data/ieltsWriting'
import { ieltsVocabulary } from '../data/ieltsLessons'
import {
  Timer, PlayCircle, PauseCircle, RotateCcw, CheckCircle,
  ChevronLeft, ChevronRight, Eye, EyeOff, BookOpen,
  Zap, Target, Save, Star, AlertCircle, PenTool,
} from 'lucide-react'
import { ProgressRing } from './AudioVisuals'
import { scoreWriting } from '../utils/writingScorer'

// ── Constants ──────────────────────────────────────────────────────────────
const TASK_CONFIG = {
  task1: { label: 'Task 1', minWords: 150, minutes: 20, color: 'from-blue-500 to-cyan-500', accent: 'indigo' },
  task2: { label: 'Task 2', minWords: 250, minutes: 40, color: 'from-purple-500 to-indigo-600', accent: 'purple' },
}
const DRAFT_KEY = (id) => `emi_writing_draft_${id}`

// ── Helpers ────────────────────────────────────────────────────────────────
function countWords(text) {
  return text.trim() ? text.trim().split(/\s+/).length : 0
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

// ── IELTS vocab set for fast lookup ───────────────────────────────────────
const ieltsWordSet = new Set(ieltsVocabulary.map(v => v.word.toLowerCase()))

function getIeltsWordsUsed(text) {
  if (!text.trim()) return []
  const words = text.toLowerCase().match(/[a-z]+/g) || []
  const found = new Set()
  words.forEach(w => { if (ieltsWordSet.has(w)) found.add(w) })
  return [...found]
}

// ── Highlighted text overlay ───────────────────────────────────────────────
// Renders text with IELTS words highlighted as background layer under textarea
function HighlightLayer({ text, style }) {
  const parts = useMemo(() => {
    if (!text) return [{ type: 'text', content: '' }]
    const regex = /([a-zA-Z]+)/g
    const result = []
    let last = 0; let m
    while ((m = regex.exec(text)) !== null) {
      if (m.index > last) result.push({ type: 'text', content: text.slice(last, m.index) })
      const word = m[1]
      result.push({
        type: ieltsWordSet.has(word.toLowerCase()) ? 'highlight' : 'word',
        content: word,
      })
      last = m.index + m[0].length
    }
    if (last < text.length) result.push({ type: 'text', content: text.slice(last) })
    return result
  }, [text])

  return (
    <div aria-hidden className="absolute inset-0 pointer-events-none overflow-auto whitespace-pre-wrap break-words" style={style}>
      {parts.map((p, i) =>
        p.type === 'highlight'
          ? <mark key={i} className="bg-indigo-100 dark:bg-indigo-900/50 text-transparent rounded-sm">{p.content}</mark>
          : <span key={i} className="text-transparent">{p.content}</span>
      )}
    </div>
  )
}

// ── Timer hook ────────────────────────────────────────────────────────────
function useTimer(totalSeconds) {
  const [remaining, setRemaining] = useState(totalSeconds)
  const [running, setRunning] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    setRemaining(totalSeconds)
    setRunning(false)
  }, [totalSeconds])

  useEffect(() => {
    if (running) {
      ref.current = setInterval(() => {
        setRemaining(r => {
          if (r <= 1) { clearInterval(ref.current); setRunning(false); return 0 }
          return r - 1
        })
      }, 1000)
    } else {
      clearInterval(ref.current)
    }
    return () => clearInterval(ref.current)
  }, [running])

  const reset = () => { setRemaining(totalSeconds); setRunning(false) }
  return { remaining, running, setRunning, reset }
}

// ── Writing Editor ────────────────────────────────────────────────────────
function WritingEditor({ task, taskType, onSubmit, onBack }) {
  const cfg = TASK_CONFIG[taskType]
  const [text, setText] = useState(() => {
    try { return localStorage.getItem(DRAFT_KEY(task.id)) || '' } catch { return '' }
  })
  const [phase, setPhase] = useState('write') // write | review | done
  const [checked, setChecked] = useState({})
  const [showSample, setShowSample] = useState(false)
  const [showTemplate, setShowTemplate] = useState(false)
  const { remaining, running, setRunning, reset } = useTimer(cfg.minutes * 60)
  const taRef = useRef(null)

  const wc = countWords(text)
  const ieltsUsed = useMemo(() => getIeltsWordsUsed(text), [text])
  const checkedCount = Object.values(checked).filter(Boolean).length
  const analysis = useMemo(
    () => (phase === 'done'
      ? scoreWriting(text, { minWords: cfg.minWords, taskNo: taskType === 'task2' ? 2 : 1 })
      : null),
    [phase, text, cfg.minWords, taskType]
  )
  const band = analysis ? analysis.overall.toFixed(1) : null

  const sharedStyle = {
    fontFamily: 'inherit',
    fontSize: '0.875rem',
    lineHeight: '1.75',
    padding: '0.75rem 1rem',
    margin: 0,
    border: 'none',
    outline: 'none',
    resize: 'none',
    width: '100%',
    minHeight: '240px',
    boxSizing: 'border-box',
    letterSpacing: 'normal',
    wordSpacing: 'normal',
  }

  const saveDraft = useCallback(() => {
    try { localStorage.setItem(DRAFT_KEY(task.id), text) } catch {}
  }, [task.id, text])

  useEffect(() => {
    const t = setTimeout(saveDraft, 1000)
    return () => clearTimeout(t)
  }, [text, saveDraft])

  const timerPct = (remaining / (cfg.minutes * 60)) * 100
  const timerColor = remaining < 120 ? 'text-red-500' : remaining < 300 ? 'text-orange-500' : 'text-indigo-600 dark:text-indigo-400'

  // ── done phase ────────────────────────────────────────────────────────
  if (phase === 'done') {
    return (
      <div className="space-y-4">
        <button onClick={onBack} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
          <ChevronLeft size={16}/> Quay lại
        </button>
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 text-white text-center shadow-xl">
          <div className="text-4xl mb-2">🎉</div>
          <h2 className="text-xl font-bold">Hoàn thành bài viết!</h2>
          <p className="text-indigo-200 text-sm mt-1">{wc} từ · {checkedCount}/{task.checklist.length} tiêu chí tự đánh giá</p>
          {band && (
            <div className="mt-3 inline-block bg-white/20 rounded-2xl px-5 py-2">
              <div className="text-xs text-indigo-200">Ước tính Band (tự động)</div>
              <div className="text-3xl font-bold">{band}</div>
            </div>
          )}
        </div>

        {analysis && analysis.overall > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
            <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-1 flex items-center gap-2">
              <Target size={16} className="text-indigo-500" /> Phân tích 4 tiêu chí
            </h3>
            <p className="text-xs text-gray-400 mb-3">Chấm tự động bằng heuristic — tham khảo, không thay người chấm.</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
              {[
                { key: 'TR', label: 'Task Response' },
                { key: 'CC', label: 'Coherence' },
                { key: 'LR', label: 'Lexical' },
                { key: 'GRA', label: 'Grammar' },
              ].map(c => (
                <div key={c.key} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 text-center">
                  <div className="text-lg font-bold text-indigo-600 dark:text-indigo-300">{analysis.criteria[c.key].toFixed(1)}</div>
                  <div className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight mt-0.5">{c.label}</div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2 mb-4 text-center">
              <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg py-2">
                <div className="text-sm font-bold text-gray-700 dark:text-gray-200">{analysis.stats.linkerVariety}</div>
                <div className="text-[10px] text-gray-500">từ nối</div>
              </div>
              <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg py-2">
                <div className="text-sm font-bold text-gray-700 dark:text-gray-200">{analysis.stats.ttr}%</div>
                <div className="text-[10px] text-gray-500">đa dạng từ</div>
              </div>
              <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg py-2">
                <div className="text-sm font-bold text-gray-700 dark:text-gray-200">{analysis.stats.complexCount}</div>
                <div className="text-[10px] text-gray-500">câu phức</div>
              </div>
            </div>
            <div className="space-y-1.5">
              {analysis.feedback.map((f, i) => (
                <p key={i} className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{f}</p>
              ))}
            </div>
          </div>
        )}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
          <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-3">Bài viết của bạn</h3>
          <div className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
            {text}
          </div>
          {ieltsUsed.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              <span className="text-xs text-gray-500 self-center">✨ IELTS words:</span>
              {ieltsUsed.map(w => (
                <span key={w} className="bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-xs px-2 py-0.5 rounded-full font-medium">{w}</span>
              ))}
            </div>
          )}
        </div>
        <button onClick={() => { setPhase('write'); setChecked({}) }}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-colors"
        >Viết lại</button>
      </div>
    )
  }

  // ── review phase ──────────────────────────────────────────────────────
  if (phase === 'review') {
    const byCategory = task.checklist.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = []
      acc[item.category].push(item)
      return acc
    }, {})
    return (
      <div className="space-y-4">
        <button onClick={() => setPhase('write')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
          <ChevronLeft size={16}/> Sửa bài
        </button>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
          <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-1">Tự Đánh Giá</h3>
          <p className="text-xs text-gray-400 mb-4">Đánh dấu những tiêu chí bạn đã đạt được</p>
          {Object.entries(byCategory).map(([cat, items]) => (
            <div key={cat} className="mb-4">
              <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide mb-2">{cat}</div>
              <div className="space-y-2">
                {items.map(item => (
                  <label key={item.id} className="flex items-start gap-3 cursor-pointer group">
                    <div className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                      checked[item.id] ? 'bg-green-500 border-green-500' : 'border-gray-300 dark:border-gray-600 group-hover:border-green-400'
                    }`}
                      onClick={() => setChecked(c => ({ ...c, [item.id]: !c[item.id] }))}
                    >
                      {checked[item.id] && <CheckCircle size={12} className="text-white" />}
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300 leading-snug">{item.item}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3 flex items-center justify-between mt-2">
            <span className="text-sm text-gray-600 dark:text-gray-300">Đạt: <span className="font-bold">{checkedCount}/{task.checklist.length}</span></span>
            <span className="text-sm text-gray-500">{wc} từ</span>
          </div>
        </div>
        <button onClick={() => { onSubmit(task, wc, checkedCount); setPhase('done') }}
          className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-2xl hover:opacity-90 transition-opacity shadow-md"
        >
          ✅ Hoàn Thành +{task.xpReward} XP
        </button>
      </div>
    )
  }

  // ── write phase ───────────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      <button onClick={onBack} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
        <ChevronLeft size={16}/> Danh sách task
      </button>

      {/* Task header */}
      <div className={`bg-gradient-to-r ${cfg.color} rounded-3xl p-5 text-white shadow-lg`}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{task.type} · {cfg.label}</span>
            <h2 className="text-lg font-bold mt-1 leading-snug">{task.title}</h2>
          </div>
          <div className="text-2xl flex-shrink-0">{task.emoji}</div>
        </div>
        <div className="mt-3 bg-white/10 rounded-xl p-3 text-sm text-white/90 leading-relaxed">
          {task.prompt}
        </div>
        {task.chartDescription && (
          <div className="mt-2 bg-black/20 rounded-xl p-3 text-xs text-white/80 whitespace-pre-line">
            {task.chartDescription}
          </div>
        )}
      </div>

      {/* Timer row */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Timer size={16} className={timerColor} />
          <span className={`text-xl font-mono font-bold ${timerColor}`}>{formatTime(remaining)}</span>
          <div className="w-20 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all ${remaining < 120 ? 'bg-red-500' : remaining < 300 ? 'bg-orange-400' : 'bg-indigo-500'}`}
              style={{ width: `${timerPct}%` }} />
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setRunning(r => !r)}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-indigo-600 dark:text-indigo-400 transition-colors">
            {running ? <PauseCircle size={20}/> : <PlayCircle size={20}/>}
          </button>
          <button onClick={reset} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 transition-colors">
            <RotateCcw size={16}/>
          </button>
        </div>
      </div>

      {/* Writing area with highlight overlay */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm focus-within:border-indigo-400 transition-colors">
        <div className="relative" style={{ minHeight: '240px' }}>
          <HighlightLayer text={text} style={{ ...sharedStyle, color: 'transparent', background: 'transparent', zIndex: 0 }} />
          <textarea
            ref={taRef}
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder={`Bắt đầu viết bài ${cfg.label} của bạn tại đây...\n\nGợi ý: Nhập ít nhất ${cfg.minWords} từ. Từ IELTS trong kho sẽ được highlight tự động.`}
            style={{ ...sharedStyle, position: 'relative', zIndex: 1, background: 'transparent', color: 'inherit' }}
            className="text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 caret-indigo-500"
            spellCheck
          />
        </div>

        {/* Word count bar */}
        <div className="px-4 py-2.5 border-t border-gray-100 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-indigo-50/40 dark:from-gray-700/50 dark:to-indigo-900/20 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <ProgressRing
              pct={Math.min(100, Math.round((wc / cfg.minWords) * 100))}
              size={42} stroke={4}
              gradient={wc >= cfg.minWords ? ['#10b981', '#059669'] : wc >= cfg.minWords * 0.8 ? ['#f59e0b', '#ea580c'] : ['#9ca3af', '#6b7280']}
            >
              <span className="text-[9px] font-bold text-gray-600 dark:text-gray-300">{Math.min(100, Math.round((wc / cfg.minWords) * 100))}%</span>
            </ProgressRing>
            <div>
              <span className={`text-sm font-bold ${wc >= cfg.minWords ? 'text-green-600' : wc >= cfg.minWords * 0.8 ? 'text-orange-500' : 'text-gray-500'}`}>
                {wc} / {cfg.minWords} từ
              </span>
              {wc >= cfg.minWords && <CheckCircle size={14} className="inline ml-1 text-green-500"/>}
              {wc < cfg.minWords && wc > 0 && (
                <div className="text-xs text-gray-400">còn {cfg.minWords - wc} từ nữa</div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {ieltsUsed.length > 0 && (
              <span className="text-xs bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 px-2 py-0.5 rounded-full font-medium">
                ✨ {ieltsUsed.length} IELTS words
              </span>
            )}
            <button onClick={saveDraft} className="p-1 text-gray-400 hover:text-indigo-500 transition-colors" title="Lưu nháp">
              <Save size={14}/>
            </button>
          </div>
        </div>

        {/* Min-words progress bar */}
        <div className="h-1 bg-gray-100 dark:bg-gray-700">
          <div className={`h-1 transition-all duration-300 ${wc >= cfg.minWords ? 'bg-green-500' : 'bg-indigo-400'}`}
            style={{ width: `${Math.min((wc / cfg.minWords) * 100, 100)}%` }} />
        </div>
      </div>

      {/* Template + Sample collapsibles */}
      <div className="space-y-2">
        <button onClick={() => setShowTemplate(t => !t)}
          className="w-full flex items-center justify-between px-4 py-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800 text-sm font-medium text-blue-700 dark:text-blue-300 hover:bg-blue-100 transition-colors"
        >
          <div className="flex items-center gap-2"><BookOpen size={15}/> Cấu Trúc & Từ Ngữ Chính</div>
          <ChevronRight size={14} className={`transition-transform ${showTemplate ? 'rotate-90' : ''}`}/>
        </button>
        {showTemplate && (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-xs text-gray-700 dark:text-gray-300 whitespace-pre-line border border-blue-100 dark:border-blue-800 leading-relaxed max-h-64 overflow-y-auto">
            {task.template}
          </div>
        )}
        <button onClick={() => setShowSample(s => !s)}
          className="w-full flex items-center justify-between px-4 py-3 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-800 text-sm font-medium text-green-700 dark:text-green-300 hover:bg-green-100 transition-colors"
        >
          <div className="flex items-center gap-2"><Eye size={15}/>{showSample ? ' Ẩn bài mẫu' : ' Xem bài mẫu'}</div>
          <ChevronRight size={14} className={`transition-transform ${showSample ? 'rotate-90' : ''}`}/>
        </button>
        {showSample && (
          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 text-xs text-gray-700 dark:text-gray-300 whitespace-pre-line border border-green-100 dark:border-green-800 leading-relaxed max-h-64 overflow-y-auto">
            {task.sampleAnswer}
          </div>
        )}
      </div>

      {/* Submit button */}
      <button
        onClick={() => setPhase('review')}
        disabled={wc < 30}
        className="w-full py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-2xl hover:opacity-90 transition-opacity shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Hoàn Thành → Tự Đánh Giá
      </button>
    </div>
  )
}

// ── Task Selection ─────────────────────────────────────────────────────────
function TaskList({ taskType, onSelect }) {
  const tasks = writingTasks[taskType]
  const cfg = TASK_CONFIG[taskType]
  return (
    <div className="space-y-3">
      {tasks.map(task => {
        const draft = (() => { try { return localStorage.getItem(DRAFT_KEY(task.id)) || '' } catch { return '' } })()
        const draftWC = countWords(draft)
        return (
          <button key={task.id} onClick={() => onSelect(task)}
            className="w-full text-left bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
          >
            <div className="flex items-start gap-3">
              <span className="text-3xl flex-shrink-0">{task.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full font-medium">{task.type}</span>
                  <span className="text-xs text-green-600 font-bold">+{task.xpReward} XP</span>
                </div>
                <h3 className="font-bold text-gray-800 dark:text-gray-100 text-sm mt-1 leading-snug">{task.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{task.prompt}</p>
                {draftWC > 0 && (
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-orange-600 dark:text-orange-400">
                    <Save size={11}/> Nháp đã lưu: {draftWC} từ
                  </div>
                )}
              </div>
              <ChevronRight size={16} className="text-gray-400 flex-shrink-0 mt-1"/>
            </div>
          </button>
        )
      })}
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function WritingWorkshop() {
  const { state, dispatch } = useApp()
  const [tab, setTab] = useState('task1')
  const [openTask, setOpenTask] = useState(null)

  const handleSubmit = useCallback((task, wordCount, checkedCount) => {
    const alreadyDone = (state.ieltsProgress?.completedWriting || []).includes(task.id)
    if (alreadyDone) return
    dispatch({
      type: 'LOAD_STATE',
      payload: {
        ...state,
        xp: (state.xp || 0) + task.xpReward,
        ieltsProgress: {
          ...state.ieltsProgress,
          completedWriting: [...(state.ieltsProgress?.completedWriting || []), task.id],
        },
      },
    })
    try { localStorage.removeItem(DRAFT_KEY(task.id)) } catch {}
  }, [state, dispatch])

  if (openTask) {
    return (
      <div className="max-w-2xl mx-auto">
        <WritingEditor
          task={openTask}
          taskType={tab}
          onSubmit={handleSubmit}
          onBack={() => setOpenTask(null)}
        />
      </div>
    )
  }

  const completedWriting = state.ieltsProgress?.completedWriting || []

  return (
    <div className="space-y-5 max-w-2xl mx-auto animate-fade-up">
      {/* Premium Header */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 bg-200 animate-gradient-x rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="blob bg-fuchsia-300/40 w-44 h-44 -top-12 -right-12" />
        <div className="blob bg-indigo-300/40 w-36 h-36 -bottom-12 -left-10 animate-float-slow" />
        <div className="relative flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-indigo-200 text-sm">Luyện Viết IELTS</p>
            <h1 className="text-2xl font-bold mt-0.5 drop-shadow flex items-center gap-2">
              <PenTool size={22} className="animate-float" /> Writing Workshop
            </h1>
            <p className="text-sm text-indigo-100 mt-1">Đếm từ thực · Highlight IELTS vocab · Timer · Tự đánh giá</p>
          </div>
          <ProgressRing
            pct={(writingTasks.task1.length + writingTasks.task2.length) > 0
              ? Math.round((completedWriting.length / (writingTasks.task1.length + writingTasks.task2.length)) * 100)
              : 0}
            size={80} stroke={7} gradient={['#ffffff', '#f0abfc']}>
            <div className="text-center">
              <div className="text-base font-extrabold">{completedWriting.length}</div>
              <div className="text-[10px] uppercase tracking-wider text-indigo-100">đã làm</div>
            </div>
          </ProgressRing>
        </div>
        <div className="relative grid grid-cols-3 gap-2 mt-4">
          {[
            { v: writingTasks.task1.length, l: 'Task 1', e: '📈' },
            { v: writingTasks.task2.length, l: 'Task 2', e: '✍️' },
            { v: completedWriting.length,   l: 'Hoàn thành', e: '✅' },
          ].map((s, i) => (
            <div key={i} className="bg-white/15 backdrop-blur-sm rounded-xl p-2.5 text-center hover:scale-105 transition-transform">
              <div className="text-sm">{s.e}</div>
              <div className="font-bold animate-count-up">{s.v}</div>
              <div className="text-xs text-indigo-100">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 flex gap-3">
        <AlertCircle size={18} className="text-amber-500 flex-shrink-0 mt-0.5"/>
        <div className="text-sm text-amber-800 dark:text-amber-200">
          <span className="font-semibold">Gợi ý:</span> Từ IELTS học thuật sẽ được <mark className="bg-indigo-100 dark:bg-indigo-900/50 px-1 rounded">highlight</mark> tự động khi bạn gõ. Cố dùng ≥5 từ IELTS để nâng band.
        </div>
      </div>

      {/* Task tabs */}
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-2xl p-1">
        {(['task1', 'task2'] ).map(t => {
          const cfg = TASK_CONFIG[t]
          return (
            <button key={t} onClick={() => { setTab(t); setOpenTask(null) }}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all ${
                tab === t ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-300 shadow-sm' : 'text-gray-500'
              }`}
            >
              {cfg.label}
              <span className="ml-1.5 text-xs opacity-60">({cfg.minWords}+ từ · {cfg.minutes} phút)</span>
            </button>
          )
        })}
      </div>

      {/* Task list */}
      <TaskList
        taskType={tab}
        onSelect={(task) => setOpenTask(task)}
      />
    </div>
  )
}
