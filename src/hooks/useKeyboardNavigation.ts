import { useEffect, useCallback, useState } from "react";
import { scrollToSection } from "@/components/SmoothScroll";
import { getDeviceFlags } from "@/lib/device";

const SECTIONS = [
  { id: "hero", key: "0" },
  { id: "about", key: "1" },
  { id: "skills", key: "2" },
  { id: "projects", key: "3" },
  { id: "experience", key: "4" },
  { id: "certifications", key: "5" },
  { id: "contact", key: "6" },
];

export const useKeyboardNavigation = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const navigateToSection = useCallback((index: number) => {
    const section = SECTIONS[index];
    if (!section) return;

    if (typeof window === "undefined") return;
    if (getDeviceFlags().isRealMobile) return;

    setCurrentIndex(index);
    
    // Dispatch custom event for audio feedback
    try {
      window.dispatchEvent(
        new CustomEvent("sectionNavigate", {
          detail: { sectionId: section.id },
        })
      );
    } catch {
      // ignore
    }
    
    if (section.id === "hero") {
      try {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch {
        window.scrollTo(0, 0);
      }
    } else {
      try {
        scrollToSection(`#${section.id}`, 80);
      } catch {
        // ignore
      }
    }
  }, []);

  const navigateNext = useCallback(() => {
    const nextIndex = Math.min(currentIndex + 1, SECTIONS.length - 1);
    navigateToSection(nextIndex);
  }, [currentIndex, navigateToSection]);

  const navigatePrev = useCallback(() => {
    const prevIndex = Math.max(currentIndex - 1, 0);
    navigateToSection(prevIndex);
  }, [currentIndex, navigateToSection]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (getDeviceFlags().isRealMobile) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement).isContentEditable
      ) {
        return;
      }

      // Arrow keys navigation
      if (e.key === "ArrowDown" || e.key === "j") {
        e.preventDefault();
        navigateNext();
        return;
      }

      if (e.key === "ArrowUp" || e.key === "k") {
        e.preventDefault();
        navigatePrev();
        return;
      }

      // Home/End keys
      if (e.key === "Home") {
        e.preventDefault();
        navigateToSection(0);
        return;
      }

      if (e.key === "End") {
        e.preventDefault();
        navigateToSection(SECTIONS.length - 1);
        return;
      }

      // Number keys (0-6)
      const numKey = parseInt(e.key);
      if (!isNaN(numKey) && numKey >= 0 && numKey <= 6) {
        e.preventDefault();
        navigateToSection(numKey);
        return;
      }

      // Show hint with ?
      if (e.key === "?") {
        e.preventDefault();
        setShowHint((prev) => !prev);
      }
    };

    try {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    } catch {
      return;
    }
  }, [navigateNext, navigatePrev, navigateToSection]);

  // Update current index based on scroll position
  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return;
    if (getDeviceFlags().isRealMobile) return;
    if (typeof IntersectionObserver === "undefined") return;

    let observer: IntersectionObserver | null = null;

    try {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const index = SECTIONS.findIndex((s) => s.id === entry.target.id);
              if (index !== -1) {
                setCurrentIndex(index);
              }
            }
          });
        },
        { rootMargin: "-40% 0px -40% 0px", threshold: 0.1 }
      );
    } catch (error) {
      console.warn("useKeyboardNavigation: IntersectionObserver init failed", error);
      return;
    }

    if (!observer) return;

    SECTIONS.forEach(({ id }) => {
      if (id === "hero") return;
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer?.disconnect();
  }, []);

  return { currentIndex, showHint, setShowHint };
};
