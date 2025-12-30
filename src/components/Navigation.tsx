import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { motion } from "framer-motion";

const navLinks = [
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Experience", href: "#experience" },
  { name: "Contact", href: "#contact" },
] as const;

const NavLink = ({
  link,
  isActive,
  onClick,
}: {
  link: (typeof navLinks)[number];
  isActive: boolean;
  onClick: () => void;
}) => {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onClick}
        className={`group text-sm font-medium transition-colors duration-200 relative px-4 py-2 rounded-lg overflow-hidden ${
          isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <span
          className={`absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent rounded-lg transition-opacity duration-300 ${
            isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
          aria-hidden="true"
        />

        <span className="relative z-10">{link.name}</span>

        {isActive && (
          <span
            className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-primary to-primary/50"
            aria-hidden="true"
          />
        )}
      </button>
    </div>
  );
};

export const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      threshold: 0.1,
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
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        isScrolled ? "glass-card py-4" : "bg-transparent py-6"
      }`}
    >
      {/* Top border */}
      <div
        className={
          "absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent transition-opacity " +
          (isScrolled ? "opacity-100" : "opacity-0")
        }
        aria-hidden="true"
      />

      <div className="container mx-auto container-padding relative">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a
            href="#"
            className="font-signature text-xl sm:text-2xl md:text-3xl text-foreground relative group overflow-hidden transition-all duration-300 hover:text-primary hover:scale-105"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <span className="relative z-10 gradient-text-animated">Moinkhan Bhatti</span>
            <motion.span
              className="absolute inset-0 bg-primary/10 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              whileHover={{ scale: 1.2 }}
            />
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                link={link}
                isActive={activeSection === link.href.substring(1)}
                onClick={() => scrollToSection(link.href)}
              />
            ))}

            <div className="ml-2">
              <ThemeToggle />
            </div>

            <motion.div 
              className="relative ml-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="hero"
                size="sm"
                onClick={() => scrollToSection("#contact")}
                className="relative overflow-hidden glow-on-hover btn-lift"
              >
                <span
                  className="absolute inset-0 bg-gradient-to-r from-primary/25 via-primary/15 to-primary/25"
                  aria-hidden="true"
                />
                <span className="relative z-10 font-medium">Hire Me</span>
              </Button>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden text-foreground p-2 relative rounded-lg hover:bg-primary/10 transition-all duration-300"
            onClick={() => setIsMobileMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            type="button"
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const isActive = activeSection === link.href.substring(1);
                return (
                  <button
                    key={link.name}
                    type="button"
                    onClick={() => scrollToSection(link.href)}
                    className={`transition-colors duration-200 text-left py-3 px-4 rounded-lg relative overflow-hidden ${
                      isActive
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-primary/10"
                    }`}
                  >
                    <span
                      className={
                        "absolute left-0 top-0 bottom-0 w-1 bg-primary transition-opacity duration-200 " +
                        (isActive ? "opacity-100" : "opacity-0")
                      }
                      aria-hidden="true"
                    />
                    <span className="relative z-10">{link.name}</span>
                  </button>
                );
              })}

              <div className="flex items-center gap-3 mt-2">
                <ThemeToggle />
                <Button
                  variant="hero"
                  size="sm"
                  onClick={() => scrollToSection("#contact")}
                  className="flex-1"
                >
                  Hire Me
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
