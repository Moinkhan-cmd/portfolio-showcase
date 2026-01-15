import { useEffect } from "react";
import { useThree } from "@react-three/fiber";

interface WebGLContextGuardProps {
  onContextLost?: () => void;
}

export const WebGLContextGuard = ({ onContextLost }: WebGLContextGuardProps) => {
  const { gl } = useThree();

  useEffect(() => {
    const canvas = gl.domElement;

    const handleContextLost = (event: Event) => {
      // Allow the page to keep running; we'll remount the Canvas.
      event.preventDefault();
      onContextLost?.();
    };

    canvas.addEventListener("webglcontextlost", handleContextLost, false);
    return () => {
      canvas.removeEventListener("webglcontextlost", handleContextLost, false);
    };
  }, [gl, onContextLost]);

  return null;
};
