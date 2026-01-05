import { useEffect, useRef, useState, useMemo } from "react";
import { Code2, Database, Users, Wrench, Code, Loader2, Search, TrendingUp, Star, Sparkles, Filter, X } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { SkillsBackground3D } from "./SkillsBackground3D";
import { useSkills } from "@/hooks/useSkills";
import type { Skill } from "@/lib/admin/skills";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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

const categoryColors: Record<SkillCategory, string> = {
  frontend_development: "from-blue-500/20 to-cyan-500/20",
  backend_database: "from-purple-500/20 to-pink-500/20",
  programming_languages: "from-green-500/20 to-emerald-500/20",
  tools_platform: "from-orange-500/20 to-red-500/20",
  soft_skills: "from-yellow-500/20 to-amber-500/20",
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

// --- ENHANCED 3D CARD COMPONENT ---
interface Skill3DCardProps {
  title: string;
  icon: typeof Code2;
  skills: Skill[];
  index: number;
  category: SkillCategory;
  isVisible: boolean;
}

const Skill3DCard = ({ title, icon: Icon, skills, index, category, isVisible }: Skill3DCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 400, damping: 50 });
  const mouseYSpring = useSpring(y, { stiffness: 400, damping: 50 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = (mouseX / rect.width) - 0.5;
    const yPct = (mouseY / rect.height) - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.9, rotateX: 15 }}
      whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1, type: "spring", stiffness: 100 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="relative group perspective-1000"
    >
      {/* Enhanced Glow Effect */}
      <motion.div
        className={`absolute -inset-1 rounded-3xl bg-gradient-to-br ${categoryColors[category]} opacity-0 blur-2xl -z-10`}
        animate={{
          opacity: isHovered ? 0.6 : 0,
          scale: isHovered ? 1.05 : 1,
        }}
        transition={{ duration: 0.4 }}
      />

      {/* 3D Content Container */}
      <motion.div
        className="relative bg-gradient-to-br from-card/90 via-card/80 to-card/90 backdrop-blur-xl border border-primary/20 rounded-2xl p-6 h-full shadow-2xl transition-all duration-300 overflow-hidden"
        animate={{
          y: isHovered ? -8 : 0,
          borderColor: isHovered ? "hsl(175 80% 50% / 0.4)" : "hsl(175 80% 50% / 0.2)",
        }}
        style={{
          boxShadow: isHovered
            ? "0 25px 80px -12px hsl(175 80% 50% / 0.3), 0 10px 30px -10px hsl(0 0% 0% / 0.3)"
            : "0 8px 30px -5px hsl(0 0% 0% / 0.2)",
        }}
      >
        {/* Animated Background Gradient */}
        <motion.div
          className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${categoryColors[category]} opacity-0 pointer-events-none`}
          animate={{
            opacity: isHovered ? 0.15 : 0,
          }}
          transition={{ duration: 0.4 }}
        />

        {/* Shimmer Effect */}
        <motion.div
          className="absolute inset-0 rounded-2xl opacity-0 pointer-events-none"
          animate={{
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.5 }}
          style={{
            background: `linear-gradient(110deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)`,
            backgroundSize: "200% 100%",
          }}
        />

        {/* Floating Header */}
        <div style={{ transform: "translateZ(30px)" }} className="flex items-center gap-4 mb-6 relative z-10">
          <motion.div
            className={`p-3 rounded-xl bg-gradient-to-br ${categoryColors[category]} border border-primary/30 shadow-lg backdrop-blur-sm`}
            animate={{
              scale: isHovered ? 1.1 : 1,
              rotate: isHovered ? 5 : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            <Icon className="w-6 h-6 text-primary" />
          </motion.div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              {title}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">{skills.length} skills</p>
          </div>
        </div>

        {/* Skills Grid with Enhanced Badges */}
        <div style={{ transform: "translateZ(20px)" }} className="flex flex-wrap gap-2 relative z-10">
          {skills.map((skill, i) => (
            <EnhancedSkillBadge key={skill.id || i} skill={skill} index={i} category={category} />
          ))}
        </div>

        {/* Floating Particles on Hover */}
        <AnimatePresence>
          {isHovered && (
            <>
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-primary rounded-full"
                  initial={{
                    x: "50%",
                    y: "50%",
                    opacity: 0,
                    scale: 0,
                  }}
                  animate={{
                    x: `${50 + (Math.random() - 0.5) * 200}%`,
                    y: `${50 + (Math.random() - 0.5) * 200}%`,
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                  }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 2 + Math.random(),
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

// --- ENHANCED MAGNETIC BADGE COMPONENT ---
const EnhancedSkillBadge = ({ skill, index, category }: { skill: Skill; index: number; category: SkillCategory }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Generate random proficiency for visual interest (if not provided)
  const proficiency = (skill as any).proficiency || Math.floor(Math.random() * 40) + 60;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.2 + index * 0.03, type: "spring", stiffness: 200 }}
      whileHover={{
        scale: 1.15,
        y: -4,
        z: 30,
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative group/badge cursor-pointer"
    >
      <motion.div
        className={`relative px-3 py-1.5 rounded-lg bg-gradient-to-br ${categoryColors[category]} border border-primary/30 hover:border-primary/60 transition-all duration-300 backdrop-blur-sm`}
        animate={{
          boxShadow: isHovered
            ? "0 8px 20px -5px hsl(175 80% 50% / 0.4)"
            : "0 2px 8px -2px hsl(175 80% 50% / 0.1)",
        }}
      >
        <span className="text-sm font-medium text-foreground relative z-10 flex items-center gap-1.5">
          {skill.name}
          {isHovered && (
            <motion.span
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              className="text-primary"
            >
              <Star className="w-3 h-3 fill-primary" />
            </motion.span>
          )}
        </span>

        {/* Proficiency Indicator */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary/20 rounded-b-lg overflow-hidden"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: proficiency / 100 }}
          transition={{ delay: 0.3 + index * 0.03, duration: 0.8 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-primary/60"
            animate={{
              boxShadow: isHovered ? "0 0 10px hsl(175 80% 50% / 0.6)" : "none",
            }}
          />
        </motion.div>

        {/* Glow on hover */}
        <motion.div
          className={`absolute inset-0 rounded-lg bg-gradient-to-br ${categoryColors[category]} blur-md opacity-0 -z-10`}
          animate={{ opacity: isHovered ? 0.4 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
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

      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10 opacity-30">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/8 rounded-full blur-3xl"
          animate={{
            x: [0, -40, 0],
            y: [0, -25, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
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
            { label: "Total Skills", value: stats.totalSkills, icon: Code2, color: "from-blue-500/20 to-cyan-500/20" },
            { label: "Categories", value: stats.totalCategories, icon: Database, color: "from-purple-500/20 to-pink-500/20" },
            { label: "Avg per Category", value: stats.avgSkillsPerCategory, icon: TrendingUp, color: "from-green-500/20 to-emerald-500/20" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -4 }}
              className={`relative p-4 rounded-xl bg-gradient-to-br ${stat.color} border border-primary/20 backdrop-blur-sm`}
            >
              <div className="flex items-center justify-between mb-2">
                <stat.icon className="w-5 h-5 text-primary" />
                <span className="text-2xl font-bold text-foreground">{stat.value}</span>
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
                className="pl-10 pr-10 bg-background/50 border-primary/20 focus:border-primary/50 backdrop-blur-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 sm:flex-nowrap">
              <Button
                variant={selectedCategory === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("all")}
                className="gap-2"
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
                    className="gap-2"
                  >
                    {categoryData.skills.length}
                    <span className="hidden sm:inline">{CATEGORY_LABELS[category].split(" ")[0]}</span>
                  </Button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* 3D Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
          </div>
        ) : filteredCategories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
            <AnimatePresence mode="popLayout">
              {filteredCategories.map((category, index) => (
                <Skill3DCard
                  key={category.title}
                  title={category.title}
                  icon={category.icon}
                  skills={category.skills}
                  index={index}
                  category={category.category}
                  isVisible={isVisible}
                />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
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
