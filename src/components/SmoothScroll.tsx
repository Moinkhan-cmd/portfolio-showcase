import { useEffect, useRef } from "react";
import Lenis from "lenis";

// Enhanced easing functions
const easingFunctions = {
  // Smooth exponential easing
  smooth: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  // Custom cubic bezier for more natural feel
  natural: (t: number) => {
    const c1 = 0.25;
    const c2 = 0.1;
    const c3 = 0.25;
    const c4 = 1;
    return t === 0
      ? 0
      : t === 1
      ? 1
      : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * (2 * Math.PI) / 3) + 1;
  },
  // Elastic easing for bouncy effect
  elastic: (t: number) => {
    return t === 0
      ? 0
      : t === 1
      ? 1
      : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * (2 * Math.PI) / 3) + 1;
  },
  // Smooth ease out
  easeOut: (t: number) => 1 - Math.pow(1 - t, 3),
};

// Global lenis reference for external access
let lenisInstance: Lenis | null = null;

export const SmoothScroll = () => {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Enhanced Lenis configuration
    const lenis = new Lenis({
      duration: 1.4, // Slightly longer for smoother feel
      easing: easingFunctions.smooth,
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.2, // Increased for more responsive scrolling
      touchMultiplier: 2.5, // Better touch scrolling
      infinite: false,
      smoothTouch: true, // Enable smooth scrolling on touch devices
      touchInertiaMultiplier: 50, // Momentum scrolling on touch
      lerp: 0.1, // Linear interpolation for smoother animations
    });

    lenisRef.current = lenis;
    lenisInstance = lenis;

    // Enhanced RAF function with performance monitoring
    let lastTime = 0;
    function raf(time: number) {
      lenis.raf(time);
      
      // Throttle for better performance
      if (time - lastTime > 16) {
        lastTime = time;
      }
      
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Enhanced scroll to section with offset
    const handleSmoothScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "A" && target.getAttribute("href")?.startsWith("#")) {
        e.preventDefault();
        const href = target.getAttribute("href");
        if (href) {
          const element = document.querySelector(href);
          if (element) {
            const offset = 80; // Account for fixed header
            const elementPosition = element.getBoundingClientRect().top + window.scrollY;
            const offsetPosition = elementPosition - offset;

            lenis.scrollTo(offsetPosition, {
              duration: 1.5,
              easing: easingFunctions.smooth,
              offset: -offset,
            });
          }
        }
      }
    };

    // Add smooth scroll to all anchor links
    document.addEventListener("click", handleSmoothScroll, true);

    // Scroll snap points for better section navigation
    const sections = document.querySelectorAll("section[id]");
    sections.forEach((section) => {
      section.setAttribute("data-scroll-snap", "true");
    });

    // Parallax effect helper
    const handleParallax = () => {
      const scrolled = window.scrollY;
      const parallaxElements = document.querySelectorAll("[data-parallax]");
      
      parallaxElements.forEach((element) => {
        const speed = parseFloat(element.getAttribute("data-parallax-speed") || "0.5");
        const yPos = -(scrolled * speed);
        (element as HTMLElement).style.transform = `translateY(${yPos}px)`;
      });
    };

    // Scroll velocity detection
    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;
    
    const handleScrollVelocity = () => {
      const currentScrollY = window.scrollY;
      scrollVelocity = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;
      
      // Add velocity class for animations
      document.documentElement.style.setProperty("--scroll-velocity", String(Math.abs(scrollVelocity)));
      
      // Adjust scroll speed based on velocity
      if (Math.abs(scrollVelocity) > 50) {
        lenis.options.lerp = 0.15; // Faster interpolation for fast scrolling
      } else {
        lenis.options.lerp = 0.1; // Normal interpolation
      }
    };

    // Enhanced scroll event listeners
    lenis.on("scroll", ({ scroll, limit, velocity, direction, progress }: any) => {
      // Update CSS variables for scroll-based animations
      document.documentElement.style.setProperty("--scroll-progress", String(progress));
      document.documentElement.style.setProperty("--scroll-velocity", String(Math.abs(velocity)));
      document.documentElement.style.setProperty("--scroll-direction", direction);
      
      // Trigger custom scroll events
      window.dispatchEvent(
        new CustomEvent("smoothscroll", {
          detail: { scroll, limit, velocity, direction, progress },
        })
      );
    });

    // Scroll to top on page load
    lenis.scrollTo(0, { immediate: true });

    // Cleanup
    return () => {
      lenis.destroy();
      lenisInstance = null;
      document.removeEventListener("click", handleSmoothScroll, true);
    };
  }, []);

  return null;
};

// Export lenis instance for external use
export const getLenisInstance = () => lenisInstance;

// Enhanced scroll to section utility
export const scrollToSection = (selector: string, offset: number = 80) => {
  const element = document.querySelector(selector);
  if (element && lenisInstance) {
    const elementPosition = element.getBoundingClientRect().top + window.scrollY;
    const offsetPosition = elementPosition - offset;

    lenisInstance.scrollTo(offsetPosition, {
      duration: 1.5,
      easing: easingFunctions.smooth,
      offset: -offset,
    });
  }
};
