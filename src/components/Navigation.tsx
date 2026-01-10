import { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { scrollToSection as smoothScrollToSection, scrollToTop } from '@/components/SmoothScroll';

const navLinks = [
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Projects', href: '#projects' },
  { name: 'Experience', href: '#experience' },
  { name: 'Certifications', href: '#certifications' },
  { name: 'Contact', href: '#contact' },
] as const;

// Mobile Menu Component - rendered via Portal to escape all parent CSS
const MobileMenu = ({ 
  isOpen, 
  onClose, 
  activeSection,
  scrollToSection 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  activeSection: string;
  scrollToSection: (href: string) => void;
}) => {
  if (!isOpen) return null;

  return createPortal(
    <div id="mobile-menu-root">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(4px)',
          zIndex: 99998,
        }}
      />
      {/* Drawer Panel */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '85vw',
          maxWidth: '320px',
          height: '100vh',
          backgroundColor: 'hsl(var(--background))',
          borderLeft: '1px solid hsl(var(--border))',
          boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.3)',
          zIndex: 99999,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px',
            borderBottom: '1px solid hsl(var(--border) / 0.3)',
          }}
        >
          <ThemeToggle />
          <button 
            onClick={onClose}
            style={{
              padding: '10px',
              borderRadius: '12px',
              border: 'none',
              background: 'hsl(var(--secondary) / 0.5)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label="Close menu"
          >
            <X style={{ width: '24px', height: '24px', color: 'hsl(var(--foreground))' }} />
          </button>
        </div>

        {/* Navigation Links */}
        <div 
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.substring(1);
            return (
              <button
                key={link.name}
                onClick={() => scrollToSection(link.href)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '16px',
                  borderRadius: '12px',
                  border: 'none',
                  fontSize: '18px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  backgroundColor: isActive ? 'hsl(var(--primary) / 0.15)' : 'hsl(var(--secondary) / 0.3)',
                  color: isActive ? 'hsl(var(--primary))' : 'hsl(var(--foreground))',
                }}
              >
                {link.name}
              </button>
            );
          })}
        </div>

        {/* CTA Button */}
        <div 
          style={{
            padding: '16px',
            borderTop: '1px solid hsl(var(--border) / 0.3)',
          }}
        >
          <Button 
            onClick={() => scrollToSection('#contact')} 
            className="w-full rounded-xl font-semibold py-6 text-lg gap-2" 
            size="lg"
          >
            Let's Talk
            <ArrowUpRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>,
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
          <div className="flex items-center gap-2 sm:gap-3">
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
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden flex items-center justify-center min-h-[44px] min-w-[44px] p-2 rounded-xl glass-card hover:bg-secondary/80"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
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
      />
    </>
  );
};
