import { useState, useEffect, useCallback } from "react";

const SECTION_IDS = ["about", "skills", "projects", "experience", "certifications", "contact"];

export const useActiveSection = () => {
  const [activeSection, setActiveSection] = useState<string>("");
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
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
        threshold: [0.1, 0.3, 0.5] 
      }
    );

    SECTION_IDS.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
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
