// Firebase configuration and initialization
import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAnalytics, Analytics } from "firebase/analytics";

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Validate Firebase config
const isFirebaseConfigValid = () => {
  return !!(
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.messagingSenderId &&
    firebaseConfig.appId
  );
};

// Initialize Firebase with error handling
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let analytics: Analytics | null = null;

try {
  if (isFirebaseConfigValid()) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);

    // Initialize Analytics (browser-only). Guard against offline/mobile failures.
    if (typeof window !== "undefined") {
      const initAnalytics = () => {
        try {
          // Avoid triggering Firebase Installations while offline.
          if (typeof navigator !== "undefined" && navigator.onLine === false) return;
          analytics = getAnalytics(app);
        } catch (error) {
          analytics = null;
          console.warn("Analytics initialization failed:", error);
        }
      };

      initAnalytics();
      window.addEventListener("online", initAnalytics, { passive: true });
    }
  } else {
    console.error("Firebase configuration is missing. Please check your environment variables.");
    console.error("Required variables: VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, VITE_FIREBASE_PROJECT_ID, VITE_FIREBASE_MESSAGING_SENDER_ID, VITE_FIREBASE_APP_ID");
  }
} catch (error) {
  console.error("Firebase initialization failed:", error);
  console.error("Please check your Firebase configuration and environment variables.");
}

// Export with null checks - components should handle null cases
export { auth, db, analytics };
export default app;


