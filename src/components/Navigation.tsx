import { useEffect, useState, useRef } from "react";
import { Menu, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
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
  const navRef = useRef<HTMLElement>(null);
  const { scrollYProgress, scrollY } = useScroll();
  // Optimize transforms - only update when needed
  const navScale = useTransform(scrollY, [0, 100], [1, 0.95], { clamp: true });
  const navOpacity = useTransform(scrollY, [0, 50], [1, 0.98], { clamp: true });
  const navBlur = useTransform(scrollY, [0, 100], [0, 20], { clamp: true });

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      {/* Scroll Progress Bar - Optimized */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary/80 to-primary z-[9998] origin-left"
        style={{ 
          scaleX: scrollYProgress,
          willChange: 'transform',
          backfaceVisibility: 'hidden',
          transform: 'translateZ(0)',
        }}
      />

      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-300 will-change-transform ${
          isScrolled || isMobileMenuOpen
            ? "py-2 sm:py-3 backdrop-blur-xl bg-background/95 border-b border-border/50 shadow-sm"
            : "py-4 sm:py-5 bg-background/80 backdrop-blur-sm"
        }`}
        style={{ 
          transform: 'translateZ(0)',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
        }}
      >
        {/* Subtle top border */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: isScrolled ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          aria-hidden="true"
        />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex items-center justify-between gap-2 sm:gap-4 min-h-[44px]">
          {/* Logo - Signature Style */}
          <motion.a
            href="#"
            className="font-signature text-lg sm:text-xl md:text-2xl lg:text-3xl text-foreground relative group flex items-center gap-1.5 sm:gap-2 min-w-0 flex-shrink-0"
            onClick={(e) => {
              e.preventDefault();
              scrollToTop();
            }}
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.95 }}
            whileFocus={{ outline: "2px solid hsl(var(--primary))", outlineOffset: "4px", borderRadius: "8px" }}
          >
            {/* Sparkle/Star effect with glow */}
            <motion.span
              className="relative flex-shrink-0"
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.15, 1],
              }}
              transition={{ 
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
              whileHover={{ rotate: [0, 360], scale: 1.3 }}
            >
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-primary" />
              {/* Glow around sparkle */}
              <motion.span
                className="absolute inset-0 bg-primary/40 rounded-full blur-md -z-10"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  scale: [1, 1.3, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.span>

            <motion.span 
              className="relative z-10 italic font-light tracking-wider gradient-text truncate"
              whileHover={{ scale: 1.02 }}
            >
              Moinkhan
            </motion.span>
            
            {/* Animated underline with glow */}
            <motion.span
              className="absolute -bottom-0.5 left-0 h-[1.5px] bg-gradient-to-r from-primary via-primary/80 to-primary"
              initial={{ width: 0 }}
              whileHover={{ width: "100%" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              style={{
                boxShadow: "0 0 8px hsl(var(--primary) / 0.5)",
              }}
            />

            {/* Shimmer effect on hover */}
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -z-10"
              initial={{ x: "-100%" }}
              whileHover={{ x: "200%" }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
          </motion.a>

          {/* Desktop Navigation */}
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

            {/* Right side actions */}
            <div className="flex items-center gap-2 xl:gap-3 ml-4 xl:ml-8 flex-shrink-0">
              {/* Theme Toggle */}
              <motion.div
                whileHover={{ scale: 1.1, rotate: 15 }}
                whileTap={{ scale: 0.9 }}
                whileFocus={{ outline: "2px solid hsl(var(--primary))", outlineOffset: "2px", borderRadius: "50%" }}
              >
                <ThemeToggle />
              </motion.div>

              {/* Hire Me Button with effects */}
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                whileFocus={{ scale: 1.05, outline: "2px solid hsl(var(--primary))", outlineOffset: "2px", borderRadius: "8px" }}
              >
                <Button
                  variant="hero"
                  size="sm"
                  onClick={() => scrollToSection("#contact")}
                  className="relative overflow-hidden group"
                >
                  {/* Shimmer effect */}
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
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

                  {/* Glow on hover */}
                  <motion.span
                    className="absolute inset-0 bg-primary/30 rounded-lg blur-lg -z-10 opacity-0"
                    whileHover={{ opacity: 1, scale: 1.2 }}
                    transition={{ duration: 0.3 }}
                  />

                  <span className="relative z-10 font-medium">Hire Me</span>
                </Button>
              </motion.div>
            </div>
          </nav>

          {/* Mobile/Tablet Menu Button */}
          <div className="flex items-center gap-2 sm:gap-3 lg:hidden flex-shrink-0">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ThemeToggle />
            </motion.div>
            <motion.button
              className="text-foreground p-2.5 rounded-lg hover:bg-primary/10 active:bg-primary/20 transition-all duration-200 relative group touch-manipulation"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsMobileMenuOpen((v) => !v);
              }}
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
              type="button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              whileFocus={{ outline: "2px solid hsl(var(--primary))", outlineOffset: "2px" }}
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              {/* Ripple effect */}
              <motion.span
                className="absolute inset-0 bg-primary/20 rounded-lg"
                initial={{ scale: 0, opacity: 0.5 }}
                whileTap={{ scale: 2, opacity: 0 }}
                transition={{ duration: 0.4 }}
              />

              <AnimatePresence mode="wait" initial={false}>
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="relative z-10"
                  >
                    <X size={22} className="sm:w-6 sm:h-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="relative z-10"
                  >
                    <Menu size={22} className="sm:w-6 sm:h-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: "1rem" }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lg:hidden overflow-hidden"
              style={{ marginTop: isMobileMenuOpen ? "1rem" : "0" }}
            >
              <div className="rounded-xl border border-border/50 bg-background/95 backdrop-blur-xl shadow-lg p-3 sm:p-4 max-h-[calc(100vh-120px)] overflow-y-auto">
                <motion.ul
                  initial={{ y: -10 }}
                  animate={{ y: 0 }}
                  exit={{ y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col gap-1.5"
                >
                  {navLinks.map((link, index) => {
                    const isActive = activeSection === link.href.substring(1);
                    return (
                      <motion.li
                        key={link.name}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.2 }}
                        className="relative z-10"
                      >
                        <motion.button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            scrollToSection(link.href);
                          }}
                          className={`w-full text-left py-3 sm:py-3.5 px-4 rounded-lg transition-all duration-200 relative overflow-visible group touch-manipulation ${
                            isActive
                              ? "text-primary bg-primary/10 border border-primary/20"
                              : "text-muted-foreground hover:text-foreground hover:bg-primary/5 border border-transparent"
                          }`}
                          whileHover={{ x: 4, scale: 1.01 }}
                          whileTap={{ scale: 0.97, x: 2 }}
                          style={{ WebkitTapHighlightColor: "transparent" }}
                        >
                          {/* Shimmer effect */}
                          <motion.span
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-lg"
                            initial={{ x: "-100%" }}
                            whileHover={{ x: "200%" }}
                            transition={{ duration: 0.6 }}
                          />

                          {/* Active indicator */}
                          <motion.span
                            className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full"
                            initial={{ scaleY: 0 }}
                            animate={{ scaleY: isActive ? 1 : 0 }}
                            transition={{ duration: 0.3 }}
                          />

                          <span className="relative z-10 flex items-center gap-2 text-sm sm:text-base font-medium">
                            {link.name}
                            {isActive && (
                              <motion.span
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                className="w-1.5 h-1.5 bg-primary rounded-full"
                              />
                            )}
                          </span>
                        </motion.button>
                      </motion.li>
                    );
                  })}
                </motion.ul>

                {/* Mobile CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: navLinks.length * 0.05 + 0.1 }}
                  className="mt-4 pt-4 border-t border-border/50"
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="hero"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToSection("#contact");
                      }}
                      className="w-full relative overflow-hidden touch-manipulation"
                      style={{ WebkitTapHighlightColor: "transparent" }}
                    >
                      <motion.span
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        animate={{
                          x: ["-100%", "200%"],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                      <span className="relative z-10 font-medium">Hire Me</span>
                    </Button>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
    </>
  );
};
