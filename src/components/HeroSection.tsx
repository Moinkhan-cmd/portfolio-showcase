import { ArrowDown, Download, Github, Linkedin, Mail } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";

import myPhoto from "@/images/my photo.jpg";

const socialLinks = [
  { icon: Github, href: "https://github.com/Moinkhan-cmd", label: "GitHub" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/moin-bhatti-65363a255", label: "LinkedIn" },
  { icon: Mail, href: "#", label: "Email" },
] as const;

export const HeroSection = () => {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden px-4">
      {/* Background (static, theme-token based) */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-28 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-1/4 -left-24 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-20 -right-28 h-80 w-80 rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,hsl(var(--primary)/0.10)_0%,transparent_45%),radial-gradient(circle_at_80%_60%,hsl(var(--accent)/0.08)_0%,transparent_50%)]" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.22)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.22)_1px,transparent_1px)] bg-[size:44px_44px] sm:bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_18%,transparent_72%)]" />

      <div className="container mx-auto container-padding relative z-10 flex min-h-screen flex-col justify-center pt-28 pb-20 sm:pt-32 sm:pb-28">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left: Copy */}
          <div className="lg:col-span-7 text-left">
            <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full shine-sweep">
              <span className="h-2 w-2 rounded-full bg-primary" />
              <span className="text-sm text-muted-foreground">Available for opportunities</span>
            </div>

            <h1 className="mt-6 font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.05] text-balance">
              Hi, I’m <span className="gradient-text">Moinkhan Bhatti</span>
            </h1>

            <p className="mt-4 text-lg sm:text-xl lg:text-2xl text-primary font-display font-semibold">
              Frontend Web Developer
            </p>

            <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl text-pretty">
              I build modern, responsive, and accessible interfaces with React and TypeScript — focused on clean UI, strong UX, and fast performance.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <span className="glass-card rounded-full px-3 py-1 text-xs font-medium text-foreground/90">React</span>
              <span className="glass-card rounded-full px-3 py-1 text-xs font-medium text-foreground/90">TypeScript</span>
              <span className="glass-card rounded-full px-3 py-1 text-xs font-medium text-foreground/90">Tailwind</span>
              <span className="glass-card rounded-full px-3 py-1 text-xs font-medium text-foreground/90">UI Systems</span>
            </div>

            <motion.div 
              className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="hero" 
                  size="xl" 
                  onClick={() => scrollToSection("#projects")}
                  className="glow-on-hover btn-lift shine-sweep w-full sm:w-auto"
                >
                  View Projects
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="hero-outline" 
                  size="xl" 
                  onClick={() => scrollToSection("#contact")}
                  className="btn-lift border-glow shine-sweep w-full sm:w-auto"
                >
                  Contact Me
                </Button>
              </motion.div>
            </motion.div>

            <motion.div 
              className="mt-8 flex items-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              {socialLinks.map(({ icon: Icon, href, label }, index) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.6 + index * 0.1, type: "spring" }}
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button 
                    variant="glass" 
                    size="icon" 
                    asChild 
                    className="rounded-full glow-on-hover magnetic-hover shine-sweep"
                  >
                    <a 
                      href={href} 
                      aria-label={label} 
                      target={href === "#" ? undefined : "_blank"} 
                      rel={href === "#" ? undefined : "noopener noreferrer"}
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  </Button>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right: Profile Card */}
          <motion.div 
            className="lg:col-span-5"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <motion.div 
              className="gradient-border"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="glass-card border-0 holo-hover">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 sm:h-20 sm:w-20 border border-border">
                      <AvatarImage src={myPhoto} alt="Moinkhan Bhatti" className="object-cover" />
                      <AvatarFallback className="font-display text-base font-semibold">MB</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <div className="font-display text-lg font-semibold leading-tight truncate">
                        Moinkhan Bhatti
                      </div>
                      <div className="text-sm text-muted-foreground truncate">Frontend Web Developer</div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="rounded-lg border bg-secondary/20 p-4">
                    <p className="text-sm text-muted-foreground">
                      Clean components, consistent spacing, and polished interactions — built with maintainable code.
                    </p>
                  </div>

                  <Separator className="opacity-60" />

                  <div className="space-y-2">
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">What you’ll get</div>
                    <div className="grid gap-2">
                      <div className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                        <p className="text-sm text-foreground/90">Responsive, pixel-tight layouts</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                        <p className="text-sm text-foreground/90">Accessible UI and scalable components</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                        <p className="text-sm text-foreground/90">Fast-loading pages and clean UX</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
                      <Button 
                        variant="glass" 
                        className="w-full btn-lift" 
                        onClick={() => scrollToSection("#contact")}
                      >
                        Let's Talk
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
                      <Button
                        variant="outline"
                        className="w-full border-primary/30 hover:border-primary hover:bg-primary/10 btn-lift border-glow"
                        asChild
                      >
                        <a href="https://drive.google.com/uc?export=download&id=1p42p9NpczSWy_-iLeVaO38ciHAMHXp9r" download="Moin_Bhatti_Resume.pdf">
                          <Download className="w-4 h-4" />
                          CV
                        </a>
                      </Button>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <motion.button
            onClick={() => scrollToSection("#about")}
            className="p-2 text-muted-foreground hover:text-primary transition-colors rounded-full hover:bg-primary/10"
            aria-label="Scroll to about"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
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
