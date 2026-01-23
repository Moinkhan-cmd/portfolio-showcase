import { useRef, memo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface WaveGeometryProps {
  segments?: number;
  enableAnimation?: boolean;
}

export const WaveGeometry = memo(({ segments = 20, enableAnimation = true }: WaveGeometryProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!enableAnimation || !meshRef.current || !meshRef.current.geometry) return;
    
    const positions = meshRef.current.geometry.attributes.position;
    const time = state.clock.getElapsedTime();
    
    // Optimized: Only update every 2nd vertex for performance
    for (let i = 0; i < positions.count; i += 2) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const wave = Math.sin(x * 2 + time) * 0.25 + Math.cos(y * 2 + time) * 0.25;
      positions.setZ(i, wave);
      // Apply same wave to adjacent vertex for smoother appearance
      if (i + 1 < positions.count) {
        positions.setZ(i + 1, wave);
      }
    }
    
    positions.needsUpdate = true;
  });

  // Reduced from 50x50 segments to dynamic (8-20)
  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 3, 0, 0]} position={[0, -2, 0]}>
      <planeGeometry args={[10, 10, segments, segments]} />
      <meshStandardMaterial
        color="#06b6d4"
        wireframe
        transparent
        opacity={0.35}
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  );
});

WaveGeometry.displayName = "WaveGeometry";
