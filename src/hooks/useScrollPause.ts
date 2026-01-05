import { useEffect, useState, useRef } from "react";

/**
 * Hook to detect when user is actively scrolling
 * Returns true when scrolling, false when idle
 */
export const useScrollPause = (idleDelay: number = 150) => {
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Ensure window is available (client-side only)
    if (typeof window === 'undefined') return;
    
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolling(true);
          
          // Clear existing timeout
          if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
          }
          
          // Set scrolling to false after idle delay
          scrollTimeoutRef.current = setTimeout(() => {
            setIsScrolling(false);
          }, idleDelay);
          
          ticking = false;
        });
        ticking = true;
      }
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

