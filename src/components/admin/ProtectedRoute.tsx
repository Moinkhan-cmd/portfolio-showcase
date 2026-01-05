// Protected route component for admin pages
// SECURITY NOTE: This component provides UI-level protection only.
// Actual data security is enforced by Firestore security rules on the server side.
// Attackers cannot access protected data even if they bypass this UI check.
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, ShieldAlert } from "lucide-react";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, isAdmin, loading, verifyAdminStatus } = useAuth();
  const location = useLocation();
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationComplete, setVerificationComplete] = useState(false);

  // Perform additional server-side verification on mount
  useEffect(() => {
    const verify = async () => {
      if (currentUser && isAdmin && !verificationComplete) {
        setIsVerifying(true);
        try {
          // Re-verify admin status by refreshing ID token
          await verifyAdminStatus();
        } catch (error) {
          console.error("Admin verification failed");
        } finally {
          setIsVerifying(false);
          setVerificationComplete(true);
        }
      }
    };
    
    verify();
  }, [currentUser, isAdmin, verifyAdminStatus, verificationComplete]);

  if (loading || isVerifying) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">
          {isVerifying ? "Verifying admin access..." : "Loading..."}
        </p>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    // Show unauthorized message instead of silent redirect for better UX
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4">
        <ShieldAlert className="w-16 h-16 text-destructive" />
        <h1 className="text-2xl font-bold text-center">Unauthorized Access</h1>
        <p className="text-muted-foreground text-center max-w-md">
          You don't have permission to access the admin panel. 
          Please contact the administrator if you believe this is an error.
        </p>
        <p className="text-xs text-muted-foreground">
          Logged in as: {currentUser.email}
        </p>
      </div>
    );
  }

  return <>{children}</>;
};
