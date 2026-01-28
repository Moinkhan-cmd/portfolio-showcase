import { motion } from "framer-motion";
import { ReactNode, useRef, MouseEvent, useEffect, useState } from "react";

interface Card3DProps {
  children: ReactNode;
  className?: string;
  intensity?: number;
}

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(isTouchDevice || isMobileUA);
    };
    checkMobile();
  }, []);
  
  return isMobile;
};

export const Card3D = ({ children, className = "", intensity = 15 }: Card3DProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || isMobile) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -intensity;
    const rotateY = ((x - centerX) / centerX) * intensity;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current || isMobile) return;
    cardRef.current.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
  };

  // Frosted glass base classes
  const frostedGlassClasses = "relative bg-white/[0.08] dark:bg-white/[0.05] backdrop-blur-2xl border border-white/20 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-white/10 before:via-transparent before:to-transparent before:pointer-events-none after:absolute after:inset-x-4 after:top-0 after:h-px after:bg-gradient-to-r after:from-transparent after:via-white/20 after:to-transparent after:pointer-events-none";

  // On mobile, render without 3D transforms
  if (isMobile) {
    return (
      <div ref={cardRef} className={`${frostedGlassClasses} ${className}`}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={cardRef}
      className={`${frostedGlassClasses} transform-3d transition-all duration-300 ease-out hover:bg-white/[0.12] dark:hover:bg-white/[0.08] hover:border-white/30 dark:hover:border-white/15 ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: "preserve-3d",
      }}
    >
      <div style={{ transform: "translateZ(50px)" }} className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};
