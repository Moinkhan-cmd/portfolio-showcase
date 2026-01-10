// Lightweight sound effect generator using Web Audio API
// No external dependencies or API calls needed

let audioContext: AudioContext | null = null;
let soundEnabled = true;

// Event emitter for visualizer
type SoundEventCallback = (type: 'navigation' | 'transition' | 'success' | 'hover', intensity: number) => void;
const listeners: Set<SoundEventCallback> = new Set();

export const onSoundPlay = (callback: SoundEventCallback) => {
  listeners.add(callback);
  return () => listeners.delete(callback);
};

const emitSoundEvent = (type: 'navigation' | 'transition' | 'success' | 'hover', intensity: number) => {
  listeners.forEach(callback => callback(type, intensity));
};

const getAudioContext = (): AudioContext | null => {
  if (typeof window === "undefined") return null;
  
  if (!audioContext) {
    try {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch {
      return null;
    }
  }
  return audioContext;
};

// Resume audio context on first user interaction (required by browsers)
export const initSoundSystem = () => {
  const ctx = getAudioContext();
  if (ctx?.state === "suspended") {
    ctx.resume();
  }
};

export const setSoundEnabled = (enabled: boolean) => {
  soundEnabled = enabled;
};

export const isSoundEnabled = () => soundEnabled;

// Subtle click sound for navigation
export const playNavigationSound = () => {
  if (!soundEnabled) return;
  
  // Emit event for visualizer even before playing
  emitSoundEvent('navigation', 0.6);
  
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Soft, subtle click
    oscillator.frequency.setValueAtTime(800, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.08);
    oscillator.type = "sine";

    // Very low volume for subtlety
    gainNode.gain.setValueAtTime(0.03, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.08);
  } catch {
    // Silently fail if audio isn't supported
  }
};

// Gentle whoosh for section transitions
export const playSectionTransitionSound = () => {
  if (!soundEnabled) return;
  
  // Emit event for visualizer
  emitSoundEvent('transition', 0.8);
  
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    // Create noise for whoosh effect
    const bufferSize = ctx.sampleRate * 0.15;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Generate filtered noise
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    // Low-pass filter for soft whoosh
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(2000, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + 0.15);

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.015, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

    source.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    source.start(ctx.currentTime);
  } catch {
    // Silently fail
  }
};

// Success/confirm sound
export const playSuccessSound = () => {
  if (!soundEnabled) return;
  
  // Emit event for visualizer
  emitSoundEvent('success', 1.0);
  
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Pleasant two-tone chime
    oscillator.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    oscillator.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08); // E5
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0.025, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.2);
  } catch {
    // Silently fail
  }
};

// Hover sound (very subtle)
export const playHoverSound = () => {
  if (!soundEnabled) return;
  
  // Emit event for visualizer
  emitSoundEvent('hover', 0.3);
  
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.setValueAtTime(600, ctx.currentTime);
    oscillator.type = "sine";

    // Extremely subtle
    gainNode.gain.setValueAtTime(0.008, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.03);
  } catch {
    // Silently fail
  }
};
