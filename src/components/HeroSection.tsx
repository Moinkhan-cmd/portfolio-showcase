import { ArrowDown, Download, Github, Linkedin, Mail, Sparkles, ExternalLink, Eye, ChevronDown, Code2, Zap } from "lucide-react";
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
  { icon: Github, href: "https://github.com/Moinkhan-cmd", label: "GitHub", gradient: "from-[#333] to-[#6e5494]" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/moin-bhatti-65363a255", label: "LinkedIn", gradient: "from-[#0077b5] to-[#00a0dc]" },
  { icon: Mail, href: "https://mail.google.com/mail/?view=cm&fs=1&to=moinbhatti59%40gmail.com", label: "Email", gradient: "from-[#ea4335] to-[#fbbc05]" },
] as const;

const roles = ["Frontend Developer", "UI/UX Designer", "React Specialist", "Creative Coder"];

export const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [currentRole, setCurrentRole] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 150 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), springConfig);
  const isInView = useInView(contentRef, { once: true, amount: 0.2 });

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

  return (
    <section
      id="hero"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen overflow-hidden bg-background flex items-center"
    >
      {/* 3D Background */}
      <HeroBackground3D />
      
      {/* Layered gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/60 to-background pointer-events-none z-[1]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,hsl(var(--primary)/0.15),transparent)] pointer-events-none z-[1]" />
      
      {/* Mesh gradient */}
      <div className="absolute inset-0 overflow-hidden z-[1]">
        <motion.div
          className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] rounded-full blur-[120px] opacity-20"
          style={{ background: "radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)" }}
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] rounded-full blur-[100px] opacity-15"
          style={{ background: "radial-gradient(circle, hsl(280 70% 50%) 0%, transparent 70%)" }}
          animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Interactive cursor glow */}
      <motion.div
        className="pointer-events-none fixed w-[400px] h-[400px] rounded-full opacity-[0.08] blur-[80px] z-40"
        style={{
          background: "radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)",
          left: mousePos.x - 200,
          top: mousePos.y - 200,
        }}
      />

      {/* Main Content */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[calc(100vh-160px)]">
          
          {/* Left Column - Content */}
          <motion.div
            ref={contentRef}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6 sm:space-y-8"
          >
            {/* Status Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            >
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 backdrop-blur-xl">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-lg shadow-emerald-500/50" />
                </span>
                <span className="text-sm font-medium bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Open to new opportunities
                </span>
                <Zap className="w-3.5 h-3.5 text-primary animate-pulse" />
              </div>
            </motion.div>

            {/* Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="space-y-2"
            >
              <h1 className="text-4xl xs:text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-[0.9]">
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
                    className="absolute -right-8 top-0"
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
              transition={{ delay: 0.7 }}
              className="h-12 sm:h-14 overflow-hidden"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentRole}
                  initial={{ y: 40, opacity: 0, rotateX: -45 }}
                  animate={{ y: 0, opacity: 1, rotateX: 0 }}
                  exit={{ y: -40, opacity: 0, rotateX: 45 }}
                  transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
                  className="flex items-center gap-3"
                >
                  <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                    <Code2 className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <span className="text-xl sm:text-2xl lg:text-3xl text-muted-foreground font-light tracking-wide">
                    {roles[currentRole]}
                  </span>
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.8 }}
              className="text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-xl"
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
                  onClick={() => scrollToSection("#projects")}
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
                      className="group border-2 border-border hover:border-primary/50 hover:bg-primary/5 px-8 py-6 text-base font-semibold backdrop-blur-sm"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Resume
                      <ChevronDown className="ml-2 h-4 w-4 group-hover:rotate-180 transition-transform duration-300" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 z-[9999]" sideOffset={8}>
                    <DropdownMenuItem
                      onClick={() => window.open("https://drive.google.com/file/d/1p42p9NpczSWy_-iLeVaO38ciHAMHXp9r/view?usp=sharing", "_blank")}
                      className="cursor-pointer"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Resume
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => window.open("https://drive.google.com/uc?export=download&id=1p42p9NpczSWy_-iLeVaO38ciHAMHXp9r", "_blank")}
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
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-5 relative flex justify-center lg:justify-end"
          >
            <motion.div
              className="relative"
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            >
              {/* Orbital rings */}
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
                <motion.div
                  className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-violet-500/60"
                />
              </motion.div>

              {/* Main image container */}
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-[400px] lg:h-[400px]">
                {/* Glow effect */}
                <motion.div
                  className="absolute inset-0 rounded-3xl blur-3xl opacity-30"
                  style={{ background: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(280 70% 50%) 50%, hsl(340 70% 50%) 100%)" }}
                  animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.05, 1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                
                {/* Image frame */}
                <div className="relative w-full h-full rounded-3xl overflow-hidden">
                  {/* Animated gradient border */}
                  <motion.div
                    className="absolute inset-0 rounded-3xl p-[3px]"
                    style={{
                      background: "conic-gradient(from var(--angle, 0deg), hsl(var(--primary)), hsl(280 70% 50%), hsl(340 70% 50%), hsl(var(--primary)))",
                    }}
                    animate={{ "--angle": ["0deg", "360deg"] } as any}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  >
                    <div className="w-full h-full rounded-[21px] bg-background" />
                  </motion.div>

                  <img
                    src={myPhoto}
                    alt="Moinkhan Bhatti"
                    className="absolute inset-[4px] w-[calc(100%-8px)] h-[calc(100%-8px)] object-cover rounded-[19px]"
                    style={{ objectPosition: "center 10%" }}
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent rounded-3xl" />
                  
                  {/* Shine effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full rounded-3xl"
                    animate={{ translateX: ["-100%", "200%"] }}
                    transition={{ duration: 4, repeat: Infinity, repeatDelay: 3 }}
                  />
                </div>

                {/* Floating decoration - top right */}
                <motion.div
                  className="absolute -top-3 -right-3 z-10"
                  animate={{ y: [0, -8, 0], rotate: [0, 5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="p-2.5 rounded-xl bg-background/80 border border-primary/30 backdrop-blur-xl shadow-lg shadow-primary/10">
                    <Sparkles className="w-4 h-4 text-primary" />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30"
      >
        <motion.button
          onClick={() => scrollToSection("#about")}
          className="flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
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
      `}</style>
    </section>
  );
};