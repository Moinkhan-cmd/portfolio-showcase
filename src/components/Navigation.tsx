import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";

const navLinks = [
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Experience", href: "#experience" },
  { name: "Contact", href: "#contact" },
];

const NavLink = ({ link, isActive, onClick, index }: { link: { name: string; href: string }; isActive: boolean; onClick: () => void; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const linkRef = useRef<HTMLButtonElement>(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const magnetStrength = 20;
  const magneticX = useSpring(useTransform(mouseX, [-100, 100], [-magnetStrength, magnetStrength]), {
    stiffness: 150,
    damping: 15,
  });
  const magneticY = useSpring(useTransform(mouseY, [-100, 100], [-magnetStrength, magnetStrength]), {
    stiffness: 150,
    damping: 15,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!linkRef.current) return;
    const rect = linkRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index, duration: 0.5 }}
      className="relative"
    >
      <motion.button
        ref={linkRef}
        onClick={onClick}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{ x: magneticX, y: magneticY }}
        className={`text-sm font-medium transition-colors duration-200 relative px-4 py-2 rounded-lg overflow-hidden ${
          isActive ? "text-primary" : "text-muted-foreground"
        }`}
        whileTap={{ scale: 0.95 }}
      >
        {/* Animated background blob */}
        <motion.span
          className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent rounded-lg"
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: isHovered || isActive ? 1 : 0,
            opacity: isHovered || isActive ? 1 : 0,
            rotate: isHovered ? 45 : 0,
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
        
        {/* Shimmer effect on hover */}
        {isHovered && (
          <motion.span
            className="absolute inset-0 overflow-hidden rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              animate={{
                x: ["-100%", "200%"],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{ width: "50%" }}
            />
          </motion.span>
        )}

        {/* Glow effect */}
        <motion.span
          className="absolute inset-0 rounded-lg blur-md"
          animate={{
            boxShadow: isHovered || isActive
              ? "0 0 20px hsl(175 80% 50% / 0.4), 0 0 40px hsl(175 80% 50% / 0.2)"
              : "0 0 0px hsl(175 80% 50% / 0)",
          }}
          transition={{ duration: 0.3 }}
        />

        <span className="relative z-10">{link.name}</span>

        {/* Active indicator with particle effect */}
        {isActive && (
          <>
            <motion.span
              layoutId="activeSection"
              className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-primary to-primary/50"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
            {/* Particle dots */}
            {[...Array(3)].map((_, i) => (
              <motion.span
                key={i}
                className="absolute bottom-0 left-1/2 w-1 h-1 bg-primary rounded-full"
                initial={{ opacity: 0, y: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  y: [0, -20, -40],
                  x: [0, (i - 1) * 10, (i - 1) * 15],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeOut",
                }}
              />
            ))}
          </>
        )}
      </motion.button>
    </motion.div>
  );
};

export const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const navRef = useRef<HTMLDivElement>(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Create a subtle parallax effect for the navbar background
  const navBgX = useSpring(useTransform(mouseX, [-500, 500], [-5, 5]), {
    stiffness: 100,
    damping: 30,
  });
  const navBgY = useSpring(useTransform(mouseY, [-500, 500], [-5, 5]), {
    stiffness: 100,
    damping: 30,
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Use IntersectionObserver for accurate section detection
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px', // Trigger when section is 20% from top
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.getAttribute('id');
          if (sectionId) {
            setActiveSection(sectionId);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all sections
    navLinks.forEach((link) => {
      const sectionId = link.href.substring(1);
      const element = document.getElementById(sectionId);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!navRef.current) return;
      const rect = navRef.current.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left - rect.width / 2);
      mouseY.set(e.clientY - rect.top - rect.height / 2);
    };

    window.addEventListener("mousemove", handleMouseMove);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mouseX, mouseY]);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.nav
      ref={navRef}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "glass-card py-4" : "bg-transparent py-6"
      }`}
    >
      {/* Animated background gradient that follows mouse */}
      <motion.div
        className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden rounded-2xl"
        style={{
          x: navBgX,
          y: navBgY,
        }}
      >
        <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent" />
      </motion.div>

      {/* Animated top border */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-0"
        animate={{
          opacity: isScrolled ? [0, 1, 0] : 0,
          x: isScrolled ? ["-100%", "100%"] : 0,
        }}
        transition={{
          opacity: { duration: 2, repeat: Infinity },
          x: { duration: 3, repeat: Infinity, ease: "linear" },
        }}
      />

      <div className="container mx-auto container-padding relative">
        <div className="flex items-center justify-between">
          {/* Enhanced Logo */}
          <motion.a
            href="#"
            className="font-signature text-2xl md:text-3xl text-foreground relative group overflow-hidden"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10">
              {Array.from("Moinkhan Bhatti").map((char, i) => (
                <motion.span
                  key={i}
                  className="inline-block"
                  whileHover={{
                    y: -5,
                    color: "hsl(175 80% 60%)",
                    transition: { duration: 0.2 },
                  }}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </span>
            
            {/* Animated background with particles */}
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/20 to-primary/10 rounded-lg -z-0"
              initial={{ scale: 0, opacity: 0, rotate: -180 }}
              whileHover={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ duration: 0.5, ease: "backOut" }}
            />
            
            {/* Glowing particles on hover */}
            {[...Array(6)].map((_, i) => (
              <motion.span
                key={i}
                className="absolute w-1 h-1 bg-primary rounded-full opacity-0 group-hover:opacity-100"
                style={{
                  left: `${20 + i * 12}%`,
                  top: "50%",
                }}
                animate={{
                  y: [0, -30, -50],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: "easeOut",
                }}
              />
            ))}
            
            {/* Animated underline */}
            <motion.span
              className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary via-primary/80 to-primary/50"
              initial={{ width: 0, opacity: 0 }}
              whileHover={{ width: "100%", opacity: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link, index) => (
              <NavLink
                key={link.name}
                link={link}
                index={index}
                isActive={activeSection === link.href.substring(1)}
                onClick={() => scrollToSection(link.href)}
              />
            ))}
            
            {/* Enhanced Hire Me Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="relative ml-2"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="hero"
                  size="sm"
                  onClick={() => scrollToSection("#contact")}
                  className="relative overflow-hidden group"
                >
                  {/* Animated background layers */}
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-primary/30 via-primary/20 to-primary/30"
                    animate={{
                      x: ["-100%", "100%"],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  
                  {/* Ripple effect */}
                  <motion.span
                    className="absolute inset-0 bg-primary/20 rounded-full"
                    initial={{ scale: 0, opacity: 1 }}
                    whileHover={{
                      scale: 2,
                      opacity: 0,
                    }}
                    transition={{ duration: 0.6 }}
                  />
                  
                  <span className="relative z-10 font-medium">Hire Me</span>
                  
                  {/* Glow effect */}
                  <motion.span
                    className="absolute inset-0 rounded-lg blur-xl opacity-0 group-hover:opacity-100"
                    style={{
                      boxShadow: "0 0 30px hsl(175 80% 50% / 0.6)",
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </Button>
              </motion.div>
              
              {/* Orbiting particles around button */}
              {[...Array(4)].map((_, i) => (
                <motion.span
                  key={i}
                  className="absolute w-1.5 h-1.5 bg-primary rounded-full pointer-events-none"
                  style={{
                    left: "50%",
                    top: "50%",
                  }}
                  animate={{
                    x: [0, Math.cos((i * Math.PI) / 2) * 40],
                    y: [0, Math.sin((i * Math.PI) / 2) * 40],
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.5,
                    ease: "easeOut",
                  }}
                />
              ))}
            </motion.div>
          </div>

          {/* Enhanced Mobile Menu Button */}
          <motion.button
            className="md:hidden text-foreground p-2 relative"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              className="absolute inset-0 bg-primary/10 rounded-lg"
              initial={{ scale: 0 }}
              whileHover={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            />
            
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="relative z-10"
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
                  className="relative z-10"
                >
                  <Menu size={24} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden"
            >
              <div className="flex flex-col gap-2 mt-4 pb-4">
                {navLinks.map((link, index) => {
                  const isActive = activeSection === link.href.substring(1);
                  return (
                    <motion.button
                      key={link.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                      onClick={() => scrollToSection(link.href)}
                      className={`transition-colors duration-200 text-left py-3 px-4 rounded-lg relative overflow-hidden group ${
                        isActive ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-primary/10"
                      }`}
                      whileTap={{ scale: 0.98 }}
                    >
                      <motion.span
                        className="absolute left-0 top-0 bottom-0 w-1 bg-primary"
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: isActive ? 1 : 0 }}
                        whileHover={{ scaleY: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                      <span className="relative z-10">{link.name}</span>
                    </motion.button>
                  );
                })}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: navLinks.length * 0.05, duration: 0.3 }}
                >
                  <Button
                    variant="hero"
                    size="sm"
                    onClick={() => scrollToSection("#contact")}
                    className="w-full mt-2"
                  >
                    Hire Me
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};
