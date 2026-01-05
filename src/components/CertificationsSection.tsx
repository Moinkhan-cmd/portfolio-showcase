import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, ExternalLink, Calendar, Loader2, Image as ImageIcon, Hash, ChevronDown, ChevronUp } from "lucide-react";
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

  const showVerify = Boolean(cert.credentialUrl && cert.credentialUrl !== "#");
  const skills = Array.isArray(cert.skills) ? cert.skills : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, delay: index * 0.06 }}
      whileHover={{ y: -8 }}
      className="glass-enhanced rounded-2xl overflow-hidden border border-primary/10 card-hover"
    >
      {/* Image */}
      <div className="relative aspect-[16/9] bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
        {cert.imageUrl && !imageError ? (
          <>
            <img
              src={cert.imageUrl}
              alt={`${cert.title} certificate`}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
              onError={() => setImageError(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="p-4 rounded-2xl bg-background/40 border border-border/40 backdrop-blur">
              <ImageIcon className="w-8 h-8 text-primary/70" />
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-display text-lg sm:text-xl font-semibold leading-snug truncate">
              {cert.title}
            </h3>
            <div className="flex items-center gap-2 mt-1 text-primary/90 font-medium">
              <Award className="w-4 h-4 shrink-0" />
              <span className="truncate">{cert.issuer}</span>
            </div>
          </div>
          {showVerify && (
            <a
              href={cert.credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold border border-primary/25 bg-primary/10 hover:bg-primary/15 hover:border-primary/40 transition-colors"
            >
              Verify
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>

        {/* Meta */}
        <div className="flex flex-wrap gap-2 mt-4 text-muted-foreground">
          {cert.issueDate && (
            <Badge variant="secondary" className="gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {cert.issueDate}
            </Badge>
          )}
          {cert.credentialId && (
            <Badge variant="outline" className="gap-1.5 border-primary/20">
              <Hash className="w-3.5 h-3.5" />
              {cert.credentialId}
            </Badge>
          )}
        </div>

        {/* Description */}
        {cert.description && (
          <p className="text-sm text-muted-foreground leading-relaxed mt-4 line-clamp-3">
            {cert.description}
          </p>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {skills.slice(0, 8).map((skill) => (
              <Badge key={skill} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {skills.length > 8 && (
              <Badge variant="secondary" className="text-xs">
                +{skills.length - 8}
              </Badge>
            )}
          </div>
        )}
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
      className="section-padding relative bg-secondary/30 overflow-hidden"
    >
      <CertificationsBackground3D />

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
        <div className={`text-center mb-10 sm:mb-16 ${isVisible ? "animate-slide-up" : "opacity-0"}`}>
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="text-primary text-sm font-medium uppercase tracking-wider inline-flex items-center gap-2 mb-2"
          >
            <Award className="w-4 h-4" />
            Credentials
          </motion.span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mt-3 sm:mt-4">
            My <span className="gradient-text">Certifications</span>
          </h2>
          <p className="text-muted-foreground mt-3 sm:mt-4 max-w-2xl mx-auto text-sm sm:text-base px-4">
            Professional certifications that validate skills and continuous learning.
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : certifications.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {certifications.map((cert, index) => (
              <CertificationCard key={cert.id || index} cert={cert} index={index} />
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
