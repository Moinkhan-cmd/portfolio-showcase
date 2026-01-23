import { useRef, memo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export const DNA = memo(() => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
      groupRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.4;
    }
  });

  const spheres: JSX.Element[] = [];
  const helixHeight = 5;
  const helixRadius = 1.2;
  const sphereCount = 12; // Reduced from 20

  for (let i = 0; i < sphereCount; i++) {
    const t = (i / sphereCount) * Math.PI * 3;
    const y = (i / sphereCount) * helixHeight - helixHeight / 2;
    
    const x1 = Math.cos(t) * helixRadius;
    const z1 = Math.sin(t) * helixRadius;
    const x2 = Math.cos(t + Math.PI) * helixRadius;
    const z2 = Math.sin(t + Math.PI) * helixRadius;

    spheres.push(
      <mesh key={`sphere1-${i}`} position={[x1, y, z1]}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshStandardMaterial
          color="#06b6d4"
          emissive="#06b6d4"
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={0.7}
        />
      </mesh>
    );

    spheres.push(
      <mesh key={`sphere2-${i}`} position={[x2, y, z2]}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshStandardMaterial
          color="#8b5cf6"
          emissive="#8b5cf6"
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={0.7}
        />
      </mesh>
    );

    // Reduced connector frequency
    if (i % 4 === 0) {
      spheres.push(
        <mesh key={`connector-${i}`} position={[0, y, 0]}>
          <cylinderGeometry args={[0.03, 0.03, helixRadius * 2, 4]} />
          <meshStandardMaterial
            color="#fff"
            emissive="#06b6d4"
            emissiveIntensity={0.08}
            opacity={0.15}
            transparent
            metalness={0.6}
            roughness={0.4}
          />
        </mesh>
      );
    }
  }

  return <group ref={groupRef}>{spheres}</group>;
});

DNA.displayName = "DNA";
