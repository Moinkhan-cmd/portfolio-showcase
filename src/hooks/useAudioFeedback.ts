import { useCallback, useEffect, useRef, useState } from "react";
import { safeLocalStorage } from "@/lib/safeStorage";

type SoundType = "navigate" | "hover" | "click" | "success";

interface AudioFeedbackOptions {
  enabled?: boolean;
}

export const useAudioFeedback = (options: AudioFeedbackOptions = {}) => {
  const [isEnabled, setIsEnabled] = useState(() => {
    const stored = safeLocalStorage.getItem("portfolio_audio_enabled");
    return stored !== null ? stored === "true" : true;
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const hasUserGestureRef = useRef(false);

  // Browser autoplay policies require WebAudio to be started/resumed after a user gesture.
  useEffect(() => {
    const unlock = () => {
      if (hasUserGestureRef.current) return;
      hasUserGestureRef.current = true;

      const ctx = audioContextRef.current;
      if (ctx?.state === "suspended") {
        void ctx.resume().catch(() => {
          // Ignore: some browsers still block resume in edge cases.
        });
      }

      window.removeEventListener("pointerdown", unlock, true);
      window.removeEventListener("keydown", unlock, true);
      window.removeEventListener("touchstart", unlock, true);
    };

    window.addEventListener("pointerdown", unlock, true);
    window.addEventListener("keydown", unlock, true);
    window.addEventListener("touchstart", unlock, true);

    return () => {
      window.removeEventListener("pointerdown", unlock, true);
      window.removeEventListener("keydown", unlock, true);
      window.removeEventListener("touchstart", unlock, true);
    };
  }, []);

  // Initialize AudioContext lazily, but only after a user gesture.
  const getAudioContext = useCallback(() => {
    if (!hasUserGestureRef.current) return null;

    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 32;
      analyserRef.current.connect(audioContextRef.current.destination);
    }

    return { ctx: audioContextRef.current, analyser: analyserRef.current! };
  }, []);

  // Persist preference
  useEffect(() => {
    safeLocalStorage.setItem("portfolio_audio_enabled", String(isEnabled));
  }, [isEnabled]);

  // Keyboard shortcut to toggle audio (M key)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key.toLowerCase() === "m" &&
        !(e.target instanceof HTMLInputElement) &&
        !(e.target instanceof HTMLTextAreaElement)
      ) {
        setIsEnabled((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const playSound = useCallback(
    (type: SoundType) => {
      if (!isEnabled) return;

      const audioNodes = getAudioContext();
      if (!audioNodes) return;

      const { ctx, analyser } = audioNodes;

      // Resume context if suspended (browser autoplay policy)
      if (ctx.state === "suspended") {
        void ctx.resume().catch(() => {
          // Ignore if resume is blocked; we just won't play audio.
        });
      }

      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(analyser);

      const now = ctx.currentTime;

      switch (type) {
        case "navigate":
          // Soft, pleasant navigation sound
          oscillator.type = "sine";
          oscillator.frequency.setValueAtTime(440, now);
          oscillator.frequency.exponentialRampToValueAtTime(880, now + 0.08);
          gainNode.gain.setValueAtTime(0.08, now);
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
          oscillator.start(now);
          oscillator.stop(now + 0.15);
          break;

        case "hover":
          // Very subtle tick
          oscillator.type = "sine";
          oscillator.frequency.setValueAtTime(600, now);
          gainNode.gain.setValueAtTime(0.03, now);
          gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
          oscillator.start(now);
          oscillator.stop(now + 0.05);
          break;

        case "click":
          // Soft click sound
          oscillator.type = "triangle";
          oscillator.frequency.setValueAtTime(300, now);
          oscillator.frequency.exponentialRampToValueAtTime(150, now + 0.1);
          gainNode.gain.setValueAtTime(0.1, now);
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
          oscillator.start(now);
          oscillator.stop(now + 0.1);
          break;

        case "success":
          // Pleasant ascending tone
          oscillator.type = "sine";
          oscillator.frequency.setValueAtTime(523.25, now); // C5
          oscillator.frequency.setValueAtTime(659.25, now + 0.1); // E5
          oscillator.frequency.setValueAtTime(783.99, now + 0.2); // G5
          gainNode.gain.setValueAtTime(0.08, now);
          gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
          oscillator.start(now);
          oscillator.stop(now + 0.3);
          break;
      }

      setIsPlaying(true);
      setTimeout(() => setIsPlaying(false), 200);
    },
    [isEnabled, getAudioContext]
  );

  const toggle = useCallback(() => {
    setIsEnabled((prev) => !prev);
  }, []);

  return {
    isEnabled,
    isPlaying,
    toggle,
    playSound,
    analyser: analyserRef.current,
  };
};

// Create a context to share audio state across components
import { createContext, useContext } from "react";

interface AudioContextType {
  isEnabled: boolean;
  isPlaying: boolean;
  toggle: () => void;
  playSound: (type: SoundType) => void;
}

export const AudioFeedbackContext = createContext<AudioContextType | null>(null);

export const useAudioContext = () => {
  const context = useContext(AudioFeedbackContext);
  if (!context) {
    throw new Error("useAudioContext must be used within AudioFeedbackProvider");
  }
  return context;
};
