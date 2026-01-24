import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Stars } from "@react-three/drei";
import { Suspense, useState, useEffect, useRef, memo } from "react";
import { useScrollPause } from "@/hooks/useScrollPause";
import { use3DPerformance } from "@/hooks/use3DPerformance";
import { WebGLContextGuard } from "@/components/WebGLContextGuard";
import { useWebGLFallback } from "@/hooks/useWebGLFallback";
import { StaticGradientFallback } from "./StaticGradientFallback";
import * as THREE from "three";

// Simplified communication rings - reduced count
const CommunicationRings = memo(() => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
    }
  });

  const rings = [
    { position: [3, 2, -2], color: "#06b6d4", size: 1.0, thickness: 0.12 },
    { position: [-3, -2, 2], color: "#8b5cf6", size: 0.8, thickness: 0.1 },
    { position: [0, 3, 0], color: "#ec4899", size: 0.7, thickness: 0.08 },
  ];

  return (
    <group ref={groupRef}>
      {rings.map((ring, i) => (
        <mesh key={i} position={ring.position as [number, number, number]}>
          <torusGeometry args={[ring.size, ring.thickness, 6, 12]} />
          <meshStandardMaterial
            color={ring.color}
            emissive={ring.color}
            emissiveIntensity={0.5}
            metalness={0.7}
            roughness={0.3}
            transparent
            opacity={0.6}
            wireframe={i % 2 === 0}
          />
        </mesh>
      ))}
    </group>
  );
});

CommunicationRings.displayName = "CommunicationRings";

// Simplified message particles - reduced from 20 to 10
const MessageParticles = memo(() => {
  const groupRef = useRef<THREE.Group>(null);
  const particles = useRef<Array<{ position: [number, number, number]; speed: number; size: number }>>([]);

  if (particles.current.length === 0) {
    for (let i = 0; i < 10; i++) {
      particles.current.push({
        position: [
          (Math.random() - 0.5) * 18,
          (Math.random() - 0.5) * 18,
          (Math.random() - 0.5) * 18,
        ],
        speed: 0.18 + Math.random() * 0.25,
        size: 0.07 + Math.random() * 0.1,
      });
    }
  }

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        const particle = particles.current[i];
        if (!particle) return;
        const time = state.clock.getElapsedTime();
        
        const y = particle.position[1] + Math.sin(time * particle.speed + i) * 1.2;
        child.position.setY(y);
      });
    }
  });

  return (
    <group ref={groupRef}>
      {particles.current.map((particle, i) => (
        <mesh key={i} position={particle.position}>
          <boxGeometry args={[particle.size, particle.size * 0.6, particle.size * 0.3, 1, 1, 1]} />
          <meshStandardMaterial
            color={i % 4 === 0 ? "#06b6d4" : i % 4 === 1 ? "#8b5cf6" : i % 4 === 2 ? "#ec4899" : "#f59e0b"}
            emissive={i % 4 === 0 ? "#06b6d4" : i % 4 === 1 ? "#8b5cf6" : i % 4 === 2 ? "#ec4899" : "#f59e0b"}
            emissiveIntensity={0.6}
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

MessageParticles.displayName = "MessageParticles";

const ContactScene = memo(() => (
  <>
    <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={50} />
    <ambientLight intensity={0.4} />
    <pointLight position={[10, 10, 10]} intensity={0.9} color="#06b6d4" />
    <pointLight position={[-10, -10, -10]} intensity={0.8} color="#8b5cf6" />
    
    <CommunicationRings />
    <MessageParticles />
    
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

ContactScene.displayName = "ContactScene";

export const ContactBackground3D = () => {
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
    return <StaticGradientFallback variant="contact" />;
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
          style={{ opacity: 0.3 }}
        >
          <Suspense fallback={null}>
            <WebGLContextGuard onContextLost={() => {
              handleContextLost();
              setWebglKey((k) => k + 1);
            }} />
            <ContactScene />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
};
