import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Stars } from "@react-three/drei";
import { Suspense, useState, useEffect, useRef } from "react";
import { useScrollPause } from "@/hooks/useScrollPause";
import * as THREE from "three";

// Footer-themed celebration elements
const CelebrationElements = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
      groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.08) * 0.1;
    }
  });

  const elements = [
    { position: [3, 2, -2], color: "#06b6d4", size: 0.6, type: "star" },
    { position: [-3, -2, 2], color: "#8b5cf6", size: 0.5, type: "star" },
    { position: [0, 3, 0], color: "#ec4899", size: 0.45, type: "star" },
    { position: [-2, -3, -1], color: "#f59e0b", size: 0.55, type: "star" },
    { position: [4, -1, 1], color: "#06b6d4", size: 0.5, type: "star" },
  ];

  return (
    <group ref={groupRef}>
      {elements.map((element, i) => (
        <mesh key={i} position={element.position as [number, number, number]}>
          <octahedronGeometry args={[element.size, 0]} />
          <meshStandardMaterial
            color={element.color}
            emissive={element.color}
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

// Floating celebration particles
const CelebrationParticles = () => {
  const groupRef = useRef<THREE.Group>(null);
  const particles: Array<{ position: [number, number, number]; speed: number; size: number; color: string }> = [];

  for (let i = 0; i < 22; i++) { // Reduced from 45
    particles.push({
      position: [
        (Math.random() - 0.5) * 22,
        (Math.random() - 0.5) * 22,
        (Math.random() - 0.5) * 22,
      ],
      speed: 0.2 + Math.random() * 0.3,
      size: 0.08 + Math.random() * 0.12,
      color: ["#06b6d4", "#8b5cf6", "#ec4899", "#f59e0b"][i % 4],
    });
  }

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        const particle = particles[i];
        const time = state.clock.getElapsedTime();
        
        const y = particle.position[1] + Math.sin(time * particle.speed + i) * 1.6;
        const x = particle.position[0] + Math.cos(time * particle.speed * 0.7 + i) * 0.9;
        const z = particle.position[2] + Math.sin(time * particle.speed * 0.5 + i) * 0.9;
        
        child.position.set(x, y, z);
        child.rotation.y += 0.01;
        child.rotation.x += 0.005;
        child.rotation.z += 0.008;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {particles.map((particle, i) => (
        <mesh key={i} position={particle.position}>
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

// Heart-shaped elements for "Made with ❤️" theme
const HeartElements = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.12;
    }
  });

  const hearts = [
    { position: [2, 2, -2], color: "#ec4899", size: 0.4 },
    { position: [-2, -2, 2], color: "#f59e0b", size: 0.35 },
    { position: [0, 3, 0], color: "#ec4899", size: 0.3 },
  ];

  return (
    <group ref={groupRef}>
      {hearts.map((heart, i) => (
        <mesh key={i} position={heart.position as [number, number, number]}>
          <torusGeometry args={[heart.size, heart.size * 0.3, 6, 12]} />
          <meshStandardMaterial
            color={heart.color}
            emissive={heart.color}
            emissiveIntensity={0.6}
            metalness={0.7}
            roughness={0.3}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}
    </group>
  );
};

export const FooterBackground3D = () => {
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrolling = useScrollPause(200);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1, rootMargin: '50px' }
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
          dpr={[1, 1]}
          performance={{ min: 0.3, max: 0.8 }}
          frameloop={isVisible && !isScrolling ? "always" : "never"}
          gl={{ 
            antialias: false,
            alpha: true,
            powerPreference: "low-power"
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
            
            <CelebrationElements />
            <CelebrationParticles />
            <HeartElements />
            
            <Stars 
              radius={15} 
              depth={5} 
              count={50} 
              factor={2} 
              saturation={0.6} 
              fade 
              speed={0.3}
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

