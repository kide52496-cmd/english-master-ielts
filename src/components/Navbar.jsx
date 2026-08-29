import { useState } from 'react'
import {
  BookOpen, Layers, CheckSquare, GraduationCap,
  Headphones, Mic, Home, Menu, X, Sun, Moon, Star,
  FlaskConical, Trophy, Settings as SettingsIcon, Route, BookMarked, Clapperboard, Award, RefreshCw, MessageSquare, PenLine, Library, Target, Flame, Crosshair, Sparkles, Notebook, AlertTriangle
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { getStageByXP } from '../data/roadmap'

const navItems = [
  { id: 'dashboard',     label: 'Trang Chủ',    icon: Home },
  { id: 'learning-path', label: 'Lộ Trình',     icon: Route },
  { id: 'my-plan',       label: 'Plan Của Tôi', icon: Target },
  { id: 'goal-mode',     label: 'Mục Tiêu',     icon: Crosshair },
  { id: 'placement',     label: 'Test Đầu Vào', icon: FlaskConical },
  { id: 'course',        label: 'Khóa Học',     icon: Library },
  { id: 'vocabulary',    label: 'Từ Vựng',      icon: BookOpen },
  { id: 'vocab-pro',     label: 'Từ Vựng Pro',  icon: Sparkles },
  { id: 'flashcard',     label: 'Flashcard',    icon: Layers },
  { id: 'quiz',          label: 'Quiz',         icon: CheckSquare },
  { id: 'quiz-pro',      label: 'Quiz Pro',     icon: Sparkles },
  { id: 'grammar',       label: 'Ngữ Pháp',     icon: GraduationCap },
  { id: 'grammar-practice', label: 'Luyện Tập NP', icon: PenLine },
  { id: 'listening',     label: 'Nghe',         icon: Headphones },
  { id: 'listening-pack', label: '100 Bài Nghe-Nói', icon: Sparkles },
  { id: 'dictation-mode', label: 'Dictation',   icon: Headphones },
  { id: 'speaking',      label: 'Nói',          icon: Mic },
  { id: 'speaking-coach',label: 'Speaking Coach', icon: Sparkles },
  { id: 'story-book',    label: 'Story Book',   icon: BookMarked },
  { id: 'video-lab',     label: 'Video Lab',    icon: Clapperboard },
  { id: 'ielts-hub',      label: 'IELTS Hub',     icon: Award },
  { id: 'mock-test',      label: 'Mock Test',     icon: Star },
  { id: 'review-center',  label: 'Review Center', icon: RefreshCw },
  { id: 'review-queue',   label: 'Ôn Hôm Nay',    icon: Flame },
  { id: 'phrasebook',       label: 'Phrasebook',       icon: MessageSquare },
  { id: 'writing-workshop', label: 'Writing Workshop', icon: PenLine },
  { id: 'achievements',     label: 'Thành Tích',       icon: Trophy },
  { id: 'notes',            label: 'Ghi Chú',          icon: Notebook },
  { id: 'mistakes-review',  label: 'Ôn Lỗi Sai',       icon: AlertTriangle },
  { id: 'settings',      label: 'Cài Đặt',      icon: SettingsIcon },
]

export default function Navbar({ currentPage, setCurrentPage, darkMode, setDarkMode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { state } = useApp()
  const currentStage = getStageByXP(state.xp || 0)

  const navigate = (id) => {
    setCurrentPage(id)
    setMobileOpen(false)
  }

  return (
    <nav className="bg-white/85 dark:bg-gray-900/85 glass shadow-sm sticky top-0 z-50 border-b border-gray-100 dark:border-gray-700">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Top row: Logo + XP + Theme + Hamburger */}
        <div className="flex items-center justify-between h-14 sm:h-16">

          {/* Logo */}
          <button
            onClick={() => navigate('dashboard')}
            className="flex items-center gap-2 group flex-shrink-0"
          >
            <span className="text-2xl group-hover:scale-110 group-hover:rotate-6 transition-transform">🎓</span>
            <div className="hidden sm:flex flex-col leading-none">
              <span className="font-bold text-sm text-gradient">
                English Master IELTS
              </span>
              <span className="text-xs text-gray-400">Từ mất gốc → IELTS 6.0</span>
            </div>
            <span className="font-bold text-sm text-indigo-600 dark:text-indigo-400 sm:hidden">EMI</span>
          </button>

          {/* Right: XP + Level + Theme + Hamburger */}
          <div className="flex items-center gap-2">
            {/* XP Badge */}
            <div
              onClick={() => navigate('roadmap')}
              className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-200 animate-gradient-x text-white px-3 py-1.5 rounded-xl cursor-pointer hover:scale-105 hover:shadow-glow-sm transition-all btn-shine"
            >
              <span className="text-sm">{currentStage.icon}</span>
              <div className="text-xs leading-none">
                <div className="font-bold">{(state.xp || 0).toLocaleString()} XP</div>
                <div className="opacity-80">Lv.{state.level || 1}</div>
              </div>
            </div>

            {/* Streak */}
            {(state.streak || 0) > 0 && (
              <div className="hidden sm:flex items-center gap-1 bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 px-2 py-1.5 rounded-xl hover:scale-105 transition-transform">
                <span className="text-sm animate-bounce-slow">🔥</span>
                <span className="text-xs font-bold">{state.streak}</span>
              </div>
            )}

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
              aria-label="Đổi giao diện sáng/tối"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => setMobileOpen(o => !o)}
              className="lg:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
              aria-label="Mở/đóng menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Desktop Nav: WRAPPED rows (no horizontal scroll) */}
        <div className="hidden lg:flex flex-wrap gap-1 pb-2 -mt-1">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => navigate(id)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[12px] font-medium whitespace-nowrap transition-all hover:scale-105
                ${currentPage === id
                  ? 'bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/60 dark:to-purple-900/60 text-indigo-700 dark:text-indigo-300 shadow-sm ring-1 ring-indigo-200 dark:ring-indigo-700'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/60'
                }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-gray-100 dark:border-gray-700 py-2 max-h-[70vh] overflow-y-auto">
            {/* Mobile XP */}
            <div className="flex items-center gap-3 px-4 py-3 mb-1 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl mx-1">
              <span className="text-2xl">{currentStage.icon}</span>
              <div>
                <div className="text-sm font-bold text-indigo-700 dark:text-indigo-300">{currentStage.name}</div>
                <div className="text-xs text-gray-500">{(state.xp || 0).toLocaleString()} XP · Lv.{state.level || 1} · 🔥{state.streak || 0}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-1">
              {navItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => navigate(id)}
                  className={`flex items-center gap-2 px-3 py-2.5 text-xs font-medium rounded-xl transition-all ${
                    currentPage === id
                      ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <Icon size={16} />
                  <span className="truncate">{label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
