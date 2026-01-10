import { motion, useInView, useScroll, useTransform, Variants, useReducedMotion } from "framer-motion";
import { useRef, ReactNode, useMemo } from "react";
import { useScrollPause } from "@/hooks/useScrollPause";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  variant?: "fadeUp" | "fadeDown" | "fadeLeft" | "fadeRight" | "scale" | "blur" | "slide" | "rotate";
  delay?: number;
  duration?: number;
  once?: boolean;
  threshold?: number;
  amount?: number;
  distance?: number;
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
  slide: {
    hidden: { opacity: 0, x: -100, rotateY: -15 },
    visible: { opacity: 1, x: 0, rotateY: 0 },
  },
  rotate: {
    hidden: { opacity: 0, rotate: -10, scale: 0.9 },
    visible: { opacity: 1, rotate: 0, scale: 1 },
  },
};

export const ScrollReveal = ({
  children,
  className = "",
  variant = "fadeUp",
  delay = 0,
  duration = 0.5,
  once = true,
  threshold = 0.2,
  amount = 0.3,
  distance = 24,
}: ScrollRevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount: threshold });

  const reduceMotion = useReducedMotion();
  const isScrolling = useScrollPause(200);
  const isCoarsePointer = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(pointer: coarse)")?.matches ?? false;
  }, []);

  // Key UX perf rule: avoid running entrance animations while the user is actively scrolling.
  // Instead, show content immediately and only animate when scroll is idle.
  const shouldAnimate = !reduceMotion && !isCoarsePointer && !isScrolling;

  // Enhanced variant with custom distance
  const baseHidden = variants[variant].hidden as Record<string, number | string>;
  const getCustomHidden = () => {
    const base = { ...baseHidden };
    if (variant === "fadeUp") base.y = distance;
    else if (variant === "fadeDown") base.y = -distance;
    else if (variant === "fadeLeft") base.x = -distance;
    else if (variant === "fadeRight") base.x = distance;
    return base;
  };
  
  const customVariants: Variants = {
    hidden: getCustomHidden(),
    visible: variants[variant].visible,
  };

  return (
    <motion.div
      ref={ref}
      initial={shouldAnimate ? "hidden" : false}
      animate={shouldAnimate ? (isInView ? "visible" : "hidden") : "visible"}
      variants={customVariants}
      transition={{
        duration: shouldAnimate ? duration : 0,
        delay: shouldAnimate ? delay : 0,
        ease: [0.25, 0.46, 0.45, 0.94],
        type: "tween", // Changed from spring to tween for better performance
      }}
      style={shouldAnimate ? { willChange: "opacity, transform" } : undefined}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Staggered children reveal with enhanced animations
interface StaggerRevealProps {
  children: ReactNode[];
  className?: string;
  staggerDelay?: number;
  variant?: "fadeUp" | "fadeDown" | "fadeLeft" | "fadeRight" | "scale" | "blur";
  once?: boolean;
  duration?: number;
}

export const StaggerReveal = ({
  children,
  className = "",
  staggerDelay = 0.08,
  variant = "fadeUp",
  once = true,
  duration = 0.4,
}: StaggerRevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount: 0.2 });

  const reduceMotion = useReducedMotion();
  const isScrolling = useScrollPause(200);
  const isCoarsePointer = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(pointer: coarse)")?.matches ?? false;
  }, []);
  const shouldAnimate = !reduceMotion && !isCoarsePointer && !isScrolling;

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.05,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial={shouldAnimate ? "hidden" : false}
      animate={shouldAnimate ? (isInView ? "visible" : "hidden") : "visible"}
      variants={containerVariants}
      className={className}
    >
      {children.map((child, index) => (
        <motion.div
          key={index}
          variants={variants[variant]}
          transition={{
            duration: shouldAnimate ? duration : 0,
            ease: [0.25, 0.46, 0.45, 0.94],
            type: "tween", // Changed from spring to tween
          }}
          style={shouldAnimate ? { willChange: "opacity, transform" } : undefined}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

// Enhanced Parallax scroll effect with velocity
interface ParallaxScrollProps {
  children: ReactNode;
  className?: string;
  speed?: number;
  direction?: "up" | "down";
  offset?: number;
}

export const ParallaxScroll = ({
  children,
  className = "",
  speed = 0.5,
  direction = "down",
  offset = 0,
}: ParallaxScrollProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    direction === "down" ? [offset, offset - 100 * speed] : [offset - 100 * speed, offset]
  );

  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 1, 0.3]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        y,
        opacity,
        scale,
        willChange: "transform, opacity",
      }}
    >
      {children}
    </motion.div>
  );
};

// Scroll progress component for individual elements
interface ScrollProgressProps {
  children: ReactNode;
  className?: string;
}

export const ScrollProgressElement = ({ children, className = "" }: ScrollProgressProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.8, 1, 1, 0.8]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        opacity,
        scale,
      }}
    >
      {children}
    </motion.div>
  );
};

// Fade in on scroll with custom trigger points
interface FadeInScrollProps {
  children: ReactNode;
  className?: string;
  triggerPoint?: number; // 0-1, when to start fading (0 = top of viewport, 1 = bottom)
  fadeDistance?: number;
}

export const FadeInScroll = ({
  children,
  className = "",
  triggerPoint = 0.3,
  fadeDistance = 50,
}: FadeInScrollProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(
    scrollYProgress,
    [0, triggerPoint, 1 - triggerPoint, 1],
    [0, 0, 1, 1]
  );
  const y = useTransform(
    scrollYProgress,
    [0, triggerPoint, 1 - triggerPoint, 1],
    [fadeDistance, fadeDistance, 0, 0]
  );

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        opacity,
        y,
      }}
    >
      {children}
    </motion.div>
  );
};
