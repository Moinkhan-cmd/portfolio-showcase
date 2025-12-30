import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { SkillsSection } from "@/components/SkillsSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { ExperienceSection } from "@/components/ExperienceSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { SectionDivider } from "@/components/SectionDivider";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden relative">
      {/* Background elements */}
      <div className="fixed top-1/4 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="fixed bottom-1/4 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="fixed top-1/2 left-1/2 w-72 h-72 bg-primary/3 rounded-full blur-3xl pointer-events-none z-0" style={{ marginLeft: '-9rem' }} />

      <div className="relative z-10">
        <Navigation />
        
        {/* Hero - No scroll effects, just smooth entrance */}
        <HeroSection />
        
        <SectionDivider />
        
        {/* About */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <AboutSection />
        </motion.div>
        
        <SectionDivider />
        
        {/* Skills */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <SkillsSection />
        </motion.div>
        
        <SectionDivider />
        
        {/* Projects */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <ProjectsSection />
        </motion.div>
        
        <SectionDivider />
        
        {/* Experience */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <ExperienceSection />
        </motion.div>
        
        <SectionDivider />
        
        {/* Contact */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <ContactSection />
        </motion.div>
        
        <SectionDivider />
        
        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
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
