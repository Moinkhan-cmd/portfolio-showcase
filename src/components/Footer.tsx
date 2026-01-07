import { Github, Linkedin, Mail, Heart, Code2, Sparkles, ArrowUp, ExternalLink, Zap, Star, Rocket, Globe, Coffee, MapPin, Calendar, MousePointer, Layers, Send } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform, useAnimationFrame } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { FooterBackground3D } from "./FooterBackground3D";
import { scrollToSection, scrollToTop } from "@/components/SmoothScroll";
import { cn } from "@/lib/utils";

const socialLinks = [
  { icon: Github, url: "https://github.com/Moinkhan-cmd", label: "GitHub", color: "from-gray-600 to-gray-800", hoverBorder: "hover:border-gray-400", shadowColor: "shadow-gray-500/40" },
  { icon: Linkedin, url: "https://www.linkedin.com/in/moinkhan-bhatti-65363a255", label: "LinkedIn", color: "from-blue-500 to-blue-700", hoverBorder: "hover:border-blue-500", shadowColor: "shadow-blue-500/40" },
  { icon: Mail, url: "https://mail.google.com/mail/?view=cm&fs=1&to=moinbhatti59%40gmail.com", label: "Email", color: "from-red-500 to-orange-600", hoverBorder: "hover:border-red-500", shadowColor: "shadow-red-500/40" },
];

const quickLinks = [
  { name: "About", href: "#about", icon: Star },
  { name: "Skills", href: "#skills", icon: Zap },
  { name: "Projects", href: "#projects", icon: Rocket },
  { name: "Certifications", href: "#certifications", icon: Globe },
  { name: "Experience", href: "#experience", icon: Coffee },
  { name: "Contact", href: "#contact", icon: Mail },
];

const techStack = [
  { name: "React", color: "from-cyan-400 to-blue-500" },
  { name: "TypeScript", color: "from-blue-500 to-indigo-600" },
  { name: "Tailwind", color: "from-teal-400 to-cyan-500" },
  { name: "Three.js", color: "from-purple-500 to-pink-500" },
];

// Enhanced 3D Card with perspective and depth
const Card3D = ({ children, className, depth = 40 }: { children: React.ReactNode; className?: string; depth?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseXSpring = useSpring(x, { stiffness: 400, damping: 40 });
  const mouseYSpring = useSpring(y, { stiffness: 400, damping: 40 });
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);
  const translateZ = useTransform(mouseXSpring, [-0.5, 0, 0.5], [depth/2, 0, depth/2]);
  const brightness = useTransform(mouseXSpring, [-0.5, 0, 0.5], [0.95, 1, 1.05]);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) / rect.width - 0.5;
    const mouseY = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(mouseX);
    y.set(mouseY);
  };
  
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };
  
  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ 
        rotateX, 
        rotateY,
        transformStyle: "preserve-3d",
        perspective: "1000px",
        filter: useTransform(brightness, b => `brightness(${b})`)
      }}
      className={cn("relative", className)}
    >
      {children}
    </motion.div>
  );
};

// Floating 3D Icon
const FloatingIcon = ({ icon: Icon, delay = 0, className }: { icon: typeof Star; delay?: number; className?: string }) => (
  <motion.div
    className={cn("absolute text-primary/20", className)}
    animate={{
      y: [0, -15, 0],
      x: [0, 8, 0],
      rotate: [0, 10, -10, 0],
      scale: [1, 1.1, 1],
    }}
    transition={{
      duration: 5,
      delay,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  >
    <Icon className="w-6 h-6 sm:w-8 sm:h-8" />
  </motion.div>
);

// Animated Social Link with 3D depth
const SocialLink3D = ({ link, index }: { link: typeof socialLinks[0]; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "relative p-3 sm:p-4 rounded-2xl border-2 border-primary/20 bg-background/50 backdrop-blur-xl",
        "transition-all duration-300 group overflow-hidden",
        link.hoverBorder
      )}
      aria-label={link.label}
      initial={{ opacity: 0, scale: 0, rotateY: -180 }}
      whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15, type: "spring", stiffness: 200 }}
      whileHover={{ 
        scale: 1.15, 
        rotateY: 15,
        rotateX: -10,
        z: 50,
      }}
      whileTap={{ scale: 0.9, rotateY: 0, rotateX: 0 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ transformStyle: "preserve-3d", perspective: "500px" }}
    >
      {/* Animated gradient background */}
      <motion.div 
        className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300", link.color)}
        animate={isHovered ? { scale: [1, 1.5, 1] } : {}}
        transition={{ duration: 0.6 }}
      />
      
      {/* Rotating border glow */}
      <motion.div
        className={cn("absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-60 blur-md bg-gradient-to-r", link.color)}
        animate={isHovered ? { rotate: [0, 360] } : {}}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Shine sweep */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12"
        initial={{ x: "-150%" }}
        animate={isHovered ? { x: "150%" } : { x: "-150%" }}
        transition={{ duration: 0.5 }}
      />
      
      {/* Particle burst */}
      {isHovered && [...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-white/70"
          initial={{ x: "50%", y: "50%", opacity: 0, scale: 0 }}
          animate={{ 
            x: `${50 + Math.cos(i * 60 * Math.PI / 180) * 80}%`,
            y: `${50 + Math.sin(i * 60 * Math.PI / 180) * 80}%`,
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0]
          }}
          transition={{ duration: 0.6, delay: i * 0.05 }}
        />
      ))}
      
      <link.icon className="w-5 h-5 sm:w-6 sm:h-6 text-foreground group-hover:text-white relative z-10 transition-colors duration-300" />
      
      {/* 3D Shadow layer */}
      <motion.div 
        className={cn("absolute inset-0 rounded-2xl blur-xl -z-10 opacity-0 group-hover:opacity-70", link.shadowColor)}
        style={{ transform: "translateZ(-30px) translateY(10px)" }}
      />
    </motion.a>
  );
};

// Quick Link with 3D hover effect
const QuickLink3D = ({ link, index }: { link: typeof quickLinks[0]; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = link.icon;
  
  return (
    <motion.button
      onClick={() => scrollToSection(link.href)}
      className="relative text-left text-sm sm:text-base text-foreground/80 hover:text-primary transition-all duration-300 py-2 sm:py-2.5 px-3 sm:px-4 rounded-xl group overflow-hidden"
      initial={{ opacity: 0, x: -30, rotateX: -45 }}
      whileInView={{ opacity: 1, x: 0, rotateX: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, type: "spring", stiffness: 200 }}
      whileHover={{ x: 10, scale: 1.03, rotateY: 5 }}
      whileTap={{ scale: 0.97 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Background with depth */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 rounded-xl opacity-0 group-hover:opacity-100"
        animate={isHovered ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 0.3 }}
        style={{ transform: "translateZ(-10px)" }}
      />
      
      {/* Left accent bar */}
      <motion.div
        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-gradient-to-b from-primary to-purple-500 rounded-full group-hover:h-3/4"
        transition={{ duration: 0.2 }}
      />
      
      <span className="relative z-10 flex items-center gap-2 sm:gap-3" style={{ transform: "translateZ(20px)" }}>
        <motion.div
          className="p-1.5 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors"
          animate={isHovered ? { rotate: 360, scale: 1.2 } : { rotate: 0, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
        </motion.div>
        <span className="font-medium">{link.name}</span>
        <motion.span
          className="ml-auto opacity-0 group-hover:opacity-100 text-primary"
          animate={isHovered ? { x: [0, 5, 0] } : {}}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          →
        </motion.span>
      </span>
    </motion.button>
  );
};

// Tech Badge with 3D flip effect
const TechBadge3D = ({ tech, index }: { tech: typeof techStack[0]; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.span
      className="relative px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-full overflow-hidden cursor-default"
      initial={{ opacity: 0, scale: 0, rotateY: -180 }}
      whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.12, type: "spring", stiffness: 200 }}
      whileHover={{ 
        scale: 1.15, 
        rotateZ: 5,
        rotateY: 15,
        y: -5,
      }}
      whileTap={{ scale: 0.95 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Animated border */}
      <motion.div 
        className={cn("absolute inset-0 rounded-full p-[2px] bg-gradient-to-r", tech.color)}
        animate={isHovered ? { rotate: 360 } : {}}
        transition={{ duration: 2, ease: "linear" }}
      >
        <div className="absolute inset-[2px] bg-background rounded-full" />
      </motion.div>
      
      {/* Glow effect */}
      <motion.div
        className={cn("absolute inset-0 rounded-full opacity-0 blur-md bg-gradient-to-r", tech.color)}
        animate={{ opacity: isHovered ? 0.5 : 0 }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Shimmer */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full"
        animate={isHovered ? { x: ["-100%", "200%"] } : {}}
        transition={{ duration: 0.6 }}
      />
      
      <span className={cn("relative z-10 bg-gradient-to-r bg-clip-text text-transparent", tech.color)}>
        {tech.name}
      </span>
    </motion.span>
  );
};

// Animated counter for stats
const AnimatedStat = ({ value, label, icon: Icon }: { value: string; label: string; icon: typeof Code2 }) => (
  <motion.div
    className="flex flex-col items-center gap-1 p-3 sm:p-4 rounded-2xl bg-primary/5 border border-primary/10 hover:border-primary/30 transition-colors"
    initial={{ opacity: 0, y: 20, scale: 0.9 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    viewport={{ once: true }}
    whileHover={{ scale: 1.05, y: -5 }}
  >
    <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary mb-1" />
    <span className="text-lg sm:text-xl font-bold text-foreground">{value}</span>
    <span className="text-xs text-muted-foreground">{label}</span>
  </motion.div>
);

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const footerRef = useRef<HTMLElement>(null);

  return (
    <footer ref={footerRef} className="relative mt-16 sm:mt-20 border-t border-primary/20 bg-background overflow-hidden">
      <FooterBackground3D />
      
      {/* Multi-layer gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/50 to-background/90 pointer-events-none z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,transparent_0%,hsl(var(--background)/0.4)_50%)] pointer-events-none z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,transparent_0%,hsl(var(--background)/0.6)_50%)] pointer-events-none z-10" />
      
      {/* Floating decorative icons */}
      <div className="absolute inset-0 pointer-events-none z-5 hidden sm:block">
        <FloatingIcon icon={Code2} delay={0} className="top-20 left-[10%]" />
        <FloatingIcon icon={Layers} delay={1} className="top-40 right-[15%]" />
        <FloatingIcon icon={Sparkles} delay={2} className="bottom-40 left-[20%]" />
        <FloatingIcon icon={Rocket} delay={0.5} className="top-1/3 right-[8%]" />
        <FloatingIcon icon={Star} delay={1.5} className="bottom-1/3 left-[8%]" />
      </div>
      
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-5">
        <motion.div 
          className="absolute -top-20 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-primary/10 rounded-full blur-[80px] sm:blur-[100px]"
          animate={{ 
            x: [0, 50, 0], 
            y: [0, 30, 0],
            scale: [1, 1.2, 1] 
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute -bottom-20 right-1/4 w-56 sm:w-80 h-56 sm:h-80 bg-purple-500/10 rounded-full blur-[60px] sm:blur-[80px]"
          animate={{ 
            x: [0, -40, 0], 
            y: [0, -20, 0],
            scale: [1, 1.15, 1] 
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 sm:w-64 h-48 sm:h-64 bg-pink-500/8 rounded-full blur-[50px] sm:blur-[60px]"
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, 180, 360] 
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
      </div>
      
      {/* Animated grid pattern */}
      <motion.div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none z-10"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
          backgroundSize: "40px 40px"
        }}
        animate={{ backgroundPosition: ["0px 0px", "40px 40px"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 relative z-20">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 mb-10 sm:mb-12">
          
          {/* Left Column - Personal Info */}
          <Card3D className="h-full col-span-1" depth={50}>
            <motion.div 
              className="relative p-5 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-card/90 via-card/70 to-card/50 backdrop-blur-xl border border-primary/20 h-full overflow-hidden"
              initial={{ opacity: 0, y: 50, rotateX: -15 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, type: "spring" }}
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Corner decorations */}
              <div className="absolute top-0 left-0 w-16 sm:w-24 h-16 sm:h-24 border-t-2 border-l-2 border-primary/30 rounded-tl-2xl sm:rounded-tl-3xl" />
              <div className="absolute bottom-0 right-0 w-16 sm:w-24 h-16 sm:h-24 border-b-2 border-r-2 border-primary/30 rounded-br-2xl sm:rounded-br-3xl" />
              
              {/* Inner glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 rounded-2xl sm:rounded-3xl" />
              
              <div className="relative flex flex-col gap-4 sm:gap-5" style={{ transform: "translateZ(30px)" }}>
                {/* Animated Name with 3D effect */}
                <motion.button
                  onClick={() => scrollToTop()}
                  className="text-left group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div 
                    className="relative inline-block"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <motion.span
                      className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-signature font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-[length:200%_auto] bg-clip-text text-transparent"
                      animate={{ backgroundPosition: ["0%", "200%"] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                      style={{ fontFamily: 'var(--font-signature)', transform: "translateZ(20px)" }}
                    >
                      Moinkhan Bhatti
                    </motion.span>
                    
                    {/* 3D shadow text */}
                    <span 
                      className="absolute inset-0 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-signature font-bold text-primary/10 blur-[2px]"
                      style={{ fontFamily: 'var(--font-signature)', transform: "translateZ(-10px) translateX(3px) translateY(3px)" }}
                    >
                      Moinkhan Bhatti
                    </span>
                  </motion.div>
                  
                  {/* Animated underline with glow */}
                  <div className="relative mt-2 sm:mt-3">
                    <motion.div 
                      className="h-1 bg-gradient-to-r from-primary via-purple-500 to-pink-500 rounded-full"
                      initial={{ scaleX: 0, originX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                    />
                    <motion.div 
                      className="absolute inset-0 h-1 bg-gradient-to-r from-primary via-purple-500 to-pink-500 rounded-full blur-md opacity-60"
                      initial={{ scaleX: 0, originX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                    />
                  </div>
                </motion.button>
                
                {/* Bio */}
                <motion.p 
                  className="text-xs sm:text-sm lg:text-base text-foreground/80 leading-relaxed"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                >
                  Frontend Web Developer passionate about creating beautiful, functional, and accessible web experiences with modern technologies.
                </motion.p>
                
                {/* Location & Availability badges */}
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  <motion.div 
                    className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-primary/10 border border-primary/30 text-xs sm:text-sm"
                    initial={{ opacity: 0, scale: 0, x: -20 }}
                    whileInView={{ opacity: 1, scale: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5, type: "spring" }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary" />
                    <span className="text-foreground/80">India</span>
                  </motion.div>
                  <motion.div 
                    className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs sm:text-sm"
                    initial={{ opacity: 0, scale: 0, x: -20 }}
                    whileInView={{ opacity: 1, scale: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6, type: "spring" }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    <span className="text-emerald-400">Available</span>
                  </motion.div>
                </div>
                
                {/* Tech Stack badges */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2">
                  {techStack.map((tech, i) => (
                    <TechBadge3D key={tech.name} tech={tech} index={i} />
                  ))}
                </div>
                
                {/* Copyright */}
                <motion.div 
                  className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground mt-2 sm:mt-3 pt-3 sm:pt-4 border-t border-primary/10"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7 }}
                >
                  <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>© {currentYear} Made with</span>
                  <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-500 fill-rose-500" />
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </Card3D>

          {/* Middle Column - Quick Links */}
          <Card3D className="h-full col-span-1" depth={40}>
            <motion.div 
              className="relative p-5 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-card/90 via-card/70 to-card/50 backdrop-blur-xl border border-primary/20 h-full"
              initial={{ opacity: 0, y: 50, rotateX: -15 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1, type: "spring" }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <div style={{ transform: "translateZ(30px)" }}>
                <motion.div 
                  className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  <motion.div 
                    className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-br from-primary to-purple-600 shadow-lg shadow-primary/30"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <MousePointer className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </motion.div>
                  <h4 className="font-display text-lg sm:text-xl font-bold text-foreground">Quick Links</h4>
                </motion.div>
                
                <nav className="flex flex-col gap-0.5 sm:gap-1">
                  {quickLinks.map((link, index) => (
                    <QuickLink3D key={link.name} link={link} index={index} />
                  ))}
                </nav>
              </div>
            </motion.div>
          </Card3D>

          {/* Right Column - Connect */}
          <Card3D className="h-full col-span-1 md:col-span-2 lg:col-span-1" depth={45}>
            <motion.div 
              className="relative p-5 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-card/90 via-card/70 to-card/50 backdrop-blur-xl border border-primary/20 h-full"
              initial={{ opacity: 0, y: 50, rotateX: -15 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2, type: "spring" }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <div style={{ transform: "translateZ(30px)" }}>
                <motion.div 
                  className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                >
                  <motion.div 
                    className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 shadow-lg shadow-pink-500/30"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </motion.div>
                  <h4 className="font-display text-lg sm:text-xl font-bold text-foreground">Connect</h4>
                </motion.div>
                
                {/* Social Links */}
                <div className="flex gap-3 sm:gap-4 mb-5 sm:mb-6">
                  {socialLinks.map((link, index) => (
                    <SocialLink3D key={link.label} link={link} index={index} />
                  ))}
                </div>
                
                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-5 sm:mb-6">
                  <AnimatedStat value="50+" label="Projects" icon={Rocket} />
                  <AnimatedStat value="3+" label="Years" icon={Calendar} />
                  <AnimatedStat value="100%" label="Passion" icon={Heart} />
                </div>
                
                {/* CTA Button */}
                <motion.button
                  onClick={() => scrollToSection('#contact')}
                  className="relative w-full py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl font-semibold text-white overflow-hidden group"
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6, type: "spring" }}
                  whileHover={{ scale: 1.03, y: -3 }}
                  whileTap={{ scale: 0.97 }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Animated gradient */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-[length:200%_100%]"
                    animate={{ backgroundPosition: ["0%", "100%", "0%"] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  
                  {/* Glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary via-purple-500 to-pink-500 blur-xl opacity-50 group-hover:opacity-70 transition-opacity" />
                  
                  {/* Shimmer */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
                    animate={{ x: ["-200%", "200%"] }}
                    transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 0.5 }}
                  />
                  
                  <span className="relative z-10 flex items-center justify-center gap-2 text-sm sm:text-base" style={{ transform: "translateZ(10px)" }}>
                    <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                    Let's Work Together
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                  </span>
                </motion.button>
              </div>
            </motion.div>
          </Card3D>
        </div>

        {/* Bottom Bar */}
        <motion.div 
          className="relative border-t border-primary/20 pt-6 sm:pt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
        >
          {/* Animated border */}
          <motion.div 
            className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs sm:text-sm text-muted-foreground">
            <motion.p 
              className="text-center sm:text-left flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
            >
              <Rocket className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
              <span className="hidden xs:inline">Built with modern web technologies</span>
              <span className="xs:hidden">Modern tech stack</span>
            </motion.p>
            
            <div className="flex items-center gap-3 sm:gap-4">
              <motion.a
                href="https://github.com/Moinkhan-cmd"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-primary transition-colors duration-300 group"
                whileHover={{ scale: 1.05, x: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:rotate-12 transition-transform" />
                <span className="hidden xs:inline">View Source</span>
                <span className="xs:hidden">Source</span>
              </motion.a>
              
              <span className="text-primary/40">•</span>
              
              <motion.button
                onClick={() => scrollToTop()}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 hover:bg-primary/20 text-foreground hover:text-primary transition-all duration-300 group"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </motion.div>
                <span className="hidden xs:inline">Back to Top</span>
                <span className="xs:hidden">Top</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};
