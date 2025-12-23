import { useEffect, useRef, useState } from "react";

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
      <div className="container mx-auto container-padding">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className={`text-center mb-16 ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}>
            <span className="text-primary text-sm font-medium uppercase tracking-wider">About Me</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mt-4">
              Get to Know <span className="gradient-text">Me</span>
            </h2>
          </div>

          {/* Content */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Image/Avatar Placeholder */}
            <div 
              className={`${isVisible ? 'animate-slide-up' : 'opacity-0'}`}
              style={{ animationDelay: '0.2s' }}
            >
              <div className="relative">
                <div className="aspect-square rounded-2xl glass-card overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <span className="text-6xl">👨‍💻</span>
                  </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl" />
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
              </div>
            </div>

            {/* Text Content */}
            <div 
              className={`${isVisible ? 'animate-slide-up' : 'opacity-0'}`}
              style={{ animationDelay: '0.3s' }}
            >
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Write a short introduction about yourself here. Mention your background, 
                interests, and what kind of roles you are looking for.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                I'm passionate about creating seamless digital experiences that combine 
                beautiful design with clean, efficient code. Currently exploring 
                opportunities where I can grow and contribute to meaningful projects.
              </p>

              {/* Tech Stack */}
              <div>
                <h3 className="font-display text-lg font-semibold mb-4">Tech Stack</h3>
                <div className="flex flex-wrap gap-3">
                  {techStack.map((tech, index) => (
                    <span
                      key={tech}
                      className="px-4 py-2 glass-card rounded-full text-sm font-medium hover:bg-primary/20 transition-all duration-300 cursor-default"
                      style={{ animationDelay: `${0.4 + index * 0.05}s` }}
                    >
                      {tech}
                    </span>
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
