import { useEffect, useRef, useState, useMemo, lazy, Suspense } from "react";
import { Briefcase, Calendar, Loader2, MapPin, Laptop, Building2, Award, Sparkles, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MobileGradientBackground } from "./MobileGradientBackground";
import { useExperience } from "@/hooks/useExperience";
import type { Experience } from "@/lib/admin/experience";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/useIsMobile";
import { getDeviceFlags } from "@/lib/device";
import { shouldEnable3D } from "@/hooks/use3DPerformance";

const ExperienceBackground3D = lazy(async () => {
  const mod = await import("./ExperienceBackground3D");
  return { default: mod.ExperienceBackground3D };
});

export const ExperienceSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const { data: experiences = [], isLoading } = useExperience();
  const isMobile = useIsMobile();

  const formatMonthYear = (value?: string) => {
    if (!value) return "";
    const [y, m] = value.split("-");
    const year = Number(y);
    const month = Number(m);
    if (!year || !month) return value;
    const date = new Date(year, month - 1, 1);
    return date.toLocaleString(undefined, { month: "short", year: "numeric" });
  };

  const workTypeLabel = (t: Experience["workType"]) => {
    switch (t) {
      case "remote":
        return "Remote";
      case "onsite":
        return "On-site";
      case "hybrid":
        return "Hybrid";
      default:
        return "Remote";
    }
  };

  const workTypeColor = (t: Experience["workType"]) => {
    switch (t) {
      case "remote":
        return "from-blue-500/20 to-cyan-500/20";
      case "onsite":
        return "from-purple-500/20 to-pink-500/20";
      case "hybrid":
        return "from-green-500/20 to-emerald-500/20";
      default:
        return "from-blue-500/20 to-cyan-500/20";
    }
  };

  // Sort experiences by date (newest first)
  const sortedExperiences = useMemo(() => {
    return [...experiences].sort((a, b) => {
      if (a.current && !b.current) return -1;
      if (!a.current && b.current) return 1;
      const dateA = a.startDate ? new Date(a.startDate + "-01").getTime() : 0;
      const dateB = b.startDate ? new Date(b.startDate + "-01").getTime() : 0;
      return dateB - dateA;
    });
  }, [experiences]);

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return;
    if (getDeviceFlags().isRealMobile) {
      setIsVisible(true);
      return;
    }
    if (typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    let observer: IntersectionObserver | null = null;
    try {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setIsVisible(true);
        },
        { threshold: 0.1 }
      );
      if (sectionRef.current) observer.observe(sectionRef.current);
    } catch (error) {
      console.warn("ExperienceSection: IntersectionObserver init failed", error);
      setIsVisible(true);
    }

    return () => observer?.disconnect();
  }, []);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="section-padding relative overflow-hidden bg-gradient-to-b from-background via-secondary/10 to-background"
    >
      {shouldEnable3D() && (
        <Suspense fallback={null}>
          <ExperienceBackground3D />
        </Suspense>
      )}
      <MobileGradientBackground variant="experience" />
      {/* Enhanced Background Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/90 to-background/80 pointer-events-none z-10" />
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 0%, hsl(222 47% 6% / 0.2) 50%, hsl(222 47% 6% / 0.5) 100%)",
        }}
      />

      {/* Animated Background Orbs - disabled on mobile for performance */}
      {!isMobile && (
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
      )}

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
            <Briefcase className="w-4 h-4" />
            Professional Journey
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl md:text-6xl font-bold mt-4"
          >
            Work <span className="bg-gradient-to-r from-primary via-primary/90 to-primary bg-clip-text text-transparent">Experience</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-muted-foreground mt-4 sm:mt-6 max-w-2xl mx-auto text-base sm:text-lg px-4"
          >
            A timeline of my professional journey, showcasing growth, achievements, and expertise
          </motion.p>
        </motion.div>

        {/* Experience Timeline */}
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
          </div>
        ) : sortedExperiences.length > 0 ? (
          <div className="max-w-5xl mx-auto">
            {/* Timeline Line */}
            <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-primary/20 via-primary/40 to-primary/20" />

            <div className="space-y-8 lg:space-y-12">
              {sortedExperiences.map((exp, index) => {
                const duration = exp.current
                  ? `${formatMonthYear(exp.startDate)} – Present`
                  : exp.endDate
                    ? `${formatMonthYear(exp.startDate)} – ${formatMonthYear(exp.endDate)}`
                    : formatMonthYear(exp.startDate);

                const isEven = index % 2 === 0;
                const isHovered = hoveredIndex === index;

                return (
                  <motion.div
                    key={exp.id || index}
                    initial={{ opacity: 0, y: 50, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, delay: index * 0.1, type: "spring" }}
                    onHoverStart={() => setHoveredIndex(index)}
                    onHoverEnd={() => setHoveredIndex(null)}
                    className="relative"
                  >
                    {/* Timeline Dot - Desktop */}
                    <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background shadow-lg shadow-primary/50 z-20" />

                    {/* Experience Card */}
                    <motion.div
                      className={`relative lg:w-[calc(50%-3rem)] ${isEven ? "lg:ml-auto lg:mr-0" : "lg:mr-auto lg:ml-0"}`}
                      whileHover={{ y: -8, scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Glow Effect */}
                      <motion.div
                        className={`absolute -inset-1 rounded-3xl bg-gradient-to-br ${workTypeColor(exp.workType)} opacity-0 blur-xl -z-10`}
                        animate={{
                          opacity: isHovered ? 0.6 : 0,
                          scale: isHovered ? 1.05 : 1,
                        }}
                        transition={{ duration: 0.3 }}
                      />

                      <motion.div
                        className={`relative rounded-2xl overflow-hidden border border-primary/20 bg-gradient-to-br from-card/90 via-card/80 to-card/90 backdrop-blur-xl transition-all duration-300 ${
                          isHovered ? "border-primary/40 shadow-2xl shadow-primary/20" : "shadow-lg"
                        }`}
                        animate={{
                          boxShadow: isHovered
                            ? "0 25px 80px -12px hsl(175 80% 50% / 0.25), 0 10px 30px -10px hsl(0 0% 0% / 0.3)"
                            : "0 8px 30px -5px hsl(0 0% 0% / 0.2)",
                        }}
                      >
                        {/* Animated Background Gradient */}
                        <motion.div
                          className={`absolute inset-0 bg-gradient-to-br ${workTypeColor(exp.workType)} opacity-0 pointer-events-none`}
                          animate={{
                            opacity: isHovered ? 0.15 : 0,
                          }}
                          transition={{ duration: 0.4 }}
                        />

                        {/* Top Accent Line */}
                        <motion.div
                          className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent"
                          animate={{
                            opacity: isHovered ? 1 : 0.5,
                          }}
                        />

                        <div className="p-6 sm:p-8 relative z-10">
                          {/* Header */}
                          <div className="flex items-start justify-between gap-4 mb-4">
                            <div className="flex items-start gap-4 flex-1 min-w-0">
                              <motion.div
                                className={`p-3 rounded-xl bg-gradient-to-br ${workTypeColor(exp.workType)} border border-primary/30 shrink-0`}
                                animate={{
                                  scale: isHovered ? 1.1 : 1,
                                  rotate: isHovered ? 5 : 0,
                                }}
                                transition={{ duration: 0.3 }}
                              >
                                <Briefcase className="w-6 h-6 text-primary" />
                              </motion.div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground mb-1">
                                  {exp.title}
                                </h3>
                                <div className="flex items-center gap-2 text-primary/90 font-semibold mb-2">
                                  <Building2 className="w-4 h-4 shrink-0" />
                                  <span className="truncate">{exp.company}</span>
                                </div>
                                {exp.location && (
                                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                    <MapPin className="w-3.5 h-3.5" />
                                    <span>{exp.location}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            {exp.current && (
                              <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
                              >
                                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg shadow-green-500/30">
                                  <CheckCircle2 className="w-3 h-3 mr-1" />
                                  Current
                                </Badge>
                              </motion.div>
                            )}
                          </div>

                          {/* Meta Information */}
                          <div className="flex flex-wrap gap-2 mb-5">
                            <Badge variant="secondary" className="gap-1.5">
                              <Calendar className="w-3.5 h-3.5" />
                              {duration}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={`gap-1.5 border-primary/30 bg-gradient-to-br ${workTypeColor(exp.workType)}`}
                            >
                              <Laptop className="w-3.5 h-3.5" />
                              {workTypeLabel(exp.workType)}
                            </Badge>
                          </div>

                          {/* Skills */}
                          {exp.skills && exp.skills.length > 0 && (
                            <div className="mb-5">
                              <div className="flex items-center gap-2 mb-2">
                                <Sparkles className="w-4 h-4 text-primary" />
                                <span className="text-sm font-semibold text-foreground">Technologies</span>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {exp.skills.slice(0, 8).map((skill, i) => (
                                  <motion.span
                                    key={skill}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.05 + i * 0.02 }}
                                    whileHover={{ scale: 1.1, y: -2 }}
                                    className="text-xs px-2.5 py-1 bg-primary/10 border border-primary/20 rounded-full text-primary/90 font-medium hover:bg-primary/15 hover:border-primary/30 transition-colors"
                                  >
                                    {skill}
                                  </motion.span>
                                ))}
                                {exp.skills.length > 8 && (
                                  <span className="text-xs px-2.5 py-1 bg-muted/50 border border-border rounded-full text-muted-foreground font-medium">
                                    +{exp.skills.length - 8}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Responsibilities */}
                          {exp.responsibilities && exp.responsibilities.length > 0 && (
                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <Award className="w-4 h-4 text-primary" />
                                <span className="text-sm font-semibold text-foreground">Key Responsibilities</span>
                              </div>
                              <ul className="space-y-2.5">
                                {exp.responsibilities.slice(0, 5).map((resp, i) => (
                                  <motion.li
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 + i * 0.03 }}
                                    className="flex items-start gap-3 text-sm text-muted-foreground leading-relaxed"
                                  >
                                    <motion.span
                                      className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0"
                                      animate={{
                                        scale: isHovered ? [1, 1.5, 1] : 1,
                                      }}
                                      transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        delay: i * 0.2,
                                      }}
                                    />
                                    <span>{resp}</span>
                                  </motion.li>
                                ))}
                                {exp.responsibilities.length > 5 && (
                                  <li className="text-xs text-muted-foreground/60 pl-4 italic">
                                    +{exp.responsibilities.length - 5} more responsibilities
                                  </li>
                                )}
                              </ul>
                            </div>
                          )}
                        </div>

                        {/* Floating Particles on Hover */}
                        <AnimatePresence>
                          {isHovered && (
                            <>
                              {[...Array(4)].map((_, i) => (
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
                  </motion.div>
                );
              })}
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 px-6 rounded-2xl border border-dashed border-primary/20 bg-card/30 backdrop-blur-sm max-w-md mx-auto"
          >
            <Briefcase className="w-12 h-12 text-primary/40 mx-auto mb-4" />
            <p className="text-muted-foreground font-medium">No experience entries yet.</p>
            <p className="text-sm text-muted-foreground/60 mt-2">Check back soon for updates!</p>
          </motion.div>
        )}
      </div>
    </section>
  );
};
