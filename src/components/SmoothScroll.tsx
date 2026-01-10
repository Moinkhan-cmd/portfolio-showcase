import { useEffect, useRef, useCallback } from "react";
import Lenis from "lenis";

// Simpler, faster easing
const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

let lenisInstance: Lenis | null = null;

const shouldEnableLenis = () => {
  if (typeof window === "undefined") return false;
  if (window.location.pathname.startsWith("/admin")) return false;
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return false;
  // Disable on touch devices for native scrolling (much smoother)
  if ("ontouchstart" in window || navigator.maxTouchPoints > 0) return false;
  return true;
};

export const SmoothScroll = () => {
  const rafIdRef = useRef<number | null>(null);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (!shouldEnableLenis()) return;

    const lenis = new Lenis({
      duration: 0.8, // Shorter duration for snappier feel
      easing: easeOutQuart,
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.8, // Slightly reduced for smoother feel
      touchMultiplier: 1,
      infinite: false,
      autoResize: true,
    });

    lenisInstance = lenis;
    lenisRef.current = lenis;

    const raf = (time: number) => {
      lenis.raf(time);
      rafIdRef.current = requestAnimationFrame(raf);
    };

    rafIdRef.current = requestAnimationFrame(raf);

    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest?.("a") as HTMLAnchorElement | null;
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || !href.startsWith("#") || href === "#") return;

      const element = document.querySelector(href);
      if (!element) return;

      e.preventDefault();
      const offset = 80;
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      lenis.scrollTo(top, { duration: 0.8, easing: easeOutQuart });
    };

    document.addEventListener("click", handleAnchorClick, { passive: false, capture: true });

    // Start at top
    lenis.scrollTo(0, { immediate: true });

    return () => {
      document.removeEventListener("click", handleAnchorClick, true);
      if (rafIdRef.current != null) cancelAnimationFrame(rafIdRef.current);
      lenis.destroy();
      lenisInstance = null;
      lenisRef.current = null;
    };
  }, []);

  return null;
};

export const getLenisInstance = () => lenisInstance;

export const scrollToSection = (selector: string, offset: number = 80) => {
  const element = document.querySelector(selector);
  if (!element) return;
  const top = element.getBoundingClientRect().top + window.scrollY - offset;

  if (lenisInstance) {
    lenisInstance.scrollTo(top, { duration: 0.8, easing: easeOutQuart });
  } else {
    window.scrollTo({ top, behavior: "smooth" });
  }
};

export const scrollToTop = (duration: number = 0.8) => {
  if (lenisInstance) {
    lenisInstance.scrollTo(0, { duration, easing: easeOutQuart });
  } else {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};
