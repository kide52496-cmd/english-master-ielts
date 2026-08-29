import { useState, useEffect } from 'react'
import { Settings as SettingsIcon, Moon, Sun, Target, Trash2, Info, Download, Smartphone, Upload } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { grammarLessons } from '../data/grammarLessons'
import { listeningScripts } from '../data/listeningScripts'
import { speakingLessons } from '../data/speakingLessons'
import { clearAllProgress, exportAllProgress, importAllProgress } from '../utils/storage'

export default function Settings({ darkMode, setDarkMode }) {
  const { state, dispatch } = useApp()
  const [dailyGoalInput, setDailyGoalInput] = useState(state.dailyGoal || 10)
  const [saved, setSaved] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)
  const [installPrompt, setInstallPrompt] = useState(null)
  const [installed, setInstalled] = useState(false)
  const [importStatus, setImportStatus] = useState('')

  useEffect(() => {
    const handler = (e) => { e.preventDefault(); setInstallPrompt(e) }
    window.addEventListener('beforeinstallprompt', handler)
    window.addEventListener('appinstalled', () => setInstalled(true))
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!installPrompt) return
    installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    if (outcome === 'accepted') { setInstalled(true); setInstallPrompt(null) }
  }

  const handleSaveDailyGoal = () => {
    const val = Math.max(1, Math.min(100, Number(dailyGoalInput)))
    dispatch({ type: 'SET_DAILY_GOAL', goal: val })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleReset = () => {
    clearAllProgress()
    dispatch({ type: 'RESET_PROGRESS' })
    setConfirmReset(false)
    window.location.reload()
  }

  const handleExport = () => {
    const data = exportAllProgress()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `english-master-progress-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result || '{}'))
        const ok = importAllProgress(parsed)
        setImportStatus(ok ? 'Đã nhập dữ liệu. App sẽ tải lại.' : 'File không hợp lệ.')
        if (ok) setTimeout(() => window.location.reload(), 700)
      } catch {
        setImportStatus('File JSON không hợp lệ.')
      }
    }
    reader.readAsText(file)
  }

  const stats = [
    { label: 'Tổng XP', value: (state.xp || 0).toLocaleString(), icon: '⚡' },
    { label: 'Level', value: state.level || 1, icon: '🎖️' },
    { label: 'Từ đã học', value: state.learnedWords?.length || 0, icon: '📚' },
    { label: 'Ngữ pháp', value: `${state.completedGrammar?.length || 0}/${grammarLessons.length}`, icon: '✏️' },
    { label: 'Nghe', value: `${state.completedListening?.length || 0}/${listeningScripts.length}`, icon: '🔊' },
    { label: 'Nói', value: `${state.completedSpeaking?.length || 0}/${speakingLessons.length}`, icon: '🎙️' },
    { label: 'Quiz đã làm', value: state.quizScores?.length || 0, icon: '🎯' },
    { label: 'Streak', value: `${state.streak || 0} ngày`, icon: '🔥' },
  ]

  return (
    <div className="max-w-lg mx-auto space-y-5">
      {/* Header */}
      <div className="animate-fade-up">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <SettingsIcon size={24} className="text-gray-600 dark:text-gray-400" /> Cài Đặt
        </h1>
      </div>

      {/* Theme */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 card-hover animate-fade-up" style={{ animationDelay: '60ms' }}>
        <h2 className="font-bold text-gray-800 dark:text-gray-100 mb-4">🎨 Giao Diện</h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {darkMode ? <Moon size={20} className="text-indigo-400" /> : <Sun size={20} className="text-yellow-500" />}
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {darkMode ? 'Chế độ tối' : 'Chế độ sáng'}
            </span>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`relative w-14 h-7 rounded-full transition-all duration-300 ${darkMode ? 'bg-indigo-600 shadow-glow-sm' : 'bg-gray-300'}`}
          >
            <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 ${darkMode ? 'left-8' : 'left-1'}`} />
          </button>
        </div>
      </div>

      {/* Install PWA */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-200 animate-gradient-x rounded-2xl p-5 shadow-md text-white card-hover animate-fade-up relative overflow-hidden" style={{ animationDelay: '120ms' }}>
        <div className="blob bg-pink-300/40 w-32 h-32 -top-6 -right-6" />
        <div className="relative">
          <h2 className="font-bold mb-1 flex items-center gap-2">
            <Smartphone size={18} /> Cài App Lên Thiết Bị
          </h2>
          <p className="text-sm text-indigo-200 mb-4">Cài lên màn hình chính, dùng như app thật, mở nhanh hơn, không cần trình duyệt.</p>
          {installed ? (
            <div className="flex items-center gap-2 bg-white/20 rounded-xl px-4 py-2.5 text-sm font-semibold">
              ✅ Đã cài thành công!
            </div>
          ) : installPrompt ? (
            <button onClick={handleInstall}
              className="flex items-center gap-2 bg-white text-indigo-700 font-bold px-5 py-2.5 rounded-xl hover:bg-indigo-50 hover:scale-105 transition-all btn-shine"
            >
              <Download size={16} /> Cài Ngay
            </button>
          ) : (
            <div className="space-y-2 text-sm text-indigo-100">
              <p className="font-semibold">Cách cài thủ công:</p>
              <p>📱 <strong>iOS Safari:</strong> Tap nút Chia sẻ → "Thêm vào màn hình chính"</p>
              <p>🤖 <strong>Android Chrome:</strong> Menu ⋮ → "Thêm vào màn hình chính"</p>
              <p>💻 <strong>Chrome/Edge PC:</strong> Biểu tượng cài ở thanh địa chỉ ⊕</p>
            </div>
          )}
        </div>
      </div>

      {/* Daily Goal */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">        <h2 className="font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Target size={18} className="text-indigo-600" /> Mục Tiêu Hàng Ngày
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
          Số hoạt động cần hoàn thành mỗi ngày (học từ, quiz, ngữ pháp)
        </p>
        <div className="flex items-center gap-3">
          <input
            type="number"
            min="1" max="100"
            value={dailyGoalInput}
            onChange={e => setDailyGoalInput(e.target.value)}
            className="w-24 text-center text-lg font-bold bg-indigo-50 dark:bg-indigo-900/30 border-2 border-indigo-200 dark:border-indigo-700 rounded-xl py-2 text-indigo-700 dark:text-indigo-300 focus:outline-none focus:border-indigo-500"
          />
          <span className="text-sm text-gray-500">hoạt động/ngày</span>
          <button
            onClick={handleSaveDailyGoal}
            className={`ml-auto px-4 py-2 rounded-xl text-sm font-semibold transition-all ${saved ? 'bg-green-500 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
          >
            {saved ? '✓ Đã lưu' : 'Lưu'}
          </button>
        </div>
        {/* Presets */}
        <div className="flex gap-2 mt-3">
          {[5, 10, 20, 30].map(n => (
            <button
              key={n}
              onClick={() => setDailyGoalInput(n)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
                Number(dailyGoalInput) === n
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Stats summary */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="font-bold text-gray-800 dark:text-gray-100 mb-4">📊 Thống Kê Của Bạn</h2>
        <div className="grid grid-cols-3 gap-3">
          {stats.map((s, i) => (
            <div key={i} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3 text-center">
              <div className="text-xl mb-1">{s.icon}</div>
              <div className="font-bold text-gray-800 dark:text-gray-100 text-sm">{s.value}</div>
              <div className="text-xs text-gray-400 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Backup */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
          <Download size={18} className="text-indigo-500" /> Sao lưu tiến độ
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
          Xuất/nhập toàn bộ XP, streak, từ đã học, Review Center và cài đặt local. Không cần tài khoản hay API key.
        </p>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold"
          >
            <Download size={15} /> Xuất JSON
          </button>
          <label className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-semibold cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600">
            <Upload size={15} /> Nhập JSON
            <input type="file" accept="application/json,.json" className="hidden" onChange={handleImport} />
          </label>
        </div>
        {importStatus && <p className="text-xs text-indigo-500 mt-2">{importStatus}</p>}
      </div>

      {/* About */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
          <Info size={18} className="text-blue-500" /> Về App
        </h2>
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex justify-between">
            <span>Tên app</span>
            <span className="font-medium text-gray-800 dark:text-gray-200">English Master IELTS</span>
          </div>
          <div className="flex justify-between">
            <span>Phiên bản</span>
            <span className="font-medium text-gray-800 dark:text-gray-200">2.0.0</span>
          </div>
          <div className="flex justify-between">
            <span>Mục tiêu</span>
            <span className="font-medium text-gray-800 dark:text-gray-200">Mất gốc → IELTS 6.0</span>
          </div>
          <div className="flex justify-between">
            <span>Offline</span>
            <span className="text-green-600 font-medium">100% ✓</span>
          </div>
          <div className="border-t border-gray-100 dark:border-gray-700 pt-2 mt-2">
            <div className="flex justify-between">
              <span>Tác giả</span>
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">Nguyễn An Dương</span>
            </div>
          </div>
          <div className="text-center pt-2 text-xs text-gray-400">
            © 2026 Nguyễn An Dương · All rights reserved
          </div>
        </div>
      </div>

      {/* Reset */}
      <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-5 border border-red-200 dark:border-red-800">
        <h2 className="font-bold text-red-700 dark:text-red-400 mb-2 flex items-center gap-2">
          <Trash2 size={18} /> Xóa Tiến Độ
        </h2>
        <p className="text-xs text-red-500 dark:text-red-400 mb-3">
          ⚠️ Hành động này không thể hoàn tác. Toàn bộ XP, từ đã học, và thành tích sẽ bị xóa.
        </p>
        {!confirmReset ? (
          <button
            onClick={() => setConfirmReset(true)}
            className="px-4 py-2 bg-white dark:bg-gray-700 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium hover:bg-red-50 transition-colors"
          >
            Xóa tất cả tiến độ
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => setConfirmReset(false)}
              className="flex-1 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 rounded-xl text-sm font-medium"
            >
              Hủy
            </button>
            <button
              onClick={handleReset}
              className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold transition-colors"
            >
              ✓ Xác nhận xóa
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
