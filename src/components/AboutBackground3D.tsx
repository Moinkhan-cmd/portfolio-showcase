import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Stars } from "@react-three/drei";
import { Suspense, useState, useEffect, useRef, memo } from "react";
import { DNA } from "./DNA";
import { FloatingParticles } from "./FloatingParticles";
import { GeometricShapes } from "./GeometricShapes";
import { useScrollPause } from "@/hooks/useScrollPause";
import { use3DPerformance } from "@/hooks/use3DPerformance";
import { WebGLContextGuard } from "@/components/WebGLContextGuard";

const AboutScene = memo(() => (
  <>
    <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={50} />
    <ambientLight intensity={0.4} />
    <pointLight position={[10, 10, 10]} intensity={0.8} color="#06b6d4" />
    <pointLight position={[-10, -10, -10]} intensity={0.6} color="#8b5cf6" />
    
    <DNA />
    <FloatingParticles />
    <GeometricShapes />
    
    {/* Reduced stars */}
    <Stars 
      radius={12} 
      depth={4} 
      count={20} 
      factor={1.5} 
      saturation={0.5} 
      fade 
      speed={0.15}
    />
    
    <OrbitControls 
      enableZoom={false} 
      enablePan={false}
      autoRotate
      autoRotateSpeed={0.15}
      enableDamping={false}
    />
  </>
));

AboutScene.displayName = "AboutScene";

export const AboutBackground3D = () => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrolling = useScrollPause(200);
  const [webglKey, setWebglKey] = useState(0);
  const { shouldRender3D, isMobile } = use3DPerformance();

  useEffect(() => {
    if (!shouldRender3D || isMobile) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.01, rootMargin: '50px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [shouldRender3D, isMobile]);

  if (!shouldRender3D || isMobile) {
    return null;
  }

  return (
    <div 
      ref={containerRef}
      className="w-full h-full absolute inset-0 pointer-events-none"
      style={{ 
        willChange: 'opacity', 
        transform: 'translateZ(0)', 
        zIndex: 1,
        contain: 'layout style paint',
      }}
    >
      {isVisible && (
        <Canvas
          key={webglKey}
          dpr={[1, 1]}
          performance={{ min: 0.3, max: 0.5 }}
          frameloop={isScrolling ? "never" : "always"}
          gl={{ 
            antialias: false,
            alpha: true,
            powerPreference: "low-power",
            stencil: false,
          }}
          style={{ opacity: 0.3 }}
        >
          <Suspense fallback={null}>
            <WebGLContextGuard onContextLost={() => setWebglKey((k) => k + 1)} />
            <AboutScene />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
};
