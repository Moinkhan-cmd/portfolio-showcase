import { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { AudioVisualizer } from '@/components/AudioVisualizer';
import { AudioToggle } from '@/components/AudioToggle';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { scrollToSection as smoothScrollToSection, scrollToTop } from '@/components/SmoothScroll';
import { useAudioContext } from '@/hooks/useAudioFeedback';
import { getDeviceFlags } from '@/lib/device';
import { MagneticButton } from '@/components/MagneticButton';

const navLinks = [
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Projects', href: '#projects' },
  { name: 'Experience', href: '#experience' },
  { name: 'Certifications', href: '#certifications' },
  { name: 'Contact', href: '#contact' },
] as const;

// Animation variants for mobile menu
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const drawerVariants = {
  hidden: { x: '100%' },
  visible: { 
    x: 0,
    transition: { 
      type: 'spring' as const, 
      damping: 30, 
      stiffness: 300,
      mass: 0.8,
    }
  },
  exit: { 
    x: '100%',
    transition: { 
      type: 'spring' as const, 
      damping: 40, 
      stiffness: 400,
    }
  },
};

const ctaVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { delay: 0.4, duration: 0.3 }
  },
  exit: { opacity: 0, y: 20 },
};

// Mobile Menu Component - rendered via Portal with smooth animations
const MobileMenu = ({ 
  isOpen, 
  onClose, 
  activeSection,
  scrollToSection,
  playHoverSound,
  playClickSound,
}: { 
  isOpen: boolean; 
  onClose: () => void;
  activeSection: string;
  scrollToSection: (href: string) => void;
  playHoverSound: () => void;
  playClickSound: () => void;
}) => {
  return createPortal(
    <AnimatePresence mode="wait">
      {isOpen && (
        <div id="mobile-menu-root">
          {/* Animated Backdrop */}
          <motion.div 
            onClick={onClose}
            className="fixed inset-0 w-screen h-screen bg-black/70 backdrop-blur-sm z-[99998]"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.2 }}
          />
          
          {/* Animated Drawer Panel */}
          <motion.div
            className="fixed top-0 right-0 w-[85vw] max-w-[320px] h-screen bg-white/[0.08] dark:bg-black/80 backdrop-blur-2xl border-l border-white/20 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] z-[99999] flex flex-col"
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/30">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15, duration: 0.2 }}
              >
                <ThemeToggle />
              </motion.div>
              <motion.button 
                onClick={onClose}
                className="p-2.5 rounded-xl bg-white/[0.08] dark:bg-white/[0.05] backdrop-blur-xl border border-white/20 dark:border-white/10 hover:bg-white/[0.12] dark:hover:bg-white/[0.08] transition-colors"
                aria-label="Close menu"
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <X className="w-6 h-6 text-foreground" />
              </motion.button>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
              {navLinks.map((link, index) => {
                const isActive = activeSection === link.href.substring(1);
                return (
                  <motion.button
                    key={link.name}
                    onClick={() => { playClickSound(); scrollToSection(link.href); }}
                    onMouseEnter={playHoverSound}
                    className={cn(
                      "w-full text-left p-4 rounded-xl text-lg font-medium transition-colors",
                      isActive 
                        ? "bg-primary/15 text-primary border border-primary/30 backdrop-blur-xl" 
                        : "bg-white/[0.06] dark:bg-white/[0.04] border border-white/10 text-foreground hover:bg-white/[0.1] dark:hover:bg-white/[0.06]"
                    )}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ 
                      opacity: 1, 
                      x: 0,
                      transition: { delay: 0.1 + index * 0.05, duration: 0.3 }
                    }}
                    exit={{ opacity: 0, x: 20 }}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="flex items-center justify-between">
                      {link.name}
                      {isActive && (
                        <motion.span 
                          className="w-2 h-2 rounded-full bg-primary"
                          layoutId="activeIndicator"
                        />
                      )}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            {/* CTA Button */}
            <motion.div 
              className="p-4 border-t border-border/30"
              variants={ctaVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <Button 
                onClick={() => { playClickSound(); scrollToSection('#contact'); }} 
                onMouseEnter={playHoverSound}
                className="w-full rounded-xl font-semibold py-6 text-lg gap-2 shadow-lg shadow-primary/20" 
                size="lg"
              >
                Let's Talk
                <ArrowUpRight className="w-5 h-5" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  
  // Audio feedback - wrapped in try/catch for when used outside provider
  let playHoverSound = () => {};
  let playClickSound = () => {};
  try {
    const audio = useAudioContext();
    playHoverSound = () => audio.playSound("hover");
    playClickSound = () => audio.playSound("click");
  } catch {
    // Audio context not available
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return;
    if (getDeviceFlags().isRealMobile) return;
    if (typeof IntersectionObserver === "undefined") return;

    let observer: IntersectionObserver | null = null;

    try {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(entry.target.id);
            }
          });
        },
        { rootMargin: "-30% 0px -50% 0px", threshold: 0.1 }
      );
    } catch (error) {
      console.warn("Navigation: IntersectionObserver init failed", error);
      return;
    }

    if (!observer) return;

    navLinks.forEach((link) => {
      const element = document.getElementById(link.href.substring(1));
      if (element) observer.observe(element);
    });

    return () => observer?.disconnect();
  }, []);

  const scrollToSection = useCallback((href: string) => {
    const sectionId = href.substring(1);
    
    // Dispatch custom event for section transition
    try {
      window.dispatchEvent(
        new CustomEvent("sectionNavigate", {
          detail: { sectionId },
        })
      );
    } catch {
      // ignore
    }
    
    smoothScrollToSection(href, 80);
    setIsMobileMenuOpen(false);
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  return (
    <>
      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out',
          isScrolled ? 'py-1.5 xs:py-2 sm:py-2.5' : 'py-2 xs:py-2.5 sm:py-3 md:py-4'
        )}
      >
        <div
          className={cn(
            'mx-auto flex items-center justify-between transition-all duration-300 ease-out',
            isScrolled
              ? 'w-[96%] xs:w-[95%] max-w-6xl rounded-xl xs:rounded-2xl px-2.5 xs:px-3 sm:px-4 md:px-6 py-1.5 xs:py-2 sm:py-2.5 bg-white/[0.08] dark:bg-white/[0.05] backdrop-blur-2xl border border-white/20 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]'
              : 'w-full max-w-7xl px-3 xs:px-4 sm:px-6 md:px-8 py-1.5 xs:py-2 bg-transparent'
          )}
        >
          <a
            href="#"
            className="relative flex items-center gap-1.5 xs:gap-2 group shrink-0"
            onClick={(e) => {
              e.preventDefault();
              scrollToTop();
            }}
            aria-label="Go to top"
          >
            <motion.div
              className="relative w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg xs:rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 text-primary border border-primary/30 group-hover:border-primary/60 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="font-signature font-bold text-base xs:text-lg sm:text-xl">M</span>
            </motion.div>
            <div className="hidden xs:block transition-all duration-300">
              <span className="font-display font-bold text-sm xs:text-base sm:text-lg tracking-tight">
                Moin<span className="text-primary">.dev</span>
              </span>
            </div>
          </a>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-0.5 lg:gap-1 p-0.5 lg:p-1 rounded-full bg-white/[0.06] dark:bg-white/[0.04] border border-white/15 dark:border-white/10 backdrop-blur-xl">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.substring(1);
              return (
                <MagneticButton
                  key={link.name}
                  onClick={() => { playClickSound(); scrollToSection(link.href); }}
                  onMouseEnter={playHoverSound}
                  className={cn(
                    'relative px-2.5 lg:px-4 py-1.5 lg:py-2 text-xs lg:text-sm font-medium transition-colors duration-300 rounded-full whitespace-nowrap',
                    isActive 
                      ? 'text-primary-foreground' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-white/[0.08] hover:shadow-[0_0_12px_rgba(139,92,246,0.15)]'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                  strength={0.25}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-primary rounded-full"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{link.name}</span>
                </MagneticButton>
              );
            })}
          </div>

          {/* Right side buttons */}
          <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-2">
            {/* Audio controls - visible on all screen sizes */}
            <div className="hidden xs:flex items-center">
              <AudioVisualizer />
            </div>
            <AudioToggle />
            {/* Theme toggle - always visible */}
            <ThemeToggle />
            <Button
              onClick={() => { playClickSound(); scrollToSection('#contact'); }}
              onMouseEnter={playHoverSound}
              size={isScrolled ? 'sm' : 'default'}
              className={cn(
                'hidden sm:flex rounded-full font-semibold gap-1.5 lg:gap-2 transition-all duration-300 text-xs lg:text-sm',
                'shadow-[0_0_20px_rgba(139,92,246,0.2)] hover:shadow-[0_0_30px_rgba(139,92,246,0.4)]',
                isScrolled ? 'px-3 lg:px-4' : 'px-4 lg:px-5'
              )}
            >
              <span>Let's Talk</span>
              <ArrowUpRight className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
            </Button>
            
            {/* Hamburger Button - Only visible on mobile/tablet */}
            <button
              onClick={() => { playClickSound(); setIsMobileMenuOpen(true); }}
              className="lg:hidden flex items-center justify-center min-h-[40px] min-w-[40px] p-2 rounded-xl bg-white/[0.08] dark:bg-white/[0.05] backdrop-blur-xl border border-white/20 dark:border-white/10 hover:bg-white/[0.12] dark:hover:bg-white/[0.08] transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu - Rendered via Portal directly into document.body */}
      <MobileMenu 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        activeSection={activeSection}
        scrollToSection={scrollToSection}
        playHoverSound={playHoverSound}
        playClickSound={playClickSound}
      />
    </>
  );
};
