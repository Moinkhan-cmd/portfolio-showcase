import { useEffect, useRef, useState, useMemo } from "react";
import { Code2, Database, Users, Wrench, Code, Loader2, Search, TrendingUp, Star, Sparkles, Filter, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
  frontend_development: Code2,
  backend_database: Database,
  programming_languages: Code,
  tools_platform: Wrench,
  soft_skills: Users,
};

const categoryColors: Record<SkillCategory, { gradient: string; border: string; glow: string; shadow: string }> = {
  frontend_development: { 
    gradient: "from-blue-500/20 to-cyan-500/20", 
    border: "border-blue-500/30",
    glow: "group-hover:shadow-blue-500/25",
    shadow: "hover:shadow-blue-500/20"
  },
  backend_database: { 
    gradient: "from-purple-500/20 to-pink-500/20", 
    border: "border-purple-500/30",
    glow: "group-hover:shadow-purple-500/25",
    shadow: "hover:shadow-purple-500/20"
  },
  programming_languages: { 
    gradient: "from-green-500/20 to-emerald-500/20", 
    border: "border-green-500/30",
    glow: "group-hover:shadow-green-500/25",
    shadow: "hover:shadow-green-500/20"
  },
  tools_platform: { 
    gradient: "from-orange-500/20 to-red-500/20", 
    border: "border-orange-500/30",
    glow: "group-hover:shadow-orange-500/25",
    shadow: "hover:shadow-orange-500/20"
  },
  soft_skills: { 
    gradient: "from-yellow-500/20 to-amber-500/20", 
    border: "border-yellow-500/30",
    glow: "group-hover:shadow-yellow-500/25",
    shadow: "hover:shadow-yellow-500/20"
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

// --- SMOOTH ANIMATED CARD COMPONENT ---
interface SkillCardProps {
  title: string;
  icon: typeof Code2;
  skills: Skill[];
  index: number;
  category: SkillCategory;
}

const SkillCard = ({ title, icon: Icon, skills, index, category }: SkillCardProps) => {
  const colors = categoryColors[category];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1, 
        ease: [0.25, 0.1, 0.25, 1] 
      }}
      whileHover={{ 
        y: -8,
        transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }
      }}
      className={cn("group relative", colors.glow)}
    >
      {/* Card Container */}
      <motion.div
        className={cn(
          "relative h-full rounded-2xl p-6",
          "bg-gradient-to-br from-card/95 via-card/90 to-card/85",
          "backdrop-blur-xl border",
          colors.border,
          "shadow-lg group-hover:shadow-2xl",
          "transition-shadow duration-500"
        )}
      >
        {/* Gradient Overlay - Animated */}
        <motion.div 
          className={cn(
            "absolute inset-0 rounded-2xl",
            "bg-gradient-to-br", colors.gradient,
          )}
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />

        {/* Shine sweep effect */}
        <motion.div 
          className="absolute inset-0 rounded-2xl overflow-hidden"
          initial="initial"
          whileHover="hover"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            variants={{
              initial: { x: "-100%", opacity: 0 },
              hover: { x: "100%", opacity: 1 }
            }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          />
        </motion.div>

        {/* Border glow on hover */}
        <motion.div
          className={cn(
            "absolute -inset-[1px] rounded-2xl opacity-0",
            "bg-gradient-to-br from-primary/50 via-primary/20 to-primary/50"
          )}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          style={{ zIndex: -1 }}
        />

        {/* Header */}
        <div className="flex items-center gap-4 mb-5 relative z-10">
          <motion.div
            className={cn(
              "p-3 rounded-xl",
              "bg-gradient-to-br", colors.gradient,
              "border border-white/10"
            )}
            whileHover={{ 
              scale: 1.1, 
              rotate: 5,
              transition: { type: "spring", stiffness: 400, damping: 17 }
            }}
          >
            <Icon className="w-6 h-6 text-primary" />
          </motion.div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-xl font-bold text-foreground">
              {title}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
              <motion.span 
                className="inline-block w-1.5 h-1.5 rounded-full bg-primary/60"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              {skills.length} skills
            </p>
          </div>
        </div>

        {/* Skills Grid with Animated Badges */}
        <div className="flex flex-wrap gap-2 relative z-10">
          {skills.map((skill, i) => (
            <SkillBadge key={skill.id || i} skill={skill} index={i} category={category} />
          ))}
        </div>

        {/* Bottom Accent Line - Animated */}
        <motion.div 
          className="absolute bottom-0 left-6 right-6 h-0.5 rounded-full bg-gradient-to-r from-transparent via-primary/30 to-transparent"
          whileHover={{ 
            scaleX: 1.1,
            opacity: 1,
          }}
          initial={{ opacity: 0.5 }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </motion.div>
  );
};

// --- SMOOTH ANIMATED SKILL BADGE ---
const SkillBadge = ({ skill, index, category }: { skill: Skill; index: number; category: SkillCategory }) => {
  const colors = categoryColors[category];
  
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        delay: 0.1 + index * 0.03, 
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1]
      }}
      whileHover={{ 
        scale: 1.08, 
        y: -3,
        transition: { type: "spring", stiffness: 400, damping: 17 }
      }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium cursor-default",
        "bg-gradient-to-br", colors.gradient,
        "border border-white/10",
        colors.shadow,
        "shadow-md hover:shadow-lg",
        "transition-shadow duration-300"
      )}
    >
      <span className="relative z-10 text-foreground/90 group-hover:text-foreground">
        {skill.name}
      </span>
      
      {/* Star icon with smooth animation */}
      <motion.span
        initial={{ opacity: 0, scale: 0, rotate: -180 }}
        whileHover={{ 
          opacity: 1, 
          scale: 1, 
          rotate: 0,
          transition: { type: "spring", stiffness: 500, damping: 15 }
        }}
      >
        <Star className="w-3 h-3 text-primary fill-primary" />
      </motion.span>
      
      {/* Hover glow effect */}
      <motion.div
        className={cn(
          "absolute inset-0 rounded-lg -z-10",
          "bg-gradient-to-br", colors.gradient
        )}
        initial={{ opacity: 0, scale: 0.8 }}
        whileHover={{ opacity: 0.5, scale: 1.1 }}
        transition={{ duration: 0.3 }}
        style={{ filter: "blur(8px)" }}
      />
    </motion.span>
  );
};

// --- MAIN SECTION ---
export const SkillsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory | "all">("all");
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
      category: category as SkillCategory,
      title: CATEGORY_LABELS[category as SkillCategory] || "Tools & Platform",
      icon: categoryIcons[category as SkillCategory] || Wrench,
      skills: categorySkills,
    }));
  }, [skills]);

  // Filter categories based on search and selected category
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

  // Calculate statistics
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
      className="section-padding relative overflow-hidden bg-gradient-to-b from-background via-secondary/10 to-background"
    >
      <SkillsBackground3D />

      {/* Enhanced Background Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/90 to-background/80 pointer-events-none z-10" />
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 0%, hsl(222 47% 6% / 0.2) 50%, hsl(222 47% 6% / 0.5) 100%)",
        }}
      />

      {/* Subtle animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10 opacity-20">
        <motion.div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          animate={{ 
            x: [0, 30, 0],
            y: [0, 20, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/8 rounded-full blur-3xl"
          animate={{ 
            x: [0, -20, 0],
            y: [0, -15, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.08)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.08)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_70%)] pointer-events-none z-10" />

      <div className="container mx-auto container-padding relative z-20">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-12 sm:mb-16"
        >
          {/* Decorative line */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="w-20 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-6"
          />

          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 text-primary text-sm font-medium uppercase tracking-wider mb-4 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm"
          >
            <Sparkles className="w-4 h-4" />
            Technical Arsenal
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl md:text-6xl font-bold mt-4"
          >
            My <span className="bg-gradient-to-r from-primary via-primary/90 to-primary bg-clip-text text-transparent">Expertise</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-muted-foreground mt-4 sm:mt-6 max-w-2xl mx-auto text-base sm:text-lg px-4"
          >
            A comprehensive collection of technologies and tools I work with
          </motion.p>
        </motion.div>

        {/* Statistics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 max-w-3xl mx-auto"
        >
          {[
            { label: "Total Skills", value: stats.totalSkills, icon: Code2, gradient: "from-blue-500/20 to-cyan-500/20" },
            { label: "Categories", value: stats.totalCategories, icon: Database, gradient: "from-purple-500/20 to-pink-500/20" },
            { label: "Avg per Category", value: stats.avgSkillsPerCategory, icon: TrendingUp, gradient: "from-green-500/20 to-emerald-500/20" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + index * 0.1, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              whileHover={{ 
                scale: 1.05, 
                y: -4,
                transition: { type: "spring", stiffness: 400, damping: 17 }
              }}
              className={cn(
                "relative p-4 rounded-xl border border-primary/20 backdrop-blur-sm cursor-default",
                "bg-gradient-to-br", stat.gradient,
                "shadow-lg hover:shadow-xl transition-shadow duration-300"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <stat.icon className="w-5 h-5 text-primary" />
                <motion.span 
                  className="text-2xl font-bold text-foreground"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  {stat.value}
                </motion.span>
              </div>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Search and Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-8 max-w-4xl mx-auto"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10 bg-background/50 border-primary/20 focus:border-primary/50 backdrop-blur-sm transition-all duration-300"
              />
              <AnimatePresence>
                {searchQuery && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 sm:flex-nowrap">
              <Button
                variant={selectedCategory === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("all")}
                className="gap-2 transition-all duration-300"
              >
                <Filter className="w-4 h-4" />
                All
              </Button>
              {categoryOrder.map((category) => {
                const categoryData = skillCategories.find((c) => c.category === category);
                if (!categoryData) return null;
                return (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="gap-2 transition-all duration-300"
                  >
                    {categoryData.skills.length}
                    <span className="hidden sm:inline">{CATEGORY_LABELS[category].split(" ")[0]}</span>
                  </Button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Cards Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Loader2 className="w-12 h-12 text-primary" />
            </motion.div>
          </div>
        ) : filteredCategories.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto"
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-center py-20 px-6 rounded-2xl border border-dashed border-primary/20 bg-card/30 backdrop-blur-sm max-w-md mx-auto"
          >
            <Code className="w-12 h-12 text-primary/40 mx-auto mb-4" />
            <p className="text-muted-foreground font-medium">No skills found</p>
            <p className="text-sm text-muted-foreground/60 mt-2">
              {searchQuery ? "Try a different search term" : "Check back soon for updates!"}
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};
