import { allStories } from '../src/data/stories.js'

const byFileLevel = {}
let problems = []
for (const s of allStories) {
  const q = s.comprehensionQuestions || []
  const key = String(s.id).replace(/[0-9]+$/, '')
  byFileLevel[key] = byFileLevel[key] || { n: 0, types: {} }
  q.forEach((qq, i) => {
    byFileLevel[key].n++
    const t = typeof qq.correct
    byFileLevel[key].types[t] = (byFileLevel[key].types[t] || 0) + 1
    if (t === 'number') {
      if (!Array.isArray(qq.options) || qq.correct < 0 || qq.correct >= qq.options.length)
        problems.push(`OUT_OF_RANGE story=${s.id} q#${i} correct=${qq.correct} opts=${qq.options?.length}`)
    } else if (t === 'string') {
      const hit = (qq.options || []).some(o => String(o).trim().toLowerCase() === qq.correct.trim().toLowerCase())
      problems.push(`STRING_CORRECT story=${s.id} q#${i} correct=${JSON.stringify(qq.correct)} inOptions=${hit}`)
    } else {
      problems.push(`BAD_TYPE story=${s.id} q#${i} correct=${JSON.stringify(qq.correct)}`)
    }
  })
  // answers field
  if (s.answers !== undefined) {
    const a = s.answers
    if (!Array.isArray(a)) problems.push(`ANSWERS_NOT_ARRAY story=${s.id} type=${typeof a}`)
    else if (a.length !== q.length) problems.push(`ANSWERS_LEN story=${s.id} answers=${a.length} questions=${q.length}`)
  }
}
console.log('=== story comprehensionQuestions.correct type by id-prefix ===')
for (const [k, v] of Object.entries(byFileLevel)) console.log(`${k}: n=${v.n} ${JSON.stringify(v.types)}`)
console.log('\n=== problems (' + problems.length + ') ===')
console.log(problems.slice(0, 80).join('\n'))

// answers vs correct consistency
console.log('\n=== answers[] vs correct cross-check (first 40 mismatches) ===')
let mm = []
for (const s of allStories) {
  const q = s.comprehensionQuestions || []
  const a = Array.isArray(s.answers) ? s.answers : null
  if (!a) continue
  q.forEach((qq, i) => {
    if (i >= a.length) return
    const av = a[i]
    let expected
    if (typeof qq.correct === 'number' && Array.isArray(qq.options)) expected = qq.options[qq.correct]
    else expected = qq.correct
    const norm = x => String(x).trim().toLowerCase()
    if (av !== undefined && expected !== undefined && norm(av) !== norm(expected) && !norm(av).includes(norm(expected)) && !norm(expected).includes(norm(av)))
      mm.push(`story=${s.id} q#${i} answers[${i}]=${JSON.stringify(av).slice(0,80)} vs correct-> ${JSON.stringify(expected).slice(0,80)}`)
  })
}
console.log(`total mismatches: ${mm.length}`)
console.log(mm.slice(0, 40).join('\n'))
