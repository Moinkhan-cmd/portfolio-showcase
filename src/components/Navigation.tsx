import { useEffect, useState, useCallback, useRef } from "react";
import { Menu, X, ArrowUpRight, Sparkles, Star, Github, Linkedin, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Certifications", href: "#certifications" },
  { name: "Experience", href: "#experience" },
  { name: "Contact", href: "#contact" },
] as const;

export const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Optimized scroll detection using IntersectionObserver
  useEffect(() => {
    // Create a sentinel element at the top of the page to detect scroll
    const sentinel = document.createElement("div");
    sentinel.style.position = "absolute";
    sentinel.style.top = "0";
    sentinel.style.left = "0";
    sentinel.style.width = "1px";
    sentinel.style.height = "1px";
    sentinel.style.pointerEvents = "none";
    sentinel.style.zIndex = "-1";
    document.body.appendChild(sentinel);

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsScrolled(!entry.isIntersecting);
        });
      },
      {
        root: null,
        rootMargin: "-50px 0px 0px 0px",
        threshold: 0,
      }
    );

    observerRef.current.observe(sentinel);

    // Fallback scroll listener (throttled) for better compatibility
    const handleScroll = () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        const scrollY = window.scrollY || document.documentElement.scrollTop;
        setIsScrolled(scrollY > 50);
      }, 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      if (sentinel.parentNode) {
        sentinel.parentNode.removeChild(sentinel);
      }
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Active section detection using IntersectionObserver
  useEffect(() => {
    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: "-30% 0px -50% 0px",
      threshold: 0.1,
    };

    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const sectionObserver = new IntersectionObserver(observerCallback, observerOptions);

    navLinks.forEach((link) => {
      const sectionId = link.href.substring(1);
      const element = document.getElementById(sectionId);
      if (element) {
        sectionObserver.observe(element);
      }
    });

    return () => {
      sectionObserver.disconnect();
    };
  }, []);

  // Smooth scroll to section
  const scrollToSection = useCallback((href: string) => {
    const element = document.querySelector(href);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
    setIsMobileMenuOpen(false);
  }, []);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <nav
      ref={navRef}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out",
        isScrolled ? "pt-3 pb-3" : "pt-4 pb-4"
      )}
    >
      <div
        className={cn(
          "mx-auto flex items-center justify-between transition-all duration-300 ease-out",
          isScrolled
            ? "w-[95%] max-w-6xl rounded-2xl px-4 py-3 md:px-6 bg-background/85 backdrop-blur-xl border border-border/20 shadow-lg"
            : "w-full max-w-7xl px-4 py-2 md:px-8 bg-transparent border-0 shadow-none"
        )}
      >
        {/* Logo Section with 3D Star Badge */}
        <motion.a
          href="#"
          className="relative flex items-center gap-2 group shrink-0"
          onMouseEnter={() => setIsLogoHovered(true)}
          onMouseLeave={() => setIsLogoHovered(false)}
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          aria-label="Go to top"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Logo Container with Enhanced Hover */}
          <motion.div
            className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 group-hover:bg-primary/20 transition-colors"
            whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
            transition={{ duration: 0.5 }}
          >
            <span className="font-signature font-bold text-xl relative z-10">M</span>
            {/* Glow effect on hover */}
            <motion.div
              className="absolute inset-0 rounded-xl bg-primary/30 blur-md -z-10"
              animate={{ opacity: isLogoHovered ? 0.6 : 0, scale: isLogoHovered ? 1.5 : 1 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>

          {/* Logo Text */}
          <span
            className={cn(
              "font-display font-bold text-lg tracking-tight transition-opacity duration-300 relative",
              isScrolled ? "hidden sm:block opacity-100" : "block opacity-100"
            )}
          >
            Moin<span className="text-primary">.dev</span>
            {/* Underline animation on hover */}
            <motion.div
              className="absolute bottom-0 left-0 h-0.5 bg-primary"
              initial={{ width: 0 }}
              animate={{ width: isLogoHovered ? "100%" : 0 }}
              transition={{ duration: 0.3 }}
            />
          </span>

          {/* 3D Star Badge - Appears on Hover */}
          <AnimatePresence>
            {isLogoHovered && (
              <motion.div
                initial={{ opacity: 0, scale: 0, rotate: -180, x: -20, y: -20 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  rotate: 0,
                  x: 0,
                  y: 0,
                }}
                exit={{ opacity: 0, scale: 0, rotate: 180 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                  duration: 0.4
                }}
                className="absolute -top-2 -right-2 z-50"
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Star Badge Container */}
                <motion.div
                  className="relative"
                  animate={{
                    rotateY: [0, 360],
                    rotateX: [0, 15, -15, 0],
                  }}
                  transition={{
                    rotateY: { duration: 3, repeat: Infinity, ease: "linear" },
                    rotateX: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                  }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Star Icon */}
                  <div className="relative w-8 h-8 flex items-center justify-center">
                    <Star className="w-6 h-6 text-primary fill-primary drop-shadow-[0_0_12px_hsl(175_80%_50%)]" />
                    {/* Glowing rings */}
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-primary/50"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 0, 0.5]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <motion.div
                      className="absolute inset-0 rounded-full border border-primary/30"
                      animate={{
                        scale: [1, 1.8, 1],
                        opacity: [0.3, 0, 0.3]
                      }}
                      transition={{ duration: 2.5, repeat: Infinity, delay: 0.3 }}
                    />
                    {/* Sparkle particles */}
                    {[...Array(4)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-primary rounded-full"
                        style={{
                          top: "50%",
                          left: "50%",
                        }}
                        animate={{
                          x: [0, Math.cos((i * Math.PI) / 2) * 20],
                          y: [0, Math.sin((i * Math.PI) / 2) * 20],
                          opacity: [0, 1, 0],
                          scale: [0, 1, 0],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                      />
                    ))}
                  </div>
                  {/* Badge background glow */}
                  <motion.div
                    className="absolute inset-0 bg-primary/20 rounded-full blur-xl -z-10"
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.4, 0.6, 0.4]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.substring(1);
            return (
              <motion.button
                key={link.name}
                onClick={() => scrollToSection(link.href)}
                className={cn(
                  "relative px-4 py-2 text-sm font-medium transition-all duration-200 rounded-full overflow-hidden group/nav",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  isActive
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50 dark:hover:bg-white/5"
                )}
                aria-current={isActive ? "page" : undefined}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Shimmer effect on hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/nav:translate-x-full"
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                />

                {isActive && (
                  <motion.div
                    className="absolute inset-0 bg-primary/20 rounded-full blur-md -z-10"
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}

                <span className="relative z-10">
                  {link.name}
                </span>

                <motion.div
                  className="absolute bottom-0 left-1/2 h-0.5 bg-primary rounded-full"
                  initial={{ width: 0, x: "-50%" }}
                  animate={{
                    width: isActive ? "80%" : "0%",
                    x: "-50%"
                  }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="hero"
              size={isScrolled ? "sm" : "default"}
              onClick={() => scrollToSection("#contact")}
              className={cn(
                "rounded-full font-semibold shadow-md transition-all duration-200 gap-2 relative overflow-hidden group/cta",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                isScrolled ? "px-5" : "px-6"
              )}
              aria-label="Let's Talk - Contact me"
            >
              {/* Animated gradient shimmer */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              />

              {/* Glow effect on hover */}
              <motion.div
                className="absolute inset-0 bg-primary/40 rounded-full blur-xl opacity-0 group-hover/cta:opacity-100 -z-10"
                transition={{ duration: 0.3 }}
              />

              <span className="relative z-10 flex items-center gap-2">
                Let's Talk
                <motion.span
                  animate={{ x: [0, 4, 0], y: [0, -4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ArrowUpRight className="w-4 h-4" />
                </motion.span>
              </span>
            </Button>
          </motion.div>

          {/* Mobile Menu Toggle with Enhanced Hover */}
          <motion.button
            className="md:hidden p-2 text-foreground hover:bg-secondary/50 dark:hover:bg-white/5 rounded-lg transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center relative overflow-hidden group/menu"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
          >
            {/* Ripple effect on hover */}
            <motion.div
              className="absolute inset-0 bg-primary/20 rounded-lg"
              initial={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.5, opacity: [0, 0.5, 0] }}
              transition={{ duration: 0.6 }}
            />
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-6 h-6 relative z-10" aria-hidden="true" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="w-6 h-6 relative z-10" aria-hidden="true" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="md:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />
          {/* Menu Panel */}
          <div
            className={cn(
              "md:hidden absolute left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-border/50 shadow-2xl",
              "animate-in slide-in-from-top-2 duration-200"
            )}
            style={{
              top: "100%",
            }}
          >
            <div className="mx-auto max-w-7xl px-4 py-6 flex flex-col gap-2">
              {navLinks.map((link) => {
                const isActive = activeSection === link.href.substring(1);
                return (
                  <button
                    key={link.name}
                    onClick={() => scrollToSection(link.href)}
                    className={cn(
                      "w-full text-left px-4 py-3 rounded-xl font-medium transition-all duration-200",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                      "touch-manipulation min-h-[44px]",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-secondary/50 dark:hover:bg-white/5 hover:text-foreground active:bg-secondary/70"
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {link.name}
                  </button>
                );
              })}
              <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between px-2">
                <span className="text-sm text-muted-foreground">Theme</span>
                <ThemeToggle />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-auto"
              >
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <h4 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">Connect</h4>
                  <div className="flex items-center gap-6">
                    <a href="#" className="p-3 rounded-full bg-white/5 text-foreground hover:bg-primary/20 hover:text-primary transition-colors">
                      <Github className="w-6 h-6" />
                    </a>
                    <a href="#" className="p-3 rounded-full bg-white/5 text-foreground hover:bg-primary/20 hover:text-primary transition-colors">
                      <Linkedin className="w-6 h-6" />
                    </a>
                    <a href="#" className="p-3 rounded-full bg-white/5 text-foreground hover:bg-primary/20 hover:text-primary transition-colors">
                      <Mail className="w-6 h-6" />
                    </a>
                  </div>
                  <Button
                    className="w-full mt-6 rounded-xl font-bold py-6 text-lg"
                    onClick={() => scrollToSection("#contact")}
                  >
                    Let's Talk
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </nav>
  );
};
