import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "performanceMode";

type PerformanceLevel = "full" | "reduced" | "minimal";

interface PerformanceModeState {
  level: PerformanceLevel;
  setLevel: (level: PerformanceLevel) => void;
  toggle: () => void;
  disable3D: boolean;
  disableParallax: boolean;
  disableBlur: boolean;
  reduceMotion: boolean;
}

// Global state for performance mode
let globalLevel: PerformanceLevel = "full";
const listeners = new Set<(level: PerformanceLevel) => void>();

const notifyListeners = () => {
  listeners.forEach((listener) => listener(globalLevel));
};

export const usePerformanceMode = (): PerformanceModeState => {
  const [level, setLevelState] = useState<PerformanceLevel>(globalLevel);

  useEffect(() => {
    // Load from localStorage on mount
    const saved = localStorage.getItem(STORAGE_KEY) as PerformanceLevel | null;
    if (saved && ["full", "reduced", "minimal"].includes(saved)) {
      globalLevel = saved;
      setLevelState(saved);
    }

    // Subscribe to changes
    const handleChange = (newLevel: PerformanceLevel) => {
      setLevelState(newLevel);
    };
    listeners.add(handleChange);

    // Listen for keyboard shortcut event
    const handleKeyboardToggle = () => {
      const levels: PerformanceLevel[] = ["full", "reduced", "minimal"];
      const currentIndex = levels.indexOf(globalLevel);
      const nextLevel = levels[(currentIndex + 1) % levels.length];
      globalLevel = nextLevel;
      localStorage.setItem(STORAGE_KEY, nextLevel);
      notifyListeners();
    };
    window.addEventListener("togglePerformanceMode", handleKeyboardToggle);

    return () => {
      listeners.delete(handleChange);
      window.removeEventListener("togglePerformanceMode", handleKeyboardToggle);
    };
  }, []);

  const setLevel = useCallback((newLevel: PerformanceLevel) => {
    globalLevel = newLevel;
    localStorage.setItem(STORAGE_KEY, newLevel);
    notifyListeners();
  }, []);

  const toggle = useCallback(() => {
    const levels: PerformanceLevel[] = ["full", "reduced", "minimal"];
    const currentIndex = levels.indexOf(globalLevel);
    const nextLevel = levels[(currentIndex + 1) % levels.length];
    setLevel(nextLevel);
  }, [setLevel]);

  return {
    level,
    setLevel,
    toggle,
    // Derived flags for easy consumption
    disable3D: level === "minimal",
    disableParallax: level !== "full",
    disableBlur: level === "minimal",
    reduceMotion: level !== "full",
  };
};

// Static getter for components that can't use hooks
export const getPerformanceLevel = (): PerformanceLevel => globalLevel;
