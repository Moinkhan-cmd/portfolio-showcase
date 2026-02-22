import { ArrowUp } from "lucide-react";
import { motion } from "framer-motion";
import { scrollToTop } from "@/components/SmoothScroll";

export const ScrollToTop = () => {

  return (
    <motion.button
      onClick={() => scrollToTop()}
      className="p-3 sm:p-4 rounded-full bg-white/[0.08] dark:bg-white/[0.05] backdrop-blur-2xl border border-white/20 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:bg-white/[0.12] dark:hover:bg-white/[0.08] hover:border-white/30 dark:hover:border-white/15 transition-all duration-300 relative overflow-hidden group"
      aria-label="Scroll to top"
      type="button"
      whileHover={{ scale: 1.1, rotate: 360 }}
      whileTap={{ scale: 0.9 }}
      animate={{ 
        boxShadow: [
          "0 0 0px hsl(258 90% 66% / 0)",
          "0 0 20px hsl(258 90% 66% / 0.3)",
          "0 0 0px hsl(258 90% 66% / 0)"
        ]
      }}
      transition={{ 
        boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" },
        rotate: { duration: 0.5 }
      }}
    >
      <motion.div
        className="absolute inset-0 bg-primary/20 rounded-full opacity-0 group-hover:opacity-100"
        animate={{ scale: [1, 1.5, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <ArrowUp className="w-5 h-5 sm:w-6 sm:h-6 text-primary relative z-10" />
    </motion.button>
  );
};
