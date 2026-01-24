import { ArrowDown, Download, Github, Linkedin, Mail, Sparkles, ExternalLink, Eye, ChevronDown, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, useMotionValue, useSpring, useTransform, useInView, AnimatePresence, useReducedMotion } from "framer-motion";
import { useRef, useState, useEffect, lazy, Suspense } from "react";
import photo800Webp from "@/images/my-photo-800.webp";
import photo1200Webp from "@/images/my-photo-1200.webp";
import photo800Jpg from "@/images/my-photo-800.jpg";
import photo1200Jpg from "@/images/my-photo-1200.jpg";
import { MobileGradientBackground } from "./MobileGradientBackground";
import { scrollToSection } from "@/components/SmoothScroll";
import { useAudioContext } from "@/hooks/useAudioFeedback";
import { useIsMobile } from "@/hooks/useIsMobile";
import { shouldEnable3D } from "@/hooks/use3DPerformance";

const HeroBackground3D = lazy(async () => {
  const mod = await import("./HeroBackground3D");
  return { default: mod.HeroBackground3D };
});

const socialLinks = [
  { icon: Github, href: "https://github.com/Moinkhan-cmd", label: "GitHub", gradient: "from-[#333] to-[#6e5494]" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/moinkhan-bhatti-65363a255", label: "LinkedIn", gradient: "from-[#0077b5] to-[#00a0dc]" },
  { icon: Mail, href: "https://mail.google.com/mail/?view=cm&fs=1&to=moinbhatti59%40gmail.com", label: "Email", gradient: "from-[#ea4335] to-[#fbbc05]" },
] as const;

const roles = ["Frontend Developer", "UI/UX Designer", "React Specialist", "Creative Coder"];

export const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [currentRole, setCurrentRole] = useState(0);
  const reduceMotion = useReducedMotion();
  const [cursorGlowEnabled, setCursorGlowEnabled] = useState(false);
  const cursorRafRef = useRef<number | null>(null);
  const cursorPendingRef = useRef<{ x: number; y: number }>({ x: -1000, y: -1000 });
  const isMobile = useIsMobile();
  
  // Audio feedback
  let playClickSound = () => {};
  try {
    const audio = useAudioContext();
    playClickSound = () => audio.playSound("click");
  } catch {
    // Audio context not available
  }
  
  // Only use motion values on desktop - these hooks are always called but values are only used on desktop
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 150 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), springConfig);
  const isInView = useInView(contentRef, { once: true, amount: 0.2 });

  const cursorX = useMotionValue(-1000);
  const cursorY = useMotionValue(-1000);
  const cursorXSpring = useSpring(cursorX, { damping: 35, stiffness: 240 });
  const cursorYSpring = useSpring(cursorY, { damping: 35, stiffness: 240 });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRole((prev) => (prev + 1) % roles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      setCursorGlowEnabled(false);
      return;
    }

    const coarsePointer = window.matchMedia?.("(pointer: coarse)")?.matches ?? false;
    setCursorGlowEnabled(!coarsePointer);

    return () => {
      if (cursorRafRef.current != null) cancelAnimationFrame(cursorRafRef.current);
      cursorRafRef.current = null;
    };
  }, [reduceMotion]);

  const scheduleCursorUpdate = (clientX: number, clientY: number) => {
    cursorPendingRef.current = { x: clientX, y: clientY };
    if (cursorRafRef.current != null) return;

    cursorRafRef.current = requestAnimationFrame(() => {
      cursorRafRef.current = null;
      const { x, y } = cursorPendingRef.current;
      // Center a 500x500 glow on the pointer
      cursorX.set(x - 250);
      cursorY.set(y - 250);
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
    if (cursorGlowEnabled) scheduleCursorUpdate(e.clientX, e.clientY);
  };

  return (
    <section
      id="hero"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen overflow-hidden bg-background pt-20 sm:pt-24 md:pt-28 lg:pt-32 flex items-center pb-16 sm:pb-20 md:pb-24 lg:pb-16"
    >
      {/* 3D Background */}
      {shouldEnable3D() && (
        <Suspense fallback={null}>
          <HeroBackground3D />
        </Suspense>
      )}
      <MobileGradientBackground variant="hero" />
      
      {/* Layered gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/60 to-background pointer-events-none z-[1]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,hsl(var(--primary)/0.15),transparent)] pointer-events-none z-[1]" />
      
      {/* Static mesh gradient - optimized for performance */}
      {!isMobile && (
        <div className="absolute inset-0 overflow-hidden z-[1]">
          <div
            className="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] rounded-full blur-[100px] opacity-15"
            style={{ background: "radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)" }}
          />
          <div
            className="absolute -bottom-1/4 -left-1/4 w-[500px] h-[500px] rounded-full blur-[80px] opacity-10"
            style={{ background: "radial-gradient(circle, hsl(280 70% 50%) 0%, transparent 70%)" }}
          />
        </div>
      )}

      {/* Interactive cursor glow */}
      {cursorGlowEnabled && (
        <motion.div
          className="pointer-events-none fixed left-0 top-0 w-[500px] h-[500px] rounded-full opacity-10 blur-3xl z-30 transition-opacity duration-500"
          style={{
            background: "radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)",
            x: cursorXSpring,
            y: cursorYSpring,
          }}
        />
      )}

      {/* Main Content Container - Enhanced Responsive */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-8 sm:py-12 md:py-16 lg:py-20 pb-20 sm:pb-24 md:pb-28 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-16 xl:gap-20 items-center">
          
          {/* Left Column - Content */}
          <motion.div
            ref={contentRef}
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-7"
          >
            {/* Status Badge - Frosted Glass Style */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ delay: 0.2, type: "spring", stiffness: 120, damping: 15 }}
              className="inline-block"
            >
              <div className="group relative inline-flex items-center gap-2.5 sm:gap-3 px-5 sm:px-6 py-2.5 sm:py-3 rounded-2xl cursor-default bg-white/[0.08] dark:bg-white/[0.05] backdrop-blur-2xl border border-white/20 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:bg-white/[0.12] dark:hover:bg-white/[0.08] hover:border-white/30 dark:hover:border-white/15 transition-all duration-300">
                {/* Inner glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
                
                {/* Subtle top highlight */}
                <div className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                
                {/* Content */}
                <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-full w-full bg-emerald-500 shadow-lg shadow-emerald-500/50" />
                </span>
                <span className="relative text-xs sm:text-sm font-medium text-foreground/90">
                  Open to New Opportunities
                </span>
                <Sparkles className="relative w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
              </div>
            </motion.div>

            {/* Name in Signature Style with Fancy Underline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="pt-2"
            >
              <h2 className="font-signature text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-foreground font-medium leading-tight">
                <span className="relative inline-block">
                  Moinkhan Bhatti
                  {/* Animated gradient underline */}
                  <motion.span
                    className="absolute -bottom-1 sm:-bottom-2 left-0 w-full h-[3px] sm:h-[4px] rounded-full bg-gradient-to-r from-primary via-violet-500 to-fuchsia-500 origin-left"
                    initial={{ scaleX: 0 }}
                    animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                    transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
                  />
                  {/* Glowing effect */}
                  <motion.span
                    className="absolute -bottom-1 sm:-bottom-2 left-0 w-full h-[3px] sm:h-[4px] rounded-full bg-gradient-to-r from-primary via-violet-500 to-fuchsia-500 blur-sm opacity-60 origin-left"
                    initial={{ scaleX: 0 }}
                    animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                    transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
                  />
                  {/* Shimmer animation */}
                  <motion.span
                    className="absolute -bottom-1 sm:-bottom-2 left-0 h-[3px] sm:h-[4px] w-8 sm:w-12 rounded-full bg-white/40 blur-[2px]"
                    animate={{ 
                      x: ['-100%', '400%'],
                      opacity: [0, 1, 1, 0]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3,
                      ease: "easeInOut"
                    }}
                  />
                </span>
              </h2>
            </motion.div>

            {/* Main Heading - Enhanced Typography - Responsive */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="space-y-2"
            >
              <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-black leading-[1] sm:leading-[0.95] md:leading-[0.9] tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
                <motion.span 
                  className="block text-foreground/90"
                  initial={{ opacity: 0, x: -30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.4 }}
                >
                  Crafting
                </motion.span>
                <motion.span
                  className="block relative"
                  initial={{ opacity: 0, x: -30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.5 }}
                >
                  <span className="bg-gradient-to-r from-primary via-violet-500 to-fuchsia-500 bg-clip-text text-transparent bg-[length:200%_auto] animate-[gradient-x_3s_ease-in-out_infinite]">
                    Digital
                  </span>
                  <motion.span
                    className="absolute -right-8 top-0 hidden sm:block"
                    animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                  </motion.span>
                </motion.span>
                <motion.span 
                  className="block text-foreground/90"
                  initial={{ opacity: 0, x: -30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.6 }}
                >
                  Experiences
                </motion.span>
              </h1>
            </motion.div>

            {/* Animated Role */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.8 }}
              className="h-8 sm:h-9 md:h-10 lg:h-11 overflow-hidden"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentRole}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -50, opacity: 0 }}
                  transition={{ duration: 0.6, type: "spring" }}
                  className="text-base sm:text-lg md:text-xl lg:text-2xl text-primary font-medium flex items-center gap-2 sm:gap-3" style={{ fontFamily: 'var(--font-body)' }}
                >
                  <Code2 className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-primary flex-shrink-0" />
                  <span className="truncate">{roles[currentRole]}</span>
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.9 }}
              className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-foreground/90 leading-relaxed max-w-2xl font-normal" style={{ fontFamily: 'var(--font-body)' }}
            >
              Building seamless, user-centric interfaces with{" "}
              <span className="text-foreground font-medium">clean code</span> and{" "}
              <span className="text-foreground font-medium">pixel-perfect precision</span>. 
              Turning complex problems into elegant solutions.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.9 }}
              className="flex flex-wrap gap-4 pt-2"
            >
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  size="lg"
                  onClick={() => { playClickSound(); scrollToSection("#projects"); }}
                  className="group relative overflow-hidden bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 text-base shadow-2xl shadow-primary/25 hover:shadow-primary/40 transition-all duration-300"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    View My Work
                    <motion.span
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </motion.span>
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                  />
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={playClickSound}
                      className="group border-2 border-border hover:border-primary/50 hover:bg-primary/5 px-8 py-6 text-base font-semibold backdrop-blur-sm"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Resume
                      <ChevronDown className="ml-2 h-4 w-4 group-hover:rotate-180 transition-transform duration-300" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 z-[9999]" sideOffset={8}>
                    <DropdownMenuItem
                      onClick={() => { playClickSound(); window.open("https://drive.google.com/file/d/1zazQMAtUtsYttXd4xxs3-PEoKgKgltIR/view?usp=sharing", "_blank"); }}
                      className="cursor-pointer"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Resume
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => { playClickSound(); window.open("https://drive.google.com/uc?export=download&id=1zazQMAtUtsYttXd4xxs3-PEoKgKgltIR", "_blank"); }}
                      className="cursor-pointer"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </motion.div>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 1 }}
              className="flex items-center gap-4 pt-4"
            >
              <span className="text-sm text-muted-foreground font-medium">Connect:</span>
              <div className="flex gap-3">
                {socialLinks.map((link, index) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={playClickSound}
                    className="group relative p-3 rounded-xl border border-border bg-background/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 overflow-hidden"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 1.1 + index * 0.1, type: "spring" }}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={link.label}
                  >
                    <link.icon className="w-5 h-5 relative z-10 text-foreground group-hover:text-primary transition-colors" />
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-br ${link.gradient} opacity-0 group-hover:opacity-10 transition-opacity`}
                    />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 50 }}
            animate={isInView ? { opacity: 1, scale: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative flex items-center justify-center pt-8 lg:pt-0"
          >
            {/* Mobile: Simple static container, Desktop: 3D rotation with orbitals */}
            <div 
              className="relative"
              style={!isMobile ? { 
                transform: `perspective(1000px) rotateX(${rotateX.get()}deg) rotateY(${rotateY.get()}deg)`,
                transformStyle: "preserve-3d" 
              } : undefined}
            >
              {/* Orbital rings - Desktop only */}
              {!isMobile && (
                <>
                  <motion.div
                    className="absolute inset-0 -m-12 rounded-full border border-primary/10"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                  >
                    <motion.div
                      className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary/60 shadow-lg shadow-primary/50"
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </motion.div>
                  <motion.div
                    className="absolute inset-0 -m-20 rounded-full border border-primary/5"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                  >
                    <motion.div className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-violet-500/60" />
                  </motion.div>
                </>
              )}

              {/* Main image container */}
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-[420px] lg:h-[420px] xl:w-[480px] xl:h-[480px] mx-auto">
                {/* Enhanced gradient glow - simplified on mobile */}
                {!isMobile && (
                  <motion.div
                    className="absolute inset-0 rounded-3xl blur-3xl opacity-30"
                    style={{ background: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(280 70% 50%) 50%, hsl(340 70% 50%) 100%)" }}
                    animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.05, 1] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  />
                )}
                
                {/* Image frame */}
                <div className="relative w-full h-full rounded-3xl overflow-hidden">
                  {/* Animated gradient border - Desktop only */}
                  {!isMobile && (
                    <motion.div
                      className="absolute inset-0 rounded-3xl p-[3px] border-gradient-animated"
                      style={{
                        background: "conic-gradient(from var(--angle, 0deg), hsl(var(--primary)), hsl(280 70% 50%), hsl(340 70% 50%), hsl(var(--primary)))",
                        "--angle": "0deg",
                      } as React.CSSProperties}
                    >
                      <div className="w-full h-full rounded-[21px] bg-background" />
                    </motion.div>
                  )}

                  {/* Simple border for mobile */}
                  {isMobile && (
                    <div className="absolute inset-0 rounded-3xl border-2 border-primary/30" />
                  )}

                  <picture>
                    <source
                      type="image/webp"
                      srcSet={`${photo800Webp} 800w, ${photo1200Webp} 1200w`}
                      sizes="(min-width: 1024px) 480px, (min-width: 768px) 320px, 288px"
                    />
                    <img
                      src={photo1200Jpg}
                      srcSet={`${photo800Jpg} 800w, ${photo1200Jpg} 1200w`}
                      sizes="(min-width: 1024px) 480px, (min-width: 768px) 320px, 288px"
                      alt="Moinkhan Bhatti"
                      decoding="async"
                      fetchPriority="high"
                      className="absolute inset-[4px] w-[calc(100%-8px)] h-[calc(100%-8px)] object-cover rounded-[19px]"
                      style={{ objectPosition: "center 10%" }}
                    />
                  </picture>

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent rounded-3xl" />
                  
                  {/* Shine effect - Desktop only */}
                  {!isMobile && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full rounded-3xl"
                      animate={{ translateX: ["-100%", "200%"] }}
                      transition={{ duration: 4, repeat: Infinity, repeatDelay: 3 }}
                    />
                  )}
                </div>

                {/* Sparkle decorations - Desktop only */}
                {!isMobile && [
                  { top: "-8%", right: "5%", delay: 0 },
                  { bottom: "15%", left: "-10%", delay: 0.5 },
                  { top: "25%", right: "-8%", delay: 1 },
                ].map((pos, i) => (
                  <motion.div
                    key={i}
                    className="absolute"
                    style={{ top: pos.top, bottom: pos.bottom, right: pos.right, left: pos.left }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 1.3 + pos.delay }}
                  >
                    <motion.div
                      animate={{ rotate: 360, scale: [1, 1.3, 1] }}
                      transition={{ duration: 4 + i, repeat: Infinity }}
                    >
                      <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-4 sm:bottom-6 md:bottom-8 lg:bottom-8 left-1/2 -translate-x-1/2 z-30 pointer-events-none"
      >
        <motion.button
          onClick={() => scrollToSection("#about")}
          className="flex flex-col items-center gap-2 sm:gap-3 text-muted-foreground hover:text-foreground transition-colors group touch-manipulation p-2 pointer-events-auto mx-auto"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          whileTap={{ scale: 0.9 }}
          aria-label="Scroll to about section"
        >
          <span className="text-[10px] font-semibold tracking-[0.2em] uppercase">Scroll</span>
          <motion.div
            className="p-2 rounded-full border border-border group-hover:border-primary/50 transition-colors"
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ArrowDown className="w-4 h-4" />
          </motion.div>
        </motion.button>
      </motion.div>

      {/* CSS for gradient animation */}
      <style>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% center; }
          50% { background-position: 100% center; }
        }
        @keyframes rotate-gradient {
          from { --angle: 0deg; }
          to { --angle: 360deg; }
        }
        .border-gradient-animated {
          animation: rotate-gradient 8s linear infinite;
        }
      `}</style>
    </section>
  );
};
