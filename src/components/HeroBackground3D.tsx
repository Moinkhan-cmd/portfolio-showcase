import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Stars } from "@react-three/drei";
import { Suspense, memo, useEffect, useRef, useState } from "react";
import { AnimatedSphere } from "./AnimatedSphere";
import { FloatingCube } from "./FloatingCube";
import { ParticleField } from "./ParticleField";
import { WaveGeometry } from "./WaveGeometry";
import { useScrollPause } from "@/hooks/useScrollPause";
import { use3DPerformance } from "@/hooks/use3DPerformance";
import { WebGLContextGuard } from "@/components/WebGLContextGuard";
import { useScrollLOD } from "@/hooks/useScrollLOD";
import { useWebGLFallback } from "@/hooks/useWebGLFallback";
import { StaticGradientFallback } from "./StaticGradientFallback";

interface HeroSceneProps {
  sphereDetail: number;
  particleCount: number;
  waveSegments: number;
  distortSpeed: number;
  enableWaveAnimation: boolean;
}

const HeroScene = memo(({ sphereDetail, particleCount, waveSegments, distortSpeed, enableWaveAnimation }: HeroSceneProps) => (
  <>
    <PerspectiveCamera makeDefault position={[0, 0, 8]} />
    <ambientLight intensity={0.3} />
    <pointLight position={[10, 10, 10]} intensity={0.8} color="#06b6d4" />
    <pointLight position={[-10, -10, -10]} intensity={0.4} color="#8b5cf6" />
    
    {/* LOD-aware 3D Elements */}
    <AnimatedSphere detail={sphereDetail} distortSpeed={distortSpeed} />
    <ParticleField count={particleCount} />
    <WaveGeometry segments={waveSegments} enableAnimation={enableWaveAnimation} />
    
    {/* Reduced to 3 cubes */}
    <FloatingCube position={[-4, 2, -3]} color="#06b6d4" speed={0.6} />
    <FloatingCube position={[4, -1, -4]} color="#8b5cf6" speed={0.8} />
    <FloatingCube position={[3, 3, -5]} color="#ec4899" speed={0.5} />
    
    {/* Reduced star count */}
    <Stars radius={80} depth={40} count={300} factor={2} saturation={0.2} fade speed={0.3} />
    
    <OrbitControls 
      enableZoom={false} 
      enablePan={false}
      autoRotate
      autoRotateSpeed={0.3}
      enableDamping={false}
      maxPolarAngle={Math.PI / 2}
      minPolarAngle={Math.PI / 2}
    />
  </>
));

HeroScene.displayName = "HeroScene";

export const HeroBackground3D = () => {
  const isScrolling = useScrollPause(200);
  const { shouldRender3D, isMobile } = use3DPerformance();
  const [isVisible, setIsVisible] = useState(true);
  const [webglKey, setWebglKey] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const lodSettings = useScrollLOD("hero");
  const { isWebGLAvailable, showFallback, handleContextLost } = useWebGLFallback();

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.01, rootMargin: "50px" }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Show fallback gradient if WebGL not supported, failed, or on mobile
  if (!shouldRender3D || isMobile || showFallback) {
    return <StaticGradientFallback variant="hero" />;
  }
  
  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 z-0"
      style={{ 
        willChange: 'transform',
        transform: 'translateZ(0)',
        contain: 'layout style paint',
      }}
    >
      <Suspense fallback={<StaticGradientFallback variant="hero" />}>
        {isVisible && isWebGLAvailable && (
          <Canvas
            key={webglKey}
            dpr={[1, 1]}
            performance={{ min: 0.3, max: 0.5 }}
            frameloop={isVisible && !isScrolling ? "always" : "never"}
            gl={{ 
              antialias: false,
              alpha: true,
              powerPreference: "low-power",
              stencil: false,
              depth: true,
            }}
          >
            <WebGLContextGuard onContextLost={() => {
              handleContextLost();
              setWebglKey((k) => k + 1);
            }} />
            <HeroScene {...lodSettings} />
          </Canvas>
        )}
      </Suspense>
    </div>
  );
};
