import { useEffect, useState } from "react";
import { Menu, X, Rocket, Github, Linkedin, Mail } from "lucide-react";
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
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
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
      className={`fixed z-50 transition-all duration-500 ease-out ${isScrolled
          ? "top-4 left-1/2 -translate-x-1/2 w-[90%] md:w-fit"
          : "top-0 left-0 w-full"
        }`}
    >
      <div
        className={`relative transition-all duration-500 ease-out ${isScrolled
            ? "rounded-full p-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent shadow-glow"
            : ""
          }`}
      >
        <div
          className={`relative flex items-center justify-between transition-all duration-500 ease-out ${isScrolled
              ? "rounded-full glass-card bg-black/40 backdrop-blur-xl py-2 px-6 border-transparent"
              : "bg-transparent py-6 px-4 md:px-8"
            } ${isMobileMenuOpen && isScrolled ? "!rounded-2xl" : ""}`}
        >
          {/* Shimmer effect for the border when scrolled */}
          {isScrolled && (
            <div
              className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-primary/10 to-transparent animate-shimmer pointer-events-none"
              style={{ backgroundSize: "200% 100%" }}
            />
          )}

          <div
            className={`${isScrolled ? "" : "container mx-auto flex items-center justify-between w-full"
              }`}
          >
            {/* Logo Section */}
            <a
              href="#"
              className="font-signature text-2xl md:text-3xl text-foreground hover:text-primary transition-all duration-300 relative group shrink-0 mr-8"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <span className="relative z-10">Your Name</span>
              <span className="absolute inset-0 bg-primary/10 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 -z-0" />
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => scrollToSection(link.href)}
                  onMouseEnter={() => setHoveredLink(link.name)}
                  onMouseLeave={() => setHoveredLink(null)}
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-full",
                    activeSection === link.href.substring(1)
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {link.name}
                  {(hoveredLink === link.name || activeSection === link.href.substring(1)) && (
                    <motion.div
                      layoutId="nav-pill"
                      className={`absolute inset-0 rounded-full -z-10 ${activeSection === link.href.substring(1)
                          ? "bg-primary/10"
                          : "bg-primary/5"
                        }`}
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              ))}
              <div className="ml-4 pl-4 border-l border-white/10">
                <Button
                  variant="hero"
                  size="sm"
                  onClick={() => scrollToSection("#contact")}
                  className="rounded-full px-6 shadow-glow hover:shadow-primary/20 relative overflow-hidden group"
                >
                  <span className="relative z-10">Hire Me</span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{
                      x: ["-100%", "200%"],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                </Button>
              </div>
            </div>

            {/* Mobile Actions */}
            <div className="md:hidden flex items-center gap-4">
              <div className="scale-75 origin-right">
                <ThemeToggle />
              </div>
              <button
                className="text-foreground p-2 relative"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                <AnimatePresence mode="wait">
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
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`absolute top-full left-0 w-full mt-2 p-4 rounded-2xl glass-card md:hidden border border-white/10 shadow-2xl overflow-hidden z-40 bg-background/95 backdrop-blur-xl`}
            >
              <div className="flex flex-col gap-2">
                {navLinks.map((link, i) => (
                  <motion.button
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => scrollToSection(link.href)}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl text-left font-medium transition-all",
                      activeSection === link.href.substring(1)
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                    )}
                  >
                    <span className="text-xl">{link.icon}</span>
                    {link.name}
                    {activeSection === link.href.substring(1) && (
                      <motion.div layoutId="active-dot-mobile" className="ml-auto w-2 h-2 rounded-full bg-primary" />
                    )}
                  </motion.button>
                ))}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Button
                    variant="hero"
                    onClick={() => scrollToSection("#contact")}
                    className="mt-4 w-full rounded-xl py-6"
                  >
                    Hire Me
                  </Button>

                  <div className="flex justify-center gap-6 mt-6">
                    <a href="#" className="text-muted-foreground hover:text-foreground transition-colors"><Github size={20} /></a>
                    <a href="#" className="text-muted-foreground hover:text-foreground transition-colors"><Linkedin size={20} /></a>
                    <a href="#" className="text-muted-foreground hover:text-foreground transition-colors"><Mail size={20} /></a>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};
