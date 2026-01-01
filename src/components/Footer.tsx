import { Github, Linkedin, Mail, Heart, Code2, Sparkles, ArrowUp } from "lucide-react";
import { motion } from "framer-motion";
import { FooterBackground3D } from "./FooterBackground3D";

const socialLinks = [
  { icon: Github, url: "https://github.com/Moinkhan-cmd", label: "GitHub" },
  { icon: Linkedin, url: "https://www.linkedin.com/in/moin-bhatti-65363a255", label: "LinkedIn" },
  { icon: Mail, url: "https://mail.google.com/mail/?view=cm&fs=1&to=moinbhatti59%40gmail.com", label: "Email" },
];

const quickLinks = [
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Experience", href: "#experience" },
  { name: "Contact", href: "#contact" },
];

const techStack = ["React", "TypeScript", "Tailwind"];

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
    <footer className="relative mt-20 border-t border-primary/20 bg-background overflow-hidden">
      <FooterBackground3D />
      
      {/* Overlay for text contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/65 to-background/50 pointer-events-none z-10" />
      <div className="absolute inset-0 pointer-events-none z-10" 
           style={{
             background: 'radial-gradient(ellipse at center, transparent 0%, hsl(222 47% 6% / 0.2) 50%, hsl(222 47% 6% / 0.5) 100%)'
           }} 
      />
      
      <div className="container mx-auto container-padding py-12 sm:py-16 relative z-20">
        {/* Main Footer Content - Three Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-8">
          
          {/* Left Column - Personal Info & Bio */}
          <div className="flex flex-col gap-4">
            <motion.button
              onClick={scrollToTop}
              className="text-2xl sm:text-3xl font-display font-bold text-primary text-left hover:opacity-80 transition-opacity"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Moinkhan Bhatti
            </motion.button>
            
            <p className="text-sm sm:text-base text-foreground leading-relaxed">
              Frontend Web Developer passionate about creating beautiful, functional, and accessible web experiences.
            </p>
            
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <span>© 2025 Made with</span>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              </motion.div>
              <span>by Moinkhan</span>
            </div>

            {/* Tech Stack Badges */}
            <div className="flex flex-wrap gap-2 mt-2">
              {techStack.map((tech) => (
                <motion.span
                  key={tech}
                  className="px-3 py-1.5 text-xs sm:text-sm font-medium border border-primary/40 rounded-full text-foreground bg-transparent"
                  whileHover={{ scale: 1.1, borderColor: "hsl(var(--primary))" }}
                  transition={{ duration: 0.2 }}
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Middle Column - Quick Links */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-2">
              <Code2 className="w-5 h-5 text-primary" />
              <h4 className="font-display text-lg font-semibold text-foreground">Quick Links</h4>
            </div>
            
            <nav className="flex flex-col gap-2">
              {quickLinks.map((link, index) => (
                <motion.button
                  key={link.name}
                  onClick={() => scrollToSection(link.href)}
                  className="text-left text-sm sm:text-base text-foreground hover:text-primary transition-colors duration-300 py-1"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ x: 5 }}
                >
                  {link.name}
                </motion.button>
              ))}
            </nav>
          </div>

          {/* Right Column - Connect */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <h4 className="font-display text-lg font-semibold text-foreground">Connect</h4>
            </div>
            
            <div className="flex gap-3">
              {socialLinks.map((link, index) => (
                <motion.a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-lg border border-primary/40 bg-transparent hover:border-primary hover:bg-primary/10 transition-all duration-300"
                  aria-label={link.label}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, type: "spring" }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <link.icon className="w-5 h-5 text-foreground" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary/20 pt-6 mt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p className="text-center sm:text-left">
              Built with modern web technologies and best practices
            </p>
            <div className="flex items-center gap-4">
              <motion.a
                href="https://github.com/Moinkhan-cmd"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Source
              </motion.a>
              <span className="hidden sm:inline text-primary/40">•</span>
              <motion.button
                onClick={scrollToTop}
                className="flex items-center gap-1 hover:text-primary transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowUp className="w-4 h-4" />
                Back to Top
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
