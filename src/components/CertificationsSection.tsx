import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Award, ExternalLink, Calendar, Loader2, Image as ImageIcon, Hash, ChevronDown, ChevronUp, Star, Sparkles, CheckCircle2, Zap } from "lucide-react";
import { CertificationsBackground3D } from "./CertificationsBackground3D";
import { useCertifications } from "@/hooks/useCertifications";
import type { Certification } from "@/lib/admin/certifications";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CertificationCardProps {
  cert: Certification;
  index: number;
}

const CertificationCard = ({ cert, index }: CertificationCardProps) => {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const showVerify = Boolean(cert.credentialUrl && cert.credentialUrl !== "#");
  const skills = Array.isArray(cert.skills) ? cert.skills : [];

  // 3D tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 400, damping: 50 });
  const mouseYSpring = useSpring(y, { stiffness: 400, damping: 50 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["6deg", "-6deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-6deg", "6deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
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
      ref={cardRef}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.08, type: "spring" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="group relative"
    >
      {/* Enhanced glow effect */}
      <motion.div
        className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-primary/30 via-primary/20 to-primary/30 opacity-0 blur-2xl -z-10"
        animate={{
          opacity: isHovered ? 0.8 : 0,
          scale: isHovered ? 1.08 : 1,
        }}
        transition={{ duration: 0.4 }}
      />

      <motion.div
        className="relative h-full rounded-3xl overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-card/95 via-card/90 to-card/95 backdrop-blur-xl transition-all duration-300"
        animate={{
          y: isHovered ? -12 : 0,
          borderColor: isHovered ? "hsl(175 80% 50% / 0.4)" : "hsl(175 80% 50% / 0.2)",
        }}
        style={{
          boxShadow: isHovered
            ? "0 25px 80px -12px hsl(175 80% 50% / 0.3), 0 10px 30px -10px hsl(0 0% 0% / 0.3), inset 0 1px 0 hsl(175 80% 50% / 0.2)"
            : "0 8px 30px -5px hsl(0 0% 0% / 0.2), inset 0 1px 0 hsl(175 80% 50% / 0.1)",
        }}
      >
        {/* Animated gradient overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/10 opacity-0 pointer-events-none z-20"
          animate={{
            opacity: isHovered ? 0.2 : 0,
          }}
          transition={{ duration: 0.4 }}
        />

        {/* Top accent bar */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent z-30"
          animate={{
            opacity: isHovered ? 1 : 0.6,
            scaleX: isHovered ? 1 : 0.8,
          }}
        />

        {/* Certificate Image Section */}
        <div className="relative aspect-[16/9] bg-gradient-to-br from-primary/15 via-primary/8 to-primary/15 overflow-hidden">
          {cert.imageUrl && !imageError ? (
            <>
              <motion.img
                src={cert.imageUrl}
                alt={`${cert.title} certificate`}
                className="absolute inset-0 w-full h-full object-cover"
                animate={{
                  scale: isHovered ? 1.12 : 1,
                  filter: isHovered ? "brightness(0.85)" : "brightness(1)",
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                loading="lazy"
                onError={() => setImageError(true)}
              />
              
              {/* Enhanced gradient overlay */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/60 to-transparent z-10"
                animate={{
                  opacity: isHovered ? 0.95 : 0.85,
                }}
              />

              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent z-15"
                animate={{
                  x: isHovered ? ["-100%", "200%"] : "-100%",
                }}
                transition={{
                  duration: 1.5,
                  repeat: isHovered ? Infinity : 0,
                  repeatDelay: 0.5,
                  ease: "easeInOut",
                }}
              />
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 via-primary/10 to-primary/20">
              <motion.div
                animate={{
                  opacity: isHovered ? 0.6 : 0.8,
                  scale: isHovered ? 1.1 : 1,
                  rotate: isHovered ? 5 : 0,
                }}
                transition={{ duration: 0.3 }}
                className="p-6 rounded-2xl bg-background/50 border-2 border-primary/30 backdrop-blur-sm"
              >
                <ImageIcon className="w-12 h-12 text-primary/60" />
              </motion.div>
            </div>
          )}

          {/* Enhanced Badge overlay */}
          <motion.div
            className="absolute top-4 right-4 z-30"
            animate={{
              scale: isHovered ? 1.1 : 1,
              rotate: isHovered ? 5 : 0,
            }}
          >
            <div className="bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl rounded-xl px-3 py-2 border-2 border-primary/30 shadow-xl shadow-primary/20 flex items-center gap-2">
              <motion.div
                animate={{
                  rotate: isHovered ? [0, 360] : 0,
                }}
                transition={{
                  duration: 2,
                  repeat: isHovered ? Infinity : 0,
                  ease: "linear",
                }}
              >
                <Award className="w-5 h-5 text-primary" />
              </motion.div>
              <span className="text-xs font-bold text-primary">Certified</span>
            </div>
          </motion.div>

          {/* Floating particles on hover */}
          <AnimatePresence>
            {isHovered && (
              <>
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1.5 h-1.5 bg-primary rounded-full"
                    initial={{
                      x: `${50 + (Math.random() - 0.5) * 40}%`,
                      y: "100%",
                      opacity: 0,
                      scale: 0,
                    }}
                    animate={{
                      y: "-20%",
                      opacity: [0, 1, 0],
                      scale: [0, 1.5, 0],
                    }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 2 + Math.random(),
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: "easeOut",
                    }}
                    style={{
                      filter: "drop-shadow(0 0 4px hsl(175 80% 50% / 0.8))",
                    }}
                  />
                ))}
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Enhanced Content Section */}
        <div className="p-6 sm:p-7 relative z-20 bg-gradient-to-b from-transparent to-background/50">
          {/* Header with enhanced styling */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1 min-w-0">
              <motion.div
                className="flex items-center gap-2 mb-2"
                animate={{ x: isHovered ? 4 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="p-1.5 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30"
                  animate={{
                    scale: isHovered ? 1.15 : 1,
                    rotate: isHovered ? 10 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <Star className="w-4 h-4 text-primary fill-primary/30" />
                </motion.div>
                <h3 className="font-display text-xl sm:text-2xl font-bold leading-tight bg-gradient-to-r from-foreground via-foreground to-foreground/80 bg-clip-text text-transparent group-hover:from-primary group-hover:via-primary/90 group-hover:to-primary transition-all duration-300">
                  {cert.title}
                </h3>
              </motion.div>
              
              <motion.div
                className="flex items-center gap-2 text-primary/90 font-semibold"
                animate={{ x: isHovered ? 4 : 0 }}
                transition={{ duration: 0.3, delay: 0.05 }}
              >
                <Award className="w-4 h-4 shrink-0" />
                <span className="truncate text-sm">{cert.issuer}</span>
              </motion.div>
            </div>

            {showVerify && (
              <motion.a
                href={cert.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold border-2 border-primary/40 bg-gradient-to-r from-primary/20 to-primary/10 hover:from-primary/30 hover:to-primary/20 hover:border-primary/60 transition-all duration-300 relative overflow-hidden group/btn"
                onClick={(e) => e.stopPropagation()}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Verify
                  <ExternalLink className="w-4 h-4" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary/30 to-primary/20 opacity-0 group-hover/btn:opacity-100"
                />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{
                    x: ["-100%", "200%"],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              </motion.a>
            )}
          </div>

          {/* Enhanced Meta Information */}
          <div className="flex flex-wrap gap-2 mb-4">
            {cert.issueDate && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 + 0.1 }}
                whileHover={{ scale: 1.1, y: -2 }}
              >
                <Badge variant="secondary" className="gap-1.5 text-xs font-semibold bg-gradient-to-r from-primary/15 to-primary/10 border border-primary/25 hover:border-primary/40">
                  <Calendar className="w-3.5 h-3.5" />
                  {cert.issueDate}
                </Badge>
              </motion.div>
            )}
            {cert.credentialId && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 + 0.15 }}
                whileHover={{ scale: 1.1, y: -2 }}
              >
                <Badge variant="outline" className="gap-1.5 border-primary/30 bg-background/50 hover:bg-primary/10 hover:border-primary/50 text-xs font-semibold">
                  <Hash className="w-3.5 h-3.5" />
                  {cert.credentialId}
                </Badge>
              </motion.div>
            )}
          </div>

          {/* Enhanced Description */}
          {cert.description && (
            <motion.p
              className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-4"
              animate={{
                color: isHovered ? "hsl(var(--foreground) / 0.9)" : "hsl(var(--muted-foreground))",
              }}
              transition={{ duration: 0.3 }}
            >
              {cert.description}
            </motion.p>
          )}

          {/* Enhanced Skills Section */}
          {skills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {skills.slice(0, 5).map((skill, i) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 + i * 0.03 }}
                  whileHover={{ scale: 1.15, y: -3, rotate: 2 }}
                  className="text-xs px-2.5 py-1 bg-gradient-to-r from-primary/15 via-primary/10 to-primary/15 border border-primary/25 rounded-full text-primary/90 font-semibold hover:bg-primary/20 hover:border-primary/40 transition-all cursor-default"
                >
                  {skill}
                </motion.span>
              ))}
              {skills.length > 5 && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="text-xs px-2.5 py-1 bg-muted/50 border border-border rounded-full text-muted-foreground font-semibold"
                >
                  +{skills.length - 5}
                </motion.span>
              )}
            </div>
          )}

          {/* Decorative bottom accent */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent"
            animate={{
              opacity: isHovered ? 1 : 0.5,
              scaleX: isHovered ? 1 : 0.7,
            }}
          />
        </div>

        {/* Corner decoration */}
        <motion.div
          className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-primary/30 rounded-tl-lg"
          animate={{
            opacity: isHovered ? 1 : 0.5,
            scale: isHovered ? 1.2 : 1,
          }}
        />
        <motion.div
          className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-primary/30 rounded-tr-lg"
          animate={{
            opacity: isHovered ? 1 : 0.5,
            scale: isHovered ? 1.2 : 1,
          }}
        />
      </motion.div>
    </motion.div>
  );
};

export const CertificationsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const { data: certifications = [], isLoading } = useCertifications();

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

  const displayedCertifications = showAll ? certifications : certifications.slice(0, 3);
  const hasMore = certifications.length > 3;

  return (
    <section
      id="certifications"
      ref={sectionRef}
      className="section-padding relative overflow-hidden bg-gradient-to-b from-background via-secondary/10 to-background"
    >
      <CertificationsBackground3D />

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
            <Award className="w-4 h-4" />
            Credentials
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl md:text-6xl font-bold mt-4"
          >
            My <span className="bg-gradient-to-r from-primary via-primary/90 to-primary bg-clip-text text-transparent">Certifications</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-muted-foreground mt-4 sm:mt-6 max-w-2xl mx-auto text-base sm:text-lg px-4"
          >
            Professional certifications that validate skills and continuous learning
          </motion.p>
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
          </div>
        ) : certifications.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
              <AnimatePresence mode="popLayout">
                {displayedCertifications.map((cert, index) => (
                  <CertificationCard key={cert.id || index} cert={cert} index={index} />
                ))}
              </AnimatePresence>
            </div>
            
            {hasMore && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex justify-center mt-12"
              >
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={() => setShowAll(!showAll)}
                    variant="hero-outline"
                    size="lg"
                    className="group gap-2 relative overflow-hidden border-2 border-primary/30 hover:border-primary/50 bg-gradient-to-r from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {showAll ? (
                        <>
                          Show Less
                          <ChevronUp className="w-5 h-5 transition-transform group-hover:-translate-y-1" />
                        </>
                      ) : (
                        <>
                          See More Certifications
                          <ChevronDown className="w-5 h-5 transition-transform group-hover:translate-y-1" />
                        </>
                      )}
                    </span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      animate={{
                        x: ["-100%", "200%"],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 px-6 rounded-2xl border border-dashed border-primary/20 bg-card/30 backdrop-blur-sm max-w-md mx-auto"
          >
            <Award className="w-12 h-12 text-primary/40 mx-auto mb-4" />
            <p className="text-muted-foreground font-medium">No certifications added yet.</p>
            <p className="text-sm text-muted-foreground/60 mt-2">Check back soon for updates!</p>
          </motion.div>
        )}
      </div>
    </section>
  );
};
