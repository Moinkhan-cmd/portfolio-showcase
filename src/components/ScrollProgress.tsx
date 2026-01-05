import { motion, useScroll, useSpring, useTransform } from "framer-motion";

export const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Create gradient animation based on scroll progress
  const gradientPosition = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 origin-left z-[99999] overflow-hidden"
      style={{ scaleX, opacity }}
    >
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-primary via-purple-500 to-pink-500"
        style={{
          backgroundSize: "200% 100%",
          backgroundPosition: gradientPosition,
        }}
      />
      
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 bg-white/30 blur-sm"
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
        animate={{
          x: ["-100%", "200%"],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </motion.div>
  );
};
