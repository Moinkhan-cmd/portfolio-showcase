import { Github, Linkedin, Mail, Heart } from "lucide-react";
import { ScrollToTop } from "@/components/ScrollToTop";

const socialLinks = [
  { icon: Github, url: "https://github.com/Moinkhan-cmd", label: "GitHub" },
  { icon: Linkedin, url: "https://www.linkedin.com/in/moin-bhatti-65363a255", label: "LinkedIn" },
  { icon: Mail, url: "mailto:your@email.com", label: "Email" },
];

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative mt-20 border-t border-white/10 bg-background/50 backdrop-blur-xl">
      {/* Decorative gradient line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="container mx-auto container-padding py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">

          {/* Brand & Copyright - Left */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <button
              onClick={scrollToTop}
              className="text-2xl font-display font-bold gradient-text hover:opacity-80 transition-opacity"
            >
              Moinkhan Bhatti
            </button>
            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
              © 2025 Made with
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" />
            </p>
          </div>

          {/* Social Links - Center */}
          <div className="flex justify-center gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target={link.url === "#" ? undefined : "_blank"}
                rel={link.url === "#" ? undefined : "noopener noreferrer"}
                className="p-3 rounded-full hover:bg-white/5 border border-transparent hover:border-white/10 transition-all duration-300 group"
                aria-label={link.label}
              >
                <link.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
            ))}
          </div>

          {/* Scroll To Top - Right */}
          <div className="flex justify-center md:justify-end">
            <ScrollToTop />
          </div>
        </div>
      </div>
    </footer>
  );
};
