import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Stars } from "@react-three/drei";
import { Suspense, useState, useEffect, useRef } from "react";
import { useRef as useRef3D, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Creative floating shapes
const CreativeShapes = () => {
  const groupRef = useRef3D<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
      groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.08) * 0.2;
    }
  });

  const shapes = [
    { position: [3, 2, -2], color: "#06b6d4", size: 0.7, type: "torus" },
    { position: [-3, -2, 2], color: "#8b5cf6", size: 0.6, type: "cone" },
    { position: [0, 3, 0], color: "#ec4899", size: 0.5, type: "torus" },
    { position: [-2, -3, -1], color: "#f59e0b", size: 0.65, type: "cone" },
    { position: [4, -1, 1], color: "#06b6d4", size: 0.55, type: "torus" },
  ];

  return (
    <group ref={groupRef}>
      {shapes.map((shape, i) => (
        <mesh key={i} position={shape.position as [number, number, number]}>
          {shape.type === "torus" ? (
            <torusGeometry args={[shape.size * 0.7, shape.size * 0.3, 16, 32]} />
          ) : (
            <coneGeometry args={[shape.size, shape.size * 1.5, 8]} />
          )}
          <meshStandardMaterial
            color={shape.color}
            emissive={shape.color}
            emissiveIntensity={0.5}
            metalness={0.8}
            roughness={0.2}
            transparent
            opacity={0.6}
            wireframe={i % 2 === 0}
          />
        </mesh>
      ))}
    </group>
  );
};

// Floating code-like particles
const CodeParticles = () => {
  const groupRef = useRef3D<THREE.Group>(null);
  const particles: Array<{ position: [number, number, number]; speed: number; size: number }> = [];

  for (let i = 0; i < 30; i++) {
    particles.push({
      position: [
        (Math.random() - 0.5) * 16,
        (Math.random() - 0.5) * 16,
        (Math.random() - 0.5) * 16,
      ],
      speed: 0.15 + Math.random() * 0.25,
      size: 0.06 + Math.random() * 0.1,
    });
  }

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        const particle = particles[i];
        const time = state.clock.getElapsedTime();
        
        const y = particle.position[1] + Math.sin(time * particle.speed + i) * 1.2;
        const x = particle.position[0] + Math.cos(time * particle.speed * 0.6 + i) * 0.7;
        const z = particle.position[2] + Math.sin(time * particle.speed * 0.4 + i) * 0.7;
        
        child.position.set(x, y, z);
        child.rotation.y += 0.015;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {particles.map((particle, i) => (
        <mesh key={i} position={particle.position}>
          <boxGeometry args={[particle.size, particle.size * 1.5, particle.size]} />
          <meshStandardMaterial
            color={i % 3 === 0 ? "#06b6d4" : i % 3 === 1 ? "#8b5cf6" : "#ec4899"}
            emissive={i % 3 === 0 ? "#06b6d4" : i % 3 === 1 ? "#8b5cf6" : "#ec4899"}
            emissiveIntensity={0.6}
            metalness={0.6}
            roughness={0.4}
            transparent
            opacity={0.65}
          />
        </mesh>
      ))}
    </group>
  );
};

export const ProjectsBackground3D = () => {
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
              intensity={0.8} 
              color="#f59e0b"
            />
            
            <CreativeShapes />
            <CodeParticles />
            
            <Stars 
              radius={15} 
              depth={5} 
              count={130} 
              factor={2.8} 
              saturation={0.75} 
              fade 
              speed={0.45}
            />
            
            <OrbitControls 
              enableZoom={false} 
              enablePan={false}
              autoRotate
              autoRotateSpeed={0.28}
              enableDamping={false}
            />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
};

