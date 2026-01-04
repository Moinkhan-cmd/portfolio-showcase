import { useEffect, useState, useRef } from "react";
import { Menu, X, Code2, Rocket } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { motion, AnimatePresence, useScroll, useMotionValueEvent, useSpring, useTransform } from "framer-motion";
import { EnhancedNavLink } from "./EnhancedNavLink";
import { Button } from "@/components/ui/button";

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

  // Responsive width calculation
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const navWidth = useSpring(
    useTransform(
      scrollY,
      [0, 100],
      isMobile ? ["90%", "85%"] : ["60%", "45%"] // Mobile vs Desktop widths
    ),
    { stiffness: 100, damping: 20 }
  );
  const navY = useSpring(useTransform(scrollY, [0, 100], [30, 15]), { stiffness: 100, damping: 20 });
  const navPadding = useSpring(useTransform(scrollY, [0, 100], [20, 12]), { stiffness: 100, damping: 20 });
  const backdropBlur = useTransform(scrollY, [0, 100], ["blur(8px)", "blur(16px)"]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
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
      threshold: 0.5,
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
        className="fixed top-0 left-0 right-0 z-[100] flex justify-center pointer-events-none"
        style={{ y: navY }}
      >
        <motion.nav
          className="pointer-events-auto relative flex items-center justify-between rounded-full border border-white/10 bg-black/60 shadow-2xl backdrop-saturate-150"
          style={{
            width: isMobileMenuOpen ? "90%" : navWidth,
            backdropFilter: backdropBlur,
            paddingLeft: navPadding,
            paddingRight: navPadding,
            paddingTop: 12, // Fixed vertical padding
            paddingBottom: 12,
            transition: "width 0.5s cubic-bezier(0.32, 0.72, 0, 1)"
          }}
          layout
        >
          {/* Animated Border Beam */}
          <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none -z-10">
            <motion.div
              className="absolute -inset-[100%] bg-gradient-to-r from-transparent via-primary/30 to-transparent w-[300%]"
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              style={{ originX: 0.5, originY: 0.5 }}
            />
          </div>

          {/* Logo */}
          <motion.div
            className="flex items-center gap-2 px-2 cursor-pointer group"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="relative flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-tr from-primary/80 to-purple-500/80 shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow">
              <Code2 className="w-4 h-4 text-white" />
              <div className="absolute inset-0 rounded-full bg-white/20 animate-pulse" />
            </div>
            <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/70 hidden sm:block">
              MK
            </span>
          </motion.div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            <ul className="flex items-center gap-1 bg-white/5 rounded-full p-1 border border-white/5">
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
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-3 px-2">
            <ThemeToggle />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative px-5 py-2.5 rounded-full overflow-hidden text-sm font-semibold text-white bg-primary/20 border border-primary/20 hover:bg-primary/30 transition-colors group"
              onClick={() => scrollToSection("#contact")}
            >
              <span className="relative z-10 flex items-center gap-2">
                Let's Talk <Rocket className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
              {/* Shimmer Effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0" />
            </motion.button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          </div>
        </motion.nav>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="absolute top-[80px] w-[90%] md:hidden z-[90]"
            >
              <div className="flex flex-col gap-2 p-4 rounded-3xl bg-black/80 backdrop-blur-xl border border-white/10 shadow-2xl">
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(link.href);
                    }}
                    className={`block px-4 py-3 rounded-xl text-center text-sm font-medium transition-all ${activeSection === link.href.substring(1)
                      ? "bg-primary/20 text-primary border border-primary/20"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                      }`}
                  >
                    {link.name}
                  </motion.a>
                ))}
                <div className="h-px bg-white/10 my-2" />
                <Button
                  className="w-full rounded-xl bg-gradient-to-r from-primary to-purple-500 hover:opacity-90 py-6"
                  onClick={() => scrollToSection("#contact")}
                >
                  <span className="text-lg">Hire Me</span>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
};
