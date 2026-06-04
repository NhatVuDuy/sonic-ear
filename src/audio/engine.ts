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
    if (this.ac.state === 'suspended') this.ac.resume()
    return this.ac
  }

  private buildChain() {
    const ac = this.ac!
    this.masterGain = ac.createGain()
    this.masterGain.gain.value = 0.8
    this.masterGain.connect(ac.destination)

    this.compressor = ac.createDynamicsCompressor()
    this.compressor.threshold.value = -14
    this.compressor.knee.value = 8
    this.compressor.ratio.value = 4
    this.compressor.attack.value = 0.003
    this.compressor.release.value = 0.22
    this.compressor.connect(this.masterGain)

    this.dryGain = ac.createGain()
    this.dryGain.gain.value = 0.74
    this.dryGain.connect(this.compressor)

    this.reverbGain = ac.createGain()
    this.reverbGain.gain.value = 0.26
    this.reverbGain.connect(this.compressor)

    // Generate reverb impulse response
    const sr = ac.sampleRate
    const len = Math.floor(sr * 2.6)
    const buf = ac.createBuffer(2, len, sr)
    for (let c = 0; c < 2; c++) {
      const ch = buf.getChannelData(c)
      for (let i = 0; i < len; i++) {
        ch[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.2)
      }
    }
    this.reverbNode = ac.createConvolver()
    this.reverbNode.buffer = buf
    this.reverbNode.connect(this.reverbGain)
  }

  attack(ns: string, velocity = 0.8) {
    const ac = this.getAC()
    if (this.voices.has(ns)) this.release(ns, true)

    const [name, oct] = parseNote(ns)
    const hz = noteToHz(name, oct)
    const now = ac.currentTime

    const filter = ac.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = Math.min(6000, 800 + hz * 3.5)
    filter.Q.value = 0.8

    const env = ac.createGain()
    env.gain.setValueAtTime(0, now)
    env.gain.linearRampToValueAtTime(velocity * 0.88, now + 0.003)
    env.gain.exponentialRampToValueAtTime(velocity * 0.18, now + 0.7)
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
      makeOsc('triangle', hz,         0.55),
      makeOsc('sawtooth', hz * 1.004, 0.22),
      makeOsc('sine',     hz * 0.5,   0.18),
      makeOsc('sine',     hz * 2,     0.07),
    ]

    this.voices.set(ns, { oscs, env, filter })
  }

  release(ns: string, immediate = false) {
    const voice = this.voices.get(ns)
    if (!voice || !this.ac) return
    this.voices.delete(ns)

    const now = this.ac.currentTime
    const rel = immediate ? 0.04 : 1.5
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

  // Play a note for a fixed duration (ear training)
  playNote(ns: string, duration = 1.8, velocity = 0.78, delay = 0) {
    setTimeout(() => {
      this.attack(ns, velocity)
      setTimeout(() => this.release(ns, false), duration * 1000)
    }, delay * 1000)
  }

  // Play multiple notes (chord or arpeggio)
  playNotes(noteStrs: string[], arp = false, velocity = 0.75) {
    if (arp) {
      noteStrs.forEach((ns, i) => this.playNote(ns, 1.2, velocity, i * 0.22))
    } else {
      noteStrs.forEach(ns => this.playNote(ns, 1.6, velocity, 0))
    }
  }

  // Play a scale up and down
  playScale(noteStrs: string[], tempo = 0.2) {
    noteStrs.forEach((ns, i) => this.playNote(ns, 0.85, 0.72, i * tempo))
    const rev = [...noteStrs].reverse().slice(1)
    rev.forEach((ns, i) => this.playNote(ns, 0.85, 0.68, (noteStrs.length + i) * tempo))
  }

  isReady() { return this.ac !== null }
}

// Singleton
export const audio = new AudioEngine()

// Global safety release
if (typeof window !== 'undefined') {
  window.addEventListener('mouseup',  () => audio.releaseAll())
  window.addEventListener('touchend', () => audio.releaseAll())
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) audio.releaseAll()
  })
}
