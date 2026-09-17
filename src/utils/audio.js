// Web Audio API emergency sound synthesizer (no external audio files required)

let audioCtx = null;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Play a high-priority tactical emergency chirp
 */
export function playAlertSound(type = 'critical') {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'sos' || type === 'critical') {
      // Two-tone urgent siren pulse
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1320, now + 0.12);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.24);
      osc.frequency.exponentialRampToValueAtTime(1320, now + 0.36);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);

      osc.start(now);
      osc.stop(now + 0.45);
    } else if (type === 'warning') {
      // Moderate warning ping
      osc.type = 'sine';
      osc.frequency.setValueAtTime(660, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.2);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

      osc.start(now);
      osc.stop(now + 0.25);
    } else {
      // Subtle radio beep
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.setValueAtTime(680, now + 0.08);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

      osc.start(now);
      osc.stop(now + 0.18);
    }
  } catch (err) {
    console.warn('Audio playback not supported or blocked by browser policy:', err);
  }
}

let metronomeInterval = null;

/**
 * Start rhythmic CPR compression metronome (default 110 BPM)
 */
export function startCprMetronome(bpm = 110, onTick = null) {
  stopCprMetronome();
  const intervalMs = (60 / bpm) * 1000;

  const playTick = () => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.start(now);
      osc.stop(now + 0.08);
      if (onTick) onTick();
    } catch {
      // ignore
    }
  };

  playTick();
  metronomeInterval = setInterval(playTick, intervalMs);
  return metronomeInterval;
}

/**
 * Stop CPR compression metronome
 */
export function stopCprMetronome() {
  if (metronomeInterval) {
    clearInterval(metronomeInterval);
    metronomeInterval = null;
  }
}

