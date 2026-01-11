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
        "relative p-2 rounded-full transition-all duration-300",
        "hover:bg-secondary/80",
        isEnabled ? "text-primary" : "text-muted-foreground"
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={isEnabled ? "Mute sounds" : "Enable sounds"}
      title={`Sound ${isEnabled ? "on" : "off"} (M)`}
    >
      {/* Animated ring when playing */}
      {isEnabled && isPlaying && (
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-primary"
          initial={{ opacity: 0.8, scale: 1 }}
          animate={{ opacity: 0, scale: 1.5 }}
          transition={{ duration: 0.4 }}
        />
      )}

      {/* Audio visualizer bars */}
      {isEnabled && (
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 flex gap-0.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-0.5 bg-primary rounded-full"
              animate={{
                height: isPlaying ? [2, 6, 2] : 2,
              }}
              transition={{
                duration: 0.3,
                delay: i * 0.1,
                repeat: isPlaying ? Infinity : 0,
              }}
            />
          ))}
        </div>
      )}

      {isEnabled ? (
        <Volume2 className="w-4 h-4" />
      ) : (
        <VolumeX className="w-4 h-4" />
      )}
    </motion.button>
  );
};
