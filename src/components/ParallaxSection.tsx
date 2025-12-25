import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, ReactNode } from "react";
import { useMotionPreferences } from "@/hooks/use-motion-preferences";

interface ParallaxSectionProps {
  children: ReactNode;
  offset?: number;
}

export const ParallaxSection = ({ children, offset = 50 }: ParallaxSectionProps) => {
  const { liteMotion } = useMotionPreferences();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    liteMotion ? [0, 0] : [offset, -offset]
  );
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    liteMotion ? [1, 1, 1, 1] : [0.4, 1, 1, 0.4]
  );

  return (
    <motion.div ref={ref} style={{ y, opacity }} className="scroll-optimized">
      {children}
    </motion.div>
  );
};
