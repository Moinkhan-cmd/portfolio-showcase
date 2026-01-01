import { useRef, useState, MouseEvent } from "react";
import { motion } from "framer-motion";

interface EnhancedNavLinkProps {
  link: { name: string; href: string };
  isActive: boolean;
  onClick: () => void;
  index: number;
}

export const EnhancedNavLink = ({ link, isActive, onClick, index }: EnhancedNavLinkProps) => {
  const linkRef = useRef<HTMLButtonElement>(null);
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);

  const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    if (!linkRef.current) return;
    const rect = linkRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    const translateZ = 15;

    linkRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${translateZ}px) scale(1.08)`;
  };

  const handleMouseLeave = () => {
    if (!linkRef.current) return;
    linkRef.current.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)";
  };

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    
    setRipples(prev => [...prev, { x, y, id }]);
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== id));
    }, 800);
    
    onClick();
  };

  return (
    <motion.li
      className="relative"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, type: "spring" }}
    >
      <motion.button
        ref={linkRef}
        type="button"
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`group relative text-sm font-semibold tracking-wide transition-all duration-300 px-4 py-2.5 rounded-xl overflow-hidden ${
          isActive 
            ? "text-primary bg-primary/15 shadow-xl shadow-primary/25" 
            : "text-muted-foreground hover:text-foreground"
        }`}
        style={{ transformStyle: "preserve-3d" }}
        whileTap={{ scale: 0.9 }}
      >
        {/* Magnetic attraction background */}
        <motion.span
          className="absolute inset-0 bg-gradient-to-br from-primary/30 via-cyan-400/20 to-purple-500/30 rounded-xl -z-10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0.8 }}
          whileHover={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        />

        {/* Glossy layer */}
        <motion.span
          className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent rounded-xl -z-10 opacity-0"
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
          style={{ transform: "translateZ(-2px)" }}
        />

        {/* Multi-colored glow */}
        <motion.span
          className="absolute inset-0 rounded-xl blur-xl -z-20 opacity-0"
          style={{
            background: "radial-gradient(circle, rgba(6,182,212,0.4), rgba(139,92,246,0.4))",
          }}
          whileHover={{ opacity: 1, scale: 1.4 }}
          transition={{ duration: 0.4 }}
        />

        {/* Animated shimmer with rainbow effect */}
        <motion.span
          className="absolute inset-0 rounded-xl -z-10 opacity-0"
          style={{
            background: "linear-gradient(135deg, transparent, rgba(6,182,212,0.3), rgba(139,92,246,0.3), rgba(236,72,153,0.3), transparent)",
            backgroundSize: "200% 200%",
          }}
          whileHover={{ 
            opacity: 1,
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{ 
            backgroundPosition: { duration: 1.5, repeat: Infinity, ease: "linear" }
          }}
        />

        {/* Bottom accent line */}
        <motion.span
          className="absolute bottom-0 left-0 right-0 h-[3px] rounded-full"
          style={{
            background: "linear-gradient(90deg, #06b6d4, #8b5cf6, #ec4899, #06b6d4)",
            backgroundSize: "200% 100%",
            boxShadow: "0 0 15px rgba(6, 182, 212, 0.6)",
            transform: "translateZ(8px)"
          }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ 
            scaleX: isActive ? 1 : 0,
            opacity: isActive ? 1 : 0,
            backgroundPosition: isActive ? ["0% 0%", "100% 0%"] : "0% 0%",
          }}
          whileHover={{ scaleX: 1, opacity: 1 }}
          transition={{ 
            scaleX: { duration: 0.3 },
            backgroundPosition: { duration: 2, repeat: Infinity, ease: "linear" }
          }}
        />

        {/* Floating particles */}
        <motion.span
          className="absolute inset-0 pointer-events-none overflow-hidden"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
        >
          {[...Array(6)].map((_, i) => (
            <motion.span
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full"
              style={{
                backgroundColor: ["#06b6d4", "#8b5cf6", "#ec4899"][i % 3],
                left: "50%",
                top: "50%",
              }}
              whileHover={{
                x: [0, Math.cos((i * Math.PI * 2) / 6) * 40],
                y: [0, Math.sin((i * Math.PI * 2) / 6) * 40],
                scale: [0, 1.2, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.1,
                ease: "easeOut",
              }}
            />
          ))}
        </motion.span>

        {/* Click ripple effects */}
        {ripples.map(ripple => (
          <motion.span
            key={ripple.id}
            className="absolute rounded-full bg-primary/30"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: 10,
              height: 10,
              marginLeft: -5,
              marginTop: -5,
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 8, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        ))}

        <span className="relative z-10 drop-shadow-lg" style={{ transform: "translateZ(12px)" }}>
          {link.name}
        </span>
      </motion.button>
    </motion.li>
  );
};
