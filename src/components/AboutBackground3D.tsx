import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Stars } from "@react-three/drei";
import { Suspense, useState, useEffect, useRef } from "react";
import { DNA } from "./DNA";
import { FloatingParticles } from "./FloatingParticles";
import { GeometricShapes } from "./GeometricShapes";

export const AboutBackground3D = () => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={containerRef}
      className="w-full h-full absolute inset-0 opacity-[0.25] pointer-events-none"
      style={{ willChange: 'opacity', transform: 'translateZ(0)' }}
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
        >
          <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={50} />
          <Suspense fallback={null}>
            {/* Enhanced Lighting */}
            <ambientLight intensity={0.4} />
            <pointLight position={[10, 10, 10]} intensity={0.8} color="#06b6d4" />
            <pointLight position={[-10, -10, -10]} intensity={0.7} color="#8b5cf6" />
            <pointLight position={[0, 10, 0]} intensity={0.5} color="#06b6d4" />
            <spotLight 
              position={[0, 5, 5]} 
              angle={0.5} 
              penumbra={0.5} 
              intensity={0.6} 
              color="#8b5cf6"
            />
            
            {/* 3D Elements */}
            <DNA />
            <FloatingParticles />
            <GeometricShapes />
            
            {/* Subtle starfield */}
            <Stars 
              radius={15} 
              depth={5} 
              count={100} 
              factor={2} 
              saturation={0.5} 
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
