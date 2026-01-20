import { useEffect, useRef, useState, useMemo, lazy, Suspense } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { 
  Award, ExternalLink, Calendar, Loader2, Image as ImageIcon, Hash, 
  ChevronDown, ChevronUp, Star, Sparkles, CheckCircle2, Zap, Search, 
  Filter, X, Grid3x3, List, SortAsc, SortDesc, Tag, Building2, 
  TrendingUp, Eye, Download, Share2, Copy, Check
} from "lucide-react";
import { useIsMobile } from "@/hooks/useIsMobile";
import { MobileGradientBackground } from "./MobileGradientBackground";
import { useCertifications } from "@/hooks/useCertifications";
import type { Certification } from "@/lib/admin/certifications";
import { getDeviceFlags } from "@/lib/device";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { LazyImage } from "@/components/ui/lazy-image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { shouldEnable3D } from "@/hooks/use3DPerformance";

const CertificationsBackground3D = lazy(async () => {
  const mod = await import("./CertificationsBackground3D");
  return { default: mod.CertificationsBackground3D };
});

interface CertificationCardProps {
  cert: Certification;
  index: number;
  onViewDetails: (cert: Certification) => void;
}

const CertificationCard = ({ cert, index, onViewDetails }: CertificationCardProps) => {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const showVerify = Boolean(cert.credentialUrl && cert.credentialUrl !== "#");
  const skills = Array.isArray(cert.skills) ? cert.skills : [];

  // 3D tilt effect - only used on desktop
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 400, damping: 50 });
  const mouseYSpring = useSpring(y, { stiffness: 400, damping: 50 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || isMobile) return;
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

  // Mobile: simplified static card
  if (isMobile) {
    return (
      <div
        ref={cardRef}
        className="group relative cursor-pointer"
        onClick={() => onViewDetails(cert)}
      >
        <div className="relative h-full rounded-3xl overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-card/95 via-card/90 to-card/95">
          {/* Top accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-60 z-30" />

          {/* Certificate Image Section */}
          <div className="relative aspect-[16/9] bg-gradient-to-br from-primary/15 via-primary/8 to-primary/15 overflow-hidden">
            {cert.imageUrl && !imageError ? (
              <>
                <LazyImage
                  src={cert.imageUrl}
                  alt={`${cert.title} certificate`}
                  className="absolute inset-0 w-full h-full"
                  onError={() => setImageError(true)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/60 to-transparent z-10" />
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 via-primary/10 to-primary/20">
                <div className="p-6 rounded-2xl bg-background/50 border-2 border-primary/30">
                  <ImageIcon className="w-12 h-12 text-primary/60" />
                </div>
              </div>
            )}

            {/* Badge overlay */}
            <div className="absolute top-4 right-4 z-30">
              <div className="bg-gradient-to-br from-background/95 to-background/80 rounded-xl px-3 py-2 border-2 border-primary/30 shadow-xl flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                <span className="text-xs font-bold text-primary">Certified</span>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-4 sm:p-5 relative z-20 bg-gradient-to-b from-transparent to-background/50">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <div className="p-1 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30 flex-shrink-0">
                    <Star className="w-3.5 h-3.5 text-primary fill-primary/30" />
                  </div>
                  <h3 className="font-display text-base sm:text-xl font-bold leading-tight text-foreground line-clamp-2">
                    {cert.title}
                  </h3>
                </div>
                <div className="flex items-center gap-2 text-primary/90 font-semibold">
                  <Award className="w-4 h-4 shrink-0" />
                  <span className="truncate text-sm">{cert.issuer}</span>
                </div>
              </div>

              {showVerify && (
                <a
                  href={cert.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold border-2 border-primary/40 bg-gradient-to-r from-primary/20 to-primary/10 transition-all duration-300 touch-manipulation"
                  onClick={(e) => e.stopPropagation()}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            {/* Meta Information */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {cert.issueDate && (
                <Badge variant="secondary" className="gap-1 text-[10px] font-semibold bg-gradient-to-r from-primary/15 to-primary/10 border border-primary/25 touch-manipulation">
                  <Calendar className="w-3 h-3" />
                  <span className="truncate max-w-[120px]">{cert.issueDate}</span>
                </Badge>
              )}
              {cert.credentialId && (
                <Badge variant="outline" className="gap-1 border-primary/30 bg-background/50 text-[10px] font-semibold touch-manipulation">
                  <Hash className="w-3 h-3" />
                  <span className="truncate max-w-[100px]">{cert.credentialId}</span>
                </Badge>
              )}
            </div>

            {/* Description */}
            {cert.description && (
              <p className="text-xs leading-relaxed line-clamp-2 mb-3 text-muted-foreground">
                {cert.description}
              </p>
            )}

            {/* Skills */}
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {skills.slice(0, 5).map((skill) => (
                  <span
                    key={skill}
                    className="text-[10px] px-2 py-0.5 bg-gradient-to-r from-primary/15 via-primary/10 to-primary/15 border border-primary/25 rounded-full text-primary/90 font-semibold touch-manipulation"
                  >
                    {skill}
                  </span>
                ))}
                {skills.length > 5 && (
                  <span className="text-[10px] px-2 py-0.5 bg-muted/50 border border-border rounded-full text-muted-foreground font-semibold">
                    +{skills.length - 5}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Desktop: full animated card
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
      className="group relative cursor-pointer"
      onClick={(e) => {
        // Only trigger card click if overlay is not visible
        if (!isHovered) {
          onViewDetails(cert);
        }
      }}
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

          {/* View Details Button - Appears on Hover */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute inset-0 flex items-center justify-center z-40 bg-background/80 backdrop-blur-sm"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="hero"
                    className="gap-2 shadow-lg shadow-primary/25"
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewDetails(cert);
                    }}
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

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

        {/* Enhanced Content Section - Responsive */}
        <div className="p-4 sm:p-5 md:p-6 lg:p-7 relative z-20 bg-gradient-to-b from-transparent to-background/50">
          {/* Header with enhanced styling - Responsive */}
          <div className="flex items-start justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
            <div className="flex-1 min-w-0">
              <motion.div
                className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2"
                animate={{ x: isHovered ? 4 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="p-1 sm:p-1.5 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30 flex-shrink-0"
                  animate={{
                    scale: isHovered ? 1.15 : 1,
                    rotate: isHovered ? 10 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary fill-primary/30" />
                </motion.div>
                <h3 className="font-display text-base sm:text-xl md:text-2xl font-bold leading-tight bg-gradient-to-r from-foreground via-foreground to-foreground/80 bg-clip-text text-transparent group-hover:from-primary group-hover:via-primary/90 group-hover:to-primary transition-all duration-300 line-clamp-2">
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
                className="shrink-0 inline-flex items-center gap-1.5 sm:gap-2 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-bold border-2 border-primary/40 bg-gradient-to-r from-primary/20 to-primary/10 hover:from-primary/30 hover:to-primary/20 hover:border-primary/60 active:from-primary/25 active:to-primary/15 transition-all duration-300 relative overflow-hidden group/btn touch-manipulation"
                onClick={(e) => e.stopPropagation()}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
              >
                <span className="relative z-10 flex items-center gap-1 sm:gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Verify</span>
                  <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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

          {/* Enhanced Meta Information - Responsive */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
            {cert.issueDate && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 + 0.1 }}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Badge variant="secondary" className="gap-1 sm:gap-1.5 text-[10px] sm:text-xs font-semibold bg-gradient-to-r from-primary/15 to-primary/10 border border-primary/25 hover:border-primary/40 touch-manipulation">
                  <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span className="truncate max-w-[120px] sm:max-w-none">{cert.issueDate}</span>
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
                whileTap={{ scale: 0.95 }}
              >
                <Badge variant="outline" className="gap-1 sm:gap-1.5 border-primary/30 bg-background/50 hover:bg-primary/10 hover:border-primary/50 text-[10px] sm:text-xs font-semibold touch-manipulation">
                  <Hash className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span className="truncate max-w-[100px] sm:max-w-none">{cert.credentialId}</span>
                </Badge>
              </motion.div>
            )}
          </div>

          {/* Enhanced Description - Responsive */}
          {cert.description && (
            <motion.p
              className={cn(
                "text-xs sm:text-sm leading-relaxed line-clamp-2 sm:line-clamp-3 mb-3 sm:mb-4 transition-colors duration-300",
                isHovered ? "text-foreground/90" : "text-muted-foreground"
              )}
            >
              {cert.description}
            </motion.p>
          )}

          {/* Enhanced Skills Section - Responsive */}
          {skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {skills.slice(0, 5).map((skill, i) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 + i * 0.03 }}
                  whileHover={{ scale: 1.15, y: -3, rotate: 2 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 bg-gradient-to-r from-primary/15 via-primary/10 to-primary/15 border border-primary/25 rounded-full text-primary/90 font-semibold hover:bg-primary/20 hover:border-primary/40 active:bg-primary/25 transition-all cursor-default touch-manipulation"
                >
                  {skill}
                </motion.span>
              ))}
              {skills.length > 5 && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 bg-muted/50 border border-border rounded-full text-muted-foreground font-semibold"
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

// Enhanced Certificate Detail Dialog
interface CertificateDetailDialogProps {
  cert: Certification | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CertificateDetailDialog = ({ cert, open, onOpenChange }: CertificateDetailDialogProps) => {
  const [copied, setCopied] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  if (!cert) return null;

  const skills = Array.isArray(cert.skills) ? cert.skills : [];
  const showVerify = Boolean(cert.credentialUrl && cert.credentialUrl !== "#");

  const handleCopyLink = async () => {
    if (cert.credentialUrl && cert.credentialUrl !== "#") {
      try {
        await navigator.clipboard.writeText(cert.credentialUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: cert.title,
          text: `Check out my certification: ${cert.title} from ${cert.issuer}`,
          url: cert.credentialUrl || window.location.href,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl w-full max-h-[95vh] overflow-y-auto p-0 border-0 bg-transparent shadow-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative"
        >
          {/* Enhanced Animated Background with Multiple Layers */}
          <motion.div
            className="absolute -inset-6 rounded-3xl bg-gradient-to-br from-primary/30 via-purple-500/20 to-cyan-500/20 blur-3xl opacity-60"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.6, 0.8, 0.6],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-cyan-500/15 via-primary/10 to-purple-500/15 blur-2xl opacity-40"
            animate={{
              scale: [1.1, 1, 1.1],
              opacity: [0.4, 0.6, 0.4],
              rotate: [0, -5, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Main Content Container with Enhanced Styling */}
          <div className="relative bg-background/98 backdrop-blur-2xl rounded-3xl border-2 border-primary/30 shadow-2xl overflow-hidden">
            {/* Animated Top Border */}
            <motion.div
              className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent"
              animate={{
                scaleX: [0.8, 1, 0.8],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Enhanced Header with Dynamic Gradient */}
            <motion.div
              className="relative px-8 pt-8 pb-6 bg-gradient-to-br from-primary/25 via-primary/15 to-purple-500/20 overflow-hidden"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              {/* Animated mesh gradient overlay */}
              <motion.div
                className="absolute inset-0 opacity-30"
                animate={{
                  backgroundPosition: ["0% 0%", "100% 100%"],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "linear",
                }}
                style={{
                  backgroundImage: `radial-gradient(circle at 20% 50%, rgba(6,182,212,0.3) 0%, transparent 50%),
                                  radial-gradient(circle at 80% 80%, rgba(139,92,246,0.3) 0%, transparent 50%),
                                  radial-gradient(circle at 40% 20%, rgba(236,72,153,0.2) 0%, transparent 50%)`,
                  backgroundSize: "200% 200%",
                }}
              />

              {/* Shine sweep effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{
                  x: ["-100%", "200%"],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatDelay: 3,
                  ease: "linear",
                }}
              />

              {/* Floating particles in header */}
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1.5 h-1.5 bg-primary/60 rounded-full"
                    initial={{
                      x: `${Math.random() * 100}%`,
                      y: `${Math.random() * 100}%`,
                      opacity: 0,
                    }}
                    animate={{
                      y: ["-20%", "120%"],
                      opacity: [0, 1, 0],
                      x: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
                    }}
                    transition={{
                      duration: 4 + Math.random() * 2,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                      ease: "linear",
                    }}
                  />
                ))}
              </div>

              <DialogHeader className="relative z-10">
                <div className="flex items-start gap-4 mb-4">
                  {/* Enhanced Icon Container */}
                  <motion.div
                    className="relative p-4 rounded-2xl bg-background/30 backdrop-blur-xl border-2 border-white/20 shadow-xl"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    whileHover={{ scale: 1.1, rotate: 360 }}
                  >
                    <motion.div
                      className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/40 to-purple-500/40 blur-xl opacity-50"
                      animate={{
                        opacity: [0.5, 0.8, 0.5],
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                    <Award className="w-8 h-8 text-primary relative z-10" />
                    <motion.div
                      className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [1, 0.5, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  </motion.div>

                  <div className="flex-1 min-w-0">
                    <DialogTitle className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent leading-tight">
                      {cert.title}
                    </DialogTitle>
                    <DialogDescription className="text-base mt-2 flex items-center gap-2 text-muted-foreground">
                      <motion.div
                        className="p-1.5 rounded-lg bg-primary/20 border border-primary/30"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <Building2 className="w-5 h-5 text-primary" />
                      </motion.div>
                      <span className="font-semibold">{cert.issuer}</span>
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>
            </motion.div>

            {/* Enhanced Content Section */}
            <div className="p-8 space-y-8">
              {/* Certificate Image with Enhanced Effects */}
              {cert.imageUrl && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="relative group rounded-2xl overflow-hidden border-2 border-primary/30 bg-gradient-to-br from-primary/15 via-primary/10 to-purple-500/15 shadow-2xl"
                >
                  {/* Loading shimmer */}
                  {!imageLoaded && !imageError && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                      animate={{
                        x: ["-100%", "200%"],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  )}

                  {!imageError ? (
                    <>
                      <motion.img
                        src={cert.imageUrl}
                        alt={cert.title}
                        className="w-full h-auto object-cover"
                        onLoad={() => setImageLoaded(true)}
                        onError={() => setImageError(true)}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: imageLoaded ? 1 : 0 }}
                        transition={{ duration: 0.5 }}
                      />
                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent pointer-events-none" />
                      
                      {/* Hover zoom effect container */}
                      <motion.div
                        className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        whileHover={{ scale: 1.02 }}
                      />
                    </>
                  ) : (
                    <div className="flex items-center justify-center p-16 bg-gradient-to-br from-primary/10 to-primary/5">
                      <motion.div
                        animate={{ rotate: [0, 360], scale: [1, 1.1, 1] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      >
                        <ImageIcon className="w-20 h-20 text-primary/40" />
                      </motion.div>
                    </div>
                  )}

                  {/* Corner badges */}
                  <motion.div
                    className="absolute top-4 left-4 px-3 py-1.5 rounded-lg bg-background/90 backdrop-blur-sm border border-primary/30 shadow-lg"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-primary fill-primary/30" />
                      <span className="text-xs font-bold text-primary">Certified</span>
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {/* Enhanced Details Grid with Icons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {cert.issueDate && (
                  <motion.div
                    initial={{ opacity: 0, x: -30, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="relative p-6 rounded-2xl border-2 border-primary/25 bg-gradient-to-br from-primary/15 via-primary/10 to-primary/5 backdrop-blur-sm overflow-hidden group"
                  >
                    {/* Animated background */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                    <div className="flex items-start gap-4 relative z-10">
                      <motion.div
                        className="p-3 rounded-xl bg-primary/20 border border-primary/30 flex-shrink-0"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <Calendar className="w-6 h-6 text-primary" />
                      </motion.div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-muted-foreground mb-2">Issue Date</p>
                        <p className="text-2xl font-bold text-foreground">{cert.issueDate}</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {cert.credentialId && (
                  <motion.div
                    initial={{ opacity: 0, x: 30, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ delay: 0.45, type: "spring", stiffness: 200 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="relative p-6 rounded-2xl border-2 border-primary/25 bg-gradient-to-br from-primary/15 via-primary/10 to-primary/5 backdrop-blur-sm overflow-hidden group"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                    <div className="flex items-start gap-4 relative z-10">
                      <motion.div
                        className="p-3 rounded-xl bg-primary/20 border border-primary/30 flex-shrink-0"
                        whileHover={{ scale: 1.1, rotate: -5 }}
                      >
                        <Hash className="w-6 h-6 text-primary" />
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-muted-foreground mb-2">Credential ID</p>
                        <p className="text-xl font-bold text-foreground font-mono break-all">{cert.credentialId}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Enhanced Description Card */}
              {cert.description && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="relative p-6 rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-card/80 via-card/60 to-card/80 backdrop-blur-sm overflow-hidden"
                >
                  {/* Decorative corner */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                      <motion.div
                        className="p-2 rounded-lg bg-primary/20 border border-primary/30"
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                      >
                        <Sparkles className="w-5 h-5 text-primary" />
                      </motion.div>
                      <h4 className="text-lg font-bold text-foreground">About This Certification</h4>
                    </div>
                    <p className="text-base leading-relaxed text-foreground/90">{cert.description}</p>
                  </div>
                </motion.div>
              )}

              {/* Enhanced Skills Section */}
              {skills.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 }}
                  className="relative p-6 rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-card/80 via-card/60 to-card/80 backdrop-blur-sm"
                >
                  <div className="flex items-center gap-3 mb-5">
                    <motion.div
                      className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30"
                      whileHover={{ scale: 1.1, rotate: 10 }}
                    >
                      <Tag className="w-6 h-6 text-primary" />
                    </motion.div>
                    <h4 className="text-lg font-bold text-foreground">Skills & Technologies</h4>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {skills.map((skill, i) => (
                      <motion.div
                        key={skill}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 + i * 0.05 }}
                        whileHover={{ scale: 1.1, y: -3 }}
                      >
                        <Badge
                          variant="secondary"
                          className="px-4 py-2 text-sm font-semibold bg-gradient-to-r from-primary/20 via-primary/15 to-primary/20 border-2 border-primary/30 text-primary hover:from-primary/30 hover:to-primary/25 hover:border-primary/50 transition-all cursor-default"
                        >
                          <Zap className="w-3.5 h-3.5 mr-1.5" />
                          {skill}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Enhanced Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap gap-4 pt-6 border-t-2 border-primary/20"
              >
                {showVerify && (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 min-w-[180px]"
                  >
                    <Button
                      variant="hero"
                      size="lg"
                      className="w-full gap-2 shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/40 transition-all"
                      asChild
                    >
                      <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer">
                        <CheckCircle2 className="w-5 h-5" />
                        Verify Certificate
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    </Button>
                  </motion.div>
                )}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outline"
                    size="lg"
                    className="gap-2 border-2 border-primary/30 hover:border-primary/50 hover:bg-primary/10"
                    onClick={handleCopyLink}
                  >
                    {copied ? (
                      <>
                        <Check className="w-5 h-5" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-5 h-5" />
                        Copy Link
                      </>
                    )}
                  </Button>
                </motion.div>
                {navigator.share && (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outline"
                      size="lg"
                      className="gap-2 border-2 border-primary/30 hover:border-primary/50 hover:bg-primary/10"
                      onClick={handleShare}
                    >
                      <Share2 className="w-5 h-5" />
                      Share
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export const CertificationsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const { data: certifications = [], isLoading } = useCertifications();
  const isMobile = useIsMobile();

  // Filter and sort state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIssuer, setSelectedIssuer] = useState<string | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"date-desc" | "date-asc" | "title">("date-desc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Extract unique values for filters
  const issuers = useMemo(() => {
    const iss = certifications.map(c => c.issuer).filter(Boolean);
    return Array.from(new Set(iss)).sort();
  }, [certifications]);

  const allSkills = useMemo(() => {
    const skills = certifications.flatMap(c => Array.isArray(c.skills) ? c.skills : []).filter(Boolean);
    return Array.from(new Set(skills)).sort();
  }, [certifications]);

  // Filter and sort certifications
  const filteredCertifications = useMemo(() => {
    let filtered = [...certifications];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(cert =>
        cert.title.toLowerCase().includes(query) ||
        cert.issuer.toLowerCase().includes(query) ||
        cert.description?.toLowerCase().includes(query) ||
        cert.credentialId?.toLowerCase().includes(query) ||
        cert.skills?.some(skill => skill.toLowerCase().includes(query))
      );
    }

    // Issuer filter
    if (selectedIssuer) {
      filtered = filtered.filter(cert => cert.issuer === selectedIssuer);
    }

    // Skill filter
    if (selectedSkill) {
      filtered = filtered.filter(cert =>
        cert.skills?.includes(selectedSkill)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === "date-desc") {
        return new Date(b.issueDate || 0).getTime() - new Date(a.issueDate || 0).getTime();
      } else if (sortBy === "date-asc") {
        return new Date(a.issueDate || 0).getTime() - new Date(b.issueDate || 0).getTime();
      } else {
        return a.title.localeCompare(b.title);
      }
    });

    return filtered;
  }, [certifications, searchQuery, selectedIssuer, selectedSkill, sortBy]);

  // Check if any filters are active
  const hasActiveFilters = searchQuery.trim() !== "" || selectedIssuer !== null || selectedSkill !== null;

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedIssuer(null);
    setSelectedSkill(null);
  };

  const handleViewDetails = (cert: Certification) => {
    setSelectedCert(cert);
    setDialogOpen(true);
  };

  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      // Reset selected cert when dialog closes (after animation)
      setTimeout(() => setSelectedCert(null), 300);
    }
  };

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
      console.warn("CertificationsSection: IntersectionObserver init failed", error);
      setIsVisible(true);
    }

    return () => observer?.disconnect();
  }, []);

  return (
    <section
      id="certifications"
      ref={sectionRef}
      className="section-padding relative overflow-hidden bg-gradient-to-b from-background via-secondary/10 to-background"
    >
      {shouldEnable3D() && (
        <Suspense fallback={null}>
          <CertificationsBackground3D />
        </Suspense>
      )}
      <MobileGradientBackground variant="certifications" />
      {/* Enhanced Background Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/90 to-background/80 pointer-events-none z-10" />
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 0%, hsl(222 47% 6% / 0.2) 50%, hsl(222 47% 6% / 0.5) 100%)",
        }}
      />

      {/* Animated Background Orbs (disabled on mobile for performance) */}
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

        {/* Filter and Control System */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8 sm:mb-12"
        >
          <div className="max-w-6xl mx-auto space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search certifications by title, issuer, skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10 h-11 bg-background/50 backdrop-blur-sm border-primary/20 focus:border-primary/50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-secondary transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              )}
            </div>

            {/* Filter Controls */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Issuer Filter */}
              {issuers.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground font-medium hidden sm:flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5" />
                    Issuer:
                  </span>
                  <Select value={selectedIssuer || "all"} onValueChange={(value) => setSelectedIssuer(value === "all" ? null : value)}>
                    <SelectTrigger className="h-9 w-[180px] bg-background/50 border-primary/20">
                      <SelectValue placeholder="All Issuers" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Issuers</SelectItem>
                      {issuers.map((issuer) => (
                        <SelectItem key={issuer} value={issuer}>
                          {issuer}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Skill Filter */}
              {allSkills.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground font-medium hidden sm:flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" />
                    Skill:
                  </span>
                  <Select value={selectedSkill || "all"} onValueChange={(value) => setSelectedSkill(value === "all" ? null : value)}>
                    <SelectTrigger className="h-9 w-[180px] bg-background/50 border-primary/20">
                      <SelectValue placeholder="All Skills" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Skills</SelectItem>
                      {allSkills.map((skill) => (
                        <SelectItem key={skill} value={skill}>
                          {skill}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Sort */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground font-medium hidden sm:flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  Sort:
                </span>
                <Select value={sortBy} onValueChange={(value) => setSortBy(value as typeof sortBy)}>
                  <SelectTrigger className="h-9 w-[160px] bg-background/50 border-primary/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date-desc">
                      <div className="flex items-center gap-2">
                        <SortDesc className="w-4 h-4" />
                        Newest First
                      </div>
                    </SelectItem>
                    <SelectItem value="date-asc">
                      <div className="flex items-center gap-2">
                        <SortAsc className="w-4 h-4" />
                        Oldest First
                      </div>
                    </SelectItem>
                    <SelectItem value="title">
                      <div className="flex items-center gap-2">
                        <Hash className="w-4 h-4" />
                        By Title
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-xs text-muted-foreground font-medium hidden sm:inline">View:</span>
                <div className="flex rounded-lg border border-primary/20 bg-background/50 p-1">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="h-8 px-3"
                  >
                    <Grid3x3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="h-8 px-3"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <motion.button
                  onClick={clearFilters}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20 transition-all duration-200"
                >
                  <X className="w-3.5 h-3.5" />
                  Clear Filters
                </motion.button>
              )}
            </div>

            {/* Results Count */}
            {hasActiveFilters && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-muted-foreground"
              >
                Showing {filteredCertifications.length} of {certifications.length} certification{filteredCertifications.length !== 1 ? 's' : ''}
              </motion.div>
            )}
          </div>
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
          </div>
        ) : filteredCertifications.length > 0 ? (
          <>
            {viewMode === "grid" ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8 max-w-7xl mx-auto">
                  <AnimatePresence mode="popLayout">
                    {(showAll ? filteredCertifications : filteredCertifications.slice(0, 3)).map((cert, index) => (
                      <motion.div key={cert.id || index} layout>
                        <CertificationCard 
                          cert={cert} 
                          index={index}
                          onViewDetails={handleViewDetails}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
                
                {/* Show More/Less Toggle */}
                {filteredCertifications.length > 3 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="flex justify-center mt-12"
                  >
                    <motion.div
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        onClick={() => setShowAll(!showAll)}
                        variant="outline"
                        size="lg"
                        className="group gap-3 relative overflow-hidden border-2 border-primary/30 hover:border-primary/50 bg-gradient-to-r from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 px-8 py-6 text-base font-semibold"
                      >
                        <span className="relative z-10 flex items-center gap-3">
                          {showAll ? (
                            <>
                              <ChevronUp className="w-5 h-5 transition-transform group-hover:-translate-y-1" />
                              Show Less Certifications
                            </>
                          ) : (
                            <>
                              Show More Certifications ({filteredCertifications.length - 3} more)
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
              <div className="space-y-4 max-w-4xl mx-auto">
                <AnimatePresence mode="popLayout">
                  {filteredCertifications.map((cert, index) => (
                    <motion.div
                      key={cert.id || index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className="group relative"
                      onClick={() => handleViewDetails(cert)}
                    >
                      <motion.div
                        className="relative rounded-2xl overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-card/95 via-card/90 to-card/95 backdrop-blur-xl transition-all duration-300 cursor-pointer"
                        whileHover={{ 
                          y: -4,
                          borderColor: "hsl(175 80% 50% / 0.4)",
                          boxShadow: "0 20px 60px -12px hsl(175 80% 50% / 0.25)"
                        }}
                      >
                        <div className="flex flex-col sm:flex-row gap-4 p-4 sm:p-6">
                          {/* Image */}
                          <div className="relative w-full sm:w-48 h-48 sm:h-auto sm:aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-primary/15 to-primary/8 flex-shrink-0">
                            {cert.imageUrl ? (
                              <img
                                src={cert.imageUrl}
                                alt={cert.title}
                                className="w-full h-full object-cover"
                                loading="lazy"
                                decoding="async"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full">
                                <ImageIcon className="w-12 h-12 text-primary/40" />
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4 mb-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                  <Award className="w-5 h-5 text-primary flex-shrink-0" />
                                  <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground line-clamp-2">
                                    {cert.title}
                                  </h3>
                                </div>
                                <div className="flex items-center gap-2 text-primary/90 font-semibold mb-3">
                                  <Building2 className="w-4 h-4" />
                                  <span className="text-sm">{cert.issuer}</span>
                                </div>
                              </div>
                              {cert.credentialUrl && cert.credentialUrl !== "#" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="shrink-0"
                                  asChild
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer">
                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                    Verify
                                  </a>
                                </Button>
                              )}
                            </div>

                            {cert.description && (
                              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                {cert.description}
                              </p>
                            )}

                            <div className="flex flex-wrap items-center gap-2">
                              {cert.issueDate && (
                                <Badge variant="secondary" className="gap-1.5 text-xs">
                                  <Calendar className="w-3.5 h-3.5" />
                                  {cert.issueDate}
                                </Badge>
                              )}
                              {cert.credentialId && (
                                <Badge variant="outline" className="gap-1.5 text-xs font-mono">
                                  <Hash className="w-3.5 h-3.5" />
                                  {cert.credentialId}
                                </Badge>
                              )}
                              {Array.isArray(cert.skills) && cert.skills.length > 0 && (
                                <>
                                  {cert.skills.slice(0, 3).map((skill) => (
                                    <Badge key={skill} variant="secondary" className="text-xs bg-primary/10 text-primary">
                                      {skill}
                                    </Badge>
                                  ))}
                                  {cert.skills.length > 3 && (
                                    <Badge variant="secondary" className="text-xs">
                                      +{cert.skills.length - 3}
                                    </Badge>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </>
        ) : hasActiveFilters ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 px-6 rounded-2xl border border-dashed border-primary/20 bg-card/30 backdrop-blur-sm max-w-md mx-auto"
          >
            <Filter className="w-12 h-12 text-primary/40 mx-auto mb-4" />
            <p className="text-muted-foreground font-medium">No certifications match your filters.</p>
            <p className="text-sm text-muted-foreground/60 mt-2">Try adjusting your search or filter criteria.</p>
            <Button
              onClick={clearFilters}
              variant="outline"
              className="mt-4"
            >
              Clear All Filters
            </Button>
          </motion.div>
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

      {/* Certificate Detail Dialog */}
      <CertificateDetailDialog
        cert={selectedCert}
        open={dialogOpen}
        onOpenChange={handleDialogOpenChange}
      />
    </section>
  );
};
