import { motion, AnimatePresence } from "framer-motion";
import { Keyboard, X } from "lucide-react";

interface KeyboardHintProps {
  isVisible: boolean;
  onClose: () => void;
}

const shortcuts = [
  { keys: ["↑", "K"], description: "Previous section" },
  { keys: ["↓", "J"], description: "Next section" },
  { keys: ["0-6"], description: "Jump to section" },
  { keys: ["Home"], description: "Go to top" },
  { keys: ["End"], description: "Go to bottom" },
  { keys: ["?"], description: "Toggle this help" },
];

export const KeyboardHint = ({ isVisible, onClose }: KeyboardHintProps) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 p-4 rounded-2xl bg-background/95 backdrop-blur-xl border border-border/50 shadow-2xl"
        >
          <div className="flex items-center justify-between gap-6 mb-3">
            <div className="flex items-center gap-2">
              <Keyboard className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">Keyboard Shortcuts</span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-secondary/50 transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-x-8 gap-y-2">
            {shortcuts.map(({ keys, description }) => (
              <div key={description} className="flex items-center gap-3">
                <div className="flex gap-1">
                  {keys.map((key, i) => (
                    <span key={i}>
                      <kbd className="px-2 py-1 text-xs font-mono bg-secondary/80 border border-border/50 rounded-md text-foreground">
                        {key}
                      </kbd>
                      {i < keys.length - 1 && (
                        <span className="text-muted-foreground text-xs mx-0.5">/</span>
                      )}
                    </span>
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">{description}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const KeyboardHintTrigger = ({ onClick }: { onClick: () => void }) => {
  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2 }}
      onClick={onClick}
      className="fixed bottom-6 right-4 z-40 hidden lg:flex items-center gap-2 px-3 py-2 rounded-full bg-background/80 backdrop-blur-sm border border-border/30 shadow-lg hover:bg-secondary/50 transition-colors"
      aria-label="Show keyboard shortcuts"
    >
      <Keyboard className="w-4 h-4 text-muted-foreground" />
      <kbd className="text-xs font-mono text-muted-foreground">?</kbd>
    </motion.button>
  );
};
