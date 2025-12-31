import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Stars } from "@react-three/drei";
import { Suspense, useState, useEffect, useRef } from "react";
import { useRef as useRef3D, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Communication-themed rings
const CommunicationRings = () => {
  const groupRef = useRef3D<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.18;
      groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.15;
    }
  });

  const rings = [
    { position: [3, 2, -2], color: "#06b6d4", size: 1.2, thickness: 0.15 },
    { position: [-3, -2, 2], color: "#8b5cf6", size: 1.0, thickness: 0.12 },
    { position: [0, 3, 0], color: "#ec4899", size: 0.9, thickness: 0.1 },
    { position: [-2, -3, -1], color: "#f59e0b", size: 1.1, thickness: 0.13 },
  ];

  return (
    <group ref={groupRef}>
      {rings.map((ring, i) => (
        <mesh key={i} position={ring.position as [number, number, number]}>
          <torusGeometry args={[ring.size, ring.thickness, 16, 32]} />
          <meshStandardMaterial
            color={ring.color}
            emissive={ring.color}
            emissiveIntensity={0.6}
            metalness={0.8}
            roughness={0.2}
            transparent
            opacity={0.7}
            wireframe={i % 2 === 0}
          />
        </mesh>
      ))}
    </group>
  );
};

// Message-like particles
const MessageParticles = () => {
  const groupRef = useRef3D<THREE.Group>(null);
  const particles: Array<{ position: [number, number, number]; speed: number; size: number }> = [];

  for (let i = 0; i < 40; i++) {
    particles.push({
      position: [
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
      ],
      speed: 0.2 + Math.random() * 0.3,
      size: 0.08 + Math.random() * 0.12,
    });
  }

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        const particle = particles[i];
        const time = state.clock.getElapsedTime();
        
        const y = particle.position[1] + Math.sin(time * particle.speed + i) * 1.5;
        const x = particle.position[0] + Math.cos(time * particle.speed * 0.7 + i) * 0.8;
        const z = particle.position[2] + Math.sin(time * particle.speed * 0.5 + i) * 0.8;
        
        child.position.set(x, y, z);
        child.rotation.y += 0.01;
        child.rotation.x += 0.005;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {particles.map((particle, i) => (
        <mesh key={i} position={particle.position}>
          <boxGeometry args={[particle.size, particle.size * 0.6, particle.size * 0.3]} />
          <meshStandardMaterial
            color={i % 4 === 0 ? "#06b6d4" : i % 4 === 1 ? "#8b5cf6" : i % 4 === 2 ? "#ec4899" : "#f59e0b"}
            emissive={i % 4 === 0 ? "#06b6d4" : i % 4 === 1 ? "#8b5cf6" : i % 4 === 2 ? "#ec4899" : "#f59e0b"}
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

export const ContactBackground3D = () => {
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0, rootMargin: '200px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
      setIsVisible(true);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={containerRef}
      className="w-full h-full absolute inset-0 pointer-events-none"
      style={{ willChange: 'opacity', transform: 'translateZ(0)', zIndex: 1 }}
    >
      {isVisible && (
        <Canvas
          dpr={[1, 1.5]}
          performance={{ min: 0.5 }}
          gl={{ 
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
          }}
          style={{ opacity: 0.35 }}
        >
          <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={50} />
          <Suspense fallback={null}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1.1} color="#06b6d4" />
            <pointLight position={[-10, -10, -10]} intensity={1.0} color="#8b5cf6" />
            <pointLight position={[0, 10, 0]} intensity={0.8} color="#ec4899" />
            <spotLight 
              position={[0, 5, 5]} 
              angle={0.5} 
              penumbra={0.5} 
              intensity={0.85} 
              color="#f59e0b"
            />
            
            <CommunicationRings />
            <MessageParticles />
            
            <Stars 
              radius={15} 
              depth={5} 
              count={140} 
              factor={3} 
              saturation={0.8} 
              fade 
              speed={0.5}
            />
            
            <OrbitControls 
              enableZoom={false} 
              enablePan={false}
              autoRotate
              autoRotateSpeed={0.3}
              enableDamping={false}
            />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
};

