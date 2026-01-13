import { useEffect, useState } from "react";
import { getDeviceFlags, type DeviceFlags } from "@/lib/device";

export const useRealMobile = (): DeviceFlags => {
  const [flags, setFlags] = useState<DeviceFlags>(() => {
    if (typeof window === "undefined") {
      return {
        isRealMobile: false,
        isTouch: false,
        prefersReducedMotion: false,
        hoverNone: false,
        reducedData: false,
      };
    }
    return getDeviceFlags();
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const update = () => setFlags(getDeviceFlags());

    const passiveOptions: AddEventListenerOptions = { passive: true };

    update();
    window.addEventListener("resize", update, passiveOptions);
    window.addEventListener("orientationchange", update, passiveOptions);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, []);

  return flags;
};
