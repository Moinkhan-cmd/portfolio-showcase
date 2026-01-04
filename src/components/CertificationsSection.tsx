import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Award, ExternalLink, Calendar, Loader2 } from "lucide-react";
import { CertificationsBackground3D } from "./CertificationsBackground3D";
import { useCertifications } from "@/hooks/useCertifications";
import type { Certification } from "@/lib/admin/certifications";
import { Badge } from "@/components/ui/badge";

// --- 3D INTERACTIVE CARD (Relative Layout) ---
interface CertificationCardProps {
  cert: Certification;
  index: number;
}

const Certification3DCard = ({ cert, index }: CertificationCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // 3D Tilt Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseYSpring = useSpring(y, { stiffness: 500, damping: 100 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]); // Reduced tilt for stability
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: isHovered ? 0 : rotateX,
        rotateY: isHovered ? 0 : rotateY,
        transformStyle: "preserve-3d",
        zIndex: isHovered ? 20 : 1,
      }}
      className="relative group perspective-1000 h-full"
    >
      <div
        className={`relative flex flex-col h-full bg-secondary/60 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 ${isHovered ? 'shadow-2xl border-primary/30 -translate-y-2' : ''}`}
        style={{ transform: "translateZ(0px)" }}
      >
        {/* Hover Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none" />

        {/* Image Section */}
        <div className="relative h-40 shrink-0 overflow-hidden bg-muted/20">
          {cert.imageUrl ? (
            <img
              src={cert.imageUrl}
              alt={cert.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              onError={(e) => (e.currentTarget.style.display = 'none')}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-secondary/50">
              <Award className="w-12 h-12 text-primary/20" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-secondary via-transparent to-transparent opacity-60" />
        </div>

        <div className="p-6 flex flex-col flex-1 relative z-10">
          {/* Header */}
          <div className="mb-4">
            <h3 className="font-display text-lg font-bold leading-tight text-white group-hover:text-primary transition-colors">
              {cert.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 font-medium">{cert.issuer}</p>
          </div>

          {/* Description with Smooth Expand */}
          <div className="relative mb-4">
            <motion.div
              animate={{
                height: isHovered ? "auto" : "3rem", // ~3 lines closed vs auto open
              }}
              className="overflow-hidden text-sm text-muted-foreground/80 leading-relaxed"
            >
              <p className="pb-2">
                {cert.description || "No description provided."}
              </p>
            </motion.div>
            {/* Fade out gradient for collapsed state */}
            <motion.div
              animate={{ opacity: isHovered ? 0 : 1 }}
              className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-secondary to-transparent"
            />
          </div>

          {/* Skills Tags */}
          {cert.skills && cert.skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {cert.skills.slice(0, isHovered ? 12 : 3).map((skill, i) => (
                <Badge key={i} variant="secondary" className="px-2 py-0.5 text-[10px] font-normal sm:text-xs">
                  {skill}
                </Badge>
              ))}
              {cert.skills.length > (isHovered ? 12 : 3) && (
                <span className="text-xs text-muted-foreground self-center">
                  +{cert.skills.length - (isHovered ? 12 : 3)}
                </span>
              )}
            </div>
          )}

          {/* Footer - Pushed to bottom */}
          <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{cert.issueDate || "No date"}</span>
            </div>

            {cert.credentialUrl && (
              <a
                href={cert.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-primary hover:text-white transition-colors font-medium border border-primary/20 hover:border-primary/50 px-3 py-1.5 rounded-full bg-primary/5 hover:bg-primary/10"
              >
                Verify <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const CertificationsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const { data: certifications = [], isLoading } = useCertifications();

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
      id="certifications"
      ref={sectionRef}
      className="section-padding relative overflow-hidden bg-background"
    >
      <CertificationsBackground3D />

      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="container mx-auto container-padding relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary/80 font-mono text-xs tracking-[0.2em] uppercase mb-3 block">Validated Expertise</span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold">
            Certifications <span className="text-primary">&</span> Awards
          </h2>
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : certifications.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
            {certifications.map((cert, index) => (
              <Certification3DCard key={cert.id || index} cert={cert} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-muted-foreground border border-dashed border-white/10 rounded-2xl">
            No certifications added yet.
          </div>
        )}
      </div>
    </section>
  );
};
