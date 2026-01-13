import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Stars } from "@react-three/drei";
import { Suspense, memo } from "react";
import { AnimatedSphere } from "./AnimatedSphere";
import { FloatingCube } from "./FloatingCube";
import { ParticleField } from "./ParticleField";
import { WaveGeometry } from "./WaveGeometry";
import { useScrollPause } from "@/hooks/useScrollPause";
import { use3DPerformance } from "@/hooks/use3DPerformance";

const HeroScene = memo(() => (
  <>
    <PerspectiveCamera makeDefault position={[0, 0, 8]} />
    {/* Lighting - reduced for performance */}
    <ambientLight intensity={0.3} />
    <pointLight position={[10, 10, 10]} intensity={1} color="#06b6d4" />
    <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8b5cf6" />
    
    {/* 3D Elements */}
    <AnimatedSphere />
    <ParticleField />
    <WaveGeometry />
    
    {/* Floating Cubes - Reduced from 10 to 5 */}
    <FloatingCube position={[-4, 2, -3]} color="#06b6d4" speed={0.8} />
    <FloatingCube position={[4, -1, -4]} color="#8b5cf6" speed={1.2} />
    <FloatingCube position={[3, 3, -5]} color="#ec4899" speed={0.6} />
    <FloatingCube position={[-3, -2, -3]} color="#f59e0b" speed={1} />
    <FloatingCube position={[0, 4, -6]} color="#3b82f6" speed={0.7} />
    
    {/* Stars background - reduced count */}
    <Stars radius={100} depth={50} count={500} factor={2.5} saturation={0.2} fade speed={0.5} />
    
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
  const isScrolling = useScrollPause(200);
  const { shouldRender3D, isMobile } = use3DPerformance();
  
  // Don't render 3D on mobile/touch devices
  if (!shouldRender3D || isMobile) {
    return null;
  }
  
  return (
    <div 
      className="absolute inset-0 z-0"
      style={{ 
        willChange: 'transform',
        transform: 'translateZ(0)',
        contain: 'layout style paint',
      }}
    >
      <Suspense fallback={null}>
        <Canvas
          dpr={[1, 1]}
          performance={{ min: 0.3, max: 0.6 }}
          frameloop={isScrolling ? "never" : "always"}
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
    </div>
  );
};
