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

  // Performance optimized scroll handler
  useMotionValueEvent(scrollY, "change", (latest) => {
    const scrolled = latest > 20;
    if (isScrolled !== scrolled) {
      setIsScrolled(scrolled);
    }
  });

  // Intersection Observer for active section
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
      threshold: 0.1,
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
      const navHeight = 80; // Approximate navbar height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
        className={cn(
          "fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-out border-b",
          isScrolled
            ? "bg-background/80 backdrop-blur-xl border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)] py-3"
            : "bg-transparent border-transparent py-5"
        )}
      >
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          {/* Brand Logo */}
          <a
            href="#"
            className="group flex items-center gap-3 relative z-50"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <div className="relative w-10 h-10 flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 group-hover:border-primary/50 transition-all duration-500">
              <span className="font-signature text-xl font-bold bg-gradient-to-br from-white to-white/70 bg-clip-text text-transparent transform group-hover:scale-110 transition-transform duration-500">M</span>
              <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-lg tracking-tight leading-none group-hover:text-primary transition-colors duration-300">
                Moin
              </span>
              <span className="text-[10px] font-medium tracking-[0.2em] text-muted-foreground uppercase group-hover:tracking-[0.3em] transition-all duration-300">
                Developer
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 p-1 rounded-full bg-white/5 border border-white/5 backdrop-blur-sm">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.substring(1);
              return (
                <button
                  key={link.name}
                  onClick={() => scrollToSection(link.href)}
                  className={cn(
                    "relative px-5 py-2 text-sm font-medium transition-all duration-300 rounded-full group overflow-hidden",
                    isActive
                      ? "text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-primary rounded-full"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{link.name}</span>

                  {/* Subtle hover gleam for non-active items */}
                  {!isActive && (
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            <Button
              onClick={() => scrollToSection("#contact")}
              className="relative overflow-hidden group rounded-full bg-primary text-primary-foreground font-semibold px-6 hover:bg-primary/90 transition-all duration-300 shadow-[0_0_20px_rgba(45,212,191,0.3)] hover:shadow-[0_0_30px_rgba(45,212,191,0.5)] transform hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
              <span className="relative flex items-center gap-2">
                Let's Talk
                <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </Button>
          </div>

          {/* Mobile Toggle */}
          <div className="flex md:hidden items-center gap-4">
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="relative z-50 p-2 text-foreground hover:bg-white/10 rounded-full transition-colors"
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ opacity: 0, rotate: 90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: -90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-6 h-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 md:hidden bg-background/95 backdrop-blur-2xl"
          >
            <div className="flex flex-col h-full pt-24 px-6 pb-10">
              <div className="flex flex-col gap-2">
                {navLinks.map((link, index) => (
                  <motion.button
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    onClick={() => scrollToSection(link.href)}
                    className={cn(
                      "text-3xl font-display font-medium text-left py-4 border-b border-white/5 transition-colors",
                      activeSection === link.href.substring(1)
                        ? "text-primary"
                        : "text-muted-foreground active:text-foreground"
                    )}
                  >
                    {link.name}
                  </motion.button>
                ))}
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
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
