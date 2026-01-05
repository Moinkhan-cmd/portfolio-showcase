import { useEffect, useState, useCallback, useRef, MouseEvent as ReactMouseEvent } from 'react';
import { Menu, X, ArrowUpRight, Sparkles, Zap } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ThemeToggle } from '@/components/ThemeToggle';
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

// ============ MAGNETIC LINK COMPONENT ============
interface MagneticLinkProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  isActive?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  isFocused?: boolean;
}

const MagneticLink = ({ children, className, onClick, isActive, onFocus, onBlur, isFocused }: MagneticLinkProps) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 400 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  const handleMouseMove = (e: ReactMouseEvent<HTMLButtonElement>) => {
    if (ref.current == null) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) * 0.35;
    const deltaY = (e.clientY - centerY) * 0.35;
    x.set(deltaX);
    y.set(deltaY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      onFocus={onFocus}
      onBlur={onBlur}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={cn('relative outline-none', className)}
      style={{ x: xSpring, y: ySpring }}
      aria-current={isActive ? 'page' : undefined}
    >
      {/* Hover Glow Background */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: isHovered || isFocused ? 1 : 0, scale: isHovered || isFocused ? 1 : 0.8 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      />
      
      {/* Focus Ring */}
      <AnimatePresence>
        {isFocused && (
          <motion.div
            className="absolute -inset-[2px] rounded-full z-0"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{
              background: 'linear-gradient(90deg, hsl(var(--primary)), hsl(280 80% 60%), hsl(340 80% 60%), hsl(var(--primary)))',
              backgroundSize: '300% 100%',
            }}
          >
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              style={{ background: 'inherit', backgroundSize: 'inherit' }}
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      {isFocused && (
        <motion.div
          className="absolute inset-0 rounded-full bg-background z-[1]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}

      <motion.div
        className="absolute inset-0 rounded-full bg-primary/10 z-[1]"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0.95 }}
        transition={{ duration: 0.2 }}
      />

      <motion.div
        className="absolute inset-0 rounded-full overflow-hidden z-[2]"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={isHovered ? { x: ['-100%', '200%'] } : { x: '-100%' }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        />
      </motion.div>

      <motion.span
        className={cn(
          'relative z-10 px-4 py-2 text-sm font-medium transition-colors duration-200',
          isActive ? 'text-primary' : 'text-muted-foreground',
        )}
        animate={{ textShadow: isFocused ? '0 0 20px hsl(var(--primary))' : 'none' }}
      >
        {children}
      </motion.span>

      <motion.div
        className="absolute bottom-1 left-1/2 h-[2px] rounded-full bg-gradient-to-r from-primary via-purple-500 to-primary z-10"
        initial={{ width: 0, x: '-50%' }}
        animate={{ width: isActive || isHovered || isFocused ? '70%' : '0%', x: '-50%' }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      />
      
      <AnimatePresence>
        {isFocused && (
          <motion.div
            className="absolute -bottom-1 left-1/2 w-1.5 h-1.5 rounded-full bg-primary"
            initial={{ opacity: 0, scale: 0, x: '-50%' }}
            animate={{ opacity: 1, scale: 1, x: '-50%' }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ delay: 0.1 }}
          />
        )}
      </AnimatePresence>
    </motion.button>
  );
};

// ============ SPOTLIGHT INDICATOR ============
interface SpotlightIndicatorProps {
  activeIndex: number;
  containerRef: React.RefObject<HTMLDivElement>;
}

const SpotlightIndicator = ({ activeIndex, containerRef }: SpotlightIndicatorProps) => {
  const [position, setPosition] = useState({ left: 0, width: 0 });
  
  useEffect(() => {
    const buttons = containerRef.current.querySelectorAll('button');
    const activeButton = buttons[activeIndex];
    if (activeButton) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const buttonRect = activeButton.getBoundingClientRect();
      setPosition({
        left: buttonRect.left - containerRect.left,
        width: buttonRect.width,
      });
    }
  }, [activeIndex, containerRef]);

  if (activeIndex < 0) return null;

  return (
    <motion.div
      className="absolute top-1/2 -translate-y-1/2 h-10 rounded-full pointer-events-none z-0"
      animate={{ left: position.left, width: position.width }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
    >
      <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl" />
      <motion.div
        className="absolute inset-0 rounded-full bg-primary/10"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.div>
  );
};

// ============ PREMIUM CTA ============
interface PremiumCTAProps {
  onClick: () => void;
  isScrolled: boolean;
  isFocused: boolean;
  onFocus: () => void;
  onBlur: () => void;
}

const PremiumCTA = ({ onClick, isScrolled, isFocused, onFocus, onBlur }: PremiumCTAProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-20, 20], [10, -10]);
  const rotateY = useTransform(x, [-20, 20], [-10, 10]);

  const handleMouseMove = (e: ReactMouseEvent<HTMLButtonElement>) => {
    const rect = buttonRef.current.getBoundingClientRect();
    x.set(e.clientX - (rect.left + rect.width / 2));
    y.set(e.clientY - (rect.top + rect.height / 2));
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      className="relative"
      style={{ perspective: 1000 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <AnimatePresence>
        {isFocused && (
          <motion.div
            className="absolute -inset-1 rounded-full z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{
                boxShadow: [
                  '0 0 20px hsl(var(--primary)), 0 0 40px hsl(var(--primary) / 0.4)',
                  '0 0 35px hsl(var(--primary)), 0 0 60px hsl(var(--primary) / 0.5)',
                  '0 0 20px hsl(var(--primary)), 0 0 40px hsl(var(--primary) / 0.4)',
                ],
              }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute -inset-[2px] rounded-full border-2 border-dashed border-primary/60"
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isHovered && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-primary"
                initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  x: Math.cos((i * Math.PI * 2) / 6) * 40,
                  y: Math.sin((i * Math.PI * 2) / 6) * 40,
                  scale: [0, 1.5, 0],
                }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.15, ease: 'easeOut' }}
                style={{ left: '50%', top: '50%' }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      <motion.div style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}>
        <Button
          ref={buttonRef}
          variant="hero"
          size={isScrolled ? 'sm' : 'default'}
          onClick={onClick}
          onFocus={onFocus}
          onBlur={onBlur}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={handleMouseLeave}
          className={cn(
            'rounded-full font-semibold shadow-lg transition-all duration-300 gap-2 relative overflow-hidden group/cta',
            'outline-none border-0',
            isScrolled ? 'px-5' : 'px-6',
            isFocused && 'ring-0'
          )}
          aria-label="Let's Talk - Contact me"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-primary via-purple-600 to-primary"
            animate={{ backgroundPosition: isHovered ? ['0% 50%', '100% 50%'] : '0% 50%' }}
            transition={{ duration: 2, repeat: isHovered ? Infinity : 0 }}
            style={{ backgroundSize: '200% 100%' }}
          />
          
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
          />

          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{
              boxShadow: isHovered 
                ? '0 0 40px hsl(var(--primary) / 0.6), 0 10px 40px hsl(var(--primary) / 0.4)' 
                : '0 0 0 transparent',
            }}
            transition={{ duration: 0.3 }}
          />

          <span className={cn(
            'relative z-10 flex items-center gap-2 font-semibold text-white transition-all duration-200',
            (isHovered || isFocused) && 'drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]'
          )}>
            Let's Talk
            <motion.span
              animate={{ 
                x: isHovered ? [0, 4, 0] : 0, 
                y: isHovered ? [0, -4, 0] : 0,
                rotate: isHovered ? [0, 15, 0] : 0,
              }}
              transition={{ duration: 0.6, repeat: isHovered ? Infinity : 0 }}
            >
              <ArrowUpRight className="w-4 h-4" />
            </motion.span>
          </span>
        </Button>
      </motion.div>
    </motion.div>
  );
};

// ============ ANIMATED LOGO ============
const AnimatedLogo = ({ isScrolled }: { isScrolled: boolean }) => {
  const [isHovered, setIsHovered] = useState(false);
  const logoRef = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-15, 15], [15, -15]);
  const rotateY = useTransform(x, [-15, 15], [-15, 15]);

  const handleMouseMove = (e: ReactMouseEvent<HTMLAnchorElement>) => {
    const rect = logoRef.current.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * 0.3);
    y.set((e.clientY - (rect.top + rect.height / 2)) * 0.3);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <motion.a
      href="#"
      className="relative flex items-center gap-2 group shrink-0"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={(e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }}
      aria-label="Go to top"
      style={{ perspective: 500 }}
    >
      <motion.div
        ref={logoRef}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 text-primary border border-primary/30"
          animate={{
            borderColor: isHovered ? 'hsl(var(--primary))' : 'hsl(var(--primary) / 0.3)',
            boxShadow: isHovered 
              ? '0 0 30px hsl(var(--primary) / 0.5), inset 0 0 20px hsl(var(--primary) / 0.1)' 
              : '0 0 0 transparent',
          }}
          transition={{ duration: 0.3 }}
        >
          <motion.span 
            className="font-signature font-bold text-xl relative z-10"
            animate={{ textShadow: isHovered ? '0 0 20px hsl(var(--primary))' : 'none' }}
          >
            M
          </motion.span>
          
          <motion.div
            className="absolute inset-0 rounded-xl bg-primary/20 blur-md"
            animate={{ opacity: isHovered ? 0.8 : 0 }}
            transition={{ duration: 0.3 }}
          />
          
          <AnimatePresence>
            {isHovered && (
              <motion.div
                className="absolute -inset-1 rounded-xl border border-primary/40"
                initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
                animate={{ opacity: 1, scale: 1, rotate: 90 }}
                exit={{ opacity: 0, scale: 1.2 }}
                transition={{ duration: 0.5 }}
              />
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      <div className={cn('relative transition-opacity duration-300', isScrolled ? 'hidden sm:block' : 'block')}>
        <motion.span
          className="font-display font-bold text-lg tracking-tight block"
          animate={{ textShadow: isHovered ? '0 0 15px hsl(var(--primary) / 0.5)' : 'none' }}
        >
          Moin<span className="text-primary">.dev</span>
        </motion.span>
        
        <motion.div
          className="absolute -bottom-0.5 left-0 h-0.5 bg-gradient-to-r from-primary via-purple-500 to-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: isHovered ? '100%' : 0 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        />
      </div>

      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute -top-1 -right-1"
            initial={{ opacity: 0, scale: 0, rotate: -45 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0, rotate: 45 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}>
              <Zap className="w-4 h-4 text-primary fill-primary drop-shadow-[0_0_8px_hsl(var(--primary))]" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.a>
  );
};

// ============ MOBILE MENU BUTTON ============
const MobileMenuButton = ({ isOpen, onClick, isFocused, onFocus, onBlur }: { 
  isOpen: boolean; onClick: () => void; isFocused: boolean; onFocus: () => void; onBlur: () => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      className={cn(
        'md:hidden relative p-2 rounded-xl transition-colors duration-200',
        'outline-none touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center'
      )}
      onClick={onClick}
      onFocus={onFocus}
      onBlur={onBlur}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Toggle menu"
      aria-expanded={isOpen}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9, rotate: 10 }}
    >
      <motion.div
        className="absolute inset-0 rounded-xl bg-primary/10"
        animate={{ opacity: isHovered || isFocused ? 1 : 0, scale: isHovered || isFocused ? 1 : 0.8 }}
        transition={{ duration: 0.2 }}
      />
      
      <AnimatePresence>
        {isFocused && (
          <motion.div
            className="absolute -inset-1 rounded-xl border-2 border-primary"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1, boxShadow: '0 0 20px hsl(var(--primary) / 0.4)' }}
            exit={{ opacity: 0, scale: 1.1 }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.div key="close" initial={{ rotate: -90, opacity: 0, scale: 0.5 }} animate={{ rotate: 0, opacity: 1, scale: 1 }} exit={{ rotate: 90, opacity: 0, scale: 0.5 }} transition={{ duration: 0.25 }}>
            <X className="w-6 h-6 text-foreground relative z-10" />
          </motion.div>
        ) : (
          <motion.div key="menu" initial={{ rotate: 90, opacity: 0, scale: 0.5 }} animate={{ rotate: 0, opacity: 1, scale: 1 }} exit={{ rotate: -90, opacity: 0, scale: 0.5 }} transition={{ duration: 0.25 }}>
            <Menu className="w-6 h-6 text-foreground relative z-10" />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute inset-0 rounded-xl bg-primary/20"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.5], opacity: [0.5, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          />
        )}
      </AnimatePresence>
    </motion.button>
  );
};

// ============ MAIN NAVIGATION ============
export const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [focusedLink, setFocusedLink] = useState<string | null>(null);
  const [ctaFocused, setCtaFocused] = useState(false);
  const [menuButtonFocused, setMenuButtonFocused] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const linksContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((entry) => { if (entry.isIntersecting) setActiveSection(entry.target.id); }); },
      { rootMargin: '-30% 0px -50% 0px', threshold: 0.1 }
    );
    navLinks.forEach((link) => { const el = document.getElementById(link.href.substring(1)); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  const scrollToSection = useCallback((href: string) => {
    const element = document.querySelector(href);
    if (element) {
      const offset = 80;
      window.scrollTo({ top: element.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => { if (e.key === 'Escape' && isMobileMenuOpen) setIsMobileMenuOpen(false); };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  const activeIndex = navLinks.findIndex((link) => link.href.substring(1) === activeSection);

  return (
    <nav ref={navRef} className={cn('fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out', isScrolled ? 'pt-3 pb-3' : 'pt-4 pb-4')}>
      <div className={cn(
        'mx-auto flex items-center justify-between transition-all duration-300 ease-out',
        isScrolled
          ? 'w-[95%] max-w-6xl rounded-2xl px-4 py-3 md:px-6 bg-background/85 backdrop-blur-xl border border-border/20 shadow-lg'
          : 'w-full max-w-7xl px-4 py-2 md:px-8 bg-transparent border-0 shadow-none'
      )}>
        <AnimatedLogo isScrolled={isScrolled} />

        <div ref={linksContainerRef} className="hidden md:flex items-center gap-1 relative">
          <SpotlightIndicator activeIndex={activeIndex} containerRef={linksContainerRef} />
          {navLinks.map((link) => (
            <MagneticLink
              key={link.name}
              onClick={() => scrollToSection(link.href)}
              isActive={activeSection === link.href.substring(1)}
              onFocus={() => setFocusedLink(link.name)}
              onBlur={() => setFocusedLink(null)}
              isFocused={focusedLink === link.name}
            >
              {link.name}
            </MagneticLink>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block"><ThemeToggle /></div>
          <PremiumCTA onClick={() => scrollToSection("#contact")} isScrolled={isScrolled} isFocused={ctaFocused} onFocus={() => setCtaFocused(true)} onBlur={() => setCtaFocused(false)} />
          <MobileMenuButton isOpen={isMobileMenuOpen} onClick={() => setIsMobileMenuOpen(prev => !prev)} isFocused={menuButtonFocused} onFocus={() => setMenuButtonFocused(true)} onBlur={() => setMenuButtonFocused(false)} />
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div className="md:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40" onClick={() => setIsMobileMenuOpen(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
            <motion.div
              className="md:hidden absolute left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-border/50 shadow-2xl overflow-hidden"
              style={{ top: '100%' }}
              initial={{ opacity: 0, y: -20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            >
              <div className="mx-auto max-w-7xl px-4 py-6 flex flex-col gap-2">
                {navLinks.map((link, index) => {
                  const isActive = activeSection === link.href.substring(1);
                  return (
                    <motion.button
                      key={link.name}
                      onClick={() => scrollToSection(link.href)}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={cn(
                        'relative w-full text-left px-4 py-3 rounded-xl font-medium transition-all duration-200',
                        'outline-none group/mobile touch-manipulation min-h-[44px]',
                        isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                      )}
                      whileHover={{ x: 8 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <motion.div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 rounded-full bg-primary" initial={{ height: 0 }} animate={{ height: isActive ? '60%' : 0 }} transition={{ duration: 0.2 }} />
                      <motion.div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover/mobile:opacity-100" transition={{ duration: 0.2 }} />
                      <span className="relative z-10 flex items-center gap-2">{link.name}{isActive && <Sparkles className="w-3 h-3 text-primary" />}</span>
                    </motion.button>
                  );
                })}
                <motion.div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between px-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
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

