import { useRef, memo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export const GeometricShapes = memo(() => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
      groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.08) * 0.15;
    }
  });

  // Reduced from 4 shapes to 3 for performance
  const shapes = [
    { position: [3, 2, -2], color: "#06b6d4", size: 0.7 },
    { position: [-3, -2, 2], color: "#8b5cf6", size: 0.5 },
    { position: [0, 3, 0], color: "#06b6d4", size: 0.4 },
  ];

  return (
    <group ref={groupRef}>
      {shapes.map((shape, i) => (
        <mesh key={i} position={shape.position as [number, number, number]}>
          {/* Detail level 0 = lowest polygon count for octahedron */}
          <octahedronGeometry args={[shape.size, 0]} />
          <meshStandardMaterial
            color={shape.color}
            emissive={shape.color}
            emissiveIntensity={0.4}
            metalness={0.7}
            roughness={0.3}
            transparent
            opacity={0.5}
            wireframe
          />
        </mesh>
      ))}
    </group>
  );
});

GeometricShapes.displayName = "GeometricShapes";
