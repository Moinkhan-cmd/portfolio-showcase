import { motion } from "framer-motion";
import { Award, ExternalLink, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
  return (
    <section id="certifications" className="section-padding relative overflow-hidden">
      <div className="container mx-auto container-padding relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full mb-4">
            <Award className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">Credentials</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold">
            <span className="gradient-text">Certifications</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Professional certifications and credentials that validate my expertise and commitment to continuous learning.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {certifications.map((cert, index) => (
            <motion.div
              key={cert.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="glass-card border-0 h-full group hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 rounded-lg bg-primary/10 text-primary shrink-0">
                      <Award className="h-6 w-6" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-display font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
                        {cert.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">{cert.issuer}</p>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground flex-1 mb-4">
                    {cert.description}
                  </p>

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{cert.date}</span>
                    </div>
                    {cert.credentialUrl !== "#" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="text-xs gap-1 hover:text-primary"
                      >
                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Credential
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
