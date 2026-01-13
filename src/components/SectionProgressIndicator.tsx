import { motion } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
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
  const [isReady, setIsReady] = useState(false);

  // Determine active section based on scroll position
  const updateActiveSection = useCallback(() => {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    
    // Check from bottom to top to find the current section
    for (let i = SECTIONS.length - 1; i >= 0; i--) {
      const section = SECTIONS[i];
      const element = document.getElementById(section.id);
      
      if (element) {
        const rect = element.getBoundingClientRect();
        const elementTop = rect.top + scrollY;
        
        // Section is active if we've scrolled past its top (with some offset)
        if (scrollY >= elementTop - windowHeight * 0.4) {
          if (activeSection !== section.id) {
            setActiveSection(section.id);
            setViewedSections(prev => {
              const newSet = new Set(prev);
              newSet.add(section.id);
              return newSet;
            });
          }
          break;
        }
      }
    }
    
    // Special case: at very top, always show hero
    if (scrollY < 100) {
      setActiveSection("hero");
    }
  }, [activeSection]);

  // Show/hide based on scroll position and track active section
  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 200);
      updateActiveSection();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Initial check
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, [updateActiveSection]);

  // Mark as ready after initial mount delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
      // Do initial section detection
      updateActiveSection();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [updateActiveSection]);

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

  // Calculate progress based on current active section index
  const activeIndex = SECTIONS.findIndex(s => s.id === activeSection);
  const lineProgress = activeIndex >= 0 ? ((activeIndex + 1) / SECTIONS.length) * 100 : 0;

  if (!isReady) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 20 }}
      transition={{ duration: 0.3 }}
      className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col items-center gap-1"
      style={{ pointerEvents: isVisible ? 'auto' : 'none' }}
    >
      {/* Progress bar background */}
      <div className="absolute left-1/2 -translate-x-1/2 w-0.5 h-full bg-border/40 rounded-full" />
      
      {/* Progress bar fill - based on sections viewed */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 w-1 bg-gradient-to-b from-primary via-primary to-primary/60 rounded-full origin-top"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: lineProgress / 100 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        style={{ height: "100%", marginLeft: "-1px" }}
      />

      {SECTIONS.map(({ id, name }) => {
        const isViewed = viewedSections.has(id);
        const isActive = activeSection === id;

        return (
          <motion.button
            key={id}
            onClick={() => scrollToSection(id)}
            onMouseEnter={handleHover}
            className="relative group py-2.5 px-2"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label={`Go to ${name} section`}
          >
            {/* Dot indicator */}
            <motion.div
              className={cn(
                "w-3 h-3 rounded-full border-2 transition-all duration-300 relative z-10",
                isActive
                  ? "bg-primary border-primary shadow-[0_0_12px_hsl(var(--primary)),0_0_24px_hsl(var(--primary)/0.4)]"
                  : isViewed
                  ? "bg-primary/70 border-primary/70 shadow-sm"
                  : "bg-muted border-muted-foreground/40 hover:border-muted-foreground/60"
              )}
              animate={isActive ? { 
                scale: [1, 1.2, 1],
                boxShadow: [
                  "0 0 12px hsl(var(--primary)), 0 0 24px hsl(var(--primary)/0.4)",
                  "0 0 16px hsl(var(--primary)), 0 0 32px hsl(var(--primary)/0.5)",
                  "0 0 12px hsl(var(--primary)), 0 0 24px hsl(var(--primary)/0.4)"
                ]
              } : {}}
              transition={{ duration: 1.5, repeat: isActive ? Infinity : 0, repeatDelay: 0.5 }}
            />

            {/* Tooltip */}
            <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none translate-x-2 group-hover:translate-x-0">
              <div className="px-3 py-1.5 rounded-lg bg-background/95 backdrop-blur-sm border border-border/50 shadow-lg whitespace-nowrap">
                <span className={cn(
                  "text-xs font-medium",
                  isActive ? "text-primary" : "text-foreground"
                )}>
                  {name}
                </span>
                {isViewed && !isActive && (
                  <span className="ml-1.5 text-[10px] text-green-500">✓</span>
                )}
              </div>
            </div>
          </motion.button>
        );
      })}

      {/* Progress percentage */}
      <motion.div
        className="mt-4 px-2.5 py-1.5 rounded-full bg-background/90 backdrop-blur-sm border border-border/40 shadow-md"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <span className="text-[10px] font-semibold text-muted-foreground">
          {viewedSections.size}/{SECTIONS.length}
        </span>
      </motion.div>
    </motion.div>
  );
};
