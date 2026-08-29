import { useState, useMemo, useEffect } from 'react'
import { Search, Volume2, CheckCircle, Circle, BookOpen, Filter } from 'lucide-react'
import { vocabulary, levels, topics } from '../data/vocabulary'
import { useApp } from '../context/AppContext'
import { speak } from '../utils/speech'
import { ProgressRing, PremiumStatCard } from './AudioVisuals'

const PAGE_SIZE = 60   // render in chunks so we never mount thousands of cards

const levelColors = {
  Beginner: 'bg-lime-100 text-lime-700 dark:bg-lime-900/40 dark:text-lime-300',
  A1: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  A2: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  B1: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  'B1+': 'bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/40 dark:text-fuchsia-300',
  'IELTS Foundation': 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  'IELTS 5.0-6.0': 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
}

export default function VocabularyPage() {
  const { state, dispatch } = useApp()
  const [search, setSearch] = useState('')
  const [filterLevel, setFilterLevel] = useState('All')
  const [filterTopic, setFilterTopic] = useState('All')
  const [expandedId, setExpandedId] = useState(null)
  const [showLearned, setShowLearned] = useState('all') // all | learned | unlearned
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  const filtered = useMemo(() => {
    return vocabulary.filter(w => {
      const matchLevel = filterLevel === 'All' || w.level === filterLevel
      const matchTopic = filterTopic === 'All' || w.topic === filterTopic
      const matchSearch = !search ||
        w.english.toLowerCase().includes(search.toLowerCase()) ||
        w.vietnamese.toLowerCase().includes(search.toLowerCase())
      const isLearned = state.learnedWords.includes(w.id)
      const matchLearned = showLearned === 'all' ||
        (showLearned === 'learned' && isLearned) ||
        (showLearned === 'unlearned' && !isLearned)
      return matchLevel && matchTopic && matchSearch && matchLearned
    })
  }, [search, filterLevel, filterTopic, showLearned, state.learnedWords])

  // Reset the visible window whenever the filtered result changes, so a new
  // search/filter starts from the top instead of keeping a huge list mounted.
  useEffect(() => { setVisibleCount(PAGE_SIZE) }, [search, filterLevel, filterTopic, showLearned])

  const visible = useMemo(() => filtered.slice(0, visibleCount), [filtered, visibleCount])

  const toggleLearn = (wordId) => {
    if (state.learnedWords.includes(wordId)) {
      dispatch({ type: 'UNLEARN_WORD', wordId })
    } else {
      dispatch({ type: 'LEARN_WORD', wordId })
    }
  }

  const allTopics = ['All', ...topics]
  const learnedCount = vocabulary.filter(w => state.learnedWords.includes(w.id)).length
  const learnedPct = vocabulary.length > 0 ? Math.round((learnedCount / vocabulary.length) * 100) : 0
  const learnedByLevel = useMemo(() => {
    const map = {}
    levels.forEach(l => {
      const total = vocabulary.filter(w => w.level === l).length
      const done = vocabulary.filter(w => w.level === l && state.learnedWords.includes(w.id)).length
      map[l] = { total, done, pct: total > 0 ? Math.round((done / total) * 100) : 0 }
    })
    return map
  }, [state.learnedWords])

  return (
    <div className="space-y-5 animate-fade-up">
      {/* Premium hero */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-200 animate-gradient-x rounded-3xl p-6 text-white relative overflow-hidden">
        <div className="blob bg-pink-400/40 w-44 h-44 -top-12 -right-12" />
        <div className="blob bg-indigo-300/40 w-36 h-36 -bottom-12 -left-10 animate-float-slow" />
        <div className="relative flex items-center gap-5 flex-wrap">
          <ProgressRing pct={learnedPct} size={88} stroke={8} gradient={['#ffffff', '#fbcfe8']}>
            <div className="text-center">
              <div className="text-base font-extrabold">{learnedPct}%</div>
              <div className="text-[10px] uppercase tracking-wider text-pink-100">đã học</div>
            </div>
          </ProgressRing>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold flex items-center gap-2 drop-shadow">
              <BookOpen size={24} /> Từ Vựng
            </h1>
            <p className="text-sm text-indigo-100 mt-1">
              Đã học <b className="text-white">{learnedCount.toLocaleString()}</b> / {vocabulary.length.toLocaleString()} từ
            </p>
            <div className="mt-3 flex items-center gap-3 text-xs flex-wrap">
              <span className="bg-white/20 px-2 py-0.5 rounded-full">{filtered.length} đang hiển thị</span>
              <span className="bg-white/20 px-2 py-0.5 rounded-full">{topics.length} chủ đề</span>
              <span className="bg-white/20 px-2 py-0.5 rounded-full">{levels.length} cấp độ</span>
            </div>
          </div>
        </div>
      </div>

      {/* Premium per-level stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {levels.map(lv => {
          const s = learnedByLevel[lv] || { total: 0, done: 0, pct: 0 }
          return (
            <div key={lv} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-3 text-center card-hover">
              <span className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-full ${levelColors[lv] || ''}`}>{lv}</span>
              <div className="text-lg font-bold text-gray-800 dark:text-gray-100 mt-1.5">{s.done}<span className="text-xs text-gray-400">/{s.total}</span></div>
              <div className="bg-gray-100 dark:bg-gray-700 rounded-full h-1.5 mt-1 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-1.5 rounded-full transition-all duration-700" style={{ width: `${s.pct}%` }} />
              </div>
              <div className="text-[10px] text-gray-400 mt-1">{s.pct}%</div>
            </div>
          )
        })}
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Tìm từ tiếng Anh hoặc tiếng Việt..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
        />
      </div>

      {/* Filters */}
      <div className="space-y-2">
        {/* Level filter */}
        <div className="flex gap-2 flex-wrap">
          {['All', ...levels].map(l => (
            <button
              key={l}
              onClick={() => setFilterLevel(l)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterLevel === l
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-indigo-300'
              }`}
            >
              {l === 'All' ? '🌐 Tất cả' : l}
            </button>
          ))}
          {/* Learned filter */}
          <div className="ml-auto flex gap-2">
            {[['all','Tất cả'],['learned','✅ Đã học'],['unlearned','📚 Chưa học']].map(([v,label]) => (
              <button
                key={v}
                onClick={() => setShowLearned(v)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  showLearned === v
                    ? 'bg-green-600 text-white shadow-sm'
                    : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Topic filter */}
        <div className="flex gap-2 flex-wrap">
          {allTopics.slice(0, 10).map(t => (
            <button
              key={t}
              onClick={() => setFilterTopic(t)}
              className={`px-2.5 py-1 rounded-lg text-xs transition-all ${
                filterTopic === t
                  ? 'bg-purple-600 text-white'
                  : 'bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-600 hover:border-purple-300'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Hiển thị <span className="font-semibold text-gray-700 dark:text-gray-200">{filtered.length}</span> từ
      </p>

      {/* Word cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {visible.map((word, idx) => {
          const isLearned = state.learnedWords.includes(word.id)
          const isExpanded = expandedId === word.id
          return (
            <div
              key={word.id}
              style={{ animationDelay: `${(idx % 30) * 18}ms` }}
              className={`rounded-2xl border transition-all duration-200 cursor-pointer animate-fade-up card-hover
                ${isLearned
                  ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/10 border-green-200 dark:border-green-700'
                  : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-600'
                }`}
              onClick={() => setExpandedId(isExpanded ? null : word.id)}
            >
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-gray-800 dark:text-gray-100 text-base">{word.english}</h3>
                      <span className={`text-xs font-bold px-1.5 py-0.5 rounded-md ${levelColors[word.level]}`}>{word.level}</span>
                    </div>
                    <p className="text-xs text-gray-400 font-mono mt-0.5">{word.pronunciation}</p>
                    <p className="text-sm text-indigo-700 dark:text-indigo-300 font-semibold mt-1">{word.vietnamese}</p>
                  </div>
                  <div className="flex flex-col gap-1 items-center">
                    <button
                      onClick={e => { e.stopPropagation(); toggleLearn(word.id) }}
                      className={`p-1.5 rounded-lg transition-all ${isLearned ? 'text-green-500 hover:bg-green-100 dark:hover:bg-green-900/40' : 'text-gray-300 hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20'}`}
                      title={isLearned ? 'Bỏ học' : 'Đánh dấu đã học'}
                    >
                      {isLearned ? <CheckCircle size={20} /> : <Circle size={20} />}
                    </button>
                    <button
                      onClick={e => { e.stopPropagation(); speak(word.english) }}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all"
                      title="Phát âm"
                    >
                      <Volume2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Topic badge */}
                <div className="mt-2">
                  <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-md">
                    {word.topic}
                  </span>
                </div>
              </div>

              {/* Expanded content */}
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700 pt-3 space-y-2 animate-slide-down">
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/10 rounded-xl p-3 border border-indigo-100 dark:border-indigo-800/50">
                    <p className="text-sm text-gray-700 dark:text-gray-300 italic">"{word.example}"</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{word.example_vi}</p>
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); speak(word.example) }}
                    className="flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 hover:underline hover:scale-105 transition-transform"
                  >
                    <Volume2 size={12} /> Nghe câu ví dụ
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {visibleCount < filtered.length && (
        <button
          onClick={() => setVisibleCount(c => c + PAGE_SIZE)}
          className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors"
        >
          Tải thêm ({filtered.length - visibleCount} từ còn lại)
        </button>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-lg font-medium">Không tìm thấy từ nào</p>
          <p className="text-sm">Thử tìm kiếm hoặc thay đổi bộ lọc</p>
        </div>
      )}
    </div>
  )
}
