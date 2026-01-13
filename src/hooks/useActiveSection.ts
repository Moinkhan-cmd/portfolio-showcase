import { useState, useEffect, useCallback } from "react";
import { getDeviceFlags } from "@/lib/device";

const SECTION_IDS = ["about", "skills", "projects", "experience", "certifications", "contact"];

export const useActiveSection = () => {
  const [activeSection, setActiveSection] = useState<string>("");
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return;
    if (getDeviceFlags().isRealMobile) return;
    if (typeof IntersectionObserver === "undefined") return;

    try {
      const observer = new IntersectionObserver(
        (entries) => {
          if (isNavigating) return;

          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.1) {
              setActiveSection(entry.target.id);
            }
          });
        },
        {
          rootMargin: "-30% 0px -50% 0px",
          threshold: [0.1, 0.3, 0.5],
        }
      );

      SECTION_IDS.forEach((id) => {
        const element = document.getElementById(id);
        if (element) observer.observe(element);
      });

      return () => observer.disconnect();
    } catch (error) {
      console.warn("useActiveSection: IntersectionObserver init failed", error);
      return;
    }
  }, [isNavigating]);

  const navigateToSection = useCallback((sectionId: string) => {
    setIsNavigating(true);
    setActiveSection(sectionId);
    
    // Reset navigation lock after scroll animation completes
    setTimeout(() => {
      setIsNavigating(false);
    }, 1000);
  }, []);

  return { activeSection, navigateToSection, isNavigating };
};
