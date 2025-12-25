import { useEffect, useRef, useState } from "react";
import { ExternalLink, Github, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import weatherAppImage from "@/images/weather-app.png";
import { useMotionPreferences } from "@/hooks/use-motion-preferences";

const projects = [
  {
    title: "Project Name Here",
    description:
      "Brief description of what this project does. Explain the problem it solves and key features.",
    techStack: ["React", "TypeScript", "Tailwind CSS"],
    liveUrl: "#",
    githubUrl: "#",
    image: null,
  },
  {
    title: "E-Commerce Dashboard",
    description:
      "A comprehensive admin dashboard for managing products, orders, and analytics with real-time updates.",
    techStack: ["JavaScript", "React", "Chart.js"],
    liveUrl: "#",
    githubUrl: "#",
    image: null,
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
  const { liteMotion } = useMotionPreferences();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-100, 100], [5, -5]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(mouseX, [-100, 100], [-5, 5]), {
    stiffness: 300,
    damping: 30,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (liteMotion) return;
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onMouseMove={liteMotion ? undefined : handleMouseMove}
      onMouseEnter={liteMotion ? undefined : () => setIsHovered(true)}
      onMouseLeave={liteMotion ? undefined : handleMouseLeave}
      style={
        liteMotion
          ? undefined
          : {
              rotateX: isHovered ? rotateX : 0,
              rotateY: isHovered ? rotateY : 0,
              transformStyle: "preserve-3d",
            }
      }
      className="group glass-card rounded-2xl overflow-hidden"
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
        <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 relative overflow-hidden">
          {project.image ? (
            <motion.img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.4 }}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{
                  rotate: isHovered ? 360 : 0,
                  scale: isHovered ? 1.1 : 1,
                }}
                transition={{ duration: 0.6 }}
              >
                <Folder className="w-16 h-16 text-primary/40" />
              </motion.div>
            </div>
          )}

          {/* Enhanced Hover Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-gradient-to-br from-background/90 to-background/80 backdrop-blur-sm flex items-center justify-center gap-4"
          >
            <motion.a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 glass-card rounded-full group/btn relative overflow-hidden"
              aria-label="Live Demo"
              initial={{ scale: 0, rotate: -180 }}
              animate={
                isHovered ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }
              }
              transition={{ duration: 0.4, delay: 0.1 }}
              whileHover={{ scale: 1.2, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              <motion.div
                className="absolute inset-0 bg-primary/30 rounded-full"
                initial={{ scale: 0 }}
                whileHover={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              />
              <ExternalLink className="w-6 h-6 relative z-10" />
            </motion.a>

            <motion.a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 glass-card rounded-full group/btn relative overflow-hidden"
              aria-label="GitHub"
              initial={{ scale: 0, rotate: 180 }}
              animate={isHovered ? { scale: 1, rotate: 0 } : { scale: 0, rotate: 180 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              whileHover={{ scale: 1.2, rotate: -5 }}
              whileTap={{ scale: 0.9 }}
            >
              <motion.div
                className="absolute inset-0 bg-primary/30 rounded-full"
                initial={{ scale: 0 }}
                whileHover={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              />
              <Github className="w-6 h-6 relative z-10" />
            </motion.a>
          </motion.div>

          {/* Animated corner accent */}
          <motion.div
            className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/30 to-transparent"
            initial={{ scale: 0, opacity: 0 }}
            animate={isHovered ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ borderTopRightRadius: "1rem" }}
          />
        </div>

        {/* Project Content */}
        <div className="p-6" style={liteMotion ? undefined : { transform: "translateZ(20px)" }}>
          <motion.h3
            className="font-display text-xl font-semibold mb-2 transition-colors"
            animate={{ color: isHovered ? "hsl(175 80% 50%)" : "hsl(210 40% 98%)" }}
          >
            {project.title}
          </motion.h3>

          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
            {project.description}
          </p>

          {/* Tech Stack with Enhanced Hover */}
          <div className="flex flex-wrap gap-2 mb-4">
            {project.techStack.map((tech, techIndex) => (
              <motion.span
                key={tech}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 + techIndex * 0.05 }}
                whileHover={{
                  scale: 1.1,
                  backgroundColor: "hsl(175 80% 50% / 0.2)",
                }}
                className="text-xs px-3 py-1 bg-secondary rounded-full text-muted-foreground cursor-default"
              >
                {tech}
              </motion.span>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="hero"
                size="sm"
                asChild
                className="w-full relative overflow-hidden group/btn"
              >
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2"
                >
                  <motion.span
                    className="absolute inset-0 bg-primary/20"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                  <ExternalLink className="w-4 h-4 relative z-10" />
                  <span className="relative z-10">Live Demo</span>
                </a>
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" size="sm" asChild>
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
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

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="section-padding relative"
    >
      <div className="container mx-auto container-padding">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-primary text-sm font-medium uppercase tracking-wider inline-block"
          >
            Projects
          </motion.span>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mt-3 sm:mt-4"
          >
            Featured <span className="gradient-text">Work</span>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto perspective-1000">
          {projects.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};
