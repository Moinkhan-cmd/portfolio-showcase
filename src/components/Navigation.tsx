import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/ThemeToggle";

const navLinks = [
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Experience", href: "#experience" },
  { name: "Contact", href: "#contact" },
];

const NavLink = ({
  link,
  isActive,
  onClick,
  index,
}: {
  link: { name: string; href: string };
  isActive: boolean;
  onClick: () => void;
  index: number;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1 * index, duration: 0.5 }}
      className="relative"
    >
      <button
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`text-sm font-medium transition-colors duration-200 relative px-4 py-2 rounded-lg overflow-hidden ${
          isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        {/* Animated background blob */}
        <motion.span
          className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent rounded-lg"
          initial={{ opacity: 0 }}
          animate={{
            opacity: isHovered || isActive ? 1 : 0,
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
            boxShadow:
              isHovered || isActive
                ? "0 0 20px hsl(175 80% 50% / 0.4), 0 0 40px hsl(175 80% 50% / 0.2)"
                : "0 0 0px hsl(175 80% 50% / 0)",
          }}
          transition={{ duration: 0.3 }}
        />

        <span className="relative z-10">{link.name}</span>

        {/* Active indicator */}
        {isActive && (
          <motion.span
            layoutId="activeSection"
            className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-primary to-primary/50"
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
          />
        )}
      </button>
    </motion.div>
  );
};

export const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

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
      rootMargin: "-20% 0px -70% 0px",
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.getAttribute("id");
          if (sectionId) {
            setActiveSection(sectionId);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

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

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "glass-card py-4" : "bg-transparent py-6"
      }`}
    >
      {/* Animated top border */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-0"
        animate={{
          opacity: isScrolled ? [0, 1, 0] : 0,
        }}
        transition={{
          opacity: { duration: 2, repeat: Infinity },
        }}
      />

      <div className="container mx-auto container-padding relative">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a
            href="#"
            className="font-signature text-xl sm:text-2xl md:text-3xl text-foreground relative group overflow-hidden transition-colors hover:text-primary"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <span className="relative z-10">Moinkhan Bhatti</span>
          </a>

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
            
            {/* Theme Toggle */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="ml-2"
            >
              <ThemeToggle />
            </motion.div>

            {/* Hire Me Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="relative ml-2"
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
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
                
                <span className="relative z-10 font-medium">Hire Me</span>
              </Button>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground p-2 relative"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <motion.div
              className="absolute inset-0 bg-primary/10 rounded-lg"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
            
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="relative z-10"
                >
                  <X size={24} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="relative z-10"
                >
                  <Menu size={24} />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
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
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                      onClick={() => scrollToSection(link.href)}
                      className={`transition-colors duration-200 text-left py-3 px-4 rounded-lg relative overflow-hidden group ${
                        isActive ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-primary/10"
                      }`}
                    >
                      <motion.span
                        className="absolute left-0 top-0 bottom-0 w-1 bg-primary"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isActive ? 1 : 0 }}
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                      <span className="relative z-10">{link.name}</span>
                    </motion.button>
                  );
                })}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: navLinks.length * 0.05, duration: 0.3 }}
                  className="flex items-center gap-3 mt-2"
                >
                  <ThemeToggle />
                  <Button
                    variant="hero"
                    size="sm"
                    onClick={() => scrollToSection("#contact")}
                    className="flex-1"
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
