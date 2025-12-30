import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export const SectionDivider = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const width = useTransform(scrollYProgress, [0, 0.5, 1], ["0%", "100%", "0%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 1, 0.3]);

  return (
    <div ref={ref} className="relative py-20 overflow-hidden">
      {/* Animated line */}
      <motion.div
        style={{ width, opacity }}
        className="h-[2px] mx-auto bg-gradient-to-r from-transparent via-primary to-transparent"
      />
      
      {/* Glowing effect */}
      <motion.div
        style={{ width, opacity }}
        className="h-[2px] mx-auto bg-gradient-to-r from-transparent via-primary/50 to-transparent blur-md absolute top-20 left-0 right-0"
      />
      
      {/* Particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-primary rounded-full"
          style={{
            left: `${5 + i * 4.5}%`,
            top: "50%",
          }}
          animate={{
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut",
          }}
        />
      ))}
      
      {/* Orbit circles */}
      <motion.div
        className="absolute left-1/2 top-1/2 w-32 h-32 border border-primary/20 rounded-full"
        style={{ marginLeft: '-4rem', marginTop: '-4rem' }}
        animate={{
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      
      <motion.div
        className="absolute left-1/2 top-1/2 w-24 h-24 border border-primary/30 rounded-full"
        style={{ marginLeft: '-3rem', marginTop: '-3rem' }}
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
};
