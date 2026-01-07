import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Float, MeshDistortMaterial, Sphere, Text3D, Center } from "@react-three/drei";
import { Suspense, useRef, useMemo } from "react";
import { useScrollPause } from "@/hooks/useScrollPause";
import * as THREE from "three";

// Glowing Orb Component
const GlowingOrb = ({ position, color, size = 0.5, speed = 1 }: { position: [number, number, number]; color: string; size?: number; speed?: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.5;
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3;
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} position={position}>
        <icosahedronGeometry args={[size, 1]} />
        <MeshDistortMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.8}
          roughness={0.2}
          metalness={0.8}
          distort={0.4}
          speed={2}
          transparent
          opacity={0.7}
        />
      </mesh>
    </Float>
  );
};

// Floating DNA Helix
const DNAHelix = () => {
  const groupRef = useRef<THREE.Group>(null);
  const points = useMemo(() => {
    const pts: { pos1: [number, number, number]; pos2: [number, number, number]; color: string }[] = [];
    for (let i = 0; i < 20; i++) {
      const t = i * 0.5;
      const x1 = Math.cos(t) * 2;
      const z1 = Math.sin(t) * 2;
      const x2 = Math.cos(t + Math.PI) * 2;
      const z2 = Math.sin(t + Math.PI) * 2;
      const y = i * 0.4 - 4;
      pts.push({
        pos1: [x1, y, z1],
        pos2: [x2, y, z2],
        color: i % 2 === 0 ? "#06b6d4" : "#8b5cf6"
      });
    }
    return pts;
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <group ref={groupRef} position={[6, 0, -3]}>
      {points.map((point, i) => (
        <group key={i}>
          <mesh position={point.pos1}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial color={point.color} emissive={point.color} emissiveIntensity={0.6} />
          </mesh>
          <mesh position={point.pos2}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial color={point.color} emissive={point.color} emissiveIntensity={0.6} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

// Floating Tech Cubes
const TechCubes = () => {
  const groupRef = useRef<THREE.Group>(null);
  
  const cubes = useMemo(() => [
    { position: [-5, 2, -2] as [number, number, number], color: "#06b6d4", size: 0.8, rotSpeed: 0.5 },
    { position: [5, -2, 2] as [number, number, number], color: "#8b5cf6", size: 0.6, rotSpeed: 0.7 },
    { position: [-3, -3, 1] as [number, number, number], color: "#ec4899", size: 0.5, rotSpeed: 0.4 },
    { position: [4, 3, -1] as [number, number, number], color: "#10b981", size: 0.7, rotSpeed: 0.6 },
    { position: [0, 4, 0] as [number, number, number], color: "#f59e0b", size: 0.4, rotSpeed: 0.8 },
  ], []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((cube, i) => {
        const data = cubes[i];
        cube.rotation.x = state.clock.elapsedTime * data.rotSpeed;
        cube.rotation.y = state.clock.elapsedTime * data.rotSpeed * 0.7;
        cube.position.y = data.position[1] + Math.sin(state.clock.elapsedTime + i) * 0.5;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {cubes.map((cube, i) => (
        <Float key={i} speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
          <mesh position={cube.position}>
            <boxGeometry args={[cube.size, cube.size, cube.size]} />
            <meshStandardMaterial
              color={cube.color}
              emissive={cube.color}
              emissiveIntensity={0.4}
              metalness={0.9}
              roughness={0.1}
              transparent
              opacity={0.6}
              wireframe={i % 2 === 0}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
};

// Particle Ring
const ParticleRing = ({ radius = 4, count = 40 }: { radius?: number; count?: number }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  const particles = useMemo(() => {
    const pts: { angle: number; y: number; size: number; color: string }[] = [];
    for (let i = 0; i < count; i++) {
      pts.push({
        angle: (i / count) * Math.PI * 2,
        y: (Math.random() - 0.5) * 2,
        size: 0.05 + Math.random() * 0.08,
        color: ["#06b6d4", "#8b5cf6", "#ec4899", "#10b981"][Math.floor(Math.random() * 4)]
      });
    }
    return pts;
  }, [count]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      {particles.map((p, i) => (
        <mesh key={i} position={[Math.cos(p.angle) * radius, p.y, Math.sin(p.angle) * radius]}>
          <sphereGeometry args={[p.size, 8, 8]} />
          <meshStandardMaterial
            color={p.color}
            emissive={p.color}
            emissiveIntensity={0.8}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}
    </group>
  );
};

// Floating Torus
const FloatingTorus = () => {
  const torusRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (torusRef.current) {
      torusRef.current.rotation.x = state.clock.elapsedTime * 0.3;
      torusRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh ref={torusRef} position={[-6, 0, -2]}>
        <torusGeometry args={[1.5, 0.3, 16, 50]} />
        <meshStandardMaterial
          color="#8b5cf6"
          emissive="#8b5cf6"
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={0.5}
          wireframe
        />
      </mesh>
    </Float>
  );
};

// Main Background Component
export const SkillsBackground3D = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrolling = useScrollPause(200);

  return (
    <div 
      ref={containerRef}
      className="w-full h-full absolute inset-0 pointer-events-none"
      style={{ willChange: 'opacity', transform: 'translateZ(0)', zIndex: 1 }}
    >
      <Canvas
        dpr={[1, 1.5]}
        performance={{ min: 0.5, max: 1 }}
        frameloop={!isScrolling ? "always" : "demand"}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: "high-performance"
        }}
        style={{ opacity: 0.4 }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={50} />
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={1.5} color="#06b6d4" />
          <pointLight position={[-10, -10, -10]} intensity={1.2} color="#8b5cf6" />
          <pointLight position={[0, 10, 0]} intensity={1} color="#ec4899" />
          <spotLight position={[0, 20, 0]} angle={0.3} penumbra={1} intensity={0.5} color="#10b981" />
          
          <GlowingOrb position={[3, 2, -1]} color="#06b6d4" size={0.6} speed={0.8} />
          <GlowingOrb position={[-4, -1, 1]} color="#8b5cf6" size={0.5} speed={1.2} />
          <GlowingOrb position={[0, -3, -2]} color="#ec4899" size={0.4} speed={1} />
          
          <TechCubes />
          <DNAHelix />
          <ParticleRing radius={5} count={50} />
          <FloatingTorus />
          
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.3}
            enableDamping
            dampingFactor={0.05}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
