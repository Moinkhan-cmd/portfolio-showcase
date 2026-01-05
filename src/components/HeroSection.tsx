import { ArrowDown, Download, Github, Linkedin, Mail, Sparkles, ExternalLink, Rocket, Eye, ChevronDown, Code2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, useMotionValue, useSpring, useTransform, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import myPhoto from "@/images/my photo.jpg";
import { HeroBackground3D } from "./HeroBackground3D";

const socialLinks = [
  { icon: Github, href: "https://github.com/Moinkhan-cmd", label: "GitHub", color: "hover:text-[#333] dark:hover:text-[#f0f0f0]" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/moin-bhatti-65363a255", label: "LinkedIn", color: "hover:text-[#0077b5]" },
  { icon: Mail, href: "https://mail.google.com/mail/?view=cm&fs=1&to=moinbhatti59%40gmail.com", label: "Email", color: "hover:text-[#ea4335]" },
] as const;

const roles = ["Frontend Developer", "UI/UX Designer", "React Specialist", "Creative Coder"];

export const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [currentRole, setCurrentRole] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 30, stiffness: 200 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), springConfig);
  const isInView = useInView(contentRef, { once: true, amount: 0.2 });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRole((prev) => (prev + 1) % roles.length);
    }, 3500);
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
      className="relative min-h-screen overflow-hidden bg-background pt-20 flex items-center"
    >
      {/* 3D Background */}
      <HeroBackground3D />
      
      {/* Enhanced Gradient Overlays for Better Contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background/90 pointer-events-none z-[1]" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/50 via-transparent to-background/50 pointer-events-none z-[1]" />
      
      {/* Radial gradient for text contrast */}
      <div 
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background: "radial-gradient(ellipse at center, transparent 0%, hsl(var(--background) / 0.4) 40%, hsl(var(--background) / 0.8) 100%)"
        }}
      />
      
      {/* Animated gradient mesh background */}
      <div className="absolute inset-0 overflow-hidden z-[1]">
        <motion.div
          className="absolute -top-1/2 -left-1/2 w-full h-full rounded-full blur-3xl opacity-15"
          style={{ background: "radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)" }}
          animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute -bottom-1/2 -right-1/2 w-full h-full rounded-full blur-3xl opacity-10"
          style={{ background: "radial-gradient(circle, hsl(280 70% 50%) 0%, transparent 70%)" }}
          animate={{ x: [0, -100, 0], y: [0, -50, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Subtle grid overlay */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
            backgroundSize: '80px 80px'
          }}
        />
      </div>

      {/* Enhanced cursor light */}
      <motion.div
        className="pointer-events-none fixed w-[500px] h-[500px] rounded-full opacity-10 blur-3xl z-40 transition-opacity duration-500"
        style={{
          background: "radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)",
          left: mousePos.x - 250,
          top: mousePos.y - 250,
        }}
      />

      {/* Main Content Container - Enhanced Responsive */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-16 items-center">
          
          {/* Left Column - Enhanced Typography */}
          <motion.div
            ref={contentRef}
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8 lg:space-y-10"
          >
            {/* Status Badge - Enhanced */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ delay: 0.3, type: "spring" }}
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border border-primary/30 backdrop-blur-md shadow-lg shadow-primary/10"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="text-sm font-semibold text-foreground">Available for opportunities</span>
            </motion.div>

            {/* Main Heading - Enhanced Typography - Responsive */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="space-y-3 sm:space-y-4"
            >
              <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold leading-[0.95] sm:leading-[0.9] tracking-tight">
                <motion.span 
                  className="block text-foreground"
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.5 }}
                >
                  I craft
                </motion.span>
                <motion.span
                  className="block bg-gradient-to-r from-primary via-purple-500 via-pink-500 to-primary bg-clip-text text-transparent bg-[length:200%_auto]"
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.6 }}
                  style={{
                    backgroundPosition: "0% center",
                    animation: "gradient-shift 3s ease infinite",
                  }}
                >
                  digital
                </motion.span>
                <motion.span 
                  className="block text-foreground"
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.7 }}
                >
                  experiences
                </motion.span>
              </h1>
            </motion.div>

            {/* Animated Role - Enhanced */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.8 }}
              className="h-14 sm:h-16 overflow-hidden"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentRole}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -50, opacity: 0 }}
                  transition={{ duration: 0.6, type: "spring" }}
                  className="text-2xl sm:text-3xl md:text-4xl text-muted-foreground font-light flex items-center gap-3"
                >
                  <Code2 className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
                  <span>{roles[currentRole]}</span>
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Description - Enhanced */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.9 }}
              className="text-lg sm:text-xl md:text-2xl text-foreground/80 leading-relaxed max-w-2xl font-light"
            >
              Transforming ideas into seamless, user-centric interfaces with{" "}
              <span className="text-primary font-medium">clean code</span> and{" "}
              <span className="text-primary font-medium">pixel-perfect precision</span>.
            </motion.p>

            {/* CTA Buttons - Enhanced */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1 }}
              className="flex flex-wrap gap-4 pt-4"
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  onClick={() => scrollToSection("#projects")}
                  className="group relative overflow-hidden bg-gradient-to-r from-primary via-primary/90 to-primary hover:from-primary/90 hover:via-primary hover:to-primary/90 text-primary-foreground font-semibold px-8 py-6 text-base sm:text-lg shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 transition-all"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    View My Work
                    <motion.div
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ExternalLink className="w-5 h-5" />
                    </motion.div>
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  />
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="lg"
                      variant="outline"
                      className="group border-2 border-primary/30 hover:border-primary/50 hover:bg-primary/10 px-8 py-6 text-base sm:text-lg font-semibold backdrop-blur-sm"
                    >
                      <Download className="mr-2 h-5 w-5" />
                      Resume
                      <ChevronDown className="ml-2 h-4 w-4 group-hover:rotate-180 transition-transform" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 z-[9999]" sideOffset={5}>
                    <DropdownMenuItem
                      onSelect={(e) => {
                        const url = "https://drive.google.com/file/d/1p42p9NpczSWy_-iLeVaO38ciHAMHXp9r/view?usp=sharing";
                        window.open(url, "_blank", "noopener,noreferrer");
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const url = "https://drive.google.com/file/d/1p42p9NpczSWy_-iLeVaO38ciHAMHXp9r/view?usp=sharing";
                        window.open(url, "_blank", "noopener,noreferrer");
                      }}
                      className="cursor-pointer focus:bg-accent"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      See Resume
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={(e) => {
                        const fileId = "1p42p9NpczSWy_-iLeVaO38ciHAMHXp9r";
                        const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
                        window.open(downloadUrl, "_blank", "noopener,noreferrer");
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const fileId = "1p42p9NpczSWy_-iLeVaO38ciHAMHXp9r";
                        const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
                        window.open(downloadUrl, "_blank", "noopener,noreferrer");
                      }}
                      className="cursor-pointer focus:bg-accent"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </motion.div>
            </motion.div>

            {/* Social Links - Enhanced */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 1.2 }}
              className="flex gap-4 pt-4"
            >
              {socialLinks.map((link, index) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-4 rounded-xl border-2 border-primary/20 bg-background/50 backdrop-blur-sm text-muted-foreground ${link.color} hover:border-primary/40 hover:bg-primary/10 transition-all duration-300 relative overflow-hidden group`}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 1.3 + index * 0.1, type: "spring" }}
                  whileHover={{ scale: 1.1, y: -4, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <link.icon className="w-5 h-5 sm:w-6 sm:h-6 relative z-10" />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Column - Visual Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 50 }}
            animate={isInView ? { opacity: 1, scale: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative flex items-center justify-center lg:justify-end"
          >
            <motion.div
              className="relative"
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* Decorative rings - Enhanced */}
              <motion.div
                className="absolute inset-0 -m-8 rounded-full border-2 border-primary/20"
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute inset-0 -m-16 rounded-full border border-primary/10"
                animate={{ rotate: -360 }}
                transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
              />

              {/* Floating particles - Enhanced */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-primary/60"
                  style={{
                    top: `${50 + Math.sin(i * 45 * Math.PI / 180) * 60}%`,
                    left: `${50 + Math.cos(i * 45 * Math.PI / 180) * 60}%`,
                  }}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0.3, 1, 0.3],
                    scale: [1, 1.5, 1],
                  }}
                  transition={{
                    duration: 3 + i * 0.3,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut",
                  }}
                />
              ))}

              {/* Main image container - Enhanced */}
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-[420px] lg:h-[420px] xl:w-[480px] xl:h-[480px]">
                {/* Enhanced gradient glow */}
                <motion.div
                  className="absolute inset-0 rounded-3xl blur-3xl opacity-40"
                  style={{ background: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(280 70% 50%) 100%)" }}
                  animate={{ opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                
                {/* Image frame - Enhanced */}
                <motion.div
                  className="relative w-full h-full rounded-3xl overflow-hidden border-2 border-primary/30 shadow-2xl"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.4 }}
                >
                  {/* Animated border */}
                  <motion.div
                    className="absolute inset-0 rounded-3xl"
                    style={{
                      background: "conic-gradient(from 0deg, hsl(var(--primary)), hsl(280 70% 50%), hsl(340 70% 50%), hsl(var(--primary)))",
                      padding: "3px",
                    }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  >
                    <div className="w-full h-full rounded-3xl bg-background" />
                  </motion.div>

                  <img
                    src={myPhoto}
                    alt="Moinkhan Bhatti"
                    className="absolute inset-[3px] w-[calc(100%-6px)] h-[calc(100%-6px)] object-cover rounded-[20px]"
                    style={{ objectPosition: "center 10%" }}
                  />

                  {/* Overlay gradient for better contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />

                  {/* Enhanced shimmer effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                  />
                </div>

                {/* Tech Stack Tags - Enhanced */}
                <motion.div 
                  className="mt-8 flex flex-wrap justify-center lg:justify-start gap-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 1.1 }}
                >
                  {[
                    { name: "React", icon: "⚛️" },
                    { name: "TypeScript", icon: "📘" },
                    { name: "Next.js", icon: "▲" },
                    { name: "Tailwind", icon: "🎨" },
                  ].map((tech, i) => (
                    <motion.span 
                      key={tech.name}
                      className="group px-4 py-2 rounded-full text-sm font-semibold text-foreground/90 bg-background/80 backdrop-blur-xl border-2 border-primary/30 shadow-lg relative overflow-hidden"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ delay: 1.2 + i * 0.1, type: "spring" }}
                      whileHover={{ 
                        scale: 1.15,
                        y: -4,
                        borderColor: "hsl(175 80% 50%)",
                        boxShadow: "0 20px 50px hsl(175 80% 50% / 0.4)",
                      }}
                    >
                      <span className="relative z-10 flex items-center gap-1.5">
                        <span>{tech.icon}</span>
                        <span>{tech.name}</span>
                      </span>
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                    </motion.span>
                  ))}
                </motion.div>

                {/* Sparkle decorations - Enhanced */}
                {[
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
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Enhanced Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30"
      >
        <motion.button
          onClick={() => scrollToSection("#about")}
          className="flex flex-col items-center gap-3 text-muted-foreground hover:text-foreground transition-colors group"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-xs font-semibold tracking-widest uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ArrowDown className="w-5 h-5 group-hover:text-primary transition-colors" />
          </motion.div>
        </motion.button>
      </motion.div>

      {/* Add CSS animation for gradient */}
      <style>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% center; }
          50% { background-position: 100% center; }
        }
      `}</style>
    </section>
  );
};
