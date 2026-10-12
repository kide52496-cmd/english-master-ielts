import { useState } from 'react'
import { Bot, X, Send, Sparkles, Zap, MessageSquare } from 'lucide-react'
import { askAITutor } from '../utils/aiEngine'

export default function AICopilotFloat() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Chào anh! Em là AI IELTS Assistant. Đang học bài nếu có từ nào khó hoặc cần nâng cấp câu văn, anh cứ hỏi em ngay tại đây nhé!',
    },
  ])
  const [loading, setLoading] = useState(false)

  const handleSend = async (e) => {
    e?.preventDefault()
    if (!input.trim() || loading) return

    const userText = input.trim()
    setMessages(prev => [...prev, { sender: 'user', text: userText }])
    setInput('')
    setLoading(true)

    const res = await askAITutor(userText)
    setMessages(prev => [...prev, { sender: 'ai', text: res.reply }])
    setLoading(false)
  }

  return (
    <>
      {/* Floating Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!open && (
          <button
            onClick={() => setOpen(true)}
            aria-label="Mở AI IELTS Copilot"
            className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-xl shadow-indigo-500/35 hover:scale-105 active:scale-95 transition-all duration-300 border border-white/20"
          >
            <div className="relative">
              <Bot size={20} className="animate-bounce-slow" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-indigo-900 animate-pulse" />
            </div>
            <span className="text-xs font-extrabold tracking-tight hidden sm:inline">AI Copilot</span>
            <Sparkles size={14} className="text-amber-300 opacity-80 group-hover:rotate-12 transition-transform" />
          </button>
        )}
      </div>

      {/* Floating Chat Drawer Modal */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[350px] sm:w-[380px] h-[480px] rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-indigo-500/30 shadow-2xl flex flex-col overflow-hidden animate-fade-up">
          {/* Top Bar */}
          <div className="px-4 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot size={18} />
              <div>
                <h4 className="font-extrabold text-xs">AI IELTS Copilot (24/7)</h4>
                <div className="text-[10px] text-indigo-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Standby & Ready
                </div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1 rounded-lg hover:bg-white/20 transition-colors"
              aria-label="Đóng chat"
            >
              <X size={16} />
            </button>
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-2 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 flex gap-1.5 overflow-x-auto text-[11px]">
            <button
              onClick={() => setInput('Nâng cấp câu: Many people think pollution is dangerous')}
              className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60 whitespace-nowrap hover:bg-indigo-100 transition-colors"
            >
              ✨ Nâng cấp câu Band 8.5
            </button>
            <button
              onClick={() => setInput('Mẹo đạt Band 7.0 Writing Task 2')}
              className="px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800/60 whitespace-nowrap hover:bg-purple-100 transition-colors"
            >
              📝 Tips Writing
            </button>
            <button
              onClick={() => setInput('MongoDB Cloud kiểm soát dữ liệu như thế nào?')}
              className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 whitespace-nowrap hover:bg-emerald-100 transition-colors"
            >
              🍃 MongoDB Status
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 text-xs">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl whitespace-pre-line leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-none shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none border border-slate-200/60 dark:border-slate-700/60'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-[11px] text-slate-400 italic">
                <Bot size={14} className="animate-spin-slow text-indigo-500" />
                <span>AI đang phân tích câu trả lời...</span>
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-2.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Nhập câu hỏi của anh..."
              className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs disabled:opacity-50 transition-all"
            >
              <Send size={13} />
            </button>
          </form>
        </div>
      )}
    </>
  )
}
