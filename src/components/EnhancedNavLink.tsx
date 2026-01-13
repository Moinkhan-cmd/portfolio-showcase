import { useRef, useState, MouseEvent, useEffect } from "react";
import { motion, useMotionTemplate, useMotionValue, animate } from "framer-motion";

interface EnhancedNavLinkProps {
  link: { name: string; href: string };
  isActive: boolean;
  onClick: () => void;
  index: number;
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

export const EnhancedNavLink = ({ link, isActive, onClick, index }: EnhancedNavLinkProps) => {
  const linkRef = useRef<HTMLButtonElement>(null);
  const isMobile = useIsMobile();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const radius = 100;

  const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    if (!linkRef.current || isMobile) return;
    const { left, top } = linkRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    mouseX.set(x);
    mouseY.set(y);
  };

  // Simplified mobile version without heavy animations
  if (isMobile) {
    return (
      <li className="relative">
        <button
          ref={linkRef}
          type="button"
          onClick={onClick}
          className={`relative text-sm font-medium tracking-wide px-6 py-2.5 rounded-full overflow-hidden ${
            isActive ? "text-white bg-white/10" : "text-zinc-400"
          }`}
        >
          <span className="relative z-10">{link.name}</span>
        </button>
      </li>
    );
  }

  return (
    <motion.li
      className="relative"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1, type: "spring", stiffness: 300, damping: 30 }}
    >
      <motion.button
        ref={linkRef}
        type="button"
        onClick={onClick}
        onMouseMove={handleMouseMove}
        className={`group relative text-sm font-medium tracking-wide transition-all duration-500 px-6 py-2.5 rounded-full overflow-hidden ${isActive
            ? "text-white"
            : "text-zinc-400 hover:text-white"
          }`}
        style={{ transformStyle: "preserve-3d" }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Active State Background - Subtle and Clean */}
        {isActive && (
          <motion.div
            layoutId="activeTab"
            className="absolute inset-0 bg-white/10 backdrop-blur-md border border-white/10 rounded-full"
            style={{ borderRadius: 9999 }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}

        {/* Spotlight Effect */}
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-full opacity-0 transition duration-300 group-hover:opacity-100"
          style={{
            background: useMotionTemplate`
              radial-gradient(
                ${radius}px circle at ${mouseX}px ${mouseY}px,
                rgba(255,255,255,0.15),
                transparent 80%
              )
            `,
          }}
        />

        {/* Text Content with subtle glow on hover */}
        <span className="relative z-10 flex items-center justify-center">
          {link.name}
          {isActive && (
            <motion.div
              className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full shadow-[0_0_10px_var(--primary)]"
              layoutId="activeDot"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
        </span>
      </motion.button>
    </motion.li>
  );
};
