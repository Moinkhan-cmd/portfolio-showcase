import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Award, ExternalLink, Calendar, Sparkles } from "lucide-react";
import { CertificationsBackground3D } from "./CertificationsBackground3D";

const certifications = [
  {
    title: "Your Certification Title",
    issuer: "Issuing Organization",
    date: "Month Year",
    credentialUrl: "#",
    description: "Brief description of what this certification covers.",
  },
  {
    title: "Another Certification",
    issuer: "Another Organization",
    date: "Month Year",
    credentialUrl: "#",
    description: "Brief description of the skills validated by this certification.",
  },
  {
    title: "Third Certification",
    issuer: "Certification Provider",
    date: "Month Year",
    credentialUrl: "#",
    description: "Description of the knowledge and skills this certification represents.",
  },
];

export const CertificationsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

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

  return (
    <section
      id="certifications"
      ref={sectionRef}
      className="section-padding relative bg-secondary/30 overflow-hidden"
    >
      <CertificationsBackground3D />
      
      {/* Overlay for text contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/65 to-background/50 pointer-events-none z-10" />
      <div className="absolute inset-0 pointer-events-none z-10" 
           style={{
             background: 'radial-gradient(ellipse at center, transparent 0%, hsl(222 47% 6% / 0.2) 50%, hsl(222 47% 6% / 0.5) 100%)'
           }} 
      />
      
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden opacity-30 z-10">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl translate-x-1/2" />
      </div>

      <div className="container mx-auto container-padding relative z-20">
        {/* Section Header */}
        <div className={`text-center mb-10 sm:mb-16 ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}>
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="text-primary text-sm font-medium uppercase tracking-wider inline-flex items-center gap-2 mb-2"
          >
            <Award className="w-4 h-4" />
            Credentials
          </motion.span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mt-3 sm:mt-4">
            My <span className="gradient-text">Certifications</span>
          </h2>
          <p className="text-muted-foreground mt-3 sm:mt-4 max-w-2xl mx-auto text-sm sm:text-base px-4">
            Professional certifications and credentials that validate my expertise and commitment to continuous learning
          </p>
        </div>

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
          {certifications.map((cert, index) => (
            <motion.div
              key={cert.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="glass-enhanced rounded-xl sm:rounded-2xl p-4 sm:p-6 card-hover group"
            >
              {/* Header */}
              <motion.div 
                className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4"
                whileHover={{ x: 5 }}
              >
                <motion.div 
                  className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-primary/10 shrink-0 relative"
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Award className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  <motion.div
                    className="absolute -top-1 -right-1"
                    animate={{ 
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      repeatDelay: 3
                    }}
                  >
                    <Sparkles className="w-3 h-3 text-yellow-400" />
                  </motion.div>
                </motion.div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-base sm:text-lg font-semibold group-hover:text-primary transition-colors">
                    {cert.title}
                  </h3>
                  <p className="text-primary font-medium text-sm sm:text-base mt-1">{cert.issuer}</p>
                </div>
              </motion.div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 flex-1 line-clamp-3">
                {cert.description}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between mt-auto pt-3 sm:pt-4 border-t border-border/50">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>{cert.date}</span>
                </div>
                {cert.credentialUrl !== "#" && (
                  <motion.a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs sm:text-sm text-primary hover:text-primary/80 transition-colors"
                    whileHover={{ x: 3 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    View Credential
                    <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                  </motion.a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
