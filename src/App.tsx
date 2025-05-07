
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/use-auth";

// Public Pages
import Home from "./pages/Home";
import AboutPage from "./pages/AboutPage";
import CalculatorPage from "./pages/CalculatorPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import NotFound from "./pages/NotFound";

// Auth Pages
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";

// User Pages
import CreateProfilePage from "./pages/user/CreateProfilePage";
import DashboardPage from "./pages/user/DashboardPage";
import LoanApplicationPage from "./pages/user/LoanApplicationPage";
import LoanDetailsPage from "./pages/user/LoanDetailsPage";

// Admin Pages
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminForgotPasswordPage from "./pages/admin/AdminForgotPasswordPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminLoanDetailsPage from "./pages/admin/AdminLoanDetailsPage";

// Auth Guards
import AuthGuard from "./components/guards/AuthGuard";
import AdminGuard from "./components/guards/AdminGuard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/calculator" element={<CalculatorPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />

            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* User Routes - Protected */}
            <Route element={<AuthGuard />}>
              <Route path="/create-profile" element={<CreateProfilePage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/dashboard/apply" element={<LoanApplicationPage />} />
              <Route path="/dashboard/loans/:loanId" element={<LoanDetailsPage />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLoginPage />} />
            <Route path="/admin/forgot-password" element={<AdminForgotPasswordPage />} />
            
            <Route element={<AdminGuard />}>
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
              <Route path="/admin/loans/:loanId" element={<AdminLoanDetailsPage />} />
            </Route>

            {/* Catch-all and redirects */}
            <Route path="/admin/*" element={<Navigate to="/admin" />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
