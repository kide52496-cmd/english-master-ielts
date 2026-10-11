import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'

const DIR = 'D:/english-master-ieltsfull/src/data'
const files = fs.readdirSync(DIR).filter(f => f.endsWith('.js')).sort()
const AGG = new Set(['stories.js', 'vocabulary.js', 'courseLessons.js'])

const groups = new Map() // path -> {types:Map, items:[]}
function note(p, item, file) {
  if (!groups.has(p)) groups.set(p, { file, types: new Map(), items: [] })
  const g = groups.get(p)
  g.items.push(item)
  return g
}

const out = []
function typeOf(v) {
  if (v === undefined) return 'undefined'
  if (v === null) return 'null'
  if (Array.isArray(v)) return 'array'
  return typeof v
}

const placeholderRe = /(Lựa chọn [A-D]|answer \d+\)?$|^Option [A-D]|\bTODO\b|\bTBD\b|Lorem ipsum|placeholder|XXX|\[\[|Đáp án đúng cho câu \d+ là)/i

function walk(v, file, p, depth) {
  if (depth > 5) return
  if (Array.isArray(v)) {
    v.forEach((el, i) => {
      if (el && typeof el === 'object' && !Array.isArray(el)) {
        const g = note(p, el, file)
        for (const key of ['correct', 'answer', 'correctAnswer']) {
          if (key in el) {
            const t = `${key}:${typeOf(el[key])}`
            g.types.set(t, (g.types.get(t) || 0) + 1)
          }
        }
        for (const [k2, v2] of Object.entries(el)) if (v2 && typeof v2 === 'object') walk(v2, file, `${p}[].${k2}`, depth + 1)
      }
    })
  } else if (v && typeof v === 'object') {
    for (const [k2, v2] of Object.entries(v)) if (v2 && typeof v2 === 'object') walk(v2, file, `${p}.${k2}`, depth + 1)
  }
}

for (const f of files) {
  if (AGG.has(f)) continue
  let mod; try { mod = await import(pathToFileURL(path.join(DIR, f)).href) } catch { continue }
  for (const [k, v] of Object.entries(mod)) {
    if (typeof v === 'function' || !v || typeof v !== 'object') continue
    walk(v, f, k, 0)
  }
}

console.log('=== MIXED correct/answer TYPES within same collection path ===')
for (const [p, g] of groups) {
  const byKey = {}
  for (const [t, n] of g.types) { const [k, tt] = t.split(':'); (byKey[k] = byKey[k] || []).push(`${tt}×${n}`) }
  for (const [k, arr] of Object.entries(byKey)) {
    if (arr.length > 1) console.log(`${g.file}  ${p}  ${k} -> ${arr.join(', ')}`)
  }
}

console.log('\n=== PLACEHOLDER / AUTO-GENERATED TEXT ===')
const ph = {}
for (const [p, g] of groups) {
  for (const el of g.items) {
    for (const [k, v] of Object.entries(el)) {
      const strs = typeof v === 'string' ? [v] : (Array.isArray(v) ? v.filter(x => typeof x === 'string') : [])
      for (const s of strs) if (placeholderRe.test(s)) {
        const kk = `${g.file} | ${p}[].${k}`
        ph[kk] = ph[kk] || { n: 0, eg: s.slice(0, 110) }
        ph[kk].n++
      }
    }
  }
}
for (const [k, v] of Object.entries(ph).sort((a, b) => b[1].n - a[1].n)) console.log(`${String(v.n).padStart(5)}  ${k}\n         eg: ${v.eg}`)

console.log('\n=== TFNG / boolean answer value sanity ===')
const badTf = {}
for (const [p, g] of groups) {
  for (const el of g.items) {
    if (el.type && /tfng|truefalse|true_false/i.test(String(el.type))) {
      const a = el.answer !== undefined ? el.answer : el.correct
      const ok = typeof a === 'boolean' || ['true','false','not given','notgiven','ng','yes','no'].includes(String(a).trim().toLowerCase())
      if (!ok) { const kk = `${g.file} | ${p}`; (badTf[kk] = badTf[kk] || []).push(`id=${el.id} answer=${JSON.stringify(a)}`) }
    }
  }
}
for (const [k, v] of Object.entries(badTf)) console.log(`${v.length}  ${k}: ${v.slice(0,8).join(' ; ')}`)
if (!Object.keys(badTf).length) console.log('(none)')
