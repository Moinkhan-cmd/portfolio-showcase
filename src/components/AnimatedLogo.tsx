import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const logoText = "Moinkhan";
const colors = ["#06b6d4", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#f43f5e", "#14b8a6"];

interface AnimatedLogoProps {
  onClick: (e: React.MouseEvent) => void;
}

export const AnimatedLogo = ({ onClick }: AnimatedLogoProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.a
      href="#"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="font-signature text-xl sm:text-2xl md:text-3xl lg:text-4xl relative group flex items-center gap-2 sm:gap-3 min-w-0 flex-shrink-0 cursor-pointer"
      whileHover={{ scale: 1.08, y: -2 }}
      whileTap={{ scale: 0.95 }}
      style={{ transformStyle: "preserve-3d" }}
    >
      <motion.span
        className="relative flex-shrink-0"
        animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
        transition={{ 
          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
          scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        }}
        whileHover={{ scale: 1.5, rotate: 720, transition: { duration: 0.8 } }}
        style={{ transform: "translateZ(25px)" }}
      >
        <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-primary drop-shadow-[0_0_12px_rgba(6,182,212,0.9)]" />
        <motion.span
          className="absolute inset-0 bg-primary rounded-full blur-lg -z-10"
          animate={{ opacity: [0.4, 0.9, 0.4], scale: [1, 1.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.span
          className="absolute inset-0 bg-cyan-400 rounded-full blur-xl -z-20"
          animate={{ opacity: [0.2, 0.6, 0.2], scale: [1.2, 1.8, 1.2] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </motion.span>

      <span className="relative italic font-light tracking-wider truncate">
        {logoText.split("").map((letter, index) => (
          <motion.span
            key={index}
            className="inline-block relative"
            initial={{ opacity: 0, y: 20, rotateX: -90 }}
            animate={{ 
              opacity: 1, y: 0, rotateX: 0,
              color: isHovered ? colors[index % colors.length] : "hsl(var(--foreground))",
            }}
            transition={{ delay: index * 0.05, duration: 0.5, type: "spring" }}
            whileHover={{
              scale: 1.3, rotate: [0, -10, 10, 0], y: -8,
              color: colors[index % colors.length],
              textShadow: `0 0 20px ${colors[index % colors.length]}aa`,
              transition: { duration: 0.3, type: "spring" }
            }}
            style={{ transformStyle: "preserve-3d", display: "inline-block" }}
          >
            <motion.span
              className="absolute inset-0 -z-10"
              style={{
                transform: "translateZ(-5px)",
                color: isHovered ? colors[index % colors.length] : "hsl(var(--primary))",
                opacity: 0.3, filter: "blur(2px)"
              }}
            >
              {letter}
            </motion.span>
            <motion.span
              style={{ transform: "translateZ(20px)" }}
              animate={isHovered ? {
                textShadow: [
                  `0 0 10px ${colors[index % colors.length]}aa`,
                  `0 0 30px ${colors[index % colors.length]}88`,
                  `0 0 10px ${colors[index % colors.length]}aa`,
                ],
              } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {letter}
            </motion.span>
          </motion.span>
        ))}
      </span>
      
      <motion.span
        className="absolute -bottom-1 left-0 h-[3px] rounded-full"
        initial={{ width: 0, opacity: 0 }}
        animate={isHovered ? { 
          width: "100%", opacity: 1,
          background: [
            "linear-gradient(90deg, #06b6d4, #8b5cf6, #ec4899)",
            "linear-gradient(90deg, #8b5cf6, #ec4899, #06b6d4)",
            "linear-gradient(90deg, #ec4899, #06b6d4, #8b5cf6)",
          ],
        } : { width: 0, opacity: 0 }}
        transition={{ 
          width: { duration: 0.4 },
          background: { duration: 3, repeat: Infinity }
        }}
        style={{
          boxShadow: isHovered ? "0 0 20px rgba(6,182,212,0.8)" : "none",
          transform: "translateZ(15px)"
        }}
      />
    </motion.a>
  );
};
