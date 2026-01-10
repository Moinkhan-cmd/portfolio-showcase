import { motion, AnimatePresence } from "framer-motion";
import { ReactNode, useState, useEffect } from "react";
import { use3DPerformance } from "@/hooks/use3DPerformance";

interface Fade3DWrapperProps {
  children: ReactNode;
  isVisible: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Wrapper component that provides smooth fade transitions for 3D backgrounds
 * when switching performance modes or scrolling in/out of view
 */
export const Fade3DWrapper = ({ children, isVisible, className, style }: Fade3DWrapperProps) => {
  const { shouldRender3D, isMobile } = use3DPerformance();
  const [shouldMount, setShouldMount] = useState(shouldRender3D && isVisible);
  const [isAnimating, setIsAnimating] = useState(false);

  // Handle mounting/unmounting with delay for fade out
  useEffect(() => {
    if (shouldRender3D && isVisible) {
      setShouldMount(true);
    } else if (shouldMount && !isAnimating) {
      // Start fade out animation
      setIsAnimating(true);
    }
  }, [shouldRender3D, isVisible, shouldMount, isAnimating]);

  const handleExitComplete = () => {
    setShouldMount(false);
    setIsAnimating(false);
  };

  // Don't render on mobile
  if (isMobile) {
    return null;
  }

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {(shouldRender3D && isVisible) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className={className}
          style={style}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
