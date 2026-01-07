import { Github, Linkedin, Mail, Heart, Code2, Sparkles, ArrowUp, ExternalLink, Zap, Star, Rocket, Globe, Coffee, MapPin, Calendar } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { FooterBackground3D } from "./FooterBackground3D";
import { scrollToSection, scrollToTop } from "@/components/SmoothScroll";
import { cn } from "@/lib/utils";

const socialLinks = [
  { icon: Github, url: "https://github.com/Moinkhan-cmd", label: "GitHub", color: "hover:border-gray-400 hover:shadow-gray-500/30", gradient: "from-gray-600 to-gray-800" },
  { icon: Linkedin, url: "https://www.linkedin.com/in/moinkhan-bhatti-65363a255", label: "LinkedIn", color: "hover:border-blue-500 hover:shadow-blue-500/30", gradient: "from-blue-500 to-blue-700" },
  { icon: Mail, url: "https://mail.google.com/mail/?view=cm&fs=1&to=moinbhatti59%40gmail.com", label: "Email", color: "hover:border-red-500 hover:shadow-red-500/30", gradient: "from-red-500 to-orange-600" },
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

// 3D Card Component with mouse tracking
const Card3D = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
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
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Animated Social Link with 3D effect
const SocialLink3D = ({ link, index }: { link: typeof socialLinks[0]; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "relative p-4 rounded-2xl border-2 border-primary/30 bg-background/50 backdrop-blur-xl",
        "transition-all duration-300 group overflow-hidden",
        link.color
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
      whileTap={{ scale: 0.9 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Animated gradient background */}
      <motion.div 
        className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300", link.gradient)}
        animate={isHovered ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 0.5 }}
      />
      
      {/* Shine effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
        initial={{ x: "-100%" }}
        animate={isHovered ? { x: "200%" } : { x: "-100%" }}
        transition={{ duration: 0.6 }}
      />
      
      {/* Floating particles */}
      {isHovered && (
        <>
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-white/60"
              initial={{ 
                x: "50%", 
                y: "50%", 
                opacity: 0,
                scale: 0 
              }}
              animate={{ 
                x: `${50 + (Math.random() - 0.5) * 100}%`,
                y: `${50 + (Math.random() - 0.5) * 100}%`,
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0]
              }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
            />
          ))}
        </>
      )}
      
      <link.icon className="w-6 h-6 text-foreground group-hover:text-white relative z-10 transition-colors duration-300" />
      
      {/* 3D shadow */}
      <div 
        className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl opacity-0 group-hover:opacity-60 transition-opacity -z-10"
        style={{ transform: "translateZ(-20px)" }}
      />
    </motion.a>
  );
};

// Animated Quick Link
const QuickLink3D = ({ link, index }: { link: typeof quickLinks[0]; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = link.icon;
  
  return (
    <motion.button
      onClick={() => scrollToSection(link.href)}
      className="relative text-left text-sm sm:text-base text-foreground/80 hover:text-primary transition-all duration-300 py-2 px-3 rounded-xl group overflow-hidden"
      initial={{ opacity: 0, x: -30, rotateX: -90 }}
      whileInView={{ opacity: 1, x: 0, rotateX: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, type: "spring" }}
      whileHover={{ x: 8, scale: 1.02 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background glow */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
        animate={isHovered ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 0.4 }}
      />
      
      <span className="relative z-10 flex items-center gap-3">
        <motion.div
          animate={isHovered ? { rotate: 360, scale: 1.2 } : { rotate: 0, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Icon className="w-4 h-4 text-primary" />
        </motion.div>
        {link.name}
        <motion.span
          className="opacity-0 group-hover:opacity-100 transition-opacity"
          animate={isHovered ? { x: [0, 5, 0] } : {}}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          →
        </motion.span>
      </span>
    </motion.button>
  );
};

// Tech Badge with 3D effect
const TechBadge3D = ({ tech, index }: { tech: typeof techStack[0]; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.span
      className="relative px-4 py-2 text-xs sm:text-sm font-semibold rounded-full overflow-hidden cursor-default"
      initial={{ opacity: 0, scale: 0, rotateZ: -180 }}
      whileInView={{ opacity: 1, scale: 1, rotateZ: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
      whileHover={{ 
        scale: 1.15, 
        rotateZ: 5,
        y: -5,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated gradient border */}
      <motion.div 
        className={cn("absolute inset-0 bg-gradient-to-r", tech.color)}
        animate={{ rotate: isHovered ? 360 : 0 }}
        transition={{ duration: 2, ease: "linear" }}
        style={{ padding: "2px", borderRadius: "9999px" }}
      >
        <div className="absolute inset-[2px] bg-background rounded-full" />
      </motion.div>
      
      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        animate={isHovered ? { x: ["-100%", "200%"] } : {}}
        transition={{ duration: 0.8 }}
      />
      
      <span className={cn("relative z-10 bg-gradient-to-r bg-clip-text text-transparent", tech.color)}>
        {tech.name}
      </span>
    </motion.span>
  );
};

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-20 border-t border-primary/20 bg-background overflow-hidden">
      <FooterBackground3D />
      
      {/* Enhanced Overlay with multiple layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background/80 pointer-events-none z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_0%,hsl(var(--background)/0.5)_50%,hsl(var(--background)/0.9)_100%)] pointer-events-none z-10" />
      
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-5">
        <motion.div 
          className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px]"
          animate={{ 
            x: [0, 50, 0], 
            y: [0, 30, 0],
            scale: [1, 1.2, 1] 
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-[80px]"
          animate={{ 
            x: [0, -40, 0], 
            y: [0, -20, 0],
            scale: [1, 1.15, 1] 
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/8 rounded-full blur-[60px]"
          animate={{ 
            x: [0, 30, -30, 0],
            rotate: [0, 180, 360] 
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
      </div>
      
      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none z-10"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
          backgroundSize: "50px 50px"
        }}
      />
      
      <div className="container mx-auto container-padding py-16 sm:py-20 relative z-20">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 mb-12">
          
          {/* Left Column - Personal Info with 3D Card */}
          <Card3D className="h-full">
            <motion.div 
              className="relative p-6 rounded-3xl bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-xl border border-primary/20 h-full"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Decorative corner accents */}
              <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-primary/40 rounded-tl-3xl" />
              <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-primary/40 rounded-br-3xl" />
              
              <div className="flex flex-col gap-5" style={{ transform: "translateZ(30px)" }}>
                {/* Animated Name */}
                <motion.button
                  onClick={() => scrollToTop()}
                  className="text-left group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.span
                    className="block text-3xl sm:text-4xl md:text-5xl font-signature font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-[length:200%_auto] bg-clip-text text-transparent"
                    animate={{ backgroundPosition: ["0%", "200%"] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    style={{ fontFamily: 'var(--font-signature)' }}
                  >
                    Moinkhan Bhatti
                  </motion.span>
                  
                  {/* Animated underline */}
                  <motion.div 
                    className="h-1 bg-gradient-to-r from-primary via-purple-500 to-pink-500 rounded-full mt-2"
                    initial={{ scaleX: 0, originX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  />
                </motion.button>
                
                {/* Bio with typing effect style */}
                <motion.p 
                  className="text-sm sm:text-base text-foreground/80 leading-relaxed"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                >
                  Frontend Web Developer passionate about creating beautiful, functional, and accessible web experiences with modern technologies.
                </motion.p>
                
                {/* Location & Availability */}
                <div className="flex flex-wrap gap-3">
                  <motion.div 
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-sm"
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5, type: "spring" }}
                  >
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    <span className="text-foreground/80">India</span>
                  </motion.div>
                  <motion.div 
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-sm"
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6, type: "spring" }}
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    <span className="text-emerald-400">Available for work</span>
                  </motion.div>
                </div>
                
                {/* Copyright with animated heart */}
                <motion.div 
                  className="flex items-center gap-2 text-sm text-muted-foreground mt-2"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7 }}
                >
                  <Calendar className="w-4 h-4" />
                  <span>© {currentYear} Made with</span>
                  <motion.div
                    animate={{ 
                      scale: [1, 1.3, 1],
                      rotate: [0, 10, -10, 0]
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                  </motion.div>
                  <span>by Moinkhan</span>
                </motion.div>

                {/* Tech Stack with 3D badges */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {techStack.map((tech, i) => (
                    <TechBadge3D key={tech.name} tech={tech} index={i} />
                  ))}
                </div>
              </div>
            </motion.div>
          </Card3D>

          {/* Middle Column - Quick Links */}
          <Card3D className="h-full">
            <motion.div 
              className="relative p-6 rounded-3xl bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-xl border border-primary/20 h-full"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <div style={{ transform: "translateZ(30px)" }}>
                <motion.div 
                  className="flex items-center gap-3 mb-6"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  <motion.div 
                    className="p-2.5 rounded-xl bg-gradient-to-br from-primary to-purple-600"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Code2 className="w-5 h-5 text-white" />
                  </motion.div>
                  <h4 className="font-display text-xl font-bold text-foreground">Quick Links</h4>
                </motion.div>
                
                <nav className="flex flex-col gap-1">
                  {quickLinks.map((link, index) => (
                    <QuickLink3D key={link.name} link={link} index={index} />
                  ))}
                </nav>
              </div>
            </motion.div>
          </Card3D>

          {/* Right Column - Connect */}
          <Card3D className="h-full">
            <motion.div 
              className="relative p-6 rounded-3xl bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-xl border border-primary/20 h-full"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <div style={{ transform: "translateZ(30px)" }}>
                <motion.div 
                  className="flex items-center gap-3 mb-6"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                >
                  <motion.div 
                    className="p-2.5 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Sparkles className="w-5 h-5 text-white" />
                  </motion.div>
                  <h4 className="font-display text-xl font-bold text-foreground">Connect</h4>
                </motion.div>
                
                {/* Social Links with 3D effects */}
                <div className="flex gap-4 mb-6">
                  {socialLinks.map((link, index) => (
                    <SocialLink3D key={link.label} link={link} index={index} />
                  ))}
                </div>
                
                {/* CTA Button */}
                <motion.button
                  onClick={() => scrollToSection('#contact')}
                  className="relative w-full py-4 px-6 rounded-2xl font-semibold text-white overflow-hidden group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Animated gradient background */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-[length:200%_100%]"
                    animate={{ backgroundPosition: ["0%", "100%", "0%"] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  
                  {/* Shimmer effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                  />
                  
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Let's Work Together
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <ArrowUp className="w-5 h-5 rotate-45" />
                    </motion.span>
                  </span>
                </motion.button>
              </div>
            </motion.div>
          </Card3D>
        </div>

        {/* Bottom Bar with enhanced effects */}
        <motion.div 
          className="relative border-t border-primary/20 pt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
        >
          {/* Animated border gradient */}
          <motion.div 
            className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <motion.p 
              className="text-center sm:text-left flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
            >
              <Rocket className="w-4 h-4 text-primary" />
              Built with modern web technologies and best practices
            </motion.p>
            
            <div className="flex items-center gap-4">
              <motion.a
                href="https://github.com/Moinkhan-cmd"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-primary transition-colors duration-300 group"
                whileHover={{ scale: 1.05, x: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                <ExternalLink className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                View Source
              </motion.a>
              
              <span className="hidden sm:inline text-primary/40">•</span>
              
              <motion.button
                onClick={() => scrollToTop()}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 hover:bg-primary/20 text-foreground hover:text-primary transition-all duration-300 group"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowUp className="w-4 h-4" />
                </motion.div>
                Back to Top
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};
