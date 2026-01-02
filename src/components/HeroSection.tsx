import { ArrowDown, Download, Github, Linkedin, Mail, Sparkles, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import myPhoto from "@/images/my photo.jpg";

const socialLinks = [
  { icon: Github, href: "https://github.com/Moinkhan-cmd", label: "GitHub" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/moin-bhatti-65363a255", label: "LinkedIn" },
  { icon: Mail, href: "https://mail.google.com/mail/?view=cm&fs=1&to=moinbhatti59%40gmail.com", label: "Email" },
] as const;

const roles = ["Frontend Developer", "UI/UX Designer", "React Specialist", "Creative Coder"];

export const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentRole, setCurrentRole] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 150 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), springConfig);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRole((prev) => (prev + 1) % roles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const scrollToSection = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen overflow-hidden bg-background pt-20"
    >
      {/* Animated gradient mesh background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-1/2 -left-1/2 w-full h-full rounded-full blur-3xl opacity-30"
          style={{ background: "radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)" }}
          animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute -bottom-1/2 -right-1/2 w-full h-full rounded-full blur-3xl opacity-20"
          style={{ background: "radial-gradient(circle, hsl(280 70% 50%) 0%, transparent 70%)" }}
          animate={{ x: [0, -100, 0], y: [0, -50, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Grid overlay */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      {/* Floating cursor light */}
      <motion.div
        className="pointer-events-none fixed w-96 h-96 rounded-full opacity-10 blur-3xl z-50"
        style={{
          background: "radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)",
          left: mousePos.x - 192,
          top: mousePos.y - 192,
        }}
      />

      {/* Main content - Asymmetric split layout */}
      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">
        
        {/* Left side - Typography focused */}
        <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-20 py-32 lg:py-0">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-2xl"
          >
            {/* Status badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-sm font-medium text-foreground/80">Available for opportunities</span>
            </motion.div>

            {/* Main heading */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[0.9] tracking-tight mb-6">
                <span className="block text-foreground">I craft</span>
                <span className="block bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  digital
                </span>
                <span className="block text-foreground">experiences</span>
              </h1>
            </motion.div>

            {/* Animated role */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="h-12 mb-8 overflow-hidden"
            >
              <motion.div
                key={currentRole}
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -40, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="text-xl sm:text-2xl text-muted-foreground font-light"
              >
                {roles[currentRole]}
              </motion.div>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="text-lg text-muted-foreground/80 leading-relaxed mb-10 max-w-lg"
            >
              Transforming ideas into seamless, user-centric interfaces with clean code and pixel-perfect precision.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="flex flex-wrap gap-4"
            >
              <Button
                size="lg"
                onClick={() => scrollToSection("#projects")}
                className="group relative overflow-hidden bg-foreground text-background hover:bg-foreground/90 px-8"
              >
                <span className="relative z-10 flex items-center gap-2">
                  View Work
                  <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                asChild
                className="group border-foreground/20 hover:bg-foreground/5 px-8"
              >
                <a href="/Moinkhan-CV.pdf" download>
                  <Download className="mr-2 h-4 w-4" />
                  Resume
                </a>
              </Button>
            </motion.div>

            {/* Social links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="flex gap-4 mt-12"
            >
              {socialLinks.map((link) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full border border-foreground/10 text-muted-foreground hover:text-foreground hover:border-foreground/30 hover:bg-foreground/5 transition-all duration-300"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <link.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Right side - Visual showcase */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative"
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          >
            {/* Decorative rings */}
            <motion.div
              className="absolute inset-0 -m-8 rounded-full border border-primary/20"
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-0 -m-16 rounded-full border border-primary/10"
              animate={{ rotate: -360 }}
              transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-0 -m-24 rounded-full border border-primary/5"
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            />

            {/* Floating elements */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 rounded-full bg-primary/60"
                style={{
                  top: `${50 + Math.sin(i * 60 * Math.PI / 180) * 55}%`,
                  left: `${50 + Math.cos(i * 60 * Math.PI / 180) * 55}%`,
                }}
                animate={{
                  y: [0, -15, 0],
                  opacity: [0.4, 1, 0.4],
                  scale: [1, 1.3, 1],
                }}
                transition={{
                  duration: 3 + i * 0.5,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              />
            ))}

            {/* Main image container */}
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 lg:w-[400px] lg:h-[400px]">
              {/* Gradient glow */}
              <motion.div
                className="absolute inset-0 rounded-3xl blur-3xl"
                style={{ background: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(280 70% 50%) 100%)" }}
                animate={{ opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              
              {/* Image frame */}
              <motion.div
                className="relative w-full h-full rounded-3xl overflow-hidden border-2 border-foreground/10"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.4 }}
              >
                {/* Enhanced greeting with icon and 3D effect */}
                {/* Animated border */}
                <motion.div
                  initial={{ opacity: 0, y: 20, rotateX: -20 }}
                  animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 20, rotateX: -20 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center justify-center lg:justify-start gap-3 mb-4 relative"
                  style={{ transformStyle: "preserve-3d" }}
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
                  className="absolute inset-0 rounded-3xl"
                  style={{
                    background: "conic-gradient(from 0deg, hsl(var(--primary)), hsl(280 70% 50%), hsl(340 70% 50%), hsl(var(--primary)))",
                    padding: "2px",
                  }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                >
                  <div className="w-full h-full rounded-3xl bg-background" />
                </motion.div>
                
                {/* Enhanced Name with gradient and animation */}
                <motion.h1 
                  className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl mb-6 relative font-bold font-hero"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  style={{ 
                    transformStyle: "preserve-3d",
                    perspective: "1000px",
                  }}
                >
                  <motion.span 
                    className="gradient-text block leading-tight relative" 
                    style={{ 
                      textShadow: "0 0 60px hsl(175 80% 50% / 0.4), 0 0 100px hsl(175 80% 50% / 0.2)",
                      letterSpacing: "-0.01em",
                      fontFamily: "var(--font-hero)",
                      transformStyle: "preserve-3d",
                    }}
                    animate={{
                      textShadow: [
                        "0 0 60px hsl(175 80% 50% / 0.4), 0 0 100px hsl(175 80% 50% / 0.2)",
                        "0 0 80px hsl(175 80% 50% / 0.6), 0 0 120px hsl(175 80% 50% / 0.3)",
                        "0 0 60px hsl(175 80% 50% / 0.4), 0 0 100px hsl(175 80% 50% / 0.2)",
                      ],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    Moinkhan
                  </motion.span>
                  <motion.span 
                    className="gradient-text block leading-tight -mt-2 relative" 
                    style={{ 
                      textShadow: "0 0 60px hsl(200 90% 60% / 0.4), 0 0 100px hsl(200 90% 60% / 0.2)",
                      letterSpacing: "-0.01em",
                      fontFamily: "var(--font-hero)",
                      transformStyle: "preserve-3d",
                    }}
                    animate={{
                      textShadow: [
                        "0 0 60px hsl(200 90% 60% / 0.4), 0 0 100px hsl(200 90% 60% / 0.2)",
                        "0 0 80px hsl(200 90% 60% / 0.6), 0 0 120px hsl(200 90% 60% / 0.3)",
                        "0 0 60px hsl(200 90% 60% / 0.4), 0 0 100px hsl(200 90% 60% / 0.2)",
                      ],
                    }}
                    transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                  >
                    Bhatti
                  </motion.span>
                  
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

                <img
                  src={myPhoto}
                  alt="Moinkhan Bhatti"
                  className="absolute inset-1 w-[calc(100%-8px)] h-[calc(100%-8px)] object-cover object-center rounded-[20px]"
                />

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />

                {/* Animated Role Badge with 3D */}
                {/* Shimmer effect */}
                <motion.div
                  initial={{ opacity: 0, y: 20, rotateX: -15, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, y: 0, rotateX: 0, scale: 1 } : { opacity: 0, y: 20, rotateX: -15, scale: 0.9 }}
                  transition={{ delay: 0.6 }}
                  className="mb-8 relative"
                  style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
                  whileHover={{ 
                    rotateY: 5,
                    scale: 1.05,
                    transition: { duration: 0.3 }
                  }}
                >
                  <div className="inline-flex items-center gap-3 glass-card px-6 py-3 rounded-full border-2 border-primary/30 backdrop-blur-xl relative" style={{ transformStyle: "preserve-3d" }}>
                    {/* 3D glow behind badge */}
                    <motion.div
                      className="absolute inset-0 rounded-full bg-primary/20 blur-xl"
                      style={{ transform: "translateZ(-20px)" }}
                      animate={{
                        opacity: [0.3, 0.6, 0.3],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                    <motion.div style={{ transform: "translateZ(10px)" }}>
                      <Code2 className="w-5 h-5 text-primary" />
                    </motion.div>
                    <motion.span 
                      className="text-lg font-semibold text-foreground relative z-10"
                      style={{ transform: "translateZ(10px)" }}
                    >
                      <AnimatedRole />
                    </motion.span>
                    <motion.div 
                      style={{ transform: "translateZ(10px)" }}
                      animate={{ 
                        rotate: [0, 10, -10, 0],
                        y: [0, -5, 0]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Rocket className="w-5 h-5 text-primary" />
                    </motion.div>
                  </div>
                </motion.div>

                {/* Enhanced Description with 3D */}
                <motion.div 
                  className="mt-8 text-lg sm:text-xl max-w-2xl mx-auto lg:mx-0 mb-8 relative"
                  initial={{ opacity: 0, rotateX: -10 }}
                  animate={isInView ? { opacity: 1, rotateX: 0 } : { opacity: 0, rotateX: -10 }}
                  transition={{ delay: 0.8 }}
                  style={{ transformStyle: "preserve-3d" }}
                  whileHover={{ 
                    rotateY: 2,
                    scale: 1.02,
                    transition: { duration: 0.3 }
                  }}
                >
                  {/* 3D depth layers */}
                  <motion.div
                    className="absolute inset-0 rounded-3xl bg-primary/10 blur-2xl"
                    style={{ transform: "translateZ(-40px)" }}
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                  />
                  
                  <div 
                    className="relative p-8 rounded-3xl glass-card border-2 border-primary/20 backdrop-blur-xl shadow-2xl"
                    style={{
                      background: "linear-gradient(135deg, hsl(222 47% 12% / 0.9) 0%, hsl(222 47% 8% / 0.7) 100%)",
                      transform: "translateZ(20px)",
                      transformStyle: "preserve-3d",
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
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 3 }}
                />
              </motion.div>

                {/* Enhanced Tech Stack Tags with 3D */}
                <motion.div 
                  className="mt-10 flex flex-wrap justify-center lg:justify-start gap-4 relative"
                  initial={{ opacity: 0, rotateX: -10 }}
                  animate={isInView ? { opacity: 1, rotateX: 0 } : { opacity: 0, rotateX: -10 }}
                  transition={{ delay: 1 }}
                  style={{ transformStyle: "preserve-3d" }}
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
                      initial={{ opacity: 0, scale: 0.8, rotateX: -20 }}
                      animate={isInView ? { opacity: 1, scale: 1, rotateX: 0 } : { opacity: 0, scale: 0.8, rotateX: -20 }}
                      transition={{ delay: 1.1 + i * 0.1, type: "spring", stiffness: 200 }}
                      style={{ 
                        transform: `translateZ(${i * 5}px)`,
                        transformStyle: "preserve-3d",
                      }}
                      whileHover={{ 
                        scale: 1.15,
                        rotateY: 10,
                        rotateX: 5,
                        boxShadow: "0 20px 50px hsl(175 80% 50% / 0.4)",
                        borderColor: "hsl(175 80% 50%)",
                        y: -6,
                        z: 30,
                        transition: { duration: 0.3 }
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

                {/* Enhanced CTA Buttons with 3D */}
                <motion.div 
                  className="mt-12 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5 relative"
                  initial={{ opacity: 0, y: 20, rotateX: -10 }}
                  animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 20, rotateX: -10 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <motion.div 
                    whileHover={{ scale: 1.08, y: -5, rotateY: 5, rotateX: -5, z: 20 }} 
                    whileTap={{ scale: 0.95 }}
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <Button 
                      variant="hero" 
                      size="lg" 
                      onClick={() => scrollToSection("#projects")}
                      className="glow-on-hover btn-lift min-w-[200px] h-14 text-lg relative overflow-hidden group border-2 border-primary/30"
                      style={{ transform: "translateZ(10px)", transformStyle: "preserve-3d" }}
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
                    whileHover={{ scale: 1.08, y: -5, rotateY: -5, rotateX: -5, z: 20 }} 
                    whileTap={{ scale: 0.95 }}
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <Button
                      variant="hero-outline"
                      size="lg"
                      className="btn-lift border-2 border-primary/50 bg-transparent hover:bg-primary/10 min-w-[200px] h-14 text-lg backdrop-blur-sm"
                      style={{ transform: "translateZ(10px)", transformStyle: "preserve-3d" }}
                      asChild
                    >
                      <a href="https://drive.google.com/uc?export=download&id=1p42p9NpczSWy_-iLeVaO38ciHAMHXp9r" download="Moin_Bhatti_Resume.pdf">
                        <Download className="w-5 h-5 mr-2" />
                        Download Resume
                      </a>
                    </Button>
                  </motion.div>
              {/* Sparkle decorations */}
              {[
                { top: "-5%", right: "10%" },
                { bottom: "20%", left: "-8%" },
                { top: "30%", right: "-5%" },
              ].map((pos, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={pos}
                  animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                  transition={{ duration: 4 + i, repeat: Infinity }}
                >
                  <Sparkles className="w-6 h-6 text-primary" />
                </motion.div>
              ))}
            </div>

            {/* Name card overlay */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="absolute -bottom-6 left-1/2 -translate-x-1/2 px-8 py-4 rounded-2xl bg-background/80 backdrop-blur-xl border border-foreground/10 shadow-2xl"
            >
              <p className="text-2xl sm:text-3xl font-bold text-center bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Moinkhan Bhatti
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.button
          onClick={() => scrollToSection("#about")}
          className="flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-xs font-medium tracking-widest uppercase">Scroll</span>
          <ArrowDown className="w-5 h-5" />
        </motion.button>
      </motion.div>
    </section>
  );
};
