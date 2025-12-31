import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Stars } from "@react-three/drei";
import { Suspense } from "react";
import { AnimatedSphere } from "./AnimatedSphere";
import { FloatingCube } from "./FloatingCube";
import { ParticleField } from "./ParticleField";
import { WaveGeometry } from "./WaveGeometry";

export const HeroBackground3D = () => {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} />
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#06b6d4" />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8b5cf6" />
          <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={0.8} />
          
          {/* 3D Elements */}
          <AnimatedSphere />
          <ParticleField />
          <WaveGeometry />
          
          {/* Floating Cubes */}
          <FloatingCube position={[-4, 2, -3]} color="#06b6d4" speed={0.8} />
          <FloatingCube position={[4, -1, -4]} color="#8b5cf6" speed={1.2} />
          <FloatingCube position={[3, 3, -5]} color="#ec4899" speed={0.6} />
          <FloatingCube position={[-3, -2, -3]} color="#f59e0b" speed={1} />
          
          {/* Stars background */}
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          
          {/* Subtle orbit controls for interactivity */}
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.5}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
