import { Component } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo })
    if (typeof console !== 'undefined') {
      console.error('ErrorBoundary caught:', error, errorInfo)
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  handleHardReset = () => {
    try {
      localStorage.removeItem('english_master_progress_v1')
    } catch {}
    window.location.reload()
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-rose-50 via-white to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-lg w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 border border-rose-200/60 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-rose-100 dark:bg-rose-900/40">
              <AlertTriangle className="w-6 h-6 text-rose-600 dark:text-rose-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Đã có lỗi xảy ra</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Đừng lo, dữ liệu học của bạn vẫn an toàn.</p>
            </div>
          </div>

          {this.state.error && (
            <div className="mb-5 p-3 rounded-lg bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800">
              <p className="text-sm font-mono text-rose-700 dark:text-rose-300 break-all">
                {String(this.state.error.message || this.state.error)}
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={this.handleReset}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition"
            >
              <RefreshCw className="w-4 h-4" /> Thử lại
            </button>
            <button
              onClick={() => window.location.reload()}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 font-medium transition"
            >
              <Home className="w-4 h-4" /> Tải lại trang
            </button>
          </div>

          <details className="mt-4 text-xs text-gray-500 dark:text-gray-400">
            <summary className="cursor-pointer hover:text-gray-700 dark:hover:text-gray-300">Tùy chọn nâng cao</summary>
            <button
              onClick={this.handleHardReset}
              className="mt-2 text-rose-600 dark:text-rose-400 hover:underline"
            >
              Reset toàn bộ tiến trình & tải lại
            </button>
          </details>
        </div>
      </div>
    )
  }
}
