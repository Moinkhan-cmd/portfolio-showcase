import { useState, useEffect, useMemo } from "react";
import { usePerformanceMode } from "./usePerformanceMode";

interface PerformanceSettings {
  shouldRender3D: boolean;
  isMobile: boolean;
  isLowPower: boolean;
  particleCount: number;
  geometryDetail: number;
  dpr: [number, number];
}

/**
 * Hook to determine 3D rendering capability and optimize settings
 * based on device performance characteristics
 */
export const use3DPerformance = (): PerformanceSettings => {
  const { disable3D } = usePerformanceMode();
  const [deviceInfo, setDeviceInfo] = useState({
    isMobile: false,
    isTouch: false,
    prefersReducedMotion: false,
    isLowPower: false,
    deviceMemory: 8,
    hardwareConcurrency: 4,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const prefersReducedMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    
    // Check for low-power mode hints
    const isLowPower = window.matchMedia?.("(prefers-reduced-data: reduce)")?.matches || false;
    
    // Device memory (in GB) - available in Chrome
    const deviceMemory = (navigator as any).deviceMemory || 8;
    
    // Number of logical processors
    const hardwareConcurrency = navigator.hardwareConcurrency || 4;

    setDeviceInfo({
      isMobile,
      isTouch,
      prefersReducedMotion,
      isLowPower,
      deviceMemory,
      hardwareConcurrency,
    });
  }, []);

  return useMemo(() => {
    const { isMobile, isTouch, prefersReducedMotion, isLowPower, deviceMemory, hardwareConcurrency } = deviceInfo;

    // Disable 3D if performance mode is minimal, or on mobile/touch/reduced motion
    const shouldRender3D = !disable3D && !isMobile && !isTouch && !prefersReducedMotion;

    // Determine if device is low-powered
    const isLowPowerDevice = isLowPower || deviceMemory < 4 || hardwareConcurrency < 4;

    // Calculate particle count based on device capability
    let particleCount = 100;
    if (!isLowPowerDevice && deviceMemory >= 8) {
      particleCount = 200;
    } else if (isLowPowerDevice) {
      particleCount = 50;
    }

    // Geometry detail (segments for spheres, etc.)
    let geometryDetail = 16;
    if (isLowPowerDevice) {
      geometryDetail = 8;
    }

    // Device pixel ratio - limit for performance
    const dpr: [number, number] = isLowPowerDevice ? [1, 1] : [1, 1.5];

    return {
      shouldRender3D,
      isMobile: isMobile || isTouch,
      isLowPower: isLowPowerDevice,
      particleCount,
      geometryDetail,
      dpr,
    };
  }, [deviceInfo, disable3D]);
};

/**
 * Check if we should enable 3D rendering (static check for SSR)
 */
export const shouldEnable3D = (): boolean => {
  if (typeof window === "undefined") return false;
  
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
  const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  const prefersReducedMotion = window.matchMedia?.(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  return !isMobile && !isTouch && !prefersReducedMotion;
};
