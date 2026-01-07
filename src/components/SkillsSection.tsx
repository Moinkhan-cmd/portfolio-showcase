import { useEffect, useRef, useState, useMemo } from 'react';
import { Code2, Database, Users, Wrench, Code, Loader2, Search, TrendingUp, Star, Sparkles, Filter, X, Zap, Award, Target, Layers, Cpu, Globe, Rocket, ChevronRight, Gem, Crown, Flame, Heart, Activity } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { SkillsBackground3D } from './SkillsBackground3D';
import { useSkills } from '@/hooks/useSkills';
import type { Skill } from '@/lib/admin/skills';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type SkillCategory =
  | 'frontend_development'
  | 'backend_database'
  | 'programming_languages'
  | 'tools_platform'
  | 'soft_skills';

const CATEGORY_LABELS: Record<SkillCategory, string> = {
  frontend_development: 'Frontend Development',
  backend_database: 'Backend & Database',
  programming_languages: 'Programming Languages',
  tools_platform: 'Tools & Platform',
  soft_skills: 'Soft Skills',
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
  ring: string;
}> = {
  frontend_development: { 
    gradient: 'from-cyan-500/30 via-blue-500/20 to-indigo-500/30', 
    border: 'border-cyan-500/50',
    glow: 'group-hover:shadow-cyan-500/40',
    shadow: 'hover:shadow-cyan-500/30',
    accent: 'text-cyan-400',
    bg: 'bg-cyan-500/15',
    iconBg: 'from-cyan-500 to-blue-600',
    ring: 'ring-cyan-500/30'
  },
  backend_database: { 
    gradient: 'from-purple-500/30 via-violet-500/20 to-fuchsia-500/30', 
    border: 'border-purple-500/50',
    glow: 'group-hover:shadow-purple-500/40',
    shadow: 'hover:shadow-purple-500/30',
    accent: 'text-purple-400',
    bg: 'bg-purple-500/15',
    iconBg: 'from-purple-500 to-fuchsia-600',
    ring: 'ring-purple-500/30'
  },
  programming_languages: { 
    gradient: 'from-emerald-500/30 via-green-500/20 to-teal-500/30', 
    border: 'border-emerald-500/50',
    glow: 'group-hover:shadow-emerald-500/40',
    shadow: 'hover:shadow-emerald-500/30',
    accent: 'text-emerald-400',
    bg: 'bg-emerald-500/15',
    iconBg: 'from-emerald-500 to-teal-600',
    ring: 'ring-emerald-500/30'
  },
  tools_platform: { 
    gradient: 'from-orange-500/30 via-amber-500/20 to-yellow-500/30', 
    border: 'border-orange-500/50',
    glow: 'group-hover:shadow-orange-500/40',
    shadow: 'hover:shadow-orange-500/30',
    accent: 'text-orange-400',
    bg: 'bg-orange-500/15',
    iconBg: 'from-orange-500 to-amber-600',
    ring: 'ring-orange-500/30'
  },
  soft_skills: { 
    gradient: 'from-pink-500/30 via-rose-500/20 to-red-500/30', 
    border: 'border-pink-500/50',
    glow: 'group-hover:shadow-pink-500/40',
    shadow: 'hover:shadow-pink-500/30',
    accent: 'text-pink-400',
    bg: 'bg-pink-500/15',
    iconBg: 'from-pink-500 to-rose-600',
    ring: 'ring-pink-500/30'
  },
};

const normalizeCategory = (category: unknown): SkillCategory => {
  if (typeof category !== 'string') return 'tools_platform';
  const trimmed = category.trim().toLowerCase();
  const migrationMap: Record<string, SkillCategory> = {
    'frontend development': 'frontend_development',
    'backend & database': 'backend_database',
    'backend and database': 'backend_database',
    'programming languages': 'programming_languages',
    'tools & platform': 'tools_platform',
    'tools and platform': 'tools_platform',
    'tools & platforms': 'tools_platform',
    'tools and platforms': 'tools_platform',
    'soft skills': 'soft_skills',
  };
  if (migrationMap[trimmed]) return migrationMap[trimmed];
  const enumValues: SkillCategory[] = ['frontend_development','backend_database','programming_languages','tools_platform','soft_skills'];
  if (enumValues.includes(trimmed as SkillCategory)) return trimmed as SkillCategory;
  return 'tools_platform';
};
const Card3D = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['8deg', '-8deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-8deg', '8deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (ref.current === null) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

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
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className={cn('group relative', colors.glow)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card3D className="h-full">
        <motion.div
          className={cn('absolute -inset-[2px] rounded-3xl blur-xl opacity-0 bg-gradient-to-br', colors.gradient)}
          animate={{ opacity: isHovered ? 0.7 : 0 }}
          transition={{ duration: 0.4 }}
        />
        <div
          className={cn(
            'relative h-full rounded-2xl overflow-hidden',
            'bg-gradient-to-br from-card/95 via-card/90 to-card/85',
            'backdrop-blur-2xl border-2', colors.border,
            'shadow-2xl transition-all duration-500',
            isHovered && 'shadow-3xl'
          )}
          style={{ transform: 'translateZ(50px)' }}
        >
          <motion.div 
            className={cn('absolute inset-0 bg-gradient-to-br opacity-30', colors.gradient)}
            animate={{ opacity: isHovered ? 0.5 : 0.3 }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.08)_0%,transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.05)_0%,transparent_50%)]" />

          <div className="absolute inset-0 overflow-hidden">
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className={cn('absolute w-1.5 h-1.5 rounded-full', colors.accent)}
                style={{ left: (15 + i * 25).toString() + '%', top: (25 + (i % 2) * 50).toString() + '%' }}
                animate={{ y: [0, -15, 0], opacity: [0.2, 0.6, 0.2], scale: [0.8, 1.2, 0.8] }}
                transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.4 }}
              />
            ))}
          </div>

          <motion.div className="absolute inset-0 overflow-hidden rounded-2xl" initial="rest" whileHover="hover">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -skew-x-12"
              variants={{ rest: { x: '-100%', opacity: 0 }, hover: { x: '100%', opacity: 1 } }}
              transition={{ duration: 0.6 }}
            />
          </motion.div>

          <div className="relative z-10 p-6">
            <div className="flex items-start gap-4 mb-6">
              <motion.div
                className={cn('relative p-3.5 rounded-2xl bg-gradient-to-br shadow-lg ring-2', colors.iconBg, colors.ring)}
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              >
                <motion.div
                  className="absolute inset-0 rounded-2xl blur-lg"
                  style={{ background: 'inherit' }}
                  animate={{ opacity: [0.4, 0.7, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <Icon className="w-6 h-6 text-white relative z-10" />
              </motion.div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-lg font-bold text-foreground leading-tight flex items-center gap-2">
                  {title}
                  <motion.span animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 3, repeat: Infinity }}>
                    <Sparkles className={cn('w-4 h-4', colors.accent)} />
                  </motion.span>
                </h3>
                <div className="flex items-center gap-2 mt-1.5">
                  <div className={cn('flex items-center gap-1.5 px-2.5 py-1 rounded-full', colors.bg)}>
                    <Crown className={cn('w-3.5 h-3.5', colors.accent)} />
                    <span className={cn('text-xs font-bold', colors.accent)}>{skills.length}</span>
                    <span className="text-xs text-muted-foreground">skills</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, i) => (
                <SkillBadge key={skill.id || i} skill={skill} index={i} category={category} />
              ))}
            </div>
          </div>
          <motion.div className="absolute bottom-0 left-0 right-0 h-1">
            <motion.div
              className={cn('h-full bg-gradient-to-r', colors.iconBg)}
              initial={{ scaleX: 0, originX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
            />
          </motion.div>
        </div>
      </Card3D>
    </motion.div>
  );
};
const SkillBadge = ({ skill, index, category }: { skill: Skill; index: number; category: SkillCategory }) => {
  const colors = categoryColors[category];
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.1 + index * 0.03, duration: 0.4, type: 'spring', stiffness: 400, damping: 20 }}
      whileHover={{ scale: 1.08, y: -3 }}
      whileTap={{ scale: 0.95 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium cursor-default',
        'bg-background/70 backdrop-blur-md border border-white/10 transition-all duration-200',
        isHovered && 'shadow-lg'
      )}
    >
      <motion.div
        className={cn('absolute inset-0 rounded-lg -z-10 bg-gradient-to-br', colors.gradient)}
        animate={{ opacity: isHovered ? 0.6 : 0.2 }}
        transition={{ duration: 0.2 }}
      />
      <span className="text-foreground/90">{skill.name}</span>
      <motion.span animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0 }} transition={{ duration: 0.15 }}>
        <Gem className={cn('w-3 h-3', colors.accent)} />
      </motion.span>
    </motion.span>
  );
};

const StatCard = ({ label, value, icon: Icon, gradient, delay }: { label: string; value: number; icon: typeof Code2; gradient: string; delay: number; }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => {
      const duration = 1500;
      const steps = 40;
      const increment = value / steps;
      let current = 0;
      const interval = setInterval(() => {
        current += increment;
        if (current >= value) { setCount(value); clearInterval(interval); }
        else { setCount(Math.floor(current)); }
      }, duration / steps);
      return () => clearInterval(interval);
    }, delay * 1000);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ scale: 1.03, y: -4 }}
      className="relative group"
    >
      <motion.div className={cn('absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-40 blur-lg bg-gradient-to-br', gradient)} transition={{ duration: 0.3 }} />
      <div className={cn('relative p-5 rounded-2xl border border-primary/20 backdrop-blur-xl bg-gradient-to-br from-card/90 to-card/70 shadow-lg hover:shadow-xl transition-all duration-300')}>
        <div className={cn('absolute inset-0 rounded-2xl opacity-20 bg-gradient-to-br', gradient)} />
        <div className="relative z-10 flex items-center gap-4">
          <motion.div className={cn('p-3 rounded-xl bg-gradient-to-br', gradient)} whileHover={{ rotate: 8 }}>
            <Icon className="w-5 h-5 text-white" />
          </motion.div>
          <div>
            <span className="text-3xl font-bold text-foreground tabular-nums">{count}</span>
            <p className="text-sm text-muted-foreground font-medium">{label}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
export const SkillsSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory | 'all'>('all');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const { data: skills = [], isLoading } = useSkills();

  const categoryOrder: SkillCategory[] = ['frontend_development','backend_database','programming_languages','tools_platform','soft_skills'];

  const skillCategories = useMemo(() => {
    const grouped = skills.reduce((acc, skill) => {
      if (skill?.id === undefined) return acc;
      const category = normalizeCategory(skill.category);
      if (acc[category] === undefined) acc[category] = [];
      acc[category].push(skill);
      return acc;
    }, {} as Record<SkillCategory, Skill[]>);

    return Object.entries(grouped)
      .sort((a, b) => {
        const indexA = categoryOrder.indexOf(a[0] as SkillCategory);
        const indexB = categoryOrder.indexOf(b[0] as SkillCategory);
        if (indexA === -1 && indexB === -1) return a[0].localeCompare(b[0]);
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
      })
      .map(([category, categorySkills]) => ({
        category: category as SkillCategory,
        title: CATEGORY_LABELS[category as SkillCategory] || 'Tools & Platform',
        icon: categoryIcons[category as SkillCategory] || Wrench,
        skills: categorySkills,
      }));
  }, [skills]);

  const filteredCategories = useMemo(() => {
    return skillCategories
      .filter((cat) => {
        if (selectedCategory !== 'all' && cat.category !== selectedCategory) return false;
        if (searchQuery === '') return true;
        const query = searchQuery.toLowerCase();
        return cat.title.toLowerCase().includes(query) || cat.skills.some((skill) => skill.name.toLowerCase().includes(query));
      })
      .map((cat) => ({
        ...cat,
        skills: searchQuery ? cat.skills.filter((skill) => skill.name.toLowerCase().includes(searchQuery.toLowerCase())) : cat.skills,
      }))
      .filter((cat) => cat.skills.length > 0);
  }, [skillCategories, searchQuery, selectedCategory]);

  const stats = useMemo(() => ({
    totalSkills: skills.length,
    totalCategories: skillCategories.length,
    avgSkillsPerCategory: skillCategories.length > 0 ? Math.round(skills.length / skillCategories.length) : 0,
  }), [skills, skillCategories]);
  return (
    <section id="skills" ref={sectionRef} className="section-padding relative overflow-hidden bg-gradient-to-b from-background via-secondary/5 to-background min-h-screen">
      <SkillsBackground3D />
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background/60 pointer-events-none z-10" />
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        <motion.div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[80px]"
          animate={{ x: [0, 40, 0], y: [0, 20, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[80px]"
          animate={{ x: [0, -30, 0], y: [0, -15, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div className="absolute bottom-1/4 left-1/2 w-[350px] h-[350px] bg-pink-500/8 rounded-full blur-[70px]"
          animate={{ x: [0, -25, 0], y: [0, 30, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.05)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.05)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)] pointer-events-none z-10" />

      <div className="container mx-auto container-padding relative z-20">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="text-center mb-14">
          <div className="flex items-center justify-center gap-4 mb-6">
            <motion.div initial={{ scaleX: 0, originX: 1 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }} className="w-20 h-px bg-gradient-to-r from-transparent to-primary" />
            <motion.div initial={{ scale: 0, rotate: 180 }} whileInView={{ scale: 1, rotate: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3, type: 'spring' }}>
              <Rocket className="w-5 h-5 text-primary" />
            </motion.div>
            <motion.div initial={{ scaleX: 0, originX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }} className="w-20 h-px bg-gradient-to-l from-transparent to-primary" />
          </div>
          <motion.span initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 text-primary text-xs font-semibold uppercase tracking-widest mb-4 px-4 py-2 rounded-full bg-primary/10 border border-primary/30">
            <Zap className="w-3.5 h-3.5" />Technical Arsenal<Sparkles className="w-3.5 h-3.5" />
          </motion.span>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }} className="font-display text-4xl sm:text-5xl md:text-6xl font-bold mt-4">
            <span className="text-foreground">My </span>
            <span className="bg-gradient-to-r from-cyan-400 via-primary to-purple-500 bg-clip-text text-transparent">Expertise</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
            className="text-muted-foreground mt-4 max-w-xl mx-auto text-base sm:text-lg px-4">
            Technologies and tools I have mastered throughout my journey
          </motion.p>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 max-w-3xl mx-auto">
          <StatCard label="Total Skills" value={stats.totalSkills} icon={Target} gradient="from-cyan-500 to-blue-500" delay={0.4} />
          <StatCard label="Categories" value={stats.totalCategories} icon={Layers} gradient="from-purple-500 to-pink-500" delay={0.5} />
          <StatCard label="Avg per Category" value={stats.avgSkillsPerCategory} icon={Award} gradient="from-emerald-500 to-teal-500" delay={0.6} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }} className="mb-12 max-w-4xl mx-auto space-y-6">
          <div className="relative">
            <motion.div className={cn('absolute -inset-1 rounded-2xl bg-gradient-to-r from-cyan-500/30 via-purple-500/30 to-pink-500/30 blur-lg transition-opacity duration-300', isSearchFocused ? 'opacity-70' : 'opacity-0')} />
            <div className="relative bg-card/80 backdrop-blur-xl rounded-2xl border border-primary/20 p-3 shadow-xl">
              <div className="relative">
                <Search className={cn('absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-200', isSearchFocused ? 'text-primary' : 'text-muted-foreground')} />
                <input
                  type="text"
                  placeholder="Search for any skill..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className={cn('w-full h-14 pl-14 pr-14 text-base bg-background/50 rounded-xl border-2 border-transparent transition-all duration-300 placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/40 focus:bg-background/80')}
                />
                <AnimatePresence>
                  {searchQuery && (
                    <motion.button initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}
                      onClick={() => setSearchQuery('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground transition-all">
                      <X className="w-4 h-4" />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setSelectedCategory('all')}
              className={cn('flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm transition-all duration-200',
                selectedCategory === 'all' ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25' : 'bg-card/80 text-foreground border border-primary/20 hover:border-primary/40 hover:bg-card')}>
              <Filter className="w-4 h-4" />All Skills
            </motion.button>
            
            {categoryOrder.map((category) => {
              const categoryData = skillCategories.find((c) => c.category === category);
              if (categoryData === undefined) return null;
              const colors = categoryColors[category];
              const IconComponent = categoryIcons[category];
              return (
                <motion.button key={category} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedCategory(category)}
                  className={cn('flex items-center gap-2 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200',
                    selectedCategory === category ? cn('bg-gradient-to-r text-white shadow-lg', colors.iconBg, colors.shadow) : 'bg-card/80 text-foreground border border-primary/20 hover:border-primary/40 hover:bg-card')}>
                  <IconComponent className="w-4 h-4" />
                  <span className="hidden sm:inline">{CATEGORY_LABELS[category].split(' ')[0]}</span>
                  <span className={cn('px-2 py-0.5 rounded-md text-xs font-bold', selectedCategory === category ? 'bg-white/20' : colors.bg)}>{categoryData.skills.length}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}>
              <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full" />
            </motion.div>
          </div>
        ) : filteredCategories.length > 0 ? (
          <motion.div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto" layout>
            <AnimatePresence mode="popLayout">
              {filteredCategories.map((category, index) => (
                <SkillCard key={category.title} title={category.title} icon={category.icon} skills={category.skills} index={index} category={category.category} />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 px-6 rounded-2xl border-2 border-dashed border-primary/20 bg-card/30 backdrop-blur-xl max-w-md mx-auto">
            <motion.div animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }} transition={{ duration: 3, repeat: Infinity }}>
              <Code className="w-14 h-14 text-primary/40 mx-auto mb-4" />
            </motion.div>
            <p className="text-lg text-muted-foreground font-medium">No skills found</p>
            <p className="text-sm text-muted-foreground/60 mt-2">{searchQuery ? 'Try a different search term' : 'Check back soon!'}</p>
          </motion.div>
        )}
      </div>
    </section>
  );
};