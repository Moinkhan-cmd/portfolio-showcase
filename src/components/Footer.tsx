import { ArrowUp, ExternalLink, Github, Heart, Linkedin, Mail, MapPin, Send } from "lucide-react";
import { motion } from "framer-motion";
import { useRef, lazy, Suspense } from "react";
import { scrollToSection, scrollToTop } from "@/components/SmoothScroll";
import { cn } from "@/lib/utils";
import { useRealMobile } from "@/hooks/useRealMobile";
import { shouldEnable3D } from "@/hooks/use3DPerformance";

const FooterBackground3D = lazy(async () => {
  const mod = await import("./FooterBackground3D");
  return { default: mod.FooterBackground3D };
});

const socialLinks = [
  {
    icon: Github,
    url: "https://github.com/Moinkhan-cmd",
    label: "GitHub",
    className: "hover:bg-gray-900 hover:text-white hover:border-gray-800",
  },
  {
    icon: Linkedin,
    url: "https://www.linkedin.com/in/moinkhan-bhatti-65363a255",
    label: "LinkedIn",
    className: "hover:bg-blue-600 hover:text-white hover:border-blue-500",
  },
  {
    icon: Mail,
    url: "https://mail.google.com/mail/?view=cm&fs=1&to=moinbhatti59%40gmail.com",
    label: "Email",
    className: "hover:bg-red-500 hover:text-white hover:border-red-400",
  },
] as const;

const quickLinks = [
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Certifications", href: "#certifications" },
  { name: "Experience", href: "#experience" },
  { name: "Contact", href: "#contact" },
] as const;

const techStack = ["React", "TypeScript", "Tailwind", "Three.js", "Framer Motion"] as const;

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const footerRef = useRef<HTMLElement>(null);
  const { isRealMobile, prefersReducedMotion } = useRealMobile();

  return (
    <footer
      ref={footerRef}
      className="relative mt-20 border-t border-primary/10 bg-background overflow-hidden"
    >
      {shouldEnable3D() && (
        <Suspense fallback={null}>
          <FooterBackground3D />
        </Suspense>
      )}

      {/* Readability overlay on top of 3D background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/55 via-background/70 to-background/90 pointer-events-none z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_0%,hsl(var(--background)/0.55)_55%,hsl(var(--background)/0.95)_100%)] pointer-events-none z-10" />

      {!isRealMobile && !prefersReducedMotion && (
        <>
          {/* Subtle animated top border */}
          <motion.div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 max-w-3xl h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent z-20"
            animate={{ opacity: [0.25, 0.9, 0.25] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Ambient orbs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
            <motion.div
              className="absolute -top-20 left-1/3 w-72 sm:w-96 h-72 sm:h-96 bg-primary/10 rounded-full blur-[90px]"
              animate={{ x: [0, 40, 0], y: [0, 20, 0], scale: [1, 1.15, 1] }}
              transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute -bottom-24 right-1/3 w-64 sm:w-80 h-64 sm:h-80 bg-purple-500/10 rounded-full blur-[80px]"
              animate={{ x: [0, -30, 0], y: [0, -15, 0], scale: [1, 1.12, 1] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </>
      )}

      {/* Light grid texture */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none z-10"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16 relative z-20">
        {/* Full-width footer panel (not centered card) */}
        <motion.div
          className="relative w-full rounded-3xl border border-primary/15 bg-card/40 backdrop-blur-xl overflow-hidden"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          whileHover={{ y: -2 }}
        >
          {/* Gradient border glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -inset-px rounded-3xl bg-gradient-to-r from-primary/25 via-purple-500/20 to-pink-500/25 opacity-60" />
            <div className="absolute inset-px rounded-3xl bg-card/60" />
          </div>

          {/* Shimmer sweep */}
          <motion.div
            className="absolute inset-0 pointer-events-none opacity-30"
            animate={{ x: ["-120%", "120%"] }}
            transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 1.2, ease: "easeInOut" }}
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)",
              transform: "skewX(-12deg)",
            }}
          />

          <div className="relative p-7 sm:p-9">
            <div className="grid gap-10 lg:gap-12 lg:grid-cols-12 items-start">
              {/* Left: identity */}
              <div className="lg:col-span-5 space-y-4">
                <div className="space-y-3">
                  <motion.button
                    onClick={() => scrollToTop()}
                    className="text-left group"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <h2 className="text-3xl sm:text-4xl font-signature font-bold leading-none">
                      <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                        Moinkhan Bhatti
                      </span>
                    </h2>
                    <div className="mt-3 h-px w-28 bg-gradient-to-r from-primary/70 to-transparent opacity-70 group-hover:opacity-100 transition-opacity" />
                  </motion.button>

                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl">
                    Frontend Web Developer passionate about building clean UI, smooth motion, and accessible experiences.
                  </p>

                  <div className="flex flex-wrap items-center gap-2.5 pt-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/40 border border-primary/15">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      <span className="text-sm text-foreground/80">India</span>
                    </div>

                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-70" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                      </span>
                      <span className="text-sm text-emerald-400">Available</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Middle: quick links */}
              <div className="lg:col-span-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-foreground/70 mb-3">
                  Quick Links
                </p>
                <div className="flex flex-col items-start gap-2">
                  {quickLinks.map((link, index) => (
                    <motion.button
                      key={link.name}
                      onClick={() => scrollToSection(link.href)}
                      className={cn(
                        "inline-flex w-fit items-center justify-start",
                        "px-3 py-1.5 rounded-full text-sm",
                        "bg-background/35 border border-primary/15 text-foreground/75",
                        "hover:text-primary hover:border-primary/30 transition-colors"
                      )}
                      initial={{ opacity: 0, y: 6 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.08 + index * 0.03 }}
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {link.name}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Right: social + CTA + tech */}
              <div className="lg:col-span-4 space-y-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-foreground/70 mb-3">
                    Connect
                  </p>
                  <div className="flex items-center gap-3">
                    {socialLinks.map((link, index) => (
                      <motion.a
                        key={link.label}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={link.label}
                        className={cn(
                          "inline-flex items-center justify-center w-11 h-11 rounded-xl border border-primary/20",
                          "bg-background/40 text-foreground/80 transition-colors backdrop-blur-sm",
                          link.className
                        )}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.12 + index * 0.06 }}
                        whileHover={{ y: -2, scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <link.icon className="w-5 h-5" />
                      </motion.a>
                    ))}
                  </div>
                </div>

                <motion.button
                  onClick={() => scrollToSection("#contact")}
                  className={cn(
                    "group relative inline-flex w-full items-center justify-center gap-2",
                    "px-5 py-3 rounded-xl font-semibold text-white",
                    "bg-gradient-to-r from-primary via-purple-500 to-pink-500",
                    "shadow-lg shadow-primary/15"
                  )}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100"
                    animate={{ opacity: [0, 0.45, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity }}
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)",
                    }}
                  />
                  <span className="relative z-10 inline-flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    Let’s work together
                  </span>
                </motion.button>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-foreground/70 mb-3">
                    Built With
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {techStack.map((tech, index) => (
                      <motion.span
                        key={tech}
                        className="px-3 py-1.5 rounded-full text-xs bg-primary/5 border border-primary/10 text-muted-foreground"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 + index * 0.04 }}
                        whileHover={{ scale: 1.03 }}
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom row */}
            <div className="mt-10 pt-6 border-t border-primary/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-muted-foreground">
              <div className="flex flex-wrap items-center gap-2">
                <span>© {currentYear} Moinkhan Bhatti</span>
                <span className="text-primary/30">•</span>
                <span className="inline-flex items-center gap-1.5">
                  Made with
                  <motion.span
                    animate={{ scale: [1, 1.25, 1] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                  </motion.span>
                </span>
              </div>

              <div className="flex items-center gap-3">
                <motion.a
                  href="https://github.com/Moinkhan-cmd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-primary transition-colors"
                  whileHover={{ x: -2 }}
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Source</span>
                </motion.a>

                <motion.button
                  onClick={() => scrollToTop()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 hover:bg-primary/15 text-foreground/90 hover:text-primary transition-colors"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowUp className="w-4 h-4" />
                  <span>Top</span>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};
