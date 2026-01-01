import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { SkillsSection } from "@/components/SkillsSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { ExperienceSection } from "@/components/ExperienceSection";
import { CertificationsSection } from "@/components/CertificationsSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { SectionDivider } from "@/components/SectionDivider";
import { ScrollReveal } from "@/components/ScrollReveal";

const Index = () => {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden relative">
      {/* Background elements */}
      <div className="fixed top-1/4 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="fixed bottom-1/4 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none z-0" />
      <div
        className="fixed top-1/2 left-1/2 w-72 h-72 bg-primary/3 rounded-full blur-3xl pointer-events-none z-0"
        style={{ marginLeft: "-9rem" }}
      />

      <div className="relative z-10">
        <Navigation />
        <HeroSection />

        <SectionDivider />
        <ScrollReveal variant="fadeUp" delay={0.1}>
          <AboutSection />
        </ScrollReveal>

        <SectionDivider />
        <ScrollReveal variant="fadeUp" delay={0.1}>
          <SkillsSection />
        </ScrollReveal>

        <SectionDivider />
        <ScrollReveal variant="fadeUp" delay={0.1}>
          <ProjectsSection />
        </ScrollReveal>

        <SectionDivider />
        <ScrollReveal variant="fadeUp" delay={0.1}>
          <ExperienceSection />
        </ScrollReveal>

        <SectionDivider />
        <ScrollReveal variant="fadeUp" delay={0.1}>
          <CertificationsSection />
        </ScrollReveal>

        <SectionDivider />
        <ScrollReveal variant="fadeUp" delay={0.1}>
          <ContactSection />
        </ScrollReveal>

        <SectionDivider />
        <ScrollReveal variant="fadeUp" delay={0.1}>
          <Footer />
        </ScrollReveal>
      </div>
    </main>
  );
};

export default Index;
