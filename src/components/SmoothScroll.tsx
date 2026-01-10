import { useEffect, useRef } from "react";
import Lenis from "lenis";

const easingFunctions = {
  smooth: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
};

let lenisInstance: Lenis | null = null;

const shouldEnableLenis = () => {
  if (typeof window === "undefined") return false;
  if (window.location.pathname.startsWith("/admin")) return false;
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return false;
  // On touch / coarse pointer devices, Lenis can introduce noticeable input latency.
  if (window.matchMedia?.("(pointer: coarse)").matches) return false;
  return true;
};

export const SmoothScroll = () => {
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!shouldEnableLenis()) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: easingFunctions.smooth,
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      infinite: false,
      lerp: 0.08,
    });

    lenisInstance = lenis;

    const raf = (time: number) => {
      lenis.raf(time);
      rafIdRef.current = requestAnimationFrame(raf);
    };

    rafIdRef.current = requestAnimationFrame(raf);

    const handleAnchorClickCapture = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const anchor = (target?.closest?.("a") as HTMLAnchorElement | null) ?? null;
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || !href.startsWith("#") || href === "#") return;

      const element = document.querySelector(href);
      if (!element) return;

      e.preventDefault();

      const offset = 80;
      const top = element.getBoundingClientRect().top + window.scrollY - offset;

      lenis.scrollTo(top, { duration: 1.3, easing: easingFunctions.smooth });
    };

    document.addEventListener("click", handleAnchorClickCapture, true);

    // Ensure we start at top for the portfolio page
    lenis.scrollTo(0, { immediate: true });

    return () => {
      document.removeEventListener("click", handleAnchorClickCapture, true);
      if (rafIdRef.current != null) cancelAnimationFrame(rafIdRef.current);
      lenis.destroy();
      lenisInstance = null;
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
    lenisInstance.scrollTo(top, { duration: 1.3, easing: easingFunctions.smooth });
  } else {
    window.scrollTo({ top, behavior: "smooth" });
  }
};

export const scrollToTop = (duration: number = 1.2) => {
  if (lenisInstance) {
    lenisInstance.scrollTo(0, { duration, easing: easingFunctions.smooth });
  } else {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};
