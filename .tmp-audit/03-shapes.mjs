import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'

const DIR = 'D:/english-master-ieltsfull/src/data'
const files = fs.readdirSync(DIR).filter(f => f.endsWith('.js')).sort()

const shapes = new Map() // file|pathkey|shape -> count
const samples = new Map()

function walk(v, file, p, depth) {
  if (depth > 5) return
  if (Array.isArray(v)) {
    for (const el of v) {
      if (el && typeof el === 'object' && !Array.isArray(el)) {
        const key = `${file} | ${p}[] | ${Object.keys(el).join(',')}`
        shapes.set(key, (shapes.get(key) || 0) + 1)
        if (!samples.has(key)) samples.set(key, JSON.stringify(el).slice(0, 400))
        for (const [k2, v2] of Object.entries(el)) if (v2 && typeof v2 === 'object') walk(v2, file, `${p}[].${k2}`, depth + 1)
      }
    }
  } else if (v && typeof v === 'object') {
    for (const [k2, v2] of Object.entries(v)) if (v2 && typeof v2 === 'object') walk(v2, file, `${p}.${k2}`, depth + 1)
  }
}

for (const f of files) {
  let mod
  try { mod = await import(pathToFileURL(path.join(DIR, f)).href) } catch { continue }
  if (f === 'stories.js' || f === 'vocabulary.js' || f === 'courseLessons.js') continue // aggregators, avoid double count
  for (const [k, v] of Object.entries(mod)) {
    if (typeof v === 'function') continue
    if (v && typeof v === 'object') walk(v, f, k, 0)
  }
}

const rows = [...shapes.entries()].sort((a, b) => a[0].localeCompare(b[0]))
const lines = []
for (const [k, n] of rows) {
  const [file, p, shape] = k.split(' | ')
  lines.push(`${String(n).padStart(6)}  ${file} ${p}\n         keys: ${shape}\n         eg: ${samples.get(k)}`)
}
fs.writeFileSync('D:/english-master-ieltsfull/.tmp-audit/shapes.txt', lines.join('\n'))
// print only the ones that look answer-bearing
for (const [k, n] of rows) {
  const [file, p, shape] = k.split(' | ')
  if (/option|correct|answer|question|quiz|practice/i.test(p) || /options|correct|answer/.test(shape)) {
    console.log(`${String(n).padStart(5)}  ${file} ${p}\n        keys: ${shape}\n        eg: ${samples.get(k).slice(0,300)}`)
  }
}
