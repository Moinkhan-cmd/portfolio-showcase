// Authentication context for admin panel
// SECURITY NOTE: Admin status is verified both client-side (for UI) and server-side (via Firestore rules).
// The client-side check is for UX only - actual data protection is enforced by Firestore security rules.
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  User,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  IdTokenResult,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
  isFirebaseAvailable: boolean;
  verifyAdminStatus: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFirebaseAvailable, setIsFirebaseAvailable] = useState(!!auth);
  const [tokenClaims, setTokenClaims] = useState<IdTokenResult | null>(null);
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || "";

  // Verify admin status by checking both email and refreshing ID token
  // This provides better security than just email comparison
  const verifyAdminStatus = async (): Promise<boolean> => {
    if (!currentUser) return false;
    
    try {
      // Force refresh the ID token to get latest claims
      const tokenResult = await currentUser.getIdTokenResult(true);
      setTokenClaims(tokenResult);
      
      // Check for custom claims first (most secure)
      if (tokenResult.claims.admin === true) {
        return true;
      }
      
      // Fallback to email comparison (verified by Firestore rules server-side)
      // SECURITY NOTE: This is only for UI - Firestore rules provide actual protection
      if (currentUser.email && currentUser.email === adminEmail) {
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Error verifying admin status");
      return false;
    }
  };

  const login = async (email: string, password: string) => {
    if (!auth) {
      throw new Error("Firebase is not initialized. Please check your environment variables.");
    }
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    if (!auth) {
      return;
    }
    setTokenClaims(null);
    await signOut(auth);
  };

  useEffect(() => {
    if (!auth) {
      console.warn("Firebase Auth is not available. Admin features will be disabled.");
      setLoading(false);
      setIsFirebaseAvailable(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      // Fetch ID token claims when user changes
      if (user) {
        try {
          const tokenResult = await user.getIdTokenResult();
          setTokenClaims(tokenResult);
        } catch {
          setTokenClaims(null);
        }
      } else {
        setTokenClaims(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Admin check: prioritize custom claims, fallback to email comparison
  // SECURITY NOTE: This is UI-only protection. Server-side protection via Firestore rules is the security boundary.
  const isAdmin = (() => {
    if (!currentUser) return false;
    
    // Check custom claims first (set via Firebase Admin SDK)
    if (tokenClaims?.claims?.admin === true) {
      return true;
    }
    
    // Fallback to email comparison (Firestore rules also verify this server-side)
    return currentUser.email === adminEmail;
  })();

  const value = {
    currentUser,
    loading,
    login,
    logout,
    isAdmin,
    isFirebaseAvailable,
    verifyAdminStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
