import { useEffect, useState, useRef } from "react";
import { Menu, X, Rocket, Github, Linkedin, Mail, ArrowUpRight } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { motion, AnimatePresence, useScroll, useMotionValueEvent, useSpring, useTransform, useMotionTemplate, useMotionValue } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "About", href: "#about", icon: "👤" },
  { name: "Skills", href: "#skills", icon: "⚡" },
  { name: "Projects", href: "#projects", icon: "🚀" },
  { name: "Certifications", href: "#certifications", icon: "🏆" },
  { name: "Experience", href: "#experience", icon: "💼" },
  { name: "Contact", href: "#contact", icon: "📧" },
] as const;

export const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const { scrollY } = useScroll();
  const navRef = useRef<HTMLDivElement>(null);

  // Spotlight effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const radius = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!navRef.current) return;
    const bounds = navRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - bounds.left);
    mouseY.set(e.clientY - bounds.top);
    radius.set(200); // Spotlight radius
  };

  const handleMouseLeave = () => {
    radius.set(0);
  };

  const background = useMotionTemplate`radial-gradient(
    ${radius}px circle at ${mouseX}px ${mouseY}px,
    var(--spotlight-color),
    transparent 80%
  )`;

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 20);
  });

  useEffect(() => {
    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: "-40% 0px -40% 0px",
      threshold: 0.3,
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    navLinks.forEach((link) => {
      const sectionId = link.href.substring(1);
      const element = document.getElementById(sectionId);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed z-50 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${isScrolled
            ? "top-4 left-1/2 -translate-x-1/2"
            : "top-0 left-0 w-full"
          }`}
        style={
          {
            "--spotlight-color": "hsl(var(--primary) / 0.15)"
          } as React.CSSProperties
        }
      >
        <motion.div
          ref={navRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          layout
          className={cn(
            "relative group isolate",
            isScrolled
              ? "rounded-full"
              : "w-full"
          )}
        >
          {/* Main Container / Boat */}
          <div
            className={cn(
              "relative flex items-center transition-all duration-500",
              isScrolled
                ? "rounded-full glass-card bg-black/40 backdrop-blur-2xl backdrop-saturate-150 border-t border-white/10 border-b border-black/20 shadow-glow px-3 py-2"
                : "w-full bg-transparent py-6 px-6 md:px-12 backdrop-blur-none border-none shadow-none"
            )}
          >
            {/* Spotlight Overlay (Only visible when scrolled and hovering) */}
            {isScrolled && (
              <motion.div
                className="absolute inset-0 rounded-full opacity-100 pointer-events-none -z-10 transition-opacity duration-300"
                style={{ background }}
              />
            )}

            {/* Inner Layout */}
            <div className={cn(
              "flex items-center justify-between w-full gap-4 md:gap-12",
              !isScrolled && "container mx-auto max-w-7xl"
            )}>

              {/* Logo */}
              <a
                href="#"
                className="relative group shrink-0 flex items-center gap-2"
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                <div className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 group-hover:border-primary/50 transition-colors overflow-hidden">
                  <span className="font-signature font-bold text-xl text-primary relative z-10">M</span>
                  <motion.div
                    className="absolute inset-0 bg-primary/20 blur-md"
                    animate={{ opacity: [0, 0.5, 0], scale: [0.8, 1.2, 0.8] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                </div>
                <span className={cn(
                  "font-display font-bold text-lg tracking-tight transition-all duration-300",
                  isScrolled ? "w-0 opacity-0 overflow-hidden" : "w-auto opacity-100"
                )}>
                  Moin<span className="text-primary">.dev</span>
                </span>
              </a>

              {/* Desktop Nav Links */}
              <div className="hidden md:flex items-center gap-1">
                {navLinks.map((link) => (
                  <button
                    key={link.name}
                    onClick={() => scrollToSection(link.href)}
                    onMouseEnter={() => setHoveredLink(link.name)}
                    onMouseLeave={() => setHoveredLink(null)}
                    className={cn(
                      "relative px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-full group/link",
                      isScrolled ? "text-muted-foreground hover:text-foreground" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {link.name}
                      {/* Subtle indicator for active state */}
                      {activeSection === link.href.substring(1) && (
                        <motion.span
                          layoutId="active-dot"
                          className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary))]"
                        />
                      )}
                    </span>

                    {/* Hover Background */}
                    {hoveredLink === link.name && (
                      <motion.div
                        layoutId="nav-hover"
                        className="absolute inset-0 rounded-full bg-white/5 border border-white/5"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* CTA & Actions */}
              <div className="flex items-center gap-3">
                {!isScrolled && (
                  <div className="hidden md:flex">
                    <ThemeToggle />
                  </div>
                )}

                <Button
                  variant={isScrolled ? "default" : "hero"}
                  size={isScrolled ? "sm" : "default"}
                  onClick={() => scrollToSection("#contact")}
                  className={cn(
                    "relative rounded-full font-semibold shadow-lg shadow-primary/20 transition-all duration-300",
                    isScrolled ? "px-5 h-9 text-xs" : "px-6"
                  )}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Let's Talk
                    <ArrowUpRight className="w-4 h-4" />
                  </span>

                  {/* Button Shine Effect */}
                  <div className="absolute inset-0 rounded-full overflow-hidden">
                    <div className="absolute top-0 left-[-100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg] animate-[shimmer_3s_infinite]" />
                  </div>
                </Button>

                {/* Mobile Menu Toggle */}
                <button
                  className="md:hidden p-2 text-foreground relative z-50"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? <X /> : <Menu />}
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-background/80 backdrop-blur-xl md:hidden flex flex-col pt-24 px-6"
            >
              <div className="flex flex-col gap-4">
                {navLinks.map((link, i) => (
                  <motion.button
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => scrollToSection(link.href)}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-2xl border border-white/5 bg-white/5 text-lg font-medium",
                      activeSection === link.href.substring(1) && "border-primary/50 bg-primary/10 text-primary"
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-2xl">{link.icon}</span>
                      {link.name}
                    </span>
                    <ArrowUpRight className={cn(
                      "w-5 h-5 transition-transform",
                      activeSection === link.href.substring(1) ? "rotate-45 text-primary" : "text-muted-foreground"
                    )} />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};
