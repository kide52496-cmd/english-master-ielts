import { useMemo, useState } from 'react'
import { Volume2, ChevronDown, ChevronUp, Sparkles, Languages, X as XIcon } from 'lucide-react'
import { speak } from '../utils/speech'
import { enrichWord, enrichmentSummary } from '../utils/vocabEnrichment'

function Pill({ children, color = 'gray' }) {
  const map = {
    gray:   'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300',
    blue:   'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    green:  'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
    rose:   'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300',
    amber:  'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
    purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
  }
  return (
    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${map[color] || map.gray}`}>
      {children}
    </span>
  )
}

function StarRating({ value, max = 5 }) {
  return (
    <span className="text-amber-500 text-xs tracking-tight">
      {Array.from({ length: max }).map((_, i) => i < value ? '★' : '☆').join('')}
    </span>
  )
}

export default function VocabCardEnhanced({ word, isLearned = false, onToggleLearn, compact = false }) {
  const [expanded, setExpanded] = useState(false)
  const enriched = useMemo(() => enrichWord(word), [word])
  const summary  = useMemo(() => enrichmentSummary(word), [word])

  if (!enriched) return null

  const handlePlay = (text = enriched.english) => {
    speak(text, { rate: 0.9 })
  }

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 shadow-sm hover:shadow transition">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center flex-wrap gap-2">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 truncate">
              {enriched.english}
            </h3>
            <Pill color="blue">{enriched.pos}</Pill>
            <Pill color="purple">{enriched.level}</Pill>
            <StarRating value={enriched.difficulty} />
          </div>
          {enriched.ipa && (
            <p className="text-xs font-mono text-gray-500 dark:text-gray-400 mt-0.5">
              {enriched.ipa}
            </p>
          )}
          <p className="text-sm text-gray-700 dark:text-gray-200 mt-1">
            {enriched.vietnamese}
          </p>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => handlePlay()}
            className="p-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-indigo-500"
            title="Phát âm"
          >
            <Volume2 size={16} />
          </button>
          {onToggleLearn && (
            <button
              onClick={() => onToggleLearn(enriched.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition
                ${isLearned
                  ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/30'
                }`}
            >
              {isLearned ? 'Đã thuộc' : 'Thêm'}
            </button>
          )}
        </div>
      </div>

      {/* Quick badges */}
      <div className="flex flex-wrap gap-1.5 mt-2">
        {summary?.synCount > 0   && <Pill color="green">syn ×{summary.synCount}</Pill>}
        {summary?.antCount > 0   && <Pill color="rose">ant ×{summary.antCount}</Pill>}
        {summary?.colloCount > 0 && <Pill color="amber">colloc ×{summary.colloCount}</Pill>}
      </div>

      {/* Example */}
      {!compact && enriched.example && (
        <p className="text-xs italic text-gray-500 dark:text-gray-400 mt-3 leading-relaxed">
          "{enriched.example}"
          <button
            onClick={() => handlePlay(enriched.example)}
            className="ml-1 align-middle text-indigo-500 hover:text-indigo-600"
            title="Phát âm câu"
          >
            <Volume2 size={12} className="inline" />
          </button>
        </p>
      )}

      {/* Expand */}
      {!compact && (
        <button
          onClick={() => setExpanded(e => !e)}
          className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-indigo-500 hover:text-indigo-600"
        >
          <Sparkles size={12} />
          {expanded ? 'Ẩn chi tiết' : 'Xem từ liên quan'}
          {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>
      )}

      {expanded && !compact && (
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {enriched.synonyms.length > 0 && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20">
              <div className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 mb-1 uppercase tracking-wider">
                Đồng nghĩa
              </div>
              <div className="flex flex-wrap gap-1.5">
                {enriched.synonyms.map(s => (
                  <button
                    key={s}
                    onClick={() => handlePlay(s)}
                    className="text-sm text-emerald-800 dark:text-emerald-200 hover:underline"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          {enriched.antonyms.length > 0 && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-900/20">
              <div className="text-[11px] font-bold text-rose-700 dark:text-rose-300 mb-1 uppercase tracking-wider">
                Trái nghĩa
              </div>
              <div className="flex flex-wrap gap-1.5">
                {enriched.antonyms.map(s => (
                  <button
                    key={s}
                    onClick={() => handlePlay(s)}
                    className="text-sm text-rose-800 dark:text-rose-200 hover:underline"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          {enriched.collocations.length > 0 && (
            <div className="sm:col-span-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20">
              <div className="text-[11px] font-bold text-amber-700 dark:text-amber-300 mb-1 uppercase tracking-wider">
                Collocations thường gặp
              </div>
              <ul className="text-sm text-amber-900 dark:text-amber-100 space-y-0.5">
                {enriched.collocations.map(c => (
                  <li key={c} className="flex items-center gap-1.5">
                    <span>•</span>
                    <button
                      onClick={() => handlePlay(c)}
                      className="hover:underline"
                    >
                      {c}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {enriched.family.length > 0 && (
            <div className="sm:col-span-2 p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/20">
              <div className="text-[11px] font-bold text-indigo-700 dark:text-indigo-300 mb-1 uppercase tracking-wider flex items-center gap-1">
                <Languages size={12} /> Word family (gợi ý)
              </div>
              <div className="flex flex-wrap gap-1.5">
                {enriched.family.map(f => (
                  <span key={f.form + f.word} className="text-sm text-indigo-800 dark:text-indigo-200">
                    <span className="text-[10px] uppercase text-indigo-500/80">{f.form}</span>{' '}
                    <button
                      onClick={() => handlePlay(f.word)}
                      className="hover:underline"
                    >
                      {f.word}
                    </button>
                  </span>
                ))}
              </div>
              <p className="text-[10px] text-indigo-700/70 dark:text-indigo-300/70 mt-1">
                * Gợi ý dựa trên hậu tố thường gặp, có thể không chính xác 100%.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
