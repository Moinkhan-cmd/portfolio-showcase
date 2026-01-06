import { useEffect, useState, useCallback } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navLinks = [
  { name: 'About', href: '#about' },
  { name: 'Projects', href: '#projects' },
  { name: 'Certifications', href: '#certifications' },
  { name: 'Experience', href: '#experience' },
  { name: 'Contact', href: '#contact' },
] as const;

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
        let maxRatio = 0;
        let activeId = '';

        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            activeId = entry.target.id;
          }
        });

        if (!activeId) {
          const scrollPosition = window.scrollY + window.innerHeight / 3;
          navLinks.forEach((link) => {
            const element = document.getElementById(link.href.substring(1));
            if (element) {
              const { offsetTop, offsetHeight } = element;
              if (
                scrollPosition >= offsetTop &&
                scrollPosition < offsetTop + offsetHeight
              ) {
                activeId = element.id;
              }
            }
          });
        }

        if (activeId) {
          setActiveSection(activeId);
        }
      },
      {
        rootMargin: '-20% 0px -60% 0px',
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1.0],
      }
    );

    const observeSections = () => {
      navLinks.forEach((link) => {
        const sectionId = link.href.substring(1);
        const element = document.getElementById(sectionId);
        if (element) {
          observer.observe(element);
        }
      });
    };

    const timeoutId = setTimeout(observeSections, 100);
    observeSections();

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150;
      let currentSection = '';

      navLinks.forEach((link) => {
        const sectionId = link.href.substring(1);
        const element = document.getElementById(sectionId);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            currentSection = sectionId;
          }
        }
      });

      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToSection = useCallback((href: string) => {
    const element = document.querySelector(href);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
      const sectionId = href.substring(1);
      setActiveSection(sectionId);
    }
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
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out',
        isScrolled ? 'py-1 xs:py-1.5 sm:py-2 md:py-2.5' : 'py-2 xs:py-2.5 sm:py-3 md:py-4 lg:py-5'
      )}
    >
      <div
        className={cn(
          'mx-auto flex items-center justify-between transition-all duration-300 ease-out',
          isScrolled
            ? 'w-[95%] xs:w-[94%] sm:w-[96%] md:w-[95%] max-w-6xl rounded-lg xs:rounded-xl sm:rounded-2xl px-2 xs:px-2.5 sm:px-3 md:px-4 lg:px-6 py-1.5 xs:py-2 sm:py-2.5 bg-background/90 backdrop-blur-xl border border-border/30 shadow-lg'
            : 'w-full max-w-7xl px-2.5 xs:px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10 py-1.5 xs:py-2 sm:py-2.5 bg-transparent'
        )}
      >
        <a
          href="#"
          className="relative flex items-center gap-1 xs:gap-1.5 sm:gap-2 group shrink-0 z-50"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setActiveSection('');
          }}
          aria-label="Go to top"
        >
          <motion.div
            className="relative w-7 h-7 xs:w-8 xs:h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex items-center justify-center rounded-lg xs:rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 text-primary border border-primary/30 group-hover:border-primary/60 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="font-signature font-bold text-sm xs:text-base sm:text-lg md:text-xl">M</span>
          </motion.div>
          <div className="transition-all duration-300">
            <span className="font-display font-semibold text-[10px] xs:text-xs sm:text-sm md:text-base tracking-tight text-foreground">
              Moin<span className="text-primary">.dev</span>
            </span>
          </div>
        </a>

        <div className="hidden lg:flex items-center gap-0.5 xl:gap-1 p-0.5 xl:p-1 rounded-full bg-secondary/50 border border-border/30 backdrop-blur-sm">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.substring(1);
            return (
              <motion.button
                key={link.name}
                onClick={() => scrollToSection(link.href)}
                className={cn(
                  'relative px-2 xs:px-2.5 sm:px-3 md:px-3.5 lg:px-4 xl:px-5 py-1.5 md:py-2 text-[10px] xs:text-xs sm:text-sm md:text-sm lg:text-sm font-medium transition-all duration-300 rounded-full whitespace-nowrap',
                  isActive ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                )}
                whileHover={{ scale: isActive ? 1 : 1.02 }}
                whileTap={{ scale: 0.98 }}
                aria-current={isActive ? 'page' : undefined}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavTab"
                    className="absolute inset-0 bg-primary rounded-full shadow-lg shadow-primary/25"
                    transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                  />
                )}
                {!isActive && (
                  <span className="absolute inset-0 rounded-full bg-foreground/0 hover:bg-foreground/5 transition-colors duration-200" />
                )}
                <span className="relative z-10">{link.name}</span>
              </motion.button>
            );
          })}
        </div>

        <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-2 md:gap-3">
          <div className="hidden xs:block"><ThemeToggle /></div>
          <Button
            onClick={() => scrollToSection('#contact')}
            size={isScrolled ? 'sm' : 'default'}
            className={cn(
              'hidden md:flex rounded-full font-semibold gap-1 xs:gap-1.5 sm:gap-2 transition-all duration-300 text-[10px] xs:text-xs sm:text-sm md:text-sm lg:text-base',
              'shadow-[0_0_20px_rgba(45,212,191,0.2)] hover:shadow-[0_0_30px_rgba(45,212,191,0.4)]',
              isScrolled ? 'px-2.5 xs:px-3 sm:px-3.5 md:px-4 lg:px-5' : 'px-3 xs:px-3.5 sm:px-4 md:px-5 lg:px-6'
            )}
          >
            <span className="whitespace-nowrap">Let's Talk</span>
            <ArrowUpRight className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 md:w-4 md:h-4" />
          </Button>
          <motion.button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={cn(
              'lg:hidden relative z-50 p-1.5 xs:p-2 rounded-lg xs:rounded-xl transition-colors duration-200',
              'hover:bg-secondary/80 active:bg-secondary',
              'touch-manipulation min-h-[36px] min-w-[36px] xs:min-h-[40px] xs:min-w-[40px] sm:min-h-[44px] sm:min-w-[44px] flex items-center justify-center'
            )}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <X className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6" />
                </motion.div>
              ) : (
                <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Menu className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              className="md:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
              onClick={() => setIsMobileMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              className="lg:hidden fixed top-0 right-0 h-full w-full xs:w-[85%] sm:w-[75%] md:w-[60%] max-w-sm z-50 bg-background/98 backdrop-blur-xl border-l border-border/50 shadow-2xl"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className="flex items-center justify-between p-2.5 xs:p-3 sm:p-4 border-b border-border/30">
                <div className="xs:hidden"><ThemeToggle /></div>
                <div className="hidden xs:block" />
                <motion.button onClick={() => setIsMobileMenuOpen(false)} className="p-1.5 xs:p-2 rounded-lg xs:rounded-xl hover:bg-secondary/80 transition-colors min-h-[36px] min-w-[36px] xs:min-h-[40px] xs:min-w-[40px] sm:min-h-[44px] sm:min-w-[44px] flex items-center justify-center" whileTap={{ scale: 0.9 }} aria-label="Close menu">
                  <X className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6" />
                </motion.button>
              </div>
              <div className="flex flex-col h-[calc(100%-60px)] xs:h-[calc(100%-65px)] sm:h-[calc(100%-70px)] px-3 xs:px-4 sm:px-6 pb-4 xs:pb-6 sm:pb-8 pt-3 xs:pt-4 overflow-y-auto">
                <div className="flex flex-col gap-0.5 xs:gap-1">
                  {navLinks.map((link, index) => {
                    const isActive = activeSection === link.href.substring(1);
                    return (
                      <motion.button
                        key={link.name}
                        onClick={() => scrollToSection(link.href)}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={cn(
                          'relative w-full text-left px-2.5 xs:px-3 sm:px-4 py-2.5 xs:py-3 sm:py-4 rounded-lg xs:rounded-xl font-medium text-sm xs:text-base sm:text-lg transition-all duration-200',
                          'touch-manipulation min-h-[44px] xs:min-h-[48px] sm:min-h-[52px] flex items-center',
                          isActive ? 'bg-primary/10 text-primary border-l-2 border-primary' : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground active:bg-secondary'
                        )}
                      >
                        {isActive && (
                          <motion.div
                            className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 xs:w-1 h-5 xs:h-6 sm:h-8 rounded-full bg-primary"
                            layoutId="mobileActiveIndicator"
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                          />
                        )}
                        <span className="ml-2 xs:ml-3">{link.name}</span>
                      </motion.button>
                    );
                  })}
                </div>
                <motion.div className="mt-auto pt-3 xs:pt-4 sm:pt-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  <Button onClick={() => scrollToSection('#contact')} className="w-full rounded-xl font-semibold py-4 xs:py-5 sm:py-6 text-sm xs:text-base sm:text-lg gap-2" size="lg">
                    Let's Talk
                    <ArrowUpRight className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5" />
                  </Button>
                </motion.div>
                <motion.div className="hidden xs:flex mt-3 xs:mt-4 pt-3 xs:pt-4 border-t border-border/50 items-center justify-between" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
                  <span className="text-xs xs:text-sm text-muted-foreground">Theme</span>
                  <ThemeToggle />
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

