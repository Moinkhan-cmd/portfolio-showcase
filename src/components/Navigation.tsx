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
  
  // Height transitions - Minimal reduction to maintain good layout
  const height = useSpring(
    useTransform(scrollY, [0, 50, 100], [88, 84, 80]),
    { stiffness: 150, damping: 25 }
  );
  
  // Background opacity with progressive enhancement - More visible
  const bgOpacity = useTransform(scrollY, [0, 30, 100, 300], [0, 0.85, 0.95, 0.98]);
  
  // Blur amount increases with scroll - More dramatic
  const blurAmount = useTransform(scrollY, [0, 30, 150, 300], [0, 10, 18, 24]);
  
  // Border color and width changes - More visible
  const borderOpacity = useTransform(scrollY, [0, 30, 150, 300], [0, 0.4, 0.6, 0.8]);
  const borderWidth = useTransform(scrollY, [0, 50, 150], [0, 1.5, 2]);
  
  // Shadow intensity increases with scroll - More dramatic
  const shadowIntensity = useTransform(scrollY, [0, 50, 200, 400], [0, 0.3, 0.5, 0.7]);

  // Glow intensity based on scroll - More visible
  const glowIntensity = useTransform(scrollY, [0, 100, 300, 500], [0, 0.4, 0.7, 0.9]);

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
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "glass-card py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto container-padding">
        <div className="flex items-center justify-between">
          <a
            href="#"
            className="font-signature text-2xl md:text-3xl text-foreground hover:text-primary transition-all duration-300 relative group"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <span className="relative z-10">Your Name</span>
            <span className="absolute inset-0 bg-primary/10 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 -z-0" />
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-primary/50 group-hover:w-full transition-all duration-300" />
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => scrollToSection(link.href)}
                className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm font-medium"
              >
                {link.name}
              </button>
            ))}
            <Button
              variant="hero"
              size="sm"
              onClick={() => scrollToSection("#contact")}
            >
              Hire Me
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 animate-fade-in">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => scrollToSection(link.href)}
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-left py-2"
                >
                  {link.name}
                </button>
              ))}
              <Button
                onClick={() => scrollToSection("#contact")}
                className="mt-2"
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
