import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { SkillsSection } from "@/components/SkillsSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { ExperienceSection } from "@/components/ExperienceSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { ScrollReveal, ScrollScale, Scroll3D } from "@/components/ScrollReveal";
import { SectionDivider } from "@/components/SectionDivider";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const Index = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Create floating background elements that move on scroll
  const bg1Y = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const bg2Y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const bg3Y = useTransform(scrollYProgress, [0, 1], [0, -500]);

  return (
    <main ref={containerRef} className="min-h-screen bg-background overflow-x-hidden relative">
      {/* Animated background elements */}
      <motion.div
        style={{ y: bg1Y }}
        className="fixed top-1/4 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none z-0"
      />
      <motion.div
        style={{ y: bg2Y }}
        className="fixed bottom-1/4 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none z-0"
      />
      <motion.div
        style={{ y: bg3Y }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 w-72 h-72 bg-primary/3 rounded-full blur-3xl pointer-events-none z-0"
      />

      <div className="relative z-10">
        <Navigation />
        
        {/* Hero - No scroll effects, just smooth entrance */}
        <HeroSection />
        
        <SectionDivider />
        
        {/* About with 3D scroll */}
        <Scroll3D>
          <ScrollReveal>
            <AboutSection />
          </ScrollReveal>
        </Scroll3D>
        
        <SectionDivider />
        
        {/* Skills with scale effect */}
        <ScrollScale>
          <ScrollReveal delay={0.2}>
            <SkillsSection />
          </ScrollReveal>
        </ScrollScale>
        
        <SectionDivider />
        
        {/* Projects with 3D rotation */}
        <Scroll3D>
          <ScrollReveal delay={0.1}>
            <ProjectsSection />
          </ScrollReveal>
        </Scroll3D>
        
        <SectionDivider />
        
        {/* Experience with dramatic reveal */}
        <ScrollScale>
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotateY: -45 }}
            whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
            viewport={{ once: false, margin: "-150px" }}
            transition={{
              duration: 1.2,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            <ExperienceSection />
          </motion.div>
        </ScrollScale>
        
        <SectionDivider />
        
        {/* Contact with impressive entrance */}
        <Scroll3D>
          <motion.div
            initial={{ opacity: 0, y: 150, scale: 0.7, rotateX: 45 }}
            whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{
              duration: 1,
              ease: [0.34, 1.56, 0.64, 1],
            }}
          >
            <ContactSection />
          </motion.div>
        </Scroll3D>
        
        <SectionDivider />
        
        {/* Footer with fade and zoom */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
        >
          <Footer />
        </motion.div>
      </div>
    </main>
  );
};

export default Index;
