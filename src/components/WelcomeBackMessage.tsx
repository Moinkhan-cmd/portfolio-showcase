import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface WelcomeBackMessageProps {
  isReturningVisitor: boolean;
}

export const WelcomeBackMessage = ({ isReturningVisitor }: WelcomeBackMessageProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isReturningVisitor) {
      // Show message after a brief delay
      const showTimer = setTimeout(() => setIsVisible(true), 400);
      // Hide message after 3 seconds
      const hideTimer = setTimeout(() => setIsVisible(false), 3500);
      
      return () => {
        clearTimeout(showTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [isReturningVisitor]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed top-24 left-1/2 z-50 pointer-events-none"
          initial={{ opacity: 0, y: -20, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: -10, x: "-50%" }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
            
            {/* Message container */}
            <motion.div 
              className="relative px-6 py-3 rounded-full bg-background/80 backdrop-blur-md border border-primary/20 shadow-lg"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              <div className="flex items-center gap-3">
                {/* Animated wave emoji */}
                <motion.span
                  className="text-xl"
                  animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
                  transition={{ duration: 1.5, delay: 0.3 }}
                >
                  👋
                </motion.span>
                
                {/* Text */}
                <span className="text-sm font-medium text-foreground">
                  Welcome back!
                </span>
                
                {/* Animated sparkle */}
                <motion.span
                  className="text-primary"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.3 }}
                >
                  ✨
                </motion.span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
