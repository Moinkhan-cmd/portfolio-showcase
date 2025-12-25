import { useEffect, useRef, useState } from "react";
import { Code2, Database, Users, Wrench, Code } from "lucide-react";

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
      className="section-padding relative bg-secondary/30"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.2)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.2)_1px,transparent_1px)] bg-[size:80px_80px]" />

      <div className="container mx-auto container-padding relative z-10">
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
            <div
              key={category.title}
              className={`glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6 hover-lift ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}
              style={{ animationDelay: `${0.1 + categoryIndex * 0.1}s` }}
            >
              {/* Category Header */}
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-primary/10">
                  <category.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <h3 className="font-display text-lg sm:text-xl font-semibold">{category.title}</h3>
              </div>

              {/* Skills as Badges */}
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {category.skills.map((skill, skillIndex) => (
                  <span
                    key={skill.name}
                    className="px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm font-medium bg-primary/10 text-primary rounded-md sm:rounded-lg border border-primary/20 hover:bg-primary/20 hover:border-primary/40 transition-all duration-300 cursor-default"
                    style={{
                      animationDelay: `${0.2 + categoryIndex * 0.1 + skillIndex * 0.05}s`,
                    }}
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
