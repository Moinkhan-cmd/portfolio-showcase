import { useRef, useState, useMemo } from "react";
import { ExternalLink, Github, Folder, Sparkles, ArrowRight, Loader2, Star, Zap, Code, Tag, Clock, CheckCircle2, Search, X, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/useIsMobile";
import { ProjectsBackground3D } from "./ProjectsBackground3D";
import { MobileGradientBackground } from "./MobileGradientBackground";
import { useProjects } from "@/hooks/useProjects";
import type { Project } from "@/lib/admin/projects";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";

interface ProjectCardProps {
  project: Project;
  index: number;
  isFeatured?: boolean;
}

const ProjectCard = ({ project, index, isFeatured = false }: ProjectCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Subtle 3D tilt effect - only used on desktop
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseXSpring = useSpring(x, { stiffness: 400, damping: 50 });
  const mouseYSpring = useSpring(y, { stiffness: 400, damping: 50 });
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["4deg", "-4deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-4deg", "4deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || isMobile) return;
    
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

  // Mobile: simplified static card
  if (isMobile) {
    return (
      <div ref={ref} className="group relative">
        <div className="relative h-full rounded-2xl overflow-hidden border border-primary/10 bg-gradient-to-br from-card/90 via-card/80 to-card/90 flex flex-col">
          {/* Featured badge */}
          {isFeatured && (
            <div className="absolute top-4 right-4 z-30">
              <Badge className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground border-0 shadow-lg flex items-center gap-1.5 px-3 py-1">
                <Star className="w-3.5 h-3.5 fill-current" />
                Featured
              </Badge>
            </div>
          )}

          {/* Project Image */}
          <div className={`relative overflow-hidden ${isFeatured ? 'aspect-[21/9]' : 'aspect-video'} bg-gradient-to-br from-primary/10 via-primary/5 to-transparent`}>
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent z-20 pointer-events-none opacity-85" />
            {project.thumbnail ? (
              <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Folder className="w-16 h-16 text-primary/30" />
              </div>
            )}
          </div>

          {/* Project Content */}
          <div className="p-4 sm:p-5 relative z-10 flex flex-col h-full min-h-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <div className="p-1 rounded-lg bg-primary/10 shrink-0">
                  <Code className="w-3.5 h-3.5 text-primary" />
                </div>
                <h3 className="font-display text-base sm:text-lg font-semibold text-foreground truncate">
                  {project.title}
                </h3>
              </div>
            </div>

            <p className="text-xs sm:text-sm line-clamp-2 mb-3 text-muted-foreground leading-relaxed">
              {project.shortDescription}
            </p>

            {/* Tech Stack */}
            <div className="flex flex-wrap gap-1.5 mb-3 min-h-[1.75rem]">
              {project.techStack.slice(0, isFeatured ? 5 : 4).map((tech) => (
                <span
                  key={tech}
                  className="text-[10px] px-2 py-0.5 bg-primary/10 border border-primary/20 rounded-full text-primary/90 font-medium touch-manipulation"
                >
                  {tech}
                </span>
              ))}
              {project.techStack.length > (isFeatured ? 5 : 4) && (
                <span className="text-[10px] px-2 py-0.5 bg-muted/50 border border-border rounded-full text-muted-foreground font-medium">
                  +{project.techStack.length - (isFeatured ? 5 : 4)}
                </span>
              )}
            </div>

            <div className="flex-grow" />

            {/* Action Buttons */}
            <div className="flex gap-2 mt-auto pt-2">
              {project.liveUrl && (
                <Button variant="hero" size="sm" asChild className="flex-1 text-xs font-medium shadow-md touch-manipulation py-2">
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" />
                    <span>Live Demo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </Button>
              )}
              {project.githubUrl && (
                <Button variant="outline" size="sm" asChild className="px-3 border-primary/25 touch-manipulation min-w-[2.5rem]">
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                    <Github className="w-3.5 h-3.5" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Desktop: full animated card
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
      className="group relative"
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

        {/* Project Content - Responsive */}
        <div className="p-4 sm:p-5 md:p-6 relative z-10 flex flex-col h-full min-h-0">
          {/* Title - Responsive */}
          <div className="flex items-start justify-between gap-2 sm:gap-3 mb-2 sm:mb-3">
            <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
              <motion.div
                className="p-1 sm:p-1.5 rounded-lg bg-primary/10 shrink-0"
                animate={{ 
                  scale: isHovered ? 1.1 : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                <Code className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
              </motion.div>
              <h3 className="font-display text-base sm:text-lg md:text-xl font-semibold text-foreground truncate">
                {project.title}
              </h3>
            </div>
          </div>

          {/* Description - Responsive */}
          <div
            className={cn(
              "mb-3 sm:mb-4 leading-relaxed min-h-[2.5rem] sm:min-h-[3rem] transition-colors duration-300",
              isHovered ? "text-foreground/90" : "text-muted-foreground"
            )}
          >
            <AnimatePresence mode="wait">
              {isHovered && project.fullDescription ? (
                <motion.p
                  key="full"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.3 }}
                  className="text-xs sm:text-sm leading-relaxed"
                >
                  {project.fullDescription}
                </motion.p>
              ) : (
                <motion.p
                  key="short"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.3 }}
                  className="text-xs sm:text-sm line-clamp-2 sm:line-clamp-3"
                >
                  {project.shortDescription}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Category and Status - Show on hover */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex flex-wrap gap-2 mb-4 overflow-hidden"
              >
                {project.category && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Badge variant="outline" className="gap-1.5 border-primary/30 bg-background/50 hover:bg-primary/10 hover:border-primary/50 text-xs font-semibold">
                      <Tag className="w-3 h-3" />
                      {project.category}
                    </Badge>
                  </motion.div>
                )}
                {project.status && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.15 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Badge 
                      variant={project.status === "completed" ? "default" : "secondary"}
                      className={`gap-1.5 text-xs font-semibold ${
                        project.status === "completed" 
                          ? "bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30" 
                          : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/30"
                      }`}
                    >
                      {project.status === "completed" ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <Clock className="w-3 h-3" />
                      )}
                      {project.status === "completed" ? "Completed" : "In Progress"}
                    </Badge>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tech Stack - Responsive */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4 min-h-[1.75rem] sm:min-h-[2rem]">
            <AnimatePresence mode="popLayout">
              {(isHovered ? project.techStack : project.techStack.slice(0, isFeatured ? 5 : 4)).map((tech, techIndex) => (
                <motion.span
                  key={tech}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ 
                    delay: isHovered ? techIndex * 0.02 : index * 0.05 + techIndex * 0.02,
                  }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 bg-primary/10 border border-primary/20 rounded-full text-primary/90 font-medium hover:bg-primary/15 hover:border-primary/30 active:bg-primary/20 transition-colors touch-manipulation"
                >
                  {tech}
                </motion.span>
              ))}
            </AnimatePresence>
            {!isHovered && project.techStack.length > (isFeatured ? 5 : 4) && (
              <motion.span 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 bg-muted/50 border border-border rounded-full text-muted-foreground font-medium"
              >
                +{project.techStack.length - (isFeatured ? 5 : 4)}
              </motion.span>
            )}
          </div>

          {/* Skills (optional) - Responsive */}
          {Array.isArray(project.skills) && project.skills.length > 0 && (
            <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-3 sm:mb-4 min-h-[1.5rem]">
              <AnimatePresence mode="popLayout">
                {(isHovered ? project.skills : project.skills.slice(0, 4)).map((skill, skillIndex) => (
                  <motion.div
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8, y: 5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: -5 }}
                    transition={{ 
                      delay: isHovered ? skillIndex * 0.03 : 0,
                    }}
                    whileHover={{ scale: 1.1, y: -2 }}
                  >
                    <Badge 
                      variant="secondary" 
                      className="text-[10px] sm:text-[11px] bg-secondary/40 hover:bg-secondary/60 active:bg-secondary/50 transition-colors touch-manipulation"
                    >
                      {skill}
                    </Badge>
                  </motion.div>
                ))}
              </AnimatePresence>
              {!isHovered && project.skills.length > 4 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <Badge variant="secondary" className="text-[10px] sm:text-[11px] bg-secondary/30">
                    +{project.skills.length - 4}
                  </Badge>
                </motion.div>
              )}
            </div>
          )}

          {/* Spacer to push buttons to bottom */}
          <div className="flex-grow" />

          {/* Action Buttons - Always at bottom - Responsive */}
          <div className="flex gap-2 sm:gap-2.5 mt-auto pt-2">
            {project.liveUrl && (
              <motion.div 
                className="flex-1" 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="hero"
                  size="sm"
                  asChild
                  className="w-full text-xs sm:text-sm font-medium shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 touch-manipulation py-2 sm:py-2.5"
                >
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 sm:gap-2"
                  >
                    <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="text-xs sm:text-sm">Live Demo</span>
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </a>
                </Button>
              </motion.div>
            )}

            {project.githubUrl && (
              <motion.div 
                whileHover={{ scale: 1.05, rotate: 5 }} 
                whileTap={{ scale: 0.9 }}
                className="flex-shrink-0"
              >
                <Button 
                  variant="outline" 
                  size="sm" 
                  asChild 
                  className="px-3 sm:px-4 border-primary/25 hover:border-primary/50 hover:bg-primary/10 touch-manipulation min-w-[2.5rem] sm:min-w-[2.75rem]"
                >
                  <a 
                    href={project.githubUrl} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center"
                  >
                    <Github className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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
  
  // Predefined category options for dropdown
  const categoryOptions = [
    "Web Development",
    "Mobile App",
    "Full Stack",
    "Frontend",
    "Backend",
    "UI/UX Design",
    "E-commerce",
    "API Development",
    "Desktop Application",
    "Game Development",
    "Data Science",
    "Machine Learning",
    "DevOps",
    "Other"
  ];
  
  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedTech, setSelectedTech] = useState<string[]>([]);
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);

  // Extract unique values for filters
  const availableCategories = useMemo(() => {
    const cats = projects.map(p => p.category).filter(Boolean);
    return Array.from(new Set(cats)).sort();
  }, [projects]);

  const techStack = useMemo(() => {
    const allTech = projects.flatMap(p => p.techStack || []);
    return Array.from(new Set(allTech)).sort();
  }, [projects]);

  // Filter projects based on all criteria
  const filteredProjects = useMemo(() => {
    let filtered = [...projects];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(query) ||
        project.shortDescription.toLowerCase().includes(query) ||
        project.fullDescription?.toLowerCase().includes(query) ||
        project.techStack.some(tech => tech.toLowerCase().includes(query)) ||
        project.skills?.some(skill => skill.toLowerCase().includes(query)) ||
        project.category.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(project => project.category === selectedCategory);
    }

    // Status filter
    if (selectedStatus) {
      filtered = filtered.filter(project => project.status === selectedStatus);
    }

    // Tech stack filter
    if (selectedTech.length > 0) {
      filtered = filtered.filter(project =>
        selectedTech.some(tech => project.techStack.includes(tech))
      );
    }

    // Featured filter
    if (showFeaturedOnly) {
      filtered = filtered.filter(project => project.featured);
    }

    return filtered;
  }, [projects, searchQuery, selectedCategory, selectedStatus, selectedTech, showFeaturedOnly]);

  // Separate featured and regular projects from filtered results
  const featuredProjects = filteredProjects.filter((p) => p.featured);
  const regularProjects = filteredProjects.filter((p) => !p.featured);
  
  // Display featured first, then regular projects
  const displayProjects = [...featuredProjects, ...regularProjects];

  // Check if any filters are active
  const hasActiveFilters = searchQuery.trim() !== "" || selectedCategory !== null || selectedStatus !== null || selectedTech.length > 0 || showFeaturedOnly;

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory(null);
    setSelectedStatus(null);
    setSelectedTech([]);
    setShowFeaturedOnly(false);
  };


  return (
    <section
      id="projects"
      ref={sectionRef}
      className="section-padding relative overflow-hidden bg-secondary/20"
    >
      <ProjectsBackground3D />
      <MobileGradientBackground variant="projects" />
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
        </motion.div>

        {/* Filter System */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8 sm:mb-12"
        >
          <div className="max-w-6xl mx-auto space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search projects by name, description, tech stack..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10 h-11 bg-background/50 backdrop-blur-sm border-primary/20 focus:border-primary/50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-secondary transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              )}
            </div>

            {/* Filter Chips */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {/* Featured Toggle */}
              <motion.button
                onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                  showFeaturedOnly
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                    : "bg-secondary/50 text-foreground hover:bg-secondary border border-border/50"
                )}
              >
                <Star className={cn("w-4 h-4", showFeaturedOnly && "fill-current")} />
                Featured Only
              </motion.button>

              {/* Status Filters */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground font-medium hidden sm:inline">Status:</span>
                {["completed", "in-progress"].map((status) => (
                  <motion.button
                    key={status}
                    onClick={() => setSelectedStatus(selectedStatus === status ? null : status)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200",
                      selectedStatus === status
                        ? status === "completed"
                          ? "bg-green-500/20 text-green-400 border border-green-500/30"
                          : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                        : "bg-secondary/50 text-muted-foreground hover:bg-secondary border border-border/50"
                    )}
                  >
                    {status === "completed" ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      <Clock className="w-3.5 h-3.5" />
                    )}
                    {status === "completed" ? "Completed" : "In Progress"}
                  </motion.button>
                ))}
              </div>

              {/* Category Filter - Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground font-medium hidden sm:inline">Category:</span>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground z-10 pointer-events-none" />
                  <Select
                    value={selectedCategory || "all"}
                    onValueChange={(value) => setSelectedCategory(value === "all" ? null : value)}
                  >
                    <SelectTrigger className="w-[180px] h-9 bg-background/50 backdrop-blur-sm border-primary/20 focus:border-primary/50 text-sm pl-9">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categoryOptions.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Tech Stack Filter - Dropdown */}
              {techStack.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground font-medium hidden sm:inline">Tech Stack:</span>
                  <Popover>
                    <PopoverTrigger asChild>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={cn(
                          "inline-flex items-center gap-2 h-9 px-3 rounded-md text-sm font-medium transition-all duration-200 border",
                          selectedTech.length > 0
                            ? "bg-primary/20 text-primary border-primary/30 hover:bg-primary/25"
                            : "bg-background/50 backdrop-blur-sm text-foreground border-primary/20 hover:bg-background/70"
                        )}
                      >
                        <Filter className="w-3.5 h-3.5" />
                        <span>
                          {selectedTech.length > 0
                            ? `${selectedTech.length} Selected`
                            : "All Tech Stack"}
                        </span>
                      </motion.button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[280px] p-3" align="start">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-semibold">Select Tech Stack</h4>
                          {selectedTech.length > 0 && (
                            <button
                              onClick={() => setSelectedTech([])}
                              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                            >
                              Clear
                            </button>
                          )}
                        </div>
                        <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2">
                          {techStack.map((tech) => (
                            <label
                              key={tech}
                              className="flex items-center gap-2 p-2 rounded-md hover:bg-secondary/50 cursor-pointer transition-colors"
                            >
                              <Checkbox
                                checked={selectedTech.includes(tech)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedTech((prev) => [...prev, tech]);
                                  } else {
                                    setSelectedTech((prev) => prev.filter((t) => t !== tech));
                                  }
                                }}
                              />
                              <span className="text-sm flex-1">{tech}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              )}

              {/* Clear Filters Button */}
              {hasActiveFilters && (
                <motion.button
                  onClick={clearFilters}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20 transition-all duration-200 ml-auto"
                >
                  <X className="w-3.5 h-3.5" />
                  Clear Filters
                </motion.button>
              )}
            </div>


            {/* Results Count */}
            {hasActiveFilters && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-muted-foreground"
              >
                Showing {displayProjects.length} of {projects.length} project{displayProjects.length !== 1 ? 's' : ''}
              </motion.div>
            )}
          </div>
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
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8 max-w-7xl mx-auto">
            <AnimatePresence mode="popLayout">
              {displayProjects.map((project, index) => (
                <motion.div
                  key={project.id || `${project.title}-${index}`}
                  layout
                  className={project.featured ? "md:col-span-2 lg:col-span-1" : undefined}
                >
                  <ProjectCard
                    project={project}
                    index={index}
                    isFeatured={project.featured}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : hasActiveFilters ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 px-6 rounded-2xl border border-dashed border-primary/20 bg-card/30 backdrop-blur-sm max-w-md mx-auto"
          >
            <Filter className="w-12 h-12 text-primary/40 mx-auto mb-4" />
            <p className="text-muted-foreground font-medium">No projects match your filters.</p>
            <p className="text-sm text-muted-foreground/60 mt-2">Try adjusting your search or filter criteria.</p>
            <Button
              onClick={clearFilters}
              variant="outline"
              className="mt-4"
            >
              Clear All Filters
            </Button>
          </motion.div>
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
