import { useState, useRef, useEffect, memo, useMemo } from "react";
import { cn } from "@/lib/utils";

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholderClassName?: string;
  onError?: () => void;
  onLoad?: () => void;
  /** Optional low-quality placeholder image (base64 or tiny URL) */
  lqip?: string;
  /** Dominant color for initial placeholder (hex or hsl) */
  dominantColor?: string;
}

// Generate a simple SVG placeholder with gradient
const generatePlaceholder = (color?: string): string => {
  const baseColor = color || "hsl(258 90% 66%)";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${baseColor};stop-opacity:0.3"/>
        <stop offset="50%" style="stop-color:${baseColor};stop-opacity:0.15"/>
        <stop offset="100%" style="stop-color:${baseColor};stop-opacity:0.3"/>
      </linearGradient>
    </defs>
    <rect width="100" height="100" fill="url(#g)"/>
  </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

// Tiny 1x1 transparent GIF for initial state
const TRANSPARENT_GIF = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

export const LazyImage = memo(({ 
  src, 
  alt, 
  className, 
  placeholderClassName,
  onError,
  onLoad,
  lqip,
  dominantColor
}: LazyImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [lqipLoaded, setLqipLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate placeholder based on provided color or default
  const placeholder = useMemo(() => {
    return lqip || generatePlaceholder(dominantColor);
  }, [lqip, dominantColor]);

  // Intersection observer for lazy loading
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: "200px", // Start loading 200px before entering viewport
        threshold: 0,
      }
    );

    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  const handleLqipLoad = () => {
    setLqipLoaded(true);
  };

  if (hasError) {
    return null;
  }

  return (
    <div ref={containerRef} className={cn("relative overflow-hidden", className)}>
      {/* Base gradient placeholder - always visible initially */}
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-300",
          (lqipLoaded || isLoaded) ? "opacity-0" : "opacity-100",
          placeholderClassName
        )}
        style={{
          background: `linear-gradient(135deg, hsl(258 90% 66% / 0.2) 0%, hsl(258 90% 66% / 0.1) 50%, hsl(258 90% 66% / 0.2) 100%)`
        }}
      >
        {/* Shimmer effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
      </div>

      {/* LQIP layer - loads first, blurred */}
      <img
        src={placeholder}
        alt=""
        aria-hidden="true"
        className={cn(
          "absolute inset-0 w-full h-full object-cover transition-opacity duration-500",
          "blur-xl scale-110", // Extra blur and scale to hide pixelation
          isLoaded ? "opacity-0" : lqipLoaded ? "opacity-100" : "opacity-0"
        )}
        onLoad={handleLqipLoad}
      />

      {/* Full quality image - loads when in view */}
      {isInView && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          className={cn(
            "w-full h-full object-cover transition-all duration-700 ease-out",
            isLoaded 
              ? "opacity-100 blur-0 scale-100" 
              : "opacity-0 blur-sm scale-[1.02]"
          )}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
          decoding="async"
        />
      )}
    </div>
  );
});

LazyImage.displayName = "LazyImage";

// Export a version with motion support for components that need hover animations
export const MotionLazyImage = memo(({ 
  src, 
  alt, 
  className,
  dominantColor,
  onError,
  onLoad
}: Omit<LazyImageProps, 'lqip' | 'placeholderClassName'>) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate placeholder
  const placeholder = useMemo(() => generatePlaceholder(dominantColor), [dominantColor]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: "200px", threshold: 0 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  if (hasError) return null;

  return (
    <div ref={containerRef} className={cn("relative overflow-hidden", className)}>
      {/* Gradient placeholder with shimmer */}
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-500",
          isLoaded ? "opacity-0" : "opacity-100"
        )}
      >
        <img 
          src={placeholder} 
          alt="" 
          aria-hidden="true"
          className="w-full h-full object-cover blur-xl scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
      </div>

      {/* Actual image */}
      {isInView && (
        <img
          src={src}
          alt={alt}
          className={cn(
            "w-full h-full object-cover transition-all duration-700",
            isLoaded ? "opacity-100 blur-0" : "opacity-0 blur-sm"
          )}
          onLoad={() => {
            setIsLoaded(true);
            onLoad?.();
          }}
          onError={() => {
            setHasError(true);
            onError?.();
          }}
          loading="lazy"
          decoding="async"
        />
      )}
    </div>
  );
});

MotionLazyImage.displayName = "MotionLazyImage";
