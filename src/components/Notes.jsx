import { useEffect, useMemo, useState } from "react"
import { Notebook, Plus, Trash2, Tag, AlertTriangle, CheckCircle2, RefreshCw, X } from "lucide-react"
import {
  getNotes, addNote, updateNote, deleteNote,
  markMistakeMastered, deleteMistake, clearMastered, getMistakeStats,
} from "../utils/notes"

const TABS = [
  { id: "notes",    label: "Ghi chú" },
  { id: "mistakes", label: "Lỗi đã lưu" },
]

function NoteEditor({ initial, onSave, onCancel }) {
  const [title, setTitle] = useState(initial?.title || "")
  const [body,  setBody]  = useState(initial?.body  || "")
  const [tags,  setTags]  = useState((initial?.tags || []).join(", "))
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 sm:p-5 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-800 dark:text-gray-100">
          {initial ? "Sửa ghi chú" : "Tạo ghi chú mới"}
        </h3>
        <button onClick={onCancel} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
          <X size={16} />
        </button>
      </div>
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Tiêu đề ghi chú"
        className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm outline-none focus:border-indigo-400"
      />
      <textarea
        value={body}
        onChange={e => setBody(e.target.value)}
        rows={6}
        placeholder="Nội dung ghi chú... có thể chép câu hay, từ khó, ngữ pháp cần ôn."
        className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm outline-none focus:border-indigo-400"
      />
      <input
        value={tags}
        onChange={e => setTags(e.target.value)}
        placeholder="Tags (tuỳ chọn, ngăn cách bằng dấu phẩy)"
        className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm outline-none focus:border-indigo-400"
      />
      <div className="flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm font-semibold"
        >
          Hủy
        </button>
        <button
          onClick={() => onSave({
            title,
            body,
            tags: tags.split(",").map(t => t.trim()).filter(Boolean),
          })}
          className="px-3 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold"
        >
          Lưu
        </button>
      </div>
    </div>
  )
}

export default function Notes({ setCurrentPage }) {
  const [tab, setTab] = useState("notes")
  const [data, setData] = useState({ notes: [], mistakes: [] })
  const [editing, setEditing] = useState(null)
  const [creating, setCreating] = useState(false)

  useEffect(() => { setData(getNotes()) }, [])

  const stats = useMemo(() => getMistakeStats(), [data])

  const reload = () => setData(getNotes())

  const handleSaveNote = (payload) => {
    if (editing) updateNote(editing.id, payload)
    else addNote(payload)
    setEditing(null)
    setCreating(false)
    reload()
  }

  return (
    <div className="space-y-4 animate-fade-up">
      <div className="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 bg-200 animate-gradient-x text-white rounded-3xl p-5 shadow-xl relative overflow-hidden">
        <div className="blob bg-cyan-300/40 w-40 h-40 -top-10 -right-10" />
        <div className="blob bg-emerald-300/40 w-32 h-32 -bottom-10 -left-8 animate-float-slow" />
        <div className="relative flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center animate-float">
            <Notebook size={22} />
          </div>
          <div className="flex-1">
            <h2 className="text-lg sm:text-xl font-bold drop-shadow">Notes & Saved Mistakes</h2>
            <p className="text-xs sm:text-sm text-white/90 mt-1">
              Lưu câu hay, ghi chú học, và xem các lỗi sai gần đây để ôn lại.
            </p>
          </div>
        </div>
        <div className="relative mt-4 grid grid-cols-3 gap-2 text-center">
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-2 hover:scale-105 transition-transform">
            <div className="text-[10px] uppercase tracking-wider text-white/80">Notes</div>
            <div className="text-2xl font-bold animate-count-up">{data.notes.length}</div>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-2 hover:scale-105 transition-transform">
            <div className="text-[10px] uppercase tracking-wider text-white/80">Lỗi pending</div>
            <div className="text-2xl font-bold animate-count-up">{stats.pending}</div>
          </div>
          <div className="bg-white/15 backdrop-blur-sm rounded-xl p-2 hover:scale-105 transition-transform">
            <div className="text-[10px] uppercase tracking-wider text-white/80">Đã thuộc</div>
            <div className="text-2xl font-bold animate-count-up">{stats.mastered}</div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-3 py-2 rounded-xl text-sm font-semibold ${
              tab === t.id
                ? "bg-indigo-500 text-white"
                : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700"
            }`}
          >
            {t.label}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage?.("mistakes-review")}
          className="px-3 py-2 rounded-xl text-sm font-semibold bg-rose-500 hover:bg-rose-600 text-white ml-auto"
        >
          🔁 Ôn lỗi sai
        </button>
      </div>

      {tab === "notes" && (
        <div className="space-y-3">
          {!creating && !editing && (
            <button
              onClick={() => setCreating(true)}
              className="w-full py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold flex items-center justify-center gap-1"
            >
              <Plus size={16} /> Tạo ghi chú mới
            </button>
          )}

          {creating && (
            <NoteEditor
              onSave={handleSaveNote}
              onCancel={() => setCreating(false)}
            />
          )}

          {editing && (
            <NoteEditor
              initial={editing}
              onSave={handleSaveNote}
              onCancel={() => setEditing(null)}
            />
          )}

          {data.notes.length === 0 && !creating && (
            <div className="text-center py-12 text-gray-400">
              <p className="text-3xl mb-2">📝</p>
              <p className="text-sm">Chưa có ghi chú nào. Tạo ghi chú đầu tiên đi!</p>
            </div>
          )}

          {data.notes.map(n => (
            <div key={n.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-gray-800 dark:text-gray-100">{n.title || "(Không tiêu đề)"}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 whitespace-pre-line break-words">{n.body}</p>
                  {n.tags?.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {n.tags.map(t => (
                        <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 flex items-center gap-1">
                          <Tag size={10} /> {t}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-[10px] text-gray-400 mt-2">
                    Cập nhật: {new Date(n.updatedAt).toLocaleString("vi-VN")}
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <button onClick={() => setEditing(n)} className="text-xs px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700">Sửa</button>
                  <button onClick={() => { deleteNote(n.id); reload() }} className="text-xs px-2 py-1 rounded-lg bg-rose-500 hover:bg-rose-600 text-white flex items-center gap-1">
                    <Trash2 size={12} /> Xoá
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "mistakes" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {stats.pending} pending · {stats.mastered} mastered
            </div>
            <button
              onClick={() => { clearMastered(); reload() }}
              className="text-xs px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold flex items-center gap-1"
            >
              <RefreshCw size={12} /> Xoá phần đã thuộc
            </button>
          </div>

          {data.mistakes.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-3xl mb-2">🎯</p>
              <p className="text-sm">Chưa có lỗi nào được lưu. Khi bạn sai trong quiz/dictation, lỗi sẽ tự động lưu ở đây.</p>
            </div>
          ) : data.mistakes.map(m => (
            <div key={m.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4">
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="text-[11px] uppercase tracking-wider text-rose-500 flex items-center gap-1">
                  <AlertTriangle size={12} /> {m.source} · sai {m.count} lần
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => { markMistakeMastered(m.id, !m.mastered); reload() }}
                    className={`text-xs px-2 py-1 rounded-lg flex items-center gap-1 ${
                      m.mastered
                        ? "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200"
                        : "bg-emerald-500 hover:bg-emerald-600 text-white"
                    }`}
                  >
                    <CheckCircle2 size={12} />
                    {m.mastered ? "Đã thuộc" : "Đánh dấu thuộc"}
                  </button>
                  <button
                    onClick={() => { deleteMistake(m.id); reload() }}
                    className="text-xs px-2 py-1 rounded-lg bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
              <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">{m.prompt}</div>
              {m.given && (
                <div className="text-xs text-rose-600 dark:text-rose-400 mt-1">Bạn: {m.given}</div>
              )}
              {m.correct && (
                <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">Đúng: {m.correct}</div>
              )}
              {m.hint && (
                <div className="text-xs text-amber-700 dark:text-amber-300 mt-1">💡 {m.hint}</div>
              )}
              <p className="text-[10px] text-gray-400 mt-2">
                Lưu: {new Date(m.updatedAt).toLocaleString("vi-VN")}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
