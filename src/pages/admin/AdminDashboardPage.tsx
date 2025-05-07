
import { useState, useEffect } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Loan, UserProfile, LoanStatus } from "@/types";
import { toast } from "@/components/ui/sonner";

export default function AdminDashboardPage() {
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [isLoadingLoans, setIsLoadingLoans] = useState(true);
  const [isLoadingProfiles, setIsLoadingProfiles] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    const fetchAllLoans = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from("loans")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        
        // Type assertion to ensure data is compatible with Loan[]
        const typedLoans = data?.map(loan => ({
          ...loan,
          status: loan.status as LoanStatus
        })) || [];
        
        setLoans(typedLoans);
      } catch (error: any) {
        console.error("Error fetching loans:", error);
        toast.error("Failed to load loans: " + error.message);
      } finally {
        setIsLoadingLoans(false);
      }
    };

    const fetchAllProfiles = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from("user_profiles")
          .select("*");

        if (error) throw error;
        setProfiles(data || []);
      } catch (error: any) {
        console.error("Error fetching profiles:", error);
        toast.error("Failed to load profiles: " + error.message);
      } finally {
        setIsLoadingProfiles(false);
      }
    };

    fetchAllLoans();
    fetchAllProfiles();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-elara-primary"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin" />;
  }

  // Filter loans based on selected status
  const filteredLoans = filter === "all" 
    ? loans 
    : loans.filter(loan => loan.status === filter);

  // Find user profile by user ID
  const getUserName = (userId: string) => {
    const profile = profiles.find(p => p.user_id === userId);
    return profile 
      ? `${profile.title}. ${profile.first_name} ${profile.last_name}`
      : "Unknown User";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-elara-primary text-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">Elara Capital Admin</h1>
            <Button
              variant="outline"
              className="bg-transparent border-white text-white hover:bg-white hover:text-elara-primary"
              onClick={() => navigate("/")}
            >
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-6">Admin Dashboard</h1>

        <Card className="mb-8">
          <CardHeader className="pb-2">
            <CardTitle>Loan Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex flex-wrap gap-2">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("all")}
              >
                All
              </Button>
              <Button
                variant={filter === "pending" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("pending")}
              >
                Pending
              </Button>
              <Button
                variant={filter === "approved" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("approved")}
              >
                Approved
              </Button>
              <Button
                variant={filter === "allocated" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("allocated")}
              >
                Allocated
              </Button>
              <Button
                variant={filter === "repaid" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("repaid")}
              >
                Repaid
              </Button>
              <Button
                variant={filter === "rejected" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("rejected")}
              >
                Rejected
              </Button>
            </div>

            {isLoadingLoans ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-elara-primary"></div>
              </div>
            ) : filteredLoans.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No loan applications found matching the current filter.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 text-left font-medium text-gray-500">Applicant</th>
                      <th className="py-2 text-left font-medium text-gray-500">Amount</th>
                      <th className="py-2 text-left font-medium text-gray-500">Date</th>
                      <th className="py-2 text-left font-medium text-gray-500">Status</th>
                      <th className="py-2 text-right font-medium text-gray-500">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLoans.map((loan) => (
                      <tr key={loan.id} className="border-b">
                        <td className="py-3">{getUserName(loan.user_id)}</td>
                        <td className="py-3">KSh {loan.amount.toLocaleString()}</td>
                        <td className="py-3">{new Date(loan.created_at).toLocaleDateString()}</td>
                        <td className="py-3">
                          <Badge
                            className={`
                              ${loan.status === "pending" ? "bg-yellow-100 text-yellow-800" : ""}
                              ${loan.status === "approved" ? "bg-blue-100 text-blue-800" : ""}
                              ${loan.status === "allocated" ? "bg-green-100 text-green-800" : ""}
                              ${loan.status === "repaid" ? "bg-purple-100 text-purple-800" : ""}
                              ${loan.status === "rejected" ? "bg-red-100 text-red-800" : ""}
                            `}
                          >
                            {loan.status}
                          </Badge>
                        </td>
                        <td className="py-3 text-right">
                          <Button asChild size="sm" variant="outline">
                            <Link to={`/admin/loans/${loan.id}`}>
                              View Details
                            </Link>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Recent User Registrations</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingProfiles ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-elara-primary"></div>
              </div>
            ) : profiles.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No user profiles found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 text-left font-medium text-gray-500">Name</th>
                      <th className="py-2 text-left font-medium text-gray-500">National ID</th>
                      <th className="py-2 text-left font-medium text-gray-500">Occupation</th>
                      <th className="py-2 text-left font-medium text-gray-500">Registration Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profiles.slice(0, 10).map((profile) => (
                      <tr key={profile.id} className="border-b">
                        <td className="py-3">
                          {profile.title}. {profile.first_name} {profile.last_name}
                        </td>
                        <td className="py-3">{profile.national_id}</td>
                        <td className="py-3">{profile.occupation}</td>
                        <td className="py-3">{new Date(profile.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
