import { Capacitor } from '@capacitor/core'
import { TextToSpeech } from '@capacitor-community/text-to-speech'
import { SpeechRecognition } from '@capgo/capacitor-speech-recognition'

class NativeSpeechRecognition {
  constructor() {
    this.lang = 'en-US'
    this.interimResults = false
    this.maxAlternatives = 1
    this.continuous = false
    this.onresult = null
    this.onerror = null
    this.onend = null
    this._isListening = false
    this._listeners = []
  }

  async start() {
    if (this._isListening) return
    this._isListening = true
    try {
      let perm = await SpeechRecognition.checkPermissions()
      if (perm.speechRecognition !== 'granted') {
        perm = await SpeechRecognition.requestPermissions()
      }
      if (perm.speechRecognition !== 'granted') {
        this._isListening = false
        this.onerror?.({ error: 'not-allowed', message: 'Permission denied' })
        this.onend?.()
        return
      }

      const avail = await SpeechRecognition.available()
      if (!avail || !avail.available) {
        this._isListening = false
        this.onerror?.({ error: 'service-not-allowed', message: 'Speech recognition not available' })
        this.onend?.()
        return
      }

      await SpeechRecognition.removeAllListeners()

      const resultListener = await SpeechRecognition.addListener('result', (data) => {
        if (data && data.matches && data.matches.length > 0) {
          const transcript = data.matches[0]
          const event = {
            results: [
              [
                { transcript: transcript }
              ]
            ]
          }
          event.resultIndex = 0
          this.onresult?.(event)
        }
        this._isListening = false
        this.onend?.()
      })
      this._listeners.push(resultListener)

      const partialListener = await SpeechRecognition.addListener('partialResults', (data) => {
        if (this.interimResults && data && data.matches && data.matches.length > 0) {
          const transcript = data.matches[0]
          const event = {
            results: [
              [
                { transcript: transcript }
              ]
            ]
          }
          this.onresult?.(event)
        }
      })
      this._listeners.push(partialListener)

      await SpeechRecognition.start({
        language: this.lang || 'en-US',
        maxResults: this.maxAlternatives || 1,
        partialResults: this.interimResults || false,
        popup: false,
      })

    } catch (err) {
      console.error('NativeSpeechRecognition error:', err)
      this._isListening = false
      this.onerror?.({ error: 'unknown', message: err.message || String(err) })
      this.onend?.()
    }
  }

  async stop() {
    if (!this._isListening) return
    this._isListening = false
    try {
      await SpeechRecognition.stop()
    } catch (err) {
      console.warn('NativeSpeechRecognition stop error:', err)
    }
    for (const l of this._listeners) {
      try { await l.remove() } catch {}
    }
    this._listeners = []
    this.onend?.()
  }
}


// Throttle: prevent resource exhaustion from rapid-fire speech calls
let lastSpeakAt = 0
const SPEAK_MIN_INTERVAL_MS = 300
let dialogueToken = 0   // bumped on stop() to cancel an in-flight dialogue

// Inside the Android/iOS app the browser's Web Speech API (speechSynthesis)
// is unreliable or silent in the WebView, so we use the native TTS plugin.
// On the web we keep using speechSynthesis.
const isNative = () => {
  try { return Capacitor?.isNativePlatform?.() === true } catch { return false }
}

function speakNative(text, options = {}) {
  try { TextToSpeech.stop() } catch {}
  TextToSpeech.speak({
    text: String(text).slice(0, 500),
    lang: options.lang || 'en-US',
    rate: options.rate || 0.9,   // plugin rate ~1.0 normal; keep close to web
    pitch: options.pitch || 1,
    volume: typeof options.volume === 'number' ? options.volume : 1,
    category: 'playback',
  })
    .then(() => { options.onEnd?.() })
    .catch(() => { options.onError?.() })
  return true
}

export function speak(text, options = {}) {
  if (!text) return null

  // Throttle: enforce minimum interval between speech calls
  const now = Date.now()
  if (now - lastSpeakAt < SPEAK_MIN_INTERVAL_MS) return null
  lastSpeakAt = now

  // Native app: use the device TTS engine.
  if (isNative()) return speakNative(text, options)

  // Web fallback: Web Speech API.
  if (typeof window === 'undefined' || !window.speechSynthesis) return null

  try {
    window.speechSynthesis.cancel()
  } catch {
    return null
  }

  const utterance = new SpeechSynthesisUtterance(String(text).slice(0, 500))
  utterance.lang = options.lang || 'en-US'
  utterance.rate = options.rate || 0.85
  utterance.pitch = options.pitch || 1
  utterance.volume = options.volume || 1

  if (options.voice) {
    const voices = window.speechSynthesis.getVoices?.() || []
    const voice = voices.find(v => v.name === options.voice)
    if (voice) utterance.voice = voice
  }

  if (options.onEnd) utterance.onend = options.onEnd
  if (options.onError) utterance.onerror = options.onError

  try {
    window.speechSynthesis.speak(utterance)
  } catch {
    options.onError?.()
    return null
  }
  return utterance
}

export function getEnglishVoices() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return []
  const voices = window.speechSynthesis.getVoices?.() || []
  return voices.filter(v => v.lang.startsWith('en'))
}

export function stopSpeaking() {
  dialogueToken++   // cancel any in-flight two-voice dialogue
  if (isNative()) {
    try { TextToSpeech.stop() } catch {}
    return
  }
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    try { window.speechSynthesis.cancel() } catch {}
  }
}

export function isSpeechSupported() {
  if (isNative()) return true
  return typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window
}

export function isSpeechRecognitionSupported() {
  if (isNative()) return true
  return typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
}

export function createRecognition() {
  if (isNative()) {
    return new NativeSpeechRecognition()
  }
  if (typeof window === 'undefined') return null
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition
  if (!SR) return null

  const recognition = new SR()
  recognition.lang = 'en-US'
  recognition.interimResults = false
  recognition.maxAlternatives = 3
  recognition.continuous = false

  return recognition
}

// ── Two-voice dialogue playback ─────────────────────────────────────────────
// Reads a transcript where lines look like "Speaker: said something" using a
// different voice per speaker, so a conversation sounds like two people.
// Falls back to a single narrator for non-dialogue text.

// Split a transcript into [{ speaker, text }]. Lines without "Name:" are
// attached to the previous speaker (continuation), or narrated if none yet.
export function parseDialogue(transcript) {
  const lines = String(transcript || '').split(/\n+/).map(l => l.trim()).filter(Boolean)
  const segs = []
  const speakerRe = /^([A-Z][A-Za-z .'-]{0,24}):\s*(.*)$/
  for (const line of lines) {
    const m = line.match(speakerRe)
    if (m) {
      segs.push({ speaker: m[1].trim(), text: m[2].trim() })
    } else if (segs.length) {
      segs[segs.length - 1].text += ' ' + line
    } else {
      segs.push({ speaker: '__narrator__', text: line })
    }
  }
  return segs.filter(s => s.text)
}

// Three distinct voice profiles so dialogues with up to three speakers are
// distinguishable. Pitch + rate differences work on every device; real
// different voices are layered on top when the platform exposes them.
const VOICE_PROFILES = [
  { pitch: 1.08, rate: 0.92 },  // speaker A (higher)
  { pitch: 0.80, rate: 0.90 },  // speaker B (lower)
  { pitch: 1.0,  rate: 0.98 },  // speaker C (neutral, slightly faster)
]

async function pickNativeVoices() {
  try {
    const res = await TextToSpeech.getSupportedVoices()
    const all = res?.voices || []
    const en = all.map((v, i) => ({ ...v, index: i })).filter(v => (v.lang || '').toLowerCase().startsWith('en'))
    if (en.length === 0) return [undefined, undefined, undefined]
    // Use up to 3 distinct voices; cycle if fewer are available.
    return [0, 1, 2].map(k => en[k % en.length].index)
  } catch {}
  return [undefined, undefined, undefined]
}

function pickWebVoices() {
  const voices = (typeof window !== 'undefined' && window.speechSynthesis?.getVoices?.()) || []
  const en = voices.filter(v => (v.lang || '').toLowerCase().startsWith('en'))
  if (en.length === 0) return [null, null, null]
  return [0, 1, 2].map(k => en[k % en.length])
}

function speakSegmentNative(text, profile, voiceIndex) {
  return TextToSpeech.speak({
    text: String(text).slice(0, 1000),
    lang: 'en-US',
    rate: profile.rate,
    pitch: profile.pitch,
    volume: 1,
    category: 'playback',
    ...(typeof voiceIndex === 'number' ? { voice: voiceIndex } : {}),
  })
}

function speakSegmentWeb(text, profile, voice) {
  return new Promise((resolve) => {
    const u = new SpeechSynthesisUtterance(String(text).slice(0, 1000))
    u.lang = 'en-US'
    u.rate = profile.rate
    u.pitch = profile.pitch
    u.volume = 1
    if (voice) u.voice = voice
    u.onend = resolve
    u.onerror = resolve
    try { window.speechSynthesis.speak(u) } catch { resolve() }
  })
}

/**
 * Speak a transcript with alternating voices per speaker.
 * @param {string} transcript  multi-line "Speaker: text" content
 * @param {object} options     { onSegment?(i, seg), onEnd?(), onError?() }
 * @returns {function} stop function for this playback
 */
export function speakDialogue(transcript, options = {}) {
  const segs = parseDialogue(transcript)
  if (!segs.length) { options.onError?.(); return () => {} }

  // Map each distinct speaker to a voice profile (0/1/2) in order of appearance.
  const order = []
  const profileOf = {}
  for (const s of segs) {
    if (s.speaker === '__narrator__') { profileOf[s.speaker] = 0; continue }
    if (!(s.speaker in profileOf)) {
      profileOf[s.speaker] = order.length % VOICE_PROFILES.length
      order.push(s.speaker)
    }
  }

  stopSpeaking()
  const myToken = ++dialogueToken
  const cancelled = () => myToken !== dialogueToken

  ;(async () => {
    const nativeVoices = isNative() ? await pickNativeVoices() : [null, null, null]
    const webVoices = !isNative() ? pickWebVoices() : [null, null, null]
    if (cancelled()) return

    for (let i = 0; i < segs.length; i++) {
      if (cancelled()) return
      const seg = segs[i]
      const p = profileOf[seg.speaker] ?? 0
      const profile = VOICE_PROFILES[p]
      options.onSegment?.(i, seg)
      try {
        if (isNative()) {
          await speakSegmentNative(seg.text, profile, nativeVoices[p])
        } else {
          await speakSegmentWeb(seg.text, profile, webVoices[p])
        }
      } catch { /* keep going */ }
      // small gap between turns
      if (!cancelled()) await new Promise(r => setTimeout(r, 180))
    }
    if (!cancelled()) options.onEnd?.()
  })()

  return () => { if (myToken === dialogueToken) stopSpeaking() }
}

export function compareTexts(original, spoken) {
  const normalize = str =>
    str.toLowerCase()
      .replace(/[^a-z\s]/g, '')
      .trim()
      .split(/\s+/)
      .filter(Boolean)

  const origWords = normalize(original)
  const spokWords = normalize(spoken)

  if (origWords.length === 0) return 0

  let matches = 0
  origWords.forEach((word, i) => {
    if (spokWords[i] === word) matches++
  })

  return Math.round((matches / origWords.length) * 100)
}
