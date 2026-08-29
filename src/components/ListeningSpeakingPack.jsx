import { useEffect, useMemo, useState } from "react"
import { ArrowLeft, ChevronRight, Volume2, BookOpen, Mic, Sparkles, RefreshCw } from "lucide-react"
import { useApp } from "../context/AppContext"
import { speak, stopSpeaking } from "../utils/speech"
import { listeningPack, LISTENING_PACK_LEVELS, getLessonById } from "../data/listening_pack_100"
import { recordMistake } from "../utils/notes"
import { Waveform, ProgressRing } from "./AudioVisuals"

function LessonList({ onPick }) {
  return (
    <div className="space-y-5 animate-fade-up">
      <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 bg-200 animate-gradient-x text-white rounded-2xl p-5 shadow-xl relative overflow-hidden">
        <div className="blob bg-pink-400/40 w-40 h-40 -top-10 -right-10" />
        <div className="blob bg-indigo-300/40 w-36 h-36 -bottom-12 -left-10 animate-float-slow" />
        <div className="relative flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center animate-float">
            <Sparkles size={22} />
          </div>
          <div className="flex-1">
            <h2 className="text-lg sm:text-xl font-bold drop-shadow">100 Bài Luyện Nghe + Nói</h2>
            <p className="text-xs sm:text-sm text-white/90 mt-1">
              Bộ thực chiến từ Foundation đến IELTS 6.5. Đủ {listeningPack.length} bài: nghe, đọc, hỏi đáp, speaking part 1-2-3, shadowing, homework.
            </p>
          </div>
        </div>
      </div>

      {LISTENING_PACK_LEVELS.map((lv, lvIdx) => {
        const lessons = listeningPack.filter(l => l.levelId === lv.id)
        if (lessons.length === 0) return null
        return (
          <div key={lv.id}
            style={{ animationDelay: `${lvIdx * 60}ms` }}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 sm:p-5 card-hover animate-fade-up">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                <span className="text-lg">{lv.id === 'foundation' ? '🌱' : lv.id === 'basic-ielts' ? '🌿' : lv.id === 'intermediate' ? '🌳' : lv.id === 'upper' ? '🏔️' : '🏆'}</span>
                {lv.label}
              </h3>
              <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded-full">Bài {lv.range[0]}–{lv.range[1]}</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-2">
              {lessons.map((l, i) => (
                <button
                  key={l.id}
                  onClick={() => onPick(l.id)}
                  style={{ animationDelay: `${i * 18}ms` }}
                  className="group w-full flex items-center gap-3 p-3 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md hover:-translate-y-0.5 transition-all text-left animate-fade-up"
                >
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    {l.id}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">{l.title}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{l.titleVi}</div>
                  </div>
                  <ChevronRight size={16} className="text-gray-400 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all" />
                </button>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function VocabBlock({ list }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 card-hover">
      <h4 className="text-sm font-bold mb-2 text-gray-800 dark:text-gray-100 flex items-center gap-2">
        <span className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 flex items-center justify-center text-xs font-bold">A</span>
        Vocabulary
      </h4>
      <div className="grid sm:grid-cols-2 gap-2">
        {list.map((w,i) => (
          <div key={i} style={{ animationDelay: `${i * 20}ms` }} className="rounded-xl bg-gradient-to-br from-gray-50 to-blue-50/50 dark:from-gray-800/50 dark:to-blue-900/10 border border-gray-100 dark:border-gray-700 p-2.5 hover:border-blue-300 dark:hover:border-blue-700 transition-colors animate-fade-up">
            <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">{w.word} <span className="text-xs text-gray-400 font-mono">{w.ipa}</span></div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{w.vi}</div>
            <div className="text-xs italic text-gray-500 dark:text-gray-400 mt-1">"{w.example}"</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ScriptBlock({ script }) {
  const [rate, setRate] = useState(0.9)
  const [playing, setPlaying] = useState(false)
  const handlePlay = () => {
    setPlaying(true)
    speak(script, { rate, onEnd: () => setPlaying(false), onError: () => setPlaying(false) })
  }
  const handleStop = () => { stopSpeaking(); setPlaying(false) }
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 card-hover">
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <h4 className="text-sm font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 flex items-center justify-center text-xs font-bold">B</span>
          Listening Script
        </h4>
        <div className="flex items-center gap-2 text-xs">
          <input type="range" min="0.6" max="1.2" step="0.05" value={rate}
            onChange={e => setRate(Number(e.target.value))}
            className="accent-indigo-500" />
          <span className="font-mono text-gray-500 w-10">{rate.toFixed(2)}x</span>
          <button onClick={handlePlay}
            className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex items-center gap-1 hover:scale-105 transition-transform btn-shine">
            <Volume2 size={12} /> Nghe
          </button>
          <button onClick={handleStop} className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">Stop</button>
        </div>
      </div>
      <Waveform active={playing} bars={36} color="from-indigo-400 to-purple-500" className="mb-3" />
      <pre className="text-sm leading-relaxed text-gray-700 dark:text-gray-200 whitespace-pre-wrap font-sans bg-gradient-to-br from-gray-50 to-purple-50/40 dark:from-gray-800/50 dark:to-purple-900/10 rounded-xl p-3 max-h-72 overflow-y-auto border border-gray-100 dark:border-gray-700">{script}</pre>
    </div>
  )
}

function QuestionsBlock({ questions, lessonId }) {
  const [answers, setAnswers] = useState({})
  const [revealed, setRevealed] = useState(false)
  const [score, setScore] = useState(0)

  const submit = () => {
    let correct = 0
    questions.forEach(q => {
      const a = answers[q.id]
      const norm = (s) => String(s||"").toLowerCase().trim()
      if (q.type === "mcq" && a === q.correct) correct++
      else if (q.type === "fill" && norm(a) === norm(q.answer)) correct++
      else if (q.type === "tfng" && norm(a) === norm(q.answer)) correct++
      else if (q.type === "short" && norm(a) === norm(q.answer)) correct++
      else if (a !== undefined && q.type !== "mcq") {
        recordMistake({
          source: "reading",
          prompt: q.question || q.statement || "Listening question",
          correct: String(q.answer || "").trim(),
          given: String(a || "").trim(),
          hint: `Listening pack lesson ${lessonId}`,
        })
      }
    })
    setScore(correct)
    setRevealed(true)
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 space-y-3 card-hover">
      <h4 className="text-sm font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
        <span className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-300 flex items-center justify-center text-xs font-bold">C</span>
        Listening Questions ({questions.length})
      </h4>
      {questions.map((q, idx) => {
        const a = answers[q.id]
        const norm = (s) => String(s||"").toLowerCase().trim()
        const isCorrect = revealed && (
          (q.type === "mcq" && a === q.correct) ||
          (q.type !== "mcq" && norm(a) === norm(q.answer))
        )
        return (
          <div key={q.id}
            style={{ animationDelay: `${idx * 30}ms` }}
            className={`rounded-xl border p-3 transition-all animate-fade-up ${
              revealed
                ? isCorrect
                  ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700'
                  : 'bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-700'
                : 'bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-700'
            }`}>
            <div className="text-[11px] uppercase font-bold text-indigo-600 dark:text-indigo-300 mb-1">{q.type}</div>
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">{idx + 1}. {q.question || q.statement}</p>
            {q.type === "mcq" && q.options && (
              <div className="space-y-1.5">
                {q.options.map((opt,i) => (
                  <label key={i} className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer ${a===i ? "bg-indigo-50 dark:bg-indigo-900/30":""}`}>
                    <input type="radio" disabled={revealed} checked={a===i}
                      onChange={() => setAnswers(s => ({...s, [q.id]: i}))} />
                    <span className="text-sm">{opt}</span>
                  </label>
                ))}
              </div>
            )}
            {q.type === "tfng" && (
              <div className="flex gap-2">
                {["True","False","Not Given"].map(o => (
                  <label key={o} className={`px-3 py-1.5 rounded-lg border cursor-pointer text-sm ${a===o ? "bg-indigo-50 border-indigo-400 dark:bg-indigo-900/30":"border-gray-200 dark:border-gray-700"}`}>
                    <input type="radio" className="mr-1" disabled={revealed} checked={a===o}
                      onChange={() => setAnswers(s => ({...s, [q.id]: o}))} />{o}
                  </label>
                ))}
              </div>
            )}
            {(q.type === "fill" || q.type === "short") && (
              <input type="text" disabled={revealed} value={a || ""}
                onChange={e => setAnswers(s => ({...s, [q.id]: e.target.value}))}
                placeholder="Nhập câu trả lời..."
                className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
              />
            )}
            {revealed && (
              <p className={`text-xs mt-2 ${isCorrect ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                {isCorrect ? "Đúng" : `Đáp án: ${q.type === "mcq" ? q.options[q.correct] : q.answer}`}
              </p>
            )}
          </div>
        )
      })}
      {!revealed ? (
        <button onClick={submit}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-95 hover:scale-[1.01] text-white text-sm font-semibold transition-all btn-shine">Kiểm tra</button>
      ) : (
        <div className="flex items-center justify-between animate-slide-down">
          <span className={`text-sm font-bold ${score === questions.length ? 'text-emerald-600 dark:text-emerald-400' : score >= questions.length / 2 ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400'}`}>
            Đúng {score}/{questions.length} {score === questions.length && '🎉'}
          </span>
          <button onClick={() => { setAnswers({}); setRevealed(false); setScore(0) }}
            className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-sm font-semibold flex items-center gap-1 transition-colors">
            <RefreshCw size={12}/> Làm lại
          </button>
        </div>
      )}
    </div>
  )
}

function SpeakingBlock({ p1, p2, p3 }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 space-y-4 card-hover">
      <h4 className="text-sm font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
        <span className="w-7 h-7 rounded-lg bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-300 flex items-center justify-center text-xs font-bold">F</span>
        <Mic size={14} className="text-rose-500" /> Speaking Practice
      </h4>
      <div>
        <div className="text-[11px] uppercase tracking-wider font-bold text-rose-500 mb-2 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />Part 1</div>
        <div className="space-y-2">
          {(p1 || []).map((q, i) => (
            <div key={i} style={{ animationDelay: `${i * 30}ms` }} className="rounded-xl bg-gradient-to-br from-rose-50 to-orange-50/40 dark:from-rose-900/15 dark:to-orange-900/10 border border-rose-100 dark:border-rose-900/40 p-3 animate-fade-up">
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{i+1}. {q.q}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1"><b>Band 5.0:</b> {q.bandLow}</p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1"><b>Band 6.5:</b> {q.bandMid}</p>
              <button onClick={() => speak(q.bandMid, { rate: 0.9 })}
                className="mt-1 text-[11px] px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 inline-flex items-center gap-1 hover:scale-105 transition-transform">
                <Volume2 size={10}/> Nghe Band 6.5
              </button>
            </div>
          ))}
        </div>
      </div>
      {p2 && (
        <div className="animate-fade-up">
          <div className="text-[11px] uppercase tracking-wider font-bold text-purple-500 mb-2 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500" />Part 2 — Cue card</div>
          <pre className="text-sm whitespace-pre-wrap font-sans bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/10 rounded-xl p-3 text-purple-900 dark:text-purple-100 border border-purple-100 dark:border-purple-900/40">{p2.cueCard}</pre>
          <p className="text-sm leading-relaxed mt-2 text-gray-700 dark:text-gray-200">{p2.sample}</p>
          <div className="mt-2 flex flex-wrap gap-1">
            {(p2.keywords || []).map(k => (
              <span key={k} className="text-[11px] px-2 py-0.5 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 hover:scale-105 transition-transform">{k}</span>
            ))}
          </div>
          <button onClick={() => speak(p2.sample, { rate: 0.9 })}
            className="mt-2 text-xs px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-95 hover:scale-105 text-white inline-flex items-center gap-1 transition-all btn-shine">
            <Volume2 size={12}/> Nghe bài mẫu
          </button>
        </div>
      )}
      {p3 && (
        <div className="animate-fade-up">
          <div className="text-[11px] uppercase tracking-wider font-bold text-orange-500 mb-2 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500" />Part 3 — Discussion</div>
          <ul className="space-y-2">
            {p3.map((q, i) => (
              <li key={i} style={{ animationDelay: `${i * 30}ms` }} className="rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/10 border border-orange-100 dark:border-orange-900/40 p-3 animate-fade-up">
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{i+1}. {q.q}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Gợi ý mở rộng: {q.hint}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function ExtraBlock({ shadowing, homework, vietnameseSupport }) {
  return (
    <div className="grid sm:grid-cols-2 gap-3">
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 card-hover">
        <h4 className="text-sm font-bold mb-2 flex items-center gap-2 text-gray-800 dark:text-gray-100">
          <span className="w-7 h-7 rounded-lg bg-cyan-100 dark:bg-cyan-900/40 text-cyan-600 dark:text-cyan-300 flex items-center justify-center text-xs font-bold">G</span>
          Shadowing
        </h4>
        <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700 dark:text-gray-200">
          {(shadowing || []).map((s,i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="flex-1">{s}</span>
              <button onClick={() => speak(s, { rate: 0.85 })} className="text-indigo-500 text-xs hover:scale-110 transition-transform">▶</button>
            </li>
          ))}
        </ol>
        <p className="text-[11px] text-gray-400 mt-2">Cách luyện: Nghe → Dừng → Đọc theo → Ghi âm → So sánh.</p>
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 card-hover">
        <h4 className="text-sm font-bold mb-2 flex items-center gap-2 text-gray-800 dark:text-gray-100">
          <span className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-300 flex items-center justify-center text-xs font-bold">H</span>
          Homework
        </h4>
        <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700 dark:text-gray-200">
          {(homework || []).map((h,i) => <li key={i}>{h}</li>)}
        </ol>
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 sm:col-span-2 card-hover">
        <h4 className="text-sm font-bold mb-2 flex items-center gap-2 text-gray-800 dark:text-gray-100">
          <span className="w-7 h-7 rounded-lg bg-fuchsia-100 dark:bg-fuchsia-900/40 text-fuchsia-600 dark:text-fuchsia-300 flex items-center justify-center text-xs font-bold">I</span>
          Vietnamese Support
        </h4>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-200">
          {(vietnameseSupport || []).map((v,i) => <li key={i}>{v}</li>)}
        </ul>
      </div>
    </div>
  )
}

function LessonView({ lessonId, onBack }) {
  const lesson = useMemo(() => getLessonById(lessonId), [lessonId])
  if (!lesson) return null
  return (
    <div className="space-y-4 animate-fade-up">
      <button onClick={onBack} className="flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-500 hover:-translate-x-0.5 transition-all">
        <ArrowLeft size={16} /> Danh sách bài
      </button>
      <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 bg-200 animate-gradient-x text-white rounded-2xl p-5 shadow-xl relative overflow-hidden">
        <div className="blob bg-pink-400/40 w-36 h-36 -top-8 -right-8" />
        <div className="blob bg-indigo-300/40 w-32 h-32 -bottom-10 -left-8 animate-float-slow" />
        <div className="relative">
          <div className="text-xs uppercase tracking-wider opacity-80">Bài {lesson.id}</div>
          <h2 className="text-lg sm:text-xl font-bold drop-shadow">{lesson.title}</h2>
          <p className="text-sm text-white/90">{lesson.titleVi}</p>
          <ul className="mt-3 text-xs text-white/90 space-y-0.5">
            <li>• Nghe: {lesson.objectives.listen}</li>
            <li>• Nói: {lesson.objectives.speak}</li>
            <li>• Vocab: {lesson.objectives.vocabFocus}</li>
          </ul>
        </div>
      </div>
      <VocabBlock list={lesson.vocabulary} />
      <ScriptBlock script={lesson.script} />
      <QuestionsBlock questions={lesson.questions} lessonId={lesson.id} />
      <SpeakingBlock p1={lesson.speakingPart1} p2={lesson.speakingPart2} p3={lesson.speakingPart3} />
      <ExtraBlock shadowing={lesson.shadowing} homework={lesson.homework} vietnameseSupport={lesson.vietnameseSupport} />
    </div>
  )
}

export default function ListeningSpeakingPack() {
  const [lessonId, setLessonId] = useState(null)
  useEffect(() => () => stopSpeaking(), [])
  if (lessonId) return <LessonView lessonId={lessonId} onBack={() => setLessonId(null)} />
  return <LessonList onPick={setLessonId} />
}
