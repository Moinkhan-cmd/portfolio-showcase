import { useEffect, useState, useRef } from "react";

/**
 * Hook to detect when user is actively scrolling
 * Returns true when scrolling, false when idle
 */
export const useScrollPause = (idleDelay: number = 100) => {
  const [isScrolling, setIsScrolling] = useState(false);
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Ensure window is available (client-side only)
    if (typeof window === "undefined") return;

    let ticking = false;

    const setScrolling = (value: boolean) => {
      if (isScrollingRef.current === value) return;
      isScrollingRef.current = value;
      setIsScrolling(value);
    };

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;

      window.requestAnimationFrame(() => {
        setScrolling(true);

        // Clear existing timeout
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }

        // Set scrolling to false after idle delay
        scrollTimeoutRef.current = setTimeout(() => {
          setScrolling(false);
        }, idleDelay);

        ticking = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [idleDelay]);

  return isScrolling;
};
