import { pathToFileURL } from 'url'
const D = 'D:/english-master-ieltsfull/src/data/'
const imp = f => import(pathToFileURL(D + f).href)

const srcs = [
  ['vocab_beginner.js', 'vocabBeginner'],
  ['vocab_a1.js', 'vocabA1'],
  ['vocab_a2.js', 'vocabA2'],
  ['vocab_b1_gaps.js', 'vocabBGaps'],
  ['vocab_b1plus.js', 'vocabB1Plus'],
  ['vocab_b1plus_gaps.js', 'vocabBPlusGaps'],
  ['vocab_ielts_foundation.js', 'vocabIELTSFoundation'],
  ['vocab_ielts_foundation_full.js', 'vocabIELTSFoundationFull'],
  ['vocab_ielts_5.js', 'vocabIELTS5'],
  ['vocab_ielts_5_full.js', 'vocabIELTSFull'],
  ['vocab_supp_travel.js', 'vocabSupp_travel'],
  ['vocab_supp_work.js', 'vocabSupp_work'],
  ['vocab_supp_family.js', 'vocabSupp_family'],
  ['vocab_supp_health.js', 'vocabSupp_health'],
  ['vocab_supp_society.js', 'vocabSupp_society'],
]

const all = []
let total = 0
for (const [f, e] of srcs) {
  const arr = (await imp(f))[e]
  total += arr.length
  arr.forEach((w, i) => all.push({ f, e, i, w }))
  // intra-file dup ids
  const seen = new Map(); const dups = []
  arr.forEach((w, i) => { const k = String(w.id); if (seen.has(k)) dups.push(`${k}(idx ${seen.get(k)},${i})`); else seen.set(k, i) })
  // intra-file id range
  const ids = arr.map(w => Number(w.id)).filter(n => !Number.isNaN(n))
  console.log(`${f.padEnd(34)} n=${String(arr.length).padStart(4)} ids ${ids.length ? Math.min(...ids) + '-' + Math.max(...ids) : '-'}  intraDupIds=${dups.length}${dups.length ? ' ' + dups.slice(0, 8).join(' ') : ''}`)
}
console.log('\nTOTAL source words:', total)

// cross-file id collisions (these get SILENTLY DROPPED by vocabulary.js)
const byId = new Map()
for (const r of all) {
  const id = Number(r.w.id)
  if (!byId.has(id)) byId.set(id, [])
  byId.get(id).push(r)
}
const collisions = [...byId.entries()].filter(([, v]) => v.length > 1)
console.log('\n=== CROSS-FILE ID COLLISIONS (loser word is silently dropped from vocabulary.js) ===')
console.log('colliding ids:', collisions.length, '| words lost:', collisions.reduce((a, [, v]) => a + v.length - 1, 0))
for (const [id, v] of collisions.slice(0, 30)) {
  console.log(`  id=${id}: ` + v.map(r => `${r.f}[${r.i}] "${r.w.english}"`).join('  VS  '))
}

// missing/invalid ids
const badId = all.filter(r => !Number(r.w.id))
console.log('\nwords with falsy/non-numeric id (get fallback id):', badId.length, badId.slice(0, 10).map(r => `${r.f}[${r.i}] id=${JSON.stringify(r.w.id)}`).join(', '))

// duplicate english headwords
const byEn = new Map()
for (const r of all) {
  const k = String(r.w.english || '').trim().toLowerCase()
  if (!k) continue
  if (!byEn.has(k)) byEn.set(k, [])
  byEn.get(k).push(r)
}
const dupEn = [...byEn.entries()].filter(([, v]) => v.length > 1).sort((a, b) => b[1].length - a[1].length)
console.log('\n=== DUPLICATE HEADWORDS across vocab files ===')
console.log('distinct words duplicated:', dupEn.length, '| extra copies:', dupEn.reduce((a, [, v]) => a + v.length - 1, 0))
for (const [w, v] of dupEn.slice(0, 20)) console.log(`  "${w}" ×${v.length}: ` + v.map(r => `${r.f.replace('vocab_', '').replace('.js', '')}(id ${r.w.id}, ${r.w.level})`).join(', '))

// conflicting translations for same headword
const conflict = dupEn.filter(([, v]) => new Set(v.map(r => String(r.w.vietnamese || '').trim().toLowerCase())).size > 1)
console.log('\nheadwords with CONFLICTING vietnamese translations:', conflict.length)
for (const [w, v] of conflict.slice(0, 15)) console.log(`  "${w}": ` + [...new Set(v.map(r => `${r.w.vietnamese} [${r.f.replace('vocab_','').replace('.js','')}]`))].join(' | '))

// final aggregate
const { vocabulary } = await imp('vocabulary.js')
console.log('\n=== AGGREGATE vocabulary.js ===')
console.log('exported vocabulary.length =', vocabulary.length, '(hard cap .slice(0,8000))')
console.log('source total =', total, '| lost to id-dedupe/cap =', total - vocabulary.length)
const dedupCount = total - collisions.reduce((a, [, v]) => a + v.length - 1, 0)
console.log('after dedupe would be', dedupCount, '=> cap drops', dedupCount - vocabulary.length, 'more (highest ids)')
const byLevel = {}
for (const w of vocabulary) byLevel[w.level] = (byLevel[w.level] || 0) + 1
console.log('per level:', JSON.stringify(byLevel, null, 0))
const { LEVELS } = await imp('vocabulary.js')
console.log('LEVELS declared:', JSON.stringify(LEVELS))
console.log('levels present in data but NOT in LEVELS:', Object.keys(byLevel).filter(l => !LEVELS.includes(l)))
console.log('LEVELS with ZERO words:', LEVELS.filter(l => !byLevel[l]))
// empty/placeholder fields in final vocabulary
const emptyVi = vocabulary.filter(w => !w.vietnamese)
const genericEx = vocabulary.filter(w => /^I want to learn the word/.test(w.example))
const genericPron = vocabulary.filter(w => w.pronunciation === '/' + w.english.toLowerCase() + '/')
console.log('\nfinal vocabulary defects: emptyVietnamese=' + emptyVi.length + ', generated-placeholder example=' + genericEx.length + ', fake pronunciation=' + genericPron.length)
console.log('  emptyVietnamese e.g.', emptyVi.slice(0, 10).map(w => `id=${w.id} "${w.english}"`).join(', '))
