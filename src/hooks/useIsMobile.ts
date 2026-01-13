import { useState, useEffect } from "react";

/**
 * Hook to detect if the current device is mobile/touch
 * Used to disable heavy animations and effects for better performance
 */
export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
      setIsMobile(isTouchDevice || isMobileUA);
    };
    checkMobile();
  }, []);

  return isMobile;
};

/**
 * Static check for SSR compatibility
 */
export const isMobileDevice = (): boolean => {
  if (typeof window === "undefined") return false;
  const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
  return isTouchDevice || isMobileUA;
};