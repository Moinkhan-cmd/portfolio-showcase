import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { SectionDivider } from "@/components/SectionDivider";
import { ScrollReveal } from "@/components/ScrollReveal";
import { lazy, Suspense } from "react";

const AboutSection = lazy(async () => {
  const mod = await import("@/components/AboutSection");
  return { default: mod.AboutSection };
});
const SkillsSection = lazy(async () => {
  const mod = await import("@/components/SkillsSection");
  return { default: mod.SkillsSection };
});
const ProjectsSection = lazy(async () => {
  const mod = await import("@/components/ProjectsSection");
  return { default: mod.ProjectsSection };
});
const ExperienceSection = lazy(async () => {
  const mod = await import("@/components/ExperienceSection");
  return { default: mod.ExperienceSection };
});
const CertificationsSection = lazy(async () => {
  const mod = await import("@/components/CertificationsSection");
  return { default: mod.CertificationsSection };
});
const ContactSection = lazy(async () => {
  const mod = await import("@/components/ContactSection");
  return { default: mod.ContactSection };
});
const Footer = lazy(async () => {
  const mod = await import("@/components/Footer");
  return { default: mod.Footer };
});

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
          <Suspense fallback={null}>
            <AboutSection />
          </Suspense>
        </ScrollReveal>

        <SectionDivider />
        <ScrollReveal variant="fadeUp" delay={0.1}>
          <Suspense fallback={null}>
            <SkillsSection />
          </Suspense>
        </ScrollReveal>

        <SectionDivider />
        <ScrollReveal variant="fadeUp" delay={0.1}>
          <Suspense fallback={null}>
            <ProjectsSection />
          </Suspense>
        </ScrollReveal>

        <SectionDivider />
        <ScrollReveal variant="fadeUp" delay={0.1}>
          <Suspense fallback={null}>
            <ExperienceSection />
          </Suspense>
        </ScrollReveal>

        <SectionDivider />
        <ScrollReveal variant="fadeUp" delay={0.1}>
          <Suspense fallback={null}>
            <CertificationsSection />
          </Suspense>
        </ScrollReveal>

        <SectionDivider />
        <ScrollReveal variant="fadeUp" delay={0.1}>
          <Suspense fallback={null}>
            <ContactSection />
          </Suspense>
        </ScrollReveal>

        <SectionDivider />
        <ScrollReveal variant="fadeUp" delay={0.1}>
          <Suspense fallback={null}>
            <Footer />
          </Suspense>
        </ScrollReveal>
      </div>
    </main>
  );
};

export default Index;
