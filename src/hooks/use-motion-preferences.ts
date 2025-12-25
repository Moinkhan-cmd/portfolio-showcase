import { useReducedMotion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

/**
 * Centralized motion preference helper.
 * - liteMotion: true on mobile OR when user requests reduced motion.
 */
export function useMotionPreferences() {
  const isMobile = useIsMobile();
  const reducedMotion = useReducedMotion();

  return {
    isMobile,
    reducedMotion,
    liteMotion: isMobile || reducedMotion,
  };
}
