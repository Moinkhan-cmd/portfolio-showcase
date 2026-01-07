import { useEffect, useRef, useState, useMemo } from "react";
import { Code2, Database, Users, Wrench, Code, Loader2, Search, TrendingUp, Star, Sparkles, Filter, X, Zap, Award, Target, Layers, Cpu, Globe, Rocket } from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import { SkillsBackground3D } from "./SkillsBackground3D";
import { useSkills } from "@/hooks/useSkills";
import type { Skill } from "@/lib/admin/skills";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  frontend_development: Globe,
  backend_database: Database,
  programming_languages: Cpu,
  tools_platform: Layers,
  soft_skills: Users,
};

const categoryColors: Record<SkillCategory, { 
  gradient: string; 
  border: string; 
  glow: string; 
  shadow: string;
  accent: string;
  bg: string;
  iconBg: string;
}> = {
  frontend_development: { 
    gradient: "from-cyan-500/30 via-blue-500/20 to-indigo-500/30", 
    border: "border-cyan-500/40",
    glow: "group-hover:shadow-cyan-500/30",
    shadow: "hover:shadow-cyan-500/25",
    accent: "text-cyan-400",
    bg: "bg-cyan-500/10",
    iconBg: "from-cyan-500 to-blue-500"
  },
  backend_database: { 
    gradient: "from-purple-500/30 via-violet-500/20 to-fuchsia-500/30", 
    border: "border-purple-500/40",
    glow: "group-hover:shadow-purple-500/30",
    shadow: "hover:shadow-purple-500/25",
    accent: "text-purple-400",
    bg: "bg-purple-500/10",
    iconBg: "from-purple-500 to-fuchsia-500"
  },
  programming_languages: { 
    gradient: "from-emerald-500/30 via-green-500/20 to-teal-500/30", 
    border: "border-emerald-500/40",
    glow: "group-hover:shadow-emerald-500/30",
    shadow: "hover:shadow-emerald-500/25",
    accent: "text-emerald-400",
    bg: "bg-emerald-500/10",
    iconBg: "from-emerald-500 to-teal-500"
  },
  tools_platform: { 
    gradient: "from-orange-500/30 via-amber-500/20 to-yellow-500/30", 
    border: "border-orange-500/40",
    glow: "group-hover:shadow-orange-500/30",
    shadow: "hover:shadow-orange-500/25",
    accent: "text-orange-400",
    bg: "bg-orange-500/10",
    iconBg: "from-orange-500 to-amber-500"
  },
  soft_skills: { 
    gradient: "from-pink-500/30 via-rose-500/20 to-red-500/30", 
    border: "border-pink-500/40",
    glow: "group-hover:shadow-pink-500/30",
    shadow: "hover:shadow-pink-500/25",
    accent: "text-pink-400",
    bg: "bg-pink-500/10",
    iconBg: "from-pink-500 to-rose-500"
  },
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

// 3D Card Tilt Effect Component
const Card3DTilt = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseYSpring = useSpring(y, { stiffness: 500, damping: 100 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);

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
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// --- ENHANCED ANIMATED CARD COMPONENT ---
interface SkillCardProps {
  title: string;
  icon: typeof Code2;
  skills: Skill[];
  index: number;
  category: SkillCategory;
}

const SkillCard = ({ title, icon: Icon, skills, index, category }: SkillCardProps) => {
  const colors = categoryColors[category];
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.7, 
        delay: index * 0.12, 
        ease: [0.25, 0.1, 0.25, 1] 
      }}
      className={cn("group relative perspective-1000", colors.glow)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card3DTilt className="h-full">
        {/* Outer Glow Effect */}
        <motion.div
          className={cn(
            "absolute -inset-1 rounded-3xl opacity-0 blur-xl transition-opacity duration-500",
            "bg-gradient-to-br", colors.gradient
          )}
          animate={{ opacity: isHovered ? 0.6 : 0 }}
        />

        {/* Card Container */}
        <motion.div
          className={cn(
            "relative h-full rounded-2xl p-6 overflow-hidden",
            "bg-gradient-to-br from-card/95 via-card/90 to-card/80",
            "backdrop-blur-2xl border-2",
            colors.border,
            "shadow-2xl",
            "transition-all duration-500"
          )}
          style={{ transform: "translateZ(50px)" }}
          whileHover={{ 
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          }}
        >
          {/* Animated Gradient Background */}
          <motion.div 
            className={cn(
              "absolute inset-0 rounded-2xl",
              "bg-gradient-to-br", colors.gradient,
            )}
            initial={{ opacity: 0.3 }}
            whileHover={{ opacity: 0.6 }}
            transition={{ duration: 0.5 }}
          />

          {/* Mesh Gradient Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent opacity-50" />

          {/* Animated Particles */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className={cn("absolute w-1 h-1 rounded-full", colors.accent)}
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${30 + (i % 3) * 20}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.3, 0.8, 0.3],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 3 + i * 0.5,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          {/* Shine sweep effect */}
          <motion.div 
            className="absolute inset-0 rounded-2xl overflow-hidden"
            initial="initial"
            whileHover="hover"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
              variants={{
                initial: { x: "-150%", opacity: 0 },
                hover: { x: "150%", opacity: 1 }
              }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
          </motion.div>

          {/* Corner Decorations */}
          <div className={cn("absolute top-0 right-0 w-20 h-20 opacity-20", colors.bg)}>
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-current to-transparent rounded-bl-full" />
          </div>

          {/* Header with 3D Icon */}
          <div className="flex items-center gap-4 mb-6 relative z-10" style={{ transform: "translateZ(30px)" }}>
            <motion.div
              className={cn(
                "relative p-4 rounded-2xl",
                "bg-gradient-to-br", colors.iconBg,
                "shadow-lg"
              )}
              whileHover={{ 
                scale: 1.15, 
                rotate: 10,
                transition: { type: "spring", stiffness: 400, damping: 15 }
              }}
            >
              {/* Icon Glow */}
              <motion.div
                className="absolute inset-0 rounded-2xl blur-md"
                style={{ background: `linear-gradient(to bottom right, ${colors.iconBg})` }}
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <Icon className="w-7 h-7 text-white relative z-10" />
            </motion.div>
            <div className="flex-1 min-w-0">
              <h3 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
                {title}
                <motion.span
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Sparkles className={cn("w-4 h-4", colors.accent)} />
                </motion.span>
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <motion.span 
                  className={cn("inline-block w-2 h-2 rounded-full", colors.bg)}
                  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
                <p className="text-sm text-muted-foreground">
                  {skills.length} skills mastered
                </p>
              </div>
            </div>
          </div>

          {/* Skills Grid with Enhanced Badges */}
          <div className="flex flex-wrap gap-2.5 relative z-10" style={{ transform: "translateZ(20px)" }}>
            {skills.map((skill, i) => (
              <SkillBadge key={skill.id || i} skill={skill} index={i} category={category} />
            ))}
          </div>

          {/* Bottom Progress Line */}
          <motion.div 
            className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden"
          >
            <motion.div
              className={cn("h-full bg-gradient-to-r", colors.iconBg)}
              initial={{ scaleX: 0, originX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: index * 0.1 + 0.5, ease: "easeOut" }}
            />
          </motion.div>
        </motion.div>
      </Card3DTilt>
    </motion.div>
  );
};

// --- ENHANCED SKILL BADGE ---
const SkillBadge = ({ skill, index, category }: { skill: Skill; index: number; category: SkillCategory }) => {
  const colors = categoryColors[category];
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.5, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        delay: 0.15 + index * 0.04, 
        duration: 0.5,
        type: "spring",
        stiffness: 300,
        damping: 20
      }}
      whileHover={{ 
        scale: 1.1, 
        y: -5,
        transition: { type: "spring", stiffness: 500, damping: 15 }
      }}
      whileTap={{ scale: 0.95 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold cursor-default",
        "bg-gradient-to-br from-background/80 to-background/60",
        "border-2 border-white/10",
        colors.shadow,
        "shadow-lg hover:shadow-xl",
        "transition-all duration-300",
        "backdrop-blur-sm"
      )}
    >
      {/* Animated Background */}
      <motion.div
        className={cn(
          "absolute inset-0 rounded-xl -z-10",
          "bg-gradient-to-br", colors.gradient
        )}
        initial={{ opacity: 0.3 }}
        animate={{ opacity: isHovered ? 0.7 : 0.3 }}
        transition={{ duration: 0.3 }}
      />

      {/* Glow Effect */}
      <motion.div
        className={cn(
          "absolute inset-0 rounded-xl -z-20 blur-md",
          "bg-gradient-to-br", colors.gradient
        )}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: isHovered ? 0.5 : 0, scale: isHovered ? 1.1 : 0.8 }}
        transition={{ duration: 0.3 }}
      />

      {/* Skill Name */}
      <span className="relative z-10 text-foreground/90 group-hover:text-foreground">
        {skill.name}
      </span>
      
      {/* Animated Star */}
      <motion.span
        initial={{ opacity: 0, scale: 0, rotate: -180 }}
        animate={{ 
          opacity: isHovered ? 1 : 0, 
          scale: isHovered ? 1 : 0, 
          rotate: isHovered ? 0 : -180 
        }}
        transition={{ type: "spring", stiffness: 500, damping: 15 }}
      >
        <Star className={cn("w-3.5 h-3.5 fill-current", colors.accent)} />
      </motion.span>
    </motion.span>
  );
};

// --- ANIMATED STATS CARD ---
const StatCard = ({ label, value, icon: Icon, gradient, delay }: { 
  label: string; 
  value: number; 
  icon: typeof Code2; 
  gradient: string;
  delay: number;
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;
      const interval = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(interval);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);
      return () => clearInterval(interval);
    }, delay * 1000);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 30 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={{ 
        scale: 1.05, 
        y: -8,
        transition: { type: "spring", stiffness: 400, damping: 17 }
      }}
      className="relative group"
    >
      {/* Outer Glow */}
      <motion.div
        className={cn(
          "absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-50 blur-xl transition-opacity duration-500",
          "bg-gradient-to-br", gradient
        )}
      />
      
      <div className={cn(
        "relative p-6 rounded-2xl border-2 border-primary/20 backdrop-blur-xl cursor-default overflow-hidden",
        "bg-gradient-to-br from-card/90 to-card/70",
        "shadow-xl hover:shadow-2xl transition-shadow duration-300"
      )}>
        {/* Background Gradient */}
        <div className={cn("absolute inset-0 opacity-30 bg-gradient-to-br", gradient)} />
        
        {/* Animated Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0.1)_1px,_transparent_1px)] bg-[length:20px_20px]" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <motion.div
              className={cn("p-3 rounded-xl bg-gradient-to-br", gradient)}
              whileHover={{ rotate: 10, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Icon className="w-6 h-6 text-white" />
            </motion.div>
            <motion.span 
              className="text-4xl font-bold text-foreground tabular-nums"
              key={count}
            >
              {count}
            </motion.span>
          </div>
          <p className="text-sm text-muted-foreground font-medium">{label}</p>
        </div>
      </div>
    </motion.div>
  );
};

// --- MAIN SECTION ---
export const SkillsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory | "all">("all");
  const sectionRef = useRef<HTMLElement>(null);
  const { data: skills = [], isLoading } = useSkills();

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
      category: category as SkillCategory,
      title: CATEGORY_LABELS[category as SkillCategory] || "Tools & Platform",
      icon: categoryIcons[category as SkillCategory] || Wrench,
      skills: categorySkills,
    }));
  }, [skills]);

  const filteredCategories = useMemo(() => {
    return skillCategories
      .filter((cat) => {
        if (selectedCategory !== "all" && cat.category !== selectedCategory) return false;
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
          cat.title.toLowerCase().includes(query) ||
          cat.skills.some((skill) => skill.name.toLowerCase().includes(query))
        );
      })
      .map((cat) => ({
        ...cat,
        skills: searchQuery
          ? cat.skills.filter((skill) => skill.name.toLowerCase().includes(searchQuery.toLowerCase()))
          : cat.skills,
      }))
      .filter((cat) => cat.skills.length > 0);
  }, [skillCategories, searchQuery, selectedCategory]);

  const stats = useMemo(() => {
    const totalSkills = skills.length;
    const totalCategories = skillCategories.length;
    const avgSkillsPerCategory = totalCategories > 0 ? Math.round(totalSkills / totalCategories) : 0;
    return { totalSkills, totalCategories, avgSkillsPerCategory };
  }, [skills, skillCategories]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="section-padding relative overflow-hidden bg-gradient-to-b from-background via-secondary/5 to-background min-h-screen"
    >
      <SkillsBackground3D />

      {/* Enhanced Multi-Layer Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/80 to-background/70 pointer-events-none z-10" />
      
      {/* Animated Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        <motion.div 
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[100px]"
          animate={{ 
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px]"
          animate={{ 
            x: [0, -40, 0],
            y: [0, -20, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-1/4 left-1/2 w-[400px] h-[400px] bg-pink-500/8 rounded-full blur-[80px]"
          animate={{ 
            x: [0, -30, 0],
            y: [0, 40, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Enhanced Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.06)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.06)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)] pointer-events-none z-10" />

      {/* Floating Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 rounded-full bg-primary/20"
            style={{
              left: `${10 + i * 20}%`,
              top: `${20 + (i % 3) * 30}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 5 + i,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto container-padding relative z-20">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16 sm:mb-20"
        >
          {/* Animated Decorative Lines */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <motion.div
              initial={{ scaleX: 0, originX: 1 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2 }}
              className="w-24 h-px bg-gradient-to-r from-transparent to-primary"
            />
            <motion.div
              initial={{ scale: 0, rotate: 180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4, type: "spring" }}
            >
              <Rocket className="w-6 h-6 text-primary" />
            </motion.div>
            <motion.div
              initial={{ scaleX: 0, originX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2 }}
              className="w-24 h-px bg-gradient-to-l from-transparent to-primary"
            />
          </div>

          <motion.span
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="inline-flex items-center gap-3 text-primary text-sm font-semibold uppercase tracking-widest mb-6 px-6 py-2.5 rounded-full bg-primary/10 border border-primary/30 backdrop-blur-sm shadow-lg shadow-primary/10"
          >
            <motion.span
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              <Zap className="w-4 h-4" />
            </motion.span>
            Technical Arsenal
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-4 h-4" />
            </motion.span>
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="font-display text-5xl sm:text-6xl md:text-7xl font-bold mt-6"
          >
            <span className="text-foreground">My </span>
            <span className="relative">
              <span className="bg-gradient-to-r from-cyan-400 via-primary to-purple-500 bg-clip-text text-transparent">
                Expertise
              </span>
              <motion.span
                className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-primary to-purple-500 rounded-full"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.6 }}
              />
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-muted-foreground mt-6 sm:mt-8 max-w-2xl mx-auto text-lg sm:text-xl px-4 leading-relaxed"
          >
            A comprehensive collection of technologies, tools, and methodologies I've mastered throughout my journey
          </motion.p>
        </motion.div>

        {/* Enhanced Statistics Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto"
        >
          <StatCard 
            label="Total Skills" 
            value={stats.totalSkills} 
            icon={Target} 
            gradient="from-cyan-500 to-blue-500"
            delay={0.5}
          />
          <StatCard 
            label="Categories" 
            value={stats.totalCategories} 
            icon={Layers} 
            gradient="from-purple-500 to-pink-500"
            delay={0.6}
          />
          <StatCard 
            label="Avg per Category" 
            value={stats.avgSkillsPerCategory} 
            icon={Award} 
            gradient="from-emerald-500 to-teal-500"
            delay={0.7}
          />
        </motion.div>

        {/* Enhanced Search and Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-12 max-w-5xl mx-auto"
        >
          <div className="relative p-1 rounded-2xl bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20">
            <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl bg-card/90 backdrop-blur-xl">
              {/* Search Input */}
              <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  type="text"
                  placeholder="Search skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-12 py-6 text-base bg-background/50 border-2 border-primary/20 focus:border-primary/50 backdrop-blur-sm transition-all duration-300 rounded-xl"
                />
                <AnimatePresence>
                  {searchQuery && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      onClick={() => setSearchQuery("")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-muted hover:bg-muted-foreground/20 text-muted-foreground hover:text-foreground transition-all"
                    >
                      <X className="w-4 h-4" />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2 sm:flex-nowrap items-center">
                <Button
                  variant={selectedCategory === "all" ? "default" : "outline"}
                  size="lg"
                  onClick={() => setSelectedCategory("all")}
                  className={cn(
                    "gap-2 transition-all duration-300 rounded-xl",
                    selectedCategory === "all" && "shadow-lg shadow-primary/25"
                  )}
                >
                  <Filter className="w-4 h-4" />
                  All
                </Button>
                {categoryOrder.map((category) => {
                  const categoryData = skillCategories.find((c) => c.category === category);
                  if (!categoryData) return null;
                  const colors = categoryColors[category];
                  return (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="lg"
                      onClick={() => setSelectedCategory(category)}
                      className={cn(
                        "gap-2 transition-all duration-300 rounded-xl",
                        selectedCategory === category && cn("shadow-lg", colors.shadow)
                      )}
                    >
                      <span className="font-bold">{categoryData.skills.length}</span>
                      <span className="hidden lg:inline">{CATEGORY_LABELS[category].split(" ")[0]}</span>
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Cards Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[500px]">
            <motion.div
              className="relative"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full" />
              <Loader2 className="absolute inset-0 m-auto w-10 h-10 text-primary animate-pulse" />
            </motion.div>
          </div>
        ) : filteredCategories.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-10 max-w-7xl mx-auto"
            layout
          >
            <AnimatePresence mode="popLayout">
              {filteredCategories.map((category, index) => (
                <SkillCard
                  key={category.title}
                  title={category.title}
                  icon={category.icon}
                  skills={category.skills}
                  index={index}
                  category={category.category}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-center py-24 px-8 rounded-3xl border-2 border-dashed border-primary/20 bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-xl max-w-lg mx-auto"
          >
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Code className="w-16 h-16 text-primary/40 mx-auto mb-6" />
            </motion.div>
            <p className="text-xl text-muted-foreground font-semibold">No skills found</p>
            <p className="text-sm text-muted-foreground/60 mt-3">
              {searchQuery ? "Try a different search term" : "Check back soon for updates!"}
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};
