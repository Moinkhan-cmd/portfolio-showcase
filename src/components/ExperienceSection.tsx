import { useEffect, useRef, useState } from "react";
import { Briefcase, Calendar, Loader2, MapPin, Laptop, Building2 } from "lucide-react";
import { motion } from "framer-motion";
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

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : experiences.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 max-w-6xl mx-auto">
            {experiences.map((exp, index) => {
              const duration = exp.current
                ? `${formatMonthYear(exp.startDate)} – Present`
                : exp.endDate
                  ? `${formatMonthYear(exp.startDate)} – ${formatMonthYear(exp.endDate)}`
                  : formatMonthYear(exp.startDate);

              return (
                <motion.div
                  key={exp.id || index}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.55, delay: index * 0.06 }}
                  whileHover={{ y: -6 }}
                  className="glass-enhanced rounded-2xl border border-primary/10 overflow-hidden card-hover"
                >
                  <div className="p-5 sm:p-6 relative">
                    {/* Top accent */}
                    <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-70 pointer-events-none" />

                    {/* Header */}
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/15 shrink-0">
                        <Briefcase className="w-5 h-5 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-display text-lg sm:text-xl font-semibold leading-snug">
                          {exp.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 text-primary/90 font-medium">
                          <Building2 className="w-4 h-4" />
                          <span className="truncate">{exp.company}</span>
                        </div>
                      </div>
                      {exp.current && (
                        <Badge variant="default" className="shrink-0">
                          Current
                        </Badge>
                      )}
                    </div>

                    {/* Meta */}
                    <div className="flex flex-wrap gap-2 mt-4 text-muted-foreground">
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
                    </div>

                    {/* Skills */}
                    {exp.skills?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {exp.skills.slice(0, 10).map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {exp.skills.length > 10 && (
                          <Badge variant="secondary" className="text-xs">
                            +{exp.skills.length - 10}
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Responsibilities */}
                    {exp.responsibilities?.length > 0 && (
                      <ul className="mt-4 space-y-2.5">
                        {exp.responsibilities.slice(0, 4).map((resp, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground leading-relaxed">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                            <span>{resp}</span>
                          </li>
                        ))}
                        {exp.responsibilities.length > 4 && (
                          <li className="text-xs text-muted-foreground pl-4">
                            +{exp.responsibilities.length - 4} more…
                          </li>
                        )}
                      </ul>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No experience entries yet.</p>
          </div>
        )}
      </div>
    </section>
  );
};
