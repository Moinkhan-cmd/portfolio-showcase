import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(isTouchDevice || isMobileUA);
    };
    checkMobile();
  }, []);
  
  return isMobile;
};

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
  const isMobile = useIsMobile();

  // Don't render on mobile
  if (isMobile) return null;

  // Show/hide based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Initial check
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Observe sections for active tracking using IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id || "hero";
            setActiveSection(sectionId);
            setViewedSections((prev) => new Set([...prev, sectionId]));
          }
        });
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: 0.1 }
    );

    // Observe hero section (main element or first section)
    const heroElement = document.querySelector("main > div.relative > section:first-of-type") || 
                        document.getElementById("hero");
    if (heroElement) {
      observer.observe(heroElement);
    }

    SECTIONS.slice(1).forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  // Track scroll position for hero section (when at top)
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

  // Calculate progress based on current active section index
  const activeIndex = SECTIONS.findIndex(s => s.id === activeSection);
  const lineProgress = activeIndex >= 0 ? ((activeIndex + 1) / SECTIONS.length) * 100 : 0;

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
