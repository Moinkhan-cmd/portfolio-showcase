import { motion, useInView, Variants } from "framer-motion";
import { useRef, ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  variant?: "fadeUp" | "fadeDown" | "fadeLeft" | "fadeRight" | "scale" | "blur";
  delay?: number;
  duration?: number;
  once?: boolean;
  threshold?: number;
}

const variants: Record<string, Variants> = {
  fadeUp: {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0 },
  },
  fadeDown: {
    hidden: { opacity: 0, y: -60 },
    visible: { opacity: 1, y: 0 },
  },
  fadeLeft: {
    hidden: { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0 },
  },
  fadeRight: {
    hidden: { opacity: 0, x: 60 },
    visible: { opacity: 1, x: 0 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  },
  blur: {
    hidden: { opacity: 0, filter: "blur(10px)" },
    visible: { opacity: 1, filter: "blur(0px)" },
  },
};

export const ScrollReveal = ({
  children,
  className = "",
  variant = "fadeUp",
  delay = 0,
  duration = 0.6,
  once = true,
  threshold = 0.2,
}: ScrollRevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount: threshold });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants[variant]}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Staggered children reveal
interface StaggerRevealProps {
  children: ReactNode[];
  className?: string;
  staggerDelay?: number;
  variant?: "fadeUp" | "fadeDown" | "fadeLeft" | "fadeRight" | "scale" | "blur";
  once?: boolean;
}

export const StaggerReveal = ({
  children,
  className = "",
  staggerDelay = 0.1,
  variant = "fadeUp",
  once = true,
}: StaggerRevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount: 0.2 });

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
      className={className}
    >
      {children.map((child, index) => (
        <motion.div key={index} variants={variants[variant]}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

// Parallax scroll effect
interface ParallaxScrollProps {
  children: ReactNode;
  className?: string;
  speed?: number;
}

export const ParallaxScroll = ({
  children,
  className = "",
  speed = 0.5,
}: ParallaxScrollProps) => {
  const ref = useRef<HTMLDivElement>(null);
  
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ y: 0 }}
      whileInView={{ y: 0 }}
      viewport={{ once: false }}
      style={{
        willChange: "transform",
      }}
    >
      {children}
    </motion.div>
  );
};
