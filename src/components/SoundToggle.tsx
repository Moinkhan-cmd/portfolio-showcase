import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { isSoundEnabled, setSoundEnabled, initSoundSystem, playSuccessSound } from "@/lib/sounds";

export const SoundToggle = () => {
  const [enabled, setEnabled] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load saved preference
    const saved = localStorage.getItem("soundEnabled");
    if (saved !== null) {
      const isEnabled = saved === "true";
      setEnabled(isEnabled);
      setSoundEnabled(isEnabled);
    }
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="relative w-9 h-9 rounded-full glass-card"
      >
        <span className="sr-only">Toggle sound</span>
      </Button>
    );
  }

  const handleToggle = () => {
    initSoundSystem();
    const newValue = !enabled;
    setEnabled(newValue);
    setSoundEnabled(newValue);
    localStorage.setItem("soundEnabled", String(newValue));
    
    // Play a confirmation sound when enabling
    if (newValue) {
      setTimeout(() => playSuccessSound(), 50);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      className="relative w-9 h-9 rounded-full glass-card hover:shadow-[0_0_20px_hsl(175_80%_50%/0.3)] transition-shadow"
      title={enabled ? "Mute sounds" : "Enable sounds"}
    >
      <AnimatePresence mode="wait" initial={false}>
        {enabled ? (
          <motion.div
            key="sound-on"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <Volume2 className="h-4 w-4 text-primary" />
          </motion.div>
        ) : (
          <motion.div
            key="sound-off"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <VolumeX className="h-4 w-4 text-muted-foreground" />
          </motion.div>
        )}
      </AnimatePresence>
      <span className="sr-only">{enabled ? "Mute sounds" : "Enable sounds"}</span>
    </Button>
  );
};
