import { useEffect, useState, useRef } from "react";
import { Menu, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { AnimatedLogo } from "./AnimatedLogo";
import { EnhancedNavLink } from "./EnhancedNavLink";

const navLinks = [
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Experience", href: "#experience" },
  { name: "Certifications", href: "#certifications" },
  { name: "Contact", href: "#contact" },
] as const;

// NavLink replaced with EnhancedNavLink component

export const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const navRef = useRef<HTMLElement>(null);
  const { scrollYProgress, scrollY } = useScroll();
  
  // Advanced scroll-based transforms
  const navY = useTransform(scrollY, [0, 100], [0, -100], { clamp: false });
  const navScale = useTransform(scrollY, [0, 100], [1, 0.9], { clamp: true });
  const navOpacity = useTransform(scrollY, [0, 50, 100], [1, 0.95, 0.85], { clamp: true });
  const navBlur = useTransform(scrollY, [0, 100], [0, 15], { clamp: true });
  const borderOpacity = useTransform(scrollY, [0, 50], [0, 1], { clamp: true });
  const shadowIntensity = useTransform(scrollY, [0, 100], [0, 0.3], { clamp: true });

  // Hide/show navbar on scroll
  useMotionValueEvent(scrollY, "change", (latest) => {
    const current = latest;
    const previous = lastScrollY;
    
    if (current < previous && current > 100) {
      // Scrolling up - show navbar
      setIsVisible(true);
    } else if (current > previous && current > 100) {
      // Scrolling down - hide navbar
      setIsVisible(false);
    } else if (current < 50) {
      // Near top - always show
      setIsVisible(true);
    }
    
    setLastScrollY(current);
    setIsScrolled(current > 50);
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
      rootMargin: "-40% 0px -55% 0px",
      threshold: [0, 0.1, 0.5],
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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Enhanced Scroll Progress Bar with gradient */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] z-[9998] origin-left"
        style={{ 
          scaleX: scrollYProgress,
          willChange: 'transform',
          backfaceVisibility: 'hidden',
          transform: 'translateZ(0)',
        }}
      >
        <div className="h-full w-full bg-gradient-to-r from-transparent via-primary via-cyan-400 via-purple-500 to-transparent opacity-80" />
        <motion.div
          className="absolute top-0 right-0 h-full w-32 bg-gradient-to-l from-primary to-transparent"
          animate={{
            x: ["-100%", "200%"],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </motion.div>

      {/* Animated background particles effect */}
      <motion.div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isScrolled ? 0.3 : 0.1 }}
        transition={{ duration: 0.5 }}
        aria-hidden="true"
      >
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary rounded-full"
            style={{
              left: `${15 + i * 15}%`,
              top: "50%",
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>

      <motion.nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-[9999] will-change-transform"
        style={{ 
          y: isVisible ? 0 : navY,
          scale: navScale,
          opacity: isVisible ? navOpacity : 0,
          filter: `blur(${navBlur.get()}px)`,
          transform: 'translateZ(0)',
        }}
        animate={{
          y: isVisible ? 0 : -100,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
          mass: 0.8,
        }}
      >
        {/* Glassmorphism background with gradient */}
        <motion.div
          className="absolute inset-0 backdrop-blur-xl"
          style={{
            background: isScrolled
              ? "linear-gradient(135deg, hsl(var(--background) / 0.9) 0%, hsl(var(--background) / 0.85) 100%)"
              : "linear-gradient(135deg, hsl(var(--background) / 0.7) 0%, hsl(var(--background) / 0.5) 100%)",
            boxShadow: `0 8px 32px 0 rgba(0, 0, 0, ${shadowIntensity.get()})`,
          }}
          animate={{
            background: isScrolled
              ? "linear-gradient(135deg, hsl(var(--background) / 0.95) 0%, hsl(var(--background) / 0.9) 100%)"
              : "linear-gradient(135deg, hsl(var(--background) / 0.8) 0%, hsl(var(--background) / 0.6) 100%)",
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Animated gradient border */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[1px]"
          style={{
            opacity: borderOpacity,
            background: "linear-gradient(90deg, transparent 0%, hsl(var(--primary) / 0.5) 20%, hsl(var(--primary)) 50%, hsl(var(--primary) / 0.5) 80%, transparent 100%)",
          }}
        />

        {/* Top shimmer border */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 via-cyan-400/50 via-purple-500/50 to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: isScrolled ? 0.6 : 0.3 }}
          transition={{ duration: 0.3 }}
          aria-hidden="true"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{
              x: ["-100%", "200%"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </motion.div>

        {/* Glowing accent line */}
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent blur-sm"
          animate={{
            opacity: [0.3, 0.8, 0.3],
            scaleX: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <div className={`relative transition-all duration-300 ${
          isScrolled || isMobileMenuOpen
            ? "py-2 sm:py-3"
            : "py-4 sm:py-5"
        }`}>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="flex items-center justify-between gap-2 sm:gap-4 min-h-[44px]">
              {/* Enhanced Logo with modern effects */}
              <motion.a
                href="#"
                className="font-signature text-lg sm:text-xl md:text-2xl lg:text-3xl text-foreground relative group flex items-center gap-1.5 sm:gap-2 min-w-0 flex-shrink-0"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToTop();
                }}
                whileHover={{ scale: 1.08, y: -2, rotate: [0, -2, 2, 0] }}
                whileTap={{ scale: 0.92 }}
                whileFocus={{ 
                  outline: "2px solid hsl(var(--primary))", 
                  outlineOffset: "4px", 
                  borderRadius: "12px",
                  boxShadow: "0 0 20px hsl(var(--primary) / 0.5)"
                }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                {/* Animated background glow */}
                <motion.div
                  className="absolute inset-0 -inset-x-2 -inset-y-1 rounded-xl bg-gradient-to-r from-primary/20 via-cyan-400/20 to-purple-500/20 opacity-0 blur-xl"
                  whileHover={{ opacity: 1, scale: 1.2 }}
                  transition={{ duration: 0.3 }}
                />

                {/* Sparkle/Star effect with enhanced glow */}
                <motion.span
                  className="relative flex-shrink-0 z-10"
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{ 
                    rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                    scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                  }}
                  whileHover={{ 
                    rotate: [0, 360], 
                    scale: 1.4,
                    filter: "brightness(1.5)",
                  }}
                >
                  <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-primary drop-shadow-lg" />
                  
                  {/* Multi-layer glow around sparkle */}
                  <motion.span
                    className="absolute inset-0 bg-primary/50 rounded-full blur-md -z-10"
                    animate={{
                      opacity: [0.4, 0.8, 0.4],
                      scale: [1, 1.4, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  <motion.span
                    className="absolute inset-0 bg-cyan-400/30 rounded-full blur-lg -z-20"
                    animate={{
                      opacity: [0.2, 0.5, 0.2],
                      scale: [1.2, 1.6, 1.2],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.3,
                    }}
                  />
                </motion.span>

                <motion.span 
                  className="relative z-10 italic font-light tracking-wider gradient-text truncate"
                  whileHover={{ 
                    scale: 1.03,
                    textShadow: "0 0 20px hsl(var(--primary) / 0.5)",
                  }}
                  transition={{ duration: 0.2 }}
                >
                  Moinkhan
                </motion.span>
                
                {/* Enhanced animated underline with gradient */}
                <motion.span
                  className="absolute -bottom-1 left-0 h-[2px] rounded-full"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <motion.div
                    className="h-full w-full bg-gradient-to-r from-primary via-cyan-400 to-purple-500"
                    style={{
                      boxShadow: "0 0 10px hsl(var(--primary) / 0.6), 0 0 20px hsl(var(--primary) / 0.3)",
                    }}
                    animate={{
                      backgroundPosition: ["0%", "100%"],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                </motion.span>

                {/* Enhanced shimmer effect on hover */}
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 via-primary/20 to-transparent -z-10 rounded-lg"
                  initial={{ x: "-100%", skewX: -15 }}
                  whileHover={{ x: "200%", skewX: -15 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                />

                {/* Pulsing ring effect */}
                <motion.span
                  className="absolute inset-0 rounded-xl border-2 border-primary/30 -z-10"
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  whileHover={{
                    scale: 1.15,
                    opacity: 1,
                  }}
                />
              </motion.a>

              {/* Desktop Navigation with enhanced effects */}
              <nav className="hidden lg:flex items-center flex-1 justify-end min-w-0">
                <ul className="flex items-center gap-0.5 xl:gap-1 flex-wrap justify-end">
                  {navLinks.map((link, index) => (
                    <EnhancedNavLink 
                      key={link.name}
                      link={link}
                      isActive={activeSection === link.href.substring(1)}
                      onClick={() => scrollToSection(link.href)}
                      index={index}
                    />
                  ))}
                </ul>

                {/* Right side actions with enhanced effects */}
                <div className="flex items-center gap-2 xl:gap-3 ml-4 xl:ml-8 flex-shrink-0">
                  {/* Enhanced Theme Toggle */}
                  <motion.div
                    className="relative"
                    whileHover={{ 
                      scale: 1.15, 
                      rotate: [0, -10, 10, -10, 0],
                      y: -2,
                    }}
                    whileTap={{ scale: 0.85 }}
                    whileFocus={{ 
                      outline: "2px solid hsl(var(--primary))", 
                      outlineOffset: "3px", 
                      borderRadius: "50%",
                      boxShadow: "0 0 15px hsl(var(--primary) / 0.5)"
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  >
                    {/* Glow ring on hover */}
                    <motion.div
                      className="absolute inset-0 rounded-full bg-primary/20 blur-md opacity-0"
                      whileHover={{ opacity: 1, scale: 1.5 }}
                      transition={{ duration: 0.3 }}
                    />
                    <div className="relative z-10">
                      <ThemeToggle />
                    </div>
                  </motion.div>

                  {/* Enhanced Hire Me Button */}
                  <motion.div
                    whileHover={{ scale: 1.08, y: -3 }}
                    whileTap={{ scale: 0.92 }}
                    whileFocus={{ 
                      scale: 1.08, 
                      outline: "2px solid hsl(var(--primary))", 
                      outlineOffset: "3px", 
                      borderRadius: "12px",
                      boxShadow: "0 0 25px hsl(var(--primary) / 0.6)"
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Button
                      variant="hero"
                      size="sm"
                      onClick={() => scrollToSection("#contact")}
                      className="relative overflow-hidden group border border-primary/20"
                    >
                      {/* Enhanced shimmer effect */}
                      <motion.span
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 via-primary/20 to-transparent"
                        animate={{
                          x: ["-100%", "200%"],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear",
                          repeatDelay: 1,
                        }}
                      />

                      {/* Multi-layer glow on hover */}
                      <motion.span
                        className="absolute inset-0 bg-primary/40 rounded-lg blur-xl -z-10 opacity-0"
                        whileHover={{ opacity: 1, scale: 1.3 }}
                        transition={{ duration: 0.4 }}
                      />
                      <motion.span
                        className="absolute inset-0 bg-cyan-400/30 rounded-lg blur-lg -z-20 opacity-0"
                        whileHover={{ opacity: 1, scale: 1.2 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                      />

                      {/* Pulsing border */}
                      <motion.span
                        className="absolute inset-0 rounded-lg border-2 border-primary/50"
                        animate={{
                          opacity: [0.5, 1, 0.5],
                          scale: [1, 1.02, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        whileHover={{
                          opacity: 1,
                          borderColor: "hsl(var(--primary))",
                        }}
                      />

                      <span className="relative z-10 font-semibold tracking-wide">Hire Me</span>
                    </Button>
                  </motion.div>
                </div>
              </nav>

              {/* Enhanced Mobile/Tablet Menu Button */}
              <div className="flex items-center gap-2 sm:gap-3 lg:hidden flex-shrink-0">
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 15 }}
                  whileTap={{ scale: 0.85 }}
                  whileFocus={{ 
                    outline: "2px solid hsl(var(--primary))", 
                    outlineOffset: "2px", 
                    borderRadius: "50%",
                    boxShadow: "0 0 15px hsl(var(--primary) / 0.5)"
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                  <ThemeToggle />
                </motion.div>
                <motion.button
                  className="text-foreground p-2.5 rounded-xl hover:bg-primary/10 active:bg-primary/20 transition-all duration-200 relative group touch-manipulation border border-transparent hover:border-primary/30"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsMobileMenuOpen((v) => !v);
                  }}
                  aria-label="Toggle menu"
                  aria-expanded={isMobileMenuOpen}
                  type="button"
                  whileHover={{ 
                    scale: 1.1, 
                    rotate: [0, -5, 5, 0],
                    boxShadow: "0 0 20px hsl(var(--primary) / 0.3)"
                  }}
                  whileTap={{ scale: 0.9 }}
                  whileFocus={{ 
                    outline: "2px solid hsl(var(--primary))", 
                    outlineOffset: "3px",
                    borderRadius: "12px",
                    boxShadow: "0 0 25px hsl(var(--primary) / 0.5)"
                  }}
                  style={{ WebkitTapHighlightColor: "transparent" }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  {/* Enhanced ripple effect */}
                  <motion.span
                    className="absolute inset-0 bg-primary/30 rounded-xl"
                    initial={{ scale: 0, opacity: 0.6 }}
                    whileTap={{ scale: 2.5, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  />

                  {/* Glow effect on hover */}
                  <motion.span
                    className="absolute inset-0 bg-primary/20 rounded-xl blur-md opacity-0"
                    whileHover={{ opacity: 1, scale: 1.3 }}
                    transition={{ duration: 0.3 }}
                  />

                  {/* Shimmer effect */}
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-xl"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "200%" }}
                    transition={{ duration: 0.6 }}
                  />

                  <AnimatePresence mode="wait" initial={false}>
                    {isMobileMenuOpen ? (
                      <motion.div
                        key="close"
                        initial={{ rotate: -180, opacity: 0, scale: 0.5 }}
                        animate={{ rotate: 0, opacity: 1, scale: 1 }}
                        exit={{ rotate: 180, opacity: 0, scale: 0.5 }}
                        transition={{ 
                          type: "spring", 
                          stiffness: 300, 
                          damping: 20,
                          duration: 0.3 
                        }}
                        className="relative z-10"
                      >
                        <X size={22} className="sm:w-6 sm:h-6 drop-shadow-lg" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="menu"
                        initial={{ rotate: 180, opacity: 0, scale: 0.5 }}
                        animate={{ rotate: 0, opacity: 1, scale: 1 }}
                        exit={{ rotate: -180, opacity: 0, scale: 0.5 }}
                        transition={{ 
                          type: "spring", 
                          stiffness: 300, 
                          damping: 20,
                          duration: 0.3 
                        }}
                        className="relative z-10"
                      >
                        <Menu size={22} className="sm:w-6 sm:h-6 drop-shadow-lg" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
        </div>

              {/* Enhanced Mobile Navigation */}
              <AnimatePresence>
                {isMobileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: 0, y: -20 }}
                    animate={{ opacity: 1, height: "auto", marginTop: "1rem", y: 0 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0, y: -20 }}
                    transition={{ 
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                      duration: 0.4 
                    }}
                    className="lg:hidden overflow-hidden"
                    style={{ marginTop: isMobileMenuOpen ? "1rem" : "0" }}
                  >
                    <motion.div
                      className="rounded-2xl border border-border/50 bg-background/98 backdrop-blur-2xl shadow-2xl p-3 sm:p-4 max-h-[calc(100vh-120px)] overflow-y-auto relative overflow-hidden"
                      initial={{ scale: 0.95 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Animated background gradient */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 opacity-50"
                        animate={{
                          backgroundPosition: ["0% 0%", "100% 100%"],
                        }}
                        transition={{
                          duration: 10,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />

                      {/* Top border glow */}
                      <motion.div
                        className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      />

                      <motion.ul
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -10, opacity: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className="flex flex-col gap-2 relative z-10"
                      >
                        {navLinks.map((link, index) => {
                          const isActive = activeSection === link.href.substring(1);
                          return (
                            <motion.li
                              key={link.name}
                              initial={{ opacity: 0, x: -20, scale: 0.9 }}
                              animate={{ opacity: 1, x: 0, scale: 1 }}
                              transition={{ 
                                delay: index * 0.08, 
                                duration: 0.3,
                                type: "spring",
                                stiffness: 300,
                                damping: 25
                              }}
                              className="relative z-10"
                            >
                              <motion.button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  scrollToSection(link.href);
                                }}
                                className={`w-full text-left py-3.5 sm:py-4 px-4 rounded-xl transition-all duration-300 relative overflow-visible group touch-manipulation ${
                                  isActive
                                    ? "text-primary bg-primary/15 border border-primary/30 shadow-lg shadow-primary/20"
                                    : "text-muted-foreground hover:text-foreground hover:bg-primary/8 border border-transparent hover:border-primary/20"
                                }`}
                                whileHover={{ 
                                  x: 6, 
                                  scale: 1.02,
                                  boxShadow: "0 4px 20px hsl(var(--primary) / 0.2)"
                                }}
                                whileTap={{ scale: 0.96, x: 3 }}
                                style={{ WebkitTapHighlightColor: "transparent" }}
                                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                              >
                                {/* Enhanced shimmer effect */}
                                <motion.span
                                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 via-primary/10 to-transparent rounded-xl"
                                  initial={{ x: "-100%", skewX: -15 }}
                                  whileHover={{ x: "200%", skewX: -15 }}
                                  transition={{ duration: 0.7 }}
                                />

                                {/* Enhanced active indicator with glow */}
                                <motion.span
                                  className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-primary via-cyan-400 to-purple-500 rounded-r-full"
                                  initial={{ scaleY: 0 }}
                                  animate={{ scaleY: isActive ? 1 : 0 }}
                                  transition={{ duration: 0.4, type: "spring" }}
                                  style={{
                                    boxShadow: isActive ? "0 0 10px hsl(var(--primary) / 0.6)" : "none",
                                  }}
                                />

                                {/* Background glow for active */}
                                <motion.span
                                  className="absolute inset-0 bg-primary/10 rounded-xl blur-sm"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: isActive ? 1 : 0 }}
                                  transition={{ duration: 0.3 }}
                                />

                                <span className="relative z-10 flex items-center gap-3 text-sm sm:text-base font-semibold">
                                  {link.name}
                                  {isActive && (
                                    <motion.span
                                      initial={{ scale: 0, rotate: -180 }}
                                      animate={{ scale: 1, rotate: 0 }}
                                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                      className="w-2 h-2 bg-primary rounded-full shadow-lg shadow-primary/50"
                                    />
                                  )}
                                </span>
                              </motion.button>
                            </motion.li>
                          );
                        })}
                      </motion.ul>

                      {/* Enhanced Mobile CTA */}
                      <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ 
                          delay: navLinks.length * 0.08 + 0.2,
                          type: "spring",
                          stiffness: 300,
                          damping: 25
                        }}
                        className="mt-4 pt-4 border-t border-border/50 relative z-10"
                      >
                        <motion.div
                          whileHover={{ scale: 1.03, y: -2 }}
                          whileTap={{ scale: 0.97 }}
                          transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                          <Button
                            variant="hero"
                            size="sm"
                            onClick={(e) => {
                              e.preventDefault();
                              scrollToSection("#contact");
                            }}
                            className="w-full relative overflow-hidden touch-manipulation border border-primary/20"
                            style={{ WebkitTapHighlightColor: "transparent" }}
                          >
                            <motion.span
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 via-primary/20 to-transparent"
                              animate={{
                                x: ["-100%", "200%"],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                            />
                            {/* Glow effect */}
                            <motion.span
                              className="absolute inset-0 bg-primary/30 rounded-lg blur-xl opacity-0"
                              whileHover={{ opacity: 1, scale: 1.2 }}
                              transition={{ duration: 0.3 }}
                            />
                            <span className="relative z-10 font-semibold tracking-wide">Hire Me</span>
                          </Button>
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.nav>
    </>
  );
};
