import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
}

export const ScrollReveal = ({ children, delay = 0 }: ScrollRevealProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100, scale: 0.8, rotateX: -15 }}
      whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
      viewport={{ once: false, margin: "-100px", amount: 0.3 }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
        scale: { duration: 0.6 },
        rotateX: { duration: 0.8 },
      }}
    >
      {children}
    </motion.div>
  );
};

export const ScrollScale = ({ children }: { children: ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.8, 1.05, 1.05, 0.8]);
  const rotate = useTransform(scrollYProgress, [0, 0.5, 1], [-5, 0, 5]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <motion.div
      ref={ref}
      style={{ scale, rotate, opacity }}
      className="scroll-optimized"
    >
      {children}
    </motion.div>
  );
};

export const Scroll3D = ({ children }: { children: ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [15, 0, -15]);
  const rotateY = useTransform(scrollYProgress, [0, 0.5, 1], [-10, 0, 10]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0.5]);

  return (
    <motion.div
      ref={ref}
      style={{ y, rotateX, rotateY, opacity }}
      className="scroll-optimized"
      transition={{ type: "spring", stiffness: 50, damping: 20 }}
    >
      {children}
    </motion.div>
  );
};
