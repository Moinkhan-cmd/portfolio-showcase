import { ArrowDown, Download, Github, Linkedin, Mail, Sparkles, Code2, Rocket, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, useMotionValue, useSpring, useTransform, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

import myPhoto from "@/images/my photo.jpg";
import { HeroBackground3D } from "./HeroBackground3D";
import { CustomCursor } from "./CustomCursor";

const socialLinks = [
  { icon: Github, href: "https://github.com/Moinkhan-cmd", label: "GitHub", color: "hover:text-[#333]" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/moin-bhatti-65363a255", label: "LinkedIn", color: "hover:text-[#0077b5]" },
  { icon: Mail, href: "https://mail.google.com/mail/?view=cm&fs=1&to=moinbhatti59%40gmail.com", label: "Email", color: "hover:text-[#ea4335]" },
] as const;

const typingRoles = [
  "Frontend Developer",
  "UI/UX Designer",
  "React Specialist",
  "Creative Coder",
];

const TypingText = ({ text, className }: { text: string; className?: string }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 30);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text]);

  // Blinking cursor
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className={className}>
      {displayedText}
      {showCursor && <span className="inline-block w-0.5 h-6 bg-primary ml-1 align-middle animate-pulse" />}
    </span>
  );
};

const AnimatedRole = () => {
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    const currentRole = typingRoles[currentRoleIndex];
    
    const handleTyping = () => {
      if (!isDeleting) {
        // Typing
        if (displayText.length < currentRole.length) {
          setDisplayText(currentRole.slice(0, displayText.length + 1));
          setTypingSpeed(150);
        } else {
          // Finished typing, wait then start deleting
          setTimeout(() => setIsDeleting(true), 2000);
          setTypingSpeed(100);
        }
      } else {
        // Deleting
        if (displayText.length > 0) {
          setDisplayText(currentRole.slice(0, displayText.length - 1));
          setTypingSpeed(50);
        } else {
          // Finished deleting, move to next role
          setIsDeleting(false);
          setCurrentRoleIndex((prev) => (prev + 1) % typingRoles.length);
          setTypingSpeed(150);
        }
      }
    };

    const timeout = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentRoleIndex]);

  return (
    <span className="inline-block min-w-[200px] text-left">
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
        className="inline-block w-0.5 h-8 bg-primary ml-1 align-middle"
      />
    </span>
  );
};

export const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 30, stiffness: 200 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [12, -12]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), springConfig);
  
  const isInView = useInView(contentRef, { once: true, amount: 0.3 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
    setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <CustomCursor isActive={true} containerRef={containerRef} />
      <section 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative min-h-screen overflow-hidden px-4 cursor-none"
        style={{ cursor: 'none' }}
      >
        {/* 3D Background */}
        <HeroBackground3D />
        
        {/* Enhanced Mouse follower glow with multiple layers */}
        <motion.div
          className="pointer-events-none absolute w-[500px] h-[500px] rounded-full opacity-20 blur-3xl z-[1]"
          style={{
            background: "radial-gradient(circle, hsl(175 80% 50% / 0.5) 0%, hsl(200 90% 60% / 0.3) 50%, transparent 70%)",
            left: mousePosition.x - 250,
            top: mousePosition.y - 250,
          }}
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        
        {/* Secondary glow layer */}
        <motion.div
          className="pointer-events-none absolute w-[300px] h-[300px] rounded-full opacity-30 blur-2xl z-[1]"
          style={{
            background: "radial-gradient(circle, hsl(280 80% 60% / 0.4) 0%, transparent 70%)",
            left: mousePosition.x - 150,
            top: mousePosition.y - 150,
          }}
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />
        
        {/* Dynamic overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-background/40 via-background/30 to-background/50 pointer-events-none z-[1]" />

        <div className="container mx-auto container-padding relative z-10 flex min-h-screen flex-col justify-center pt-28 pb-20 sm:pt-32 sm:pb-28">
          <div ref={contentRef} className="grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
            {/* Left: Enhanced 3D Interactive Profile Image */}
            <motion.div 
              className="order-2 lg:order-1 flex justify-center lg:justify-start perspective-1000"
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
              }}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <div className="relative" style={{ transformStyle: "preserve-3d" }}>
                {/* Enhanced orbital rings with gradient */}
                <motion.div 
                  className="absolute -inset-8 rounded-full border-2 border-primary/40"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  style={{ transform: "translateZ(-40px)" }}
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0" />
                </motion.div>
                
                <motion.div 
                  className="absolute -inset-14 rounded-full border border-primary/25"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  style={{ transform: "translateZ(-60px)" }}
                />
                
                <motion.div 
                  className="absolute -inset-20 rounded-full border border-primary/15"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                  style={{ transform: "translateZ(-80px)" }}
                />
                
                {/* Floating particles with trail effect */}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2.5 h-2.5 rounded-full bg-primary/70 shadow-lg shadow-primary/50"
                    style={{
                      top: `${20 + Math.sin(i * 45 * Math.PI / 180) * 50}%`,
                      left: `${50 + Math.cos(i * 45 * Math.PI / 180) * 60}%`,
                      transform: `translateZ(${30 + i * 15}px)`,
                    }}
                    animate={{
                      y: [0, -20, 0],
                      opacity: [0.5, 1, 0.5],
                      scale: [1, 1.4, 1],
                    }}
                    transition={{
                      duration: 2.5 + i * 0.4,
                      repeat: Infinity,
                      delay: i * 0.25,
                      ease: "easeInOut",
                    }}
                  />
                ))}
                
                {/* Enhanced glow effect */}
                <motion.div 
                  className="absolute inset-0 rounded-full blur-3xl"
                  style={{
                    background: "radial-gradient(circle, hsl(175 80% 50% / 0.5) 0%, hsl(200 90% 60% / 0.3) 50%, transparent 70%)",
                    transform: "translateZ(-30px) scale(1.6)",
                  }}
                  animate={{
                    opacity: [0.4, 0.6, 0.4],
                    scale: [1.5, 1.7, 1.5],
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                
                {/* Main image container with enhanced 3D depth */}
                <motion.div 
                  className="relative"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                  style={{ transform: "translateZ(50px)" }}
                >
                  <div className="relative w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden border-4 border-primary/50 shadow-2xl">
                    {/* Animated border gradient */}
                    <motion.div
                      className="absolute -inset-1 rounded-full"
                      style={{
                        background: "conic-gradient(from 0deg, hsl(175 80% 50%), hsl(200 90% 60%), hsl(280 80% 60%), hsl(175 80% 50%))",
                        padding: "4px",
                      }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    >
                      <div className="w-full h-full rounded-full bg-background" />
                    </motion.div>
                    
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-accent/30 z-10" />
                    <img 
                      src={myPhoto} 
                      alt="Moinkhan Bhatti - Frontend Developer" 
                      className="w-full h-full object-cover object-center relative z-0"
                    />
                    
                    {/* Overlay shimmer effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent z-10"
                      animate={{
                        x: ["-100%", "200%"],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        repeatDelay: 2,
                        ease: "easeInOut",
                      }}
                    />
                  </div>
                  
                  {/* Enhanced sparkle accents */}
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute"
                      style={{
                        top: `${i === 0 ? "-10%" : i === 1 ? "20%" : "80%"}%`,
                        right: i === 1 ? "-15%" : "-10%",
                        left: i === 2 ? "-10%" : undefined,
                        transform: "translateZ(70px)",
                      }}
                      animate={{ 
                        rotate: 360, 
                        scale: [1, 1.3, 1],
                        opacity: [0.6, 1, 0.6],
                      }}
                      transition={{ 
                        duration: 3 + i, 
                        repeat: Infinity,
                        delay: i * 0.5,
                      }}
                    >
                      <Sparkles className="w-7 h-7 text-primary drop-shadow-lg" />
                    </motion.div>
                  ))}
                  
                  {/* Premium Status Badge with enhanced design */}
                  <motion.div 
                    className="absolute -bottom-8 left-1/2 -translate-x-1/2 z-20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.6 }}
                  >
                    <div className="relative group">
                      {/* Enhanced glow background */}
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-r from-emerald-500/40 via-green-400/50 to-emerald-500/40 rounded-full blur-2xl"
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.6, 0.8, 0.6],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      
                      {/* Main badge */}
                      <div className="relative flex items-center gap-3 px-7 py-3.5 rounded-full bg-gradient-to-r from-emerald-600/95 to-green-500/95 border-2 border-emerald-400/40 shadow-xl shadow-emerald-500/30 backdrop-blur-sm">
                        {/* Animated pulse ring */}
                        <div className="relative flex items-center justify-center">
                          <motion.span 
                            className="absolute h-5 w-5 rounded-full bg-white/40"
                            animate={{ 
                              scale: [1, 1.5, 1],
                              opacity: [0.6, 0, 0.6],
                            }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                          />
                          <span className="relative h-3 w-3 rounded-full bg-white shadow-lg shadow-white/60" />
                        </div>
                        
                        {/* Text with enhanced styling */}
                        <div className="flex items-center gap-2.5">
                          <span className="text-sm font-bold text-white tracking-wide">
                            Available for Hire
                          </span>
                          <motion.span
                            animate={{ 
                              rotate: [0, 15, -15, 0],
                              scale: [1, 1.2, 1],
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="text-white/95 text-lg"
                          >
                            ✨
                          </motion.span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>

            {/* Right: Enhanced Content with modern typography */}
            <div className="order-1 lg:order-2 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
              >
                {/* Enhanced greeting with icon */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center justify-center lg:justify-start gap-3 mb-4"
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles className="w-5 h-5 text-primary" />
                  </motion.div>
                  <p className="text-xl sm:text-2xl text-muted-foreground font-light italic">
                    Hey there! I'm
                  </p>
                </motion.div>
                
                {/* Enhanced Name with gradient and animation */}
                <motion.h1 
                  className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl mb-6 relative font-bold"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <span className="gradient-text block leading-tight" style={{ 
                    textShadow: "0 0 60px hsl(175 80% 50% / 0.4), 0 0 100px hsl(175 80% 50% / 0.2)",
                    letterSpacing: "-0.02em",
                  }}>
                    Moinkhan
                  </span>
                  <span className="gradient-text block leading-tight -mt-2" style={{ 
                    textShadow: "0 0 60px hsl(200 90% 60% / 0.4), 0 0 100px hsl(200 90% 60% / 0.2)",
                    letterSpacing: "-0.02em",
                  }}>
                    Bhatti
                  </span>
                  
                  {/* Decorative elements */}
                  <motion.span
                    className="absolute -right-6 -top-4 text-primary/50 text-5xl"
                    animate={{ 
                      rotate: [0, 20, 0],
                      scale: [1, 1.15, 1],
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    ✦
                  </motion.span>
                </motion.h1>

                {/* Animated Role Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ delay: 0.6 }}
                  className="mb-8"
                >
                  <div className="inline-flex items-center gap-3 glass-card px-6 py-3 rounded-full border-2 border-primary/30 backdrop-blur-xl">
                    <Code2 className="w-5 h-5 text-primary" />
                    <span className="text-lg font-semibold text-foreground">
                      <AnimatedRole />
                    </span>
                    <Rocket className="w-5 h-5 text-primary animate-bounce" />
                  </div>
                </motion.div>

                {/* Enhanced Description */}
                <motion.div 
                  className="mt-8 text-lg sm:text-xl max-w-2xl mx-auto lg:mx-0 mb-8"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <div 
                    className="relative p-8 rounded-3xl glass-card border-2 border-primary/20 backdrop-blur-xl shadow-2xl"
                    style={{
                      background: "linear-gradient(135deg, hsl(222 47% 12% / 0.9) 0%, hsl(222 47% 8% / 0.7) 100%)",
                    }}
                  >
                    {/* Decorative corner accent */}
                    <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-primary/30 rounded-tl-3xl" />
                    <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-primary/30 rounded-br-3xl" />
                    
                    <motion.span
                      className="absolute -top-4 left-8 px-4 py-1.5 text-xs font-mono text-primary bg-background rounded-full border-2 border-primary/30 shadow-lg"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 }}
                    >
                      {"< about-me />"}
                    </motion.span>
                    
                    <p className="text-muted-foreground leading-relaxed font-light text-base sm:text-lg mt-4">
                      <TypingText 
                        text="Crafting exceptional digital experiences through innovative frontend solutions. Specializing in React, TypeScript, and modern web technologies to build fast, beautiful, and user-centric applications."
                      />
                    </p>
                  </div>
                </motion.div>

                {/* Enhanced Tech Stack Tags */}
                <motion.div 
                  className="mt-10 flex flex-wrap justify-center lg:justify-start gap-4"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: 1 }}
                >
                  {[
                    { name: "React", icon: "⚛️" },
                    { name: "TypeScript", icon: "📘" },
                    { name: "Next.js", icon: "▲" },
                    { name: "Tailwind CSS", icon: "🎨" },
                    { name: "UI/UX Design", icon: "✨" },
                  ].map((tech, i) => (
                    <motion.span 
                      key={tech.name}
                      className="group glass-card rounded-full px-6 py-3 text-sm font-semibold text-foreground/90 border-2 border-primary/30 cursor-default backdrop-blur-xl relative overflow-hidden"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                      transition={{ delay: 1.1 + i * 0.1, type: "spring", stiffness: 200 }}
                      whileHover={{ 
                        scale: 1.1,
                        boxShadow: "0 15px 40px hsl(175 80% 50% / 0.3)",
                        borderColor: "hsl(175 80% 50%)",
                        y: -4,
                      }}
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        <span>{tech.icon}</span>
                        <span>{tech.name}</span>
                      </span>
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "100%" }}
                        transition={{ duration: 0.5 }}
                      />
                    </motion.span>
                  ))}
                </motion.div>

                {/* Enhanced CTA Buttons */}
                <motion.div 
                  className="mt-12 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                >
                  <motion.div 
                    whileHover={{ scale: 1.05, y: -3 }} 
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      variant="hero" 
                      size="lg" 
                      onClick={() => scrollToSection("#projects")}
                      className="glow-on-hover btn-lift min-w-[200px] h-14 text-lg relative overflow-hidden group border-2 border-primary/30"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        <Rocket className="w-5 h-5" />
                        <span>View My Work</span>
                      </span>
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/20 to-primary/0"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "100%" }}
                        transition={{ duration: 0.6 }}
                      />
                    </Button>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ scale: 1.05, y: -3 }} 
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="hero-outline"
                      size="lg"
                      className="btn-lift border-2 border-primary/50 bg-transparent hover:bg-primary/10 min-w-[200px] h-14 text-lg backdrop-blur-sm"
                      asChild
                    >
                      <a href="https://drive.google.com/uc?export=download&id=1p42p9NpczSWy_-iLeVaO38ciHAMHXp9r" download="Moin_Bhatti_Resume.pdf">
                        <Download className="w-5 h-5 mr-2" />
                        Download Resume
                      </a>
                    </Button>
                  </motion.div>
                </motion.div>

                {/* Enhanced Social Links */}
                <motion.div 
                  className="mt-12 flex items-center justify-center lg:justify-start gap-6"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.6, delay: 1.4 }}
                >
                  <span className="text-base text-muted-foreground font-light flex items-center gap-2">
                    <Zap className="w-4 h-4 text-primary" />
                    Connect with me
                  </span>
                  <div className="flex gap-4">
                    {socialLinks.map(({ icon: Icon, href, label, color }, index) => (
                      <motion.a
                        key={label}
                        href={href}
                        aria-label={label}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-14 h-14 rounded-2xl glass-card flex items-center justify-center border-2 border-primary/30 hover:border-primary/70 transition-all duration-300 backdrop-blur-xl relative overflow-hidden group"
                        initial={{ opacity: 0, scale: 0, rotate: -180 }}
                        animate={isInView ? { opacity: 1, scale: 1, rotate: 0 } : { opacity: 0, scale: 0, rotate: -180 }}
                        transition={{ 
                          duration: 0.5, 
                          delay: 1.5 + index * 0.1, 
                          type: "spring",
                          stiffness: 200,
                        }}
                        whileHover={{ 
                          scale: 1.2, 
                          y: -5,
                          rotate: 5,
                          boxShadow: "0 15px 40px hsl(175 80% 50% / 0.4)",
                        }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Icon className={`h-6 w-6 text-foreground/80 ${color} transition-colors duration-300 relative z-10`} />
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30"
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      </motion.a>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* Enhanced Scroll Indicator */}
          <motion.div 
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.6 }}
          >
            <motion.button
              onClick={() => scrollToSection("#about")}
              className="p-4 text-muted-foreground hover:text-primary transition-colors rounded-full glass-card border-2 border-primary/30 backdrop-blur-xl group"
              aria-label="Scroll to about"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              whileHover={{ 
                scale: 1.15, 
                borderColor: "hsl(175 80% 50%)",
                boxShadow: "0 10px 30px hsl(175 80% 50% / 0.3)",
              }}
              whileTap={{ scale: 0.9 }}
            >
              <ArrowDown className="w-6 h-6 group-hover:translate-y-1 transition-transform" />
            </motion.button>
          </motion.div>
        </div>
      </section>
    </>
  );
};