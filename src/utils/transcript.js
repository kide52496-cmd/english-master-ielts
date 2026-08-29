const STOP_WORDS = new Set([
  'the','a','an','is','are','was','were','be','been','being',
  'have','has','had','do','does','did','will','would','could',
  'should','may','might','must','shall','to','of','in','for',
  'on','with','at','by','from','up','about','into','through',
  'before','after','above','below','between','out','off',
  'over','under','again','then','once','and','but','or',
  'nor','so','yet','not','only','own','same','than','too',
  'very','just','because','as','until','while','when','where',
  'which','who','whom','that','this','these','those','it','its',
  'i','me','my','we','our','you','your','he','him','his',
  'she','her','they','them','their','what','all','each',
  'more','other','some','no','if','also','can','get','use',
  'one','two','three','four','five','six','make','know',
  'see','look','want','give','come','take','let','put',
])

function srtTime(s) {
  const [hms, ms = '0'] = s.trim().replace(',', '.').split('.')
  const p = hms.split(':').map(Number)
  const [h = 0, m = 0, sec = 0] = p.length === 3 ? p : [0, ...p]
  return h * 3600 + m * 60 + sec + Number(String(ms).padEnd(3, '0').slice(0, 3)) / 1000
}

export function parseSRT(text) {
  return text.trim().split(/\n{2,}/).reduce((segs, block) => {
    const lines = block.trim().split('\n')
    const ti = lines.findIndex(l => l.includes('-->'))
    if (ti < 0) return segs
    const [s, e] = lines[ti].split('-->').map(srtTime)
    const txt = lines.slice(ti + 1).join(' ').replace(/<[^>]+>/g, '').trim()
    if (txt) segs.push({ start: s, end: e, text: txt })
    return segs
  }, [])
}

function vttTime(s) {
  const p = s.trim().split(':').map(parseFloat)
  return p.length === 3 ? p[0] * 3600 + p[1] * 60 + p[2] : p[0] * 60 + p[1]
}

export function parseVTT(text) {
  const lines = text.split('\n')
  const segs = []
  for (let i = 0; i < lines.length; i++) {
    if (!lines[i].includes('-->')) continue
    const [a, b] = lines[i].split('-->').map(t => vttTime(t.trim().split(' ')[0]))
    const txts = []
    for (i++; i < lines.length && lines[i].trim(); i++) txts.push(lines[i].replace(/<[^>]+>/g, ''))
    const txt = txts.join(' ').trim()
    if (txt) segs.push({ start: a, end: b, text: txt })
  }
  return segs
}

export function parsePlainText(text) {
  const segs = []
  let idx = 0
  for (const line of text.trim().split(/\n+/)) {
    const sents = line.match(/[^.!?]+[.!?]*/g) || (line.trim() ? [line.trim()] : [])
    for (const s of sents) {
      const txt = s.trim()
      if (txt) {
        segs.push({ start: idx * 5, end: (idx + 1) * 5, text: txt })
        idx++
      }
    }
  }
  return segs
}

export function parseTranscript(text, filename = '') {
  if (!text?.trim()) return []
  const ext = filename.includes('.') ? filename.split('.').pop().toLowerCase() : ''
  if (ext === 'srt') return parseSRT(text)
  if (ext === 'vtt') return parseVTT(text)
  if (text.trim().startsWith('WEBVTT')) return parseVTT(text)
  if (text.includes('-->') && /^\d+$/m.test(text)) return parseSRT(text)
  return parsePlainText(text)
}

export function countWordFrequency(segments) {
  const full = segments.map(s => s.text).join(' ')
  const freq = {}
  for (const w of (full.toLowerCase().match(/\b[a-z]{3,}\b/g) || [])) {
    if (!STOP_WORDS.has(w)) freq[w] = (freq[w] || 0) + 1
  }
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .map(([word, count]) => ({
      word,
      count,
      example: segments.find(s => new RegExp(`\\b${word}\\b`, 'i').test(s.text))?.text || '',
    }))
}

function escRx(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function generateFillBlanks(segments, count = 6) {
  const results = []
  const shuffled = [...segments]
    .filter(s => { const n = s.text.split(/\s+/).length; return n >= 5 && n <= 22 })
    .sort(() => Math.random() - 0.5)
  for (const seg of shuffled) {
    if (results.length >= count) break
    const words = seg.text.replace(/[.,!?;:"']/g, '').split(/\s+/)
    const eligible = words.filter(w => w.length >= 4 && !STOP_WORDS.has(w.toLowerCase()))
    if (!eligible.length) continue
    const target = eligible[Math.floor(Math.random() * eligible.length)]
    const blanked = seg.text.replace(new RegExp(`\\b${escRx(target)}\\b`, 'i'), '______')
    if (blanked === seg.text) continue
    results.push({ sentence: seg.text, blanked, answer: target.toLowerCase() })
  }
  return results
}

export function normalizeAnswer(s) {
  return s.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim()
}
