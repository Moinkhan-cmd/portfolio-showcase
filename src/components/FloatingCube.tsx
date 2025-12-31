import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";

interface FloatingCubeProps {
  position: [number, number, number];
  color: string;
  speed?: number;
}

export const FloatingCube = ({ position, color, speed = 1 }: FloatingCubeProps) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * speed * 0.3;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * speed * 0.5;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * speed) * 0.3;
    }
  });

  return (
    <RoundedBox ref={meshRef} args={[1, 1, 1]} radius={0.05} position={position}>
      <meshStandardMaterial
        color={color}
        metalness={0.6}
        roughness={0.2}
        emissive={color}
        emissiveIntensity={0.3}
      />
    </RoundedBox>
  );
};
