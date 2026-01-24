/**
 * WebGL detection and fallback utilities
 */

let webglSupported: boolean | null = null;
let webglFailed = false;

/**
 * Check if WebGL is supported in the current browser
 */
export const isWebGLSupported = (): boolean => {
  if (webglSupported !== null) {
    return webglSupported && !webglFailed;
  }

  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    webglSupported = gl !== null;
    
    // Clean up
    if (gl) {
      const loseContext = (gl as WebGLRenderingContext).getExtension("WEBGL_lose_context");
      if (loseContext) {
        loseContext.loseContext();
      }
    }
  } catch (e) {
    webglSupported = false;
  }

  return webglSupported && !webglFailed;
};

/**
 * Mark WebGL as failed (e.g., after context loss)
 */
export const markWebGLFailed = (): void => {
  webglFailed = true;
};

/**
 * Reset WebGL failed state (e.g., for retry)
 */
export const resetWebGLFailed = (): void => {
  webglFailed = false;
};

/**
 * Check if WebGL has failed during runtime
 */
export const hasWebGLFailed = (): boolean => {
  return webglFailed;
};
