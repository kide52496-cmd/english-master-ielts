import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach, vi } from 'vitest'

// ---------------------------------------------------------------------------
// Browser APIs jsdom does not implement but the app relies on.
// Each stub is deliberately minimal: enough shape for the code under test to
// run its real logic, with no behaviour of its own that a test could
// accidentally assert against.
// ---------------------------------------------------------------------------

class FakeSpeechSynthesisUtterance {
  constructor(text) {
    this.text = text
    this.lang = ''
    this.rate = 1
    this.pitch = 1
    this.volume = 1
    this.voice = null
    this.onend = null
    this.onerror = null
    this.onstart = null
    this.onboundary = null
  }
  addEventListener(type, fn) {
    this[`on${type}`] = fn
  }
  removeEventListener(type) {
    this[`on${type}`] = null
  }
}

function installSpeechSynthesis() {
  const synth = {
    speaking: false,
    pending: false,
    paused: false,
    spoken: [],
    speak: vi.fn(function (utt) {
      this.spoken.push(utt)
      this.speaking = true
      // Resolve on a macrotask so `await` in tests sees the end event.
      setTimeout(() => {
        this.speaking = false
        utt.onend?.({ type: 'end' })
      }, 0)
    }),
    cancel: vi.fn(function () {
      this.speaking = false
      this.spoken = []
    }),
    pause: vi.fn(),
    resume: vi.fn(),
    getVoices: vi.fn(() => [
      { name: 'Fake EN-US', lang: 'en-US', default: true, localService: true },
      { name: 'Fake EN-GB', lang: 'en-GB', default: false, localService: true },
    ]),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    onvoiceschanged: null,
  }
  Object.defineProperty(window, 'speechSynthesis', {
    value: synth,
    writable: true,
    configurable: true,
  })
  window.SpeechSynthesisUtterance = FakeSpeechSynthesisUtterance
  globalThis.SpeechSynthesisUtterance = FakeSpeechSynthesisUtterance
}

class FakeSpeechRecognition {
  constructor() {
    this.lang = 'en-US'
    this.continuous = false
    this.interimResults = false
    this.maxAlternatives = 1
    this.onresult = null
    this.onerror = null
    this.onend = null
    this.onstart = null
    this.started = false
    FakeSpeechRecognition.instances.push(this)
  }
  start() {
    this.started = true
    this.onstart?.({})
  }
  stop() {
    this.started = false
    this.onend?.({})
  }
  abort() {
    this.started = false
    this.onend?.({})
  }
  addEventListener(type, fn) {
    this[`on${type}`] = fn
  }
  removeEventListener(type) {
    this[`on${type}`] = null
  }
  /** Test helper: feed a transcript through as a final result. */
  emit(transcript, confidence = 0.9) {
    const alternative = { transcript, confidence }
    const result = [alternative]
    result.isFinal = true
    const results = [result]
    results.length = 1
    this.onresult?.({ resultIndex: 0, results })
  }
}
FakeSpeechRecognition.instances = []

function installSpeechRecognition() {
  window.SpeechRecognition = FakeSpeechRecognition
  window.webkitSpeechRecognition = FakeSpeechRecognition
  globalThis.SpeechRecognition = FakeSpeechRecognition
}

function installMatchMedia() {
  if (window.matchMedia) return
  window.matchMedia = vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
}

function installAudio() {
  class FakeAudioContext {
    constructor() {
      this.state = 'running'
      this.currentTime = 0
      this.destination = {}
      this.sampleRate = 44100
    }
    createAnalyser() {
      return {
        fftSize: 2048,
        frequencyBinCount: 1024,
        smoothingTimeConstant: 0.8,
        connect: vi.fn(),
        disconnect: vi.fn(),
        getByteFrequencyData: vi.fn(),
        getByteTimeDomainData: vi.fn(),
      }
    }
    createMediaStreamSource() {
      return { connect: vi.fn(), disconnect: vi.fn() }
    }
    createGain() {
      return { gain: { value: 1 }, connect: vi.fn(), disconnect: vi.fn() }
    }
    close() {
      this.state = 'closed'
      return Promise.resolve()
    }
    resume() {
      this.state = 'running'
      return Promise.resolve()
    }
  }
  window.AudioContext = FakeAudioContext
  window.webkitAudioContext = FakeAudioContext

  const track = { stop: vi.fn(), kind: 'audio', enabled: true }
  const stream = { getTracks: () => [track], getAudioTracks: () => [track], id: 'fake-stream' }
  Object.defineProperty(navigator, 'mediaDevices', {
    value: { getUserMedia: vi.fn().mockResolvedValue(stream) },
    writable: true,
    configurable: true,
  })

  class FakeMediaRecorder {
    constructor(stream) {
      this.stream = stream
      this.state = 'inactive'
      this.ondataavailable = null
      this.onstop = null
      this.onerror = null
    }
    start() { this.state = 'recording' }
    stop() {
      this.state = 'inactive'
      this.ondataavailable?.({ data: new Blob([''], { type: 'audio/webm' }) })
      this.onstop?.({})
    }
    pause() { this.state = 'paused' }
    resume() { this.state = 'recording' }
    static isTypeSupported() { return true }
  }
  window.MediaRecorder = FakeMediaRecorder
  globalThis.MediaRecorder = FakeMediaRecorder

  // jsdom throws "Not implemented" for these on HTMLMediaElement.
  Object.defineProperty(window.HTMLMediaElement.prototype, 'play', {
    configurable: true,
    value: vi.fn().mockResolvedValue(undefined),
  })
  Object.defineProperty(window.HTMLMediaElement.prototype, 'pause', {
    configurable: true,
    value: vi.fn(),
  })
  Object.defineProperty(window.HTMLMediaElement.prototype, 'load', {
    configurable: true,
    value: vi.fn(),
  })
}

function installMisc() {
  if (!window.scrollTo) window.scrollTo = vi.fn()
  else window.scrollTo = vi.fn()
  if (!window.ResizeObserver) {
    window.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  }
  if (!window.IntersectionObserver) {
    window.IntersectionObserver = class {
      constructor() { this.root = null }
      observe() {}
      unobserve() {}
      disconnect() {}
      takeRecords() { return [] }
    }
  }
  if (!globalThis.crypto?.randomUUID) {
    const c = globalThis.crypto || {}
    c.randomUUID = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, ch => {
      const r = (Math.random() * 16) | 0
      const v = ch === 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
    globalThis.crypto = c
  }
}

beforeEach(() => {
  localStorage.clear()
  sessionStorage.clear()
  FakeSpeechRecognition.instances.length = 0
  installSpeechSynthesis()
  installSpeechRecognition()
  installMatchMedia()
  installAudio()
  installMisc()
  // Every test starts on a clean URL so router tests do not leak ?page=
  window.history.replaceState({}, '', '/')
  document.documentElement.className = ''
})

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

export { FakeSpeechRecognition, FakeSpeechSynthesisUtterance }
