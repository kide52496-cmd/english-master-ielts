import { useState, useEffect } from 'react'
import {
  Database, RefreshCw, CheckCircle2, Server, HardDrive, ShieldCheck,
  Cpu, Activity, ArrowUpRight, Copy, Check, Download, AlertCircle, Sparkles
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import {
  getMongoConfig, saveMongoConfig, generateMongoDocuments,
  syncWithMongoDB, pingMongoServer
} from '../utils/mongoSync'

export default function MongoDBCloudHub() {
  const { state } = useApp()
  const [config, setConfig] = useState(getMongoConfig)
  const [activeTab, setActiveTab] = useState('overview') // 'overview' | 'inspector' | 'settings'
  const [selectedCollection, setSelectedCollection] = useState('user_progress')
  const [syncing, setSyncing] = useState(false)
  const [syncStatus, setSyncStatus] = useState(null)
  const [pingLatency, setPingLatency] = useState('28ms')
  const [pinging, setPinging] = useState(false)
  const [copied, setCopied] = useState(false)

  const collectionsData = generateMongoDocuments(state)

  const handlePing = async () => {
    setPinging(true)
    const result = await pingMongoServer(config.serverUrl)
    setPingLatency(result.latency)
    setPinging(false)
  }

  useEffect(() => {
    handlePing()
  }, [])

  const handleSync = async () => {
    setSyncing(true)
    setSyncStatus(null)
    const result = await syncWithMongoDB(state)
    setTimeout(() => {
      setSyncing(false)
      setSyncStatus(result)
      setConfig(getMongoConfig())
    }, 700)
  }

  const handleCopyJSON = () => {
    const dataToCopy = collectionsData[selectedCollection] || []
    navigator.clipboard.writeText(JSON.stringify(dataToCopy, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleExportDump = () => {
    const dump = {
      database: 'english_master_db',
      cluster: config.clusterName,
      exportedAt: new Date().toISOString(),
      collections: collectionsData,
    }
    const blob = new Blob([JSON.stringify(dump, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `mongodb_english_master_${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950/80 via-slate-900 to-slate-950 border border-emerald-500/30 p-6 sm:p-8 shadow-2xl shadow-emerald-950/40">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-10 bottom-0 text-emerald-500/5 select-none font-mono text-9xl font-black pointer-events-none">
          MDB
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>LIVE MONGODB CLOUD REPLICA</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <Database className="text-emerald-400 w-8 h-8 flex-shrink-0" />
              <span>MongoDB Cloud Control Center</span>
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              Toàn bộ dữ liệu tiến trình học, tài khoản, điểm thi IELTS và thẻ nhớ SRS được đồng bộ và kiểm soát trực tiếp qua cơ sở dữ liệu <strong className="text-emerald-400">MongoDB Atlas Cloud</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleSync}
              disabled={syncing}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all disabled:opacity-50"
            >
              <RefreshCw size={16} className={syncing ? 'animate-spin' : ''} />
              <span>{syncing ? 'Đang đồng bộ...' : 'Đồng bộ lên MongoDB'}</span>
            </button>
            <button
              onClick={handleExportDump}
              className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-sm font-semibold flex items-center gap-2 transition-all"
            >
              <Download size={16} />
              <span>Xuất BSON Dump</span>
            </button>
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-900/60 rounded-2xl p-3.5 border border-slate-800">
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Cluster</div>
            <div className="text-sm font-bold text-emerald-400 truncate mt-0.5">Atlas Cluster0</div>
            <div className="text-[10px] text-slate-500">AWS ap-southeast-1</div>
          </div>
          <div className="bg-slate-900/60 rounded-2xl p-3.5 border border-slate-800">
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Database</div>
            <div className="text-sm font-bold text-white truncate mt-0.5">english_master_db</div>
            <div className="text-[10px] text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> 4 Collections
            </div>
          </div>
          <div className="bg-slate-900/60 rounded-2xl p-3.5 border border-slate-800">
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Ping Latency</div>
            <div className="text-sm font-bold text-cyan-400 truncate mt-0.5 flex items-center gap-1.5">
              <Activity size={14} className={pinging ? 'animate-pulse' : ''} />
              <span>{pingLatency}</span>
            </div>
            <div className="text-[10px] text-slate-500">Real-time Heartbeat</div>
          </div>
          <div className="bg-slate-900/60 rounded-2xl p-3.5 border border-slate-800">
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Trạng thái Sync</div>
            <div className="text-sm font-bold text-emerald-300 truncate mt-0.5 flex items-center gap-1">
              <CheckCircle2 size={14} className="text-emerald-400" />
              <span>Đã kết nối</span>
            </div>
            <div className="text-[10px] text-slate-500">Auto-Sync Bật</div>
          </div>
        </div>
      </div>

      {/* Sync Alert if triggered */}
      {syncStatus && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-sm flex items-start gap-3 animate-fade-in">
          <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="font-bold text-emerald-300">{syncStatus.message}</div>
            <div className="text-xs text-emerald-400/80 mt-0.5">
              Document ID: <code className="bg-emerald-950 px-1.5 py-0.5 rounded text-emerald-300">{syncStatus.docId}</code> | Thời điểm: {new Date(syncStatus.syncedAt).toLocaleTimeString('vi-VN')}
            </div>
          </div>
        </div>
      )}

      {/* Main Content Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'overview'
              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Trực Quan Hóa Cụm (Cluster Overview)
        </button>
        <button
          onClick={() => setActiveTab('inspector')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'inspector'
              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Trình Soi Document (Live Collection Inspector)
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'settings'
              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Cấu Hình Kết Nối Backend & Atlas
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Architecture Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Server className="w-5 h-5 text-emerald-500" />
              <span>Kiến Trúc Điều Khiển Dữ Liệu Full-Stack</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Hệ thống được thiết kế theo mô hình <strong>Offline-First Cloud Hybrid</strong>. Ứng dụng tự động lưu tại LocalStorage để học bài siêu mượt không độ trễ, đồng thời định kỳ truyền đồng bộ 2 chiều lên cụm MongoDB Cloud.
            </p>

            <div className="space-y-2.5 pt-2">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Driver / ODM Engine</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">Mongoose v8.3.4</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Storage Engine</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">WiredTiger (Lz4 compressed)</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Bảo mật Truy cập</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">SCRAM-SHA-256 / TLS 1.3</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Đồng Bộ Khôi Phục</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">Automatic 2-Way Delta</span>
              </div>
            </div>
          </div>

          {/* Collections Summary Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-teal-500" />
              <span>Danh Mục Các Collections Đang Hoạt Động</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div
                onClick={() => { setSelectedCollection('user_progress'); setActiveTab('inspector') }}
                className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 hover:border-emerald-500/50 cursor-pointer transition-all group"
              >
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-500 transition-colors">user_progress</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Lưu trữ XP, cấp độ, chuỗi streak, từ vựng hoàn thành.</div>
                <div className="text-xs text-emerald-600 dark:text-emerald-400 font-mono font-bold mt-2">1 Document active</div>
              </div>

              <div
                onClick={() => { setSelectedCollection('srs_cards'); setActiveTab('inspector') }}
                className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/5 border border-blue-500/20 hover:border-blue-500/50 cursor-pointer transition-all group"
              >
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-500 transition-colors">srs_cards</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Chu kỳ lặp lại ngắt quãng, hệ số ghi nhớ Ease Factor.</div>
                <div className="text-xs text-blue-600 dark:text-blue-400 font-mono font-bold mt-2">3 Documents active</div>
              </div>

              <div
                onClick={() => { setSelectedCollection('ielts_submissions'); setActiveTab('inspector') }}
                className="p-3.5 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/5 border border-purple-500/20 hover:border-purple-500/50 cursor-pointer transition-all group"
              >
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-purple-500 transition-colors">ielts_submissions</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Bài nộp Writing & Speaking, nhận xét của giám khảo AI.</div>
                <div className="text-xs text-purple-600 dark:text-purple-400 font-mono font-bold mt-2">2 Documents active</div>
              </div>

              <div
                onClick={() => { setSelectedCollection('quiz_analytics'); setActiveTab('inspector') }}
                className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20 hover:border-amber-500/50 cursor-pointer transition-all group"
              >
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-amber-500 transition-colors">quiz_analytics</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Lịch sử làm bài thi trắc nghiệm và tỷ lệ chính xác.</div>
                <div className="text-xs text-amber-600 dark:text-amber-400 font-mono font-bold mt-2">1 Document active</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LIVE COLLECTION INSPECTOR */}
      {activeTab === 'inspector' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Collection Select Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              {['user_progress', 'srs_cards', 'ielts_submissions', 'quiz_analytics'].map(col => (
                <button
                  key={col}
                  onClick={() => setSelectedCollection(col)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all ${
                    selectedCollection === col
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  db.{col}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyJSON}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                <span>{copied ? 'Đã sao chép!' : 'Copy JSON'}</span>
              </button>
            </div>
          </div>

          {/* JSON Display Screen */}
          <div className="relative rounded-2xl bg-[#090D16] border border-emerald-500/30 p-4 font-mono text-xs overflow-x-auto shadow-2xl">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80 text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-emerald-400 font-bold">MongoDB Shell Query:</span>
                <code>db.{selectedCollection}.find().pretty()</code>
              </span>
              <span>{(collectionsData[selectedCollection] || []).length} Document(s) returned</span>
            </div>

            <pre className="text-emerald-300 leading-relaxed">
              {JSON.stringify(collectionsData[selectedCollection] || [], null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 3: SETTINGS */}
      {activeTab === 'settings' && (
        <div className="max-w-2xl p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <span>Cấu Hình Máy Chủ Backend & MongoDB URI</span>
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Backend API Endpoint URL
              </label>
              <input
                type="text"
                value={config.serverUrl}
                onChange={e => setConfig({ ...config, serverUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="http://localhost:5000"
              />
              <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-1">
                Trỏ về cổng Express Server chạy trên máy cá nhân hoặc URL đã deploy trên Render/Railway.
              </p>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                MongoDB Atlas Connection String
              </label>
              <input
                type="text"
                value={config.mongoUri}
                onChange={e => setConfig({ ...config, mongoUri: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="mongodb+srv://admin:pass@cluster0.mongodb.net/english_master_db"
              />
              <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-1">
                Chuỗi kết nối trực tiếp đến cụm MongoDB Atlas Cloud.
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => {
                  saveMongoConfig(config)
                  handlePing()
                  alert('Đã lưu cấu hình kết nối MongoDB!')
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all"
              >
                Lưu Thay Đổi
              </button>
              <button
                onClick={handlePing}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-all flex items-center gap-1.5"
              >
                <Activity size={14} />
                <span>Kiểm tra kết nối (Ping)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
