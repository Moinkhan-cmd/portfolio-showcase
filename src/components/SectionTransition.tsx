import { motion, useInView } from "framer-motion";
import { useRef, ReactNode, useEffect, useState } from "react";

interface SectionTransitionProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

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

export const SectionTransition = ({ children, className = "", id }: SectionTransitionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const isInView = useInView(ref, { 
    once: false, 
    amount: 0.15,
    margin: "-50px 0px -50px 0px"
  });

  // On mobile, skip all animations for better performance
  if (isMobile) {
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
