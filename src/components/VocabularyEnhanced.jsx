import { useState, useMemo } from 'react'
import { Search, Filter, Sparkles } from 'lucide-react'
import { vocabulary, levels, topics } from '../data/vocabulary'
import { useApp } from '../context/AppContext'
import VocabCardEnhanced from './VocabCardEnhanced'
import { ProgressRing, PremiumStatCard } from './AudioVisuals'

const PAGE_SIZE = 30

export default function VocabularyEnhanced() {
  const { state, dispatch } = useApp()
  const [search, setSearch] = useState('')
  const [filterLevel, setFilterLevel] = useState('All')
  const [filterTopic, setFilterTopic] = useState('All')
  const [showLearned, setShowLearned] = useState('all')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return vocabulary.filter(w => {
      const matchLevel = filterLevel === 'All' || w.level === filterLevel
      const matchTopic = filterTopic === 'All' || w.topic === filterTopic
      const matchSearch = !q ||
        w.english.toLowerCase().includes(q) ||
        w.vietnamese.toLowerCase().includes(q)
      const isLearned = state.learnedWords.includes(w.id)
      const matchLearned = showLearned === 'all' ||
        (showLearned === 'learned' && isLearned) ||
        (showLearned === 'unlearned' && !isLearned)
      return matchLevel && matchTopic && matchSearch && matchLearned
    })
  }, [search, filterLevel, filterTopic, showLearned, state.learnedWords])

  const visible = filtered.slice(0, page * PAGE_SIZE)

  const toggleLearn = (wordId) => {
    if (state.learnedWords.includes(wordId)) {
      dispatch({ type: 'UNLEARN_WORD', wordId })
    } else {
      dispatch({ type: 'LEARN_WORD', wordId })
    }
  }

  return (
    <div className="space-y-4 animate-fade-up">
      {/* Premium Header */}
      <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 bg-200 animate-gradient-x text-white rounded-2xl p-5 shadow-xl relative overflow-hidden">
        <div className="blob bg-pink-300/40 w-40 h-40 -top-10 -right-10" />
        <div className="blob bg-indigo-300/40 w-32 h-32 -bottom-10 -left-8 animate-float-slow" />
        <div className="relative flex items-start gap-4 flex-wrap">
          <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center animate-float">
            <Sparkles size={22} />
          </div>
          <div className="flex-1 min-w-[180px]">
            <h2 className="text-lg sm:text-xl font-bold drop-shadow">Từ Vựng Nâng Cao</h2>
            <p className="text-xs sm:text-sm text-white/90 mt-1">
              IPA · Word family · Đồng nghĩa · Trái nghĩa · Collocations
            </p>
          </div>
          <ProgressRing
            pct={vocabulary.length > 0 ? Math.round((state.learnedWords.length / vocabulary.length) * 100) : 0}
            size={64} stroke={6} gradient={['#ffffff', '#fbcfe8']}>
            <span className="text-xs font-bold">{Math.round((state.learnedWords.length / vocabulary.length) * 100)}%</span>
          </ProgressRing>
        </div>
        <div className="relative mt-4 grid grid-cols-3 gap-2">
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-2.5 text-center hover:scale-105 transition-transform">
            <div className="text-2xl font-bold">{vocabulary.length.toLocaleString()}</div>
            <div className="text-[10px] uppercase text-white/80 tracking-wider">Tổng từ</div>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-2.5 text-center hover:scale-105 transition-transform">
            <div className="text-2xl font-bold animate-count-up">{state.learnedWords.length.toLocaleString()}</div>
            <div className="text-[10px] uppercase text-white/80 tracking-wider">Đã thuộc</div>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-2.5 text-center hover:scale-105 transition-transform">
            <div className="text-2xl font-bold">{filtered.length.toLocaleString()}</div>
            <div className="text-[10px] uppercase text-white/80 tracking-wider">Bộ lọc</div>
          </div>
        </div>
      </div>

      {/* Search + filters */}
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-3 sm:p-4">
        <div className="flex items-center gap-2 mb-3">
          <Search size={16} className="text-gray-400 flex-shrink-0" />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            placeholder="Tìm từ tiếng Anh hoặc nghĩa tiếng Việt..."
            className="flex-1 bg-transparent outline-none text-sm placeholder-gray-400 text-gray-800 dark:text-gray-100"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <select
            value={filterLevel}
            onChange={e => { setFilterLevel(e.target.value); setPage(1) }}
            className="text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 px-3 py-2"
          >
            <option value="All">Mọi cấp độ</option>
            {levels.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
          <select
            value={filterTopic}
            onChange={e => { setFilterTopic(e.target.value); setPage(1) }}
            className="text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 px-3 py-2"
          >
            <option value="All">Mọi chủ đề</option>
            {topics.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select
            value={showLearned}
            onChange={e => { setShowLearned(e.target.value); setPage(1) }}
            className="text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 px-3 py-2"
          >
            <option value="all">Tất cả</option>
            <option value="learned">Đã thuộc</option>
            <option value="unlearned">Chưa thuộc</option>
          </select>
        </div>
      </div>

      {/* List */}
      {visible.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-4xl mb-3 animate-float">🔍</p>
          <p className="text-lg font-medium">Không tìm thấy từ nào</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {visible.map((w, idx) => (
            <div key={w.id} style={{ animationDelay: `${(idx % 30) * 14}ms` }} className="animate-fade-up">
              <VocabCardEnhanced
                word={w}
                isLearned={state.learnedWords.includes(w.id)}
                onToggleLearn={toggleLearn}
              />
            </div>
          ))}
        </div>
      )}

      {visible.length < filtered.length && (
        <button
          onClick={() => setPage(p => p + 1)}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-95 hover:scale-[1.01] text-white text-sm font-semibold transition-all btn-shine"
        >
          Tải thêm {Math.min(PAGE_SIZE, filtered.length - visible.length)} từ
        </button>
      )}
    </div>
  )
}
