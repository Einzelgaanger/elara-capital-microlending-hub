
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

export default function AdminGuard() {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    // Show loading state while authentication is being checked
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-elara-primary"></div>
        <p className="ml-3">Verifying authentication...</p>
      </div>
    );
  }

  // If user is not logged in or is not an admin, redirect to admin login page
  if (!user || !isAdmin) {
    return <Navigate to="/admin" />;
  }

  // If user is authenticated and is an admin, render the protected routes
  return <Outlet />;
}
