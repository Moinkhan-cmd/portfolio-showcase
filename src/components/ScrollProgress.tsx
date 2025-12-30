import { motion, useScroll, useSpring, useTransform } from "framer-motion";

export const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Create pulsing glow effect based on scroll
  const glowIntensity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 1, 0.3]);

  return (
    <>
      {/* Main progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary to-accent origin-left z-[100]"
        style={{ scaleX }}
      />
      
      {/* Glow layers */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary/60 via-primary/60 to-accent/60 origin-left z-[99] blur-sm"
        style={{ scaleX, opacity: glowIntensity }}
      />
      
      <motion.div
        className="fixed top-0 left-0 right-0 h-3 bg-gradient-to-r from-primary/40 via-primary/40 to-accent/40 origin-left z-[98] blur-md"
        style={{ scaleX, opacity: glowIntensity }}
      />
      
      <motion.div
        className="fixed top-0 left-0 right-0 h-4 bg-gradient-to-r from-primary/20 via-primary/20 to-accent/20 origin-left z-[97] blur-lg"
        style={{ scaleX, opacity: glowIntensity }}
      />
    </>
  );
};
