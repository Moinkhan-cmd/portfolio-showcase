import { useRef, useState } from "react";
import { ExternalLink, Github, Folder, Sparkles, ArrowRight, Loader2, Star, Zap, Code } from "lucide-react";
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

  // Subtle 3D tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseXSpring = useSpring(x, { stiffness: 400, damping: 50 });
  const mouseYSpring = useSpring(y, { stiffness: 400, damping: 50 });
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["4deg", "-4deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-4deg", "4deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = (mouseX / rect.width) - 0.5;
    const yPct = (mouseY / rect.height) - 0.5;
    
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
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.08,
        ease: "easeOut"
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      style={{
        rotateX,
        rotateY,
      }}
      className={`group relative ${isFeatured ? 'md:col-span-2 lg:col-span-1' : ''}`}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 opacity-0 blur-xl -z-10"
        animate={{
          opacity: isHovered ? 0.6 : 0,
          scale: isHovered ? 1.05 : 1,
        }}
        transition={{ duration: 0.3 }}
      />

      <motion.div
        className="relative h-full rounded-2xl overflow-hidden border border-primary/10 bg-gradient-to-br from-card/90 via-card/80 to-card/90 backdrop-blur-sm transition-all duration-300 flex flex-col"
        animate={{
          y: isHovered ? -8 : 0,
          borderColor: isHovered ? "hsl(175 80% 50% / 0.25)" : "hsl(175 80% 50% / 0.1)",
        }}
        style={{
          boxShadow: isHovered
            ? "0 20px 60px -12px hsl(175 80% 50% / 0.25), 0 8px 25px -8px hsl(0 0% 0% / 0.2)"
            : "0 4px 20px -5px hsl(0 0% 0% / 0.15)",
        }}
      >
        {/* Featured badge */}
        {isFeatured && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.08 + 0.2 }}
            className="absolute top-4 right-4 z-30"
          >
            <Badge 
              className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground border-0 shadow-lg shadow-primary/30 flex items-center gap-1.5 px-3 py-1"
            >
              <Star className="w-3.5 h-3.5 fill-current" />
              Featured
            </Badge>
          </motion.div>
        )}

        {/* Project Image */}
        <div className={`relative overflow-hidden ${isFeatured ? 'aspect-[21/9]' : 'aspect-video'} bg-gradient-to-br from-primary/10 via-primary/5 to-transparent`}>
          {/* Gradient overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent z-20 pointer-events-none"
            animate={{ opacity: isHovered ? 0.95 : 0.85 }}
            transition={{ duration: 0.3 }}
          />
          
          {project.thumbnail ? (
            <motion.img
              src={project.thumbnail}
              alt={project.title}
              className="w-full h-full object-cover"
              animate={{
                scale: isHovered ? 1.08 : 1,
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{
                  opacity: isHovered ? 0.6 : 0.8,
                  scale: isHovered ? 1.1 : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                <Folder className="w-16 h-16 text-primary/30" />
              </motion.div>
            </div>
          )}

          {/* Hover overlay with action buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-background/95 backdrop-blur-md flex items-center justify-center gap-4 z-30"
          >
            {project.liveUrl && (
              <motion.a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl border border-primary/30 bg-gradient-to-br from-primary/20 to-primary/10 hover:from-primary/30 hover:to-primary/20 transition-all"
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ 
                  opacity: isHovered ? 1 : 0,
                  scale: isHovered ? 1 : 0.8,
                  y: isHovered ? 0 : 20,
                }}
                transition={{ duration: 0.3, delay: 0.1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <ExternalLink className="w-5 h-5 text-primary" />
              </motion.a>
            )}

            {project.githubUrl && (
              <motion.a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl border border-primary/30 bg-gradient-to-br from-primary/20 to-primary/10 hover:from-primary/30 hover:to-primary/20 transition-all"
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ 
                  opacity: isHovered ? 1 : 0,
                  scale: isHovered ? 1 : 0.8,
                  y: isHovered ? 0 : 20,
                }}
                transition={{ duration: 0.3, delay: 0.15 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Github className="w-5 h-5 text-primary" />
              </motion.a>
            )}
          </motion.div>
        </div>

        {/* Project Content */}
        <div className="p-5 sm:p-6 relative z-10 flex flex-col h-full min-h-0">
          {/* Title */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <motion.div
                className="p-1.5 rounded-lg bg-primary/10 shrink-0"
                animate={{ 
                  scale: isHovered ? 1.1 : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                <Code className="w-4 h-4 text-primary" />
              </motion.div>
              <h3 className="font-display text-lg sm:text-xl font-semibold text-foreground truncate">
                {project.title}
              </h3>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed line-clamp-2 min-h-[2.5rem]">
            {project.shortDescription}
          </p>

          {/* Tech Stack */}
          <div className="flex flex-wrap gap-2 mb-4 min-h-[1.75rem]">
            {project.techStack.slice(0, isFeatured ? 5 : 4).map((tech, techIndex) => (
              <motion.span
                key={tech}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ 
                  delay: index * 0.05 + techIndex * 0.02,
                }}
                whileHover={{ scale: 1.05, y: -2 }}
                className="text-xs px-2.5 py-1 bg-primary/10 border border-primary/20 rounded-full text-primary/90 font-medium hover:bg-primary/15 hover:border-primary/30 transition-colors"
              >
                {tech}
              </motion.span>
            ))}
            {project.techStack.length > (isFeatured ? 5 : 4) && (
              <span className="text-xs px-2.5 py-1 bg-muted/50 border border-border rounded-full text-muted-foreground font-medium">
                +{project.techStack.length - (isFeatured ? 5 : 4)}
              </span>
            )}
          </div>

          {/* Skills (optional) */}
          {Array.isArray(project.skills) && project.skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4 min-h-[1.5rem]">
              {project.skills.slice(0, 4).map((skill) => (
                <Badge 
                  key={skill} 
                  variant="secondary" 
                  className="text-[11px] bg-secondary/40 hover:bg-secondary/60 transition-colors"
                >
                  {skill}
                </Badge>
              ))}
              {project.skills.length > 4 && (
                <Badge variant="secondary" className="text-[11px] bg-secondary/30">
                  +{project.skills.length - 4}
                </Badge>
              )}
            </div>
          )}

          {/* Spacer to push buttons to bottom */}
          <div className="flex-grow" />

          {/* Action Buttons - Always at bottom */}
          <div className="flex gap-2.5 mt-auto pt-2">
            {project.liveUrl && (
              <motion.div 
                className="flex-1" 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="hero"
                  size="sm"
                  asChild
                  className="w-full text-sm font-medium shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30"
                >
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2"
                  >
                    <Zap className="w-4 h-4" />
                    <span>Live Demo</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </Button>
              </motion.div>
            )}

            {project.githubUrl && (
              <motion.div 
                whileHover={{ scale: 1.05, rotate: 5 }} 
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="outline" 
                  size="sm" 
                  asChild 
                  className="px-4 border-primary/25 hover:border-primary/50 hover:bg-primary/10"
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
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export const ProjectsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { data: projects = [], isLoading } = useProjects();

  // Separate featured and regular projects
  const featuredProjects = projects.filter((p) => p.featured);
  const regularProjects = projects.filter((p) => !p.featured);
  
  // Display featured first, then regular projects
  const displayProjects = [...featuredProjects, ...regularProjects];

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="section-padding relative overflow-hidden bg-secondary/20"
    >
      <ProjectsBackground3D />
      
      {/* Background overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/80 to-background/70 pointer-events-none z-10" />
      <div 
        className="absolute inset-0 pointer-events-none z-10" 
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, hsl(222 47% 6% / 0.25) 60%, hsl(222 47% 6% / 0.5) 100%)'
        }} 
      />
      
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10 opacity-30">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/8 rounded-full blur-3xl"
          animate={{
            x: [0, -40, 0],
            y: [0, -25, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.08)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.08)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_70%)] pointer-events-none z-10" />

      <div className="container mx-auto container-padding relative z-20">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-12 sm:mb-16"
        >
          {/* Decorative line */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="w-20 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-6"
          />
          
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 text-primary text-sm font-medium uppercase tracking-wider mb-4 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20"
          >
            <Sparkles className="w-4 h-4" />
            Portfolio
          </motion.span>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl md:text-6xl font-bold mt-4"
          >
            Featured{" "}
            <span className="bg-gradient-to-r from-primary via-primary/90 to-primary bg-clip-text text-transparent">
              Projects
            </span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-muted-foreground mt-4 sm:mt-6 max-w-2xl mx-auto text-base sm:text-lg px-4"
          >
            A curated selection of projects showcasing modern web development and design expertise
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center justify-center gap-8 mt-8"
          >
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-primary">{projects.length}</p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">Total Projects</p>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-primary">{featuredProjects.length}</p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">Featured</p>
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
            <AnimatePresence mode="popLayout">
              {displayProjects.map((project, index) => (
                <ProjectCard 
                  key={project.id || `${project.title}-${index}`} 
                  project={project} 
                  index={index}
                  isFeatured={project.featured}
                />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 px-6 rounded-2xl border border-dashed border-primary/20 bg-card/30 backdrop-blur-sm max-w-md mx-auto"
          >
            <Folder className="w-12 h-12 text-primary/40 mx-auto mb-4" />
            <p className="text-muted-foreground font-medium">No projects available yet.</p>
            <p className="text-sm text-muted-foreground/60 mt-2">Check back soon for updates!</p>
          </motion.div>
        )}
      </div>
    </section>
  );
};
