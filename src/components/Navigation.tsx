import { useEffect, useState, useCallback, useRef } from "react";
import { Menu, X, ArrowUpRight, Sparkles, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
                initial={{ opacity: 0, scale: 0, rotate: -180, x: -20, y: -20 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1, 
                  rotate: 0,
                  x: 0,
                  y: 0,
                }}
                exit={{ opacity: 0, scale: 0, rotate: 180 }}
                transition={{ 
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                  duration: 0.4
                }}
                className="absolute -top-2 -right-2 z-50"
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Star Badge Container */}
                <motion.div
                  className="relative"
                  animate={{ 
                    rotateY: [0, 360],
                    rotateX: [0, 15, -15, 0],
                  }}
                  transition={{ 
                    rotateY: { duration: 3, repeat: Infinity, ease: "linear" },
                    rotateX: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                  }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Star Icon */}
                  <div className="relative w-8 h-8 flex items-center justify-center">
                    <Star className="w-6 h-6 text-primary fill-primary drop-shadow-[0_0_12px_hsl(175_80%_50%)]" />
                    {/* Glowing rings */}
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-primary/50"
                      animate={{ 
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 0, 0.5]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <motion.div
                      className="absolute inset-0 rounded-full border border-primary/30"
                      animate={{ 
                        scale: [1, 1.8, 1],
                        opacity: [0.3, 0, 0.3]
                      }}
                      transition={{ duration: 2.5, repeat: Infinity, delay: 0.3 }}
                    />
                    {/* Sparkle particles */}
                    {[...Array(4)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-primary rounded-full"
                        style={{
                          top: "50%",
                          left: "50%",
                        }}
                        animate={{
                          x: [0, Math.cos((i * Math.PI) / 2) * 20],
                          y: [0, Math.sin((i * Math.PI) / 2) * 20],
                          opacity: [0, 1, 0],
                          scale: [0, 1, 0],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                      />
                    ))}
                  </div>
                  {/* Badge background glow */}
                  <motion.div
                    className="absolute inset-0 bg-primary/20 rounded-full blur-xl -z-10"
                    animate={{ 
                      scale: [1, 1.3, 1],
                      opacity: [0.4, 0.6, 0.4]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.a>

        {/* Desktop Navigation with Enhanced Hover Effects */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.substring(1);
            return (
              <motion.button
                key={link.name}
                onClick={() => scrollToSection(link.href)}
                className={cn(
                  "relative px-4 py-2 text-sm font-medium transition-all duration-200 rounded-full overflow-hidden group/nav",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  isActive
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50 dark:hover:bg-white/5"
                )}
                aria-current={isActive ? "page" : undefined}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Shimmer effect on hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/nav:translate-x-full"
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                />
                
                {/* Active indicator glow */}
                {isActive && (
                  <motion.div
                    className="absolute inset-0 bg-primary/20 rounded-full blur-md -z-10"
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
                
                {/* Text with glow on hover */}
                <span className="relative z-10">
                  {link.name}
                </span>
                
                {/* Bottom border animation */}
                <motion.div
                  className="absolute bottom-0 left-1/2 h-0.5 bg-primary rounded-full"
                  initial={{ width: 0, x: "-50%" }}
                  animate={{ 
                    width: isActive ? "80%" : "0%",
                    x: "-50%"
                  }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="hero"
              size={isScrolled ? "sm" : "default"}
              onClick={() => scrollToSection("#contact")}
              className={cn(
                "rounded-full font-semibold shadow-md transition-all duration-200 gap-2 relative overflow-hidden group/cta",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                isScrolled ? "px-5" : "px-6"
              )}
              aria-label="Let's Talk - Contact me"
            >
              {/* Animated gradient shimmer */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              />
              
              {/* Glow effect on hover */}
              <motion.div
                className="absolute inset-0 bg-primary/40 rounded-full blur-xl opacity-0 group-hover/cta:opacity-100 -z-10"
                transition={{ duration: 0.3 }}
              />
              
              <span className="relative z-10 flex items-center gap-2">
                Let's Talk
                <motion.span
                  animate={{ x: [0, 4, 0], y: [0, -4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ArrowUpRight className="w-4 h-4" />
                </motion.span>
              </span>
            </Button>
          </motion.div>

          {/* Mobile Menu Toggle with Enhanced Hover */}
          <motion.button
            className="md:hidden p-2 text-foreground hover:bg-secondary/50 dark:hover:bg-white/5 rounded-lg transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center relative overflow-hidden group/menu"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
          >
            {/* Ripple effect on hover */}
            <motion.div
              className="absolute inset-0 bg-primary/20 rounded-lg"
              initial={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.5, opacity: [0, 0.5, 0] }}
              transition={{ duration: 0.6 }}
            />
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-6 h-6 relative z-10" aria-hidden="true" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="w-6 h-6 relative z-10" aria-hidden="true" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
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
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

