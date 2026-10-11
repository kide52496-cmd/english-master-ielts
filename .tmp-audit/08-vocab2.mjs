import { pathToFileURL } from 'url'
const D = 'D:/english-master-ieltsfull/src/data/'
const imp = f => import(pathToFileURL(D + f).href)

const srcs = [
  ['vocab_beginner.js', 'vocabBeginner'], ['vocab_a1.js', 'vocabA1'], ['vocab_a2.js', 'vocabA2'],
  ['vocab_b1_gaps.js', 'vocabBGaps'], ['vocab_b1plus.js', 'vocabB1Plus'], ['vocab_b1plus_gaps.js', 'vocabBPlusGaps'],
  ['vocab_ielts_foundation_full.js', 'vocabIELTSFoundationFull'], ['vocab_ielts_5.js', 'vocabIELTS5'],
  ['vocab_ielts_5_full.js', 'vocabIELTSFull'],
  ['vocab_supp_travel.js', 'vocabSupp_travel'], ['vocab_supp_work.js', 'vocabSupp_work'],
  ['vocab_supp_family.js', 'vocabSupp_family'], ['vocab_supp_health.js', 'vocabSupp_health'],
  ['vocab_supp_society.js', 'vocabSupp_society'],
]

const { vocabulary } = await imp('vocabulary.js')
const kept = new Set(vocabulary.map(w => w.id))
const dropped = []
for (const [f, e] of srcs) {
  const arr = (await imp(f))[e]
  for (const w of arr) if (!kept.has(Number(w.id))) dropped.push({ f, id: w.id, en: w.english })
}
console.log('=== WORDS PRESENT IN SOURCE FILES BUT ABSENT FROM exported vocabulary ===')
console.log('count:', dropped.length)
const byFile = {}
for (const d of dropped) (byFile[d.f] = byFile[d.f] || []).push(d)
for (const [f, v] of Object.entries(byFile)) {
  const ids = v.map(x => Number(x.id))
  console.log(`  ${f}: ${v.length} words, id range ${Math.min(...ids)}-${Math.max(...ids)}  e.g. ` + v.slice(0, 5).map(x => `${x.id}:"${x.en}"`).join(', '))
}

// diacritics check on final vocabulary
const DIA = /[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i
const VNSTOP = /\b(cua|khong|nguoi|nhung|duoc|mot|va|the|hoc|lam|dieu|viec|su|cach|tinh|hoa|thuoc|toan|tri|luc|dong|hanh|chinh|quan|phat|dinh|truong|thanh|giai|bien|canh|tuong|dung|nghia|ban|dat|gia|khi|hop|kien|luong|nang|phap|tao|thuc|trinh|xuat)\b/
let noDia = [], noDiaByLevel = {}
for (const w of vocabulary) {
  const vi = String(w.vietnamese || '')
  if (!DIA.test(vi) && VNSTOP.test(vi.toLowerCase())) { noDia.push(w); noDiaByLevel[w.level] = (noDiaByLevel[w.level] || 0) + 1 }
}
console.log('\n=== VIETNAMESE TEXT MISSING DIACRITICS (high-confidence: contains a stripped VN stopword, zero diacritics) ===')
console.log('count:', noDia.length, JSON.stringify(noDiaByLevel))
console.log('e.g.', noDia.slice(0, 12).map(w => `id=${w.id} ${w.english} -> "${w.vietnamese}"`).join(' | '))

// broader: any vi field with zero diacritics at all
const zeroDia = vocabulary.filter(w => !DIA.test(String(w.vietnamese || '')))
console.log('\nvocabulary entries whose vietnamese has ZERO diacritics:', zeroDia.length, '/', vocabulary.length)
const zdByLevel = {}; for (const w of zeroDia) zdByLevel[w.level] = (zdByLevel[w.level] || 0) + 1
console.log(JSON.stringify(zdByLevel))

// example_vi diacritics
const zeroDiaEx = vocabulary.filter(w => !DIA.test(String(w.example_vi || '')))
console.log('entries whose example_vi has ZERO diacritics:', zeroDiaEx.length)

// pronunciation
const fake = vocabulary.filter(w => w.pronunciation === '/' + w.english.toLowerCase() + '/')
const fakeByLevel = {}; for (const w of fake) fakeByLevel[w.level] = (fakeByLevel[w.level] || 0) + 1
console.log('\n=== FAKE PRONUNCIATION (auto "/word/" not IPA) ===')
console.log('count:', fake.length, JSON.stringify(fakeByLevel))
// which source files
const fakeIds = new Set(fake.map(w => w.id))
for (const [f, e] of srcs) {
  const arr = (await imp(f))[e]
  const n = arr.filter(w => fakeIds.has(Number(w.id))).length
  const noP = arr.filter(w => !w.pronunciation).length
  if (n || noP) console.log(`  ${f}: ${n} fake / ${arr.length}   (missing pronunciation field: ${noP})`)
}

// example text that just echoes the word / templated examples
const tmpl = vocabulary.filter(w => new RegExp('^(This|The) ' + w.english.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ' ', 'i').test(w.example || ''))
console.log('\ntemplated examples ("This <word> ..."):', tmpl.length)
const shortEx = vocabulary.filter(w => String(w.example || '').split(/\s+/).length < 4)
console.log('examples shorter than 4 words:', shortEx.length, shortEx.slice(0,8).map(w=>`id=${w.id} "${w.example}"`).join(' | '))
