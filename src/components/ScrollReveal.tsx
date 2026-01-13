import { motion, useInView, useScroll, useTransform, Variants } from "framer-motion";
import { useRef, ReactNode, useEffect, useState } from "react";

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(isTouchDevice || isMobileUA);
    };
    checkMobile();
  }, []);
  
  return isMobile;
};

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
  distance = 40,
}: ScrollRevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const isInView = useInView(ref, { once, amount: threshold });

  // On mobile, skip animations for better performance
  if (isMobile) {
    return <div ref={ref} className={className}>{children}</div>;
  }

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
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={customVariants}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
        type: "tween",
      }}
      style={{ willChange: 'opacity, transform' }}
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
  const isMobile = useIsMobile();
  const isInView = useInView(ref, { once, amount: 0.2 });

  // On mobile, skip animations
  if (isMobile) {
    return (
      <div ref={ref} className={className}>
        {children.map((child, index) => (
          <div key={index}>{child}</div>
        ))}
      </div>
    );
  }

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
            ease: [0.25, 0.46, 0.45, 0.94],
            type: "tween",
          }}
          style={{ willChange: 'opacity, transform' }}
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
  const isMobile = useIsMobile();
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

  // On mobile, skip parallax effects
  if (isMobile) {
    return <div ref={ref} className={className}>{children}</div>;
  }

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
  const isMobile = useIsMobile();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.8, 1, 1, 0.8]);

  // On mobile, skip scroll effects
  if (isMobile) {
    return <div ref={ref} className={className}>{children}</div>;
  }

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
  const isMobile = useIsMobile();
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

  // On mobile, skip scroll effects
  if (isMobile) {
    return <div ref={ref} className={className}>{children}</div>;
  }

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
