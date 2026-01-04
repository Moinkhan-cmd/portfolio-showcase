import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { Award, ExternalLink, Calendar, Loader2 } from "lucide-react";
import { CertificationsBackground3D } from "./CertificationsBackground3D";
import { useCertifications } from "@/hooks/useCertifications";
import type { Certification } from "@/lib/admin/certifications";
import { Badge } from "@/components/ui/badge";

// --- 3D FIXED CARD WITH INTERNAL EXPANSION ---
interface CertificationCardProps {
  cert: Certification;
  index: number;
}

const Certification3DCard = ({ cert, index }: CertificationCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Subtle 3D Tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseYSpring = useSpring(y, { stiffness: 500, damping: 100 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["3deg", "-3deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-3deg", "3deg"]);

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
      onClick={() => setIsHovered(!isHovered)}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="relative group perspective-1000 h-[420px] w-full"
    >
      <div
        className="relative h-full flex flex-col bg-card/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 group-hover:shadow-2xl group-hover:border-primary/30"
        style={{ transform: "translateZ(0px)" }}
      >
        {/* === IMAGE SECTION (Dynamic Height) === */}
        <motion.div
          className="relative w-full overflow-hidden bg-muted/20"
          animate={{ height: isHovered ? "80px" : "180px" }} // Shrinks on hover
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
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
          {/* Gradient Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent ${isHovered ? 'opacity-100' : 'opacity-60'}`} />

          {/* Title Overlay (Visible on Hover when image shrinks) */}
          <motion.div
            className="absolute bottom-2 left-4 right-4 z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
          >
            <h3 className="font-display text-base font-bold text-white truncate shadow-black drop-shadow-md">
              {cert.title}
            </h3>
          </motion.div>
        </motion.div>

        {/* === CONTENT SECTION === */}
        <div className="flex flex-col flex-1 p-5 min-h-0 relative z-10 bg-background/5">
          {/* Header (Hidden on Hover to save space, swapped with image overlay title) */}
          <AnimatePresence>
            {!isHovered && (
              <motion.div
                initial={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-2 shrink-0"
              >
                <h3 className="font-display text-lg font-bold leading-tight text-white group-hover:text-primary transition-colors line-clamp-1">
                  {cert.title}
                </h3>
                <p className="text-sm text-primary/80 mt-1 font-medium truncate">{cert.issuer}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Description (Expands to fill available space) */}
          <motion.div className="flex-1 relative overflow-hidden group/text">
            <div className={`h-full overflow-y-auto pr-2 custom-scrollbar ${isHovered ? '' : 'overflow-hidden'}`}>
              <p className={`text-sm text-muted-foreground leading-relaxed ${isHovered ? '' : 'line-clamp-3'}`}>
                {cert.description || "No description provided for this certification."}
              </p>

              {/* Metadata (Date/Tags) inside scroll area if needed, or stick to bottom */}
              <div className="mt-4 flex flex-wrap gap-2">
                {cert.skills?.map((skill, i) => (
                  <Badge key={i} variant="outline" className="text-[10px] border-white/10 text-muted-foreground">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Bottom Fade for collapsed state */}
            {!isHovered && (
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#0b0f19] to-transparent pointer-events-none" />
            )}
          </motion.div>

          {/* Fixed Footer */}
          <div className="mt-auto pt-3 border-t border-white/5 flex items-center justify-between text-xs text-muted-foreground shrink-0">
            <div className="flex items-center gap-1.5">
              {cert.issueDate && (
                <>
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{cert.issueDate}</span>
                </>
              )}
            </div>
            {cert.credentialUrl && (
              <a
                href={cert.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-primary hover:text-white transition-colors font-medium border border-primary/20 px-3 py-1.5 rounded-md hover:bg-primary/20"
              >
                Verify <ExternalLink className="w-3 h-3 ml-1" />
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
      className="section-padding relative overflow-hidden bg-background/50"
    >
      <CertificationsBackground3D />

      {/* Background Ambience */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background pointer-events-none -z-10" />

      <div className="container mx-auto container-padding relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <Badge variant="outline" className="mb-4 border-primary/20 text-primary">
            <Award className="w-3 h-3 mr-2" />
            Certifications
          </Badge>
          <h2 className="font-display text-4xl sm:text-5xl font-bold">
            Verifiable <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">Credentials</span>
          </h2>
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : certifications.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
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
