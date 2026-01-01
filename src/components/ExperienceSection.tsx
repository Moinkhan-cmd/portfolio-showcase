import { useEffect, useRef, useState } from "react";
import { Briefcase, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { ExperienceBackground3D } from "./ExperienceBackground3D";

const experiences = [
  {
    title: "Web Development Intern",
    company: "Remote Position",
    duration: "July 2025 – September 2025",
    responsibilities: [
      "Built and maintained responsive web interfaces using modern frontend technologies",
      "Collaborated with development team using Git for version control and code reviews",
      "Optimized UI components for better performance and user experience",
      "Debugged and resolved frontend issues to improve application stability",
    ],
    current: false,
  },
];

export const ExperienceSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="section-padding relative bg-secondary/30 overflow-hidden"
    >
      <ExperienceBackground3D />
      
      {/* Overlay for text contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/65 to-background/50 pointer-events-none z-10" />
      <div className="absolute inset-0 pointer-events-none z-10" 
           style={{
             background: 'radial-gradient(ellipse at center, transparent 0%, hsl(222 47% 6% / 0.2) 50%, hsl(222 47% 6% / 0.5) 100%)'
           }} 
      />
      
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden opacity-30 z-10">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl translate-x-1/2" />
      </div>

      <div className="container mx-auto container-padding relative z-20">
        {/* Section Header */}
        <div className={`text-center mb-10 sm:mb-16 ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}>
          <span className="text-primary text-sm font-medium uppercase tracking-wider">Experience</span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mt-3 sm:mt-4">
            Work <span className="gradient-text">Journey</span>
          </h2>
          <p className="text-muted-foreground mt-3 sm:mt-4 max-w-2xl mx-auto text-sm sm:text-base px-4">
            My professional experience and learning journey in web development
          </p>
        </div>

        {/* Timeline - Simplified for mobile */}
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            {/* Timeline Line - Left aligned on mobile */}
            <div className="absolute left-2 sm:left-0 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-1/2" />

            {experiences.map((exp, index) => (
              <motion.div
                key={exp.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
                className="relative mb-8 sm:mb-12 last:mb-0"
              >
                <div className={`flex flex-col md:flex-row items-start gap-4 sm:gap-6 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                  {/* Timeline Node */}
                  <motion.div 
                    className="absolute left-2 sm:left-0 md:left-1/2 w-3 h-3 sm:w-4 sm:h-4 -translate-x-1/2 md:-translate-x-1/2 top-6 sm:top-8 z-10"
                    initial={{ scale: 0 }}
                    animate={isVisible ? { scale: 1 } : {}}
                    transition={{ duration: 0.4, delay: 0.2 + index * 0.1, type: "spring" }}
                    whileHover={{ scale: 1.5 }}
                  >
                    <motion.div 
                      className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-primary ${exp.current ? 'bg-primary' : 'bg-background'}`}
                      animate={exp.current ? {
                        boxShadow: [
                          "0 0 0px hsl(175 80% 50% / 0)",
                          "0 0 20px hsl(175 80% 50% / 0.6)",
                          "0 0 0px hsl(175 80% 50% / 0)"
                        ]
                      } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </motion.div>

                  {/* Content Card */}
                  <motion.div 
                    className={`md:w-[calc(50%-2rem)] ml-8 sm:ml-8 md:ml-0 ${index % 2 === 0 ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'}`}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    animate={isVisible ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                  >
                    <div className="glass-enhanced rounded-xl sm:rounded-2xl p-4 sm:p-6 card-hover">
                      {/* Header */}
                      <motion.div 
                        className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4"
                        whileHover={{ x: 5 }}
                      >
                        <motion.div 
                          className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-primary/10 shrink-0"
                          whileHover={{ rotate: 360, scale: 1.1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                        </motion.div>
                        <div>
                          <h3 className="font-display text-base sm:text-lg font-semibold">{exp.title}</h3>
                          <p className="text-primary font-medium text-sm sm:text-base">{exp.company}</p>
                        </div>
                      </motion.div>

                      {/* Duration */}
                      <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                        <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span>{exp.duration}</span>
                        {exp.current && (
                          <span className="px-2 py-0.5 bg-primary/20 text-primary text-xs rounded-full">
                            Current
                          </span>
                        )}
                      </div>

                      {/* Responsibilities */}
                      <ul className="space-y-1.5 sm:space-y-2">
                        {exp.responsibilities.map((resp, i) => (
                          <motion.li 
                            key={i} 
                            className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground"
                            initial={{ opacity: 0, x: -10 }}
                            animate={isVisible ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.4, delay: 0.3 + index * 0.1 + i * 0.05 }}
                            whileHover={{ x: 5, color: "hsl(var(--foreground))" }}
                          >
                            <motion.span 
                              className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-primary mt-1.5 sm:mt-2 shrink-0"
                              whileHover={{ scale: 1.5 }}
                            />
                            <span>{resp}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
