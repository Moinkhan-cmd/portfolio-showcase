import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Suspense } from "react";

interface Scene3DProps {
  children: React.ReactNode;
  className?: string;
  enableControls?: boolean;
}

export const Scene3D = ({ children, className = "", enableControls = false }: Scene3DProps) => {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} />
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#06b6d4" />
          <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={1} castShadow />
          {children}
          {enableControls && <OrbitControls enableZoom={false} enablePan={false} />}
        </Suspense>
      </Canvas>
    </div>
  );
};
