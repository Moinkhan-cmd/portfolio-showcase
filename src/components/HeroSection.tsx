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
import { scrollToSection } from "@/components/SmoothScroll";

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
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  return (
    <section
      id="hero"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-[100dvh] overflow-hidden bg-background flex items-center"
    >
      <HeroBackground3D />
      
      <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background/90 pointer-events-none z-[1]" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/50 via-transparent to-background/50 pointer-events-none z-[1]" />
      
      <div 
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{ background: "radial-gradient(ellipse at center, transparent 0%, hsl(var(--background) / 0.4) 40%, hsl(var(--background) / 0.8) 100%)" }}
      />
      
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
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{ backgroundImage: "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)", backgroundSize: '80px 80px' }}
        />
      </div>

      <motion.div
        className="pointer-events-none fixed w-[500px] h-[500px] rounded-full opacity-10 blur-3xl z-40 transition-opacity duration-500 hidden md:block"
        style={{ background: "radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)", left: mousePos.x - 250, top: mousePos.y - 250 }}
      />

      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 xs:px-5 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-16 xs:py-20 sm:py-24 md:py-28 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-16 items-center">
          
          <motion.div
            ref={contentRef}
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="order-2 lg:order-1 space-y-4 xs:space-y-5 sm:space-y-6 md:space-y-8 text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ delay: 0.3, type: "spring" }}
              className="inline-flex items-center gap-2 xs:gap-2.5 sm:gap-3 px-3 xs:px-4 sm:px-5 py-1.5 xs:py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border border-primary/30 backdrop-blur-md shadow-lg shadow-primary/10 mx-auto lg:mx-0"
            >
              <span className="relative flex h-2 w-2 xs:h-2.5 xs:w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 xs:h-2.5 xs:w-2.5 bg-emerald-500" />
              </span>
              <span className="text-[10px] xs:text-xs sm:text-sm font-semibold text-foreground">Available for opportunities</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="space-y-2 xs:space-y-3 sm:space-y-4"
            >
              <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold leading-[1.1] xs:leading-[1.05] sm:leading-[1] tracking-tight">
                <motion.span 
                  className="block text-foreground"
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.5 }}
                >
                  Hi, I'm
                </motion.span>
                <motion.span 
                  className="block mt-1 xs:mt-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.6 }}
                >
                  <span className="relative inline-block">
                    <span className="bg-gradient-to-r from-primary via-purple-500 to-primary bg-[length:200%_auto] animate-[gradient-shift_3s_ease-in-out_infinite] bg-clip-text text-transparent">
                      Moinkhan
                    </span>
                    <motion.span
                      className="absolute -bottom-1 xs:-bottom-2 left-0 w-full h-0.5 xs:h-1 bg-gradient-to-r from-primary to-purple-500 rounded-full"
                      initial={{ scaleX: 0 }}
                      animate={isInView ? { scaleX: 1 } : {}}
                      transition={{ delay: 0.9, duration: 0.8 }}
                    />
                  </span>
                </motion.span>
              </h1>

              <div className="h-6 xs:h-8 sm:h-10 md:h-12 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={currentRole}
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -40, opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-medium text-primary flex items-center gap-2 justify-center lg:justify-start"
                  >
                    <Code2 className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5" />
                    {roles[currentRole]}
                  </motion.p>
                </AnimatePresence>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.8 }}
              className="text-xs xs:text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0"
            >
              Crafting beautiful, high-performance web experiences with modern technologies.
              Passionate about creating intuitive interfaces that users love.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.9 }}
              className="flex flex-col xs:flex-row gap-3 xs:gap-4 pt-2 xs:pt-4 justify-center lg:justify-start"
            >
              <Button
                onClick={() => scrollToSection("#projects")}
                size="lg"
                className="group relative overflow-hidden rounded-full font-semibold px-5 xs:px-6 sm:px-8 py-4 xs:py-5 sm:py-6 text-sm xs:text-base shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 min-h-[44px] touch-manipulation"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Rocket className="w-4 h-4 xs:w-5 xs:h-5 group-hover:rotate-12 transition-transform" />
                  View Projects
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary via-purple-500 to-primary bg-[length:200%_100%]"
                  animate={{ backgroundPosition: ["0%", "100%", "0%"] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="lg"
                    className="group relative overflow-hidden rounded-full font-semibold px-5 xs:px-6 sm:px-8 py-4 xs:py-5 sm:py-6 text-sm xs:text-base border-2 border-primary/30 hover:border-primary/60 bg-background/50 backdrop-blur-sm min-h-[44px] touch-manipulation"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <Download className="w-4 h-4 xs:w-5 xs:h-5 group-hover:translate-y-0.5 transition-transform" />
                      Resume
                      <ChevronDown className="w-3 h-3 xs:w-4 xs:h-4" />
                    </span>
                    <motion.div
                      className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="w-48 xs:w-56">
                  <DropdownMenuItem asChild className="min-h-[44px]">
                    <a href="/Moinkhan_Resume.pdf" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 cursor-pointer">
                      <Eye className="w-4 h-4" />
                      <span>View Resume</span>
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="min-h-[44px]">
                    <a href="/Moinkhan_Resume.pdf" download className="flex items-center gap-2 cursor-pointer">
                      <Download className="w-4 h-4" />
                      <span>Download PDF</span>
                    </a>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 1.2 }}
              className="flex gap-2.5 xs:gap-3 sm:gap-4 pt-2 xs:pt-4 justify-center lg:justify-start"
            >
              {socialLinks.map((link, index) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2.5 xs:p-3 sm:p-4 rounded-lg xs:rounded-xl border-2 border-primary/20 bg-background/50 backdrop-blur-sm text-muted-foreground ${link.color} hover:border-primary/40 hover:bg-primary/10 active:bg-primary/15 transition-all duration-300 relative overflow-hidden group touch-manipulation min-w-[40px] min-h-[40px] xs:min-w-[44px] xs:min-h-[44px] sm:min-w-[52px] sm:min-h-[52px] flex items-center justify-center`}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 1.3 + index * 0.1, type: "spring" }}
                  whileHover={{ scale: 1.1, y: -4, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={link.label}
                >
                  <link.icon className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 relative z-10" />
                  <motion.div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 50 }}
            animate={isInView ? { opacity: 1, scale: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
            className="order-1 lg:order-2 relative flex items-center justify-center"
          >
            <motion.div
              className="relative"
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <motion.div
                className="absolute inset-0 -m-4 xs:-m-6 sm:-m-8 rounded-full border-2 border-primary/20 hidden sm:block"
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute inset-0 -m-10 xs:-m-12 sm:-m-16 rounded-full border border-primary/10 hidden md:block"
                animate={{ rotate: -360 }}
                transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
              />

              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1.5 h-1.5 xs:w-2 xs:h-2 rounded-full bg-primary/60 hidden sm:block"
                  style={{ top: `${50 + Math.sin(i * 45 * Math.PI / 180) * 60}%`, left: `${50 + Math.cos(i * 45 * Math.PI / 180) * 60}%` }}
                  animate={{ y: [0, -20, 0], opacity: [0.3, 1, 0.3], scale: [1, 1.5, 1] }}
                  transition={{ duration: 3 + i * 0.3, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
                />
              ))}

              <div className="relative w-40 h-40 xs:w-48 xs:h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 xl:w-80 xl:h-80 2xl:w-[400px] 2xl:h-[400px] mx-auto">
                <motion.div
                  className="absolute inset-0 rounded-2xl xs:rounded-3xl blur-2xl xs:blur-3xl opacity-40"
                  style={{ background: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(280 70% 50%) 100%)" }}
                  animate={{ opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                
                <motion.div
                  className="relative w-full h-full rounded-2xl xs:rounded-3xl overflow-hidden border-2 border-primary/30 shadow-2xl"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.4 }}
                >
                  <motion.div
                    className="absolute inset-0 rounded-2xl xs:rounded-3xl"
                    style={{ background: "conic-gradient(from 0deg, hsl(var(--primary)), hsl(280 70% 50%), hsl(340 70% 50%), hsl(var(--primary)))", padding: "3px" }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  >
                    <div className="w-full h-full rounded-2xl xs:rounded-3xl bg-background" />
                  </motion.div>

                  <img
                    src={myPhoto}
                    alt="Moinkhan Bhatti"
                    className="absolute inset-[3px] w-[calc(100%-6px)] h-[calc(100%-6px)] object-cover rounded-[14px] xs:rounded-[20px]"
                    style={{ objectPosition: "center 10%" }}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />

                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                  />
                </motion.div>

                <motion.div 
                  className="mt-4 xs:mt-5 sm:mt-6 md:mt-8 flex flex-wrap justify-center gap-1.5 xs:gap-2 sm:gap-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 1.1 }}
                >
                  {[
                    { name: "React", icon: "⚛️" },
                    { name: "TypeScript", icon: "�" },
                    { name: "Next.js", icon: "▲" },
                    { name: "Tailwind", icon: "�" },
                  ].map((tech, i) => (
                    <motion.span 
                      key={tech.name}
                      className="group px-2 xs:px-3 sm:px-4 py-1 xs:py-1.5 sm:py-2 rounded-full text-[10px] xs:text-xs sm:text-sm font-semibold text-foreground/90 bg-background/80 backdrop-blur-xl border-2 border-primary/30 shadow-lg relative overflow-hidden touch-manipulation"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ delay: 1.2 + i * 0.1, type: "spring" }}
                      whileHover={{ scale: 1.15, y: -4, borderColor: "hsl(175 80% 50%)", boxShadow: "0 20px 50px hsl(175 80% 50% / 0.4)" }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="relative z-10 flex items-center gap-1 xs:gap-1.5">
                        <span className="text-xs xs:text-sm sm:text-base">{tech.icon}</span>
                        <span>{tech.name}</span>
                      </span>
                      <motion.div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.span>
                  ))}
                </motion.div>

                {[
                  { top: "-8%", right: "5%", delay: 0 },
                  { bottom: "15%", left: "-10%", delay: 0.5 },
                  { top: "25%", right: "-8%", delay: 1 },
                ].map((pos, i) => (
                  <motion.div
                    key={i}
                    className="absolute hidden sm:block"
                    style={{ top: pos.top, bottom: pos.bottom, right: pos.right, left: pos.left }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 1.3 + pos.delay }}
                  >
                    <motion.div animate={{ rotate: 360, scale: [1, 1.3, 1] }} transition={{ duration: 4 + i, repeat: Infinity }}>
                      <Sparkles className="w-5 h-5 xs:w-6 xs:h-6 sm:w-8 sm:h-8 text-primary" />
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-4 xs:bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-30"
      >
        <motion.button
          onClick={() => scrollToSection("#about")}
          className="flex flex-col items-center gap-1.5 xs:gap-2 sm:gap-3 text-muted-foreground hover:text-foreground transition-colors group touch-manipulation p-2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          whileTap={{ scale: 0.9 }}
          aria-label="Scroll to about section"
        >
          <span className="text-[9px] xs:text-[10px] sm:text-xs font-semibold tracking-widest uppercase">Scroll</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <ArrowDown className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 group-hover:text-primary transition-colors" />
          </motion.div>
        </motion.button>
      </motion.div>

      <style>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% center; }
          50% { background-position: 100% center; }
        }
      `}</style>
    </section>
  );
};
