import { useEffect, useState } from "react";
import { Menu, X, Rocket } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
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
  const { scrollY } = useScroll();

  // Optimized scroll detection with threshold
  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 30);
  });

  useEffect(() => {
    // Intersection Observer for Active Link Highlighting
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
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50"
        initial={false}
        animate={{
          paddingTop: isScrolled ? "1rem" : "1.5rem",
          paddingBottom: isScrolled ? "1rem" : "1.5rem",
        }}
        transition={{
          duration: 0.3,
          ease: [0.4, 0, 0.2, 1],
        }}
      >
        {/* Background with glassmorphism */}
        <motion.div
          className="absolute inset-0"
          initial={false}
          animate={{
            backgroundColor: isScrolled
              ? "hsl(var(--background) / 0.8)"
              : "hsl(var(--background) / 0)",
            backdropFilter: isScrolled ? "blur(20px) saturate(180%)" : "blur(0px)",
            WebkitBackdropFilter: isScrolled ? "blur(20px) saturate(180%)" : "blur(0px)",
            borderBottomWidth: isScrolled ? "1px" : "0px",
            borderBottomColor: isScrolled
              ? "hsl(var(--border) / 0.3)"
              : "hsl(var(--border) / 0)",
            boxShadow: isScrolled
              ? "0 4px 24px hsl(0 0% 0% / 0.12), 0 0 1px hsl(0 0% 0% / 0.08)"
              : "0 0 0px hsl(0 0% 0% / 0)",
          }}
          transition={{
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1],
          }}
        />

        {/* Subtle gradient overlay for depth */}
        {isScrolled && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              background: "linear-gradient(to bottom, hsl(var(--primary) / 0.03), transparent)",
            }}
          />
        )}

        <div className="container mx-auto container-padding relative z-10">
          <div className="flex items-center justify-between">
            {/* Logo/Brand */}
            <motion.a
              href="#"
              className="font-signature text-2xl md:text-3xl text-foreground hover:text-primary transition-colors duration-300 relative group"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10">Your Name</span>
              <span className="absolute inset-0 bg-primary/10 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 -z-0" />
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-primary/50 group-hover:w-full transition-all duration-300" />
            </motion.a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              {navLinks.map((link) => (
                <motion.button
                  key={link.name}
                  onClick={() => scrollToSection(link.href)}
                  className={cn(
                    "relative text-sm font-medium transition-all duration-200 px-3 py-1.5 rounded-md",
                    activeSection === link.href.substring(1)
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  whileHover={{ y: -1, scale: 1.02 }}
                  whileTap={{ y: 0, scale: 0.98 }}
                >
                  {link.name}
                  {activeSection === link.href.substring(1) && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-primary/50 rounded-full"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                  <motion.div
                    className="absolute inset-0 bg-primary/5 dark:bg-primary/10 rounded-md opacity-0 hover:opacity-100 transition-opacity duration-200"
                    initial={false}
                  />
                </motion.button>
              ))}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="hero"
                  size="sm"
                  onClick={() => scrollToSection("#contact")}
                  className="relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Let's Talk
                    <Rocket className="w-4 h-4" />
                  </span>
                  <motion.div
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
                </Button>
              </motion.div>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center gap-2">
              <motion.div whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.05 }}>
                <ThemeToggle />
              </motion.div>
              <motion.button
                className="relative p-2.5 rounded-lg text-foreground hover:bg-secondary/50 transition-colors touch-manipulation"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {isMobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="w-6 h-6" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="w-6 h-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[90] md:hidden bg-background/95 backdrop-blur-xl"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                type: "spring",
                damping: 30,
                stiffness: 300,
              }}
              onClick={(e) => e.stopPropagation()}
              className="fixed right-0 top-0 bottom-0 w-[85%] max-w-sm bg-background/98 backdrop-blur-2xl border-l border-border/50 shadow-2xl p-6 flex flex-col z-[95]"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-border/50">
                <span className="font-display font-bold text-xl bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                  Menu
                </span>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-secondary/50 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Navigation Links */}
              <div className="flex-1 flex flex-col gap-2 overflow-y-auto -mx-6 px-6">
                {navLinks.map((link, i) => (
                  <motion.button
                    key={link.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => scrollToSection(link.href)}
                    className={cn(
                      "flex items-center gap-3 p-4 rounded-xl text-left font-medium transition-all relative overflow-hidden group touch-manipulation",
                      activeSection === link.href.substring(1)
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50 border border-transparent"
                    )}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="text-xl">{link.icon}</span>
                    <span className="flex-1">{link.name}</span>
                    {activeSection === link.href.substring(1) && (
                      <motion.div
                        layoutId="mobileActiveIndicator"
                        className="absolute right-2 w-2 h-2 rounded-full bg-primary"
                        initial={false}
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}
                    <motion.div
                      className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </motion.button>
                ))}
              </div>

              {/* Footer Actions */}
              <div className="mt-8 pt-6 border-t border-border/50">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Button
                    className="w-full rounded-xl py-6 text-base font-semibold bg-gradient-to-r from-primary via-primary/90 to-primary hover:from-primary/90 hover:via-primary hover:to-primary/90 shadow-lg shadow-primary/20 relative overflow-hidden group"
                    onClick={() => scrollToSection("#contact")}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Let's Talk
                      <Rocket className="w-4 h-4" />
                    </span>
                    <motion.div
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
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
