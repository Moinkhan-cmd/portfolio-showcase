import { Github, Linkedin, Mail, Heart, ArrowUp, Sparkles, Code2 } from "lucide-react";
import { ScrollToTop } from "@/components/ScrollToTop";
import { motion } from "framer-motion";

const socialLinks = [
  { icon: Github, url: "https://github.com/Moinkhan-cmd", label: "GitHub", color: "hover:text-[#6e5494]" },
  { icon: Linkedin, url: "https://www.linkedin.com/in/moin-bhatti-65363a255", label: "LinkedIn", color: "hover:text-[#0077b5]" },
  { icon: Mail, url: "mailto:your@email.com", label: "Email", color: "hover:text-primary" },
];

const quickLinks = [
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Experience", href: "#experience" },
  { name: "Contact", href: "#contact" },
];

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="relative mt-20 overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-primary/10" />
      
      {/* Animated particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => {
          const randomX = typeof window !== 'undefined' ? Math.random() * window.innerWidth : Math.random() * 1000;
          const randomY = typeof window !== 'undefined' ? Math.random() * window.innerHeight : Math.random() * 1000;
          return (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary/30 rounded-full"
              initial={{
                x: randomX,
                y: randomY,
                opacity: 0,
              }}
              animate={{
                y: [null, randomY + (Math.random() * 200 - 100)],
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          );
        })}
      </div>

      {/* Top decorative gradient line with animation */}
      <motion.div
        className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary via-50% to-transparent"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: "easeOut" }}
      />

      {/* Main footer content */}
      <div className="relative z-10 border-t border-primary/20 bg-background/80 backdrop-blur-2xl">
        <div className="container mx-auto container-padding py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
            
            {/* Brand Section - Left */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="md:col-span-4"
            >
              <button
                onClick={scrollToTop}
                className="group relative inline-block mb-4"
              >
                <h3 className="text-2xl md:text-3xl font-display font-bold gradient-text relative z-10 transition-all duration-300 group-hover:scale-105">
                  Moinkhan Bhatti
                </h3>
                <motion.div
                  className="absolute -inset-2 bg-primary/10 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  whileHover={{ scale: 1.1 }}
                />
              </button>
              
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                Frontend Web Developer passionate about creating beautiful, functional, and accessible web experiences.
              </p>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>© 2025 Made with</span>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                </motion.div>
                <span>by Moinkhan</span>
              </div>

              {/* Tech stack badges */}
              <div className="flex flex-wrap gap-2 mt-4">
                {["React", "TypeScript", "Tailwind"].map((tech) => (
                  <motion.span
                    key={tech}
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-md border border-primary/20 hover:bg-primary/20 hover:border-primary/40 transition-all duration-300 cursor-default"
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            {/* Quick Links - Center */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="md:col-span-4"
            >
              <h4 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
                <Code2 className="w-5 h-5 text-primary" />
                Quick Links
              </h4>
              <nav className="flex flex-col gap-2">
                {quickLinks.map((link, index) => (
                  <motion.button
                    key={link.name}
                    onClick={() => scrollToSection(link.href)}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.2 + index * 0.05 }}
                    whileHover={{ x: 5 }}
                    className="text-left text-sm text-muted-foreground hover:text-primary transition-colors duration-300 relative group py-1"
                  >
                    <span className="relative z-10">{link.name}</span>
                    <motion.span
                      className="absolute left-0 top-0 bottom-0 w-0 bg-primary/20 rounded-r-md group-hover:w-full transition-all duration-300"
                      initial={false}
                    />
                  </motion.button>
                ))}
              </nav>
            </motion.div>

            {/* Social Links & CTA - Right */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="md:col-span-4"
            >
              <h4 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Connect
              </h4>
              
              <div className="flex flex-wrap gap-3 mb-6">
                {socialLinks.map((link, index) => (
                  <motion.a
                    key={link.label}
                    href={link.url}
                    target={link.url === "#" ? undefined : "_blank"}
                    rel={link.url === "#" ? undefined : "noopener noreferrer"}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1, type: "spring" }}
                    whileHover={{ scale: 1.15, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative p-3 rounded-xl glass-card border border-primary/20 hover:border-primary/50 transition-all duration-300 overflow-hidden"
                    aria-label={link.label}
                  >
                    {/* Hover glow effect */}
                    <motion.div
                      className="absolute inset-0 bg-primary/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      whileHover={{ scale: 1.2 }}
                    />
                    <link.icon className={`w-5 h-5 text-muted-foreground ${link.color} transition-all duration-300 relative z-10 group-hover:scale-110`} />
                    
                    {/* Ripple effect on click */}
                    <motion.div
                      className="absolute inset-0 bg-primary/20 rounded-xl"
                      initial={{ scale: 0, opacity: 0.5 }}
                      whileTap={{ scale: 2, opacity: 0 }}
                      transition={{ duration: 0.4 }}
                    />
                  </motion.a>
                ))}
              </div>

              {/* Scroll to top button */}
              <div className="flex justify-start md:justify-end">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ScrollToTop />
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Bottom divider with animated gradient */}
          <motion.div
            className="mt-8 pt-8 border-t border-primary/10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
              <p className="text-center md:text-left">
                Built with modern web technologies and best practices
              </p>
              <div className="flex items-center gap-4">
                <motion.a
                  href="https://github.com/Moinkhan-cmd"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  className="hover:text-primary transition-colors duration-300"
                >
                  View Source
                </motion.a>
                <span className="hidden md:inline">•</span>
                <motion.button
                  onClick={scrollToTop}
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-1 hover:text-primary transition-colors duration-300"
                >
                  <ArrowUp className="w-4 h-4" />
                  Back to Top
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};
