import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { playNavigationSound, playHoverSound, initSoundSystem } from "@/lib/sounds";

const SECTIONS = [
  { id: "hero", name: "Home" },
  { id: "about", name: "About" },
  { id: "skills", name: "Skills" },
  { id: "projects", name: "Projects" },
  { id: "experience", name: "Experience" },
  { id: "certifications", name: "Certifications" },
  { id: "contact", name: "Contact" },
];

export const SectionProgressIndicator = () => {
  const [viewedSections, setViewedSections] = useState<Set<string>>(new Set(["hero"]));
  const [activeSection, setActiveSection] = useState("hero");
  const [isVisible, setIsVisible] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Show/hide based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Observe sections for active tracking
  useEffect(() => {
    // Small delay to ensure DOM is ready (especially for lazy-loaded sections)
    const timeoutId = setTimeout(() => {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          // Find the most visible section
          let maxRatio = 0;
          let mostVisibleSection = activeSection;
          
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
              maxRatio = entry.intersectionRatio;
              mostVisibleSection = entry.target.id || "hero";
            }
          });
          
          if (maxRatio > 0) {
            setActiveSection(mostVisibleSection);
            setViewedSections((prev) => new Set([...prev, mostVisibleSection]));
          }
        },
        { 
          rootMargin: "-20% 0px -20% 0px", 
          threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] 
        }
      );

      // Observe all sections by ID
      SECTIONS.forEach(({ id }) => {
        const element = document.getElementById(id);
        if (element && observerRef.current) {
          observerRef.current.observe(element);
        }
      });
    }, 500);

    return () => {
      clearTimeout(timeoutId);
      observerRef.current?.disconnect();
    };
  }, []);

  // Also track scroll position for hero section (when at top)
  useEffect(() => {
    const handleScrollForHero = () => {
      if (window.scrollY < 200) {
        setActiveSection("hero");
      }
    };

    window.addEventListener("scroll", handleScrollForHero, { passive: true });
    return () => window.removeEventListener("scroll", handleScrollForHero);
  }, []);

  const scrollToSection = (sectionId: string) => {
    initSoundSystem();
    playNavigationSound();
    
    if (sectionId === "hero") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const handleHover = () => {
    initSoundSystem();
    playHoverSound();
  };

  const progress = (viewedSections.size / SECTIONS.length) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 20 }}
      transition={{ duration: 0.3 }}
      className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-1"
    >
      {/* Progress bar background */}
      <div className="absolute left-1/2 -translate-x-1/2 w-0.5 h-full bg-border/30 rounded-full" />
      
      {/* Progress bar fill */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 w-0.5 bg-gradient-to-b from-primary to-primary/50 rounded-full origin-top"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: progress / 100 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{ height: "100%" }}
      />

      {SECTIONS.map(({ id, name }) => {
        const isViewed = viewedSections.has(id);
        const isActive = activeSection === id;

        return (
          <motion.button
            key={id}
            onClick={() => scrollToSection(id)}
            onMouseEnter={handleHover}
            className="relative group py-2"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label={`Go to ${name} section`}
          >
            {/* Dot indicator */}
            <motion.div
              className={cn(
                "w-2.5 h-2.5 rounded-full border-2 transition-all duration-300 relative z-10",
                isActive
                  ? "bg-primary border-primary scale-125 shadow-[0_0_10px_hsl(var(--primary))]"
                  : isViewed
                  ? "bg-primary/60 border-primary/60"
                  : "bg-background border-muted-foreground/30"
              )}
              animate={isActive ? { scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 0.5, repeat: isActive ? Infinity : 0, repeatDelay: 2 }}
            />

            {/* Tooltip */}
            <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              <div className="px-3 py-1.5 rounded-lg bg-background/95 backdrop-blur-sm border border-border/50 shadow-lg whitespace-nowrap">
                <span className={cn(
                  "text-xs font-medium",
                  isActive ? "text-primary" : "text-foreground"
                )}>
                  {name}
                </span>
                {isViewed && !isActive && (
                  <span className="ml-1.5 text-[10px] text-muted-foreground">✓</span>
                )}
              </div>
            </div>
          </motion.button>
        );
      })}

      {/* Progress percentage */}
      <motion.div
        className="mt-3 px-2 py-1 rounded-full bg-background/80 backdrop-blur-sm border border-border/30 shadow-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <span className="text-[10px] font-medium text-muted-foreground">
          {Math.round(progress)}%
        </span>
      </motion.div>
    </motion.div>
  );
};
