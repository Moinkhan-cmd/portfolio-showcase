import { motion } from "framer-motion";

export const SectionDivider = () => {
  return (
    <motion.div 
      className="relative py-16 sm:py-20 overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
    >
      <motion.div 
        className="mx-auto h-px w-2/3 bg-gradient-to-r from-transparent via-primary/60 to-transparent"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 h-10 w-2/3 bg-primary/10 blur-2xl"
        style={{ marginLeft: "-33.333%", marginTop: "-20px" }}
        aria-hidden="true"
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  );
};
