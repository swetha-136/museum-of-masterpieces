// Sophisticated Web Audio API procedural museum soundscape engine
// Generates gentle museum room ambience, wood parquet footsteps, and distant piano chords without external network dependencies.

class MuseumAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;
  private isPlaying: boolean = false;
  private masterGain: GainNode | null = null;
  private ambienceGain: GainNode | null = null;
  private noiseNode: AudioNode | null = null;
  private pianoInterval: number | null = null;
  private listeners: Set<(muted: boolean) => void> = new Set();

  constructor() {
    // Check saved preference
    const saved = localStorage.getItem('museum_audio_muted');
    this.isMuted = saved !== null ? saved === 'true' : true;
  }

  public subscribe(fn: (muted: boolean) => void): () => void {
    this.listeners.add(fn);
    fn(this.isMuted);
    return () => this.listeners.delete(fn);
  }

  private notify() {
    this.listeners.forEach(fn => fn(this.isMuted));
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.65, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.initContext();
    this.isMuted = !this.isMuted;
    localStorage.setItem('museum_audio_muted', String(this.isMuted));

    if (this.masterGain && this.ctx) {
      const targetGain = this.isMuted ? 0 : 0.65;
      this.masterGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.15);
    }

    if (!this.isMuted && !this.isPlaying) {
      this.startAmbience();
    }

    this.notify();
    return this.isMuted;
  }

  public unmute() {
    if (this.isMuted) {
      this.toggleMute();
    }
  }

  public startAmbience() {
    this.initContext();
    if (this.isPlaying || !this.ctx || !this.masterGain) return;
    this.isPlaying = true;

    // 1. Procedural Museum Hall Air & Reverberant Room Tone (Filtered Pink/Brown Noise)
    const bufferSize = this.ctx.sampleRate * 3;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.02 * white) / 1.02; // Brown noise algorithm
      lastOut = output[i];
      output[i] *= 3.5;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(180, this.ctx.currentTime);
    filter.Q.setValueAtTime(1.5, this.ctx.currentTime);

    const roomResonance = this.ctx.createBiquadFilter();
    roomResonance.type = 'peaking';
    roomResonance.frequency.setValueAtTime(95, this.ctx.currentTime);
    roomResonance.gain.setValueAtTime(4, this.ctx.currentTime);
    roomResonance.Q.setValueAtTime(2.0, this.ctx.currentTime);

    this.ambienceGain = this.ctx.createGain();
    this.ambienceGain.gain.setValueAtTime(0.045, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(roomResonance);
    roomResonance.connect(this.ambienceGain);
    this.ambienceGain.connect(this.masterGain);

    whiteNoise.start();
    this.noiseNode = whiteNoise;

    // 2. Schedule occasional distant vintage piano chords (quiet classical Satie / Chopin motif)
    this.schedulePianoMelody();
  }

  private schedulePianoMelody() {
    if (this.pianoInterval) clearInterval(this.pianoInterval);

    // Chords evoking quiet evening museum reflection (Fmaj7, Dm9, Am7, Em)
    const chords = [
      [174.61, 261.63, 329.63, 349.23], // F3, C4, E4, F4
      [146.83, 220.00, 293.66, 369.99], // D3, A3, D4, F#4
      [110.00, 196.00, 261.63, 329.63], // A2, G3, C4, E4
      [130.81, 196.00, 246.94, 329.63], // C3, G3, B3, E4
      [98.00, 164.81, 246.94, 293.66]   // G2, E3, B3, D4
    ];

    let chordIdx = 0;
    const playNext = () => {
      if (!this.isMuted && this.isPlaying) {
        const chord = chords[chordIdx % chords.length];
        chordIdx++;
        this.playDistantChord(chord);
      }
    };

    // Play first chord after 4 seconds, then every 16-24 seconds
    setTimeout(playNext, 4000);
    this.pianoInterval = window.setInterval(playNext, 20000);
  }

  private playDistantChord(frequencies: number[]) {
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    frequencies.forEach((freq, idx) => {
      const now = this.ctx!.currentTime + idx * 0.12; // Arpeggiated stroke

      const osc = this.ctx!.createOscillator();
      const osc2 = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const filter = this.ctx!.createBiquadFilter();

      // Soft piano-like timbre with lowpass filter
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(650, now);
      filter.frequency.exponentialRampToValueAtTime(140, now + 4.5);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(freq * 1.002, now); // Gentle acoustic beating

      const noteGain = 0.035 / frequencies.length;
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(noteGain, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.00001, now + 5.5);

      osc.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(now);
      osc2.start(now);
      osc.stop(now + 6.0);
      osc2.stop(now + 6.0);
    });
  }

  // Play subtle wood floor footsteps when the user moves between artworks or rooms
  public playFootstep() {
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(75, now);
    osc.frequency.exponentialRampToValueAtTime(35, now + 0.18);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(220, now);

    gain.gain.setValueAtTime(0.03, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.25);
  }

  // Soft tactile museum click (brass plaque / catalog page flip)
  public playPlaqueClick() {
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(280, now + 0.06);

    gain.gain.setValueAtTime(0.02, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.09);
  }

  public playPageTurn() {
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    const now = this.ctx.currentTime;

    const bufferSize = this.ctx.sampleRate * 0.15;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, now);
    filter.Q.setValueAtTime(2.5, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.025, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(now);
  }
}

export const museumAudio = new MuseumAudioEngine();
