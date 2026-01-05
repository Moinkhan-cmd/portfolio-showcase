import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Stars } from "@react-three/drei";
import { Suspense, useState, useEffect, useRef } from "react";
import { DNA } from "./DNA";
import { FloatingParticles } from "./FloatingParticles";
import { GeometricShapes } from "./GeometricShapes";
import { useScrollPause } from "@/hooks/useScrollPause";

export const AboutBackground3D = () => {
  const [isVisible, setIsVisible] = useState(true); // Start as true to show immediately
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrolling = useScrollPause(200);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1, rootMargin: '50px' } // Only render when actually visible
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
      // Set visible immediately
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
          frameloop={isScrolling ? "never" : "always"}
          gl={{ 
            antialias: false,
            alpha: true,
            powerPreference: "low-power"
          }}
          style={{ opacity: 0.4 }}
        >
          <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={50} />
          <Suspense fallback={null}>
            {/* Enhanced Lighting - brighter */}
            <ambientLight intensity={0.6} />
            <pointLight position={[10, 10, 10]} intensity={1.2} color="#06b6d4" />
            <pointLight position={[-10, -10, -10]} intensity={1.0} color="#8b5cf6" />
            <pointLight position={[0, 10, 0]} intensity={0.8} color="#06b6d4" />
            <spotLight 
              position={[0, 5, 5]} 
              angle={0.5} 
              penumbra={0.5} 
              intensity={0.9} 
              color="#8b5cf6"
            />
            
            {/* 3D Elements */}
            <DNA />
            <FloatingParticles />
            <GeometricShapes />
            
            {/* Subtle starfield - more visible */}
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
              autoRotateSpeed={0.3}
              enableDamping={false}
            />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
};
