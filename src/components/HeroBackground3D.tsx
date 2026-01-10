import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Stars } from "@react-three/drei";
import { Suspense, memo, useState, useEffect, useRef } from "react";
import { AnimatedSphere } from "./AnimatedSphere";
import { FloatingCube } from "./FloatingCube";
import { ParticleField } from "./ParticleField";
import { WaveGeometry } from "./WaveGeometry";
import { useScrollPause } from "@/hooks/useScrollPause";
import { use3DPerformance } from "@/hooks/use3DPerformance";
import { Fade3DWrapper } from "./Fade3DWrapper";

const HeroScene = memo(() => (
  <>
    <PerspectiveCamera makeDefault position={[0, 0, 8]} />
    <ambientLight intensity={0.3} />
    <pointLight position={[10, 10, 10]} intensity={1} color="#06b6d4" />
    <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8b5cf6" />
    
    <AnimatedSphere />
    <ParticleField />
    <WaveGeometry />
    
    <FloatingCube position={[-4, 2, -3]} color="#06b6d4" speed={0.8} />
    <FloatingCube position={[4, -1, -4]} color="#8b5cf6" speed={1.2} />
    <FloatingCube position={[3, 3, -5]} color="#ec4899" speed={0.6} />
    
    <Stars radius={100} depth={50} count={300} factor={2.5} saturation={0.2} fade speed={0.5} />
    
    <OrbitControls 
      enableZoom={false} 
      enablePan={false}
      autoRotate
      autoRotateSpeed={0.4}
      enableDamping={false}
      maxPolarAngle={Math.PI / 2}
      minPolarAngle={Math.PI / 2}
    />
  </>
));

HeroScene.displayName = "HeroScene";

export const HeroBackground3D = () => {
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrolling = useScrollPause(100);
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
  
  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 z-0"
      style={{ 
        willChange: 'opacity',
        transform: 'translateZ(0)',
        contain: 'layout style paint',
      }}
    >
      <Fade3DWrapper
        isVisible={isVisible}
        className="w-full h-full"
      >
        <Suspense fallback={null}>
          <Canvas
            dpr={[1, 1]}
            performance={{ min: 0.3, max: 0.6 }}
            frameloop={isVisible && !isScrolling ? "always" : "never"}
            gl={{ 
              antialias: false,
              alpha: true,
              powerPreference: "low-power",
              stencil: false,
              depth: true,
            }}
          >
            <HeroScene />
          </Canvas>
        </Suspense>
      </Fade3DWrapper>
    </div>
  );
};
