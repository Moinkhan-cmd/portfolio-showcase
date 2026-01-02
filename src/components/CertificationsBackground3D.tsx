import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Stars } from "@react-three/drei";
import { Suspense, useState, useEffect, useRef } from "react";
import { useScrollPause } from "@/hooks/useScrollPause";
import * as THREE from "three";

// Award/Trophy-like elements
const AwardElements = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
    }
  });

  const elements = [
    { position: [2, 2, -2], color: "#fbbf24", size: 0.5 }, // Gold
    { position: [-2, -2, 2], color: "#06b6d4", size: 0.45 }, // Cyan
    { position: [0, 3, 0], color: "#fbbf24", size: 0.4 }, // Gold
    { position: [-3, 0, -1], color: "#8b5cf6", size: 0.5 }, // Purple
    { position: [3, -1, 1], color: "#06b6d4", size: 0.45 }, // Cyan
  ];

  return (
    <group ref={groupRef}>
      {elements.map((element, i) => (
        <mesh key={i} position={element.position as [number, number, number]}>
          <octahedronGeometry args={[element.size, 0]} />
          <meshStandardMaterial
            color={element.color}
            emissive={element.color}
            emissiveIntensity={0.5}
            metalness={0.8}
            roughness={0.2}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}
    </group>
  );
};

// Floating certificate particles
const CertificateParticles = () => {
  const groupRef = useRef<THREE.Group>(null);
  const particles: Array<{ position: [number, number, number]; speed: number; size: number }> = [];

  for (let i = 0; i < 18; i++) {
    particles.push({
      position: [
        (Math.random() - 0.5) * 18,
        (Math.random() - 0.5) * 18,
        (Math.random() - 0.5) * 18,
      ],
      speed: 0.18 + Math.random() * 0.28,
      size: 0.07 + Math.random() * 0.11,
    });
  }

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        const particle = particles[i];
        const time = state.clock.getElapsedTime();
        
        const y = particle.position[1] + Math.sin(time * particle.speed + i) * 1.3;
        const x = particle.position[0] + Math.cos(time * particle.speed * 0.65 + i) * 0.75;
        const z = particle.position[2] + Math.sin(time * particle.speed * 0.45 + i) * 0.75;
        
        child.position.set(x, y, z);
        child.rotation.y += 0.012;
        child.rotation.x += 0.006;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {particles.map((particle, i) => (
        <mesh key={i} position={particle.position}>
          <boxGeometry args={[particle.size * 1.5, particle.size * 2, particle.size * 0.3]} />
          <meshStandardMaterial
            color={i % 3 === 0 ? "#fbbf24" : i % 3 === 1 ? "#06b6d4" : "#8b5cf6"}
            emissive={i % 3 === 0 ? "#fbbf24" : i % 3 === 1 ? "#06b6d4" : "#8b5cf6"}
            emissiveIntensity={0.6}
            metalness={0.7}
            roughness={0.3}
            transparent
            opacity={0.65}
          />
        </mesh>
      ))}
    </group>
  );
};

// Badge/Medal elements
const BadgeElements = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.2;
      groupRef.current.rotation.z = Math.cos(state.clock.getElapsedTime() * 0.1) * 0.2;
    }
  });

  const badges = [
    { position: [1.5, 1.5, -1.5], color: "#fbbf24", size: 0.4 },
    { position: [-1.5, -1.5, 1.5], color: "#06b6d4", size: 0.35 },
    { position: [0, -2.5, 0], color: "#8b5cf6", size: 0.4 },
  ];

  return (
    <group ref={groupRef}>
      {badges.map((badge, i) => (
        <mesh key={i} position={badge.position as [number, number, number]}>
          <torusGeometry args={[badge.size, badge.size * 0.3, 8, 16]} />
          <meshStandardMaterial
            color={badge.color}
            emissive={badge.color}
            emissiveIntensity={0.5}
            metalness={0.8}
            roughness={0.2}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}
    </group>
  );
};

export const CertificationsBackground3D = () => {
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
          style={{ opacity: 0.3 }}
        >
          <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={50} />
          <Suspense fallback={null}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1.0} color="#fbbf24" />
            <pointLight position={[-10, -10, -10]} intensity={0.9} color="#06b6d4" />
            <pointLight position={[0, 10, 0]} intensity={0.7} color="#8b5cf6" />
            
            <AwardElements />
            <CertificateParticles />
            <BadgeElements />
            
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
              autoRotateSpeed={0.22}
              enableDamping={false}
            />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
};



