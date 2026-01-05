import { ArrowUp } from "lucide-react";
import { motion } from "framer-motion";

export const ScrollToTop = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.button
      onClick={scrollToTop}
      className="p-3 sm:p-4 glass-card rounded-full hover:bg-primary/10 transition-all duration-300 glow-on-hover relative overflow-hidden group"
      aria-label="Scroll to top"
      type="button"
      whileHover={{ scale: 1.1, rotate: 360 }}
      whileTap={{ scale: 0.9 }}
      animate={{ 
        boxShadow: [
          "0 0 0px hsl(175 80% 50% / 0)",
          "0 0 20px hsl(175 80% 50% / 0.3)",
          "0 0 0px hsl(175 80% 50% / 0)"
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
