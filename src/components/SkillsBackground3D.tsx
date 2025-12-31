import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Stars } from "@react-three/drei";
import { Suspense, useState, useEffect, useRef } from "react";
import { FloatingParticles } from "./FloatingParticles";
import { useRef as useRef3D, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Tech-themed geometric shapes
const TechShapes = () => {
  const groupRef = useRef3D<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
      groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.15;
    }
  });

  const shapes = [
    { position: [4, 2, -2], color: "#06b6d4", size: 0.6 },
    { position: [-4, -2, 2], color: "#8b5cf6", size: 0.5 },
    { position: [0, 3, 0], color: "#06b6d4", size: 0.4 },
    { position: [-3, -3, -1], color: "#8b5cf6", size: 0.55 },
    { position: [3, -2, 1], color: "#ec4899", size: 0.45 },
  ];

  return (
    <group ref={groupRef}>
      {shapes.map((shape, i) => (
        <mesh key={i} position={shape.position as [number, number, number]}>
          <boxGeometry args={[shape.size, shape.size, shape.size]} />
          <meshStandardMaterial
            color={shape.color}
            emissive={shape.color}
            emissiveIntensity={0.5}
            metalness={0.7}
            roughness={0.3}
            transparent
            opacity={0.6}
            wireframe={i % 3 === 0}
          />
        </mesh>
      ))}
    </group>
  );
};

export const SkillsBackground3D = () => {
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
            <pointLight position={[10, 10, 10]} intensity={1.0} color="#06b6d4" />
            <pointLight position={[-10, -10, -10]} intensity={0.9} color="#8b5cf6" />
            <pointLight position={[0, 10, 0]} intensity={0.7} color="#ec4899" />
            
            <FloatingParticles />
            <TechShapes />
            
            <Stars 
              radius={15} 
              depth={5} 
              count={120} 
              factor={2.5} 
              saturation={0.7} 
              fade 
              speed={0.4}
            />
            
            <OrbitControls 
              enableZoom={false} 
              enablePan={false}
              autoRotate
              autoRotateSpeed={0.25}
              enableDamping={false}
            />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
};

