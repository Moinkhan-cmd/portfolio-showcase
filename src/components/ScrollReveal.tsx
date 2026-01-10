import { motion, useInView, useScroll, useTransform, Variants, useReducedMotion } from "framer-motion";
import { useRef, ReactNode, useMemo } from "react";

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
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  },
  fadeDown: {
    hidden: { opacity: 0, y: -40 },
    visible: { opacity: 1, y: 0 },
  },
  fadeLeft: {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0 },
  },
  fadeRight: {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  },
  blur: {
    hidden: { opacity: 0, filter: "blur(8px)" },
    visible: { opacity: 1, filter: "blur(0px)" },
  },
  slide: {
    hidden: { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0 },
  },
  rotate: {
    hidden: { opacity: 0, rotate: -5, scale: 0.95 },
    visible: { opacity: 1, rotate: 0, scale: 1 },
  },
};

export const ScrollReveal = ({
  children,
  className = "",
  variant = "fadeUp",
  delay = 0,
  duration = 0.4,
  once = true,
  threshold = 0.15,
  amount = 0.2,
  distance = 20,
}: ScrollRevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  
  // Detect touch/mobile devices - skip animations entirely
  const isMobile = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(pointer: coarse)")?.matches ?? false;
  }, []);

  const isInView = useInView(ref, { once, amount: threshold });

  // Skip animations on mobile/reduced motion for performance
  if (isMobile || reduceMotion) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  // Simplified variant with custom distance
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
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={customVariants}
      transition={{
        duration,
        delay,
        ease: "easeOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Staggered children reveal - simplified for performance
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
  staggerDelay = 0.06,
  variant = "fadeUp",
  once = true,
  duration = 0.35,
}: StaggerRevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  
  const isMobile = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(pointer: coarse)")?.matches ?? false;
  }, []);

  const isInView = useInView(ref, { once, amount: 0.15 });

  // Skip animations on mobile
  if (isMobile || reduceMotion) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.03,
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
        <motion.div
          key={index}
          variants={variants[variant]}
          transition={{
            duration,
            ease: "easeOut",
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

// Parallax scroll effect - disabled on mobile
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
  
  const isMobile = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(pointer: coarse)")?.matches ?? false;
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    direction === "down" ? [offset, offset - 100 * speed] : [offset - 100 * speed, offset]
  );

  // Skip parallax on mobile
  if (isMobile) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ y }}
    >
      {children}
    </motion.div>
  );
};

// Scroll progress component - simplified
interface ScrollProgressProps {
  children: ReactNode;
  className?: string;
}

export const ScrollProgressElement = ({ children, className = "" }: ScrollProgressProps) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const isMobile = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(pointer: coarse)")?.matches ?? false;
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.9, 1, 1, 0.9]);

  // Skip on mobile
  if (isMobile) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ opacity, scale }}
    >
      {children}
    </motion.div>
  );
};

// Fade in on scroll - simplified
interface FadeInScrollProps {
  children: ReactNode;
  className?: string;
  triggerPoint?: number;
  fadeDistance?: number;
}

export const FadeInScroll = ({
  children,
  className = "",
  triggerPoint = 0.3,
  fadeDistance = 30,
}: FadeInScrollProps) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const isMobile = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(pointer: coarse)")?.matches ?? false;
  }, []);

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

  // Skip on mobile
  if (isMobile) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ opacity, y }}
    >
      {children}
    </motion.div>
  );
};
