import { useEffect, useState, RefObject } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface CustomCursorProps {
  isActive?: boolean;
  containerRef?: RefObject<HTMLElement>;
}

export const CustomCursor = ({ isActive = true, containerRef }: CustomCursorProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPointer, setIsPointer] = useState(false);
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 300 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);
  
  useEffect(() => {
    if (!isActive) return;
    
    const container = containerRef?.current || document.body;
    
    const updateCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      setIsVisible(true);
    };
    
    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseDown = () => setIsPointer(true);
    const handleMouseUp = () => setIsPointer(false);
    
    // Check if element is interactive
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = 
        target.tagName === "A" || 
        target.tagName === "BUTTON" || 
        target.closest("a") !== null ||
        target.closest("button") !== null ||
        target.closest("[role='button']") !== null ||
        window.getComputedStyle(target).cursor === "pointer";
      
      setIsPointer(isInteractive);
    };
    
    container.addEventListener("mousemove", updateCursor);
    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);
    container.addEventListener("mousedown", handleMouseDown);
    container.addEventListener("mouseup", handleMouseUp);
    container.addEventListener("mouseover", handleMouseOver);
    
    return () => {
      container.removeEventListener("mousemove", updateCursor);
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
      container.removeEventListener("mousedown", handleMouseDown);
      container.removeEventListener("mouseup", handleMouseUp);
      container.removeEventListener("mouseover", handleMouseOver);
    };
  }, [isActive, containerRef, cursorX, cursorY]);
  
  if (!isActive || !isVisible) return null;
  
  return (
    <>
      {/* Outer ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          className={`w-8 h-8 rounded-full border-2 ${
            isPointer 
              ? "border-primary scale-150 bg-primary/20" 
              : "border-primary/60 bg-transparent"
          } transition-all duration-300 ease-out`}
          animate={{
            scale: isPointer ? [1, 1.2, 1] : 1,
          }}
          transition={{
            duration: 0.3,
          }}
        />
      </motion.div>
      
      {/* Inner dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          className={`w-2 h-2 rounded-full bg-primary transition-all duration-200 ${
            isPointer ? "scale-150" : "scale-100"
          }`}
        />
      </motion.div>
      
      {/* Glow effect */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          className="w-16 h-16 rounded-full bg-primary/20 blur-xl"
          animate={{
            scale: isPointer ? [1, 1.5, 1] : [1, 1.2, 1],
            opacity: isPointer ? [0.4, 0.6, 0.4] : [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </>
  );
};
