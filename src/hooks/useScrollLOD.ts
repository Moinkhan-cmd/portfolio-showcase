import { useState, useEffect, useCallback } from "react";

interface LODSettings {
  sphereDetail: number;
  particleCount: number;
  waveSegments: number;
  distortSpeed: number;
  enableWaveAnimation: boolean;
}

/**
 * Hook that provides level-of-detail settings based on scroll position
 * Reduces complexity for elements further from viewport center
 */
export const useScrollLOD = (sectionId: string): LODSettings => {
  const [lodSettings, setLodSettings] = useState<LODSettings>({
    sphereDetail: 32,
    particleCount: 100,
    waveSegments: 20,
    distortSpeed: 1,
    enableWaveAnimation: true,
  });

  const updateLOD = useCallback(() => {
    const section = document.getElementById(sectionId);
    if (!section) return;

    const rect = section.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const sectionCenter = rect.top + rect.height / 2;
    const viewportCenter = viewportHeight / 2;
    
    // Calculate distance from viewport center (0 = centered, 1 = fully off-screen)
    const distance = Math.abs(sectionCenter - viewportCenter) / viewportHeight;
    const normalizedDistance = Math.min(distance, 1);

    // LOD tiers based on distance from viewport center
    if (normalizedDistance < 0.3) {
      // High detail - section is in focus
      setLodSettings({
        sphereDetail: 32,
        particleCount: 100,
        waveSegments: 20,
        distortSpeed: 1,
        enableWaveAnimation: true,
      });
    } else if (normalizedDistance < 0.6) {
      // Medium detail - section is partially visible
      setLodSettings({
        sphereDetail: 16,
        particleCount: 50,
        waveSegments: 12,
        distortSpeed: 0.5,
        enableWaveAnimation: true,
      });
    } else {
      // Low detail - section is mostly off-screen
      setLodSettings({
        sphereDetail: 8,
        particleCount: 25,
        waveSegments: 8,
        distortSpeed: 0.2,
        enableWaveAnimation: false,
      });
    }
  }, [sectionId]);

  useEffect(() => {
    updateLOD();
    
    let rafId: number;
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      // Throttle updates using RAF
      if (Math.abs(window.scrollY - lastScrollY) > 50) {
        lastScrollY = window.scrollY;
        rafId = requestAnimationFrame(updateLOD);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [updateLOD]);

  return lodSettings;
};

/**
 * Static LOD settings for components that don't need dynamic updates
 */
export const getStaticLODSettings = () => ({
  low: {
    sphereDetail: 8,
    particleCount: 25,
    waveSegments: 8,
  },
  medium: {
    sphereDetail: 16,
    particleCount: 50,
    waveSegments: 12,
  },
  high: {
    sphereDetail: 32,
    particleCount: 100,
    waveSegments: 20,
  },
});
