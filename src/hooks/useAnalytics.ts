// Hook for analytics tracking
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { trackPageView, trackUserActivity } from "@/lib/analytics";

export const useAnalytics = () => {
  const location = useLocation();
  const { currentUser } = useAuth();

  useEffect(() => {
    // Track page view
    const pageTitle = document.title || location.pathname;
    trackPageView(location.pathname, pageTitle);

    // Track authenticated user activity
    if (currentUser) {
      trackUserActivity(currentUser.uid, location.pathname, pageTitle);
    }
  }, [location.pathname, currentUser]);
};

