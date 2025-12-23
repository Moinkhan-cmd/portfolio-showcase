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
    <footer className="py-12 border-t border-border">
      <div className="container mx-auto container-padding">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo / Name */}
          <button
            onClick={scrollToTop}
            className="font-display text-xl font-bold gradient-text hover:opacity-80 transition-opacity"
          >
            Your Name
          </button>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.url}
                className="p-2 text-muted-foreground hover:text-primary transition-colors"
                aria-label={link.label}
              >
                <link.icon className="w-5 h-5" />
              </a>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            © 2025 Your Name. Made with
            <Heart className="w-4 h-4 text-destructive inline" />
            All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
