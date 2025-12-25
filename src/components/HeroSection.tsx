import { ArrowDown, Github, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useEffect, useRef } from "react";
import { useMotionPreferences } from "@/hooks/use-motion-preferences";

export const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const { liteMotion } = useMotionPreferences();

  // Spring animation for smooth mouse movement
  const springConfig = { damping: 30, stiffness: 200 };
  const mouseXSpring = useSpring(mouseX, springConfig);
  const mouseYSpring = useSpring(mouseY, springConfig);

  // Transform mouse position to parallax movement
  const orb1X = useTransform(mouseXSpring, [-500, 500], [-40, 40]);
  const orb1Y = useTransform(mouseYSpring, [-500, 500], [-40, 40]);
  const orb2X = useTransform(mouseXSpring, [-500, 500], [30, -30]);
  const orb2Y = useTransform(mouseYSpring, [-500, 500], [30, -30]);
  const orb3X = useTransform(mouseXSpring, [-500, 500], [-20, 20]);
  const orb3Y = useTransform(mouseYSpring, [-500, 500], [20, -20]);

  // Gradient rotation based on mouse position
  const gradientRotate = useTransform([mouseXSpring, mouseYSpring], ([x, y]) => {
    return Math.atan2(Number(y), Number(x)) * (180 / Math.PI);
  });

  // Card tilt (desktop only)
  const tiltX = useTransform(mouseYSpring, [-500, 500], [2, -2]);
  const tiltY = useTransform(mouseXSpring, [-500, 500], [-2, 2]);

  useEffect(() => {
    if (liteMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      mouseX.set(e.clientX - centerX);
      mouseY.set(e.clientY - centerY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY, liteMotion]);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center relative overflow-hidden px-4"
    >
      {/* Enhanced Interactive Background - Simplified for mobile */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated Gradient Orbs - Smaller on mobile */}
        <motion.div
          style={liteMotion ? undefined : { x: orb1X, y: orb1Y }}
          className="absolute top-1/4 left-1/4 w-48 sm:w-64 md:w-96 h-48 sm:h-64 md:h-96 bg-primary/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          style={liteMotion ? undefined : { x: orb2X, y: orb2Y }}
          className="absolute bottom-1/4 right-1/4 w-40 sm:w-56 md:w-80 h-40 sm:h-56 md:h-80 bg-primary/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />

        <motion.div
          style={liteMotion ? undefined : { x: orb3X, y: orb3Y }}
          className="absolute top-1/2 right-1/3 w-36 sm:w-48 md:w-72 h-36 sm:h-48 md:h-72 bg-accent/8 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.25, 0.45, 0.25],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />

        {/* Interactive Radial Gradient - Hidden on mobile for performance */}
        <motion.div
          style={{ rotate: gradientRotate }}
          className="hidden sm:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] md:w-[600px] lg:w-[800px] h-[400px] md:h-[600px] lg:h-[800px] opacity-40"
        >
          <div className="w-full h-full bg-gradient-radial from-primary/15 via-primary/5 to-transparent rounded-full" />
        </motion.div>

        {/* Flowing Gradient Overlay */}
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              "radial-gradient(circle at 20% 50%, hsl(175 80% 50% / 0.08) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 50%, hsl(200 90% 60% / 0.08) 0%, transparent 50%)",
              "radial-gradient(circle at 50% 80%, hsl(175 80% 50% / 0.08) 0%, transparent 50%)",
              "radial-gradient(circle at 20% 50%, hsl(175 80% 50% / 0.08) 0%, transparent 50%)",
            ],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Enhanced Grid Pattern - Simplified on mobile */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.2)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.2)_1px,transparent_1px)] bg-[size:40px_40px] sm:bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />

      <div className="container mx-auto container-padding relative z-10 w-full">
        {/* Content Card with Tilt Effect */}
        <motion.div
          className="text-center max-w-4xl mx-auto"
          style={liteMotion ? undefined : { rotateX: tiltX, rotateY: tiltY }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full mb-8"
          >
            <motion.span
              className="w-2 h-2 bg-green-500 rounded-full"
              animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-sm text-muted-foreground">Available for opportunities</span>
          </motion.div>

          {/* Main Heading with Enhanced Animation */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-display text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-4 sm:mb-6 leading-tight"
          >
            <span className="text-foreground">Moinkhan Bhatti</span>
            <br />
            <motion.span
              className="gradient-text inline-block"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                backgroundSize: "200% 200%",
              }}
            >
              HERE
            </motion.span>
          </motion.h1>

          {/* Role */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-primary font-display font-medium mb-3 sm:mb-4"
          >
            Frontend Web Developer
          </motion.p>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-xl md:max-w-2xl mx-auto mb-6 sm:mb-8 md:mb-10 px-2"
          >
            Short one-line description about you goes here. Crafting beautiful,
            responsive, and user-friendly web experiences.
          </motion.p>

          {/* CTA Buttons with Hover Effects */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8 sm:mb-12 w-full sm:w-auto px-4 sm:px-0"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="hero"
                size="xl"
                onClick={() => scrollToSection("#projects")}
              >
                View Projects
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="hero-outline"
                size="xl"
                onClick={() => scrollToSection("#contact")}
              >
                Contact Me
              </Button>
            </motion.div>
          </motion.div>

          {/* Social Links with Magnetic Effect */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex items-center justify-center gap-4"
          >
            {[
              { icon: Github, href: "#", label: "GitHub" },
              { icon: Linkedin, href: "#", label: "LinkedIn" },
              { icon: Mail, href: "#", label: "Email" },
            ].map(({ icon: Icon, href, label }) => (
              <motion.a
                key={label}
                href={href}
                className="p-3 glass-card rounded-full group relative overflow-hidden"
                aria-label={label}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <motion.div
                  className="absolute inset-0 bg-primary/20 rounded-full"
                  initial={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <Icon className="w-5 h-5 relative z-10" />
              </motion.a>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll Indicator with Enhanced Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{
            opacity: { delay: 0.8, duration: 0.6 },
            y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.button
            onClick={() => scrollToSection("#about")}
            className="p-2 text-muted-foreground hover:text-primary transition-colors"
            aria-label="Scroll to about"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowDown className="w-6 h-6" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};
