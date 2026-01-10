import { motion, useInView } from "framer-motion";
import { useRef, ReactNode } from "react";

interface SectionTransitionProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

export const SectionTransition = ({ children, className = "", id }: SectionTransitionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { 
    once: false, 
    amount: 0.15,
    margin: "-50px 0px -50px 0px"
  });

  return (
    <motion.section
      ref={ref}
      id={id}
      className={className}
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: isInView ? 1 : 0.3,
      }}
      transition={{ 
        duration: 0.5, 
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      style={{
        willChange: "opacity",
      }}
    >
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ 
          y: isInView ? 0 : 30, 
          opacity: isInView ? 1 : 0 
        }}
        transition={{ 
          duration: 0.6, 
          delay: 0.1,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
      >
        {children}
      </motion.div>
    </motion.section>
  );
};
