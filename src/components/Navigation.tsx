import { useEffect, useState, useCallback } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navLinks = [
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Projects', href: '#projects' },
  { name: 'Certifications', href: '#certifications' },
  { name: 'Experience', href: '#experience' },
  { name: 'Contact', href: '#contact' },
] as const;

export const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Active section detection
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
    const element = document.querySelector(href);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  }, []);

  // Close mobile menu on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out',
        isScrolled ? 'py-2 sm:py-3' : 'py-3 sm:py-4'
      )}
    >
      <div
        className={cn(
          'mx-auto flex items-center justify-between transition-all duration-300 ease-out',
          isScrolled
            ? 'w-[95%] max-w-6xl rounded-2xl px-3 sm:px-4 py-2 sm:py-3 md:px-6 bg-background/85 backdrop-blur-xl border border-border/20 shadow-lg'
            : 'w-full max-w-7xl px-4 py-2 md:px-8 bg-transparent'
        )}
      >
        {/* Logo */}
        <a
          href="#"
          className="relative flex items-center gap-2 group shrink-0 z-50"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          aria-label="Go to top"
        >
          <motion.div
            className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 text-primary border border-primary/30 group-hover:border-primary/60 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="font-signature font-bold text-lg sm:text-xl">M</span>
          </motion.div>

          <div className={cn(
            'transition-all duration-300',
            isScrolled ? 'hidden sm:block' : 'block'
          )}>
            <span className="font-display font-bold text-base sm:text-lg tracking-tight">
              Moin<span className="text-primary">.dev</span>
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-1 p-1 rounded-full bg-secondary/50 border border-border/30 backdrop-blur-sm">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.substring(1);
            return (
              <button
                key={link.name}
                onClick={() => scrollToSection(link.href)}
                className={cn(
                  'relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-full',
                  isActive
                    ? 'text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
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

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          
          {/* Desktop CTA */}
          <Button
            onClick={() => scrollToSection('#contact')}
            size={isScrolled ? 'sm' : 'default'}
            className={cn(
              'hidden sm:flex rounded-full font-semibold gap-2 transition-all duration-300',
              'shadow-[0_0_20px_rgba(45,212,191,0.2)] hover:shadow-[0_0_30px_rgba(45,212,191,0.4)]',
              isScrolled ? 'px-4' : 'px-5'
            )}
          >
            <span>Let's Talk</span>
            <ArrowUpRight className="w-4 h-4" />
          </Button>

          {/* Mobile Menu Toggle */}
          <motion.button
            className={cn(
              'lg:hidden relative z-50 p-2 rounded-xl transition-colors duration-200',
              'hover:bg-secondary/80 active:bg-secondary',
              'touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center'
            )}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-6 h-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="w-6 h-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
              onClick={() => setIsMobileMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              aria-hidden="true"
            />
            
            {/* Menu Panel */}
            <motion.div
              className="lg:hidden fixed top-0 right-0 h-full w-full max-w-sm z-50 bg-background/95 backdrop-blur-xl border-l border-border/50 shadow-2xl"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              {/* Close button */}
              <div className="flex justify-end p-4">
                <motion.button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-xl hover:bg-secondary/80 transition-colors"
                  whileTap={{ scale: 0.9 }}
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>

              <div className="flex flex-col h-[calc(100%-80px)] px-6 pb-8">
                {/* Nav Links */}
                <div className="flex flex-col gap-1">
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
                          'relative w-full text-left px-4 py-4 rounded-xl font-medium text-lg transition-all duration-200',
                          'touch-manipulation min-h-[56px] flex items-center',
                          isActive
                            ? 'bg-primary/10 text-primary'
                            : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground active:bg-secondary'
                        )}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        {isActive && (
                          <motion.div
                            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-full bg-primary"
                            layoutId="mobileActiveIndicator"
                          />
                        )}
                        <span className="ml-2">{link.name}</span>
                      </motion.button>
                    );
                  })}
                </div>

                {/* CTA Button */}
                <motion.div 
                  className="mt-auto pt-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Button
                    onClick={() => scrollToSection('#contact')}
                    className="w-full rounded-xl font-semibold py-6 text-lg gap-2"
                    size="lg"
                  >
                    Let's Talk
                    <ArrowUpRight className="w-5 h-5" />
                  </Button>
                </motion.div>

                {/* Theme Toggle */}
                <motion.div 
                  className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35 }}
                >
                  <span className="text-sm text-muted-foreground">Theme</span>
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
