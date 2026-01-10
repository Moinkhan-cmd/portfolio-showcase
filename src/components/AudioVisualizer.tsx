import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { onSoundPlay, isSoundEnabled } from "@/lib/sounds";

const BAR_COUNT = 5;
const DECAY_RATE = 0.92;

interface BarState {
  height: number;
  targetHeight: number;
}

export const AudioVisualizer = () => {
  const [bars, setBars] = useState<BarState[]>(
    Array(BAR_COUNT).fill(null).map(() => ({ height: 0.1, targetHeight: 0.1 }))
  );
  const [isActive, setIsActive] = useState(false);

  const triggerVisualization = useCallback((type: string, intensity: number) => {
    if (!isSoundEnabled()) return;
    
    setIsActive(true);
    
    // Generate random heights based on sound type and intensity
    const newBars = bars.map((_, i) => {
      const baseHeight = intensity * (0.4 + Math.random() * 0.6);
      // Create wave pattern - middle bars higher
      const positionFactor = 1 - Math.abs(i - (BAR_COUNT - 1) / 2) / ((BAR_COUNT - 1) / 2) * 0.3;
      return {
        height: bars[i]?.height || 0.1,
        targetHeight: Math.min(1, baseHeight * positionFactor)
      };
    });
    
    setBars(newBars);
  }, [bars]);

  // Subscribe to sound events
  useEffect(() => {
    const unsubscribe = onSoundPlay((type, intensity) => {
      triggerVisualization(type, intensity);
    });
    
    return () => { unsubscribe(); };
  }, [triggerVisualization]);

  // Animation loop for smooth decay - only runs when active
  useEffect(() => {
    if (!isActive) return;
    
    const interval = setInterval(() => {
      setBars(prev => {
        const allSettled = prev.every(bar => bar.height < 0.15 && bar.targetHeight < 0.15);
        
        if (allSettled) {
          setIsActive(false);
          return prev.map(() => ({ height: 0.1, targetHeight: 0.1 }));
        }
        
        return prev.map(bar => {
          const diff = bar.targetHeight - bar.height;
          const newHeight = bar.height + diff * 0.3;
          const decayedTarget = bar.targetHeight * DECAY_RATE;
          
          return {
            height: Math.max(0.1, newHeight),
            targetHeight: Math.max(0.1, decayedTarget)
          };
        });
      });
    }, 50); // Slower interval for better performance
    
    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.15 }}
          className="flex items-end gap-[2px] h-4 px-1"
          aria-hidden="true"
        >
          {bars.map((bar, i) => (
            <motion.div
              key={i}
              className="w-[3px] rounded-full bg-gradient-to-t from-primary/60 to-primary"
              style={{
                height: `${bar.height * 100}%`,
                minHeight: '2px'
              }}
              animate={{
                height: `${bar.height * 100}%`,
                opacity: 0.5 + bar.height * 0.5
              }}
              transition={{ duration: 0.05, ease: "easeOut" }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
