/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

class AudioSystem {
  private ctx: AudioContext | null = null;
  private ambientSource: OscillatorNode | null = null;
  private ambientSource2: OscillatorNode | null = null;
  private ambientGain: GainNode | null = null;
  private recordCrackleInterval: any = null;
  private isAmbientPlaying = false;

  private initContext() {
    if (!this.ctx) {
      // Handle browser prefixes
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtxClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleAmbient(forceState?: boolean): boolean {
    this.initContext();
    if (!this.ctx) return false;

    const targetState = forceState !== undefined ? forceState : !this.isAmbientPlaying;

    if (targetState) {
      if (this.isAmbientPlaying) return true;
      try {
        // Create low cozy drone
        this.ambientGain = this.ctx.createGain();
        this.ambientGain.gain.setValueAtTime(0, this.ctx.currentTime);
        this.ambientGain.gain.linearRampToValueAtTime(0.08, this.ctx.currentTime + 2.0); // very soft

        // Oscillator 1 (low hum)
        this.ambientSource = this.ctx.createOscillator();
        this.ambientSource.type = 'triangle';
        this.ambientSource.frequency.setValueAtTime(98.0, this.ctx.currentTime); // G2 note

        // Oscillator 2 (warm fifth)
        this.ambientSource2 = this.ctx.createOscillator();
        this.ambientSource2.type = 'sine';
        this.ambientSource2.frequency.setValueAtTime(146.83, this.ctx.currentTime); // D3

        // Filters to make it warm and cozy (cut high noise)
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(150, this.ctx.currentTime);

        // Connect
        this.ambientSource.connect(filter);
        this.ambientSource2.connect(filter);
        filter.connect(this.ambientGain);
        this.ambientGain.connect(this.ctx.destination);

        this.ambientSource.start();
        this.ambientSource2.start();

        // Vinyl crackle simulation
        this.recordCrackleInterval = setInterval(() => {
          if (!this.ctx || this.ctx.state === 'suspended') return;
          this.triggerPop();
        }, 1200);

        this.isAmbientPlaying = true;
        return true;
      } catch (err) {
        console.error('Failed to play ambient music synthesizer:', err);
        return false;
      }
    } else {
      if (!this.isAmbientPlaying) return false;
      if (this.ambientGain && this.ctx) {
        const currentGain = this.ambientGain;
        currentGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 1.0);
        setTimeout(() => {
          try {
            if (this.ambientSource) this.ambientSource.stop();
            if (this.ambientSource2) this.ambientSource2.stop();
          } catch(e) {}
        }, 1100);
      }
      if (this.recordCrackleInterval) {
        clearInterval(this.recordCrackleInterval);
        this.recordCrackleInterval = null;
      }
      this.isAmbientPlaying = false;
      return false;
    }
  }

  private triggerPop() {
    if (!this.ctx || !this.ambientGain) return;
    
    // Create random pop
    const bufferSize = this.ctx.sampleRate * 0.01; // tiny burst
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 3);
    }
    
    const noiseNode = this.ctx.createBufferSource();
    noiseNode.buffer = buffer;
    
    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass'; // bandpass
    noiseFilter.frequency.value = 800 + Math.random() * 600;
    
    const popGain = this.ctx.createGain();
    popGain.gain.value = Math.random() * 0.015; // extremely low pop
    
    noiseNode.connect(noiseFilter);
    noiseFilter.connect(popGain);
    popGain.connect(this.ctx.destination);
    
    noiseNode.start();
  }

  public playPour() {
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    
    // Simulate pouring liquid sound using white noise that filters upwards
    const bufferSize = this.ctx.sampleRate * 2.2; // 2.2 seconds
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }
    
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.value = 4.0;
    
    // Liquid pitch/resonance rises slightly as the cup fills up! (Amazing detail)
    filter.frequency.setValueAtTime(250, t);
    filter.frequency.exponentialRampToValueAtTime(750, t + 2.0);
    
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.12, t + 0.2); // fade in
    gain.gain.setValueAtTime(0.12, t + 1.8);
    gain.gain.linearRampToValueAtTime(0, t + 2.2); // fade out
    
    // Bubbles harmonics (little boiling/pour clicks)
    const bubbleOsc = this.ctx.createOscillator();
    bubbleOsc.type = 'sine';
    bubbleOsc.frequency.setValueAtTime(400, t);
    bubbleOsc.frequency.linearRampToValueAtTime(650, t + 1.8);
    
    const bubbleGain = this.ctx.createGain();
    bubbleGain.gain.setValueAtTime(0, t);
    bubbleGain.gain.linearRampToValueAtTime(0.015, t + 0.4);
    bubbleGain.gain.linearRampToValueAtTime(0, t + 2.0);
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    
    bubbleOsc.connect(bubbleGain);
    bubbleGain.connect(this.ctx.destination);
    
    noise.start();
    bubbleOsc.start();
    
    noise.stop(t + 2.2);
    bubbleOsc.stop(t + 2.2);
  }

  public playChime() {
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    
    const osc = this.ctx.createOscillator();
    const subOsc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, t); // C5
    osc.frequency.exponentialRampToValueAtTime(880.00, t + 0.4); // A5

    subOsc.type = 'triangle';
    subOsc.frequency.setValueAtTime(261.63, t); // C4

    gainNode.gain.setValueAtTime(0, t);
    gainNode.gain.linearRampToValueAtTime(0.12, t + 0.05); // quick attack
    gainNode.gain.exponentialRampToValueAtTime(0.001, t + 1.5); // long decay

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, t);

    osc.connect(filter);
    subOsc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    osc.start(t);
    subOsc.start(t);
    osc.stop(t + 1.6);
    subOsc.stop(t + 1.6);
  }

  public playTink() {
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(987.77, t); // B5 (sparkly tink)
    
    gainNode.gain.setValueAtTime(0, t);
    gainNode.gain.linearRampToValueAtTime(0.08, t + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

    osc.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.25);
  }

  public playClickEcho() {
    this.initContext();
    if (!this.ctx) return;
    
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(659.25, t); // E5
    osc.frequency.exponentialRampToValueAtTime(1318.51, t + 0.3); // E6
    
    gainNode.gain.setValueAtTime(0, t);
    gainNode.gain.linearRampToValueAtTime(0.1, t + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.001, t + 1.2);
    
    osc.connect(gainNode);
    gainNode.connect(this.ctx.destination);
    
    osc.start(t);
    osc.stop(t + 1.2);
  }

  public getPlaybackState() {
    return this.isAmbientPlaying;
  }
}

export const audioSystem = new AudioSystem();
export default audioSystem;
