import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export const WaveGeometry = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current && meshRef.current.geometry) {
      const positions = meshRef.current.geometry.attributes.position;
      const time = state.clock.getElapsedTime();
      
      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const y = positions.getY(i);
        const wave = Math.sin(x * 2 + time) * 0.3 + Math.cos(y * 2 + time) * 0.3;
        positions.setZ(i, wave);
      }
      
      positions.needsUpdate = true;
      meshRef.current.geometry.computeVertexNormals();
    }
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 3, 0, 0]} position={[0, -2, 0]}>
      <planeGeometry args={[10, 10, 50, 50]} />
      <meshStandardMaterial
        color="#06b6d4"
        wireframe
        transparent
        opacity={0.4}
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  );
};
