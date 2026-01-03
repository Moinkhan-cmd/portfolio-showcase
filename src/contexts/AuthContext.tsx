// Authentication context for admin panel
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  User,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
  isFirebaseAvailable: boolean;
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
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || "";

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
    await signOut(auth);
  };

  useEffect(() => {
    if (!auth) {
      console.warn("Firebase Auth is not available. Admin features will be disabled.");
      setLoading(false);
      setIsFirebaseAvailable(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const isAdmin = currentUser?.email === adminEmail;

  const value = {
    currentUser,
    loading,
    login,
    logout,
    isAdmin,
    isFirebaseAvailable,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};




