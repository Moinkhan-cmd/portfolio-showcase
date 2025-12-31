import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export const DNA = () => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.5;
    }
  });

  const spheres: JSX.Element[] = [];
  const helixHeight = 6;
  const helixRadius = 1.5;
  const sphereCount = 30;

  for (let i = 0; i < sphereCount; i++) {
    const t = (i / sphereCount) * Math.PI * 4;
    const y = (i / sphereCount) * helixHeight - helixHeight / 2;
    
    const x1 = Math.cos(t) * helixRadius;
    const z1 = Math.sin(t) * helixRadius;
    const x2 = Math.cos(t + Math.PI) * helixRadius;
    const z2 = Math.sin(t + Math.PI) * helixRadius;

    spheres.push(
      <mesh key={`sphere1-${i}`} position={[x1, y, z1]}>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial
          color="#06b6d4"
          emissive="#06b6d4"
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
    );

    spheres.push(
      <mesh key={`sphere2-${i}`} position={[x2, y, z2]}>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial
          color="#8b5cf6"
          emissive="#8b5cf6"
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
    );

    if (i % 3 === 0) {
      spheres.push(
        <mesh key={`connector-${i}`} position={[0, y, 0]}>
          <cylinderGeometry args={[0.05, 0.05, helixRadius * 2, 8]} />
          <meshStandardMaterial
            color="#fff"
            opacity={0.3}
            transparent
            metalness={0.5}
            roughness={0.5}
          />
        </mesh>
      );
    }
  }

  return <group ref={groupRef}>{spheres}</group>;
};
