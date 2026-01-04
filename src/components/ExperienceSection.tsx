import { useEffect, useRef, useState } from "react";
import { Briefcase, Calendar, Loader2 } from "lucide-react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ExperienceBackground3D } from "./ExperienceBackground3D";
import { useExperience } from "@/hooks/useExperience";
import type { Experience } from "@/lib/admin/experience";

export const ExperienceSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const { data: experiences = [], isLoading } = useExperience();

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
      className="section-padding relative overflow-hidden bg-black/40 perspective-1000"
    >
      <ExperienceBackground3D />

      {/* Cinematic Lighting Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none mix-blend-screen" />

      <div className="container mx-auto container-padding relative z-20">

        {/* Floating Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isVisible ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, type: "spring" }}
          className="text-center mb-16 sm:mb-24"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-primary text-xs font-bold tracking-[0.2em] uppercase mb-4 backdrop-blur-md">
            Career Trajectory
          </span>
          <h2 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold">
            Work <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-primary animate-gradient-x bg-300%">Journal</span>
          </h2>
        </motion.div>

        {/* 3D Timeline Container */}
        <div className="max-w-4xl mx-auto relative perspective-1000">

          {/* Animated Central Timeline Beam */}
          <div className="absolute left-4 sm:left-0 md:left-1/2 top-0 bottom-0 w-1 md:-translate-x-1/2 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="w-full bg-gradient-to-b from-primary via-purple-500 to-primary origin-top"
              style={{ height: timelineHeight }}
            />
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
          ) : experiences.length > 0 ? (
            experiences.map((exp, index) => {
              const isEven = index % 2 === 0;
              const duration = exp.current
                ? `${exp.startDate} – Present`
                : exp.endDate
                  ? `${exp.startDate} – ${exp.endDate}`
                  : exp.startDate;

              return (
                <div key={exp.id || index} className="relative mb-16 sm:mb-24 last:mb-0">
                  <div className={`flex flex-col md:flex-row items-center ${!isEven ? 'md:flex-row-reverse' : ''}`}>

                    {/* Glowing Timeline Node */}
                    <div className="absolute left-4 sm:left-0 md:left-1/2 -translate-x-1/2 md:-translate-x-1/2 flex items-center justify-center z-10 w-8 h-8">
                      <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className={`w-4 h-4 rounded-full ${exp.current ? 'bg-primary' : 'bg-white'} shadow-[0_0_20px_rgba(45,212,191,0.5)]`}
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
                          scale: 1.05,
                          rotateX: 5,
                          z: 50,
                          backgroundColor: "rgba(255,255,255,0.08)"
                        }}
                        className="group relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl transition-colors duration-300"
                        style={{ transformStyle: "preserve-3d" }}
                      >
                        {/* 3D Float Header */}
                        <div style={{ transform: "translateZ(20px)" }} className="flex flex-col gap-2 mb-4">
                          <h3 className="font-display text-2xl font-bold text-white group-hover:text-primary transition-colors">
                            {exp.title}
                          </h3>
                          <div className="flex items-center gap-2 text-primary/80 font-medium text-lg">
                            <Briefcase className="w-4 h-4" />
                            {exp.company}
                          </div>
                        </div>

                        {/* 3D Depth Content */}
                        <div style={{ transform: "translateZ(10px)" }}>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                            <Calendar className="w-4 h-4" />
                            <span className={`px-2 py-0.5 rounded-full ${exp.current ? 'bg-primary/20 text-primary' : 'bg-white/10'}`}>
                              {duration}
                            </span>
                          </div>

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
                        <div className="absolute inset-0 rounded-2xl border border-primary/0 group-hover:border-primary/50 transition-colors pointer-events-none" />
                      </motion.div>
                    </motion.div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-20 text-muted-foreground">Journey loading...</div>
          )}
        </div>
      </div>
    </section>
  );
};
