import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef, ReactNode, useMemo } from "react";

interface SectionTransitionProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

export const SectionTransition = ({ children, className = "", id }: SectionTransitionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  
  // Detect touch/mobile devices
  const isMobile = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(pointer: coarse)")?.matches ?? false;
  }, []);

  const isInView = useInView(ref, { 
    once: true, // Changed to once for better performance
    amount: 0.1,
    margin: "-30px 0px -30px 0px"
  });

  // Skip animations entirely on mobile for smooth scrolling
  if (isMobile || reduceMotion) {
    return (
      <section ref={ref} id={id} className={className}>
        {children}
      </section>
    );
  }

  return (
    <motion.section
      ref={ref}
      id={id}
      className={className}
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: isInView ? 1 : 0,
      }}
      transition={{ 
        duration: 0.4, 
        ease: "easeOut"
      }}
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ 
          y: isInView ? 0 : 20, 
          opacity: isInView ? 1 : 0 
        }}
        transition={{ 
          duration: 0.5, 
          delay: 0.05,
          ease: "easeOut"
        }}
      >
        {children}
      </motion.div>
    </motion.section>
  );
};
