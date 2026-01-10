import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Stars } from "@react-three/drei";
import { Suspense, useState, useEffect, useRef, memo } from "react";
import { useScrollPause } from "@/hooks/useScrollPause";
import { use3DPerformance } from "@/hooks/use3DPerformance";
import { Fade3DWrapper } from "./Fade3DWrapper";
import * as THREE from "three";

// Simplified creative shapes - fewer elements
const CreativeShapes = memo(() => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
    }
  });

  const shapes = [
    { position: [3, 2, -2], color: "#06b6d4", size: 0.6, type: "torus" },
    { position: [-3, -2, 2], color: "#8b5cf6", size: 0.5, type: "cone" },
    { position: [0, 3, 0], color: "#ec4899", size: 0.4, type: "torus" },
  ];

  return (
    <group ref={groupRef}>
      {shapes.map((shape, i) => (
        <mesh key={i} position={shape.position as [number, number, number]}>
          {shape.type === "torus" ? (
            <torusGeometry args={[shape.size * 0.7, shape.size * 0.3, 6, 12]} />
          ) : (
            <coneGeometry args={[shape.size, shape.size * 1.5, 5]} />
          )}
          <meshStandardMaterial
            color={shape.color}
            emissive={shape.color}
            emissiveIntensity={0.4}
            metalness={0.7}
            roughness={0.3}
            transparent
            opacity={0.5}
            wireframe={i % 2 === 0}
          />
        </mesh>
      ))}
    </group>
  );
});

CreativeShapes.displayName = "CreativeShapes";

// Simplified code particles - reduced from 15 to 8
const CodeParticles = memo(() => {
  const groupRef = useRef<THREE.Group>(null);
  const particles = useRef<Array<{ position: [number, number, number]; speed: number; size: number }>>([]);

  if (particles.current.length === 0) {
    for (let i = 0; i < 8; i++) {
      particles.current.push({
        position: [
          (Math.random() - 0.5) * 14,
          (Math.random() - 0.5) * 14,
          (Math.random() - 0.5) * 14,
        ],
        speed: 0.15 + Math.random() * 0.2,
        size: 0.06 + Math.random() * 0.08,
      });
    }
  }

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        const particle = particles.current[i];
        if (!particle) return;
        const time = state.clock.getElapsedTime();
        
        const y = particle.position[1] + Math.sin(time * particle.speed + i) * 1;
        const x = particle.position[0] + Math.cos(time * particle.speed * 0.5 + i) * 0.5;
        
        child.position.set(x, y, particle.position[2]);
      });
    }
  });

  return (
    <group ref={groupRef}>
      {particles.current.map((particle, i) => (
        <mesh key={i} position={particle.position}>
          <boxGeometry args={[particle.size, particle.size * 1.5, particle.size, 1, 1, 1]} />
          <meshStandardMaterial
            color={i % 3 === 0 ? "#06b6d4" : i % 3 === 1 ? "#8b5cf6" : "#ec4899"}
            emissive={i % 3 === 0 ? "#06b6d4" : i % 3 === 1 ? "#8b5cf6" : "#ec4899"}
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

CodeParticles.displayName = "CodeParticles";

const ProjectsScene = memo(() => (
  <>
    <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={50} />
    <ambientLight intensity={0.4} />
    <pointLight position={[10, 10, 10]} intensity={0.9} color="#06b6d4" />
    <pointLight position={[-10, -10, -10]} intensity={0.8} color="#8b5cf6" />
    
    <CreativeShapes />
    <CodeParticles />
    
    <Stars 
      radius={15} 
      depth={5} 
      count={30} 
      factor={2} 
      saturation={0.5} 
      fade 
      speed={0.2}
    />
    
    <OrbitControls 
      enableZoom={false} 
      enablePan={false}
      autoRotate
      autoRotateSpeed={0.2}
      enableDamping={false}
    />
  </>
));

ProjectsScene.displayName = "ProjectsScene";

export const ProjectsBackground3D = () => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrolling = useScrollPause(100);
  const { shouldRender3D, isMobile } = use3DPerformance();

  useEffect(() => {
    if (!shouldRender3D || isMobile) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.01, rootMargin: '100px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [shouldRender3D, isMobile]);

  return (
    <div 
      ref={containerRef}
      className="w-full h-full absolute inset-0 pointer-events-none"
      style={{ 
        willChange: 'opacity', 
        transform: 'translateZ(0)', 
        zIndex: 1,
        contain: 'layout style paint',
      }}
    >
      <Fade3DWrapper
        isVisible={isVisible}
        className="w-full h-full"
        style={{ opacity: 0.3 }}
      >
        <Canvas
          dpr={[1, 1]}
          performance={{ min: 0.3, max: 0.6 }}
          frameloop={isVisible && !isScrolling ? "always" : "never"}
          gl={{ 
            antialias: false,
            alpha: true,
            powerPreference: "low-power",
            stencil: false,
          }}
          className="w-full h-full"
        >
          <Suspense fallback={null}>
            <ProjectsScene />
          </Suspense>
        </Canvas>
      </Fade3DWrapper>
    </div>
  );
};
