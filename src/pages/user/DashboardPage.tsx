
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Loan, UserProfile } from "@/types";

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isLoadingLoans, setIsLoadingLoans] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    const fetchUserLoans = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from("loans")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setLoans(data || []);
      } catch (error) {
        console.error("Error fetching loans:", error);
      } finally {
        setIsLoadingLoans(false);
      }
    };

    fetchUserProfile();
    fetchUserLoans();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  // If profile is not created yet, redirect to create profile page
  if (!isLoadingProfile && !profile) {
    navigate("/create-profile");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-elara-primary text-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">Elara Capital</h1>
            <div className="flex items-center space-x-4">
              {user && (
                <span className="text-sm hidden md:inline-block">
                  Welcome, {user.email}
                </span>
              )}
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent border-white text-white hover:bg-white hover:text-elara-primary"
                onClick={handleSignOut}
              >
                Sign out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <Button asChild>
            <Link to="/dashboard/apply">Apply for a Loan</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Your Loans</CardTitle>
                <CardDescription>
                  View and manage your loan applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingLoans ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-elara-primary"></div>
                  </div>
                ) : loans.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      You haven't applied for any loans yet.
                    </p>
                    <Button asChild className="mt-4">
                      <Link to="/dashboard/apply">Apply now</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="py-2 text-left font-medium text-gray-500">Amount</th>
                          <th className="py-2 text-left font-medium text-gray-500">Purpose</th>
                          <th className="py-2 text-left font-medium text-gray-500">Status</th>
                          <th className="py-2 text-right font-medium text-gray-500">View</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loans.map((loan) => (
                          <tr key={loan.id} className="border-b">
                            <td className="py-3">
                              KSh {loan.amount.toLocaleString()}
                            </td>
                            <td className="py-3">
                              {loan.purpose.length > 30
                                ? loan.purpose.substring(0, 30) + "..."
                                : loan.purpose}
                            </td>
                            <td className="py-3">
                              <span
                                className={`px-2 py-1 text-xs font-medium rounded-full 
                                  ${loan.status === "pending" ? "bg-yellow-100 text-yellow-800" : ""}
                                  ${loan.status === "approved" ? "bg-blue-100 text-blue-800" : ""}
                                  ${loan.status === "allocated" ? "bg-green-100 text-green-800" : ""}
                                  ${loan.status === "repaid" ? "bg-purple-100 text-purple-800" : ""}
                                  ${loan.status === "rejected" ? "bg-red-100 text-red-800" : ""}
                                `}
                              >
                                {loan.status}
                              </span>
                            </td>
                            <td className="py-3 text-right">
                              <Link
                                to={`/dashboard/loans/${loan.id}`}
                                className="text-elara-primary hover:text-elara-primary/80 text-sm"
                              >
                                Details
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Your Profile</CardTitle>
                <CardDescription>
                  Your personal information
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingProfile ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-elara-primary"></div>
                  </div>
                ) : profile ? (
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">Name:</span>{" "}
                      {profile.title}. {profile.first_name} {profile.last_name}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">National ID:</span>{" "}
                      {profile.national_id}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Occupation:</span>{" "}
                      {profile.occupation}
                    </p>
                  </div>
                ) : (
                  <p>No profile information found.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
