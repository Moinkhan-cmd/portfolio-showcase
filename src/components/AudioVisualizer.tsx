import { motion } from 'framer-motion';
import { useAudioContext } from '@/hooks/useAudioFeedback';

export const AudioVisualizer = () => {
  let isEnabled = false;
  let isPlaying = false;
  
  try {
    const audio = useAudioContext();
    isEnabled = audio.isEnabled;
    isPlaying = audio.isPlaying;
  } catch {
    return null;
  }

  if (!isEnabled) return null;

  const bars = [0, 1, 2, 3];
  
  return (
    <div className="flex items-center gap-[2px] h-4 px-1">
      {bars.map((i) => (
        <motion.div
          key={i}
          className="w-[3px] rounded-full bg-primary/60"
          initial={{ height: 4 }}
          animate={isPlaying ? {
            height: [4, 12 + Math.random() * 4, 6, 14 + Math.random() * 2, 4],
            opacity: [0.6, 1, 0.8, 1, 0.6],
          } : {
            height: 4,
            opacity: 0.4,
          }}
          transition={isPlaying ? {
            duration: 0.3,
            ease: "easeInOut",
            delay: i * 0.05,
            repeat: 0,
          } : {
            duration: 0.2,
          }}
        />
      ))}
    </div>
  );
};
