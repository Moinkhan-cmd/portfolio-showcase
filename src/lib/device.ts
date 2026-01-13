import { whenDomReady } from "./domReady";

export interface DeviceFlags {
  isRealMobile: boolean;
  isTouch: boolean;
  prefersReducedMotion: boolean;
  hoverNone: boolean;
  reducedData: boolean;
}

type NavigatorWithUAData = Navigator & {
  userAgentData?: {
    platform?: string;
    mobile?: boolean;
  };
};

const getPlatform = (): string => {
  try {
    const nav: NavigatorWithUAData = navigator;
    return String(nav.userAgentData?.platform ?? nav.platform ?? "");
  } catch {
    return "";
  }
};

const getUserAgent = (): string => {
  try {
    return String(navigator.userAgent ?? "");
  } catch {
    return "";
  }
};

const getUaMobile = (): boolean => {
  try {
    const nav: NavigatorWithUAData = navigator;
    if (typeof nav.userAgentData?.mobile === "boolean") return nav.userAgentData.mobile;
  } catch {
    // ignore
  }
  const ua = getUserAgent();
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
};

const getIsTouch = (): boolean => {
  try {
    return (
      (typeof window !== "undefined" && "ontouchstart" in window) ||
      (typeof navigator !== "undefined" && (navigator.maxTouchPoints ?? 0) > 0)
    );
  } catch {
    return false;
  }
};

const isLikelyDesktopPlatform = (platform: string): boolean => {
  // Note: iPadOS can report 'MacIntel'. We handle that separately.
  return /Win|Mac|Linux/i.test(platform) && !/Android|iPhone|iPad|iPod/i.test(platform);
};

const isIPadOS = (): boolean => {
  try {
    const platform = getPlatform();
    const touchPoints = navigator.maxTouchPoints ?? 0;
    return platform === "MacIntel" && touchPoints > 1;
  } catch {
    return false;
  }
};

export const getDeviceFlags = (): DeviceFlags => {
  const isTouch = getIsTouch();
  const uaMobile = getUaMobile();
  const platform = getPlatform();
  const desktopPlatform = isLikelyDesktopPlatform(platform);

  const prefersReducedMotion =
    (typeof window !== "undefined" &&
      (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false)) ||
    false;

  const hoverNone =
    (typeof window !== "undefined" && (window.matchMedia?.("(hover: none)")?.matches ?? false)) ||
    false;

  const reducedData =
    (typeof window !== "undefined" &&
      (window.matchMedia?.("(prefers-reduced-data: reduce)")?.matches ?? false)) ||
    false;

  // "Real mobile" heuristic: mobile UA + touch + NOT a desktop platform.
  // Exception: iPadOS often reports platform MacIntel.
  const isRealMobile = (uaMobile && isTouch && !desktopPlatform) || isIPadOS();

  return { isRealMobile, isTouch, prefersReducedMotion, hoverNone, reducedData };
};

export const isRealMobileDevice = (): boolean => getDeviceFlags().isRealMobile;

export const applyDeviceClasses = async (): Promise<DeviceFlags> => {
  if (typeof document === "undefined") return getDeviceFlags();

  await whenDomReady("interactive");

  const flags = getDeviceFlags();
  const el = document.documentElement;

  el.classList.toggle("real-mobile", flags.isRealMobile);
  el.classList.toggle("touch", flags.isTouch);
  el.classList.toggle("reduced-motion", flags.prefersReducedMotion);
  el.classList.toggle("hover-none", flags.hoverNone);
  el.classList.toggle("reduced-data", flags.reducedData);

  return flags;
};
