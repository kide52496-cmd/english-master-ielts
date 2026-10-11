import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'

const DIR = 'D:/english-master-ieltsfull/src/data'
const files = fs.readdirSync(DIR).filter(f => f.endsWith('.js')).sort()

const out = []
for (const f of files) {
  const rec = { file: f, ok: true, error: null, exports: {} }
  try {
    const mod = await import(pathToFileURL(path.join(DIR, f)).href)
    for (const [k, v] of Object.entries(mod)) {
      if (Array.isArray(v)) {
        const first = v.find(x => x && typeof x === 'object')
        rec.exports[k] = {
          type: 'array',
          len: v.length,
          keys: first ? Object.keys(first) : (v.length ? typeof v[0] : null),
        }
      } else if (typeof v === 'function') {
        rec.exports[k] = { type: 'function' }
      } else if (v && typeof v === 'object') {
        rec.exports[k] = { type: 'object', keys: Object.keys(v).slice(0, 25), nkeys: Object.keys(v).length }
      } else {
        rec.exports[k] = { type: typeof v, value: String(v).slice(0, 60) }
      }
    }
  } catch (e) {
    rec.ok = false
    rec.error = e.message
  }
  out.push(rec)
}
fs.writeFileSync('D:/english-master-ieltsfull/.tmp-audit/inventory.json', JSON.stringify(out, null, 1))

for (const r of out) {
  if (!r.ok) { console.log(`FAIL ${r.file}: ${r.error}`); continue }
  const parts = Object.entries(r.exports).map(([k, v]) =>
    v.type === 'array' ? `${k}[${v.len}]` : v.type === 'function' ? `${k}()` : v.type === 'object' ? `${k}{${v.nkeys}}` : `${k}=${v.type}`)
  console.log(`OK   ${r.file}  ${parts.join(' ')}`)
}
