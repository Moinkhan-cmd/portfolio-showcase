import { useEffect, useState } from "react";
import { Menu, X, Code2, Rocket, Github, Linkedin, Mail } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { motion, AnimatePresence, useScroll, useMotionValueEvent, useSpring, useTransform } from "framer-motion";
import { EnhancedNavLink } from "./EnhancedNavLink";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Experience", href: "#experience" },
  { name: "Contact", href: "#contact" },
] as const;

export const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const { scrollY } = useScroll();

  // Smooth springs for fluid transitions
  const height = useSpring(useTransform(scrollY, [0, 80], [80, 64]), { stiffness: 100, damping: 20 });
  const bgOpacity = useTransform(scrollY, [0, 80], [0, 0.8]);
  const blurAmount = useTransform(scrollY, [0, 80], [0, 12]);
  const borderColor = useTransform(scrollY, [0, 80], ["transparent", "rgba(255,255,255,0.1)"]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 20);
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
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-[100] w-full"
        style={{
          height,
          backgroundColor: useTransform(bgOpacity, (v) => `hsl(var(--background) / ${v})`),
          backdropFilter: useTransform(blurAmount, (v) => `blur(${v}px)`),
          borderBottomColor: borderColor,
          borderBottomWidth: 1,
          borderBottomStyle: "solid",
        }}
      >
        <div className="container h-full mx-auto px-4 md:px-6 lg:px-8 flex items-center justify-between">

          {/* Logo Section */}
          <motion.div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-tr from-primary to-primary/50 shadow-lg shadow-primary/25 group-hover:shadow-primary/50 transition-all duration-300 group-hover:scale-105 group-hover:rotate-3">
              <Code2 className="w-4 h-4 md:w-5 md:h-5 text-background" />
              <div className="absolute inset-0 rounded-xl bg-white/20 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-lg md:text-xl tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 group-hover:text-primary transition-colors">
                Moin Khan
              </span>
              <span className="text-[10px] md:text-xs text-muted-foreground font-medium tracking-wide">
                Portfolio
              </span>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <ul className="flex items-center gap-1 p-1">
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
          </nav>

          {/* Desktop Actions */}
          <motion.div
            className="hidden md:flex items-center gap-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ThemeToggle />
            <div className="h-6 w-px bg-border/50" />
            <Button
              onClick={() => scrollToSection("#contact")}
              className="relative overflow-hidden rounded-full px-6 group bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
            >
              <span className="relative z-10 flex items-center gap-2">
                Let's Talk
                <Rocket className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
              </span>
              {/* Shine effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/25 to-transparent z-0" />
            </Button>
          </motion.div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-3">
            <ThemeToggle />
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-full bg-secondary/50 border border-border/50 hover:bg-secondary hover:border-primary/50 transition-all text-foreground"
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
                    <X className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[90] md:hidden bg-background/60 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-background border-l border-border/50 shadow-2xl p-6 flex flex-col"
            >
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-border/50">
                <span className="font-display font-bold text-xl">Menu</span>
                <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="flex-1 flex flex-col gap-2">
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(link.href);
                    }}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-xl text-lg font-medium transition-all group",
                      activeSection === link.href.substring(1)
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    )}
                  >
                    {link.name}
                    {activeSection === link.href.substring(1) && (
                      <motion.div layoutId="activeDot" className="w-2 h-2 rounded-full bg-primary" />
                    )}
                  </motion.a>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-border/50">
                <Button
                  className="w-full rounded-xl py-6 text-lg font-semibold shadow-xl shadow-primary/10 mb-6"
                  onClick={() => scrollToSection("#contact")}
                >
                  Hire Me <Rocket className="w-5 h-5 ml-2" />
                </Button>

                <div className="flex justify-center gap-6 text-muted-foreground">
                  <a href="#" className="hover:text-primary transition-colors"><Github className="w-6 h-6" /></a>
                  <a href="#" className="hover:text-primary transition-colors"><Linkedin className="w-6 h-6" /></a>
                  <a href="#" className="hover:text-primary transition-colors"><Mail className="w-6 h-6" /></a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
