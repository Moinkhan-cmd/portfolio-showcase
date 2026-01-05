import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

interface SkillsSphereProps {
  skills: string[];
}

export const SkillsSphere = ({ skills }: SkillsSphereProps) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
    }
  });

  const radius = 4;
  const skillPositions = skills.map((_, index) => {
    const phi = Math.acos(-1 + (2 * index) / skills.length);
    const theta = Math.sqrt(skills.length * Math.PI) * phi;
    
    return [
      radius * Math.cos(theta) * Math.sin(phi),
      radius * Math.sin(theta) * Math.sin(phi),
      radius * Math.cos(phi),
    ] as [number, number, number];
  });

  return (
    <group ref={groupRef}>
      {skills.map((skill, index) => (
        <group key={skill} position={skillPositions[index]}>
          <mesh>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial
              color="#06b6d4"
              emissive="#06b6d4"
              emissiveIntensity={0.5}
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
          <Text
            position={[0, -0.4, 0]}
            fontSize={0.3}
            color="#fff"
            anchorX="center"
            anchorY="middle"
          >
            {skill}
          </Text>
        </group>
      ))}
      
      {/* Connecting lines */}
      {skills.map((_, index) => {
        if (index < skills.length - 1) {
          return (
            <line key={`line-${index}`}>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  count={2}
                  array={new Float32Array([...skillPositions[index], ...skillPositions[index + 1]])}
                  itemSize={3}
                />
              </bufferGeometry>
              <lineBasicMaterial color="#06b6d4" opacity={0.3} transparent />
            </line>
          );
        }
        return null;
      })}
    </group>
  );
};
