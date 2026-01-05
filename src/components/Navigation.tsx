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
    <nav
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out",
        isScrolled ? "pt-4" : "pt-0"
      )}
    >
      <div
        className={cn(
          "mx-auto transition-all duration-300 ease-in-out flex items-center justify-between",
          isScrolled
            ? "w-[95%] md:max-w-5xl bg-background/80 backdrop-blur-xl border border-white/10 rounded-full shadow-lg px-4 py-2.5"
            : "w-full max-w-7xl px-6 py-6"
        )}
      >
        {/* Logo Section */}
        <a
          href="#"
          className="flex items-center gap-2 group shrink-0"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20 group-hover:bg-primary/20 transition-colors">
            <span className="font-signature font-bold text-lg">M</span>
          </div>
          <span className={cn(
            "font-display font-bold text-lg tracking-tight transition-all",
            isScrolled ? "hidden sm:block" : "block"
          )}>
            Moin<span className="text-primary">.dev</span>
          </span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => scrollToSection(link.href)}
              className={cn(
                "relative px-4 py-2 text-sm font-medium transition-colors rounded-full",
                activeSection === link.href.substring(1)
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              )}
            >
              {link.name}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>

          <Button
            size={isScrolled ? "sm" : "default"}
            onClick={() => scrollToSection("#contact")}
            className={cn(
              "rounded-full font-semibold shadow-md transition-all gap-2",
              isScrolled ? "px-5" : "px-6"
            )}
          >
            Let's Talk
            <ArrowUpRight className="w-4 h-4" />
          </Button>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 text-foreground hover:bg-white/5 rounded-full transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-[calc(100%+1rem)] left-4 right-4 md:hidden"
          >
            <div className="bg-background/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => scrollToSection(link.href)}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-xl font-medium transition-colors",
                    activeSection === link.href.substring(1)
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                  )}
                >
                  {link.name}
                </button>
              ))}
              <div className="mt-2 pt-4 border-t border-white/10 flex items-center justify-between px-2">
                <span className="text-sm text-muted-foreground">Follow me</span>
                <div className="flex gap-4">
                  <Github className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
                  <Linkedin className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
                  <Mail className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
