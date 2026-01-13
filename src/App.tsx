import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { ScrollProgress } from "@/components/ScrollProgress";
import { SmoothScroll } from "@/components/SmoothScroll";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useRealMobile } from "@/hooks/useRealMobile";

const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));

const AdminLogin = lazy(async () => {
  const mod = await import("@/pages/admin/Login");
  return { default: mod.AdminLogin };
});
const AdminDashboard = lazy(async () => {
  const mod = await import("@/pages/admin/Dashboard");
  return { default: mod.AdminDashboard };
});
const AdminAnalytics = lazy(async () => {
  const mod = await import("@/pages/admin/Analytics");
  return { default: mod.AdminAnalytics };
});
const AdminProjects = lazy(async () => {
  const mod = await import("@/pages/admin/Projects");
  return { default: mod.AdminProjects };
});
const AdminCertifications = lazy(async () => {
  const mod = await import("@/pages/admin/Certifications");
  return { default: mod.AdminCertifications };
});
const AdminExperience = lazy(async () => {
  const mod = await import("@/pages/admin/Experience");
  return { default: mod.AdminExperience };
});
const AdminSkills = lazy(async () => {
  const mod = await import("@/pages/admin/Skills");
  return { default: mod.AdminSkills };
});
const AdminPersonalDetails = lazy(async () => {
  const mod = await import("@/pages/admin/PersonalDetails");
  return { default: mod.AdminPersonalDetails };
});

const queryClient = new QueryClient();

const App = () => {
  const { isRealMobile } = useRealMobile();

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <TooltipProvider>
            <AuthProvider>
              {!isRealMobile && <SmoothScroll />}
              {!isRealMobile && <ScrollProgress />}
              <Toaster />
              <Sonner />
              <BrowserRouter
                // Opt-in to upcoming React Router v7 behaviors to remove v6 warning noise.
                // Some react-router-dom v6 versions don't type this prop yet.
                future={{
                  v7_startTransition: true,
                  v7_relativeSplatPath: true,
                }}
              >
                <AnalyticsTracker />
                <Suspense fallback={null}>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route
                      path="/admin"
                      element={
                        <ProtectedRoute>
                          <AdminLayout />
                        </ProtectedRoute>
                      }
                    >
                      <Route index element={<AdminDashboard />} />
                      <Route path="personal-details" element={<AdminPersonalDetails />} />
                      <Route path="analytics" element={<AdminAnalytics />} />
                      <Route path="projects" element={<AdminProjects />} />
                      <Route path="certifications" element={<AdminCertifications />} />
                      <Route path="experience" element={<AdminExperience />} />
                      <Route path="skills" element={<AdminSkills />} />
                    </Route>
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </BrowserRouter>
            </AuthProvider>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
