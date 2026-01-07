import { useEffect, useState, useCallback, useMemo } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navLinks = [
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Projects', href: '#projects' },
  { name: 'Experience', href: '#experience' },
  { name: 'Certifications', href: '#certifications' },
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

  const sectionElements = useMemo(() => {
    return navLinks.map(link => ({
      id: link.href.substring(1),
      element: document.getElementById(link.href.substring(1))
    }));
  }, []);

  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (ticking === false) {
        window.requestAnimationFrame(() => {
          const scrollPosition = window.scrollY + 150;
          let currentSection = '';

          for (const { id, element } of sectionElements) {
            if (element) {
              const { offsetTop, offsetHeight } = element;
              if (
                scrollPosition >= offsetTop &&
                scrollPosition < offsetTop + offsetHeight
              ) {
                currentSection = id;
                break;
              }
            }
          }

          if (currentSection && currentSection !== activeSection) {
            setActiveSection(currentSection);
          }
          
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [activeSection, sectionElements]);

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

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => prev === false ? true : false);
  }, []);

  const closeMobileMenu = useCallback(() => {
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
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => { 
      document.body.style.overflow = ''; 
      document.body.style.touchAction = '';
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);

  return (
    <>
      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-40 transition-all duration-200 ease-out',
          isScrolled ? 'py-2 sm:py-2.5 md:py-3' : 'py-3 sm:py-4 md:py-5 lg:py-6'
        )}
      >
        <div
          className={cn(
            'mx-auto flex items-center justify-between transition-all duration-200 ease-out',
            isScrolled
              ? 'w-[95%] sm:w-[96%] md:w-[95%] lg:w-[94%] max-w-6xl rounded-xl sm:rounded-2xl px-3 sm:px-4 md:px-5 lg:px-6 py-2.5 sm:py-3 bg-background/95 backdrop-blur-md border border-border/30 shadow-lg'
              : 'w-full max-w-7xl px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 py-2.5 sm:py-3 bg-transparent'
          )}
        >
          <a
            href="#"
            className="relative flex items-center gap-2 sm:gap-2.5 group shrink-0 z-50 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setActiveSection('');
              closeMobileMenu();
            }}
            aria-label="Go to top"
          >
            <motion.div
              className="relative w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 flex items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 text-primary border border-primary/30 group-hover:border-primary/60 transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.15 }}
            >
              <span className="font-signature font-bold text-lg sm:text-xl md:text-2xl">M</span>
            </motion.div>
            <div className="transition-all duration-300 hidden xs:block">
              <span className="font-display font-semibold text-sm sm:text-base md:text-lg tracking-tight text-foreground">
                Moin<span className="text-primary">.dev</span>
              </span>
            </div>
          </a>

          <div className="hidden lg:flex items-center gap-1 xl:gap-1.5 p-1 xl:p-1.5 rounded-full bg-secondary/50 border border-border/30 backdrop-blur-sm">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.substring(1);
              return (
                <motion.button
                  key={link.name}
                  onClick={() => scrollToSection(link.href)}
                  className={cn(
                    'relative px-3 md:px-3.5 lg:px-4 xl:px-5 py-1.5 md:py-2 text-xs md:text-sm lg:text-sm font-medium transition-all duration-200 rounded-full whitespace-nowrap',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
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
                      style={{ willChange: 'transform' }}
                      transition={{ type: 'spring', bounce: 0.15, duration: 0.4 }}
                    />
                  )}
                  {isActive === false && (
                    <span className="absolute inset-0 rounded-full bg-foreground/0 hover:bg-foreground/5 transition-colors duration-200" />
                  )}
                  <span className="relative z-10">{link.name}</span>
                </motion.button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3">
            <div className="relative z-50">
              <ThemeToggle />
            </div>
            
            <Button
              onClick={() => scrollToSection('#contact')}
              size={isScrolled ? 'sm' : 'default'}
              className={cn(
                'hidden md:flex rounded-full font-semibold gap-1.5 sm:gap-2 transition-all duration-200 text-xs sm:text-sm md:text-sm lg:text-base',
                'shadow-[0_0_20px_rgba(45,212,191,0.2)] hover:shadow-[0_0_30px_rgba(45,212,191,0.4)]',
                isScrolled ? 'px-3 sm:px-3.5 md:px-4 lg:px-5' : 'px-3.5 sm:px-4 md:px-5 lg:px-6'
              )}
            >
              <span className="whitespace-nowrap">Let's Talk</span>
              <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-4 md:h-4" />
            </Button>
            
            <button
              type="button"
              onClick={toggleMobileMenu}
              className={cn(
                'lg:hidden relative z-[70] p-2 sm:p-2.5 rounded-xl transition-colors duration-200',
                'bg-secondary/50 hover:bg-secondary/80 active:bg-secondary',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                'min-h-[44px] min-w-[44px] flex items-center justify-center',
                'border border-border/30'
              )}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
            >
              <AnimatePresence mode="wait" initial={false}>
                {isMobileMenuOpen ? (
                  <motion.div 
                    key="close" 
                    initial={{ rotate: -90, opacity: 0 }} 
                    animate={{ rotate: 0, opacity: 1 }} 
                    exit={{ rotate: 90, opacity: 0 }} 
                    transition={{ duration: 0.15 }}
                  >
                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                  </motion.div>
                ) : (
                  <motion.div 
                    key="menu" 
                    initial={{ rotate: 90, opacity: 0 }} 
                    animate={{ rotate: 0, opacity: 1 }} 
                    exit={{ rotate: -90, opacity: 0 }} 
                    transition={{ duration: 0.15 }}
                  >
                    <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[55]"
              onClick={closeMobileMenu}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
            
            <motion.div
              className="lg:hidden fixed top-0 right-0 h-full w-[280px] xs:w-[300px] sm:w-[320px] max-w-[85vw] z-[60] bg-background border-l border-border/50 shadow-2xl"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
              <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border/30">
                <h2 className="text-lg sm:text-xl font-semibold text-foreground">Menu</h2>
                <button 
                  type="button"
                  onClick={closeMobileMenu}
                  className="p-2 rounded-xl hover:bg-secondary/80 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center border border-border/30" 
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
              
              <div className="flex flex-col h-[calc(100%-80px)] px-4 sm:px-5 pb-6 pt-4 overflow-y-auto">
                <div className="flex flex-col gap-1">
                  {navLinks.map((link, index) => {
                    const isActive = activeSection === link.href.substring(1);
                    return (
                      <motion.button
                        key={link.name}
                        type="button"
                        onClick={() => scrollToSection(link.href)}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={cn(
                          'relative w-full text-left px-4 py-3.5 sm:py-4 rounded-xl font-medium text-base sm:text-lg transition-all duration-200',
                          'min-h-[52px] flex items-center',
                          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                          isActive 
                            ? 'bg-primary/10 text-primary border-l-2 border-primary' 
                            : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground active:bg-secondary'
                        )}
                      >
                        <span className="ml-2">{link.name}</span>
                      </motion.button>
                    );
                  })}
                </div>
                
                <motion.div 
                  className="mt-auto pt-6" 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.3 }}
                >
                  <Button 
                    type="button"
                    onClick={() => scrollToSection('#contact')} 
                    className="w-full rounded-xl font-semibold py-5 sm:py-6 text-base sm:text-lg gap-2" 
                    size="lg"
                  >
                    Let's Talk
                    <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
