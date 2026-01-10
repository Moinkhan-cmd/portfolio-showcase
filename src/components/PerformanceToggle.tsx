import { useEffect } from "react";
import { Gauge, Zap, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { usePerformanceMode } from "@/hooks/usePerformanceMode";
import { toast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const modeConfig = {
  full: {
    icon: Sparkles,
    label: "Full Effects",
    description: "All animations & 3D enabled",
    color: "text-primary",
  },
  reduced: {
    icon: Gauge,
    label: "Balanced",
    description: "3D enabled, reduced effects",
    color: "text-yellow-500",
  },
  minimal: {
    icon: Zap,
    label: "Performance",
    description: "No 3D, minimal animations",
    color: "text-green-500",
  },
} as const;

export const PerformanceToggle = () => {
  const { level, toggle } = usePerformanceMode();
  const config = modeConfig[level];
  const Icon = config.icon;

  // Show toast when level changes (including from keyboard)
  useEffect(() => {
    const handleKeyboardToggle = () => {
      // Small delay to get the new level after toggle
      setTimeout(() => {
        const currentConfig = modeConfig[level];
        const levels = ["full", "reduced", "minimal"] as const;
        const currentIndex = levels.indexOf(level);
        const nextLevel = levels[(currentIndex + 1) % levels.length];
        const nextConfig = modeConfig[nextLevel];
        toast({
          title: `⚡ ${nextConfig.label}`,
          description: nextConfig.description,
          duration: 2000,
        });
      }, 50);
    };
    window.addEventListener("togglePerformanceMode", handleKeyboardToggle);
    return () => window.removeEventListener("togglePerformanceMode", handleKeyboardToggle);
  }, [level]);

  const handleToggle = () => {
    const levels = ["full", "reduced", "minimal"] as const;
    const currentIndex = levels.indexOf(level);
    const nextLevel = levels[(currentIndex + 1) % levels.length];
    const nextConfig = modeConfig[nextLevel];
    toggle();
    toast({
      title: `⚡ ${nextConfig.label}`,
      description: nextConfig.description,
      duration: 2000,
    });
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggle}
            className="relative w-9 h-9 rounded-full glass-card hover:shadow-[0_0_20px_hsl(175_80%_50%/0.3)] transition-shadow"
            aria-label={`Performance mode: ${config.label}`}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={level}
                initial={{ opacity: 0, scale: 0.8, rotate: -90 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.8, rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                <Icon className={`h-4 w-4 ${config.color}`} />
              </motion.div>
            </AnimatePresence>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs">
          <p className="font-medium">{config.label}</p>
          <p className="text-muted-foreground">{config.description}</p>
          <p className="text-muted-foreground mt-1">Press P to cycle</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
