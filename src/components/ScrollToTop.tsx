import { ArrowUp } from "lucide-react";

export const ScrollToTop = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      className="p-3 sm:p-4 glass-card rounded-full hover:bg-primary/10 transition-colors"
      aria-label="Scroll to top"
      type="button"
    >
      <ArrowUp className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
    </button>
  );
};
