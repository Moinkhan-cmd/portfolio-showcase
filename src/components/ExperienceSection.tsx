import { useEffect, useRef, useState } from "react";
import { Briefcase, Calendar } from "lucide-react";

const experiences = [
  {
    title: "Web Development Intern",
    company: "Remote Position",
    duration: "Month Year – Month Year",
    responsibilities: [
      "Built and maintained responsive web interfaces using modern frontend technologies",
      "Collaborated with development team using Git for version control and code reviews",
      "Optimized UI components for better performance and user experience",
      "Debugged and resolved frontend issues to improve application stability",
    ],
    current: true,
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
      className="section-padding relative bg-secondary/30"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl translate-x-1/2" />
      </div>

      <div className="container mx-auto container-padding relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-16 ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}>
          <span className="text-primary text-sm font-medium uppercase tracking-wider">Experience</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mt-4">
            Work <span className="gradient-text">Journey</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            My professional experience and learning journey in web development
          </p>
        </div>

        {/* Timeline */}
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-1/2" />

            {experiences.map((exp, index) => (
              <div
                key={exp.title}
                className={`relative mb-12 last:mb-0 ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}
                style={{ animationDelay: `${0.1 + index * 0.1}s` }}
              >
                <div className={`flex flex-col md:flex-row items-start gap-6 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                  {/* Timeline Node */}
                  <div className="absolute left-0 md:left-1/2 w-4 h-4 -translate-x-1/2 md:-translate-x-1/2 top-8">
                    <div className={`w-4 h-4 rounded-full border-2 border-primary ${exp.current ? 'bg-primary animate-glow-pulse' : 'bg-background'}`} />
                  </div>

                  {/* Content Card */}
                  <div className={`md:w-[calc(50%-2rem)] ml-8 md:ml-0 ${index % 2 === 0 ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'}`}>
                    <div className="glass-card rounded-2xl p-6 hover-lift">
                      {/* Header */}
                      <div className="flex items-start gap-4 mb-4">
                        <div className="p-3 rounded-xl bg-primary/10 shrink-0">
                          <Briefcase className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-display text-lg font-semibold">{exp.title}</h3>
                          <p className="text-primary font-medium">{exp.company}</p>
                        </div>
                      </div>

                      {/* Duration */}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <Calendar className="w-4 h-4" />
                        <span>{exp.duration}</span>
                        {exp.current && (
                          <span className="px-2 py-0.5 bg-primary/20 text-primary text-xs rounded-full ml-2">
                            Current
                          </span>
                        )}
                      </div>

                      {/* Responsibilities */}
                      <ul className="space-y-2">
                        {exp.responsibilities.map((resp, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                            <span>{resp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
