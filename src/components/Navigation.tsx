import { useEffect, useState, useRef } from "react";
import { Menu, X, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent, useMotionValue, useSpring } from "framer-motion";
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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollVelocity, setScrollVelocity] = useState(0);
  const navRef = useRef<HTMLElement>(null);
  const { scrollYProgress, scrollY } = useScroll();
  
  // 3D tilt effect with mouse tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [7, -7]), { stiffness: 150, damping: 15 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-7, 7]), { stiffness: 150, damping: 15 });
  
  // Scroll-based styling transforms (navbar always visible - no hiding transforms)
  const borderOpacity = useTransform(scrollY, [0, 50], [0, 1], { clamp: true });
  const shadowIntensity = useTransform(scrollY, [0, 100], [0, 0.35], { clamp: true });
  const backgroundOpacity = useTransform(scrollY, [0, 50, 100], [0.85, 0.92, 0.98], { clamp: true });
  const backdropBlur = useTransform(scrollY, [0, 50], [12, 20], { clamp: true });

  // Mouse tracking for 3D tilt effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!navRef.current) return;
      const rect = navRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
      mouseX.set(x);
      mouseY.set(y);
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const nav = navRef.current;
    if (nav) {
      nav.addEventListener("mousemove", handleMouseMove);
      nav.addEventListener("mouseleave", () => {
        mouseX.set(0);
        mouseY.set(0);
      });
    }

    return () => {
      if (nav) {
        nav.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, [mouseX, mouseY]);

  // Track scroll for styling and velocity effects (navbar always visible)
  useMotionValueEvent(scrollY, "change", (latest) => {
    const current = latest;
    const previous = lastScrollY;
    const velocity = Math.abs(current - previous);
    
    setScrollVelocity(velocity);
    
    // Always keep navbar visible
    setIsVisible(true);
    
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

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = "0px"; // Prevent layout shift
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Next-level Scroll Progress Bar with advanced effects */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] z-[9998] origin-left overflow-hidden"
        style={{ 
          scaleX: scrollYProgress,
          willChange: 'transform',
          backfaceVisibility: 'hidden',
          transform: 'translateZ(0)',
        }}
      >
        {/* Multi-layer gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/40 via-cyan-400/40 via-purple-500/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-cyan-400 via-purple-500 to-primary opacity-60 blur-sm" />
        
        {/* Animated shimmer wave */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 via-primary/40 to-transparent"
          animate={{
            x: ["-100%", "200%"],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        
        {/* Pulsing glow effect */}
        <motion.div
          className="absolute inset-0 bg-primary blur-md opacity-50"
          animate={{
            opacity: [0.3, 0.8, 0.3],
            scaleY: [1, 1.5, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Moving highlight */}
        <motion.div
          className="absolute top-0 h-full w-20 bg-gradient-to-r from-transparent via-white/80 to-transparent"
          style={{
            left: `${scrollYProgress.get() * 100}%`,
          }}
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
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
        initial={{ y: -100, opacity: 0 }}
        animate={{ 
          y: 0, 
          opacity: 1
        }}
        style={{ 
          transform: 'translateZ(0)',
          perspective: 1000,
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 25,
          mass: 0.5,
          opacity: { duration: 0.3, ease: "easeOut" },
        }}
      >
        {/* Cursor-following glow effect */}
        <motion.div
          className="absolute pointer-events-none z-0"
          style={{
            left: mousePosition.x - 150,
            top: mousePosition.y - 150,
            width: 300,
            height: 300,
            background: "radial-gradient(circle, hsl(var(--primary) / 0.15) 0%, transparent 70%)",
            borderRadius: "50%",
            filter: "blur(40px)",
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Scroll velocity energy waves - appear when scrolling fast */}
        <AnimatePresence>
          {scrollVelocity > 10 && (
            <motion.div
              className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-primary to-transparent"
                  style={{
                    left: `${25 + i * 25}%`,
                  }}
                  initial={{ scaleY: 0, opacity: 0 }}
                  animate={{
                    scaleY: [0, 1, 0],
                    opacity: [0, 0.8, 0],
                    filter: ["blur(0px)", "blur(2px)", "blur(0px)"],
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.2,
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        {/* Enhanced glassmorphism background with smooth scroll transition */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, hsl(var(--background) / 0.95) 0%, hsl(var(--background) / 0.92) 50%, hsl(var(--background) / 0.9) 100%)`,
            backdropFilter: `blur(${backdropBlur.get()}px) saturate(180%)`,
            WebkitBackdropFilter: `blur(${backdropBlur.get()}px) saturate(180%)`,
            boxShadow: `0 4px 24px 0 rgba(0, 0, 0, ${shadowIntensity.get()}), 0 1px 0 0 rgba(255, 255, 255, 0.05) inset`,
            borderBottom: `1px solid hsl(var(--primary) / ${borderOpacity.get() * 0.15})`,
            transition: "backdrop-filter 0.3s ease, box-shadow 0.3s ease",
          }}
        />

        {/* Morphing gradient overlay */}
        <motion.div
          className="absolute inset-0 opacity-30 mix-blend-overlay"
          style={{
            background: "radial-gradient(ellipse at top, hsl(var(--primary) / 0.2) 0%, transparent 50%)",
          }}
          animate={{
            scale: [1, 1.2, 1],
            x: ["0%", "10%", "0%"],
            y: ["0%", "-5%", "0%"],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Floating particles layer */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: Math.random() * 4 + 2,
                height: Math.random() * 4 + 2,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: `hsl(${210 + Math.random() * 60}, 70%, ${50 + Math.random() * 20}%)`,
                boxShadow: `0 0 ${Math.random() * 10 + 5}px currentColor`,
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, Math.random() * 20 - 10, 0],
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Advanced animated gradient border with multiple layers */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[2px] overflow-hidden"
          style={{
            opacity: borderOpacity,
          }}
        >
          <motion.div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(90deg, transparent 0%, hsl(var(--primary) / 0.6) 15%, hsl(var(--primary)) 30%, hsl(200, 100%, 60%) 50%, hsl(var(--primary)) 70%, hsl(var(--primary) / 0.6) 85%, transparent 100%)",
            }}
            animate={{
              x: ["-100%", "200%"],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          <motion.div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(90deg, transparent 0%, hsl(var(--primary) / 0.4) 20%, hsl(var(--primary)) 50%, hsl(var(--primary) / 0.4) 80%, transparent 100%)",
              filter: "blur(1px)",
            }}
          />
        </motion.div>

        {/* Top multi-layer shimmer border */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-[1px] overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: isScrolled ? 0.8 : 0.4 }}
          transition={{ duration: 0.3 }}
          aria-hidden="true"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/60 via-cyan-400/60 via-purple-500/60 to-transparent"
            style={{
              background: "linear-gradient(90deg, transparent 0%, hsl(var(--primary) / 0.6) 25%, hsl(200, 100%, 60%) 50%, hsl(270, 100%, 70%) 75%, transparent 100%)",
            }}
          />
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
            animate={{
              x: ["-100%", "200%"],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </motion.div>

        {/* Pulsing glow accent lines */}
        <motion.div
          className="absolute top-0 left-1/4 -translate-x-1/2 w-24 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent blur-md"
          animate={{
            opacity: [0.2, 0.9, 0.2],
            scaleX: [0.6, 1.4, 0.6],
            x: ["-50%", "-30%", "-50%"],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0,
          }}
        />
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 via-primary to-transparent blur-lg"
          animate={{
            opacity: [0.3, 1, 0.3],
            scaleX: [0.8, 1.5, 0.8],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />
        <motion.div
          className="absolute top-0 right-1/4 translate-x-1/2 w-24 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent blur-md"
          animate={{
            opacity: [0.2, 0.9, 0.2],
            scaleX: [0.6, 1.4, 0.6],
            x: ["50%", "30%", "50%"],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />

        <div className={`relative transition-all duration-300 ${
          isScrolled || isMobileMenuOpen
            ? "py-2 sm:py-3"
            : "py-4 sm:py-5"
        }`}>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex items-center justify-between gap-2 sm:gap-4 min-h-[44px]">
              {/* Next-level Logo with 3D effects and advanced interactions */}
          <motion.a
            href="#"
            className="font-signature text-lg sm:text-xl md:text-2xl lg:text-3xl text-foreground relative group flex items-center gap-1.5 sm:gap-2 min-w-0 flex-shrink-0"
            onClick={(e) => {
              e.preventDefault();
              scrollToTop();
            }}
                style={{
                  transformStyle: "preserve-3d",
                  perspective: 1000,
                }}
                whileHover={{ 
                  scale: 1.1, 
                  y: -3,
                  rotateX: 5,
                  rotateY: -5,
                  z: 20,
                }}
                whileTap={{ scale: 0.9, z: 0 }}
                whileFocus={{ 
                  outline: "2px solid hsl(var(--primary))", 
                  outlineOffset: "4px", 
                  borderRadius: "12px",
                  boxShadow: "0 0 30px hsl(var(--primary) / 0.6), 0 0 60px hsl(var(--primary) / 0.3)"
                }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                {/* Advanced multi-layer animated background glow */}
                <motion.div
                  className="absolute inset-0 -inset-x-3 -inset-y-2 rounded-2xl bg-gradient-to-r from-primary/30 via-cyan-400/25 via-purple-500/25 to-primary/30 opacity-0 blur-2xl"
                  whileHover={{ opacity: 1, scale: 1.3, rotate: [0, 360] }}
                  transition={{ duration: 0.5, rotate: { duration: 3, repeat: Infinity, ease: "linear" } }}
                />
                <motion.div
                  className="absolute inset-0 -inset-x-2 -inset-y-1 rounded-xl bg-gradient-to-br from-primary/20 via-transparent to-purple-500/20 opacity-0 blur-lg"
                  whileHover={{ opacity: 0.8, scale: 1.15 }}
                  transition={{ duration: 0.4 }}
                />
                
                {/* Orbiting particles around logo */}
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-primary rounded-full"
                    style={{
                      left: "50%",
                      top: "50%",
                    }}
              animate={{ 
                rotate: [0, 360],
                      x: [0, Math.cos((i * 120) * Math.PI / 180) * 30],
                      y: [0, Math.sin((i * 120) * Math.PI / 180) * 30],
                      opacity: [0.3, 0.8, 0.3],
                      scale: [0.5, 1.5, 0.5],
                    }}
                    transition={{
                      rotate: { duration: 4 + i, repeat: Infinity, ease: "linear" },
                      x: { duration: 4 + i, repeat: Infinity, ease: "easeInOut" },
                      y: { duration: 4 + i, repeat: Infinity, ease: "easeInOut" },
                      opacity: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 },
                      scale: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 },
                    }}
                  />
                ))}

                {/* Advanced Sparkle/Star with 3D rotation and particle trail */}
                <motion.span
                  className="relative flex-shrink-0 z-10"
                  style={{
                    transformStyle: "preserve-3d",
                  }}
                  animate={{ 
                    rotateY: [0, 360],
                    rotateX: [0, 15, 0],
                    scale: [1, 1.25, 1],
              }}
              transition={{ 
                    rotateY: { duration: 8, repeat: Infinity, ease: "linear" },
                    rotateX: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
                  whileHover={{ 
                    rotateY: [0, 720], 
                    rotateX: [0, 30, 0],
                    scale: 1.6,
                    filter: "brightness(1.8) drop-shadow(0 0 20px hsl(var(--primary)))",
                    z: 50,
                  }}
                >
                  <motion.div
                    style={{
                      transformStyle: "preserve-3d",
                    }}
                    animate={{
                      rotateZ: [0, 360],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-primary drop-shadow-2xl" />
                  </motion.div>
                  
                  {/* Advanced multi-layer glow with color shifting */}
              <motion.span
                    className="absolute inset-0 bg-primary/60 rounded-full blur-md -z-10"
                animate={{
                      opacity: [0.5, 1, 0.5],
                      scale: [1, 1.5, 1],
                      background: [
                        "radial-gradient(circle, hsl(var(--primary) / 0.6) 0%, transparent 70%)",
                        "radial-gradient(circle, hsl(200, 100%, 60% / 0.6) 0%, transparent 70%)",
                        "radial-gradient(circle, hsl(270, 100%, 70% / 0.6) 0%, transparent 70%)",
                        "radial-gradient(circle, hsl(var(--primary) / 0.6) 0%, transparent 70%)",
                      ],
                }}
                transition={{
                      duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
                  <motion.span
                    className="absolute inset-0 bg-cyan-400/40 rounded-full blur-xl -z-20"
                    animate={{
                      opacity: [0.3, 0.7, 0.3],
                      scale: [1.3, 1.8, 1.3],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.5,
                    }}
                  />
                  <motion.span
                    className="absolute inset-0 bg-purple-500/30 rounded-full blur-2xl -z-30"
                    animate={{
                      opacity: [0.2, 0.5, 0.2],
                      scale: [1.5, 2, 1.5],
                    }}
                    transition={{
                      duration: 3.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1,
                    }}
                  />
                  
                  {/* Particle trail effect */}
                  {[...Array(4)].map((_, i) => (
                    <motion.span
                      key={i}
                      className="absolute w-0.5 h-0.5 bg-primary rounded-full"
                      style={{
                        left: "50%",
                        top: "50%",
                      }}
                      animate={{
                        x: [0, Math.cos((i * 90) * Math.PI / 180) * 20],
                        y: [0, Math.sin((i * 90) * Math.PI / 180) * 20],
                        opacity: [0, 1, 0],
                        scale: [0, 1.5, 0],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeOut",
                        delay: i * 0.2,
                      }}
                    />
                  ))}
            </motion.span>

                {/* Advanced text with 3D effect and animated gradient */}
            <motion.span 
              className="relative z-10 italic font-light tracking-wider gradient-text truncate"
                  style={{
                    transformStyle: "preserve-3d",
                    background: "linear-gradient(135deg, hsl(var(--foreground)) 0%, hsl(var(--primary)) 50%, hsl(var(--foreground)) 100%)",
                    backgroundSize: "200% 200%",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                  animate={{
                    backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
                    textShadow: [
                      "0 0 10px hsl(var(--primary) / 0.3)",
                      "0 0 30px hsl(var(--primary) / 0.6), 0 0 60px hsl(var(--primary) / 0.3)",
                      "0 0 10px hsl(var(--primary) / 0.3)",
                    ],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    rotateY: 5,
                    z: 30,
                    textShadow: "0 0 40px hsl(var(--primary) / 0.8), 0 0 80px hsl(var(--primary) / 0.4)",
                  }}
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
            <>
              {/* Backdrop overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998] lg:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-hidden="true"
              />
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
              className="lg:hidden overflow-hidden relative z-[9999]"
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
            </>
          )}
        </AnimatePresence>
      </div>
        </div>
      </motion.nav>
    </>
  );
};
