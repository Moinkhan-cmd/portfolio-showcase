import { motion, useScroll, useSpring } from "framer-motion";

export const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-primary to-purple-500 origin-left z-[99999]"
      style={{ scaleX }}
    >
      <div className="absolute inset-0 bg-white/20 blur-[2px]" />
    </motion.div>
  );
};
