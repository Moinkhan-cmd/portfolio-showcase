import { useEffect, useState } from "react";
import { Menu, X, Code2, Rocket, Github, Linkedin, Mail, Sparkles } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { motion, AnimatePresence, useScroll, useMotionValueEvent, useSpring, useTransform } from "framer-motion";
import { EnhancedNavLink } from "./EnhancedNavLink";
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

  // Progressive scroll-based transforms
  const scrollProgress = useTransform(scrollY, [0, 500], [0, 1]);
  
  // Height transitions with different breakpoints
  const height = useSpring(
    useTransform(scrollY, [0, 50, 100], [88, 72, 64]),
    { stiffness: 150, damping: 25 }
  );
  
  // Background opacity with progressive enhancement
  const bgOpacity = useTransform(scrollY, [0, 50, 200, 500], [0, 0.6, 0.85, 0.95]);
  
  // Blur amount increases with scroll
  const blurAmount = useTransform(scrollY, [0, 50, 200], [0, 8, 16]);
  
  // Border color and width changes
  const borderOpacity = useTransform(scrollY, [0, 50, 200], [0, 0.2, 0.4]);
  const borderWidth = useTransform(scrollY, [0, 100], [0, 1]);
  
  // 3D rotation based on scroll
  const rotateX = useTransform(scrollY, [0, 500], [0, -2]);
  const scale = useTransform(scrollY, [0, 100], [1, 0.98]);
  
  // Shadow intensity increases with scroll
  const shadowIntensity = useTransform(scrollY, [0, 200], [0, 0.3]);
  
  // Logo scale on scroll
  const logoScale = useTransform(scrollY, [0, 100], [1, 0.9]);

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
          borderBottomWidth: borderWidth,
          borderBottomStyle: "solid",
          borderBottomColor: useTransform(borderOpacity, (v) => `hsl(175 80% 50% / ${v})`),
          rotateX,
          scale,
          boxShadow: useTransform(
            shadowIntensity,
            (v) => `0 10px 40px -10px hsl(175 80% 50% / ${v}), 0 4px 20px -5px hsl(0 0% 0% / ${v * 0.5})`
          ),
          transformStyle: "preserve-3d",
        }}
      >
        {/* Animated gradient background on scroll */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: useTransform(scrollY, [100, 300], [0, 0.15]),
            background: "linear-gradient(90deg, hsl(175 80% 50% / 0.1) 0%, transparent 50%, hsl(175 80% 50% / 0.1) 100%)",
          }}
        />

        {/* Shimmer effect on scroll */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: useTransform(scrollY, [200, 400], [0, 0.3]),
            background: "linear-gradient(110deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%)",
            backgroundSize: "200% 100%",
            backgroundPosition: useTransform(scrollProgress, [0, 1], ["0% 0%", "200% 0%"]),
          }}
        />

        {/* Floating particles effect on deep scroll */}
        <AnimatePresence>
          {scrollY.get() > 300 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 pointer-events-none overflow-hidden"
            >
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-primary rounded-full"
                  initial={{
                    x: `${Math.random() * 100}%`,
                    y: "50%",
                    opacity: 0,
                  }}
                  animate={{
                    y: ["50%", "-50%", "50%"],
                    opacity: [0, 0.6, 0],
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: i * 0.5,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="container h-full mx-auto px-4 md:px-6 lg:px-8 flex items-center justify-between relative z-10">
          {/* Enhanced Logo Section with 3D effects */}
          <motion.div
            className="flex items-center gap-3 cursor-pointer group relative"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            initial={{ opacity: 0, x: -20, rotateY: -20 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 0.6, type: "spring" }}
            whileHover={{ scale: 1.05 }}
            style={{ scale: logoScale }}
          >
            {/* 3D Logo Container */}
            <motion.div
              className="relative flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-primary via-primary/80 to-primary/60 shadow-lg shadow-primary/30 group-hover:shadow-primary/50 transition-all duration-300"
              whileHover={{ 
                rotateY: 15,
                rotateX: 5,
                scale: 1.1,
              }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <Code2 className="w-5 h-5 md:w-6 md:h-6 text-background relative z-10" />
              
              {/* Animated glow */}
              <motion.div
                className="absolute inset-0 rounded-xl bg-white/30"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              
              {/* 3D shine effect */}
              <motion.div
                className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/40 via-transparent to-transparent"
                animate={{
                  backgroundPosition: ["0% 0%", "100% 100%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>

            <div className="flex flex-col">
              <motion.span
                className="font-display font-bold text-lg md:text-xl tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground to-foreground/70 group-hover:from-primary group-hover:via-primary/90 group-hover:to-primary transition-all duration-300"
                whileHover={{ x: 2 }}
              >
                Moin Khan
              </motion.span>
              <motion.span
                className="text-[10px] md:text-xs text-muted-foreground font-medium tracking-wide"
                whileHover={{ x: 2 }}
              >
                Portfolio
              </motion.span>
            </div>

            {/* Decorative sparkles */}
            <motion.div
              className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity"
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Sparkles className="w-3 h-3 text-primary" />
            </motion.div>
          </motion.div>

          {/* Enhanced Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <motion.ul
              className="flex items-center gap-1 p-1.5 rounded-2xl bg-background/30 backdrop-blur-md border border-primary/10"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {navLinks.map((link, index) => (
                <EnhancedNavLink
                  key={link.name}
                  link={link}
                  isActive={activeSection === link.href.substring(1)}
                  onClick={() => scrollToSection(link.href)}
                  index={index}
                />
              ))}
            </motion.ul>
          </nav>

          {/* Tablet Navigation (simplified) */}
          <nav className="hidden md:flex lg:hidden items-center gap-1">
            <motion.ul
              className="flex items-center gap-0.5 p-1 rounded-xl bg-background/20 backdrop-blur-sm border border-primary/10"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              {navLinks.slice(0, 4).map((link, index) => (
                <EnhancedNavLink
                  key={link.name}
                  link={link}
                  isActive={activeSection === link.href.substring(1)}
                  onClick={() => scrollToSection(link.href)}
                  index={index}
                />
              ))}
            </motion.ul>
          </nav>

          {/* Desktop Actions */}
          <motion.div
            className="hidden md:flex items-center gap-3 lg:gap-4"
            initial={{ opacity: 0, x: 20, rotateY: 20 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 0.6, delay: 0.3, type: "spring" }}
          >
            <ThemeToggle />
            <div className="h-6 w-px bg-gradient-to-b from-transparent via-border to-transparent" />
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={() => scrollToSection("#contact")}
                className="relative overflow-hidden rounded-full px-5 lg:px-6 group bg-gradient-to-r from-primary via-primary/90 to-primary hover:from-primary/90 hover:via-primary hover:to-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all border border-primary/20"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <span className="hidden lg:inline">Let's Talk</span>
                  <span className="lg:hidden">Talk</span>
                  <motion.div
                    animate={{
                      rotate: [0, 15, -15, 0],
                      y: [0, -2, 2, 0],
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
                
                {/* Enhanced shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
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
                <motion.div
                  className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </Button>
            </motion.div>
          </motion.div>

          {/* Mobile Menu Toggle with 3D effect */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <motion.button
              whileTap={{ scale: 0.85, rotate: 90 }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="relative p-2.5 rounded-xl bg-gradient-to-br from-secondary/80 to-secondary/60 border border-primary/20 hover:border-primary/40 transition-all text-foreground backdrop-blur-sm shadow-md"
              style={{ transformStyle: "preserve-3d" }}
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
                    <X className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 180, scale: 0, opacity: 0 }}
                    animate={{ rotate: 0, scale: 1, opacity: 1 }}
                    exit={{ rotate: -180, scale: 0, opacity: 0 }}
                    transition={{ duration: 0.3, type: "spring" }}
                  >
                    <Menu className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Pulse effect */}
              <motion.div
                className="absolute inset-0 rounded-xl bg-primary/20"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Enhanced Mobile Menu Overlay with 3D effects */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[90] md:hidden bg-background/80 backdrop-blur-md"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu Panel with 3D slide */}
            <motion.div
              initial={{ x: "100%", rotateY: 15 }}
              animate={{ x: 0, rotateY: 0 }}
              exit={{ x: "100%", rotateY: 15 }}
              transition={{ 
                type: "spring", 
                damping: 30, 
                stiffness: 300,
                mass: 0.8
              }}
              onClick={(e) => e.stopPropagation()}
              className="fixed right-0 top-0 bottom-0 w-[85%] max-w-sm bg-gradient-to-br from-background via-background/95 to-background border-l border-primary/20 shadow-2xl p-6 flex flex-col backdrop-blur-xl z-[95]"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Animated background gradient */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-50"
                animate={{
                  backgroundPosition: ["0% 0%", "100% 100%"],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />

              {/* Header */}
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-primary/20 relative z-10">
                <motion.span
                  className="font-display font-bold text-xl bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  Menu
                </motion.span>
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                    <X className="w-5 h-5" />
                  </Button>
                </motion.div>
              </div>

              {/* Navigation Links */}
              <div className="flex-1 flex flex-col gap-2 relative z-10 overflow-y-auto">
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    initial={{ opacity: 0, x: 30, rotateX: -15 }}
                    animate={{ opacity: 1, x: 0, rotateX: 0 }}
                    transition={{ 
                      delay: 0.1 + i * 0.05,
                      type: "spring",
                      stiffness: 200
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(link.href);
                    }}
                    whileHover={{ x: 5, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-xl text-lg font-medium transition-all group relative overflow-hidden",
                      activeSection === link.href.substring(1)
                        ? "bg-gradient-to-r from-primary/20 to-primary/10 text-primary border border-primary/30 shadow-lg shadow-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50 border border-transparent hover:border-primary/20"
                    )}
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    {/* Hover gradient */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                      initial={false}
                    />
                    
                    <span className="relative z-10">{link.name}</span>
                    
                    {activeSection === link.href.substring(1) && (
                      <motion.div
                        layoutId="activeDot"
                        className="w-2.5 h-2.5 rounded-full bg-primary shadow-lg shadow-primary/50 relative z-10"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring" }}
                      />
                    )}
                    
                    {/* Arrow indicator */}
                    <motion.div
                      className="absolute right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                      animate={{
                        x: [0, 5, 0],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <Rocket className="w-4 h-4 text-primary" />
                    </motion.div>
                  </motion.a>
                ))}
              </div>

              {/* Footer Actions */}
              <div className="mt-8 pt-8 border-t border-primary/20 relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Button
                    className="w-full rounded-xl py-6 text-lg font-semibold bg-gradient-to-r from-primary via-primary/90 to-primary hover:from-primary/90 hover:via-primary hover:to-primary/90 shadow-xl shadow-primary/20 mb-6 relative overflow-hidden"
                    onClick={() => scrollToSection("#contact")}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Hire Me
                      <Rocket className="w-5 h-5" />
                    </span>
                    
                    {/* Shimmer */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      animate={{
                        x: ["-100%", "200%"],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  </Button>
                </motion.div>

                <motion.div
                  className="flex justify-center gap-6 text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {[
                    { icon: Github, href: "#" },
                    { icon: Linkedin, href: "#" },
                    { icon: Mail, href: "#" },
                  ].map((social, i) => (
                    <motion.a
                      key={i}
                      href={social.href}
                      className="p-3 rounded-xl bg-secondary/50 border border-primary/20 hover:border-primary/40 hover:bg-primary/10 transition-all"
                      whileHover={{ scale: 1.15, rotate: 5, y: -3 }}
                      whileTap={{ scale: 0.9 }}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + i * 0.1, type: "spring" }}
                    >
                      <social.icon className="w-5 h-5 hover:text-primary transition-colors" />
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
