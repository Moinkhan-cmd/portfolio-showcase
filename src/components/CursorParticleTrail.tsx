import { useEffect, useRef, useCallback, memo } from "react";
import { usePerformanceMode } from "@/hooks/usePerformanceMode";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  hue: number;
}

export const CursorParticleTrail = memo(() => {
  const { level } = usePerformanceMode();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, prevX: 0, prevY: 0 });
  const animationFrameRef = useRef<number>(0);
  const lastSpawnRef = useRef(0);

  const spawnParticle = useCallback((x: number, y: number, vx: number, vy: number) => {
    const particle: Particle = {
      x,
      y,
      vx: vx * 0.3 + (Math.random() - 0.5) * 2,
      vy: vy * 0.3 + (Math.random() - 0.5) * 2,
      life: 1,
      maxLife: 0.8 + Math.random() * 0.4,
      size: 2 + Math.random() * 3,
      hue: 200 + Math.random() * 60, // Blue to purple range
    };
    particlesRef.current.push(particle);
    
    // Limit max particles
    if (particlesRef.current.length > 50) {
      particlesRef.current.shift();
    }
  }, []);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw particles
    const particles = particlesRef.current;
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      
      // Update
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.98;
      p.vy *= 0.98;
      p.vy += 0.05; // Slight gravity
      p.life -= 0.025;

      // Remove dead particles
      if (p.life <= 0) {
        particles.splice(i, 1);
        continue;
      }

      // Draw
      const alpha = p.life * 0.6;
      const size = p.size * p.life;
      
      ctx.beginPath();
      ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, 80%, 60%, ${alpha})`;
      ctx.fill();

      // Glow effect
      ctx.beginPath();
      ctx.arc(p.x, p.y, size * 2, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, 80%, 60%, ${alpha * 0.3})`;
      ctx.fill();
    }

    animationFrameRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    if (level !== "full") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size
    const updateSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    updateSize();
    window.addEventListener("resize", updateSize);

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      const mouse = mouseRef.current;
      
      const dx = e.clientX - mouse.prevX;
      const dy = e.clientY - mouse.prevY;
      const speed = Math.sqrt(dx * dx + dy * dy);
      
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      // Spawn particles based on speed and time
      if (speed > 3 && now - lastSpawnRef.current > 16) {
        const count = Math.min(Math.floor(speed / 8), 3);
        for (let i = 0; i < count; i++) {
          spawnParticle(e.clientX, e.clientY, dx, dy);
        }
        lastSpawnRef.current = now;
      }

      mouse.prevX = e.clientX;
      mouse.prevY = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", updateSize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [level, animate, spawnParticle]);

  // Don't render in non-full modes
  if (level !== "full") return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[9998]"
      style={{ mixBlendMode: "screen" }}
    />
  );
});

CursorParticleTrail.displayName = "CursorParticleTrail";
