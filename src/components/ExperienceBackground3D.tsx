import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Stars } from "@react-three/drei";
import { Suspense, useState, useEffect, useRef, memo } from "react";
import { useScrollPause } from "@/hooks/useScrollPause";
import { use3DPerformance } from "@/hooks/use3DPerformance";
import { WebGLContextGuard } from "@/components/WebGLContextGuard";
import { useWebGLFallback } from "@/hooks/useWebGLFallback";
import { StaticGradientFallback } from "./StaticGradientFallback";
import * as THREE from "three";

// Simplified timeline elements - reduced count
const TimelineElements = memo(() => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
    }
  });

  const elements = [
    { position: [2, 2, -2], color: "#06b6d4", size: 0.4 },
    { position: [-2, -2, 2], color: "#8b5cf6", size: 0.35 },
    { position: [0, 3, 0], color: "#06b6d4", size: 0.3 },
  ];

  return (
    <group ref={groupRef}>
      {elements.map((element, i) => (
        <mesh key={i} position={element.position as [number, number, number]}>
          <cylinderGeometry args={[element.size, element.size, element.size * 2, 6]} />
          <meshStandardMaterial
            color={element.color}
            emissive={element.color}
            emissiveIntensity={0.4}
            metalness={0.7}
            roughness={0.3}
            transparent
            opacity={0.5}
          />
        </mesh>
      ))}
    </group>
  );
});

TimelineElements.displayName = "TimelineElements";

// Simplified particles - reduced from 18 to 10
const ProfessionalParticles = memo(() => {
  const groupRef = useRef<THREE.Group>(null);
  const particles = useRef<Array<{ position: [number, number, number]; speed: number; size: number }>>([]);

  if (particles.current.length === 0) {
    for (let i = 0; i < 10; i++) {
      particles.current.push({
        position: [
          (Math.random() - 0.5) * 16,
          (Math.random() - 0.5) * 16,
          (Math.random() - 0.5) * 16,
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
        child.position.setY(y);
      });
    }
  });

  return (
    <group ref={groupRef}>
      {particles.current.map((particle, i) => (
        <mesh key={i} position={particle.position}>
          <sphereGeometry args={[particle.size, 6, 6]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? "#06b6d4" : "#8b5cf6"}
            emissive={i % 2 === 0 ? "#06b6d4" : "#8b5cf6"}
            emissiveIntensity={0.5}
            metalness={0.6}
            roughness={0.4}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}
    </group>
  );
});

ProfessionalParticles.displayName = "ProfessionalParticles";

const ExperienceScene = memo(() => (
  <>
    <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={50} />
    <ambientLight intensity={0.4} />
    <pointLight position={[10, 10, 10]} intensity={0.9} color="#06b6d4" />
    <pointLight position={[-10, -10, -10]} intensity={0.7} color="#8b5cf6" />
    
    <TimelineElements />
    <ProfessionalParticles />
    
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
      autoRotateSpeed={0.15}
      enableDamping={false}
    />
  </>
));

ExperienceScene.displayName = "ExperienceScene";

export const ExperienceBackground3D = () => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrolling = useScrollPause(200);
  const [webglKey, setWebglKey] = useState(0);
  const { shouldRender3D, isMobile } = use3DPerformance();
  const { isWebGLAvailable, showFallback, handleContextLost } = useWebGLFallback();

  useEffect(() => {
    if (!shouldRender3D || isMobile || showFallback) return;
    
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
  }, [shouldRender3D, isMobile, showFallback]);

  if (!shouldRender3D || isMobile || showFallback) {
    return <StaticGradientFallback variant="experience" />;
  }

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
      {isVisible && isWebGLAvailable && (
        <Canvas
          key={webglKey}
          dpr={[1, 1]}
          performance={{ min: 0.3, max: 0.6 }}
          frameloop={isVisible && !isScrolling ? "always" : "never"}
          gl={{ 
            antialias: false,
            alpha: true,
            powerPreference: "low-power",
            stencil: false,
          }}
          style={{ opacity: 0.25 }}
        >
          <Suspense fallback={null}>
            <WebGLContextGuard onContextLost={() => {
              handleContextLost();
              setWebglKey((k) => k + 1);
            }} />
            <ExperienceScene />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
};
