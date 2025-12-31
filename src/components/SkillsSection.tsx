import { useEffect, useRef, useState } from "react";
import { Code2, Database, Users, Wrench, Code } from "lucide-react";
import { motion } from "framer-motion";
import { SkillsBackground3D } from "./SkillsBackground3D";

const skillCategories = [
  {
    title: "Frontend Development",
    icon: Code2,
    skills: [
      { name: "HTML5 & CSS3" },
      { name: "JavaScript" },
      { name: "React.js" },
      { name: "Tailwind CSS" },
      { name: "Responsive UI Design" },
    ],
  },
  {
    title: "Backend & Database",
    icon: Database,
    skills: [
      { name: "Node.js" },
      { name: "Express.js" },
      { name: "PHP" },
      { name: "MySQL" },
    ],
  },
  {
    title: "Programming Languages",
    icon: Code,
    skills: [
      { name: "JavaScript" },
      { name: "Java" },
      { name: "Python" },
      { name: "C / C++" },
    ],
  },
  {
    title: "Tools & Platforms",
    icon: Wrench,
    skills: [
      { name: "Git & GitHub" },
      { name: "VS Code" },
      { name: "XAMPP" },
    ],
  },
  {
    title: "Soft Skills",
    icon: Users,
    skills: [
      { name: "Team Collaboration" },
      { name: "Communication" },
      { name: "Problem Solving" },
      { name: "Time Management" },
    ],
  },
];

export const SkillsSection = () => {
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
      id="skills"
      ref={sectionRef}
      className="section-padding relative bg-secondary/30 overflow-hidden"
    >
      <SkillsBackground3D />
      
      {/* Overlay for text contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/65 to-background/50 pointer-events-none z-10" />
      <div className="absolute inset-0 pointer-events-none z-10" 
           style={{
             background: 'radial-gradient(ellipse at center, transparent 0%, hsl(222 47% 6% / 0.2) 50%, hsl(222 47% 6% / 0.5) 100%)'
           }} 
      />
      
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.2)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.2)_1px,transparent_1px)] bg-[size:80px_80px] opacity-30 z-10" />

      <div className="container mx-auto container-padding relative z-20">
        {/* Section Header */}
        <div className={`text-center mb-10 sm:mb-16 ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}>
          <span className="text-primary text-sm font-medium uppercase tracking-wider">Skills</span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mt-3 sm:mt-4">
            My <span className="gradient-text">Expertise</span>
          </h2>
          <p className="text-muted-foreground mt-3 sm:mt-4 max-w-2xl mx-auto text-sm sm:text-base px-4">
            A comprehensive overview of my technical skills and proficiencies
          </p>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + categoryIndex * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="glass-enhanced rounded-xl sm:rounded-2xl p-4 sm:p-6 card-hover"
            >
              {/* Category Header */}
              <motion.div 
                className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6"
                whileHover={{ x: 5 }}
              >
                <motion.div 
                  className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-primary/10"
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  <category.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </motion.div>
                <h3 className="font-display text-lg sm:text-xl font-semibold">{category.title}</h3>
              </motion.div>

              {/* Skills as Badges */}
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {category.skills.map((skill, skillIndex) => (
                  <motion.span
                    key={skill.name}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                    transition={{ 
                      duration: 0.3, 
                      delay: 0.2 + categoryIndex * 0.1 + skillIndex * 0.05,
                      type: "spring"
                    }}
                    whileHover={{ scale: 1.15, y: -3, rotate: 2 }}
                    className="px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm font-medium bg-primary/10 text-primary rounded-md sm:rounded-lg border border-primary/20 hover:bg-primary/20 hover:border-primary/40 transition-all duration-300 cursor-default magnetic-hover"
                  >
                    {skill.name}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
