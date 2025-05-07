
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Loan } from "@/types";

export default function AdminDashboardPage() {
  const { user, signOut, loading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [isLoadingLoans, setIsLoadingLoans] = useState(true);

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate("/admin");
    }
  }, [isAdmin, loading, navigate]);

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const { data, error } = await supabase
          .from("loans")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setLoans(data || []);
      } catch (error) {
        console.error("Error fetching loans:", error);
      } finally {
        setIsLoadingLoans(false);
      }
    };

    if (user && isAdmin) {
      fetchLoans();
    }
  }, [user, isAdmin]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin");
  };

  if (loading || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-elara-primary"></div>
        <p className="ml-3">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-elara-primary text-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">Elara Capital Admin</h1>
            <Button
              variant="outline"
              className="bg-transparent border-white text-white hover:bg-white hover:text-elara-primary"
              onClick={handleSignOut}
            >
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-6">Loan Applications</h1>

        {isLoadingLoans ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-elara-primary"></div>
          </div>
        ) : loans.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <p className="text-gray-500">No loan applications found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Purpose
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loans.map((loan) => (
                  <tr key={loan.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {loan.id.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      KSh {loan.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {loan.purpose.length > 30
                        ? loan.purpose.substring(0, 30) + "..."
                        : loan.purpose}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(loan.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/admin/loans/${loan.id}`}
                        className="text-elara-primary hover:text-elara-primary/80"
                      >
                        View details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
