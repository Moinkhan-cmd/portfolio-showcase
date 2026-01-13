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

  const bars = [0, 1, 2, 3, 4];
  
  return (
    <motion.div 
      className="flex items-center gap-[3px] h-6 px-2 rounded-lg"
      animate={isPlaying ? {
        boxShadow: [
          '0 0 8px hsl(var(--primary) / 0.3)',
          '0 0 16px hsl(var(--primary) / 0.5)',
          '0 0 8px hsl(var(--primary) / 0.3)',
        ],
      } : {
        boxShadow: '0 0 0px transparent',
      }}
      transition={{
        duration: 0.4,
        repeat: isPlaying ? Infinity : 0,
        ease: "easeInOut",
      }}
    >
      {bars.map((i) => (
        <motion.div
          key={i}
          className="w-[4px] rounded-full bg-primary"
          style={{
            filter: isPlaying ? 'drop-shadow(0 0 4px hsl(var(--primary)))' : 'none',
          }}
          initial={{ height: 6 }}
          animate={isPlaying ? {
            height: [6, 18 + Math.random() * 6, 10, 22 + Math.random() * 4, 6],
            opacity: [0.7, 1, 0.85, 1, 0.7],
          } : {
            height: 6,
            opacity: 0.5,
          }}
          transition={isPlaying ? {
            duration: 0.35,
            ease: "easeInOut",
            delay: i * 0.06,
            repeat: Infinity,
            repeatType: "reverse",
          } : {
            duration: 0.2,
          }}
        />
      ))}
    </motion.div>
  );
};
