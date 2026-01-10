import { useRef, useMemo, memo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";

// Rotating geometric shape
const RotatingGeometry = memo(() => {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef1 = useRef<THREE.Mesh>(null);
  const ringRef2 = useRef<THREE.Mesh>(null);
  const ringRef3 = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    if (meshRef.current) {
      meshRef.current.rotation.x = t * 0.5;
      meshRef.current.rotation.y = t * 0.8;
    }
    
    if (ringRef1.current) {
      ringRef1.current.rotation.x = t * 1.2;
      ringRef1.current.rotation.y = t * 0.3;
    }
    
    if (ringRef2.current) {
      ringRef2.current.rotation.x = t * 0.5;
      ringRef2.current.rotation.z = t * 1.1;
    }
    
    if (ringRef3.current) {
      ringRef3.current.rotation.y = t * 0.8;
      ringRef3.current.rotation.z = t * 0.4;
    }
  });

  return (
    <group>
      {/* Central icosahedron */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial
          color="#8B5CF6"
          wireframe
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Orbital rings */}
      <mesh ref={ringRef1}>
        <torusGeometry args={[1, 0.02, 8, 32]} />
        <meshStandardMaterial
          color="#06B6D4"
          transparent
          opacity={0.6}
          emissive="#06B6D4"
          emissiveIntensity={0.3}
        />
      </mesh>

      <mesh ref={ringRef2}>
        <torusGeometry args={[1.3, 0.015, 8, 32]} />
        <meshStandardMaterial
          color="#D946EF"
          transparent
          opacity={0.5}
          emissive="#D946EF"
          emissiveIntensity={0.2}
        />
      </mesh>

      <mesh ref={ringRef3}>
        <torusGeometry args={[1.6, 0.01, 8, 32]} />
        <meshStandardMaterial
          color="#8B5CF6"
          transparent
          opacity={0.4}
          emissive="#8B5CF6"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Floating particles */}
      <FloatingParticles />
    </group>
  );
});

RotatingGeometry.displayName = "RotatingGeometry";

// Floating particles around the loader
const FloatingParticles = memo(() => {
  const pointsRef = useRef<THREE.Points>(null);
  
  const positions = useMemo(() => {
    const count = 50;
    const pos = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const r = 1.8 + Math.random() * 0.5;
      
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    
    return pos;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#06B6D4"
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
});

FloatingParticles.displayName = "FloatingParticles";

interface LoadingIndicator3DProps {
  isLoading: boolean;
  progress?: number;
  message?: string;
}

export const LoadingIndicator3D = memo(({ 
  isLoading, 
  progress, 
  message = "Loading" 
}: LoadingIndicator3DProps) => {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-background"
        >
          {/* 3D Canvas */}
          <div className="absolute inset-0">
            <Canvas
              camera={{ position: [0, 0, 5], fov: 45 }}
              dpr={[1, 1.5]}
              gl={{ antialias: true, alpha: true }}
            >
              <ambientLight intensity={0.4} />
              <pointLight position={[10, 10, 10]} intensity={1} color="#8B5CF6" />
              <pointLight position={[-10, -10, -10]} intensity={0.5} color="#06B6D4" />
              <RotatingGeometry />
            </Canvas>
          </div>

          {/* Overlay content */}
          <div className="relative z-10 flex flex-col items-center gap-6 pointer-events-none">
            {/* Loading text with animated dots */}
            <motion.div
              className="text-lg font-medium text-foreground/80 tracking-wide"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              {message}
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                ...
              </motion.span>
            </motion.div>

            {/* Progress bar (if progress is provided) */}
            {progress !== undefined && (
              <div className="w-48 h-1 bg-muted/30 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary via-purple-500 to-cyan-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
              </div>
            )}

            {/* Percentage (if progress is provided) */}
            {progress !== undefined && (
              <motion.span 
                className="text-sm text-muted-foreground font-mono"
                key={Math.round(progress)}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {Math.round(progress)}%
              </motion.span>
            )}
          </div>

          {/* Background gradient effects */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

LoadingIndicator3D.displayName = "LoadingIndicator3D";
