
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

export default function AuthGuard() {
  const { user, loading } = useAuth();

  if (loading) {
    // Show loading state while authentication is being checked
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-elara-primary"></div>
        <p className="ml-3">Verifying authentication...</p>
      </div>
    );
  }

  // If user is not logged in, redirect to login page
  if (!user) {
    return <Navigate to="/login" />;
  }

  // If user is authenticated, render the protected routes
  return <Outlet />;
}
