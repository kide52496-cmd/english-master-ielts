import { useState } from 'react'
import {
  Sparkles, Bot, PenTool, Mic, Send, RotateCcw, Volume2,
  CheckCircle, ArrowRight, BookOpen, Star, Award, Zap, HelpCircle
} from 'lucide-react'
import {
  evaluateIeltsEssay, upgradeAcademicSentence, SPEAKING_TOPICS,
  evaluateSpeakingAnswer, askAITutor, getAcademicReplacements, runJevDecision
} from '../utils/aiEngine'
import { speak } from '../utils/speech'

export default function AITutor() {
  const [activeTab, setActiveTab] = useState('writing') // 'writing' | 'speaking' | 'upgrader' | 'chat'

  // Writing state
  const [essayText, setEssayText] = useState('')
  const [taskType, setTaskType] = useState('task2')
  const [writingResult, setWritingResult] = useState(null)
  const [evaluatingWriting, setEvaluatingWriting] = useState(false)

  // Speaking state
  const [speakingPart, setSpeakingPart] = useState(1)
  const [speakingIdx, setSpeakingIdx] = useState(0)
  const [userTranscript, setUserTranscript] = useState('')
  const [speakingResult, setSpeakingResult] = useState(null)

  // Sentence Upgrader state
  const [inputSentence, setInputSentence] = useState('Smoking is bad for health and government should stop it.')
  const [upgradedVersions, setUpgradedVersions] = useState(() => upgradeAcademicSentence('Smoking is bad for health and government should stop it.'))

  // Chat state
  const [chatInput, setChatInput] = useState('')
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Chào anh! Em là AI IELTS Copilot. Em có thể chấm bài Writing, luyện Speaking cùng anh, hoặc giải đáp mọi thắc mắc ngữ pháp & mẹo thi IELTS 24/7. Anh muốn học phần nào hôm nay nè?',
    },
  ])
  const [sendingChat, setSendingChat] = useState(false)

  // Jev AI state
  const [jevDecisionType, setJevDecisionType] = useState('ielts_band_calibration')
  const [jevResult, setJevResult] = useState(() => runJevDecision('ielts_band_calibration'))
  const [runningJev, setRunningJev] = useState(false)

  const handleRunJev = (type) => {
    setRunningJev(true)
    setJevDecisionType(type)
    setTimeout(() => {
      const res = runJevDecision(type)
      setJevResult(res)
      setRunningJev(false)
    }, 200)
  }

  // Handlers
  const handleEvaluateWriting = () => {
    setEvaluatingWriting(true)
    setTimeout(() => {
      const res = evaluateIeltsEssay(essayText, taskType)
      setWritingResult(res)
      setEvaluatingWriting(false)
    }, 600)
  }

  const currentSpeakingTopic = SPEAKING_TOPICS.find(t => t.part === speakingPart) || SPEAKING_TOPICS[0]

  const handleEvaluateSpeaking = () => {
    const res = evaluateSpeakingAnswer(userTranscript, currentSpeakingTopic)
    setSpeakingResult(res)
  }

  const handleUpgradeSentence = () => {
    const res = upgradeAcademicSentence(inputSentence)
    setUpgradedVersions(res)
  }

  const handleSendMessage = async (e) => {
    e?.preventDefault()
    if (!chatInput.trim() || sendingChat) return

    const userText = chatInput.trim()
    setMessages(prev => [...prev, { sender: 'user', text: userText }])
    setChatInput('')
    setSendingChat(true)

    const aiRes = await askAITutor(userText, messages)
    setMessages(prev => [...prev, { sender: 'ai', text: aiRes.reply }])
    setSendingChat(false)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 border border-indigo-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
              <Sparkles size={14} className="text-yellow-400 animate-spin-slow" />
              <span>IELTS EXAMINER AI ENGINE 2.0</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <Bot className="text-indigo-400 w-8 h-8 flex-shrink-0" />
              <span>AI IELTS Copilot & Examiner</span>
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              Trợ lý AI chấm bài tự động theo 4 tiêu chí chuẩn Hội đồng Anh/IDP, luyện phản xạ Speaking thời gian thực và nâng cấp câu văn lên Band 8.5+.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-indigo-950/60 border border-indigo-500/30 px-4 py-2.5 rounded-2xl">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <div className="text-xs text-indigo-200">
              <span className="font-bold">AI Status:</span> Ready & Standby
            </div>
          </div>
        </div>
      </div>

      {/* Mode Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('writing')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'writing'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/30'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <PenTool size={15} />
          <span>Chấm Bài Writing AI</span>
        </button>

        <button
          onClick={() => setActiveTab('speaking')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'speaking'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/30'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Mic size={15} />
          <span>Luyện Speaking AI Partner</span>
        </button>

        <button
          onClick={() => setActiveTab('upgrader')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'upgrader'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/30'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Zap size={15} />
          <span>Nâng Cấp Câu Band 8.5</span>
        </button>

        <button
          onClick={() => setActiveTab('chat')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'chat'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/30'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Bot size={15} />
          <span>Hỏi Đáp Gia Sư 24/7</span>
        </button>

        <button
          onClick={() => setActiveTab('jev')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'jev'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/30'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Sparkles size={15} />
          <span>Jev AI Decision Engine (TypeSafe AI)</span>
        </button>
      </div>

      {/* ── MODE 1: IELTS WRITING EXAMINER ─────────────────────────────── */}
      {activeTab === 'writing' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-4">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm text-slate-800 dark:text-slate-100">
                  Nhập Bài Viết Của Anh
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setTaskType('task1')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold ${
                      taskType === 'task1'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Task 1 (150 từ)
                  </button>
                  <button
                    onClick={() => setTaskType('task2')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold ${
                      taskType === 'task2'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Task 2 (250 từ)
                  </button>
                </div>
              </div>

              <textarea
                rows={10}
                value={essayText}
                onChange={e => setEssayText(e.target.value)}
                placeholder="Dán hoặc gõ toàn bộ bài viết IELTS Task 1 hoặc Task 2 vào đây để AI bắt đầu thẩm định và chấm điểm..."
                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans leading-relaxed"
              />

              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Số từ: <strong className="text-slate-800 dark:text-slate-200">{essayText.trim().split(/\s+/).filter(Boolean).length}</strong> từ</span>
                <button
                  onClick={handleEvaluateWriting}
                  disabled={evaluatingWriting || essayText.trim().length === 0}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  <Sparkles size={15} />
                  <span>{evaluatingWriting ? 'Giám Khảo Đang Chấm...' : 'Chấm Bài Bằng AI Ngay'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Result Column */}
          <div className="lg:col-span-5 space-y-4">
            {writingResult && writingResult.success ? (
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-indigo-500/30 shadow-xl space-y-5 animate-fade-in">
                {/* Overall Band Banner */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-br from-indigo-500/15 via-purple-500/10 to-transparent border border-indigo-500/30">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider font-bold text-indigo-500 dark:text-indigo-400">
                      Estimated IELTS Band
                    </span>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Theo chuẩn 4 tiêu chí chính thức
                    </div>
                  </div>
                  <div className="text-3xl font-black bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent">
                    {writingResult.overallBand.toFixed(1)}
                  </div>
                </div>

                {/* 4 Criteria Bars */}
                <div className="space-y-2.5 text-xs">
                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span className="text-slate-600 dark:text-slate-400">Task Achievement / Response</span>
                      <span className="text-indigo-600 dark:text-indigo-400 font-bold">{writingResult.criteria.taskAchievement}</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${(writingResult.criteria.taskAchievement / 9) * 100}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span className="text-slate-600 dark:text-slate-400">Coherence & Cohesion</span>
                      <span className="text-indigo-600 dark:text-indigo-400 font-bold">{writingResult.criteria.coherenceCohesion}</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: `${(writingResult.criteria.coherenceCohesion / 9) * 100}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span className="text-slate-600 dark:text-slate-400">Lexical Resource (Từ Vựng)</span>
                      <span className="text-indigo-600 dark:text-indigo-400 font-bold">{writingResult.criteria.lexicalResource}</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div className="h-full bg-pink-500 rounded-full" style={{ width: `${(writingResult.criteria.lexicalResource / 9) * 100}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span className="text-slate-600 dark:text-slate-400">Grammatical Range & Accuracy</span>
                      <span className="text-indigo-600 dark:text-indigo-400 font-bold">{writingResult.criteria.grammaticalAccuracy}</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(writingResult.criteria.grammaticalAccuracy / 9) * 100}%` }} />
                    </div>
                  </div>
                </div>

                {/* Strengths & Improvements */}
                <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <div>
                    <div className="font-bold text-emerald-600 dark:text-emerald-400 mb-1 flex items-center gap-1.5">
                      <CheckCircle size={14} /> Điểm mạnh ghi nhận:
                    </div>
                    <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-300">
                      {writingResult.strengths.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>

                  <div>
                    <div className="font-bold text-amber-600 dark:text-amber-400 mb-1 flex items-center gap-1.5">
                      <Zap size={14} /> Lời khuyên nâng Band:
                    </div>
                    <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-300">
                      {writingResult.improvements.map((imp, i) => <li key={i}>{imp}</li>)}
                    </ul>
                  </div>
                </div>

                {/* Model Rewrite */}
                <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 text-xs space-y-1.5">
                  <span className="font-extrabold text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
                    <Star size={14} className="text-yellow-500" /> Bản Nâng Cấp Học Thuật Mẫu (Band 8.5):
                  </span>
                  <p className="text-slate-700 dark:text-slate-300 italic leading-relaxed">
                    "{writingResult.band85Rewrite}"
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-8 rounded-3xl bg-slate-50/60 dark:bg-slate-900/60 border border-dashed border-slate-300 dark:border-slate-800 text-center space-y-3">
                <Bot className="w-12 h-12 text-slate-400 mx-auto" />
                <h4 className="font-bold text-sm text-slate-700 dark:text-slate-300">Sẵn Sàng Chấm Bài</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Dán bài viết vào ô bên trái và nhấn nút "Chấm Bài Bằng AI Ngay" để xem bảng điểm và nhận xét chi tiết.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── MODE 2: SPEAKING AI PARTNER ─────────────────────────────────── */}
      {activeTab === 'speaking' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Mic className="text-pink-500" size={18} />
                <span>IELTS Speaking Room (Part {speakingPart})</span>
              </span>

              <div className="flex items-center gap-2">
                {[1, 2, 3].map(p => (
                  <button
                    key={p}
                    onClick={() => { setSpeakingPart(p); setUserTranscript(''); setSpeakingResult(null) }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold ${
                      speakingPart === p
                        ? 'bg-pink-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Part {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Examiner Question Box */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-pink-500/10 via-purple-500/5 to-transparent border border-pink-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-pink-600 dark:text-pink-400 uppercase tracking-wider">
                  Chủ đề: {currentSpeakingTopic.topic}
                </span>
                <button
                  onClick={() => speak(currentSpeakingTopic.question)}
                  className="px-2.5 py-1 rounded-lg bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300 text-xs font-bold flex items-center gap-1 hover:scale-105 transition-all"
                >
                  <Volume2 size={14} /> Nghe Giọng Giám Khảo
                </button>
              </div>

              <p className="text-base font-bold text-slate-800 dark:text-slate-100 leading-snug">
                "{currentSpeakingTopic.question}"
              </p>

              {currentSpeakingTopic.cueCardNotes && (
                <div className="text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-pink-500/20">
                  <div className="font-semibold mb-1">Gợi ý trả lời (Cue Card):</div>
                  <ul className="list-disc pl-4 space-y-0.5">
                    {currentSpeakingTopic.cueCardNotes.map((note, idx) => <li key={idx}>{note}</li>)}
                  </ul>
                </div>
              )}
            </div>

            {/* User Speaking Answer Input */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Câu trả lời của anh (Nhập văn bản hoặc ghi âm):
              </label>
              <textarea
                rows={4}
                value={userTranscript}
                onChange={e => setUserTranscript(e.target.value)}
                placeholder="Nhập câu trả lời bằng tiếng Anh của anh vào đây..."
                className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={handleEvaluateSpeaking}
                disabled={!userTranscript.trim()}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50"
              >
                Nhận Đánh Giá Phản Xạ Từ AI
              </button>
            </div>

            {/* Speaking Result */}
            {speakingResult && (
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3 animate-fade-in text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-slate-800 dark:text-slate-100">Kết Quả Đánh Giá Phản Xạ:</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-600 dark:text-pink-400 font-extrabold text-sm">
                    Band {speakingResult.band.toFixed(1)}
                  </span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{speakingResult.feedback}</p>
                <div className="text-pink-600 dark:text-pink-400 font-semibold">{speakingResult.fluencyTip}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── MODE 3: ACADEMIC SENTENCE UPGRADER ──────────────────────────── */}
      {activeTab === 'upgrader' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div>
              <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Zap className="text-amber-500" size={18} />
                <span>Bộ Nâng Cấp Câu Academic Lên Band 8.5+</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Nhập một câu văn thông thường, AI sẽ biến nó thành các phiên bản học thuật xuất sắc với ngữ pháp đảo ngữ và từ vựng cao cấp.
              </p>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={inputSentence}
                onChange={e => setInputSentence(e.target.value)}
                placeholder="Nhập câu tiếng Anh thông thường..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={handleUpgradeSentence}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all"
              >
                Nâng Cấp
              </button>
            </div>

            <div className="space-y-3 pt-2">
              {upgradedVersions.map((v, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1.5 transition-all hover:scale-[1.01]"
                >
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-indigo-600 dark:text-indigo-400">{v.level}</span>
                    <button
                      onClick={() => speak(v.sentence)}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1"
                    >
                      <Volume2 size={13} /> Phát âm
                    </button>
                  </div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-relaxed font-sans">
                    "{v.sentence}"
                  </p>
                  <p className="text-[11px] text-slate-500 italic">{v.highlight}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── MODE 4: 24/7 AI TUTOR CHAT ──────────────────────────────────── */}
      {activeTab === 'chat' && (
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="h-[460px] rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden">
            {/* Chat Messages Log */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4 text-xs">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.sender === 'ai' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white flex-shrink-0 shadow-md">
                      <Bot size={16} />
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] p-4 rounded-2xl whitespace-pre-line leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-indigo-600 text-white rounded-br-none shadow-md'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none border border-slate-200/60 dark:border-slate-700/60'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {sendingChat && (
                <div className="flex gap-3 items-center text-slate-400 italic text-xs">
                  <Bot size={16} className="animate-spin-slow text-indigo-500" />
                  <span>AI đang giải thích cho anh nè...</span>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder="Hỏi AI bất kỳ điều gì (ngữ pháp, từ vựng, mẹo làm bài, MongoDB...)"
                className="flex-1 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                disabled={!chatInput.trim() || sendingChat}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md disabled:opacity-50 transition-all"
              >
                <Send size={14} />
                <span>Gửi</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── MODE 5: JEV AI DECISION ENGINE (TYPESAFE AI) ───────────────── */}
      {activeTab === 'jev' && (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-950/80 via-slate-900 to-slate-950 border border-emerald-500/30 shadow-2xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-2">
                  <Sparkles size={13} className="text-emerald-400" />
                  <span>TypeSafe AI · Released Sep 15, 2026</span>
                </div>
                <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                  <span>Jev AI Decision Engine (System One Architecture)</span>
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Mô hình AI chuyên biệt về <strong>Đưa Ra Quyết Định Nhanh (Decision-Making)</strong> thay vì chat hội thoại tự do. Huấn luyện bằng phương pháp <strong>RLCD (Reinforcement Learning for Calibrated Decisions)</strong>.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900/80 border border-emerald-500/20 text-xs font-mono text-emerald-300 flex-shrink-0">
                <div>Model: Jev-1.0-Decision</div>
                <div className="text-[10px] text-slate-400">Founder: Diogo Almeida (ex-OpenAI)</div>
                <div className="text-[10px] text-emerald-400 mt-0.5">● Sub-500ms Latency</div>
              </div>
            </div>

            {/* Decision Tasks Trigger Buttons */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">
                Chọn tác vụ quyết định thông minh (Intelligence Function Call):
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => handleRunJev('ielts_band_calibration')}
                  disabled={runningJev}
                  className={`p-4 rounded-2xl text-left border transition-all ${
                    jevDecisionType === 'ielts_band_calibration'
                      ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-lg shadow-emerald-500/10'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="text-xs font-bold text-emerald-400 flex items-center justify-between">
                    <span>Task 1: IELTS Band Calibration</span>
                    <span className="text-[10px] bg-emerald-950 px-2 py-0.5 rounded text-emerald-300 font-mono">Decision</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Hiệu chuẩn ngưỡng điểm Band và quyết định mở khóa đề thi nâng cao.
                  </div>
                </button>

                <button
                  onClick={() => handleRunJev('srs_progression')}
                  disabled={runningJev}
                  className={`p-4 rounded-2xl text-left border transition-all ${
                    jevDecisionType === 'srs_progression'
                      ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-lg shadow-emerald-500/10'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="text-xs font-bold text-emerald-400 flex items-center justify-between">
                    <span>Task 2: SRS Progression Gate</span>
                    <span className="text-[10px] bg-emerald-950 px-2 py-0.5 rounded text-emerald-300 font-mono">Decision</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Quyết định hệ số ghi nhớ dài hạn và chu kỳ lặp lại thẻ nhớ Flashcard.
                  </div>
                </button>
              </div>
            </div>

            {/* Live Jev Output Screen */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Jev AI Typed Decision Output (TypeScript JSON Contract):</span>
                </span>
                <span className="text-xs font-mono text-emerald-400">
                  Latency: {jevResult.executionLatencyMs} · Probability: {(jevResult.confidenceProbability * 100).toFixed(1)}%
                </span>
              </div>

              <div className="rounded-2xl bg-[#080C14] border border-emerald-500/30 p-4 font-mono text-xs overflow-x-auto shadow-inner">
                <pre className="text-emerald-300 leading-relaxed">
                  {JSON.stringify(jevResult, null, 2)}
                </pre>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/20 text-xs text-slate-300 leading-relaxed">
              <strong className="text-emerald-400">💡 Giải thích cho thầy:</strong> Jev AI không sinh văn bản dài dòng mà nhận đầu vào (Input State), tính toán bằng RLCD và trả về <strong>Typed Decision</strong> kèm xác suất hiệu chuẩn (Calibrated Probability) chỉ trong <strong>{jevResult.executionLatencyMs}</strong> để gửi thẳng về MongoDB lưu trữ!
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
