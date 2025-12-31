import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export const GeometricShapes = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
      groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.2;
    }
  });

  const shapes = [
    { position: [3, 2, -2], color: "#06b6d4", size: 0.8 },
    { position: [-3, -2, 2], color: "#8b5cf6", size: 0.6 },
    { position: [0, 3, 0], color: "#06b6d4", size: 0.5 },
    { position: [-2, -3, -1], color: "#8b5cf6", size: 0.7 },
  ];

  return (
    <group ref={groupRef}>
      {shapes.map((shape, i) => (
        <mesh key={i} position={shape.position as [number, number, number]}>
          <octahedronGeometry args={[shape.size, 0]} />
          <meshStandardMaterial
            color={shape.color}
            emissive={shape.color}
            emissiveIntensity={0.2}
            metalness={0.7}
            roughness={0.3}
            transparent
            opacity={0.4}
            wireframe={i % 2 === 0}
          />
        </mesh>
      ))}
    </group>
  );
};

