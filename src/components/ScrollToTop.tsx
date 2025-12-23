import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ArrowUp, Sparkles } from "lucide-react";

export const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollYProgress } = useScroll();
  
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div className="fixed bottom-8 right-8 z-50">
          {/* Orbiting particles */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-primary rounded-full"
              style={{
                left: "50%",
                top: "50%",
              }}
              animate={{
                x: [0, Math.cos((i * Math.PI) / 4) * 60],
                y: [0, Math.sin((i * Math.PI) / 4) * 60],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}

          <motion.button
            initial={{ opacity: 0, scale: 0, rotate: -180, y: 100 }}
            animate={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0, rotate: 180, y: 100 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
            }}
            onClick={scrollToTop}
            className="relative p-5 glass-card rounded-full group cursor-pointer overflow-hidden"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.85 }}
            aria-label="Scroll to top"
          >
            {/* Rotating background gradient */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-primary/40 via-primary/20 to-accent/40 rounded-full"
              style={{ rotate }}
            />
            
            {/* Pulsing rings */}
            {[1, 2, 3].map((ring) => (
              <motion.div
                key={ring}
                className="absolute inset-0 rounded-full border-2 border-primary/30"
                animate={{
                  scale: [1, 1.5 + ring * 0.3, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{
                  duration: 2 + ring * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: ring * 0.3,
                }}
              />
            ))}
            
            {/* Icon with rotation */}
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ArrowUp className="w-6 h-6 text-primary relative z-10" />
            </motion.div>
            
            {/* Sparkle effect on hover */}
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
            >
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    left: `${25 + i * 15}%`,
                    top: `${25 + i * 15}%`,
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    rotate: [0, 180, 360],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                >
                  <Sparkles className="w-3 h-3 text-primary" />
                </motion.div>
              ))}
            </motion.div>
            
            {/* Mega glow effect */}
            <motion.div
              className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100"
              style={{
                boxShadow: "0 0 60px hsl(175 80% 50% / 0.8), 0 0 120px hsl(175 80% 50% / 0.4)",
              }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
