import { useRef, useMemo, memo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface Particle {
  initialPosition: [number, number, number];
  speed: number;
  size: number;
  color: string;
  offset: number;
}

export const FloatingParticles = memo(() => {
  const groupRef = useRef<THREE.Group>(null);
  const count = 12; // Reduced from 20

  const particles = useMemo(() => {
    const result: Particle[] = [];
    for (let i = 0; i < count; i++) {
      result.push({
        initialPosition: [
          (Math.random() - 0.5) * 14,
          (Math.random() - 0.5) * 14,
          (Math.random() - 0.5) * 14,
        ],
        speed: 0.15 + Math.random() * 0.2,
        size: 0.06 + Math.random() * 0.08,
        color: Math.random() > 0.5 ? "#06b6d4" : "#8b5cf6",
        offset: Math.random() * Math.PI * 2,
      });
    }
    return result;
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        const particle = particles[i];
        if (!particle) return;
        const time = state.clock.getElapsedTime();
        
        const y = particle.initialPosition[1] + Math.sin(time * particle.speed + particle.offset) * 1.2;
        const x = particle.initialPosition[0] + Math.cos(time * particle.speed * 0.6 + particle.offset) * 0.6;
        const z = particle.initialPosition[2] + Math.sin(time * particle.speed * 0.4 + particle.offset) * 0.6;
        
        child.position.set(x, y, z);
        child.rotation.y += 0.008;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {particles.map((particle, i) => (
        <mesh key={i} position={particle.initialPosition}>
          <sphereGeometry args={[particle.size, 6, 6]} />
          <meshStandardMaterial
            color={particle.color}
            emissive={particle.color}
            emissiveIntensity={0.5}
            metalness={0.5}
            roughness={0.5}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}
    </group>
  );
});

FloatingParticles.displayName = "FloatingParticles";

