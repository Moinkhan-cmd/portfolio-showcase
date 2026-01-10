import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Stars } from "@react-three/drei";
import { Suspense, useState, useEffect, useRef, memo } from "react";
import { DNA } from "./DNA";
import { FloatingParticles } from "./FloatingParticles";
import { GeometricShapes } from "./GeometricShapes";
import { useScrollPause } from "@/hooks/useScrollPause";
import { use3DPerformance } from "@/hooks/use3DPerformance";
import { Fade3DWrapper } from "./Fade3DWrapper";

const AboutScene = memo(() => (
  <>
    <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={50} />
    <ambientLight intensity={0.5} />
    <pointLight position={[10, 10, 10]} intensity={1} color="#06b6d4" />
    <pointLight position={[-10, -10, -10]} intensity={0.8} color="#8b5cf6" />
    
    <DNA />
    <FloatingParticles />
    <GeometricShapes />
    
    <Stars radius={15} depth={5} count={30} factor={2} saturation={0.6} fade speed={0.2} />
    
    <OrbitControls 
      enableZoom={false} 
      enablePan={false}
      autoRotate
      autoRotateSpeed={0.2}
      enableDamping={false}
    />
  </>
));

AboutScene.displayName = "AboutScene";

export const AboutBackground3D = () => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrolling = useScrollPause(100);
  const { shouldRender3D, isMobile } = use3DPerformance();

  useEffect(() => {
    if (!shouldRender3D || isMobile) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.01, rootMargin: '100px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [shouldRender3D, isMobile]);

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
      <Fade3DWrapper
        isVisible={isVisible}
        className="w-full h-full"
        style={{ opacity: 0.35 }}
      >
        <Canvas
          dpr={[1, 1]}
          performance={{ min: 0.3, max: 0.6 }}
          frameloop={isVisible && !isScrolling ? "always" : "never"}
          gl={{ 
            antialias: false,
            alpha: true,
            powerPreference: "low-power",
            stencil: false,
          }}
          className="w-full h-full"
        >
          <Suspense fallback={null}>
            <AboutScene />
          </Suspense>
        </Canvas>
      </Fade3DWrapper>
    </div>
  );
};
