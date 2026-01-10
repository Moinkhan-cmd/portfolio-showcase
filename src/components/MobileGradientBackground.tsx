import { memo } from "react";
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

  // Static gradients only - no animations for performance
  return (
    <div 
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      style={{ zIndex: 0 }}
    >
      {/* Primary gradient - top corner */}
      <div
        className={`absolute -top-1/4 -right-1/4 w-[80%] h-[80%] bg-gradient-to-bl ${gradients.primary} blur-3xl`}
      />
      
      {/* Secondary gradient - bottom corner */}
      <div
        className={`absolute -bottom-1/4 -left-1/4 w-[70%] h-[70%] bg-gradient-to-tr ${gradients.secondary} blur-3xl`}
      />
      
      {/* Center accent glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full blur-3xl"
        style={{ 
          background: `radial-gradient(circle, ${gradients.accentColor} 0%, transparent 70%)` 
        }}
      />
    </div>
  );
});

MobileGradientBackground.displayName = "MobileGradientBackground";
