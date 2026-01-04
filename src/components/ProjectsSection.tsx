import { useRef, useState, type CSSProperties } from "react";
import { ExternalLink, Github, Folder, Sparkles, ArrowRight, Loader2, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { ProjectsBackground3D } from "./ProjectsBackground3D";
import { useProjects } from "@/hooks/useProjects";
import type { Project } from "@/lib/admin/projects";
import { Badge } from "@/components/ui/badge";

interface ProjectCardProps {
  project: Project;
  index: number;
  isFeatured?: boolean;
}

const ProjectCard = ({ project, index, isFeatured = false }: ProjectCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // 3D tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseXSpring = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseYSpring = useSpring(y, { stiffness: 500, damping: 100 });
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7.5deg", "-7.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7.5deg", "7.5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.7, 
        delay: index * 0.1, 
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      style={{
        rotateX,
        rotateY,
      }}
      className={`group relative perspective-1000 preserve-3d ${isFeatured ? 'md:col-span-2 md:row-span-2' : ''}`}
    >
      {/* Enhanced glow effect behind card */}
      <motion.div
        className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-primary/30 via-primary/20 to-primary/30 opacity-0 blur-2xl"
        animate={{
          opacity: isHovered ? 0.8 : 0,
          scale: isHovered ? 1.08 : 1,
        }}
        transition={{ duration: 0.4 }}
      />

      {/* Secondary glow layer */}
      <motion.div
        className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-primary/20 to-transparent opacity-0 blur-xl"
        animate={{
          opacity: isHovered ? 0.6 : 0,
          rotate: isHovered ? 3 : 0,
        }}
        transition={{ duration: 0.5 }}
      />

      <motion.div
        className="relative rounded-2xl overflow-hidden h-full border border-primary/10 bg-gradient-to-br from-card/80 via-card/60 to-card/80 backdrop-blur-xl"
        animate={{
          y: isHovered ? -12 : 0,
          scale: isHovered ? 1.02 : 1,
          borderColor: isHovered ? "hsl(175 80% 50% / 0.3)" : "hsl(175 80% 50% / 0.1)",
        }}
        transition={{ duration: 0.3, type: "spring" }}
        style={{
          boxShadow: isHovered
            ? "0 25px 80px -12px hsl(175 80% 50% / 0.35), 0 10px 30px -10px hsl(0 0% 0% / 0.3), inset 0 1px 0 hsl(175 80% 50% / 0.1)"
            : "0 4px 30px -5px hsl(0 0% 0% / 0.25), inset 0 1px 0 hsl(175 80% 50% / 0.05)",
        }}
      >
        {/* Featured badge */}
        {isFeatured && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute top-4 right-4 z-40"
          >
            <Badge 
              className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground border-0 shadow-lg shadow-primary/30 flex items-center gap-1.5 px-3 py-1.5"
            >
              <Star className="w-3.5 h-3.5 fill-current" />
              Featured
            </Badge>
          </motion.div>
        )}

        {/* Animated border gradient */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none z-50"
          style={{
            background: isHovered 
              ? "linear-gradient(90deg, transparent 0%, hsl(175 80% 50% / 0.5) 50%, transparent 100%)"
              : "transparent",
            backgroundSize: "200% 100%",
          }}
          animate={{
            backgroundPosition: isHovered ? ["200% 0", "-200% 0"] : "0% 0",
          }}
          transition={{
            duration: 2,
            repeat: isHovered ? Infinity : 0,
            ease: "linear",
          }}
        />

        {/* Project Image */}
        <div className={`relative overflow-hidden ${isFeatured ? 'aspect-[16/9]' : 'aspect-video'}`}>
          {/* Gradient overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent z-20 pointer-events-none"
            animate={{ opacity: isHovered ? 0.9 : 0.7 }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Animated gradient mesh */}
          <motion.div
            className="absolute inset-0 z-10 opacity-40 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at 30% 20%, hsl(175 80% 50% / 0.2) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, hsl(175 80% 50% / 0.15) 0%, transparent 50%)",
            }}
            animate={{
              opacity: isHovered ? 0.6 : 0.3,
            }}
            transition={{ duration: 0.4 }}
          />
          
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent z-30 pointer-events-none"
            initial={{ x: "-100%" }}
            animate={{
              x: isHovered ? ["100%", "400%"] : "-100%",
            }}
            transition={{
              duration: 1,
              repeat: isHovered ? Infinity : 0,
              repeatDelay: 0.5,
              ease: "easeInOut",
            }}
          />

          {project.thumbnail ? (
            <motion.img
              src={project.thumbnail}
              alt={project.title}
              className="w-full h-full object-cover"
              animate={{
                scale: isHovered ? 1.1 : 1,
                filter: isHovered ? "brightness(0.8)" : "brightness(1)",
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
              <motion.div
                animate={{
                  opacity: isHovered ? 0.5 : 0.8,
                  scale: isHovered ? 1.2 : 1,
                  rotate: isHovered ? 10 : 0,
                }}
                transition={{ duration: 0.4 }}
              >
                <Folder className="w-16 h-16 sm:w-20 sm:h-20 text-primary/30" />
              </motion.div>
            </div>
          )}

          {/* Hover Overlay with action buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-gradient-to-br from-background/98 via-background/95 to-background/90 backdrop-blur-lg flex items-center justify-center gap-6 z-40"
          >
            {/* Animated dots pattern */}
            <motion.div
              className="absolute inset-0 opacity-20"
              animate={{
                backgroundPosition: isHovered ? ["0% 0%", "100% 100%"] : "0% 0%",
              }}
              transition={{
                duration: 4,
                repeat: isHovered ? Infinity : 0,
                ease: "linear",
              }}
              style={{
                backgroundImage: "radial-gradient(circle at 2px 2px, hsl(175 80% 50%) 1px, transparent 0)",
                backgroundSize: "32px 32px",
              } as CSSProperties}
            />

            {/* Floating rings decoration */}
            <motion.div
              className="absolute w-48 h-48 border border-primary/20 rounded-full"
              animate={{
                scale: isHovered ? [1, 1.5] : 1,
                opacity: isHovered ? [0.5, 0] : 0,
              }}
              transition={{
                duration: 1.5,
                repeat: isHovered ? Infinity : 0,
                ease: "easeOut",
              }}
            />

            <motion.a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 sm:p-5 rounded-2xl relative overflow-hidden border border-primary/40 bg-gradient-to-br from-primary/20 to-primary/10 backdrop-blur-sm"
              aria-label="Live Demo"
              initial={{ opacity: 0, scale: 0, rotate: -180 }}
              animate={{ 
                opacity: isHovered ? 1 : 0,
                scale: isHovered ? 1 : 0,
                rotate: isHovered ? 0 : -180,
              }}
              transition={{ duration: 0.4, delay: 0.1, type: "spring" }}
              whileHover={{ scale: 1.15, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-primary/50 to-primary/30 rounded-2xl"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
              <ExternalLink className="w-6 h-6 sm:w-7 sm:h-7 relative z-10 text-primary" />
            </motion.a>

            <motion.a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 sm:p-5 rounded-2xl relative overflow-hidden border border-primary/40 bg-gradient-to-br from-primary/20 to-primary/10 backdrop-blur-sm"
              aria-label="GitHub"
              initial={{ opacity: 0, scale: 0, rotate: 180 }}
              animate={{ 
                opacity: isHovered ? 1 : 0,
                scale: isHovered ? 1 : 0,
                rotate: isHovered ? 0 : 180,
              }}
              transition={{ duration: 0.4, delay: 0.2, type: "spring" }}
              whileHover={{ scale: 1.15, rotate: -5 }}
              whileTap={{ scale: 0.9 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-primary/50 to-primary/30 rounded-2xl"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
              <Github className="w-6 h-6 sm:w-7 sm:h-7 relative z-10 text-primary" />
            </motion.a>
          </motion.div>

          {/* Floating particles effect */}
          <AnimatePresence>
            {isHovered && [...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 bg-primary/80 rounded-full z-35"
                initial={{
                  x: `${Math.random() * 100}%`,
                  y: "100%",
                  opacity: 0,
                  scale: 0,
                }}
                animate={{
                  y: "-20%",
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0.5],
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 2 + Math.random(),
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeOut",
                }}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Project Content */}
        <div className="p-5 sm:p-6 relative z-10">
          {/* Subtle gradient overlay on content */}
          <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent pointer-events-none" />
          
          {/* Title with icon */}
          <motion.div
            className="flex items-center gap-2.5 mb-3 relative"
            animate={{ x: isHovered ? 6 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="p-1.5 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5"
              animate={{ 
                scale: isHovered ? 1.1 : 1,
                rotate: isHovered ? 360 : 0,
              }}
              transition={{ duration: 0.5 }}
            >
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            </motion.div>
            <motion.h3
              className="font-display text-lg sm:text-xl font-semibold bg-gradient-to-r from-foreground via-foreground to-foreground/80 bg-clip-text"
              animate={{ scale: isHovered ? 1.02 : 1 }}
            >
              {project.title}
            </motion.h3>
          </motion.div>

          <p className="text-muted-foreground text-sm mb-4 leading-relaxed line-clamp-2 relative">
            {project.shortDescription}
          </p>

          {/* Tech Stack with enhanced styling */}
          <div className="flex flex-wrap gap-2 mb-5 relative">
            {project.techStack.slice(0, isFeatured ? 6 : 4).map((tech, techIndex) => (
              <motion.span
                key={tech}
                initial={{ opacity: 0, scale: 0, y: 10 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  delay: index * 0.05 + techIndex * 0.03,
                  type: "spring",
                  stiffness: 300,
                }}
                whileHover={{ 
                  scale: 1.08, 
                  y: -3,
                }}
                className="text-xs px-3 py-1.5 bg-gradient-to-r from-primary/15 via-primary/10 to-primary/15 border border-primary/25 rounded-full text-primary/90 font-medium cursor-default transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20 hover:bg-primary/20"
              >
                {tech}
              </motion.span>
            ))}
            {project.techStack.length > (isFeatured ? 6 : 4) && (
              <motion.span
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="text-xs px-3 py-1.5 bg-muted/50 border border-border rounded-full text-muted-foreground font-medium"
              >
                +{project.techStack.length - (isFeatured ? 6 : 4)}
              </motion.span>
            )}
          </div>

          {/* Skills (optional) */}
          {Array.isArray(project.skills) && project.skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-5 relative">
              {project.skills.slice(0, 5).map((skill) => (
                <Badge 
                  key={skill} 
                  variant="secondary" 
                  className="text-[11px] bg-secondary/50 hover:bg-secondary/70 transition-colors"
                >
                  {skill}
                </Badge>
              ))}
              {project.skills.length > 5 && (
                <Badge variant="secondary" className="text-[11px] bg-secondary/30">
                  +{project.skills.length - 5}
                </Badge>
              )}
            </div>
          )}

          {/* Action Buttons with enhanced styling */}
          <div className="flex gap-3 relative">
            <motion.div 
              className="flex-1" 
              whileHover={{ scale: 1.03 }} 
              whileTap={{ scale: 0.97 }}
            >
              <Button
                variant="hero"
                size="sm"
                asChild
                className="w-full relative overflow-hidden group/btn text-sm font-medium shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-shadow"
              >
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2"
                >
                  <motion.span
                    animate={isHovered ? { rotate: -15 } : { rotate: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Zap className="w-4 h-4 relative z-10" />
                  </motion.span>
                  <span className="relative z-10">Live Demo</span>
                  <motion.span
                    animate={isHovered ? { x: 3, opacity: 1 } : { x: -5, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="relative z-10"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </motion.span>
                </a>
              </Button>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.1, rotate: 5 }} 
              whileTap={{ scale: 0.9 }}
            >
              <Button 
                variant="outline" 
                size="sm" 
                asChild 
                className="px-4 border-primary/30 hover:border-primary/60 hover:bg-primary/10 transition-all"
              >
                <a 
                  href={project.githubUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center"
                >
                  <Github className="w-4 h-4" />
                </a>
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export const ProjectsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { data: projects = [], isLoading } = useProjects();

  // Filter featured projects or show all if none are featured
  const featuredProjects = projects.filter((p) => p.featured);
  const displayProjects = featuredProjects.length > 0 ? featuredProjects : projects;

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="section-padding relative overflow-hidden"
    >
      <ProjectsBackground3D />
      
      {/* Enhanced overlay for text contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/70 to-background/60 pointer-events-none z-10" />
      <div className="absolute inset-0 pointer-events-none z-10" 
           style={{
             background: 'radial-gradient(ellipse at center, transparent 0%, hsl(222 47% 6% / 0.3) 60%, hsl(222 47% 6% / 0.6) 100%)'
           }} 
      />
      
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10 opacity-40">
        <motion.div
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px]"
          animate={{
            x: [0, 80, 0],
            y: [0, 50, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-primary/8 rounded-full blur-[80px]"
          animate={{
            x: [0, -60, 0],
            y: [0, -40, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Enhanced grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.1)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.1)_1px,transparent_1px)] bg-[size:60px_60px] sm:bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)] pointer-events-none z-10" />

      <div className="container mx-auto container-padding relative z-20">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, type: "spring" }}
          className="text-center mb-12 sm:mb-20"
        >
          {/* Decorative element */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-24 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-6 rounded-full"
          />
          
          <motion.span
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 text-primary text-sm font-medium uppercase tracking-wider mb-4 px-4 py-2 rounded-full bg-primary/10 border border-primary/20"
          >
            <Sparkles className="w-4 h-4" />
            Portfolio
          </motion.span>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mt-4"
          >
            Featured{" "}
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
              Work
            </span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-muted-foreground mt-4 sm:mt-6 max-w-2xl mx-auto text-base sm:text-lg px-4"
          >
            A curated selection of projects showcasing my expertise in building
            modern, performant web applications
          </motion.p>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center justify-center gap-8 mt-8"
          >
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-primary">{projects.length}</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Projects</p>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-primary">{featuredProjects.length}</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Featured</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Loader2 className="w-10 h-10 text-primary" />
            </motion.div>
            <p className="text-muted-foreground text-sm">Loading projects...</p>
          </div>
        ) : displayProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
            {displayProjects.map((project, index) => (
              <ProjectCard 
                key={project.id || project.title} 
                project={project} 
                index={index}
                isFeatured={index === 0 && displayProjects.length > 2}
              />
            ))}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 px-6 rounded-2xl border border-dashed border-primary/20 bg-card/30 backdrop-blur-sm max-w-md mx-auto"
          >
            <Folder className="w-12 h-12 text-primary/40 mx-auto mb-4" />
            <p className="text-muted-foreground">No projects available yet.</p>
            <p className="text-sm text-muted-foreground/60 mt-2">Check back soon for updates!</p>
          </motion.div>
        )}
      </div>
    </section>
  );
};
