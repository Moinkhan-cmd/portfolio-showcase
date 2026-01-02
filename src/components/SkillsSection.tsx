import { useEffect, useRef, useState, useMemo } from "react";
import { Code2, Database, Users, Wrench, Code, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { SkillsBackground3D } from "./SkillsBackground3D";
import { useSkills } from "@/hooks/useSkills";
import type { Skill } from "@/lib/admin/skills";

// Category enum system (matches admin panel)
type SkillCategory = 
  | "frontend_development"
  | "backend_database"
  | "programming_languages"
  | "tools_platform"
  | "soft_skills";

// Category display labels mapping
const CATEGORY_LABELS: Record<SkillCategory, string> = {
  frontend_development: "Frontend Development",
  backend_database: "Backend & Database",
  programming_languages: "Programming Languages",
  tools_platform: "Tools & Platform",
  soft_skills: "Soft Skills",
};

// Icon mapping for categories (using enum keys)
const categoryIcons: Record<SkillCategory, typeof Code2> = {
  frontend_development: Code2,
  backend_database: Database,
  programming_languages: Code,
  tools_platform: Wrench,
  soft_skills: Users,
};

// Normalize category to enum - handles both old strings and enum values
const normalizeCategory = (category: unknown): SkillCategory => {
  if (typeof category !== "string") return "tools_platform";
  const trimmed = category.trim().toLowerCase();
  if (!trimmed) return "tools_platform";

  // Migration: map old category strings to new enum values
  const migrationMap: Record<string, SkillCategory> = {
    "frontend development": "frontend_development",
    "backend & database": "backend_database",
    "backend and database": "backend_database",
    "programming languages": "programming_languages",
    "tools & platform": "tools_platform",
    "tools and platform": "tools_platform",
    "tools & platforms": "tools_platform",
    "tools and platforms": "tools_platform",
    "soft skills": "soft_skills",
  };

  // Check migration map first
  if (migrationMap[trimmed]) {
    return migrationMap[trimmed];
  }

  // Check if already in enum format
  const enumValues: SkillCategory[] = [
    "frontend_development",
    "backend_database",
    "programming_languages",
    "tools_platform",
    "soft_skills",
  ];
  if (enumValues.includes(trimmed as SkillCategory)) {
    return trimmed as SkillCategory;
  }

  // Default fallback
  return "tools_platform";
};

export const SkillsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const { data: skills = [], isLoading } = useSkills();

  // Category display order (using enum values)
  const categoryOrder: SkillCategory[] = [
    "frontend_development",
    "backend_database",
    "programming_languages",
    "tools_platform",
    "soft_skills",
  ];

  // Group skills by category (normalized to enum)
  const skillCategories = useMemo(() => {
    const grouped = skills.reduce((acc, skill) => {
      if (!skill?.id) return acc;
      const category = normalizeCategory(skill.category);
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(skill);
      return acc;
    }, {} as Record<SkillCategory, Skill[]>);

    // Sort categories according to defined order
    const sortedEntries = Object.entries(grouped).sort((a, b) => {
      const indexA = categoryOrder.indexOf(a[0] as SkillCategory);
      const indexB = categoryOrder.indexOf(b[0] as SkillCategory);
      if (indexA === -1 && indexB === -1) return a[0].localeCompare(b[0]);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });

    return sortedEntries.map(([category, categorySkills]) => ({
      title: CATEGORY_LABELS[category as SkillCategory] || "Tools & Platform",
      icon: categoryIcons[category as SkillCategory] || Wrench,
      skills: categorySkills,
    }));
  }, [skills]);

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
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : skillCategories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
            {skillCategories.map((category, categoryIndex) => {
              const IconComponent = category.icon;
              return (
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
                      <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </motion.div>
                <h3 className="font-display text-lg sm:text-xl font-semibold">{category.title}</h3>
              </motion.div>

              {/* Skills as Badges */}
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {category.skills.map((skill, skillIndex) => (
                  <motion.span
                    key={skill.id}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                    transition={{ 
                      duration: 0.3, 
                      delay: 0.2 + categoryIndex * 0.1 + skillIndex * 0.05,
                      type: "spring"
                    }}
                    whileHover={{ scale: 1.15, y: -3, rotate: 2 }}
                    className="px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm font-medium bg-primary/10 text-primary rounded-md sm:rounded-lg border border-primary/20 hover:bg-primary/20 hover:border-primary/40 transition-all duration-300 cursor-default magnetic-hover min-w-0 break-words max-w-full"
                  >
                    {skill.icon && <span className="mr-1">{skill.icon}</span>}
                    <span className="break-words">{skill.name}</span>
                  </motion.span>
                ))}
              </div>
            </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No skills available yet.</p>
        </div>
        )}
      </div>
    </section>
  );
};
