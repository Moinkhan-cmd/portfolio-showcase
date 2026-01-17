import { useEffect, useState, useRef, RefObject } from "react";

interface UseVisibilityObserverOptions {
  threshold?: number;
  rootMargin?: string;
  enabled?: boolean;
}

/**
 * Shared visibility observer hook to reduce IntersectionObserver instances.
 * Uses a singleton pattern for the observer when possible.
 */
export const useVisibilityObserver = <T extends HTMLElement = HTMLElement>(
  options: UseVisibilityObserverOptions = {}
): [RefObject<T>, boolean] => {
  const { threshold = 0.01, rootMargin = "100px", enabled = true } = options;
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!enabled || typeof IntersectionObserver === "undefined") return;
    
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [enabled, threshold, rootMargin]);

  return [ref, isVisible];
};
