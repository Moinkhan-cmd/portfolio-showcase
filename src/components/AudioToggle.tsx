import { Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";
import { useAudioContext } from "@/hooks/useAudioFeedback";
import { cn } from "@/lib/utils";

export const AudioToggle = () => {
  const { isEnabled, isPlaying, toggle } = useAudioContext();

  return (
    <motion.button
      onClick={toggle}
      className={cn(
        "relative p-2 w-9 h-9 flex items-center justify-center rounded-full transition-colors",
        "bg-secondary/50 hover:bg-secondary/80 border border-border/30",
        isEnabled ? "text-primary" : "text-muted-foreground"
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={isEnabled ? "Mute sounds" : "Enable sounds"}
      title={`Sound ${isEnabled ? "on" : "off"} (M)`}
    >
      {/* Animated glow ring when playing */}
      {isEnabled && isPlaying && (
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-primary/60"
          initial={{ opacity: 0.8, scale: 1 }}
          animate={{ opacity: 0, scale: 1.4 }}
          transition={{ duration: 0.5, repeat: Infinity }}
        />
      )}

      {/* Icon with subtle pulse when enabled and playing */}
      <motion.div
        animate={isEnabled && isPlaying ? { scale: [1, 1.1, 1] } : { scale: 1 }}
        transition={{ duration: 0.5, repeat: isPlaying ? Infinity : 0 }}
      >
        {isEnabled ? (
          <Volume2 className="w-4 h-4" />
        ) : (
          <VolumeX className="w-4 h-4" />
        )}
      </motion.div>
    </motion.button>
  );
};
