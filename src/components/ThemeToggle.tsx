import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="relative w-8 h-8 xs:w-9 xs:h-9 rounded-full bg-white/[0.08] dark:bg-white/[0.05] backdrop-blur-2xl border border-white/20 dark:border-white/10"
      >
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  const isDark = theme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative w-8 h-8 xs:w-9 xs:h-9 rounded-full bg-white/[0.08] dark:bg-white/[0.05] backdrop-blur-2xl border border-white/20 dark:border-white/10 hover:bg-white/[0.12] dark:hover:bg-white/[0.08] hover:border-white/30 dark:hover:border-white/15 transition-all duration-300"
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.div
            key="moon"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Moon className="h-4 w-4 text-primary" />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Sun className="h-4 w-4 text-primary" />
          </motion.div>
        )}
      </AnimatePresence>
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};
