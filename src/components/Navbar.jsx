import { useEffect, useRef, useState } from 'react'
import {
  BookOpen, Layers, CheckSquare, GraduationCap,
  Headphones, Mic, Home, Menu, X, Sun, Moon, Star,
  FlaskConical, Trophy, Settings as SettingsIcon, Route, BookMarked, Clapperboard,
  Award, RefreshCw, MessageSquare, PenLine, Library, Target, Flame, Crosshair,
  Sparkles, Notebook, AlertTriangle, FileText, Circle, Database, Bot
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { getStageByXP } from '../data/roadmap'
import { NAV_ROUTES } from '../routes'

// Icons live here rather than in routes.js so the route table stays free of
// UI dependencies. Any route without an entry falls back to a neutral dot.
const ICONS = {
  'dashboard': Home,
  'learning-path': Route,
  'my-plan': Target,
  'goal-mode': Crosshair,
  'placement': FlaskConical,
  'course': Library,
  'vocabulary': BookOpen,
  'vocab-pro': Sparkles,
  'flashcard': Layers,
  'quiz': CheckSquare,
  'quiz-pro': Sparkles,
  'grammar': GraduationCap,
  'grammar-practice': PenLine,
  'listening': Headphones,
  'listening-pack': Sparkles,
  'dictation-mode': Headphones,
  'speaking': Mic,
  'speaking-coach': Sparkles,
  'reading-library': FileText,
  'story-book': BookMarked,
  'video-lab': Clapperboard,
  'ielts-hub': Award,
  'mock-test': Star,
  'review-center': RefreshCw,
  'review-queue': Flame,
  'phrasebook': MessageSquare,
  'writing-workshop': PenLine,
  'achievements': Trophy,
  'notes': Notebook,
  'mistakes-review': AlertTriangle,
  'mongodb-cloud': Database,
  'ai-tutor': Bot,
  'settings': SettingsIcon,
}

export default function Navbar({ currentPage, setCurrentPage, darkMode, setDarkMode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { state } = useApp()
  const currentStage = getStageByXP(state.xp || 0)
  const menuButtonRef = useRef(null)

  const navigate = (id) => {
    setCurrentPage(id)
    setMobileOpen(false)
  }

  // While the tall dropdown is open, lock the page behind it and let Escape
  // close it — returning focus to the button that opened it.
  useEffect(() => {
    if (!mobileOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (event) => {
      if (event.key !== 'Escape') return
      setMobileOpen(false)
      menuButtonRef.current?.focus()
    }
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [mobileOpen])

  return (
    <nav
      aria-label="Điều hướng chính"
      className="bg-white/75 dark:bg-[#0F172A]/80 glass shadow-sm sticky top-0 z-50 border-b border-slate-200/60 dark:border-white/10 safe-top backdrop-blur-xl"
    >
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Top row: Logo + XP + Theme + Hamburger */}
        <div className="flex items-center justify-between h-14 sm:h-16">

          {/* Logo */}
          <button
            onClick={() => navigate('dashboard')}
            className="flex items-center gap-2.5 group flex-shrink-0"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-md shadow-indigo-500/25 group-hover:scale-110 group-hover:rotate-6 transition-all">
              <span className="text-xl" aria-hidden="true">🎓</span>
            </div>
            <div className="hidden sm:flex flex-col leading-none text-left">
              <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-300 dark:to-pink-400 bg-clip-text text-transparent">
                English Master IELTS
              </span>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">Từ mất gốc → IELTS 6.0</span>
            </div>
            <span className="font-extrabold text-sm text-indigo-600 dark:text-indigo-400 sm:hidden tracking-tight">EMI</span>
          </button>

          {/* Right: XP + Level + Theme + Hamburger */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* XP Badge — a real button so keyboard users can reach the roadmap */}
            <button
              onClick={() => navigate('roadmap')}
              className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-200 animate-gradient-x text-white px-3.5 py-1.5 rounded-full hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/30 transition-all btn-shine shadow-sm"
            >
              <span className="text-sm" aria-hidden="true">{currentStage.icon}</span>
              <span className="text-xs leading-none text-left">
                <span className="block font-bold">{(state.xp || 0).toLocaleString()} XP</span>
                <span className="block text-[10px] opacity-90 font-medium">Lv.{state.level || 1}</span>
              </span>
            </button>

            {/* Streak */}
            {(state.streak || 0) > 0 && (
              <p className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-amber-500/15 to-orange-500/15 border border-orange-500/30 text-orange-600 dark:text-orange-400 px-3 py-1.5 rounded-full shadow-sm">
                <span className="text-sm animate-bounce-slow" aria-hidden="true">🔥</span>
                <span className="text-xs font-bold">
                  {state.streak}
                  <span className="sr-only"> ngày học liên tiếp</span>
                </span>
              </p>
            )}

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all hover:scale-105"
              aria-label={darkMode ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}
            >
              {darkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-indigo-600" />}
            </button>
            <button
              ref={menuButtonRef}
              onClick={() => setMobileOpen(o => !o)}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
              aria-label={mobileOpen ? 'Đóng menu' : 'Mở menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Desktop Nav: WRAPPED rows (no horizontal scroll) */}
        <div className="hidden lg:flex flex-wrap gap-1.5 pb-2.5 pt-0.5">
          {NAV_ROUTES.map(({ id, label }) => {
            const Icon = ICONS[id] || Circle
            const active = currentPage === id
            return (
              <button
                key={id}
                onClick={() => navigate(id)}
                aria-current={active ? 'page' : undefined}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-semibold whitespace-nowrap transition-all duration-200
                  ${active
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/30 scale-[1.02]'
                    : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50/70 dark:hover:bg-indigo-950/40'
                  }`}
              >
                <Icon size={14} aria-hidden="true" className={active ? 'text-white' : 'opacity-70'} />
                {label}
              </button>
            )
          })}
        </div>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div
            id="mobile-menu"
            className="lg:hidden border-t border-gray-100 dark:border-gray-700 py-2 max-h-[70vh] overflow-y-auto"
          >
            {/* Mobile XP */}
            <div className="flex items-center gap-3 px-4 py-3 mb-1 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl mx-1">
              <span className="text-2xl" aria-hidden="true">{currentStage.icon}</span>
              <div>
                <div className="text-sm font-bold text-indigo-700 dark:text-indigo-300">{currentStage.name}</div>
                <div className="text-xs text-gray-600 dark:text-gray-300">
                  {(state.xp || 0).toLocaleString()} XP · Lv.{state.level || 1} · <span aria-hidden="true">🔥</span>{state.streak || 0}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-1">
              {NAV_ROUTES.map(({ id, label }) => {
                const Icon = ICONS[id] || Circle
                const active = currentPage === id
                return (
                  <button
                    key={id}
                    onClick={() => navigate(id)}
                    aria-current={active ? 'page' : undefined}
                    title={label}
                    className={`flex items-center gap-2 px-3 py-3 text-xs font-medium rounded-xl transition-all ${
                      active
                        ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-bold ring-1 ring-indigo-300 dark:ring-indigo-600'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    <Icon size={16} aria-hidden="true" className="flex-shrink-0" />
                    <span className="truncate">{label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
