import { useEffect, useRef, useState } from "react";
import { Briefcase, Calendar, Loader2, MapPin, Laptop, Building2, Sparkles } from "lucide-react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ExperienceBackground3D } from "./ExperienceBackground3D";
import { useExperience } from "@/hooks/useExperience";
import type { Experience } from "@/lib/admin/experience";
import { Badge } from "@/components/ui/badge";

export const ExperienceSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const { data: experiences = [], isLoading } = useExperience();

  const formatMonthYear = (value?: string) => {
    if (!value) return "";
    // value is "YYYY-MM"
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

  // Scroll Parallax for Timeline
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const ySpring = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const timelineHeight = useTransform(ySpring, [0, 1], ["0%", "100%"]);

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
      id="experience"
      ref={sectionRef}
      className="section-padding relative bg-secondary/30 overflow-hidden perspective-1000"
    >
      <ExperienceBackground3D />

      {/* Overlays for contrast + depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/65 to-background/50 pointer-events-none z-10" />
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 0%, hsl(222 47% 6% / 0.2) 50%, hsl(222 47% 6% / 0.55) 100%)",
        }}
      />
      <div className="absolute inset-0 overflow-hidden opacity-30 pointer-events-none z-10">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl translate-x-1/2" />
      </div>

      <div className="container mx-auto container-padding relative z-20">

        {/* Section Header */}
        <div className={`text-center mb-10 sm:mb-16 ${isVisible ? "animate-slide-up" : "opacity-0"}`}>
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="text-primary text-sm font-medium uppercase tracking-wider inline-flex items-center gap-2 mb-2"
          >
            <Briefcase className="w-4 h-4" />
            Experience
          </motion.span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mt-3 sm:mt-4">
            My <span className="gradient-text">Work Journey</span>
          </h2>
          <p className="text-muted-foreground mt-3 sm:mt-4 max-w-2xl mx-auto text-sm sm:text-base px-4">
            Roles, responsibilities, and impact—presented as a clean timeline with subtle motion and glow.
          </p>
        </div>

        {/* 3D Timeline Container */}
        <div className="max-w-5xl mx-auto relative perspective-1000">

          {/* Animated Central Timeline Beam */}
          <div className="absolute left-4 sm:left-0 md:left-1/2 top-0 bottom-0 w-[3px] md:-translate-x-1/2 bg-border/30 rounded-full overflow-hidden">
            <motion.div className="w-full origin-top" style={{ height: timelineHeight }}>
              <div className="h-full w-full bg-gradient-to-b from-primary via-[hsl(200,90%,60%)] to-primary opacity-80" />
              <div className="absolute inset-0 blur-md bg-primary/30" />
            </motion.div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
          ) : experiences.length > 0 ? (
            experiences.map((exp, index) => {
              const isEven = index % 2 === 0;
              const duration = exp.current
                ? `${formatMonthYear(exp.startDate)} – Present`
                : exp.endDate
                  ? `${formatMonthYear(exp.startDate)} – ${formatMonthYear(exp.endDate)}`
                  : formatMonthYear(exp.startDate);

              return (
                <div key={exp.id || index} className="relative mb-16 sm:mb-24 last:mb-0">
                  <div className={`flex flex-col md:flex-row items-center ${!isEven ? 'md:flex-row-reverse' : ''}`}>

                    {/* Glowing Timeline Node */}
                    <div className="absolute left-4 sm:left-0 md:left-1/2 -translate-x-1/2 md:-translate-x-1/2 flex items-center justify-center z-10 w-8 h-8">
                      <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className={`w-3.5 h-3.5 rounded-full ${exp.current ? 'bg-primary' : 'bg-foreground/70'} shadow-[0_0_20px_rgba(45,212,191,0.5)]`}
                      >
                        {exp.current && (
                          <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-75" />
                        )}
                      </motion.div>
                    </div>

                    {/* Spacer for desktop layout */}
                    <div className="hidden md:block w-1/2" />

                    {/* 3D Card */}
                    <motion.div
                      className={`w-full md:w-[calc(50%-3rem)] pl-12 md:pl-0 ${isEven ? 'md:pr-12 text-left' : 'md:pl-12 text-left'}`}
                      initial={{ opacity: 0, x: isEven ? -100 : 100, rotateY: isEven ? 25 : -25 }}
                      whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
                    >
                      <motion.div
                        whileHover={{
                          scale: 1.03,
                          rotateX: 4,
                          z: 50,
                        }}
                        className="group relative glass-enhanced rounded-2xl p-6 sm:p-8 shadow-2xl border border-primary/10 overflow-hidden"
                        style={{ transformStyle: "preserve-3d" }}
                      >
                        {/* Decorative shimmer + gradient border */}
                        <div className="absolute inset-0 pointer-events-none">
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 opacity-60" />
                          <motion.div
                            className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
                            animate={{ x: isVisible ? ["-120%", "220%"] : "-120%" }}
                            transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 2.5, ease: "linear" }}
                          />
                        </div>

                        {/* 3D Float Header */}
                        <div style={{ transform: "translateZ(20px)" }} className="flex flex-col gap-2 mb-4 relative">
                          <h3 className="font-display text-2xl font-bold text-white group-hover:text-primary transition-colors">
                            {exp.title}
                          </h3>
                          <div className="flex items-center gap-2 text-primary/90 font-medium text-lg">
                            <Building2 className="w-4 h-4" />
                            {exp.company}
                          </div>
                        </div>

                        {/* 3D Depth Content */}
                        <div style={{ transform: "translateZ(10px)" }}>
                          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-4">
                            <Badge variant="secondary" className="gap-1.5">
                              <Calendar className="w-3.5 h-3.5" />
                              {duration}
                            </Badge>
                            <Badge variant="outline" className="gap-1.5 border-primary/30">
                              <Laptop className="w-3.5 h-3.5" />
                              {workTypeLabel(exp.workType)}
                            </Badge>
                            {exp.location && (
                              <Badge variant="outline" className="gap-1.5 border-primary/20">
                                <MapPin className="w-3.5 h-3.5" />
                                {exp.location}
                              </Badge>
                            )}
                            {exp.current && (
                              <Badge variant="default" className="gap-1.5">
                                <Sparkles className="w-3.5 h-3.5" />
                                Current
                              </Badge>
                            )}
                          </div>

                          {exp.skills?.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-5">
                              {exp.skills.slice(0, 8).map((skill) => (
                                <Badge key={skill} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                              {exp.skills.length > 8 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{exp.skills.length - 8}
                                </Badge>
                              )}
                            </div>
                          )}

                          <ul className="space-y-3">
                            {exp.responsibilities.map((resp, i) => (
                              <li key={i} className="flex items-start gap-3 text-muted-foreground group-hover:text-white/90 transition-colors">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0 shadow-[0_0_10px_rgba(45,212,191,0.5)]" />
                                <span className="text-sm leading-relaxed">{resp}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Glow Border Effect */}
                        <div className="absolute inset-0 rounded-2xl border border-primary/0 group-hover:border-primary/40 transition-colors pointer-events-none" />
                      </motion.div>
                    </motion.div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-20 text-muted-foreground">No experience entries yet.</div>
          )}
        </div>
      </div>
    </section>
  );
};
