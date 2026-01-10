import { useEffect, useState, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { SoundToggle } from '@/components/SoundToggle';
import { PerformanceToggle } from '@/components/PerformanceToggle';
import { AudioVisualizer } from '@/components/AudioVisualizer';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { scrollToSection as smoothScrollToSection, scrollToTop } from '@/components/SmoothScroll';
import { playSectionTransitionSound, initSoundSystem } from '@/lib/sounds';

const navLinks = [
  { name: 'Skills', href: '#skills' },
  { name: 'Projects', href: '#projects' },
  { name: 'Experience', href: '#experience' },
  { name: 'Certifications', href: '#certifications' },
  { name: 'Contact', href: '#contact' },
  { name: 'About', href: '#about' },
] as const;

// Mobile Menu Component - rendered via Portal to escape all parent CSS
type MobileMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  activeSection: string;
  scrollToSection: (href: string) => void;
};

const MobileMenu = ({ isOpen, onClose, activeSection, scrollToSection }: MobileMenuProps) => {
  const shouldReduceMotion = useReducedMotion();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  const aboutLink = navLinks.find((l) => l.name === 'About');
  const primaryLinks = navLinks.filter((l) => l.name !== 'About');

  useEffect(() => {
    if (!isOpen) return;
    previouslyFocusedElement.current = document.activeElement as HTMLElement | null;
    const raf = window.requestAnimationFrame(() => closeButtonRef.current?.focus());
    return () => window.cancelAnimationFrame(raf);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) return;
    previouslyFocusedElement.current?.focus?.();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleFocusTrap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const root = panelRef.current;
      if (!root) return;

      const focusable = Array.from(
        root.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true');

      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (e.shiftKey) {
        if (!active || active === first) {
          e.preventDefault();
          last.focus();
        }
        return;
      }

      if (active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleFocusTrap);
    return () => document.removeEventListener('keydown', handleFocusTrap);
  }, [isOpen]);

  if (typeof document === 'undefined') return null;

  const transition = shouldReduceMotion
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: 420, damping: 42 };

  const backdropTransition = shouldReduceMotion ? { duration: 0 } : { duration: 0.25 };

  const listVariants = {
    hidden: {},
    show: {
      transition: shouldReduceMotion
        ? { duration: 0 }
        : { staggerChildren: 0.06, delayChildren: 0.06 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 14, filter: 'blur(6px)' },
    show: { opacity: 1, x: 0, filter: 'blur(0px)' },
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          id="mobile-menu-root"
          className="fixed inset-0 z-[99999] lg:hidden"
          aria-hidden={!isOpen}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={backdropTransition}
            onClick={onClose}
          />

          {/* Drawer Panel */}
          <motion.div
            ref={panelRef}
            id="mobile-menu-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            className={cn(
              'absolute right-0 top-0 h-full w-[86vw] max-w-[360px] border-l border-border/40',
              'bg-background/95 backdrop-blur-xl shadow-2xl',
              'flex flex-col overflow-hidden'
            )}
            initial={{ x: '100%', opacity: 1 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 1 }}
            transition={transition}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Subtle animated glow */}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/20 blur-3xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={shouldReduceMotion ? { opacity: 0.35 } : { opacity: [0.25, 0.45, 0.25], scale: [0.9, 1.05, 0.9] }}
              transition={shouldReduceMotion ? { duration: 0 } : { duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between px-4 py-4 border-b border-border/30">
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <div className="flex items-center gap-1">
                  <AudioVisualizer />
                  <SoundToggle />
                  <PerformanceToggle />
                </div>
              </div>

              <motion.button
                ref={closeButtonRef}
                onClick={onClose}
                className={cn(
                  'flex items-center justify-center min-h-[44px] min-w-[44px] p-2 rounded-xl',
                  'glass-card hover:bg-secondary/80 transition-colors'
                )}
                whileTap={{ scale: shouldReduceMotion ? 1 : 0.96 }}
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </motion.button>
            </div>

            {/* Links */}
            <div className="relative z-10 flex-1 overflow-y-auto px-4 py-4">
              <motion.div
                variants={listVariants}
                initial="hidden"
                animate="show"
                className="flex flex-col gap-2"
              >
                {primaryLinks.map((link) => {
                  const isActive = activeSection === link.href.substring(1);
                  return (
                    <motion.button
                      key={link.name}
                      variants={itemVariants}
                      onClick={() => scrollToSection(link.href)}
                      className={cn(
                        'group w-full text-left px-4 py-4 rounded-xl text-[17px] font-medium',
                        'transition-colors duration-200',
                        isActive
                          ? 'bg-primary/15 text-primary ring-1 ring-primary/25'
                          : 'bg-secondary/30 text-foreground hover:bg-secondary/50'
                      )}
                      whileHover={shouldReduceMotion ? undefined : { x: 2 }}
                      whileTap={{ scale: shouldReduceMotion ? 1 : 0.99 }}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <span className="flex items-center justify-between">
                        <span>{link.name}</span>
                        <ArrowUpRight
                          className={cn(
                            'w-4 h-4 opacity-70 transition-transform',
                            isActive ? 'translate-x-0' : 'group-hover:translate-x-0.5'
                          )}
                        />
                      </span>
                    </motion.button>
                  );
                })}
              </motion.div>
            </div>

            {/* Bottom area (About link + CTA) */}
            <div className="relative z-10 px-4 pt-3 pb-4 border-t border-border/30 space-y-3">
              {aboutLink && (
                <motion.button
                  onClick={() => scrollToSection(aboutLink.href)}
                  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
                  animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                  transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.28, delay: 0.08 }}
                  className={cn(
                    'w-full text-left rounded-xl p-4',
                    'bg-gradient-to-r from-primary/15 via-secondary/20 to-purple-500/10',
                    'border border-border/30 hover:border-primary/30',
                    'transition-colors'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-muted-foreground">Learn more</div>
                      <div className="text-base font-semibold text-foreground">About Me</div>
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-primary" />
                  </div>
                </motion.button>
              )}

              <Button
                onClick={() => scrollToSection('#contact')}
                className="w-full rounded-xl font-semibold py-6 text-lg gap-2"
                size="lg"
              >
                Let's Talk
                <ArrowUpRight className="w-5 h-5" />
              </Button>
            </div>
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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-30% 0px -50% 0px', threshold: 0.1 }
    );

    navLinks.forEach((link) => {
      const element = document.getElementById(link.href.substring(1));
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = useCallback((href: string) => {
    const sectionId = href.substring(1);
    
    // Play sound and dispatch navigation event
    initSoundSystem();
    playSectionTransitionSound();
    
    window.dispatchEvent(new CustomEvent('sectionNavigate', { 
      detail: { sectionId } 
    }));
    
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
              ? 'w-[96%] xs:w-[95%] max-w-6xl rounded-xl xs:rounded-2xl px-2.5 xs:px-3 sm:px-4 md:px-6 py-1.5 xs:py-2 sm:py-2.5 bg-background/90 backdrop-blur-xl border border-border/30 shadow-lg'
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
          <div className="hidden lg:flex items-center gap-0.5 lg:gap-1 p-0.5 lg:p-1 rounded-full bg-secondary/50 border border-border/30 backdrop-blur-sm">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.substring(1);
              return (
                <button
                  key={link.name}
                  onClick={() => scrollToSection(link.href)}
                  className={cn(
                    'relative px-2.5 lg:px-4 py-1.5 lg:py-2 text-xs lg:text-sm font-medium transition-all duration-300 rounded-full whitespace-nowrap',
                    isActive ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-primary rounded-full"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{link.name}</span>
                </button>
              );
            })}
          </div>

          {/* Right side buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="shrink-0 hidden sm:flex items-center gap-1">
              <AudioVisualizer />
              <SoundToggle />
              <PerformanceToggle />
            </div>
            <div className="shrink-0"><ThemeToggle /></div>
            <Button
              onClick={() => scrollToSection('#contact')}
              size={isScrolled ? 'sm' : 'default'}
              className={cn(
                'hidden sm:flex rounded-full font-semibold gap-1.5 lg:gap-2 transition-all duration-300 text-xs lg:text-sm',
                'shadow-[0_0_20px_rgba(45,212,191,0.2)] hover:shadow-[0_0_30px_rgba(45,212,191,0.4)]',
                isScrolled ? 'px-3 lg:px-4' : 'px-4 lg:px-5'
              )}
            >
              <span>Let's Talk</span>
              <ArrowUpRight className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
            </Button>
            
            {/* Hamburger Button - Only visible on mobile/tablet */}
            <motion.button
              onClick={() => setIsMobileMenuOpen((v) => !v)}
              className="lg:hidden flex items-center justify-center min-h-[44px] min-w-[44px] p-2 rounded-xl glass-card hover:bg-secondary/80"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu-panel"
              whileTap={{ scale: 0.96 }}
            >
              <AnimatePresence initial={false} mode="wait">
                {isMobileMenuOpen ? (
                  <motion.span
                    key="x"
                    initial={{ opacity: 0, rotate: -90, scale: 0.9 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: 90, scale: 0.9 }}
                    transition={{ duration: 0.18 }}
                  >
                    <X className="w-6 h-6" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="menu"
                    initial={{ opacity: 0, rotate: 90, scale: 0.9 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: -90, scale: 0.9 }}
                    transition={{ duration: 0.18 }}
                  >
                    <Menu className="w-6 h-6" />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu - Rendered via Portal directly into document.body */}
      <MobileMenu 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        activeSection={activeSection}
        scrollToSection={scrollToSection}
      />
    </>
  );
};
