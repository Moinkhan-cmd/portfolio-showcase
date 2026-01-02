// Analytics tracking service
import { db, auth } from "./firebase";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  Timestamp,
  increment,
} from "firebase/firestore";
import { analytics } from "./firebase";
import { logEvent } from "firebase/analytics";

// Visitor session ID (stored in localStorage)
const getSessionId = (): string => {
  const stored = localStorage.getItem("visitor_session_id");
  if (stored) return stored;
  const newId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  localStorage.setItem("visitor_session_id", newId);
  return newId;
};

// Visitor ID (stored in localStorage, persists across sessions)
const getVisitorId = (): string => {
  const stored = localStorage.getItem("visitor_id");
  if (stored) return stored;
  const newId = `visitor_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  localStorage.setItem("visitor_id", newId);
  localStorage.setItem("visitor_first_visit", new Date().toISOString());
  return newId;
};

// Device type detection
const getDeviceType = (): "desktop" | "tablet" | "mobile" => {
  const width = window.innerWidth;
  if (width < 768) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
};

// Get country/region from browser
const getCountryRegion = (): { country: string; region: string } => {
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    // Extract region from timezone (e.g., "America/New_York" -> "US", "America")
    const parts = timezone.split("/");
    if (parts.length >= 2) {
      return {
        country: parts[parts.length - 1] || "Unknown",
        region: parts[0] || "Unknown",
      };
    }
    return { country: "Unknown", region: "Unknown" };
  } catch {
    return { country: "Unknown", region: "Unknown" };
  }
};

// Get referrer/traffic source
const getTrafficSource = (): string => {
  const referrer = document.referrer;
  if (!referrer) return "direct";
  
  try {
    const url = new URL(referrer);
    const hostname = url.hostname;
    
    if (hostname.includes("google")) return "google";
    if (hostname.includes("bing")) return "bing";
    if (hostname.includes("yahoo")) return "yahoo";
    if (hostname.includes("facebook")) return "facebook";
    if (hostname.includes("twitter") || hostname.includes("x.com")) return "twitter";
    if (hostname.includes("linkedin")) return "linkedin";
    if (hostname.includes("github")) return "github";
    if (hostname.includes("reddit")) return "reddit";
    
    return hostname;
  } catch {
    return "direct";
  }
};

// Track page view
export const trackPageView = async (pagePath: string, pageTitle?: string) => {
  try {
    const visitorId = getVisitorId();
    const sessionId = getSessionId();
    const deviceType = getDeviceType();
    const { country, region } = getCountryRegion();
    const trafficSource = getTrafficSource();
    const isNewVisitor = !localStorage.getItem("visitor_has_visited");
    
    if (isNewVisitor) {
      localStorage.setItem("visitor_has_visited", "true");
    }

    // Check if this is the first visit today
    const today = new Date().toISOString().split("T")[0];
    const lastVisitDate = localStorage.getItem("visitor_last_visit_date");
    const isNewSession = lastVisitDate !== today;
    
    if (isNewSession) {
      localStorage.setItem("visitor_last_visit_date", today);
    }

    // Firestore: Store page view
    const pageViewRef = doc(collection(db, "analytics_page_views"));
    await setDoc(pageViewRef, {
      visitorId,
      sessionId,
      pagePath,
      pageTitle: pageTitle || pagePath,
      deviceType,
      country,
      region,
      trafficSource,
      isNewVisitor: isNewVisitor && isNewSession,
      timestamp: serverTimestamp(),
      date: today,
    });

    // Firestore: Update daily stats
    const statsRef = doc(db, "analytics_daily_stats", today);
    const statsSnap = await getDoc(statsRef);
    
    if (statsSnap.exists()) {
      const updateData: any = {
        pageViews: increment(1),
        [`deviceTypes.${deviceType}`]: increment(1),
        [`countries.${country}`]: increment(1),
        [`trafficSources.${trafficSource}`]: increment(1),
        lastUpdated: serverTimestamp(),
      };
      
      if (isNewVisitor && isNewSession) {
        updateData.newVisitors = increment(1);
        updateData.uniqueVisitors = increment(1);
      } else if (isNewSession) {
        updateData.uniqueVisitors = increment(1);
      }
      
      await updateDoc(statsRef, updateData);
    } else {
      await setDoc(statsRef, {
        date: today,
        pageViews: 1,
        uniqueVisitors: isNewSession ? 1 : 0,
        newVisitors: isNewVisitor && isNewSession ? 1 : 0,
        deviceTypes: {
          [deviceType]: 1,
          desktop: deviceType === "desktop" ? 1 : 0,
          tablet: deviceType === "tablet" ? 1 : 0,
          mobile: deviceType === "mobile" ? 1 : 0,
        },
        countries: {
          [country]: 1,
        },
        trafficSources: {
          [trafficSource]: 1,
        },
        lastUpdated: serverTimestamp(),
      });
    }

    // Track unique visitor (if new session)
    if (isNewSession) {
      const visitorRef = doc(db, "analytics_visitors", visitorId);
      const visitorSnap = await getDoc(visitorRef);
      
      if (!visitorSnap.exists()) {
        await setDoc(visitorRef, {
          visitorId,
          firstVisit: serverTimestamp(),
          lastVisit: serverTimestamp(),
          deviceType,
          country,
          region,
          totalVisits: 1,
        });
      } else {
        await updateDoc(visitorRef, {
          lastVisit: serverTimestamp(),
          totalVisits: increment(1),
        });
      }
    }

    // Firebase Analytics (if available)
    if (analytics) {
      logEvent(analytics, "page_view", {
        page_path: pagePath,
        page_title: pageTitle || pagePath,
        device_type: deviceType,
        country,
        traffic_source: trafficSource,
      });
    }
  } catch (error) {
    console.error("Error tracking page view:", error);
  }
};

// Track authenticated user activity
export const trackUserActivity = async (userId: string, pagePath: string, pageTitle?: string) => {
  try {
    const userRef = doc(db, "analytics_users", userId);
    const userSnap = await getDoc(userRef);
    
    const activityData = {
      pagePath,
      pageTitle: pageTitle || pagePath,
      timestamp: serverTimestamp(),
    };

    if (userSnap.exists()) {
      await updateDoc(userRef, {
        lastActive: serverTimestamp(),
        lastPage: pagePath,
        activityCount: increment(1),
      });
      
      // Add to activity log (keep last 50 activities)
      const activities = userSnap.data().activities || [];
      activities.push(activityData);
      if (activities.length > 50) {
        activities.shift();
      }
      await updateDoc(userRef, {
        activities,
      });
    } else {
      const user = auth.currentUser;
      await setDoc(userRef, {
        userId,
        email: user?.email || "unknown",
        firstActive: serverTimestamp(),
        lastActive: serverTimestamp(),
        lastPage: pagePath,
        activityCount: 1,
        activities: [activityData],
      });
    }
  } catch (error) {
    console.error("Error tracking user activity:", error);
  }
};

// Get analytics data for admin panel
export const getAnalyticsData = async (period: "daily" | "weekly" | "monthly" = "daily") => {
  try {
    const now = new Date();
    const periods: Record<string, number> = {
      daily: 1,
      weekly: 7,
      monthly: 30,
    };
    const daysBack = periods[period] || 1;
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - daysBack);
    const startDateStr = startDate.toISOString().split("T")[0];
    
    const statsRef = collection(db, "analytics_daily_stats");
    const q = query(statsRef, orderBy("date", "desc"));
    
    const snapshot = await getDocs(q);
    const stats = snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter((stat: any) => stat.date >= startDateStr);
    
    return stats;
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    return [];
  }
};

// Get page views per page
export const getPageViews = async (limitCount: number = 100) => {
  try {
    const pageViewsRef = collection(db, "analytics_page_views");
    const q = query(pageViewsRef, orderBy("timestamp", "desc"), limit(limitCount));
    
    const snapshot = await getDocs(q);
    const pageViews = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    
    // Aggregate by page path
    const aggregated: Record<string, number> = {};
    pageViews.forEach((view: any) => {
      const path = view.pagePath || "unknown";
      aggregated[path] = (aggregated[path] || 0) + 1;
    });
    
    return Object.entries(aggregated)
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count);
  } catch (error) {
    console.error("Error fetching page views:", error);
    return [];
  }
};

// Get active users (logged in)
export const getActiveUsers = async () => {
  try {
    const usersRef = collection(db, "analytics_users");
    const snapshot = await getDocs(usersRef);
    const users = snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .sort((a: any, b: any) => {
        const aTime = a.lastActive?.toDate?.() || a.lastActive || new Date(0);
        const bTime = b.lastActive?.toDate?.() || b.lastActive || new Date(0);
        return bTime.getTime() - aTime.getTime();
      })
      .slice(0, 50);
    
    return users;
  } catch (error) {
    console.error("Error fetching active users:", error);
    return [];
  }
};

// Get real-time active visitors (sessions active in last 5 minutes)
export const getActiveVisitors = async () => {
  try {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const pageViewsRef = collection(db, "analytics_page_views");
    const q = query(pageViewsRef, orderBy("timestamp", "desc"), limit(100));
    
    const snapshot = await getDocs(q);
    const sessions = new Set<string>();
    
    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      const timestamp = data.timestamp?.toDate?.() || data.timestamp;
      if (timestamp && new Date(timestamp) > fiveMinutesAgo && data.sessionId) {
        sessions.add(data.sessionId);
      }
    });
    
    return sessions.size;
  } catch (error) {
    console.error("Error fetching active visitors:", error);
    return 0;
  }
};

