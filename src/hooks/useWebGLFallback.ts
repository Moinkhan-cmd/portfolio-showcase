import { useState, useEffect, useCallback } from "react";
import { isWebGLSupported, markWebGLFailed, hasWebGLFailed } from "@/lib/webglDetection";

interface WebGLFallbackState {
  isWebGLAvailable: boolean;
  showFallback: boolean;
  handleContextLost: () => void;
  retryWebGL: () => void;
}

/**
 * Hook to manage WebGL availability and fallback state
 */
export const useWebGLFallback = (): WebGLFallbackState => {
  const [isWebGLAvailable, setIsWebGLAvailable] = useState(true);
  const [contextLostCount, setContextLostCount] = useState(0);
  
  // Max retries before giving up on WebGL
  const MAX_CONTEXT_LOST_RETRIES = 2;

  useEffect(() => {
    // Check WebGL support on mount
    const supported = isWebGLSupported();
    setIsWebGLAvailable(supported && !hasWebGLFailed());
  }, []);

  const handleContextLost = useCallback(() => {
    setContextLostCount((prev) => {
      const newCount = prev + 1;
      
      // After too many context losses, give up and show fallback
      if (newCount >= MAX_CONTEXT_LOST_RETRIES) {
        markWebGLFailed();
        setIsWebGLAvailable(false);
      }
      
      return newCount;
    });
  }, []);

  const retryWebGL = useCallback(() => {
    setContextLostCount(0);
    setIsWebGLAvailable(isWebGLSupported());
  }, []);

  return {
    isWebGLAvailable,
    showFallback: !isWebGLAvailable || contextLostCount >= MAX_CONTEXT_LOST_RETRIES,
    handleContextLost,
    retryWebGL,
  };
};
