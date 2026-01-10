import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { SectionDivider } from "@/components/SectionDivider";
import { SectionTransition } from "@/components/SectionTransition";
import { SectionProgressIndicator } from "@/components/SectionProgressIndicator";
import { KeyboardHint, KeyboardHintTrigger } from "@/components/KeyboardHint";
import { CursorParticleTrail } from "@/components/CursorParticleTrail";
import { useKeyboardNavigation } from "@/hooks/useKeyboardNavigation";
import { lazy, Suspense, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
  const [navigatingSection, setNavigatingSection] = useState<string | null>(null);
  const { showHint, setShowHint } = useKeyboardNavigation();

  useEffect(() => {
    const handleSectionNavigate = (e: CustomEvent<{ sectionId: string }>) => {
      setNavigatingSection(e.detail.sectionId);
      setTimeout(() => setNavigatingSection(null), 800);
    };

    window.addEventListener('sectionNavigate', handleSectionNavigate as EventListener);
    return () => window.removeEventListener('sectionNavigate', handleSectionNavigate as EventListener);
  }, []);

  return (
    <main className="min-h-screen bg-background overflow-x-hidden relative">
      {/* Cursor particle trail - only in Full Effects mode */}
      <CursorParticleTrail />
      
      {/* Background elements */}
      <div className="fixed top-1/4 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="fixed bottom-1/4 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none z-0" />
      <div
        className="fixed top-1/2 left-1/2 w-72 h-72 bg-primary/3 rounded-full blur-3xl pointer-events-none z-0"
        style={{ marginLeft: "-9rem" }}
      />

      {/* Navigation transition overlay */}
      <AnimatePresence>
        {navigatingSection && (
          <motion.div
            className="fixed inset-0 z-40 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/5"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              exit={{ scaleY: 0 }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{ transformOrigin: "center" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10">
        <Navigation />
        <SectionProgressIndicator />
        <KeyboardHint isVisible={showHint} onClose={() => setShowHint(false)} />
        <KeyboardHintTrigger onClick={() => setShowHint(true)} />
        <HeroSection />

        <SectionDivider />
        <SectionTransition>
          <Suspense fallback={null}>
            <AboutSection />
          </Suspense>
        </SectionTransition>

        <SectionDivider />
        <SectionTransition>
          <Suspense fallback={null}>
            <SkillsSection />
          </Suspense>
        </SectionTransition>

        <SectionDivider />
        <SectionTransition>
          <Suspense fallback={null}>
            <ProjectsSection />
          </Suspense>
        </SectionTransition>

        <SectionDivider />
        <SectionTransition>
          <Suspense fallback={null}>
            <ExperienceSection />
          </Suspense>
        </SectionTransition>

        <SectionDivider />
        <SectionTransition>
          <Suspense fallback={null}>
            <CertificationsSection />
          </Suspense>
        </SectionTransition>

        <SectionDivider />
        <SectionTransition>
          <Suspense fallback={null}>
            <ContactSection />
          </Suspense>
        </SectionTransition>

        <SectionDivider />
        <SectionTransition>
          <Suspense fallback={null}>
            <Footer />
          </Suspense>
        </SectionTransition>
      </div>
    </main>
  );
};

export default Index;
