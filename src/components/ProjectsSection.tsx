import { useRef, useState, type CSSProperties } from "react";
import { ExternalLink, Github, Folder, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import weatherAppImage from "@/images/weather-app.png";
import resumeBuilderImage from "@/images/resume-builder.png";


const projects = [
  {
    title: "Project Name Here",
    description:
      "Brief description of what this project does. Explain the problem it solves and key features.",
    techStack: ["React", "TypeScript", "Tailwind CSS"],
    liveUrl: "#",
    githubUrl: "https://github.com/Moinkhan-cmd",
    image: null,
  },
  {
    title: "Resume Builder",
    description:
      "A user-friendly resume builder that enables real-time resume creation with a clean UI, responsive layout, and instant preview for professional results.",
    techStack: ["HTML", "CSS", "JavaScript"],
    liveUrl: "https://inquisitive-manatee-1675af.netlify.app/",
    githubUrl: "git@github.com:Moinkhan-cmd/Resume-builder.git",
    image: resumeBuilderImage,
  },
  {
    title: "Weather Application",
    description:
      "A beautiful weather app that displays current conditions and forecasts using a weather API.",
    techStack: ["HTML", "CSS", "JavaScript", "API"],
    liveUrl: "https://inspiring-speculoos-f9e5d7.netlify.app/",
    githubUrl: "https://github.com/Moinkhan-cmd/Weather-App",
    image: weatherAppImage,
  },
];

const ProjectCard = ({ project, index }: { project: typeof projects[0]; index: number }) => {
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
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.15, type: "spring" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      style={{
        rotateX,
        rotateY,
      }}
      className="group relative perspective-1000 preserve-3d"
    >
      {/* Glow effect behind card */}
      <motion.div
        className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 opacity-0 blur-xl"
        animate={{
          opacity: isHovered ? 0.6 : 0,
          scale: isHovered ? 1.05 : 1,
        }}
        transition={{ duration: 0.3 }}
      />

      <motion.div
        className="relative glass-enhanced rounded-2xl overflow-hidden card-hover h-full"
        animate={{
          y: isHovered ? -12 : 0,
          scale: isHovered ? 1.02 : 1,
        }}
        transition={{ duration: 0.3, type: "spring" }}
      >
      <motion.div
        animate={{
          boxShadow: isHovered
            ? "0 20px 60px hsl(175 80% 50% / 0.3)"
            : "0 4px 24px hsl(0 0% 0% / 0.2)",
        }}
        transition={{ duration: 0.3 }}
        className="relative"
      >
        {/* Project Image */}
        <div className="aspect-video bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 relative overflow-hidden">
          {/* Animated gradient overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-primary/20 z-10"
            animate={{
              opacity: isHovered ? 0.4 : 0.2,
            }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent z-20"
            animate={{
              x: isHovered ? ["-100%", "200%"] : "-100%",
            }}
            transition={{
              duration: 1.5,
              repeat: isHovered ? Infinity : 0,
              ease: "linear",
            }}          />

          {project.image ? (
            <motion.img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
              animate={{
                scale: isHovered ? 1.1 : 1,
                opacity: isHovered ? 0.85 : 1,
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{
                  opacity: isHovered ? 0.6 : 1,
                  scale: isHovered ? 1.1 : 1,
                  rotate: isHovered ? 5 : 0,
                }}
                transition={{ duration: 0.3 }}
              >
                <Folder className="w-16 h-16 sm:w-20 sm:h-20 text-primary/40" />
              </motion.div>
            </div>
          )}

          {/* Hover Overlay with animated background */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/90 to-background/95 backdrop-blur-md flex items-center justify-center gap-4 sm:gap-6 z-30"
          >
            {/* Animated background pattern */}
            <motion.div
              className="absolute inset-0 opacity-10"
              animate={{
                backgroundPosition: isHovered ? ["0% 0%", "100% 100%"] : "0% 0%",
              }}
              transition={{
                duration: 3,
                repeat: isHovered ? Infinity : 0,
                ease: "linear",
              }}
              style={{
                backgroundImage: "radial-gradient(circle at 2px 2px, hsl(175 80% 50%) 1px, transparent 0)",
                backgroundSize: "40px 40px",
              } as CSSProperties} />

            <motion.a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 sm:p-4 glass-enhanced rounded-full group/btn relative overflow-hidden border border-primary/30"
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
                className="absolute inset-0 bg-gradient-to-br from-primary/40 to-primary/20 rounded-full"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1, scale: 1.2 }}
                transition={{ duration: 0.3 }}
              />
              <ExternalLink className="w-5 h-5 sm:w-6 sm:h-6 relative z-10 text-primary" />
            </motion.a>

            <motion.a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 sm:p-4 glass-enhanced rounded-full group/btn relative overflow-hidden border border-primary/30"
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
                className="absolute inset-0 bg-gradient-to-br from-primary/40 to-primary/20 rounded-full"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1, scale: 1.2 }}
                transition={{ duration: 0.3 }}
              />
              <Github className="w-5 h-5 sm:w-6 sm:h-6 relative z-10 text-primary" />
            </motion.a>
          </motion.div>

          {/* Animated corner accents */}
          <motion.div
            className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 rounded-tr-2xl bg-gradient-to-br from-primary/40 via-primary/20 to-transparent"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: isHovered ? 1 : 0,
              scale: isHovered ? 1 : 0,
            }}
            transition={{ duration: 0.4, type: "spring" }}          />
          <motion.div
            className="absolute bottom-0 left-0 w-16 h-16 sm:w-24 sm:h-24 rounded-bl-2xl bg-gradient-to-tr from-primary/30 to-transparent"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: isHovered ? 0.6 : 0,
              scale: isHovered ? 1 : 0,
            }}
            transition={{ duration: 0.5, delay: 0.1, type: "spring" }}          />
          
          {/* Floating particles effect */}
          {isHovered && [...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-primary/60 rounded-full"
              initial={{
                x: Math.random() * 100 + "%",
                y: Math.random() * 100 + "%",
                opacity: 0,
              }}
              animate={{
                y: [null, "-100%"],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeOut",
              }}
            />
          ))}
        </div>

        {/* Project Content */}
        <div className="p-4 sm:p-6 relative z-10">
          {/* Title with icon */}
          <motion.div
            className="flex items-center gap-2 mb-2 sm:mb-3"
            animate={{ x: isHovered ? 5 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              animate={{ 
                scale: isHovered ? 1.2 : 1,
                rotate: isHovered ? 360 : 0,
              }}
              transition={{ duration: 0.5 }}
            >
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            </motion.div>
            <motion.h3
              className="font-display text-lg sm:text-xl font-semibold transition-colors gradient-text-animated"
              animate={{ 
                scale: isHovered ? 1.05 : 1,
              }}
            >
              {project.title}
            </motion.h3>
          </motion.div>

          <p className="text-muted-foreground text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed line-clamp-2 sm:line-clamp-3">
            {project.description}
          </p>

          {/* Tech Stack */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-5">
            {project.techStack.map((tech, techIndex) => (
              <motion.span
                key={tech}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ 
                  delay: index * 0.1 + techIndex * 0.05,
                  type: "spring",
                  stiffness: 200,
                }}
                whileHover={{ 
                  scale: 1.1, 
                  y: -2,
                  rotate: Math.random() * 4 - 2,
                }}
                className="text-xs px-2.5 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-primary/10 via-primary/15 to-primary/10 border border-primary/20 rounded-full text-primary font-medium cursor-default transition-all duration-300 hover:border-primary/40 hover:from-primary/20 hover:via-primary/25 hover:to-primary/20 hover:shadow-lg hover:shadow-primary/20"
              >
                {tech}
              </motion.span>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 sm:gap-3">
            <motion.div 
              className="flex-1" 
              whileHover={{ scale: 1.05, x: 2 }} 
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="hero"
                size="sm"
                asChild
                className="w-full relative overflow-hidden group/btn glow-on-hover btn-lift text-xs sm:text-sm"
              >
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 sm:gap-2"
                >
                  <motion.span
                    animate={isHovered ? { x: 3, rotate: -15 } : { x: 0, rotate: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 relative z-10" />
                  </motion.span>
                  <span className="relative z-10">Live Demo</span>
                  <motion.span
                    animate={isHovered ? { x: 3, opacity: 1 } : { x: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="relative z-10"
                  >
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </motion.span>
                </a>
              </Button>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.15, rotate: [0, -10, 10, -10, 0] }} 
              whileTap={{ scale: 0.9 }}
              transition={{ rotate: { duration: 0.5 } }}
            >
              <Button 
                variant="outline" 
                size="sm" 
                asChild 
                className="border-glow px-3 sm:px-4"
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
          </div>
        </div>
      </motion.div>
      </motion.div>
    </motion.div>
  );
};

export const ProjectsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="section-padding relative overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
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
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl"
          animate={{
            x: [0, -40, 0],
            y: [0, -20, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.15)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.15)_1px,transparent_1px)] bg-[size:60px_60px] sm:bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_70%)] pointer-events-none" />

      <div className="container mx-auto container-padding relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, type: "spring" }}
          className="text-center mb-10 sm:mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-primary text-sm font-medium uppercase tracking-wider inline-block mb-2"
          >
            Projects
          </motion.span>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mt-3 sm:mt-4"
          >
            Featured <span className="gradient-text-animated">Work</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-muted-foreground mt-3 sm:mt-4 max-w-2xl mx-auto text-sm sm:text-base px-4"
          >
            A selection of projects that showcase my skills and passion for web
            development
          </motion.p>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
          {projects.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};
