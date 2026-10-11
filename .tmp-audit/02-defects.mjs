import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'

const DIR = 'D:/english-master-ieltsfull/src/data'
const files = fs.readdirSync(DIR).filter(f => f.endsWith('.js')).sort()

const findings = []
function add(sev, kind, file, where, msg) {
  findings.push({ sev, kind, file, where, msg })
}

const collections = {} // "file::export" -> array

for (const f of files) {
  let mod
  try { mod = await import(pathToFileURL(path.join(DIR, f)).href) }
  catch (e) { add(1, 'IMPORT_FAIL', f, '-', e.message); continue }
  for (const [k, v] of Object.entries(mod)) {
    if (Array.isArray(v) && v.length && v.some(x => x && typeof x === 'object')) {
      collections[`${f}::${k}`] = v
    }
  }
}

// ---------- helpers ----------
const NONEMPTY_FIELDS = new Set(['word','meaning','en','vi','vietnamese','english','question','answer','title','titleVi','text','prompt','passage','script','transcript','englishText','vietnameseText','explanation','explanationVi','sampleAnswer','summaryVi','pronunciation','example','example_vi','level','topic','cueCard'])

function isQuestionLike(o) {
  if (!o || typeof o !== 'object' || Array.isArray(o)) return false
  const k = Object.keys(o)
  return (k.includes('options') && Array.isArray(o.options)) ||
         ((k.includes('correct') || k.includes('correctAnswer') || k.includes('answer')) && (k.includes('question') || k.includes('q') || k.includes('prompt') || k.includes('sentence')))
}

function checkQuestion(q, file, where) {
  const opts = Array.isArray(q.options) ? q.options : null
  const correctKey = 'correct' in q ? 'correct' : ('correctAnswer' in q ? 'correctAnswer' : ('answer' in q ? 'answer' : null))
  const c = correctKey ? q[correctKey] : undefined

  if (opts) {
    if (opts.length < 2) add(2, 'OPTIONS_TOO_FEW', file, where, `options.length=${opts.length}`)
    const strs = opts.map(o => typeof o === 'string' ? o.trim() : JSON.stringify(o))
    const dup = strs.filter((s, i) => strs.indexOf(s) !== i)
    if (dup.length) add(2, 'OPTIONS_DUPLICATE', file, where, `duplicate option(s): ${[...new Set(dup)].map(d=>JSON.stringify(d)).join(', ')}`)
    const empt = strs.filter(s => !s || s === '""')
    if (empt.length) add(2, 'OPTIONS_EMPTY', file, where, `${empt.length} empty option(s)`)
  }

  if (correctKey === null) {
    if (opts) add(1, 'NO_CORRECT', file, where, `has options[${opts.length}] but no correct/answer key. keys=${Object.keys(q).join(',')}`)
    return
  }
  if (c === undefined || c === null || c === '') {
    add(1, 'CORRECT_EMPTY', file, where, `${correctKey} is ${JSON.stringify(c)}`)
    return
  }
  if (!opts) return
  if (typeof c === 'number') {
    if (!Number.isInteger(c) || c < 0 || c >= opts.length) {
      add(1, 'CORRECT_OUT_OF_RANGE', file, where, `${correctKey}=${c} but options.length=${opts.length}`)
    }
  } else if (typeof c === 'string') {
    const norm = s => String(s).trim().toLowerCase()
    const hit = opts.some(o => norm(o) === norm(c))
    if (!hit) {
      // maybe numeric string index, or letter A-D
      const asNum = Number(c)
      if (Number.isInteger(asNum) && String(asNum) === c.trim()) {
        if (asNum < 0 || asNum >= opts.length) add(1, 'CORRECT_OUT_OF_RANGE', file, where, `${correctKey}="${c}" (numeric string) out of range ${opts.length}`)
        else add(3, 'CORRECT_NUMERIC_STRING', file, where, `${correctKey}="${c}" is a string index, siblings use numbers`)
      } else if (/^[A-Da-d]$/.test(c.trim())) {
        add(3, 'CORRECT_LETTER', file, where, `${correctKey}="${c}" is a letter, not text/index`)
      } else {
        add(1, 'CORRECT_NOT_IN_OPTIONS', file, where, `${correctKey}=${JSON.stringify(c).slice(0,120)} not among options: ${JSON.stringify(opts).slice(0,200)}`)
      }
    }
  } else if (Array.isArray(c)) {
    for (const cc of c) {
      if (typeof cc === 'number' && (cc < 0 || cc >= opts.length)) add(1, 'CORRECT_OUT_OF_RANGE', file, where, `${correctKey} contains ${cc}, options.length=${opts.length}`)
    }
  }
}

// majority-shape + empty-field + dup-id for a homogeneous array of objects
function checkArray(arr, file, where, depth) {
  const objs = arr.filter(x => x && typeof x === 'object' && !Array.isArray(x))
  if (!objs.length) return
  // duplicate ids
  if (objs.some(o => 'id' in o)) {
    const seen = new Map()
    objs.forEach((o, i) => {
      if (o.id === undefined || o.id === null || o.id === '') { add(2, 'ID_MISSING', file, `${where}[${i}]`, `id is ${JSON.stringify(o.id)}`); return }
      const key = String(o.id)
      if (seen.has(key)) add(1, 'DUP_ID', file, where, `id=${key} at indices ${seen.get(key)} and ${i}`)
      else seen.set(key, i)
    })
  }
  // majority shape
  if (objs.length >= 5) {
    const freq = {}
    for (const o of objs) for (const k of Object.keys(o)) freq[k] = (freq[k] || 0) + 1
    const required = Object.entries(freq).filter(([, n]) => n / objs.length > 0.9 && n < objs.length).map(([k]) => k)
    for (const k of required) {
      const missing = objs.map((o, i) => (k in o ? -1 : i)).filter(i => i >= 0)
      const ids = missing.map(i => objs[i].id !== undefined ? `id=${objs[i].id}` : `idx=${i}`)
      add(2, 'MISSING_FIELD', file, where, `${missing.length}/${objs.length} entries missing "${k}" (present in ${freq[k]}): ${ids.slice(0, 12).join(', ')}${ids.length>12?' …':''}`)
    }
  }
  // per-entry empty fields + recurse
  objs.forEach((o, i) => {
    const label = o.id !== undefined ? `${where}[id=${o.id}]` : `${where}[${i}]`
    for (const [k, v] of Object.entries(o)) {
      if (NONEMPTY_FIELDS.has(k) && (v === null || v === undefined || (typeof v === 'string' && v.trim() === ''))) {
        add(2, 'EMPTY_FIELD', file, label, `field "${k}" is ${v === null ? 'null' : v === undefined ? 'undefined' : 'empty string'}`)
      }
    }
    if (isQuestionLike(o)) checkQuestion(o, file, label)
    if (depth < 4) {
      for (const [k, v] of Object.entries(o)) {
        if (Array.isArray(v) && v.some(x => x && typeof x === 'object' && !Array.isArray(x))) {
          checkArray(v, file, `${label}.${k}`, depth + 1)
        }
      }
    }
  })
}

const counts = {}
for (const [key, arr] of Object.entries(collections)) {
  const [file, exp] = key.split('::')
  counts[key] = arr.length
  checkArray(arr, file, exp, 0)
}

// nested objects (ieltsWriting.writingTasks etc.)
for (const f of files) {
  let mod
  try { mod = await import(pathToFileURL(path.join(DIR, f)).href) } catch { continue }
  for (const [k, v] of Object.entries(mod)) {
    if (v && typeof v === 'object' && !Array.isArray(v) && typeof v !== 'function') {
      for (const [k2, v2] of Object.entries(v)) {
        if (Array.isArray(v2) && v2.some(x => x && typeof x === 'object')) checkArray(v2, f, `${k}.${k2}`, 1)
      }
    }
  }
}

fs.writeFileSync('D:/english-master-ieltsfull/.tmp-audit/findings.json', JSON.stringify({ counts, findings }, null, 1))

const byKind = {}
for (const x of findings) { const kk = `S${x.sev} ${x.kind}`; byKind[kk] = (byKind[kk]||0)+1 }
console.log('=== FINDING SUMMARY ===')
for (const [k, n] of Object.entries(byKind).sort()) console.log(`${n}\t${k}`)
console.log('\ntotal findings:', findings.length)
