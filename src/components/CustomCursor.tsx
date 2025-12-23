import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export const CustomCursor = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Fast, responsive cursor (less “laggy”)
  const springConfig = { damping: 18, stiffness: 900, mass: 0.18 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const rafRef = useRef<number | null>(null);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(pointer: coarse)').matches);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Only hide the native cursor when our custom cursor is active.
    const root = document.documentElement;
    if (!isMobile) root.classList.add('custom-cursor-enabled');
    else root.classList.remove('custom-cursor-enabled');

    return () => {
      root.classList.remove('custom-cursor-enabled');
    };
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) return;

    const setFromPoint = (x: number, y: number) => {
      cursorX.set(x);
      cursorY.set(y);
      if (!isReady) setIsReady(true);
    };

    const schedule = () => {
      if (rafRef.current != null) return;
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null;
        const pt = lastPointRef.current;
        if (pt) setFromPoint(pt.x, pt.y);
      });
    };

    const onPointerMove = (e: PointerEvent) => {
      lastPointRef.current = { x: e.clientX, y: e.clientY };
      schedule();
    };

    const onMouseMove = (e: MouseEvent) => {
      // Fallback for browsers/devices where pointer events behave oddly
      lastPointRef.current = { x: e.clientX, y: e.clientY };
      schedule();
    };

    const onPointerOver = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a') ||
        target.getAttribute('role') === 'button' ||
        target.closest('[role="button"]') ||
        target.classList.contains('cursor-pointer') ||
        target.closest('.cursor-pointer') ||
        target.classList.contains('hover-lift') ||
        target.closest('.hover-lift')
      ) {
        setIsHovering(true);
      }
    };

    const onPointerOut = () => setIsHovering(false);

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('pointerover', onPointerOver, { passive: true });
    document.addEventListener('pointerout', onPointerOut, { passive: true });

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('pointerover', onPointerOver);
      document.removeEventListener('pointerout', onPointerOut);

      if (rafRef.current != null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [isMobile, cursorX, cursorY, isReady]);

  if (isMobile) return null;

  // Render to <body> so it never gets trapped/clipped by 3D transforms in sections.
  return createPortal(
    <div className="pointer-events-none" style={{ position: 'fixed', inset: 0, zIndex: 2147483647 }}>
      {/* Main blob */}
      <motion.div
        className="absolute top-0 left-0"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          willChange: 'transform',
          opacity: isReady ? 1 : 0,
        }}
      >
        <motion.div
          className="relative -translate-x-1/2 -translate-y-1/2 mix-blend-screen"
          animate={{
            scale: isHovering ? 1.7 : 1,
            opacity: isHovering ? 1 : 0.85,
          }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
        >
          <div
            className="w-10 h-10 rounded-full"
            style={{
              background:
                'radial-gradient(circle, hsl(175 80% 70% / 0.9) 0%, hsl(200 90% 80% / 0.55) 45%, hsl(175 80% 60% / 0.25) 75%, transparent 100%)',
              filter: 'blur(6px)',
              boxShadow: '0 0 22px hsl(175 80% 60% / 0.55), 0 0 50px hsl(175 80% 60% / 0.25)',
            }}
          />
        </motion.div>
      </motion.div>

      {/* Inner dot */}
      <motion.div
        className="absolute top-0 left-0"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          willChange: 'transform',
          opacity: isReady ? 1 : 0,
        }}
      >
        <motion.div
          className="rounded-full -translate-x-1/2 -translate-y-1/2 bg-primary"
          animate={{
            scale: isHovering ? 0 : 1,
            width: isHovering ? '0px' : '6px',
            height: isHovering ? '0px' : '6px',
          }}
          style={{ boxShadow: '0 0 12px hsl(175 80% 60% / 0.85)' }}
          transition={{ duration: 0.12 }}
        />
      </motion.div>
    </div>,
    document.body
  );
};
