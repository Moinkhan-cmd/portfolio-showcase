import { memo } from "react";

interface StaticGradientFallbackProps {
  variant?: "hero" | "about" | "skills" | "projects" | "experience" | "certifications" | "contact" | "footer";
  className?: string;
}

const gradientConfigs = {
  hero: {
    primary: "from-cyan-500/15 via-purple-500/10 to-transparent",
    secondary: "from-purple-500/12 via-pink-500/8 to-transparent",
    accent: "rgba(6, 182, 212, 0.2)",
    orbs: [
      { position: "top-10 right-20", size: "w-64 h-64", color: "bg-cyan-500/20" },
      { position: "bottom-20 left-10", size: "w-48 h-48", color: "bg-purple-500/15" },
    ],
  },
  about: {
    primary: "from-cyan-500/12 via-transparent to-transparent",
    secondary: "from-purple-500/10 via-transparent to-transparent",
    accent: "rgba(139, 92, 246, 0.15)",
    orbs: [
      { position: "top-20 left-1/4", size: "w-56 h-56", color: "bg-cyan-500/15" },
      { position: "bottom-10 right-1/3", size: "w-40 h-40", color: "bg-purple-500/12" },
    ],
  },
  skills: {
    primary: "from-purple-500/15 via-cyan-500/8 to-transparent",
    secondary: "from-pink-500/10 via-transparent to-transparent",
    accent: "rgba(6, 182, 212, 0.18)",
    orbs: [
      { position: "top-1/4 right-1/4", size: "w-52 h-52", color: "bg-purple-500/18" },
      { position: "bottom-1/4 left-1/4", size: "w-44 h-44", color: "bg-cyan-500/15" },
    ],
  },
  projects: {
    primary: "from-cyan-500/12 via-purple-500/8 to-transparent",
    secondary: "from-amber-500/8 via-transparent to-transparent",
    accent: "rgba(139, 92, 246, 0.15)",
    orbs: [
      { position: "top-16 left-20", size: "w-48 h-48", color: "bg-cyan-500/15" },
      { position: "bottom-20 right-16", size: "w-52 h-52", color: "bg-amber-500/12" },
    ],
  },
  experience: {
    primary: "from-purple-500/12 via-cyan-500/6 to-transparent",
    secondary: "from-cyan-500/10 via-transparent to-transparent",
    accent: "rgba(6, 182, 212, 0.15)",
    orbs: [
      { position: "top-1/3 right-1/4", size: "w-44 h-44", color: "bg-purple-500/15" },
      { position: "bottom-1/3 left-1/4", size: "w-40 h-40", color: "bg-cyan-500/12" },
    ],
  },
  certifications: {
    primary: "from-amber-500/12 via-purple-500/6 to-transparent",
    secondary: "from-cyan-500/8 via-transparent to-transparent",
    accent: "rgba(251, 191, 36, 0.18)",
    orbs: [
      { position: "top-20 left-1/3", size: "w-48 h-48", color: "bg-amber-500/15" },
      { position: "bottom-16 right-1/4", size: "w-44 h-44", color: "bg-purple-500/12" },
    ],
  },
  contact: {
    primary: "from-pink-500/12 via-purple-500/8 to-transparent",
    secondary: "from-cyan-500/10 via-transparent to-transparent",
    accent: "rgba(236, 72, 153, 0.15)",
    orbs: [
      { position: "top-1/4 right-1/3", size: "w-52 h-52", color: "bg-pink-500/15" },
      { position: "bottom-1/4 left-1/3", size: "w-44 h-44", color: "bg-purple-500/12" },
    ],
  },
  footer: {
    primary: "from-cyan-500/10 via-purple-500/6 to-transparent",
    secondary: "from-pink-500/8 via-transparent to-transparent",
    accent: "rgba(6, 182, 212, 0.12)",
    orbs: [
      { position: "top-10 left-1/4", size: "w-40 h-40", color: "bg-cyan-500/12" },
      { position: "bottom-10 right-1/4", size: "w-36 h-36", color: "bg-pink-500/10" },
    ],
  },
};

/**
 * Static gradient fallback for when WebGL is not supported or fails
 * Provides a visually appealing alternative to 3D backgrounds
 */
export const StaticGradientFallback = memo(({ 
  variant = "hero",
  className = "" 
}: StaticGradientFallbackProps) => {
  const config = gradientConfigs[variant];

  return (
    <div 
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {/* Primary gradient - top area */}
      <div
        className={`absolute -top-1/4 -right-1/4 w-[90%] h-[90%] bg-gradient-to-bl ${config.primary} rounded-full`}
        style={{ filter: 'blur(60px)' }}
      />
      
      {/* Secondary gradient - bottom area */}
      <div
        className={`absolute -bottom-1/4 -left-1/4 w-[80%] h-[80%] bg-gradient-to-tr ${config.secondary} rounded-full`}
        style={{ filter: 'blur(60px)' }}
      />
      
      {/* Center radial accent */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] rounded-full"
        style={{ 
          background: `radial-gradient(circle, ${config.accent} 0%, transparent 70%)`,
          filter: 'blur(50px)'
        }}
      />

      {/* Decorative orbs for depth */}
      {config.orbs.map((orb, index) => (
        <div
          key={index}
          className={`absolute ${orb.position} ${orb.size} ${orb.color} rounded-full`}
          style={{ filter: 'blur(40px)' }}
        />
      ))}

      {/* Subtle noise texture overlay for visual interest */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
});

StaticGradientFallback.displayName = "StaticGradientFallback";
