import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { AboutBackground3D } from "./AboutBackground3D";

const techStack = [
  "HTML",
  "CSS",
  "JavaScript",
  "React",
  "TypeScript",
  "Tailwind CSS",
  "Git",
  "Figma",
];

export const AboutSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      id="about" 
      ref={sectionRef}
      className="section-padding relative"
    >
      <AboutBackground3D />
      <div className="container mx-auto container-padding">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className={`text-center mb-10 sm:mb-16 ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}>
            <span className="text-primary text-sm font-medium uppercase tracking-wider">About Me</span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mt-3 sm:mt-4">
              Get to Know <span className="gradient-text">Me</span>
            </h2>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center">
            {/* Image/Avatar Placeholder */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.div 
                className="relative"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <div className="aspect-square rounded-2xl glass-enhanced overflow-hidden card-hover">
                  <motion.div 
                    className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center"
                    animate={{ 
                      background: [
                        "linear-gradient(135deg, hsl(175 80% 50% / 0.2) 0%, hsl(175 80% 50% / 0.05) 100%)",
                        "linear-gradient(135deg, hsl(200 90% 60% / 0.2) 0%, hsl(175 80% 50% / 0.05) 100%)",
                        "linear-gradient(135deg, hsl(175 80% 50% / 0.2) 0%, hsl(175 80% 50% / 0.05) 100%)"
                      ]
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <motion.span 
                      className="text-6xl"
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    >
                      👨‍💻
                    </motion.span>
                  </motion.div>
                </div>
                {/* Decorative elements */}
                <motion.div 
                  className="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <motion.div 
                  className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary/10 rounded-full blur-2xl"
                  animate={{ 
                    scale: [1, 1.3, 1],
                    opacity: [0.2, 0.4, 0.2]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
              </motion.div>
            </motion.div>

            {/* Text Content */}
            <div 
              className={`${isVisible ? 'animate-slide-up' : 'opacity-0'}`}
              style={{ animationDelay: '0.3s' }}
            >
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-4 sm:mb-6">
               I’m a passionate front-end web developer with a strong interest in building seamless digital experiences that blend modern design with clean, efficient 
               code. I enjoy turning ideas into responsive, user-friendly interfaces using HTML, CSS, JavaScript, React and modern tools.
              </p>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-6 sm:mb-8">
                I’m continuously learning and improving my skills while working on real-world projects that focus on performance, accessibility, and visual appeal. Currently, I’m looking for opportunities
                 where I can grow as a developer, collaborate with creative teams, and contribute to meaningful, impactful products.
              </p>

              {/* Tech Stack */}
              <div>
                <h3 className="font-display text-base sm:text-lg font-semibold mb-3 sm:mb-4">Tech Stack</h3>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {techStack.map((tech, index) => (
                    <motion.span
                      key={tech}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                      transition={{ duration: 0.4, delay: 0.4 + index * 0.05, type: "spring" }}
                      whileHover={{ scale: 1.1, y: -3 }}
                      className="px-3 py-1.5 sm:px-4 sm:py-2 glass-card rounded-full text-xs sm:text-sm font-medium hover:bg-primary/20 transition-all duration-300 cursor-default magnetic-hover"
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
