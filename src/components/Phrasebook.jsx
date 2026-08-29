import { useState, useMemo } from 'react'
import { situations, totalPhrases } from '../data/phrasebook'
import { speak, stopSpeaking, isSpeechSupported } from '../utils/speech'
import { useApp } from '../context/AppContext'
import { Volume2, VolumeX, ChevronRight, ChevronLeft, BookOpen, Star, Copy, Check } from 'lucide-react'

function makePhraseId(situationId, phraseIdx) { return `${situationId}-${phraseIdx}` }

function PhraseCard({ phrase, idx, situationId, isFav, onToggleFav }) {
  const [playing, setPlaying] = useState(false)
  const [copied, setCopied] = useState(false)
  const ttsSupported = isSpeechSupported()

  const handleSpeak = () => {
    if (playing) { stopSpeaking(); setPlaying(false); return }
    setPlaying(true)
    speak(phrase.en, { rate: 0.85, onEnd: () => setPlaying(false) })
  }

  const handleCopy = () => {
    navigator.clipboard?.writeText(phrase.en).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2">
            <span className="text-xs text-gray-400 font-mono mt-0.5 flex-shrink-0">{idx + 1}.</span>
            <div>
              <p className="font-semibold text-gray-800 dark:text-gray-100 leading-snug">{phrase.en}</p>
              <p className="text-sm text-indigo-600 dark:text-indigo-300 mt-1">{phrase.vi}</p>
              {phrase.note && (
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-1">
                  <span>💡</span> {phrase.note}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-1 flex-shrink-0">
          <button onClick={() => onToggleFav?.(makePhraseId(situationId, idx))}
            className={`p-2 rounded-xl transition-colors ${isFav ? 'text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20' : 'text-gray-300 dark:text-gray-600 hover:text-yellow-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            title={isFav ? 'Bỏ yêu thích' : 'Yêu thích'}
          >
            <Star size={15} fill={isFav ? 'currentColor' : 'none'} />
          </button>
          <button onClick={handleCopy}
            className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Copy"
          >
            {copied ? <Check size={15} className="text-green-500" /> : <Copy size={15} />}
          </button>
          {ttsSupported && (
            <button onClick={handleSpeak}
              className={`p-2 rounded-xl transition-colors ${playing ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              title="Nghe phát âm"
            >
              {playing ? <VolumeX size={15} /> : <Volume2 size={15} />}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function SituationDetail({ situation, onBack }) {
  const { state, dispatch } = useApp()
  const [playingAll, setPlayingAll] = useState(false)
  const [filter, setFilter] = useState('')
  const [showFavOnly, setShowFavOnly] = useState(false)
  const ttsSupported = isSpeechSupported()

  const displayed = useMemo(() => {
    let list = situation.phrases
    if (showFavOnly) {
      list = situation.phrases.filter((p, idx) => state.favoritePhrases.includes(makePhraseId(situation.id, idx)))
    }
    if (filter) {
      list = list.filter(p => p.en.toLowerCase().includes(filter.toLowerCase()) || p.vi.includes(filter))
    }
    return list
  }, [situation, filter, showFavOnly, state.favoritePhrases])

  const toggleFav = (phraseId) => {
    if (state.favoritePhrases.includes(phraseId)) {
      dispatch({ type: 'UNMARK_LEARNED', key: 'favoritePhrases', id: phraseId })
    } else {
      dispatch({ type: 'MARK_LEARNED', key: 'favoritePhrases', id: phraseId })
    }
  }

  const handlePlayAll = () => {
    if (playingAll) { stopSpeaking(); setPlayingAll(false); return }
    setPlayingAll(true)
    let i = 0
    const playNext = () => {
      if (i >= displayed.length) { setPlayingAll(false); return }
      speak(displayed[i].en, { rate: 0.85, onEnd: () => { i++; setTimeout(playNext, 600) } })
    }
    playNext()
  }

  return (
    <div className="space-y-4 animate-fade-up">
      {/* Header */}
      <div className={`bg-gradient-to-r ${situation.color} bg-200 animate-gradient-x rounded-3xl p-5 text-white shadow-xl relative overflow-hidden`}>
        <div className="blob bg-white/30 w-36 h-36 -top-8 -right-8" />
        <div className="blob bg-white/20 w-28 h-28 -bottom-8 -left-8 animate-float-slow" />
        <button onClick={onBack} className="relative flex items-center gap-1 text-white/80 hover:text-white hover:-translate-x-0.5 text-sm mb-3 transition-all">
          <ChevronLeft size={16} /> Quay lại
        </button>
        <div className="relative flex items-center justify-between gap-3 flex-wrap">
          <div>
            <div className="text-3xl mb-1 animate-float">{situation.icon}</div>
            <h2 className="text-xl font-bold drop-shadow">{situation.title}</h2>
            <p className="text-sm opacity-80">{situation.titleEn}</p>
            <p className="text-xs opacity-80 mt-1">{situation.phrases.length} câu thông dụng</p>
          </div>
          {ttsSupported && (
            <button onClick={handlePlayAll}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105 ${
                playingAll ? 'bg-white/30 animate-glow' : 'bg-white/20 hover:bg-white/30 btn-shine'
              }`}
            >
              {playingAll ? <VolumeX size={16} /> : <Volume2 size={16} />}
              {playingAll ? 'Dừng' : 'Nghe tất cả'}
            </button>
          )}
        </div>
      </div>

      {/* Search + fav filter */}
      <div className="flex gap-2">
        <input
          value={filter}
          onChange={e => setFilter(e.target.value)}
          placeholder="Tìm câu..."
          className="flex-1 px-4 py-2.5 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button onClick={() => setShowFavOnly(v => !v)}
          className={`px-3 py-2.5 rounded-xl border text-sm transition-all flex items-center gap-1.5 ${
            showFavOnly
              ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700 text-yellow-700 dark:text-yellow-300'
              : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-yellow-300'
          }`}>
          <Star size={14} fill={showFavOnly ? 'currentColor' : 'none'} /> {state.favoritePhrases.length}
        </button>
      </div>

      {/* Phrase list */}
      <div className="space-y-2">
        {displayed.map((phrase, idx) => (
          <PhraseCard key={idx} phrase={phrase} idx={idx} situationId={situation.id} isFav={state.favoritePhrases.includes(makePhraseId(situation.id, idx))} onToggleFav={toggleFav} />
        ))}
      </div>

      {displayed.length === 0 && (
        <p className="text-center text-gray-400 text-sm py-8">Không tìm thấy câu nào.</p>
      )}
    </div>
  )
}

export default function Phrasebook() {
  const { state } = useApp()
  const [selected, setSelected] = useState(null)

  if (selected) {
    return <SituationDetail situation={selected} onBack={() => setSelected(null)} />
  }

  return (
    <div className="space-y-5 animate-fade-up">
      {/* Premium Header */}
      <div className="bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600 bg-200 animate-gradient-x rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="blob bg-blue-300/40 w-44 h-44 -top-12 -right-12" />
        <div className="blob bg-violet-300/40 w-36 h-36 -bottom-12 -left-10 animate-float-slow" />
        <div className="relative">
          <p className="text-violet-100 text-sm">Giao Tiếp Thực Tế</p>
          <h1 className="text-2xl font-bold mt-0.5 drop-shadow flex items-center gap-2">
            <BookOpen size={22} className="animate-float" /> Phrasebook
          </h1>
          <p className="text-sm text-violet-100 mt-1">Câu mẫu cho {situations.length} tình huống · {totalPhrases} câu</p>
        </div>
        <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
          {[
            { v: situations.length, l: 'Tình huống', e: '🗺️' },
            { v: totalPhrases,      l: 'Câu mẫu',    e: '💬' },
            { v: state.favoritePhrases.length, l: 'Yêu thích', e: '⭐' },
            { v: '100%',                        l: 'Offline',   e: '📶' },
          ].map((s, i) => (
            <div key={i} className="bg-white/15 backdrop-blur-sm rounded-xl p-2.5 text-center hover:scale-105 transition-transform">
              <div className="text-sm">{s.e}</div>
              <div className="font-bold animate-count-up">{s.v}</div>
              <div className="text-xs text-violet-100 leading-none">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 flex gap-3">
        <span className="text-xl flex-shrink-0">💡</span>
        <div className="text-sm text-amber-800 dark:text-amber-200">
          <span className="font-semibold">Mẹo học:</span> Tap 🔊 để nghe phát âm chuẩn. Tap 📋 để copy câu. Luyện đọc to từng câu trước khi vào tình huống thật.
        </div>
      </div>

      {/* Situation grid */}
      <div>
        <h2 className="font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
          <BookOpen size={16} className="text-indigo-500" /> Chọn tình huống
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {situations.map(s => (
            <button
              key={s.id}
              onClick={() => setSelected(s)}
              className={`${s.bg} ${s.border} border rounded-2xl p-4 text-left group hover:shadow-md transition-all hover:-translate-y-0.5`}
            >
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{s.icon}</div>
              <div className="font-bold text-gray-800 dark:text-gray-100 text-sm">{s.title}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.description}</div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-400">{s.phrases.length} câu</span>
                <ChevronRight size={14} className="text-gray-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Quick reference — most useful phrases */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm">
        <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
          <Star size={16} className="text-yellow-500" /> Câu Dùng Nhiều Nhất
        </h3>
        <div className="space-y-2">
          {[
            { en: "Could you speak more slowly, please?", vi: "Bạn có thể nói chậm hơn không?", src: "📞" },
            { en: "Could I have the bill, please?",       vi: "Cho tôi hóa đơn được không?",    src: "🍽️" },
            { en: "Is this on sale?",                     vi: "Cái này đang giảm giá không?",    src: "🛍️" },
            { en: "Where is the nearest...?",             vi: "Cái gần nhất ở đâu?",             src: "🗺️" },
            { en: "I'm allergic to...",                   vi: "Tôi bị dị ứng với...",             src: "🏥" },
          ].map((p, i) => (
            <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-50 dark:border-gray-700 last:border-0">
              <span className="text-lg flex-shrink-0">{p.src}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">{p.en}</p>
                <p className="text-xs text-indigo-600 dark:text-indigo-300 truncate">{p.vi}</p>
              </div>
              {isSpeechSupported() && (
                <button
                  onClick={() => speak(p.en, { rate: 0.85 })}
                  className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
                >
                  <Volume2 size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
