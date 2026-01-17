import { motion, useInView } from "framer-motion";
import { useRef, ReactNode, memo } from "react";
import { useRealMobile } from "@/hooks/useRealMobile";

interface SectionTransitionProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

export const SectionTransition = memo(({ children, className = "", id }: SectionTransitionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { isRealMobile, prefersReducedMotion } = useRealMobile();
  const isInView = useInView(ref, { 
    once: true, // Changed to once: true to reduce observer overhead
    amount: 0.1,
    margin: "-20px 0px"
  });

  // On mobile, skip all animations for better performance
  if (isRealMobile || prefersReducedMotion) {
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
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ 
        duration: 0.4, 
        ease: "easeOut"
      }}
    >
      {children}
    </motion.section>
  );
});

SectionTransition.displayName = "SectionTransition";
