import { useEffect, useRef, useState } from "react";
import { Mail, Github, Linkedin, Send, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";

const socialLinks = [
  { name: "GitHub", icon: Github, url: "https://github.com/Moinkhan-cmd", label: "github.com/Moinkhan-cmd" },
  { name: "LinkedIn", icon: Linkedin, url: "https://www.linkedin.com/in/moin-bhatti-65363a255", label: "linkedin.com/in/moin-bhatti-65363a255" },
  { name: "Email", icon: Mail, url: "mailto:moinbhatti59@gmail.com", label: "moinbhatti59@gmail.com" },
];

export const ContactSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;

    // EmailJS configuration
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    // Check if EmailJS is configured
    if (!serviceId || !templateId || !publicKey) {
      toast({
        title: "Email service not configured",
        description: "Please configure EmailJS environment variables. Check the README for setup instructions.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // Send email using EmailJS
      await emailjs.send(serviceId, templateId, {
        from_name: name,
        from_email: email,
        message: message,
        to_email: "moinbhatti59@gmail.com",
        reply_to: email,
        to_name: "Moinkhan Bhatti",
      }, publicKey);

      toast({
        title: "Message sent successfully!",
        description: "Thank you for reaching out. I'll get back to you soon!",
      });
      
      form.reset();
    } catch (error) {
      console.error("EmailJS Error:", error);
      toast({
        title: "Failed to send message",
        description: "Please try again later or contact me directly via email.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="section-padding relative"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto container-padding relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-10 sm:mb-16 ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}>
          <span className="text-primary text-sm font-medium uppercase tracking-wider">Contact</span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mt-3 sm:mt-4">
            Let's <span className="gradient-text">Connect</span>
          </h2>
          <p className="text-muted-foreground mt-3 sm:mt-4 max-w-2xl mx-auto text-sm sm:text-base px-4">
            Have a project in mind or want to discuss opportunities? I'd love to hear from you!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 max-w-5xl mx-auto">
          {/* Contact Info */}
          <div 
            className={`${isVisible ? 'animate-slide-up' : 'opacity-0'}`}
            style={{ animationDelay: '0.1s' }}
          >
            <h3 className="font-display text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Get in Touch</h3>
            <p className="text-muted-foreground mb-6 sm:mb-8 text-sm sm:text-base">
              Feel free to reach out through any of these platforms. I'm always open to 
              discussing new projects, creative ideas, or opportunities to be part of your vision.
            </p>

            {/* Location */}
            <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div className="p-2.5 sm:p-3 glass-card rounded-lg sm:rounded-xl">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm sm:text-base">Location</p>
                <p className="text-muted-foreground text-xs sm:text-sm">Your City, Country</p>
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-3 sm:space-y-4">
              {socialLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.url}
                  target={link.url === "#" ? undefined : "_blank"}
                  rel={link.url === "#" ? undefined : "noopener noreferrer"}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isVisible ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                  whileHover={{ x: 10, scale: 1.02 }}
                  className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 glass-enhanced rounded-lg sm:rounded-xl hover:bg-primary/10 transition-all duration-300 group card-hover"
                >
                  <motion.div 
                    className="p-1.5 sm:p-2 rounded-md sm:rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <link.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </motion.div>
                  <div>
                    <p className="font-medium text-sm sm:text-base group-hover:text-primary transition-colors">{link.name}</p>
                    <p className="text-muted-foreground text-xs sm:text-sm">{link.label}</p>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div 
            className={`${isVisible ? 'animate-slide-up' : 'opacity-0'}`}
            style={{ animationDelay: '0.2s' }}
          >
            <form onSubmit={handleSubmit} className="glass-card rounded-xl sm:rounded-2xl p-5 sm:p-8">
              <h3 className="font-display text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Send a Message</h3>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Your name"
                    required
                    className="bg-secondary/50 border-border focus:border-primary"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    required
                    className="bg-secondary/50 border-border focus:border-primary"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Tell me about your project or opportunity..."
                    rows={5}
                    required
                    className="bg-secondary/50 border-border focus:border-primary resize-none"
                  />
                </div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="submit"
                    variant="hero"
                    size="lg"
                    className="w-full glow-on-hover btn-lift"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        Sending...
                      </span>
                    ) : (
                      <motion.span 
                        className="flex items-center gap-2"
                        whileHover={{ x: 2 }}
                      >
                        <Send className="w-4 h-4" />
                        Send Message
                      </motion.span>
                    )}
                  </Button>
                </motion.div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
