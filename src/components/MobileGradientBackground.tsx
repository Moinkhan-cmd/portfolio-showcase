import { memo } from "react";
import { motion } from "framer-motion";
import { use3DPerformance } from "@/hooks/use3DPerformance";

interface MobileGradientBackgroundProps {
  variant?: "hero" | "about" | "skills" | "projects" | "experience" | "certifications" | "contact";
  className?: string;
}

const gradientVariants = {
  hero: {
    primary: "from-cyan-500/10 via-purple-500/5 to-transparent",
    secondary: "from-purple-500/8 via-pink-500/5 to-transparent",
    accentColor: "rgba(6, 182, 212, 0.15)",
  },
  about: {
    primary: "from-cyan-500/8 via-transparent to-transparent",
    secondary: "from-purple-500/6 via-transparent to-transparent",
    accentColor: "rgba(139, 92, 246, 0.1)",
  },
  skills: {
    primary: "from-purple-500/10 via-cyan-500/5 to-transparent",
    secondary: "from-pink-500/6 via-transparent to-transparent",
    accentColor: "rgba(6, 182, 212, 0.12)",
  },
  projects: {
    primary: "from-cyan-500/8 via-purple-500/5 to-transparent",
    secondary: "from-amber-500/5 via-transparent to-transparent",
    accentColor: "rgba(139, 92, 246, 0.1)",
  },
  experience: {
    primary: "from-purple-500/8 via-cyan-500/4 to-transparent",
    secondary: "from-cyan-500/6 via-transparent to-transparent",
    accentColor: "rgba(6, 182, 212, 0.1)",
  },
  certifications: {
    primary: "from-amber-500/8 via-purple-500/4 to-transparent",
    secondary: "from-cyan-500/5 via-transparent to-transparent",
    accentColor: "rgba(251, 191, 36, 0.12)",
  },
  contact: {
    primary: "from-pink-500/8 via-purple-500/5 to-transparent",
    secondary: "from-cyan-500/6 via-transparent to-transparent",
    accentColor: "rgba(236, 72, 153, 0.1)",
  },
};

export const MobileGradientBackground = memo(({ 
  variant = "hero",
  className = "" 
}: MobileGradientBackgroundProps) => {
  const { isMobile } = use3DPerformance();

  // Only show on mobile/touch devices
  if (!isMobile) {
    return null;
  }

  const gradients = gradientVariants[variant];

  return (
    <div 
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      style={{ zIndex: 0 }}
    >
      {/* Primary gradient - top corner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className={`absolute -top-1/4 -right-1/4 w-[80%] h-[80%] bg-gradient-to-bl ${gradients.primary} blur-3xl`}
      />
      
      {/* Secondary gradient - bottom corner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.3 }}
        className={`absolute -bottom-1/4 -left-1/4 w-[70%] h-[70%] bg-gradient-to-tr ${gradients.secondary} blur-3xl`}
      />
      
      {/* Center accent glow */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, delay: 0.5 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full blur-3xl"
        style={{ 
          background: `radial-gradient(circle, ${gradients.accentColor} 0%, transparent 70%)` 
        }}
      />

      {/* Subtle animated floating orbs */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/4 right-1/4 w-32 h-32 rounded-full bg-cyan-500/10 blur-2xl"
      />
      <motion.div
        animate={{
          y: [0, 15, 0],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute bottom-1/3 left-1/4 w-24 h-24 rounded-full bg-purple-500/10 blur-2xl"
      />

      {/* Noise texture overlay for premium feel */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
});

MobileGradientBackground.displayName = "MobileGradientBackground";
