import { Github, Linkedin, Mail, Heart } from "lucide-react";

const socialLinks = [
  { icon: Github, url: "#", label: "GitHub" },
  { icon: Linkedin, url: "#", label: "LinkedIn" },
  { icon: Mail, url: "mailto:your@email.com", label: "Email" },
];

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="py-8 sm:py-12 border-t border-border">
      <div className="container mx-auto container-padding">
        <div className="flex flex-col items-center gap-4 sm:gap-6 text-center md:flex-row md:justify-between md:text-left">
          {/* Logo / Name */}
          <button
            onClick={scrollToTop}
            className="font-display text-lg sm:text-xl font-bold gradient-text hover:opacity-80 transition-opacity"
          >
            Moinkhan Bhatti
          </button>

          {/* Social Links */}
          <div className="flex items-center gap-3 sm:gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.url}
                className="p-2 text-muted-foreground hover:text-primary transition-colors"
                aria-label={link.label}
              >
                <link.icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1 flex-wrap justify-center">
            © 2025 Moinkhan Bhatti. Made with
            <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-destructive inline" />
            All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
