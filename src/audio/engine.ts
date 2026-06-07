import { noteToHz, parseNote } from '@/theory'

interface Voice {
  oscs: OscillatorNode[]
  env: GainNode
  filter: BiquadFilterNode
}

class AudioEngine {
  private ac: AudioContext | null = null
  private masterGain!: GainNode
  private compressor!: DynamicsCompressorNode
  private dryGain!: GainNode
  private reverbGain!: GainNode
  private reverbNode!: ConvolverNode
  private voices: Map<string, Voice> = new Map()

  private getAC(): AudioContext {
    if (!this.ac) {
      this.ac = new (window.AudioContext || (window as any).webkitAudioContext)()
      this.buildChain()
    }
    // resume() is called but NOT awaited here — callers that need audio
    // immediately should check state and use _scheduleAfterResume instead.
    if (this.ac.state === 'suspended') this.ac.resume()
    return this.ac
  }

  // Run fn immediately if context is running, otherwise wait for resume first.
  // This is the fix for iOS Safari where AudioContext starts suspended when
  // created outside a user gesture (e.g. auto-play from useEffect).
  private _scheduleAfterResume(ac: AudioContext, fn: () => void) {
    if (ac.state === 'running') {
      fn()
    } else {
      ac.resume().then(fn).catch(() => {
        // Ignore — AudioContext may be permanently blocked until user gesture
      })
    }
  }

  private buildChain() {
    const ac = this.ac!
    this.masterGain = ac.createGain()
    this.masterGain.gain.value = 0.82
    this.masterGain.connect(ac.destination)

    this.compressor = ac.createDynamicsCompressor()
    this.compressor.threshold.value = -16
    this.compressor.knee.value = 10
    this.compressor.ratio.value = 3
    this.compressor.attack.value = 0.004
    this.compressor.release.value = 0.28
    this.compressor.connect(this.masterGain)

    this.dryGain = ac.createGain()
    this.dryGain.gain.value = 0.58
    this.dryGain.connect(this.compressor)

    this.reverbGain = ac.createGain()
    this.reverbGain.gain.value = 0.42
    this.reverbGain.connect(this.compressor)

    const sr = ac.sampleRate
    const len = Math.floor(sr * 3.8)
    const buf = ac.createBuffer(2, len, sr)
    for (let c = 0; c < 2; c++) {
      const ch = buf.getChannelData(c)
      for (let i = 0; i < len; i++) {
        ch[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 1.5)
      }
    }
    this.reverbNode = ac.createConvolver()
    this.reverbNode.buffer = buf
    this.reverbNode.connect(this.reverbGain)
  }

  // Inner scheduling — must only be called when ac.state === 'running'
  private _doAttack(ac: AudioContext, ns: string, velocity: number) {
    if (this.voices.has(ns)) this.release(ns, true)

    const [name, oct] = parseNote(ns)
    const hz = noteToHz(name, oct)
    const now = ac.currentTime

    const filter = ac.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = Math.min(8000, 600 + hz * 4.5)
    filter.Q.value = 0.5

    const env = ac.createGain()
    env.gain.setValueAtTime(0, now)
    env.gain.linearRampToValueAtTime(velocity * 0.92, now + 0.002)
    env.gain.exponentialRampToValueAtTime(velocity * 0.26, now + 0.9)
    env.connect(filter)
    filter.connect(this.dryGain)
    filter.connect(this.reverbNode)

    const makeOsc = (type: OscillatorType, freq: number, gain: number) => {
      const o = ac.createOscillator()
      const g = ac.createGain()
      o.type = type
      o.frequency.value = freq
      g.gain.value = gain
      o.connect(g); g.connect(env)
      o.start(now)
      return o
    }

    const oscs = [
      makeOsc('triangle', hz,         0.42),
      makeOsc('sawtooth', hz * 1.003, 0.09),
      makeOsc('sine',     hz * 0.5,   0.22),
      makeOsc('sine',     hz * 2,     0.20),
      makeOsc('sine',     hz * 3,     0.08),
    ]

    this.voices.set(ns, { oscs, env, filter })
  }

  attack(ns: string, velocity = 0.8) {
    const ac = this.getAC()
    // _scheduleAfterResume ensures audio nodes are only created once the
    // AudioContext is running — critical for iOS where the context starts
    // suspended if created outside a direct user gesture.
    this._scheduleAfterResume(ac, () => this._doAttack(ac, ns, velocity))
  }

  release(ns: string, immediate = false) {
    const voice = this.voices.get(ns)
    if (!voice || !this.ac) return
    this.voices.delete(ns)

    const now = this.ac.currentTime
    const rel = immediate ? 0.04 : 2.2
    voice.env.gain.cancelScheduledValues(now)
    voice.env.gain.setValueAtTime(voice.env.gain.value, now)
    voice.env.gain.exponentialRampToValueAtTime(0.0001, now + rel)

    setTimeout(() => {
      voice.oscs.forEach(o => { try { o.stop(); o.disconnect() } catch {} })
      try { voice.env.disconnect(); voice.filter.disconnect() } catch {}
    }, (rel + 0.1) * 1000)
  }

  releaseAll() {
    for (const ns of this.voices.keys()) this.release(ns, true)
  }

  playNote(ns: string, duration = 1.8, velocity = 0.78, delay = 0) {
    setTimeout(() => {
      this.attack(ns, velocity)
      setTimeout(() => this.release(ns, false), duration * 1000)
    }, delay * 1000)
  }

  playNotes(noteStrs: string[], arp = false, velocity = 0.75) {
    if (arp) {
      noteStrs.forEach((ns, i) => this.playNote(ns, 1.2, velocity, i * 0.22))
    } else {
      noteStrs.forEach(ns => this.playNote(ns, 1.6, velocity, 0))
    }
  }

  playScale(noteStrs: string[], tempo = 0.2) {
    noteStrs.forEach((ns, i) => this.playNote(ns, 0.85, 0.72, i * tempo))
    const rev = [...noteStrs].reverse().slice(1)
    rev.forEach((ns, i) => this.playNote(ns, 0.85, 0.68, (noteStrs.length + i) * tempo))
  }

  isReady() { return this.ac !== null }
}

export const audio = new AudioEngine()

if (typeof window !== 'undefined') {
  // Resume AudioContext on any user interaction so auto-play works on iOS
  // after the first tap (iOS blocks AudioContext until user gesture).
  const resumeOnGesture = () => {
    const ac = (audio as any).ac as AudioContext | null
    if (ac && ac.state === 'suspended') ac.resume()
  }
  document.addEventListener('pointerdown', resumeOnGesture, { passive: true })
  document.addEventListener('touchstart',  resumeOnGesture, { passive: true })

  window.addEventListener('mouseup',  () => audio.releaseAll())
  window.addEventListener('touchend', () => audio.releaseAll())
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) audio.releaseAll()
  })
}
