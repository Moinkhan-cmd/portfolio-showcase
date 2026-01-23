import { useRef, memo } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Sphere } from "@react-three/drei";
import * as THREE from "three";

interface AnimatedSphereProps {
  detail?: number;
  distortSpeed?: number;
}

export const AnimatedSphere = memo(({ detail = 32, distortSpeed = 1 }: AnimatedSphereProps) => {
  const sphereRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
      sphereRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  // Reduced from 100x100 segments to dynamic detail (8-32)
  return (
    <Sphere ref={sphereRef} args={[1, detail, detail]} scale={2.4}>
      <MeshDistortMaterial
        color="#06b6d4"
        attach="material"
        distort={0.3}
        speed={distortSpeed}
        roughness={0.2}
        metalness={0.8}
      />
    </Sphere>
  );
});

AnimatedSphere.displayName = "AnimatedSphere";
