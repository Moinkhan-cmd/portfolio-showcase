import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Stars } from "@react-three/drei";
import { Suspense } from "react";
import { AnimatedSphere } from "./AnimatedSphere";
import { FloatingCube } from "./FloatingCube";
import { ParticleField } from "./ParticleField";
import { WaveGeometry } from "./WaveGeometry";
import { useScrollPause } from "@/hooks/useScrollPause";

export const HeroBackground3D = () => {
  const isScrolling = useScrollPause(200);
  
  return (
    <div className="absolute inset-0 z-0">
      <Suspense fallback={null}>
        <Canvas
          dpr={[1, 1]}
          performance={{ min: 0.3, max: 0.8 }}
          frameloop={isScrolling ? "never" : "always"}
          gl={{ 
            antialias: false,
            alpha: true,
            powerPreference: "low-power"
          }}
        >
        <PerspectiveCamera makeDefault position={[0, 0, 8]} />
          {/* Lighting */}
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#06b6d4" />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8b5cf6" />
          <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={0.8} />
          
          {/* 3D Elements */}
          <AnimatedSphere />
          <ParticleField />
          <WaveGeometry />
          
          {/* Floating Cubes - Enhanced with more variety and depth */}
          <FloatingCube position={[-4, 2, -3]} color="#06b6d4" speed={0.8} />
          <FloatingCube position={[4, -1, -4]} color="#8b5cf6" speed={1.2} />
          <FloatingCube position={[3, 3, -5]} color="#ec4899" speed={0.6} />
          <FloatingCube position={[-3, -2, -3]} color="#f59e0b" speed={1} />
          <FloatingCube position={[-5, -3, -4]} color="#10b981" speed={0.9} />
          <FloatingCube position={[5, 2, -5]} color="#f59e0b" speed={1.1} />
          <FloatingCube position={[0, 4, -6]} color="#3b82f6" speed={0.7} />
          <FloatingCube position={[-2, -4, -4]} color="#a855f7" speed={1.3} />
          <FloatingCube position={[2, -3, -5]} color="#ec4899" speed={0.85} />
          <FloatingCube position={[-1, 3, -4]} color="#06b6d4" speed={1.05} />
          
          {/* Stars background - enhanced */}
          <Stars radius={100} depth={50} count={1500} factor={2.5} saturation={0.2} fade speed={0.8} />
          
          {/* Interactive orbit controls */}
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.6}
            enableDamping={true}
            dampingFactor={0.05}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
          />
      </Canvas>
      </Suspense>
    </div>
  );
};
