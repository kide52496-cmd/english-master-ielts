import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'

const DIR = 'D:/english-master-ieltsfull/src/data'
const files = fs.readdirSync(DIR).filter(f => f.endsWith('.js')).sort()
const AGG = new Set(['stories.js', 'vocabulary.js', 'courseLessons.js'])
const rows = []

function walk(v, file, p, depth, parentId) {
  if (depth > 5) return
  if (Array.isArray(v)) {
    v.forEach((el, i) => {
      if (el && typeof el === 'object' && !Array.isArray(el)) {
        const hasQ = ('options' in el) || ('correct' in el) || ('answer' in el) || ('correctAnswer' in el)
        if (hasQ) rows.push({ file, p, i, parentId, q: el })
        for (const [k2, v2] of Object.entries(el)) if (v2 && typeof v2 === 'object')
          walk(v2, file, `${p}[].${k2}`, depth + 1, el.id !== undefined ? el.id : parentId)
      }
    })
  } else if (v && typeof v === 'object') {
    for (const [k2, v2] of Object.entries(v)) if (v2 && typeof v2 === 'object') walk(v2, file, `${p}.${k2}`, depth + 1, parentId)
  }
}

for (const f of files) {
  if (AGG.has(f)) continue
  let mod; try { mod = await import(pathToFileURL(path.join(DIR, f)).href) } catch { continue }
  for (const [k, v] of Object.entries(mod)) { if (v && typeof v === 'object') walk(v, f, k, 0, null) }
}

const norm = s => String(s).trim().toLowerCase().replace(/\s+/g, ' ')
const issues = []
const stats = {}

for (const r of rows) {
  const { file, p, i, parentId, q } = r
  const loc = `${file} ${p}[${i}]${parentId != null ? ` (parent id=${parentId})` : ''}${q.id !== undefined ? ` q.id=${q.id}` : ''}`
  const sk = `${file} | ${p}`
  stats[sk] = (stats[sk] || 0) + 1
  const opts = Array.isArray(q.options) ? q.options : null
  const keys = ['correct', 'correctAnswer', 'answer'].filter(k => k in q)

  if (opts) {
    if (opts.length < 2) issues.push([1, 'OPTIONS_TOO_FEW', loc, `options.length=${opts.length}`])
    const strs = opts.map(o => norm(o))
    const dups = strs.filter((s, j) => strs.indexOf(s) !== j)
    if (dups.length) issues.push([1, 'OPTIONS_DUPLICATE', loc, `dup: ${[...new Set(dups)].join(' | ')} :: ${JSON.stringify(opts)}`])
    if (strs.some(s => !s)) issues.push([1, 'OPTIONS_EMPTY', loc, JSON.stringify(opts)])
  }
  if (!keys.length) { issues.push([1, 'NO_ANSWER_KEY', loc, `keys=${Object.keys(q).join(',')}`]); continue }

  for (const k of keys) {
    const c = q[k]
    if (c === undefined || c === null || (typeof c === 'string' && !c.trim())) {
      issues.push([1, 'ANSWER_EMPTY', loc, `${k}=${JSON.stringify(c)}`]); continue
    }
    if (!opts) continue
    if (typeof c === 'number') {
      if (!Number.isInteger(c) || c < 0 || c >= opts.length) issues.push([1, 'ANSWER_OUT_OF_RANGE', loc, `${k}=${c}, options.length=${opts.length}`])
    } else if (typeof c === 'string') {
      const idx = opts.findIndex(o => norm(o) === norm(c))
      if (idx < 0) {
        const partial = opts.findIndex(o => norm(o).includes(norm(c)) || norm(c).includes(norm(o)))
        issues.push([1, 'ANSWER_NOT_IN_OPTIONS', loc, `${k}=${JSON.stringify(c)}; options=${JSON.stringify(opts)}${partial >= 0 ? ` (partial match idx ${partial})` : ''}`])
      }
    } else if (typeof c === 'boolean') {
      issues.push([2, 'ANSWER_BOOL_WITH_OPTIONS', loc, `${k}=${c} but options present: ${JSON.stringify(opts)}`])
    }
  }
  if (keys.length > 1) {
    // cross-check duplicate answer keys agree
    const vals = keys.map(k => q[k])
    const resolved = keys.map(k => {
      const c = q[k]
      if (typeof c === 'number' && opts) return norm(opts[c])
      return norm(c)
    })
    if (new Set(resolved).size > 1) issues.push([1, 'ANSWER_KEYS_DISAGREE', loc, `${keys.map((k, j) => `${k}=${JSON.stringify(vals[j])}`).join(' vs ')} -> ${JSON.stringify(resolved)}`])
  }
}

console.log('=== question-bearing objects per path ===')
for (const [k, n] of Object.entries(stats).sort()) console.log(`${String(n).padStart(5)}  ${k}`)
console.log('\ntotal question objects scanned:', rows.length)

console.log('\n=== ISSUES ===')
const byKind = {}
for (const it of issues) byKind[it[1]] = (byKind[it[1]] || 0) + 1
for (const [k, n] of Object.entries(byKind).sort((a,b)=>b[1]-a[1])) console.log(`${String(n).padStart(5)}  ${k}`)
fs.writeFileSync('D:/english-master-ieltsfull/.tmp-audit/answers.txt', issues.map(x => x.join(' :: ')).join('\n'))
console.log('\n--- detail (non-story-string, capped) ---')
for (const it of issues) console.log(it[1] + ' :: ' + it[2] + ' :: ' + it[3].slice(0, 240))
