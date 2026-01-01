import { ArrowDown, Download, Github, Linkedin, Mail, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";

import myPhoto from "@/images/my photo.jpg";
import { HeroBackground3D } from "./HeroBackground3D";

const socialLinks = [
  { icon: Github, href: "https://github.com/Moinkhan-cmd", label: "GitHub" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/moin-bhatti-65363a255", label: "LinkedIn" },
  { icon: Mail, href: "https://mail.google.com/mail/?view=cm&fs=1&to=moinbhatti59%40gmail.com", label: "Email" },
] as const;

const TypingText = ({ text, className }: { text: string; className?: string }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 40);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text]);

  return (
    <span className={className}>
      {displayedText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        className="inline-block w-0.5 h-6 bg-primary ml-1 align-middle"
      />
    </span>
  );
};

export const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 150 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), springConfig);
  
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
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-screen overflow-hidden px-4"
    >
      {/* 3D Background */}
      <HeroBackground3D />
      
      {/* Mouse follower glow */}
      <motion.div
        className="pointer-events-none absolute w-96 h-96 rounded-full opacity-30 blur-3xl z-[1]"
        style={{
          background: "radial-gradient(circle, hsl(175 80% 50% / 0.4) 0%, transparent 70%)",
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
        }}
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      
      {/* Overlay for text contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/50 to-background/30 pointer-events-none z-[1]" />

      <div className="container mx-auto container-padding relative z-10 flex min-h-screen flex-col justify-center pt-28 pb-20 sm:pt-32 sm:pb-28">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: 3D Interactive Profile Image */}
          <motion.div 
            className="order-2 lg:order-1 flex justify-center lg:justify-start perspective-1000"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            style={{
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
            }}
          >
            <div className="relative" style={{ transformStyle: "preserve-3d" }}>
              {/* Animated orbital rings */}
              <motion.div 
                className="absolute -inset-6 rounded-full border-2 border-primary/30"
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                style={{ transform: "translateZ(-30px)" }}
              />
              <motion.div 
                className="absolute -inset-12 rounded-full border border-primary/15"
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                style={{ transform: "translateZ(-50px)" }}
              />
              <motion.div 
                className="absolute -inset-16 rounded-full border border-primary/10"
                animate={{ rotate: 360 }}
                transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
                style={{ transform: "translateZ(-70px)" }}
              />
              
              {/* Floating particles around image */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-primary/60"
                  style={{
                    top: `${20 + Math.sin(i * 60 * Math.PI / 180) * 45}%`,
                    left: `${50 + Math.cos(i * 60 * Math.PI / 180) * 55}%`,
                    transform: `translateZ(${20 + i * 10}px)`,
                  }}
                  animate={{
                    y: [0, -15, 0],
                    opacity: [0.4, 1, 0.4],
                    scale: [1, 1.3, 1],
                  }}
                  transition={{
                    duration: 2 + i * 0.3,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
              
              {/* Glow effect */}
              <div 
                className="absolute inset-0 rounded-full blur-3xl"
                style={{
                  background: "radial-gradient(circle, hsl(175 80% 50% / 0.4) 0%, hsl(200 90% 60% / 0.2) 50%, transparent 70%)",
                  transform: "translateZ(-20px) scale(1.5)",
                }}
              />
              
              {/* Main image container with 3D depth */}
              <motion.div 
                className="relative"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
                style={{ transform: "translateZ(40px)" }}
              >
                <div className="w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 rounded-full overflow-hidden border-4 border-primary/40 shadow-2xl relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20 z-10" />
                  <img 
                    src={myPhoto} 
                    alt="Moinkhan Bhatti" 
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                
                {/* Sparkle accents */}
                <motion.div
                  className="absolute -top-2 -right-2"
                  animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  style={{ transform: "translateZ(60px)" }}
                >
                  <Sparkles className="w-6 h-6 text-primary" />
                </motion.div>
                
                {/* Premium Status Badge */}
                <motion.div 
                  className="absolute -bottom-6 left-1/2 -translate-x-1/2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                  <div className="relative group">
                    {/* Glow background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/30 via-green-400/40 to-emerald-500/30 rounded-full blur-lg opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                    
                    {/* Main badge */}
                    <div className="relative flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-emerald-600/90 to-green-500/90 border border-emerald-400/30 shadow-lg shadow-emerald-500/20">
                      {/* Animated pulse ring */}
                      <div className="relative flex items-center justify-center">
                        <motion.span 
                          className="absolute h-4 w-4 rounded-full bg-white/30"
                          animate={{ opacity: [0.5, 0, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <span className="relative h-2.5 w-2.5 rounded-full bg-white shadow-sm shadow-white/50" />
                      </div>
                      
                      {/* Text with icon */}
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-white tracking-wide">
                          Available for Hire
                        </span>
                        <motion.span
                          className="text-white/90"
                          animate={{ opacity: [1, 0.6, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
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

          {/* Right: Content with fancy typography */}
          <div className="order-1 lg:order-2 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              {/* Role badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full mb-6"
              >
                <motion.span
                  className="w-2 h-2 rounded-full bg-primary"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-sm font-medium text-primary tracking-wider uppercase">
                  Frontend Developer
                </span>
              </motion.div>
              
              {/* Greeting */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-xl sm:text-2xl text-muted-foreground mb-2 font-light italic"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Hello, I'm
              </motion.p>
              
              {/* Fancy Name with Great Vibes font */}
              <motion.h1 
                className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl mb-6 relative"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                style={{ 
                  fontFamily: "'Great Vibes', cursive",
                  textShadow: "0 0 40px hsl(175 80% 50% / 0.5), 0 0 80px hsl(175 80% 50% / 0.3)",
                }}
              >
                <span className="gradient-text">Moinkhan Bhatti</span>
                <motion.span
                  className="absolute -right-4 -top-2 text-primary/60"
                  animate={{ rotate: [0, 15, 0], scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  ✦
                </motion.span>
              </motion.h1>

              {/* Description with typing effect */}
              <motion.div 
                className="mt-6 text-lg sm:text-xl max-w-xl mx-auto lg:mx-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <div 
                  className="relative p-6 rounded-2xl glass-card border border-primary/10"
                  style={{
                    background: "linear-gradient(135deg, hsl(222 47% 10% / 0.8) 0%, hsl(222 47% 8% / 0.6) 100%)",
                  }}
                >
                  <motion.span
                    className="absolute -top-3 left-6 px-3 py-1 text-xs font-mono text-primary bg-background rounded-full border border-primary/20"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    {"<about-me />"}
                  </motion.span>
                  <p className="text-muted-foreground leading-relaxed font-light" style={{ fontFamily: "'Playfair Display', serif" }}>
                    <TypingText 
                      text="I craft modern, responsive, and accessible interfaces with React & TypeScript — focused on clean UI, strong UX, and lightning-fast performance."
                    />
                  </p>
                </div>
              </motion.div>
            </motion.div>

            {/* Tech tags with 3D hover */}
            <motion.div 
              className="mt-8 flex flex-wrap justify-center lg:justify-start gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {["React", "TypeScript", "Tailwind CSS", "Next.js", "UI/UX"].map((tech, i) => (
                <motion.span 
                  key={tech}
                  className="glass-card rounded-full px-5 py-2 text-sm font-medium text-foreground/90 border border-primary/20 cursor-default"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9 + i * 0.1 }}
                  whileHover={{ 
                    scale: 1.08,
                    boxShadow: "0 10px 30px hsl(175 80% 50% / 0.2)",
                    borderColor: "hsl(175 80% 50%)",
                  }}
                >
                  {tech}
                </motion.span>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div 
              className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              <motion.div 
                whileHover={{ scale: 1.05, y: -2 }} 
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="hero" 
                  size="xl" 
                  onClick={() => scrollToSection("#projects")}
                  className="glow-on-hover btn-lift min-w-[180px] relative overflow-hidden group"
                >
                  <span className="relative z-10">View Projects</span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/20 to-primary/0"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6 }}
                  />
                </Button>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.05, y: -2 }} 
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="hero-outline"
                  size="xl"
                  className="btn-lift border-glow min-w-[180px]"
                  asChild
                >
                  <a href="https://drive.google.com/uc?export=download&id=1p42p9NpczSWy_-iLeVaO38ciHAMHXp9r" download="Moin_Bhatti_Resume.pdf">
                    <Download className="w-4 h-4 mr-2" />
                    Download CV
                  </a>
                </Button>
              </motion.div>
            </motion.div>

            {/* Social Links */}
            <motion.div 
              className="mt-10 flex items-center justify-center lg:justify-start gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <span className="text-sm text-muted-foreground font-light">Connect →</span>
              <div className="flex gap-3">
                {socialLinks.map(({ icon: Icon, href, label }, index) => (
                  <motion.a
                    key={label}
                    href={href}
                    aria-label={label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 rounded-full glass-card flex items-center justify-center border border-primary/20 hover:border-primary/50 transition-colors"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 1.3 + index * 0.1, type: "spring" }}
                    whileHover={{ 
                      scale: 1.15, 
                      y: -3,
                      boxShadow: "0 10px 30px hsl(175 80% 50% / 0.3)",
                    }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Icon className="h-5 w-5 text-foreground/80" />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.5 }}
        >
          <motion.button
            onClick={() => scrollToSection("#about")}
            className="p-3 text-muted-foreground hover:text-primary transition-colors rounded-full glass-card border border-primary/20"
            aria-label="Scroll to about"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            whileHover={{ scale: 1.2, borderColor: "hsl(175 80% 50%)" }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowDown className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};