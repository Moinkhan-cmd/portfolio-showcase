import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { SectionDivider } from "@/components/SectionDivider";
import { SectionTransition } from "@/components/SectionTransition";
import { SectionProgressIndicator } from "@/components/SectionProgressIndicator";
import { KeyboardHint, KeyboardHintTrigger } from "@/components/KeyboardHint";
import { WelcomeBackMessage } from "@/components/WelcomeBackMessage";
import { AudioFeedbackProvider } from "@/components/AudioFeedbackProvider";
import { SectionSkeleton } from "@/components/SectionSkeleton";
import { useKeyboardNavigation } from "@/hooks/useKeyboardNavigation";
import { lazy, Suspense, useEffect, useState, memo } from "react";
import { motion } from "framer-motion";
import { safeLocalStorage } from "@/lib/safeStorage";
import { useRealMobile } from "@/hooks/useRealMobile";

const AboutSection = lazy(() => import("@/components/AboutSection").then(mod => ({ default: mod.AboutSection })));
const SkillsSection = lazy(() => import("@/components/SkillsSection").then(mod => ({ default: mod.SkillsSection })));
const ProjectsSection = lazy(() => import("@/components/ProjectsSection").then(mod => ({ default: mod.ProjectsSection })));
const ExperienceSection = lazy(() => import("@/components/ExperienceSection").then(mod => ({ default: mod.ExperienceSection })));
const CertificationsSection = lazy(() => import("@/components/CertificationsSection").then(mod => ({ default: mod.CertificationsSection })));
const ContactSection = lazy(() => import("@/components/ContactSection").then(mod => ({ default: mod.ContactSection })));
const Footer = lazy(() => import("@/components/Footer").then(mod => ({ default: mod.Footer })));

// Memoized background to prevent re-renders
const BackgroundBlobs = memo(() => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
    <div className="absolute top-1/4 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
    <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
  </div>
));
BackgroundBlobs.displayName = "BackgroundBlobs";

const Index = () => {
  const [isReturningVisitor, setIsReturningVisitor] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const { showHint, setShowHint } = useKeyboardNavigation();
  const { isRealMobile } = useRealMobile();

  // Check if returning visitor (loader was skipped)
  useEffect(() => {
    const hasVisited = safeLocalStorage.getItem("portfolio_visited");
    if (hasVisited) {
      setIsReturningVisitor(true);
      requestAnimationFrame(() => setShowContent(true));
    } else {
      setShowContent(true);
      safeLocalStorage.setItem("portfolio_visited", "true");
    }
  }, []);

const content = (
    <>
      {!isRealMobile && <BackgroundBlobs />}

      <WelcomeBackMessage isReturningVisitor={isReturningVisitor} />
      
      <div className="relative z-10">
        <Navigation />
        <SectionProgressIndicator />
        <KeyboardHint isVisible={showHint} onClose={() => setShowHint(false)} />
        <KeyboardHintTrigger onClick={() => setShowHint(true)} />
        <HeroSection />

        <SectionDivider />
        <SectionTransition>
          <Suspense fallback={<SectionSkeleton variant="about" />}>
            <AboutSection />
          </Suspense>
        </SectionTransition>

        <SectionDivider />
        <SectionTransition>
          <Suspense fallback={<SectionSkeleton variant="skills" />}>
            <SkillsSection />
          </Suspense>
        </SectionTransition>

        <SectionDivider />
        <SectionTransition>
          <Suspense fallback={<SectionSkeleton variant="projects" />}>
            <ProjectsSection />
          </Suspense>
        </SectionTransition>

        <SectionDivider />
        <SectionTransition>
          <Suspense fallback={<SectionSkeleton variant="experience" />}>
            <ExperienceSection />
          </Suspense>
        </SectionTransition>

        <SectionDivider />
        <SectionTransition>
          <Suspense fallback={<SectionSkeleton variant="certifications" />}>
            <CertificationsSection />
          </Suspense>
        </SectionTransition>

        <SectionDivider />
        <SectionTransition>
          <Suspense fallback={<SectionSkeleton variant="contact" />}>
            <ContactSection />
          </Suspense>
        </SectionTransition>

        <SectionDivider />
        <SectionTransition>
          <Suspense fallback={<SectionSkeleton variant="footer" />}>
            <Footer />
          </Suspense>
        </SectionTransition>
      </div>
    </>
  );

  return (
    <AudioFeedbackProvider>
      {isRealMobile ? (
        <main className="min-h-screen bg-background overflow-x-hidden relative">{content}</main>
      ) : (
        <motion.main
          className="min-h-screen bg-background overflow-x-hidden relative"
          initial={isReturningVisitor ? { opacity: 0, y: 10 } : false}
          animate={showContent ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {content}
        </motion.main>
      )}
    </AudioFeedbackProvider>
  );
};

export default Index;
