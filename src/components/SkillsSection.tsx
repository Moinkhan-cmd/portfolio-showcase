import { useEffect, useRef, useState, useMemo } from "react";
import { Code2, Database, Users, Wrench, Code, Loader2 } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { SkillsBackground3D } from "./SkillsBackground3D";
import { useSkills } from "@/hooks/useSkills";
import type { Skill } from "@/lib/admin/skills";

// Category enum system
type SkillCategory =
  | "frontend_development"
  | "backend_database"
  | "programming_languages"
  | "tools_platform"
  | "soft_skills";

const CATEGORY_LABELS: Record<SkillCategory, string> = {
  frontend_development: "Frontend Development",
  backend_database: "Backend & Database",
  programming_languages: "Programming Languages",
  tools_platform: "Tools & Platform",
  soft_skills: "Soft Skills",
};

const categoryIcons: Record<SkillCategory, typeof Code2> = {
  frontend_development: Code2,
  backend_database: Database,
  programming_languages: Code,
  tools_platform: Wrench,
  soft_skills: Users,
};

const normalizeCategory = (category: unknown): SkillCategory => {
  if (typeof category !== "string") return "tools_platform";
  const trimmed = category.trim().toLowerCase();

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

  if (migrationMap[trimmed]) return migrationMap[trimmed];

  const enumValues: SkillCategory[] = [
    "frontend_development",
    "backend_database",
    "programming_languages",
    "tools_platform",
    "soft_skills",
  ];
  if (enumValues.includes(trimmed as SkillCategory)) return trimmed as SkillCategory;

  return "tools_platform";
};

// --- 3D CARD COMPONENT ---
interface Skill3DCardProps {
  title: string;
  icon: typeof Code2;
  skills: Skill[];
  index: number;
}

const Skill3DCard = ({ title, icon: Icon, skills, index }: Skill3DCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseYSpring = useSpring(y, { stiffness: 500, damping: 100 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

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
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="relative group perspective-1000"
    >
      {/* 3D Content Container */}
      <div
        className="relative bg-secondary/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 h-full shadow-2xl transition-all duration-300"
        style={{ transform: "translateZ(0px)" }} // Base layer
      >
        {/* Holographic Gradient Overlay */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Shine Refletion */}
        <motion.div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 pointer-events-none mix-blend-overlay"
          style={{
            background: useTransform(
              mouseXSpring,
              [-0.5, 0.5],
              ["linear-gradient(to right, transparent, rgba(255,255,255,0.2) 0%, transparent)", "linear-gradient(to right, transparent, rgba(255,255,255,0.2) 100%, transparent)"]
            )
          }}
        />

        {/* Floating Header */}
        <div style={{ transform: "translateZ(30px)" }} className="flex items-center gap-4 mb-6 relative z-10">
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 shadow-lg shadow-primary/10 group-hover:shadow-primary/30 transition-shadow duration-300">
            <Icon className="w-6 h-6 text-primary group-hover:text-white transition-colors duration-300" />
          </div>
          <h3 className="font-display text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70 group-hover:from-primary group-hover:to-purple-400 transition-all duration-300">
            {title}
          </h3>
        </div>

        {/* Magnetic Skills Grid */}
        <div style={{ transform: "translateZ(20px)" }} className="flex flex-wrap gap-2 relative z-10">
          {skills.map((skill, i) => (
            <SkillBadge key={skill.id || i} skill={skill} index={i} />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// --- MAGNETIC BADGE COMPONENT ---
const SkillBadge = ({ skill, index }: { skill: Skill; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 + index * 0.05, type: "spring" }}
      whileHover={{
        scale: 1.15,
        z: 30, // Lift up towards camera
        boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
      }}
      className="relative px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-primary/20 transition-colors cursor-default"
    >
      <span className="text-sm font-medium text-muted-foreground group-hover:text-white transition-colors">
        {skill.name}
      </span>
      {/* Glow on hover */}
      <div className="absolute inset-0 rounded-lg bg-primary/20 blur-md opacity-0 hover:opacity-100 transition-opacity" />
    </motion.div>
  );
};

// --- MAIN SECTION ---
export const SkillsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const { data: skills = [], isLoading } = useSkills();

  // Sort and Group Logic
  const categoryOrder: SkillCategory[] = [
    "frontend_development",
    "backend_database",
    "programming_languages",
    "tools_platform",
    "soft_skills",
  ];

  const skillCategories = useMemo(() => {
    const grouped = skills.reduce((acc, skill) => {
      if (!skill?.id) return acc;
      const category = normalizeCategory(skill.category);
      if (!acc[category]) acc[category] = [];
      acc[category].push(skill);
      return acc;
    }, {} as Record<SkillCategory, Skill[]>);

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
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="section-padding relative overflow-hidden perspective-2000" // Added global perspective
    >
      <SkillsBackground3D />

      {/* Deep Space Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background pointer-events-none -z-10" />

      {/* Animated Mesh Grid */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none" />

      <div className="container mx-auto container-padding relative z-10">

        {/* Floating 3D Header */}
        <motion.div
          initial={{ opacity: 0, y: -50, rotateX: 20 }}
          animate={isVisible ? { opacity: 1, y: 0, rotateX: 0 } : {}}
          transition={{ duration: 1, type: "spring", bounce: 0.5 }}
          className="text-center mb-16 sm:mb-24 relative"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="inline-block"
          >
            <span className="px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm font-semibold uppercase tracking-wider backdrop-blur-md shadow-[0_0_20px_rgba(45,212,191,0.3)]">
              Technical Arsenal
            </span>
          </motion.div>

          <h2 className="font-display text-5xl sm:text-7xl font-bold mt-6 tracking-tight">
            My <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500 drop-shadow-[0_0_30px_rgba(45,212,191,0.5)]">Expertise</span>
          </h2>
        </motion.div>

        {/* 3D Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
          </div>
        ) : skillCategories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
            {skillCategories.map((category, index) => (
              <Skill3DCard
                key={category.title}
                title={category.title}
                icon={category.icon}
                skills={category.skills}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-xl">Loading expertise matrix...</p>
          </div>
        )}
      </div>
    </section>
  );
};
