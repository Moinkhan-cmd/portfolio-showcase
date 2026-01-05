import { useEffect, useState } from "react";
import { Menu, X, ArrowUpRight, Github, Linkedin, Mail } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
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
  const { scrollY } = useScroll();

  // Optimized scroll detection with threshold
  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 30);
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
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.nav
      className="fixed top-0 left-0 w-full z-50"
      initial={false}
      animate={{
        paddingTop: isScrolled ? "1rem" : "0px",
      }}
      transition={{
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      }}
    >
      <motion.div
        className={cn(
          "mx-auto transition-all duration-300 ease-in-out flex items-center justify-between",
          isScrolled
            ? "w-[95%] md:max-w-5xl px-4 py-2.5"
            : "w-full max-w-7xl px-6 py-6"
        )}
        initial={false}
        animate={{
          backgroundColor: isScrolled
            ? "hsl(var(--background) / 0.8)"
            : "hsl(var(--background) / 0)",
          backdropFilter: isScrolled ? "blur(20px) saturate(180%)" : "blur(0px)",
          WebkitBackdropFilter: isScrolled ? "blur(20px) saturate(180%)" : "blur(0px)",
          borderWidth: isScrolled ? "1px" : "0px",
          borderColor: isScrolled
            ? "hsl(var(--border) / 0.3)"
            : "hsl(var(--border) / 0)",
          borderRadius: isScrolled ? "9999px" : "0px",
          boxShadow: isScrolled
            ? "0 4px 24px hsl(0 0% 0% / 0.12), 0 0 1px hsl(0 0% 0% / 0.08)"
            : "0 0 0px hsl(0 0% 0% / 0)",
        }}
        transition={{
          duration: 0.3,
          ease: [0.4, 0, 0.2, 1],
        }}
      >
        {/* Logo Section */}
        <motion.a
          href="#"
          className="flex items-center gap-2 group shrink-0"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20 group-hover:bg-primary/20 transition-colors">
            <span className="font-signature font-bold text-lg">M</span>
          </div>
          <motion.span
            className={cn(
              "font-display font-bold text-lg tracking-tight transition-all",
              isScrolled ? "hidden sm:block" : "block"
            )}
            initial={false}
            animate={{
              opacity: isScrolled ? [1, 0, 1] : 1,
            }}
            transition={{
              duration: 0.3,
            }}
          >
            Moin<span className="text-primary">.dev</span>
          </motion.span>
        </motion.a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <motion.button
              key={link.name}
              onClick={() => scrollToSection(link.href)}
              className={cn(
                "relative px-4 py-2 text-sm font-medium transition-colors rounded-full",
                activeSection === link.href.substring(1)
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50 dark:hover:bg-white/5"
              )}
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
            >
              {link.name}
            </motion.button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="hero"
              size={isScrolled ? "sm" : "default"}
              onClick={() => scrollToSection("#contact")}
              className={cn(
                "rounded-full font-semibold shadow-md transition-all gap-2 relative overflow-hidden group",
                isScrolled ? "px-5" : "px-6"
              )}
            >
              <span className="relative z-10 flex items-center gap-2">
                Let's Talk
                <ArrowUpRight className="w-4 h-4" />
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

          {/* Mobile Toggle */}
          <motion.button
            className="md:hidden p-2 text-foreground hover:bg-secondary/50 dark:hover:bg-white/5 rounded-full transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            aria-label="Toggle menu"
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
                  <X size={24} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu size={24} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-[calc(100%+1rem)] left-4 right-4 md:hidden z-50"
          >
            <div className="bg-background/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl p-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <motion.button
                  key={link.name}
                  onClick={() => scrollToSection(link.href)}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-xl font-medium transition-colors",
                    activeSection === link.href.substring(1)
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-secondary/50 dark:hover:bg-white/5 hover:text-foreground"
                  )}
                  whileTap={{ scale: 0.98 }}
                >
                  {link.name}
                </motion.button>
              ))}
              <div className="mt-2 pt-4 border-t border-border/50 flex items-center justify-between px-2">
                <span className="text-sm text-muted-foreground">Follow me</span>
                <div className="flex gap-4">
                  <motion.a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    whileHover={{ scale: 1.2, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Github className="w-5 h-5" />
                  </motion.a>
                  <motion.a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    whileHover={{ scale: 1.2, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Linkedin className="w-5 h-5" />
                  </motion.a>
                  <motion.a
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    whileHover={{ scale: 1.2, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Mail className="w-5 h-5" />
                  </motion.a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};
