import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Float, MeshDistortMaterial } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState, memo } from "react";
import { useScrollPause } from "@/hooks/useScrollPause";
import { use3DPerformance } from "@/hooks/use3DPerformance";
import * as THREE from "three";

const WebGLContextGuard = () => {
  const { gl } = useThree();

  useEffect(() => {
    const canvas = gl.domElement;
    const handleContextLost = (event: Event) => {
      event.preventDefault();
    };

    canvas.addEventListener("webglcontextlost", handleContextLost, false);
    return () => {
      canvas.removeEventListener("webglcontextlost", handleContextLost, false);
    };
  }, [gl]);

  return null;
};

// Simplified Glowing Orb
const GlowingOrb = memo(({ position, color, size = 0.5 }: { position: [number, number, number]; color: string; size?: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8) * 0.3;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position}>
        <icosahedronGeometry args={[size, 0]} />
        <MeshDistortMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.6}
          roughness={0.3}
          metalness={0.7}
          distort={0.3}
          speed={1.5}
          transparent
          opacity={0.6}
        />
      </mesh>
    </Float>
  );
});

GlowingOrb.displayName = "GlowingOrb";

// Simplified Tech Cubes - reduced count
const TechCubes = memo(() => {
  const groupRef = useRef<THREE.Group>(null);
  
  const cubes = useMemo(() => [
    { position: [-5, 2, -2] as [number, number, number], color: "#06b6d4", size: 0.7 },
    { position: [5, -2, 2] as [number, number, number], color: "#8b5cf6", size: 0.5 },
    { position: [4, 3, -1] as [number, number, number], color: "#10b981", size: 0.6 },
  ], []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {cubes.map((cube, i) => (
        <mesh key={i} position={cube.position}>
          <boxGeometry args={[cube.size, cube.size, cube.size]} />
          <meshStandardMaterial
            color={cube.color}
            emissive={cube.color}
            emissiveIntensity={0.3}
            metalness={0.8}
            roughness={0.2}
            transparent
            opacity={0.5}
            wireframe={i % 2 === 0}
          />
        </mesh>
      ))}
    </group>
  );
});

TechCubes.displayName = "TechCubes";

// Simplified Particle Ring - fewer particles
const ParticleRing = memo(({ radius = 4, count = 20 }: { radius?: number; count?: number }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  const particles = useMemo(() => {
    const pts: { angle: number; y: number; size: number; color: string }[] = [];
    for (let i = 0; i < count; i++) {
      pts.push({
        angle: (i / count) * Math.PI * 2,
        y: (Math.random() - 0.5) * 2,
        size: 0.05 + Math.random() * 0.05,
        color: ["#06b6d4", "#8b5cf6", "#ec4899"][Math.floor(Math.random() * 3)]
      });
    }
    return pts;
  }, [count]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      {particles.map((p, i) => (
        <mesh key={i} position={[Math.cos(p.angle) * radius, p.y, Math.sin(p.angle) * radius]}>
          <sphereGeometry args={[p.size, 6, 6]} />
          <meshStandardMaterial
            color={p.color}
            emissive={p.color}
            emissiveIntensity={0.6}
            transparent
            opacity={0.7}
          />
        </mesh>
      ))}
    </group>
  );
});

ParticleRing.displayName = "ParticleRing";

const SkillsScene = memo(() => (
  <>
    <WebGLContextGuard />
    <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={50} />
    <ambientLight intensity={0.4} />
    <pointLight position={[10, 10, 10]} intensity={1.2} color="#06b6d4" />
    <pointLight position={[-10, -10, -10]} intensity={1} color="#8b5cf6" />
    
    <GlowingOrb position={[3, 2, -1]} color="#06b6d4" size={0.5} />
    <GlowingOrb position={[-4, -1, 1]} color="#8b5cf6" size={0.4} />
    
    <TechCubes />
    <ParticleRing radius={5} count={20} />
    
    <OrbitControls 
      enableZoom={false} 
      enablePan={false}
      autoRotate
      autoRotateSpeed={0.2}
      enableDamping={false}
    />
  </>
));

SkillsScene.displayName = "SkillsScene";

export const SkillsBackground3D = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrolling = useScrollPause(200);
  const [isVisible, setIsVisible] = useState(false);
  const { shouldRender3D, isMobile } = use3DPerformance();

  useEffect(() => {
    if (!shouldRender3D || isMobile) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [shouldRender3D, isMobile]);

  if (!shouldRender3D || isMobile) {
    return null;
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
      {isVisible && (
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
          style={{ opacity: 0.35 }}
        >
          <Suspense fallback={null}>
            <SkillsScene />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
};
