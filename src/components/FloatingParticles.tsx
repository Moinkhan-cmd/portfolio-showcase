import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface Particle {
  initialPosition: [number, number, number];
  speed: number;
  size: number;
  color: string;
  offset: number;
}

export const FloatingParticles = () => {
  const groupRef = useRef<THREE.Group>(null);
  const count = 20; // Reduced from 40 for better performance
  const particles: Particle[] = [];

  // Generate random particles
  for (let i = 0; i < count; i++) {
    particles.push({
      initialPosition: [
        (Math.random() - 0.5) * 18,
        (Math.random() - 0.5) * 18,
        (Math.random() - 0.5) * 18,
      ],
      speed: 0.2 + Math.random() * 0.3,
      size: 0.08 + Math.random() * 0.12,
      color: Math.random() > 0.5 ? "#06b6d4" : "#8b5cf6",
      offset: Math.random() * Math.PI * 2,
    });
  }

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        const particle = particles[i];
        const time = state.clock.getElapsedTime();
        
        // Floating animation
        const y = particle.initialPosition[1] + Math.sin(time * particle.speed + particle.offset) * 1.5;
        const x = particle.initialPosition[0] + Math.cos(time * particle.speed * 0.7 + particle.offset) * 0.8;
        const z = particle.initialPosition[2] + Math.sin(time * particle.speed * 0.5 + particle.offset) * 0.8;
        
        child.position.set(x, y, z);
        child.rotation.y += 0.01;
        child.rotation.x += 0.005;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {particles.map((particle, i) => (
        <mesh key={i} position={particle.initialPosition}>
          <sphereGeometry args={[particle.size, 8, 8]} />
          <meshStandardMaterial
            color={particle.color}
            emissive={particle.color}
            emissiveIntensity={0.7}
            metalness={0.6}
            roughness={0.4}
            transparent
            opacity={0.7}
          />
        </mesh>
      ))}
    </group>
  );
};

