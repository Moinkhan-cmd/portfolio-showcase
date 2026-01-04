import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { Award, ExternalLink, Calendar, Sparkles, Loader2 } from "lucide-react";
import { CertificationsBackground3D } from "./CertificationsBackground3D";
import { useCertifications } from "@/hooks/useCertifications";
import type { Certification } from "@/lib/admin/certifications";
import { Badge } from "@/components/ui/badge";

// --- 3D POP-OUT CARD ---
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
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

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
    <div className="relative h-full" onMouseEnter={() => setIsHovered(true)} onMouseLeave={handleMouseLeave}>
      {/* Placeholder to maintain grid space */}
      <div className="invisible p-6">
        <div className="h-64" /> {/* Approximate height */}
      </div>

      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        onMouseMove={handleMouseMove}
        style={{
          rotateX: isHovered ? 0 : rotateX, // Reset tilt on hover to read text easier
          rotateY: isHovered ? 0 : rotateY,
          zIndex: isHovered ? 50 : 1,
          scale: isHovered ? 1.05 : 1,
        }}
        className={`absolute inset-0 w-full transition-all duration-300 ease-out perspective-1000 ${isHovered ? 'h-auto min-h-full' : 'h-full'}`}
      >
        <div
          className={`relative flex flex-col bg-secondary/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ${isHovered ? 'ring-2 ring-primary/50 bg-secondary/95 z-50' : ''}`}
        >
          {/* Shine Effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 pointer-events-none" />

          {/* Image Banner */}
          <div className="relative h-32 shrink-0 overflow-hidden bg-muted/20">
            {cert.imageUrl ? (
              <img
                src={cert.imageUrl}
                alt={cert.title}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" // Simple scale on hover
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Award className="w-12 h-12 text-primary/20" />
              </div>
            )}
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-secondary via-transparent to-transparent" />
          </div>

          <div className="p-5 flex flex-col flex-1">
            {/* Header */}
            <div className="mb-3">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-display text-lg font-bold leading-tight text-white group-hover:text-primary transition-colors">
                  {cert.title}
                </h3>
                <div className="p-1.5 rounded-lg bg-primary/10">
                  <Award className="w-4 h-4 text-primary" />
                </div>
              </div>
              <p className="text-sm text-primary/80 font-medium mt-1">{cert.issuer}</p>
            </div>

            {/* Description - The Reveal Magic */}
            <div className="relative mb-4 group/desc">
              <motion.div
                animate={{ height: isHovered ? "auto" : 60 }} // Expands height
                className="overflow-hidden text-sm text-muted-foreground leading-relaxed"
              >
                {cert.description || "No description provided."}
              </motion.div>
              {!isHovered && cert.description && cert.description.length > 80 && (
                <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-secondary to-transparent" />
              )}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {(cert.skills || []).slice(0, isHovered ? 20 : 4).map((skill, i) => (
                <span key={i} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-[10px] text-muted-foreground">
                  {skill}
                </span>
              ))}
              {!isHovered && (cert.skills || []).length > 4 && (
                <span className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] text-muted-foreground">+{(cert.skills?.length || 0) - 4}</span>
              )}
            </div>

            {/* Footer */}
            <div className="mt-auto pt-3 border-t border-white/5 flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{cert.issueDate || "No date"}</span>
              </div>
              {cert.credentialUrl && (
                <a
                  href={cert.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-primary hover:text-white transition-colors font-medium "
                >
                  Verify <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
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
      className="section-padding relative overflow-hidden perspective-2000"
    >
      <CertificationsBackground3D />

      {/* Cinematic Overlays */}
      <div className="absolute inset-0 bg-background/80 pointer-events-none -z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-50 pointer-events-none" />

      <div className="container mx-auto container-padding relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-mono text-sm tracking-widest uppercase">Verified Skills</span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold mt-2">
            Professional <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">Credentials</span>
          </h2>
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : certifications.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {certifications.map((cert, index) => (
              <Certification3DCard key={cert.id || index} cert={cert} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-muted-foreground">No credentials found.</div>
        )}
      </div>
    </section>
  );
};
