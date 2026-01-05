import { useEffect, useState } from "react";
import { Menu, X, Code2, Rocket, Github, Linkedin, Mail, Sparkles, Zap, Star } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { motion, AnimatePresence, useScroll, useMotionValueEvent, useSpring, useTransform } from "framer-motion";
import { EnhancedNavLink } from "./EnhancedNavLink";
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

  // Progressive scroll-based transforms
  const scrollProgress = useTransform(scrollY, [0, 500], [0, 1]);
  
  // Height transitions with different breakpoints
  const height = useSpring(
    useTransform(scrollY, [0, 50, 100], [88, 72, 64]),
    { stiffness: 150, damping: 25 }
  );
  
  // Background opacity with progressive enhancement - More visible
  const bgOpacity = useTransform(scrollY, [0, 30, 100, 300], [0, 0.85, 0.95, 0.98]);
  
  // Blur amount increases with scroll - More dramatic
  const blurAmount = useTransform(scrollY, [0, 30, 150, 300], [0, 10, 18, 24]);
  
  // Border color and width changes - More visible
  const borderOpacity = useTransform(scrollY, [0, 30, 150, 300], [0, 0.4, 0.6, 0.8]);
  const borderWidth = useTransform(scrollY, [0, 50, 150], [0, 1.5, 2]);
  
  // 3D rotation based on scroll - More noticeable
  const rotateX = useTransform(scrollY, [0, 300, 600], [0, -3, -5]);
  const scale = useTransform(scrollY, [0, 50, 150], [1, 0.97, 0.95]);
  
  // Shadow intensity increases with scroll - More dramatic
  const shadowIntensity = useTransform(scrollY, [0, 50, 200, 400], [0, 0.3, 0.5, 0.7]);
  
  // Logo scale on scroll - More visible
  const logoScale = useTransform(scrollY, [0, 50, 150], [1, 0.88, 0.85]);

  // Glow intensity based on scroll - More visible
  const glowIntensity = useTransform(scrollY, [0, 100, 300, 500], [0, 0.4, 0.7, 0.9]);
  
  // Additional effects
  const navScale = useTransform(scrollY, [0, 100], [1, 0.98]);
  const navY = useTransform(scrollY, [0, 50], [0, -2]);

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
          y: navY,
          backgroundColor: useTransform(bgOpacity, (v) => `hsl(var(--background) / ${v})`),
          backdropFilter: useTransform(blurAmount, (v) => `blur(${v}px) saturate(200%)`),
          borderBottomWidth: borderWidth,
          borderBottomStyle: "solid",
          borderBottomColor: useTransform(borderOpacity, (v) => `hsl(175 80% 50% / ${v})`),
          rotateX,
          scale: navScale,
          boxShadow: useTransform(
            shadowIntensity,
            (v) => `0 15px 60px -10px hsl(175 80% 50% / ${v * 1.2}), 0 8px 30px -5px hsl(0 0% 0% / ${v * 0.8}), inset 0 1px 0 hsl(175 80% 50% / ${v * 0.3}), 0 0 40px -10px hsl(175 80% 50% / ${v * 0.4})`
          ),
          transformStyle: "preserve-3d",
        }}
      >
        {/* Multi-layer animated gradient backgrounds - More visible */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: useTransform(scrollY, [30, 150, 300], [0, 0.4, 0.6]),
            background: "linear-gradient(90deg, hsl(175 80% 50% / 0.25) 0%, transparent 25%, transparent 75%, hsl(175 80% 50% / 0.25) 100%)",
          }}
        />

        {/* Animated mesh gradient - More visible */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: useTransform(scrollY, [50, 200, 400], [0, 0.4, 0.6]),
            background: "radial-gradient(ellipse at 20% 50%, hsl(175 80% 50% / 0.2) 0%, transparent 50%), radial-gradient(ellipse at 80% 50%, hsl(280 70% 50% / 0.2) 0%, transparent 50%)",
          }}
        />

        {/* Additional gradient layer */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: useTransform(scrollY, [100, 300], [0, 0.3]),
            background: "linear-gradient(180deg, hsl(175 80% 50% / 0.15) 0%, transparent 50%, hsl(280 70% 50% / 0.15) 100%)",
          }}
        />

        {/* Enhanced shimmer effect - More visible */}
        <motion.div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          style={{
            opacity: useTransform(scrollY, [50, 200, 400], [0, 0.5, 0.7]),
          }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            style={{
              width: "200%",
              height: "100%",
              backgroundSize: "200% 100%",
            }}
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </motion.div>

        {/* Enhanced glow effect on scroll - More visible */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: glowIntensity,
            background: "radial-gradient(ellipse at center, hsl(175 80% 50% / 0.5) 0%, transparent 60%)",
            filter: "blur(50px)",
          }}
        />

        {/* Additional side glow effects */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: useTransform(scrollY, [100, 300], [0, 0.4]),
            background: "radial-gradient(ellipse at 0% 50%, hsl(175 80% 50% / 0.3) 0%, transparent 50%), radial-gradient(ellipse at 100% 50%, hsl(280 70% 50% / 0.3) 0%, transparent 50%)",
            filter: "blur(30px)",
          }}
        />

        {/* Enhanced animated border glow - More visible */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[3px] pointer-events-none"
          style={{
            opacity: useTransform(scrollY, [30, 150, 300], [0, 0.8, 1]),
            background: "linear-gradient(90deg, transparent 0%, hsl(175 80% 50%) 25%, hsl(280 70% 50%) 50%, hsl(175 80% 50%) 75%, transparent 100%)",
            backgroundSize: "200% 100%",
            backgroundPosition: useTransform(scrollProgress, [0, 1], ["0% 0%", "200% 0%"]),
            boxShadow: useTransform(
              scrollY,
              [50, 200, 400],
              ["0 0 0px hsl(175 80% 50% / 0)", "0 0 25px hsl(175 80% 50% / 0.8)", "0 0 40px hsl(175 80% 50% / 1)"]
            ),
          }}
        />

        {/* Top border glow on deep scroll */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-[1px] pointer-events-none"
          style={{
            opacity: useTransform(scrollY, [200, 400], [0, 0.6]),
            background: "linear-gradient(90deg, transparent 0%, hsl(175 80% 50% / 0.5) 50%, transparent 100%)",
            boxShadow: useTransform(
              scrollY,
              [200, 400],
              ["0 0 0px hsl(175 80% 50% / 0)", "0 0 15px hsl(175 80% 50% / 0.6)"]
            ),
          }}
        />

        {/* Enhanced floating particles - More visible and numerous */}
        <AnimatePresence>
          {scrollY.get() > 50 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 pointer-events-none overflow-hidden"
              style={{
                opacity: useTransform(scrollY, [50, 200, 400], [0, 0.6, 1]),
              }}
            >
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-primary rounded-full"
                  style={{
                    filter: "blur(0.5px)",
                    boxShadow: "0 0 6px hsl(175 80% 50% / 0.8)",
                  }}
                  initial={{
                    x: `${Math.random() * 100}%`,
                    y: "50%",
                    opacity: 0,
                    scale: 0,
                  }}
                  animate={{
                    y: ["50%", "-50%", "50%"],
                    opacity: [0, 1, 0],
                    scale: [0, 2, 0],
                    x: [`${Math.random() * 100}%`, `${Math.random() * 100}%`, `${Math.random() * 100}%`],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: i * 0.3,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Additional sparkle particles on deeper scroll */}
        <AnimatePresence>
          {scrollY.get() > 300 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 pointer-events-none overflow-hidden"
            >
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={`sparkle-${i}`}
                  className="absolute"
                  style={{
                    left: `${20 + i * 20}%`,
                    top: "50%",
                  }}
                  animate={{
                    y: ["50%", "30%", "50%"],
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 2 + i * 0.5,
                    repeat: Infinity,
                    delay: i * 0.4,
                    ease: "easeInOut",
                  }}
                >
                  <Sparkles className="w-3 h-3 text-primary" style={{ filter: "drop-shadow(0 0 4px hsl(175 80% 50% / 0.8))" }} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced grid pattern overlay - More visible */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: useTransform(scrollY, [50, 200, 400], [0, 0.15, 0.25]),
            backgroundImage: "linear-gradient(hsl(var(--primary) / 0.2) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary) / 0.2) 1px, transparent 1px)",
            backgroundSize: "35px 35px",
          }}
        />

        {/* Animated scan line effect on scroll */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: useTransform(scrollY, [100, 300], [0, 0.3]),
            background: "linear-gradient(180deg, transparent 0%, hsl(175 80% 50% / 0.1) 50%, transparent 100%)",
            backgroundSize: "100% 200%",
            backgroundPosition: useTransform(scrollProgress, [0, 1], ["0% 0%", "0% 100%"]),
          }}
        />

        <div className="container h-full mx-auto px-3 sm:px-4 md:px-6 lg:px-8 flex items-center justify-between relative z-10">
          {/* Enhanced Logo Section with more 3D effects - Responsive */}
          <motion.div
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group relative"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            initial={{ opacity: 0, x: -20, rotateY: -20 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 0.6, type: "spring" }}
            whileHover={{ scale: 1.05, x: 2 }}
            whileTap={{ scale: 0.95 }}
            style={{ scale: logoScale }}
          >
            {/* Enhanced 3D Logo Container - Responsive */}
            <motion.div
              className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-primary via-primary/80 to-primary/60 shadow-lg shadow-primary/30 group-hover:shadow-primary/50 transition-all duration-300"
              whileHover={{ 
                rotateY: 15,
                rotateX: 5,
                scale: 1.15,
                z: 20,
              }}
              whileTap={{ scale: 0.9 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <Code2 className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-background relative z-10" />
              
              {/* Multi-layer animated glow */}
              <motion.div
                className="absolute inset-0 rounded-xl bg-white/30"
                animate={{
                  opacity: [0.3, 0.7, 0.3],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              
              {/* Enhanced 3D shine effect */}
              <motion.div
                className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/50 via-transparent to-transparent"
                animate={{
                  backgroundPosition: ["0% 0%", "100% 100%"],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />

              {/* Outer glow ring */}
              <motion.div
                className="absolute -inset-1 rounded-xl border-2 border-primary/30"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>

            <div className="flex flex-col relative">
              <motion.span
                className="font-display font-bold text-base sm:text-lg md:text-xl tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground to-foreground/70 group-hover:from-primary group-hover:via-primary/90 group-hover:to-primary transition-all duration-300 relative"
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="hidden sm:inline">Moin Khan</span>
                <span className="sm:hidden">MK</span>
                {/* Animated underline on hover */}
                <motion.div
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-primary/50 to-primary"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.span>
              <motion.span
                className="text-[9px] sm:text-[10px] md:text-xs text-muted-foreground font-medium tracking-wide hidden sm:block"
                whileHover={{ x: 2 }}
              >
                Portfolio
              </motion.span>
            </div>

            {/* Enhanced decorative sparkles */}
            {[...Array(2)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                  top: i === 0 ? "-5px" : "auto",
                  bottom: i === 1 ? "-5px" : "auto",
                  right: i === 0 ? "-8px" : "-12px",
                }}
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.3, 1],
                  y: i === 0 ? [0, -5, 0] : [0, 5, 0],
                }}
                transition={{
                  duration: 2 + i,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.5,
                }}
              >
                <Sparkles className="w-3 h-3 text-primary" />
              </motion.div>
            ))}
          </motion.div>

          {/* Enhanced Desktop Navigation with more effects */}
          <nav className="hidden lg:flex items-center gap-1">
            <motion.ul
              className="flex items-center gap-1 p-2 rounded-2xl bg-gradient-to-br from-background/40 via-background/30 to-background/40 backdrop-blur-xl border border-primary/20 shadow-xl shadow-primary/5 relative overflow-hidden"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ borderColor: "hsl(175 80% 50% / 0.4)" }}
              style={{
                borderColor: useTransform(scrollY, [50, 200], ["hsl(175 80% 50% / 0.2)", "hsl(175 80% 50% / 0.5)"]),
                boxShadow: useTransform(
                  scrollY,
                  [50, 200],
                  ["0 0 0px hsl(175 80% 50% / 0)", "0 0 20px hsl(175 80% 50% / 0.3)"]
                ),
              }}
            >
              {/* Animated background gradient */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100"
                animate={{
                  backgroundPosition: ["0% 0%", "100% 0%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />

              {navLinks.map((link, index) => (
                <motion.div
                  key={link.name}
                  onHoverStart={() => setHoveredLink(link.name)}
                  onHoverEnd={() => setHoveredLink(null)}
                  className="relative"
                >
                  <EnhancedNavLink
                    link={link}
                    isActive={activeSection === link.href.substring(1)}
                    onClick={() => scrollToSection(link.href)}
                    index={index}
                  />
                  
                  {/* Hover glow effect */}
                  {hoveredLink === link.name && (
                    <motion.div
                      className="absolute inset-0 rounded-lg bg-primary/20 blur-md -z-10"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1.2 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}

                  {/* Active indicator with animation */}
                  {activeSection === link.href.substring(1) && (
                    <motion.div
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                      layoutId="activeIndicator"
                      initial={{ scale: 0 }}
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{
                        scale: {
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        },
                      }}
                    />
                  )}
                </motion.div>
              ))}
            </motion.ul>
          </nav>

          {/* Enhanced Tablet Navigation with better responsive effects */}
          <nav className="hidden md:flex lg:hidden items-center gap-1">
            <motion.ul
              className="flex items-center gap-0.5 p-1.5 rounded-xl bg-gradient-to-br from-background/40 via-background/30 to-background/40 backdrop-blur-xl border border-primary/20 shadow-lg shadow-primary/5 relative overflow-hidden"
              initial={{ opacity: 0, scale: 0.9, y: -5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.4, type: "spring" }}
              whileHover={{ borderColor: "hsl(175 80% 50% / 0.3)" }}
              style={{
                borderColor: useTransform(scrollY, [50, 200], ["hsl(175 80% 50% / 0.2)", "hsl(175 80% 50% / 0.4)"]),
              }}
            >
              {/* Animated background gradient for tablet */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5"
                animate={{
                  backgroundPosition: ["0% 0%", "100% 0%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
              {navLinks.slice(0, 4).map((link, index) => (
                <motion.div
                  key={link.name}
                  onHoverStart={() => setHoveredLink(link.name)}
                  onHoverEnd={() => setHoveredLink(null)}
                  className="relative"
                >
                  <EnhancedNavLink
                    link={link}
                    isActive={activeSection === link.href.substring(1)}
                    onClick={() => scrollToSection(link.href)}
                    index={index}
                  />
                  {/* Hover glow effect for tablet */}
                  {hoveredLink === link.name && (
                    <motion.div
                      className="absolute inset-0 rounded-lg bg-primary/15 blur-sm -z-10"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1.1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </motion.div>
              ))}
            </motion.ul>
          </nav>

          {/* Enhanced Desktop Actions */}
          <motion.div
            className="hidden md:flex items-center gap-3 lg:gap-4"
            initial={{ opacity: 0, x: 20, rotateY: 20 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 0.6, delay: 0.3, type: "spring" }}
          >
            <ThemeToggle />
            <div className="h-6 w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent" />
            <motion.div
              whileHover={{ scale: 1.08, y: -3 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
              onHoverStart={() => setHoveredLink("contact")}
              onHoverEnd={() => setHoveredLink(null)}
              style={{
                scale: useTransform(scrollY, [0, 100], [1, 0.98]),
              }}
            >
              <Button
                onClick={() => scrollToSection("#contact")}
                className="relative overflow-hidden rounded-full px-5 lg:px-6 group bg-gradient-to-r from-primary via-primary/90 to-primary hover:from-primary/90 hover:via-primary hover:to-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all border-2 border-primary/30"
                style={{
                  boxShadow: useTransform(
                    scrollY,
                    [50, 200],
                    ["0 4px 20px -5px hsl(175 80% 50% / 0.3)", "0 8px 30px -5px hsl(175 80% 50% / 0.5)"]
                  ),
                }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <span className="hidden lg:inline">Let's Talk</span>
                  <span className="lg:hidden">Talk</span>
                  <motion.div
                    animate={{
                      rotate: [0, 20, -20, 0],
                      y: [0, -3, 3, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Rocket className="w-4 h-4" />
                  </motion.div>
                </span>
                
                {/* Multi-layer shine effects */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                  animate={{
                    x: ["-100%", "200%"],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
                
                {/* Pulsing glow effect */}
                <motion.div
                  className="absolute inset-0 bg-primary/30 blur-xl opacity-0 group-hover:opacity-100"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0, 0.5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                {/* Sparkle particles on hover */}
                <AnimatePresence>
                  {hoveredLink === "contact" && (
                    <>
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-1 h-1 bg-white rounded-full"
                          initial={{
                            x: "50%",
                            y: "50%",
                            opacity: 0,
                            scale: 0,
                          }}
                          animate={{
                            x: `${50 + (Math.random() - 0.5) * 100}%`,
                            y: `${50 + (Math.random() - 0.5) * 100}%`,
                            opacity: [0, 1, 0],
                            scale: [0, 1, 0],
                          }}
                          exit={{ opacity: 0 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay: i * 0.2,
                          }}
                        />
                      ))}
                    </>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
          </motion.div>

          {/* Enhanced Mobile Menu Toggle with better touch targets */}
          <div className="flex md:hidden items-center gap-2 sm:gap-3">
            <motion.div
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
            >
              <ThemeToggle />
            </motion.div>
            <motion.button
              whileTap={{ scale: 0.85, rotate: 90 }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="relative p-2.5 sm:p-3 rounded-xl bg-gradient-to-br from-secondary/80 to-secondary/60 border border-primary/20 hover:border-primary/40 active:border-primary/60 transition-all text-foreground backdrop-blur-sm shadow-lg overflow-hidden touch-manipulation"
              style={{ transformStyle: "preserve-3d" }}
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -180, scale: 0, opacity: 0 }}
                    animate={{ rotate: 0, scale: 1, opacity: 1 }}
                    exit={{ rotate: 180, scale: 0, opacity: 0 }}
                    transition={{ duration: 0.3, type: "spring" }}
                  >
                    <X className="w-5 h-5 sm:w-6 sm:h-6 relative z-10" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 180, scale: 0, opacity: 0 }}
                    animate={{ rotate: 0, scale: 1, opacity: 1 }}
                    exit={{ rotate: -180, scale: 0, opacity: 0 }}
                    transition={{ duration: 0.3, type: "spring" }}
                  >
                    <Menu className="w-5 h-5 sm:w-6 sm:h-6 relative z-10" />
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Enhanced pulse effect */}
              <motion.div
                className="absolute inset-0 rounded-xl bg-primary/20"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.4, 0, 0.4],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Rotating gradient border */}
              <motion.div
                className="absolute inset-0 rounded-xl"
                style={{
                  background: "conic-gradient(from 0deg, hsl(175 80% 50% / 0.3), transparent, hsl(175 80% 50% / 0.3))",
                  padding: "2px",
                }}
                animate={{ rotate: 360 }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Enhanced Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Enhanced Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[90] md:hidden bg-background/90 backdrop-blur-xl"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {/* Animated gradient overlay */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/10"
                animate={{
                  backgroundPosition: ["0% 0%", "100% 100%"],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </motion.div>

            {/* Enhanced Menu Panel - Better mobile responsiveness */}
            <motion.div
              initial={{ x: "100%", rotateY: 20, scale: 0.9 }}
              animate={{ x: 0, rotateY: 0, scale: 1 }}
              exit={{ x: "100%", rotateY: 20, scale: 0.9 }}
              transition={{ 
                type: "spring", 
                damping: 30, 
                stiffness: 300,
                mass: 0.8
              }}
              onClick={(e) => e.stopPropagation()}
              className="fixed right-0 top-0 bottom-0 w-[90%] sm:w-[85%] max-w-sm bg-gradient-to-br from-background via-background/98 to-background border-l-2 border-primary/30 shadow-2xl p-4 sm:p-6 flex flex-col backdrop-blur-2xl z-[95] relative overflow-hidden"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Multi-layer animated backgrounds */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-primary/8 opacity-60"
                animate={{
                  backgroundPosition: ["0% 0%", "100% 100%"],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />

              <motion.div
                className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(175_80%_50%_/_0.1),_transparent_50%)]"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Header - Responsive */}
              <div className="flex items-center justify-between mb-6 sm:mb-8 pb-3 sm:pb-4 border-b border-primary/30 relative z-10">
                <motion.span
                  className="font-display font-bold text-lg sm:text-xl bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  Menu
                </motion.span>
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  className="touch-manipulation"
                >
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="h-9 w-9 sm:h-10 sm:w-10"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                  </Button>
                </motion.div>
              </div>

              {/* Enhanced Navigation Links - Better touch targets */}
              <div className="flex-1 flex flex-col gap-2 sm:gap-3 relative z-10 overflow-y-auto -mx-4 sm:-mx-6 px-4 sm:px-6">
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    initial={{ opacity: 0, x: 40, rotateX: -20, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, rotateX: 0, scale: 1 }}
                    transition={{ 
                      delay: 0.1 + i * 0.05,
                      type: "spring",
                      stiffness: 200
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(link.href);
                    }}
                    whileHover={{ x: 8, scale: 1.03, rotateY: 5 }}
                    whileTap={{ scale: 0.95, x: 4 }}
                    onHoverStart={() => setHoveredLink(link.name)}
                    onHoverEnd={() => setHoveredLink(null)}
                    className={cn(
                      "flex items-center justify-between p-3.5 sm:p-4 rounded-xl text-base sm:text-lg font-medium transition-all group relative overflow-hidden touch-manipulation min-h-[3.5rem] sm:min-h-[4rem]",
                      activeSection === link.href.substring(1)
                        ? "bg-gradient-to-r from-primary/25 to-primary/15 text-primary border-2 border-primary/40 shadow-xl shadow-primary/20"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/60 border-2 border-transparent hover:border-primary/30 active:bg-secondary/40"
                    )}
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    {/* Multi-layer hover effects */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-primary/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                      initial={false}
                    />
                    
                    <motion.div
                      className="absolute inset-0 bg-primary/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"
                    />

                    <span className="relative z-10 flex items-center gap-2.5 sm:gap-3">
                      <span className="text-xl sm:text-2xl">{link.icon}</span>
                      <span className="text-sm sm:text-base">{link.name}</span>
                    </span>
                    
                    {activeSection === link.href.substring(1) && (
                      <motion.div
                        layoutId="activeDot"
                        className="w-3 h-3 rounded-full bg-primary shadow-lg shadow-primary/60 relative z-10"
                        initial={{ scale: 0 }}
                        animate={{ 
                          scale: [1, 1.3, 1],
                          rotate: [0, 360],
                        }}
                        transition={{ 
                          scale: {
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          },
                          rotate: {
                            duration: 3,
                            repeat: Infinity,
                            ease: "linear",
                          },
                        }}
                      />
                    )}
                    
                    {/* Enhanced arrow indicator */}
                    <motion.div
                      className="absolute right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                      animate={{
                        x: [0, 8, 0],
                        rotate: [0, 15, 0],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <Rocket className="w-4 h-4 text-primary" />
                    </motion.div>

                    {/* Shimmer effect */}
                    {hoveredLink === link.name && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        initial={{ x: "-100%" }}
                        animate={{ x: "200%" }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                    )}
                  </motion.a>
                ))}
              </div>

              {/* Enhanced Footer Actions - Responsive */}
              <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-primary/30 relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Button
                    className="w-full rounded-xl py-5 sm:py-6 text-base sm:text-lg font-semibold bg-gradient-to-r from-primary via-primary/90 to-primary hover:from-primary/90 hover:via-primary hover:to-primary/90 shadow-xl shadow-primary/30 mb-4 sm:mb-6 relative overflow-hidden group touch-manipulation"
                    onClick={() => scrollToSection("#contact")}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <span className="text-sm sm:text-base">Hire Me</span>
                      <motion.div
                        animate={{
                          rotate: [0, 360],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <Rocket className="w-4 h-4 sm:w-5 sm:h-5" />
                      </motion.div>
                    </span>
                    
                    {/* Enhanced shimmer */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                      animate={{
                        x: ["-100%", "200%"],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />

                    {/* Pulsing glow */}
                    <motion.div
                      className="absolute inset-0 bg-primary/30 blur-2xl"
                      animate={{
                        opacity: [0.3, 0.6, 0.3],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  </Button>
                </motion.div>

                <motion.div
                  className="flex justify-center gap-4 sm:gap-6 text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {[
                    { icon: Github, href: "#", color: "hover:text-[#333] dark:hover:text-[#f0f0f0]" },
                    { icon: Linkedin, href: "#", color: "hover:text-[#0077b5]" },
                    { icon: Mail, href: "#", color: "hover:text-[#ea4335]" },
                  ].map((social, i) => (
                    <motion.a
                      key={i}
                      href={social.href}
                      className={`p-2.5 sm:p-3 rounded-xl bg-secondary/60 border-2 border-primary/20 hover:border-primary/50 hover:bg-primary/15 active:bg-primary/20 transition-all ${social.color} relative overflow-hidden group touch-manipulation min-w-[2.75rem] min-h-[2.75rem] sm:min-w-[3rem] sm:min-h-[3rem] flex items-center justify-center`}
                      whileHover={{ scale: 1.2, rotate: 10, y: -4 }}
                      whileTap={{ scale: 0.85 }}
                      initial={{ opacity: 0, scale: 0, rotate: -180 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      transition={{ delay: 0.6 + i * 0.1, type: "spring", stiffness: 200 }}
                    >
                      <social.icon className="w-5 h-5 sm:w-6 sm:h-6 relative z-10 transition-colors" />
                      
                      {/* Hover glow */}
                      <motion.div
                        className="absolute inset-0 bg-primary/20 rounded-xl opacity-0 group-hover:opacity-100 blur-md"
                      />

                      {/* Rotating gradient border */}
                      <motion.div
                        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100"
                        style={{
                          background: "conic-gradient(from 0deg, hsl(175 80% 50% / 0.5), transparent, hsl(175 80% 50% / 0.5))",
                          padding: "2px",
                        }}
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                    </motion.a>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
