import { useRef, memo } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";

interface FloatingCubeProps {
  position: [number, number, number];
  color: string;
  speed?: number;
}

export const FloatingCube = memo(({ position, color, speed = 1 }: FloatingCubeProps) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * speed * 0.2;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * speed * 0.3;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * speed) * 0.25;
    }
  });

  return (
    <RoundedBox ref={meshRef} args={[0.8, 0.8, 0.8]} radius={0.04} smoothness={2} position={position}>
      <meshStandardMaterial
        color={color}
        metalness={0.5}
        roughness={0.3}
        emissive={color}
        emissiveIntensity={0.2}
      />
    </RoundedBox>
  );
});

FloatingCube.displayName = "FloatingCube";
